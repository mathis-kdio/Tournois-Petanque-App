/**
 * Moteur de synchronisation SQLite ↔ Supabase.
 *
 * Responsabilités :
 *  - push() : lit l'outbox (synced = false), upsert par batch vers Postgres,
 *    marque synced = true en cas de succès ;
 *  - pull() : lit les lignes distantes depuis le curseur server_updated_at,
 *    applique LWW localement, met à jour le curseur ;
 *  - verrou (mutex) : un seul push/pull/cycle à la fois ;
 *  - clockOffset : décalage horloge serveur/locales stocké dans sync_state.
 *
 * Le moteur ne dépend pas de React — il est purement logique et testable
 * avec une base sqlite in-memory et un mock de supabase-js.
 */

import {
  equipe,
  equipesJoueurs,
  joueurs,
  joueursListes,
  joueursSuggestion,
  listesJoueurs,
  match,
  syncState,
  terrains,
  tournoi,
} from '@/db/schema';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { supabaseClient } from '@/utils/supabase';
import { eq, inArray, sql } from 'drizzle-orm';
import { SYNC_MAPPERS } from './syncMappers';
import { PULL_ORDER, PUSH_ORDER, type SyncTableName } from './syncTables';

// ─── Tables Drizzle par nom ──────────────────────────────────────────────────

const TABLES_BY_NAME: Record<SyncTableName, any> = {
  joueurs_suggestion: joueursSuggestion,
  joueurs,
  listes_joueurs: listesJoueurs,
  terrains,
  tournoi,
  joueurs_listes: joueursListes,
  equipe,
  equipes_joueurs: equipesJoueurs,
  match,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SyncResult {
  pushed: number;
  pulled: number;
  errors: string[];
}

export interface SyncEngineOptions {
  /** ID du compte Supabase (auth.uid()). */
  userId: string;
  /** Taille des batchs d'upsert et des pages de pull. */
  batchSize?: number;
  /** Nombre max de tentatives par batch en cas d'échec. */
  maxRetries?: number;
}

/** Connexion Drizzle ou transaction ouverte (pull). */
type DbOrTx = any;

// ─── Verrou (mutex) ───────────────────────────────────────────────────────────

let isSyncing = false;

export function isSyncRunning(): boolean {
  return isSyncing;
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────

/** Découpe un tableau en chunks. */
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/** Backoff exponentiel : 2^attempt secondes, plafonné à 30 s. */
function backoffDelay(attempt: number): number {
  return Math.min(1000 * 2 ** attempt, 30_000);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Message d'erreur lisible (Error JS ou PostgrestError qui a juste .message). */
function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  return String(err);
}

// ─── sync_state helpers ──────────────────────────────────────────────────────

function getSyncStateRow(dbOrTx: DbOrTx, userId: string) {
  return dbOrTx
    .select()
    .from(syncState)
    .where(eq(syncState.userId, userId))
    .then((rows: any[]) => rows[0] ?? null);
}

async function upsertSyncState(
  dbOrTx: DbOrTx,
  userId: string,
  values: { lastPulledAt?: number | null; clockOffset?: number | null },
) {
  const existing = await getSyncStateRow(dbOrTx, userId);
  if (existing) {
    await dbOrTx
      .update(syncState)
      .set(values)
      .where(eq(syncState.userId, userId));
  } else {
    await dbOrTx.insert(syncState).values({ userId, ...values });
  }
}

// ─── Push ────────────────────────────────────────────────────────────────────

/**
 * Pousse les lignes non synchronisées vers Supabase.
 * Verrouillé par le même mutex que syncCycle : retourne immédiatement si une
 * opération de sync est déjà en cours.
 */
export async function push(
  options: SyncEngineOptions,
): Promise<{ pushed: number; errors: string[] }> {
  if (isSyncing) {
    return { pushed: 0, errors: ['Sync already running'] };
  }
  isSyncing = true;
  try {
    return await runPush(options);
  } finally {
    isSyncing = false;
  }
}

/**
 * Implémentation du push (sans verrou — appelée par push() et syncCycle()
 * qui détiennent déjà le mutex).
 *
 * Pour chaque table dans PUSH_ORDER :
 *  1. select where synced = false (tombstones incluses) ;
 *  2. mapping SQLite → Postgres (ajout user_id) ;
 *  3. upsert par batch (chunks de ~200, onConflict user_id,id) ;
 *  4. succès → update synced = true localement ;
 *  5. échec → retry avec backoff exponentiel (max maxRetries tentatives).
 */
async function runPush(
  options: SyncEngineOptions,
): Promise<{ pushed: number; errors: string[] }> {
  const { userId, batchSize = 200, maxRetries = 5 } = options;
  const db = getDrizzleDb();
  let pushed = 0;
  const errors: string[] = [];

  for (const tableName of PUSH_ORDER) {
    const mapper = SYNC_MAPPERS[tableName];
    const table = TABLES_BY_NAME[tableName];

    // Sélectionner les lignes non sync (synced = false)
    // Les tombstones (deleted = true, synced = false) doivent aussi être push
    const unsyncedRows = await db
      .select()
      .from(table)
      .where(eq(table.synced, false));

    if (unsyncedRows.length === 0) continue;

    const batches = chunk(unsyncedRows, batchSize);

    for (const batch of batches) {
      const pgRows = batch.map((row) => mapper.toPostgres(row as any, userId));
      let success = false;

      for (let attempt = 0; attempt < maxRetries && !success; attempt++) {
        try {
          const { error } = await supabaseClient
            .from(mapper.pgTable)
            .upsert(pgRows, {
              onConflict: 'user_id,id',
              ignoreDuplicates: false,
            });

          if (error) throw error;

          success = true;
        } catch (err) {
          if (attempt < maxRetries - 1) {
            await sleep(backoffDelay(attempt));
          } else {
            errors.push(`Push ${tableName}: ${errorMessage(err)}`);
          }
        }
      }

      if (success) {
        const ids = batch.map((r) => r.id);
        await db
          .update(table)
          .set({ synced: true })
          .where(inArray(table.id, ids));
        pushed += batch.length;
      }
    }
  }

  return { pushed, errors };
}

// ─── Pull ────────────────────────────────────────────────────────────────────

/**
 * Récupère les modifications distantes et les applique localement.
 * Verrouillé par le même mutex que syncCycle.
 *
 * Deux phases :
 *  1. fetch réseau : chaque table est lue par pages (.range()) depuis le
 *     curseur last_pulled_at, sans aucune écriture locale. En cas d'erreur,
 *     on n'applique rien et le curseur n'avance pas (retentente au cycle
 *     suivant) ;
 *  2. application locale : toutes les écritures (insert / update / delete
 *     LWW) et le nouveau curseur sont commités dans UNE SEULE transaction
 *     SQLite — pas de perte de curseur ni de trous en cas de crash.
 *
 * LWW : si updated_at distant (corrigé du clockOffset) > updated_at local
 * OU ligne locale synced = true → écraser ; sinon ignorer.
 * Tombstone distante → delete local physique si ligne locale sync, sinon
 * conserver (l'écriture locale non sync gagne).
 */
export async function pull(
  options: SyncEngineOptions,
): Promise<{ pulled: number; errors: string[] }> {
  if (isSyncing) {
    return { pulled: 0, errors: ['Sync already running'] };
  }
  isSyncing = true;
  try {
    return await runPull(options);
  } finally {
    isSyncing = false;
  }
}

/**
 * Implémentation du pull (sans verrou — appelée par pull() et syncCycle()
 * qui détiennent déjà le mutex).
 */
async function runPull(
  options: SyncEngineOptions,
): Promise<{ pulled: number; errors: string[] }> {
  const { userId, batchSize = 200 } = options;
  const db = getDrizzleDb();
  const errors: string[] = [];

  const stateRow = await getSyncStateRow(db, userId);
  const lastPulledAt = stateRow?.lastPulledAt ?? 0;
  const clockOffset = stateRow?.clockOffset ?? 0;

  // ─── Phase 1 : fetch réseau, bufférisé, aucune écriture ────────────────────
  const fetched: { tableName: SyncTableName; rows: any[] }[] = [];
  let newCursor = lastPulledAt;

  for (const tableName of PULL_ORDER) {
    const mapper = SYNC_MAPPERS[tableName];
    const rows: any[] = [];

    let offset = 0;
    let hasMore = true;

    try {
      while (hasMore) {
        const { data, error } = await supabaseClient
          .from(mapper.pgTable)
          .select('*')
          .gt('server_updated_at', new Date(lastPulledAt).toISOString())
          .range(offset, offset + batchSize - 1);

        if (error) throw error;

        const remoteRows = data ?? [];
        rows.push(...remoteRows);
        hasMore = remoteRows.length === batchSize;
        offset += remoteRows.length;
      }
    } catch (err) {
      // Tout ou rien : on n'applique rien, le curseur n'avance pas.
      errors.push(`Pull ${tableName}: ${errorMessage(err)}`);
      return { pulled: 0, errors };
    }

    for (const remoteRow of rows) {
      const serverUpdatedAt = new Date(remoteRow.server_updated_at).getTime();
      if (serverUpdatedAt > newCursor) {
        newCursor = serverUpdatedAt;
      }
    }

    if (rows.length > 0) {
      fetched.push({ tableName, rows });
    }
  }

  // ─── Phase 2 : application locale + curseur, une seule transaction ────────
  if (fetched.length === 0) {
    return { pulled: 0, errors };
  }

  // Le driver expo-sqlite de Drizzle n'accepte que des transactions
  // synchrones (DrizzleTypeError sinon) ; on pilote donc BEGIN/COMMIT
  // directement sur la même connexion — les écritures et le curseur sont
  // commités ensemble (§3.3.4), sur mobile comme sur le proxy web.
  let applied = 0;

  try {
    await db.run(sql`BEGIN`);

    for (const { tableName, rows } of fetched) {
      const mapper = SYNC_MAPPERS[tableName];
      const table = TABLES_BY_NAME[tableName];

      for (const remoteRow of rows) {
        const isTombstone = remoteRow.deleted_at != null;
        const sqliteRow = mapper.fromPostgres(remoteRow);

        // Vérifier si la ligne existe localement
        const localRows = await db
          .select()
          .from(table)
          .where(eq(table.id, remoteRow.id));
        const localRow = localRows[0];

        if (isTombstone) {
          // Tombstone distante
          if (localRow && localRow.synced) {
            // Ligne locale sync → delete physique
            await db.delete(table).where(eq(table.id, remoteRow.id));
            applied++;
          }
          // Si localRow non sync → conserver (l'écriture locale gagne)
          continue;
        }

        if (!localRow) {
          // Absente localement → insert
          await db.insert(table).values(sqliteRow as any);
          applied++;
        } else {
          // Présente localement → LWW
          const remoteUpdatedAtCorrected =
            new Date(remoteRow.updated_at).getTime() + clockOffset;
          const localUpdatedAt = new Date(localRow.updatedAt).getTime();

          if (remoteUpdatedAtCorrected > localUpdatedAt || localRow.synced) {
            // Écraser la ligne locale
            await db
              .update(table)
              .set(sqliteRow as any)
              .where(eq(table.id, remoteRow.id));
            applied++;
          }
          // Sinon : ignorer (la ligne locale synced = false sera poussée)
        }
      }
    }

    // Curseur commité dans la même transaction que les écritures (§3.3.4)
    if (newCursor > lastPulledAt) {
      await upsertSyncState(db, userId, { lastPulledAt: newCursor });
    }

    await db.run(sql`COMMIT`);
  } catch (err) {
    try {
      await db.run(sql`ROLLBACK`);
    } catch {
      // La transaction est déjà fermée — rien à annuler.
    }
    errors.push(`Pull apply: ${errorMessage(err)}`);
    return { pulled: 0, errors };
  }

  return { pulled: applied, errors };
}

// ─── Cycle complet ───────────────────────────────────────────────────────────

/**
 * Exécute un cycle complet : pull() puis push().
 * Verrouillé par mutex — retourne immédiatement si un cycle est déjà en cours.
 */
export async function syncCycle(
  options: SyncEngineOptions,
): Promise<SyncResult> {
  if (isSyncing) {
    return { pushed: 0, pulled: 0, errors: ['Sync already running'] };
  }

  isSyncing = true;
  try {
    const pullResult = await runPull(options);
    const pushResult = await runPush(options);

    return {
      pushed: pushResult.pushed,
      pulled: pullResult.pulled,
      errors: [...pullResult.errors, ...pushResult.errors],
    };
  } finally {
    isSyncing = false;
  }
}

// ─── clockOffset ─────────────────────────────────────────────────────────────

/**
 * Met à jour le clockOffset en comparant l'horloge serveur à l'horloge locale.
 * Appelé après chaque cycle de sync réussi.
 *
 * `public.now()` (migration Supabase 0002) renvoie un timestamptz scalaire :
 * PostgREST le renvoie directement en JSON, sans enveloppe ni tableau —
 * pas de `.single()` à appliquer.
 */
export async function updateClockOffset(userId: string): Promise<void> {
  try {
    const { data, error } = await supabaseClient.rpc('now');

    if (error || !data) return;

    const serverNow = new Date(data as string).getTime();
    const localNow = Date.now();
    const offset = serverNow - localNow;

    await upsertSyncState(getDrizzleDb(), userId, { clockOffset: offset });
  } catch (err) {
    // Non critique pour la synchro (le LWW serveur reste l'arbitre final),
    // mais on ne masque plus silencieusement l'échec : sans offset, le LWW
    // local se dégrade sur des horloges décalées.
    console.warn(`[sync] updateClockOffset échoué: ${errorMessage(err)}`);
  }
}

// ─── Outbox helpers ─────────────────────────────────────────────────────────

/**
 * Compte les lignes non synchronisées (outbox).
 * Utilisé par syncAccount (phase 4) pour vérifier si le logout est sûr.
 */
export async function countUnsynced(): Promise<number> {
  const db = getDrizzleDb();
  let total = 0;

  for (const tableName of PUSH_ORDER) {
    const table = TABLES_BY_NAME[tableName];
    const rows = await db
      .select({ count: sql<number>`count(*)` })
      .from(table)
      .where(eq(table.synced, false));
    total += Number(rows[0]?.count ?? 0);
  }

  return total;
}

/**
 * Vérifie si l'outbox est vide (toutes les lignes sont synced).
 */
export async function isOutboxEmpty(): Promise<boolean> {
  return (await countUnsynced()) === 0;
}
