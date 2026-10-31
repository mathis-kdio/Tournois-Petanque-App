/**
 * Moteur de synchronisation SQLite ↔ Supabase.
 *
 * Responsabilités :
 *  - push() : lit l'outbox (synced = false), upsert par batch vers Postgres,
 *    marque synced = true en cas de succès ;
 *  - pull() : lit les lignes distantes depuis le curseur server_updated_at,
 *    applique LWW localement, met à jour le curseur ;
 *  - verrou (mutex) : un seul push/pull/cycle à la fois ;
 *  - clockOffset : décalage horloge serveur/locales stocké dans sync_state ;
 *  - purge des tombstones locales : delete physique des soft-deletes de plus
 *    de 30 jours déjà poussées, à la fin de chaque cycle complet.
 *
 * Le moteur ne dépend pas de React — il est purement logique et testable
 * avec une base sqlite in-memory et un mock de supabase-js.
 */

import { joueursSuggestion, syncState } from '@/db/schema';
import { getDrizzleDb } from '@/db/useDatabaseMigrations';
import { supabaseClient } from '@/utils/supabase';
import {
  runInBulkTransaction,
  withForeignKeysDisabled,
} from '@/db/sync/localTransaction';
import { and, eq, inArray, lt, sql } from 'drizzle-orm';
import {
  PULL_ORDER,
  PUSH_ORDER,
  SYNC_TABLES,
  type SyncTableName,
} from './syncTables';

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

/** Délai après lequel un verrou est considéré comme périmé (2 minutes). */
const SYNC_LOCK_TIMEOUT_MS = 120_000;

let isSyncing = false;
let syncStartedAt = 0;

export function isSyncRunning(): boolean {
  if (isSyncing && Date.now() - syncStartedAt > SYNC_LOCK_TIMEOUT_MS) {
    // Verrou périmé (crash sans finally) : le libérer.
    isSyncing = false;
  }
  return isSyncing;
}

/** Acquiert le mutex. Retourne false si déjà verrouillé (ou verrou actif). */
function acquireLock(): boolean {
  if (isSyncRunning()) return false;
  isSyncing = true;
  syncStartedAt = Date.now();
  return true;
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

/** Upsert de la ligne sync_state en UNE requête (INSERT ... ON CONFLICT DO UPDATE). */
async function upsertSyncState(
  dbOrTx: DbOrTx,
  userId: string,
  values: { lastPulledAt?: number | null; clockOffset?: number | null },
) {
  await dbOrTx
    .insert(syncState)
    .values({ userId, ...values })
    .onConflictDoUpdate({
      target: syncState.userId,
      set: values,
    });
}

// ─── Constantes de sync ──────────────────────────────────────────────────────

/**
 * Recul de sécurité du curseur de pull. Une ligne poussée par un autre
 * appareil juste après la lecture de sa table, mais avec un
 * server_updated_at <= max vu sur une autre table, serait sautée
 * définitivement (le curseur avance au max global). En stockant
 * max - 5 s, la fenêtre est relue au cycle suivant et réappliquée —
 * l'application LWW / tombstone est idempotente.
 */
const PULL_CURSOR_LAG_MS = 5_000;

/**
 * Âge maximal du curseur de pull au-delà duquel on force un pull COMPLET
 * (curseur remis à 0). Au-delà de la rétention des tombstones (30 jours,
 * purge pg_cron purge_old_tombstones), les suppressions distante ne sont
 * plus disponibles : un appareil revenu après 30+ jours hors ligne
 * réapparaîtrait avec ses lignes supprimées (« résurrection »). Un pull
 * complet resynchronise l'état depuis zéro.
 */
const PULL_CURSOR_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1_000;

// ─── Push ────────────────────────────────────────────────────────────────────

/**
 * Pousse les lignes non synchronisées vers Supabase.
 * Verrouillé par le même mutex que syncCycle : retourne immédiatement si une
 * opération de sync est déjà en cours.
 */
export async function push(
  options: SyncEngineOptions,
): Promise<{ pushed: number; errors: string[] }> {
  if (!acquireLock()) {
    return { pushed: 0, errors: ['Sync already running'] };
  }
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
 *  4. succès → update synced = true localement, uniquement si updatedAt
 *     est inchangé depuis la lecture (sinon l'écriture UI concurrente
 *     restera synced = false et sera repoussée) ;
 *  5. échec → retry avec backoff exponentiel (max maxRetries tentatives).
 */
async function runPush(
  options: SyncEngineOptions,
): Promise<{ pushed: number; errors: string[] }> {
  const { userId, batchSize = 200, maxRetries = 5 } = options;
  const db = getDrizzleDb();
  let pushed = 0;
  const errors: string[] = [];

  // clockOffset (serverNow - localNow) : pour comparer un timestamp serveur à
  // un updatedAt local, on ramène le local en base serveur (local + offset).
  const stateRow = await getSyncStateRow(db, userId);
  const clockOffset = stateRow?.clockOffset ?? 0;

  for (const tableName of PUSH_ORDER) {
    const mapper = SYNC_TABLES[tableName];
    const table = SYNC_TABLES[tableName].table;

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
      let pushedIds: string[] = [];

      for (
        let attempt = 0;
        attempt < maxRetries && pushedIds.length === 0;
        attempt++
      ) {
        try {
          // Upsert + relecture : le trigger LWW serveur (maintain_sync_columns)
          // peut ignorer une écriture (RETURN NULL) sans erreur PostgREST —
          // un simple { error: null } ne prouve PAS que la ligne a été écrite.
          // On ne marque synced = true que les lignes dont server_updated_at
          // a bien avancé (écriture réellement appliquée côté serveur).
          const { error } = await supabaseClient
            .from(mapper.pgTable)
            .upsert(pgRows, {
              onConflict: 'user_id,id',
              ignoreDuplicates: false,
            });

          if (error) throw error;

          const batchIds = batch.map((row) => row.id as string);
          const { data: appliedRows, error: selectError } = await supabaseClient
            .from(mapper.pgTable)
            .select('id, server_updated_at, updated_at')
            .in('id', batchIds);

          if (selectError) throw selectError;

          const appliedById = new Map(
            (appliedRows ?? []).map((r: any) => [
              r.id as string,
              {
                serverAt: new Date(r.server_updated_at).getTime(),
                remoteUpdatedAt: new Date(r.updated_at).getTime(),
              },
            ]),
          );
          // On marque synced=true si :
          //  (a) le serveur a appliqué notre écriture : server_updated_at a
          //      avancé au-delà de notre updatedAt ramené en base serveur
          //      (local + clockOffset, tolérance 1 s) — couvre le clamp serveur
          //      des horloges locales en avance (updated_at = now() serveur) ;
          //  (b) le serveur détient une version strictement plus récente
          //      (updated_at distante > notre updatedAt corrigé) : l'écriture
          //      locale a perdu au LWW et sera écrasée au prochain pull de
          //      toute façon — marquer synced évite de bloquer l'outbox (et le
          //      logout) indéfiniment sur une ligne que le serveur refusera
          //      toujours.
          const ids: string[] = [];
          for (const row of batch) {
            const applied = appliedById.get(row.id as string);
            if (!applied) continue;
            const localInServerTime =
              new Date(row.updatedAt as Date).getTime() + clockOffset;
            if (
              applied.serverAt >= localInServerTime - 1_000 ||
              applied.remoteUpdatedAt > localInServerTime
            ) {
              ids.push(row.id as string);
            }
          }
          pushedIds = ids;
        } catch (err) {
          if (attempt < maxRetries - 1) {
            await sleep(backoffDelay(attempt));
          } else {
            errors.push(`Push ${tableName}: ${errorMessage(err)}`);
          }
        }
      }

      if (pushedIds.length > 0) {
        // Marquer synced uniquement si la ligne n'a pas été réécrite par
        // l'UI entre le select du batch et maintenant : une écriture
        // concurrente pose synced = false + nouvel updatedAt — le where
        // ne matche alors pas et la nouvelle version sera repoussée au
        // prochain cycle (sinon elle serait marquée sync sans avoir été
        // poussée, puis écrasée par un pull avec des données plus
        // anciennes).
        const pushedIdSet = new Set(pushedIds);
        for (const row of batch) {
          if (!pushedIdSet.has(row.id as string)) continue;
          await db
            .update(table)
            .set({ synced: true })
            .where(
              and(eq(table.id, row.id), eq(table.updatedAt, row.updatedAt)),
            );
        }
        pushed += pushedIds.length;
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
 * Tombstone distante → conversion en tombstone locale (deleted = true,
 * synced = true) si la ligne locale est sync — pas de delete physique ici,
 * les enfants éventuels gardent un parent référençable ; la purge 30 jours
 * fera le delete physique. Ligne locale non sync → conserver (l'écriture
 * locale gagne).
 */
export async function pull(
  options: SyncEngineOptions,
): Promise<{ pulled: number; errors: string[] }> {
  if (!acquireLock()) {
    return { pulled: 0, errors: ['Sync already running'] };
  }
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
  // Curseur trop vieux (> rétention des tombstones) → pull complet :
  // les suppressions des 30 derniers jours ne sont plus récupérables,
  // repartir de zéro évite de ressusciter des lignes supprimées ailleurs.
  const storedPulledAt = stateRow?.lastPulledAt ?? 0;
  const cursorTooOld =
    storedPulledAt > 0 && Date.now() - storedPulledAt > PULL_CURSOR_MAX_AGE_MS;
  const lastPulledAt = cursorTooOld ? 0 : storedPulledAt;
  const clockOffset = stateRow?.clockOffset ?? 0;

  // ─── Phase 1 : fetch réseau, bufférisé, aucune écriture ────────────────────
  // Fetch dans le même ordre que l'application (PUSH_ORDER) : les lectures
  // réseau sont indépendantes par table, l'ordre de fetch n'a pas d'importance.
  const fetched: { tableName: SyncTableName; rows: any[] }[] = [];
  let newCursor = lastPulledAt;

  for (const tableName of PUSH_ORDER) {
    const mapper = SYNC_TABLES[tableName];
    const rows: any[] = [];

    let offset = 0;
    let hasMore = true;

    try {
      while (hasMore) {
        const { data, error } = await supabaseClient
          .from(mapper.pgTable)
          .select('*')
          .gt('server_updated_at', new Date(lastPulledAt).toISOString())
          // Tri déterministe obligatoire : sans ORDER BY, la pagination
          // Postgres est non déterministe (lignes sautées/dupliquées
          // entre pages pendant des écritures concurrentes).
          .order('server_updated_at', { ascending: true })
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
    // Même sans ligne reçue, un pull complet forcé (curseur > 30 jours) doit
    // faire avancer le curseur stocké (base serveur : local + clockOffset) :
    // sinon, avec un compte distant vide, chaque cycle referait un pull
    // complet inutile indéfiniment.
    if (cursorTooOld) {
      await upsertSyncState(db, userId, {
        lastPulledAt: Date.now() + clockOffset,
      });
    }
    return { pulled: 0, errors };
  }

  // Le driver expo-sqlite de Drizzle n'accepte que des transactions
  // synchrones (DrizzleTypeError sinon) ; on pilote donc BEGIN/COMMIT
  // directement sur la même connexion — les écritures et le curseur sont
  // commités ensemble, sur mobile comme sur le proxy web.
  let applied = 0;

  try {
    await runInBulkTransaction(db, async () => {
      // Application dans l'ordre de fetch (PUSH_ORDER, parents d'abord) :
      // les inserts enfant référencent des parents déjà insérés dans la même
      // transaction. (Les deletes sont exclus du pull — les tombstones
      // distantes deviennent des tombstones locales, la purge 30 jours fait le
      // reste.) Les FK locales sont désactivées pour cette écriture
      // interne : le miroir distant — source de vérité — n'a pas de FK
      // inter-tables, une ligne peut référencer un parent tombstoné
      // absent localement sans que le pull soit bloqué pour autant.
      for (const { tableName, rows } of fetched) {
        const mapper = SYNC_TABLES[tableName];
        const table = SYNC_TABLES[tableName].table;

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
            if (!localRow || !localRow.synced) {
              // Absente localement → rien à convertir ; non sync →
              // l'écriture locale gagne, la ligne sera poussée.
              continue;
            }
            // Ligne locale sync → conversion en tombstone locale (miroir
            // de l'état distant). Delete physique différé à la purge 30
            // jours : les enfants éventuels gardent une FK valide.
            // Garde sur updatedAt : si l'UI a réécrit la ligne entre le
            // select local et ce update (synced repassé à false), la
            // tombstone distante ne doit pas écraser l'écriture locale.
            // Pas de lecture du nombre de lignes affectées : sur le proxy web
            // il n'existe pas, et la garde `updatedAt` fait de toute façon le
            // vrai travail (l'update qui ne matche pas = écriture UI
            // concurrente préservée).
            await db
              .update(table)
              .set(sqliteRow as any)
              .where(
                and(
                  eq(table.id, remoteRow.id),
                  eq(table.updatedAt, localRow.updatedAt),
                ),
              );
            applied++;
            continue;
          }

          // Ligne cible locale : par id, et pour joueurs_suggestion aussi par
          // name. L'index unique local nameUniqueIndex n'a pas d'équivalent
          // serveur (l'upsert distant porte sur user_id,id) : deux appareils
          // hors ligne peuvent créer la même suggestion avec des ids
          // différents, et un insert brut au pull ferait échouer toute la
          // transaction (curseur compris) à chaque cycle.
          let targetRow = localRow;
          if (!targetRow && tableName === 'joueurs_suggestion') {
            const name = (sqliteRow as { name?: unknown }).name;
            if (typeof name === 'string') {
              const sameNameRows = await db
                .select()
                .from(table)
                .where(eq(joueursSuggestion.name, name));
              targetRow = sameNameRows[0];
            }
          }

          if (!targetRow) {
            // Absente localement → insert. Pour joueurs_suggestion,
            // onConflictDoNothing sur name en garde-fou contre la course
            // entre le lookup et l'insert.
            const insertBuilder = db.insert(table).values(sqliteRow as any);
            await (tableName === 'joueurs_suggestion'
              ? (insertBuilder as any).onConflictDoNothing({
                  target: joueursSuggestion.name,
                })
              : insertBuilder);
            applied++;
          } else {
            // Présente localement → LWW
            // clockOffset = serverNow - localNow : pour convertir un timestamp
            // serveur en équivalent heure locale, il faut SOUSTRAIRE l'offset.
            const remoteUpdatedAtCorrected =
              new Date(remoteRow.updated_at).getTime() - clockOffset;
            const targetUpdatedAt = new Date(
              targetRow.updatedAt as Date,
            ).getTime();

            if (
              remoteUpdatedAtCorrected > targetUpdatedAt ||
              targetRow.synced
            ) {
              // Écraser la ligne locale (en adoptant l'id distant en cas de
              // match par name : la ligne locale devient identique à la
              // distante, plus de conflit d'unicité au cycle suivant), avec
              // garde sur updatedAt : si l'UI a
              // réécrit la ligne entre le select local et ce update, la ligne
              // a synced = false + updatedAt plus récent — le where ne matche
              // pas et la modification locale est préservée (elle sera poussée).
              await db
                .update(table)
                .set(sqliteRow as any)
                .where(
                  and(
                    eq(table.id, targetRow.id),
                    eq(table.updatedAt, targetRow.updatedAt),
                  ),
                );
              applied++;
            }
            // Sinon : ignorer (la ligne locale synced = false sera poussée)
          }
        }
      }

      // Curseur commité dans la même transaction que les écritures, avec
      // le recul de sécurité (les lignes de la fenêtre relues au prochain
      // cycle sont réappliquées — LWW idempotent).
      if (newCursor > lastPulledAt) {
        await upsertSyncState(db, userId, {
          lastPulledAt: newCursor - PULL_CURSOR_LAG_MS,
        });
      }
    });
  } catch (err) {
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
  if (!acquireLock()) {
    return { pushed: 0, pulled: 0, errors: ['Sync already running'] };
  }

  try {
    const pullResult = await runPull(options);
    const pushResult = await runPush(options);

    // Purge différée des tombstones locales (> 30 jours, déjà sync).
    // Best-effort : un échec de purge ne fait pas échouer le cycle.
    try {
      await purgeLocalTombstones();
    } catch (err) {
      console.warn(`[sync] purge des tombstones échouée: ${errorMessage(err)}`);
    }

    return {
      pushed: pushResult.pushed,
      pulled: pullResult.pulled,
      errors: [...pullResult.errors, ...pushResult.errors],
    };
  } finally {
    isSyncing = false;
  }
}

// ─── Purge des tombstones locales ──────────────────────────────────────────

/** Rétention des tombstones locales : 30 jours. */
const TOMBSTONE_RETENTION_MS = 30 * 24 * 60 * 60 * 1_000;

/**
 * Purge différée des tombstones locales : delete physique des lignes
 * `deleted = true` déjà poussées (`synced = true`) dont le soft-delete
 * (`updated_at`, horodaté par `stampForDelete()`) date de plus de 30 jours.
 *
 * Miroir local de la purge `purge_old_tombstones()` côté Supabase : la
 * tombstone a été propagée aux autres appareils au push, elle n'a plus
 * d'utilité localement. Ordre enfants d'abord (PULL_ORDER) pour ne pas
 * laisser de FK locales pendantes vers une ligne purgée.
 *
 * Les écritures ne passent pas par le writeBus (écriture interne à la
 * synchro — pas de boucle de rétroaction).
 *
 * @returns Le nombre de tombstones supprimées.
 */
export async function purgeLocalTombstones(): Promise<number> {
  const db = getDrizzleDb();
  const cutoff = new Date(Date.now() - TOMBSTONE_RETENTION_MS);
  let purged = 0;

  // FK désactivées : un parent tombstoné peut encore avoir des enfants
  // vivants non sync (l'écriture locale gagne) qui le référencent — la
  // purge ne doit pas échouer pour autant.
  await withForeignKeysDisabled(db, async () => {
    for (const tableName of PULL_ORDER) {
      const table = SYNC_TABLES[tableName].table;

      const candidates = await db
        .select({ id: table.id })
        .from(table)
        .where(
          and(
            eq(table.deleted, true),
            eq(table.synced, true),
            lt(table.updatedAt, cutoff),
          ),
        );

      if (candidates.length === 0) continue;

      await db.delete(table).where(
        inArray(
          table.id,
          candidates.map((row: any) => row.id),
        ),
      );
      purged += candidates.length;
    }
  });

  return purged;
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
    const table = SYNC_TABLES[tableName].table;
    const rows = await db
      .select({ count: sql<number>`count(*)` })
      .from(table)
      .where(eq(table.synced, false));
    total += Number(rows[0]?.count ?? 0);
  }

  return total;
}
