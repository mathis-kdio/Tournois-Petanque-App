import { uuidv7 } from '@/utils/uuid/uuidv7';
import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Migration programmatique : conversion des clés primaires `integer` → UUID v7 `text`
 * et ajout des colonnes de synchronisation (`synced`, `updated_at`, `deleted`) sur
 * toutes les tables, plus création de la table `sync_state`.
 *
 * SQLite ne permet pas de modifier le type d'une colonne PRIMARY KEY en place ;
 * on crée donc des tables `_v2`, on y copie les données en générant un UUID v7 par
 * ligne, on réécrit les FK via une table de mapping, puis on remplace les tables
 * originales.
 *
 * Idempotente : si les tables ont déjà des IDs `text`, la migration est ignorée.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

interface TableMigration {
  /** Nom de la table originale (ex. "joueurs"). */
  name: string;
  /** Définition CREATE TABLE de la version _v2 (sans le nom). */
  v2Columns: string;
  /** Index supplémentaires à recréer sur la table _v2. */
  indexes?: string[];
  /** Colonnes non-FK à copier telles quelles (noms SQL exacts). */
  dataColumns: string[];
  /** FK à mapper : { colonneSource: nomTableParent }. */
  fkMappings: Record<string, string>;
  /** La table avait-elle déjà une colonne `updated_at` ? */
  hadUpdatedAt: boolean;
}

// ─── Configuration des tables (ordre parents → enfants) ───────────────────────

const TABLES: TableMigration[] = [
  {
    name: 'joueurs',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`joueur_id` integer NOT NULL',
      '`name` text NOT NULL',
      '`type` text',
      '`equipe` integer',
      '`isChecked` integer DEFAULT false',
      '`synced` integer DEFAULT 0 NOT NULL',
      '`updated_at` integer NOT NULL',
      '`deleted` integer DEFAULT 0 NOT NULL',
    ].join(', '),
    dataColumns: ['joueur_id', 'name', 'type', 'equipe', 'isChecked'],
    fkMappings: {},
    hadUpdatedAt: false,
  },
  {
    name: 'joueurs_suggestion',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`name` text NOT NULL',
      '`occurence` integer NOT NULL',
      '`cacher` integer DEFAULT false',
      '`synced` integer DEFAULT 0 NOT NULL',
      '`updated_at` integer NOT NULL',
      '`deleted` integer DEFAULT 0 NOT NULL',
    ].join(', '),
    indexes: [
      'CREATE UNIQUE INDEX `nameUniqueIndex_v2` ON `joueurs_suggestion_v2` (`name`)',
    ],
    dataColumns: ['name', 'occurence', 'cacher'],
    fkMappings: {},
    hadUpdatedAt: false,
  },
  {
    name: 'listes_joueurs',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`name` text',
      '`synced` integer DEFAULT 0 NOT NULL',
      '`updated_at` integer NOT NULL',
      '`deleted` integer DEFAULT 0 NOT NULL',
    ].join(', '),
    dataColumns: ['name'],
    fkMappings: {},
    hadUpdatedAt: true,
  },
  {
    name: 'terrains',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`name` text NOT NULL',
      '`synced` integer DEFAULT 0 NOT NULL',
      '`updated_at` integer NOT NULL',
      '`deleted` integer DEFAULT 0 NOT NULL',
    ].join(', '),
    dataColumns: ['name'],
    fkMappings: {},
    hadUpdatedAt: true,
  },
  {
    name: 'preparation_tournoi',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`nbTours` integer',
      '`nbPtVictoire` integer',
      '`speciauxIncompatibles` integer',
      '`memesEquipes` integer',
      '`memesAdversaires` integer',
      '`typeTournoi` text',
      '`typeEquipes` text',
      '`mode` text',
      '`modeCreationEquipes` text',
      '`complement` text',
      '`avecTerrains` integer DEFAULT false NOT NULL',
    ].join(', '),
    dataColumns: [
      'nbTours',
      'nbPtVictoire',
      'speciauxIncompatibles',
      'memesEquipes',
      'memesAdversaires',
      'typeTournoi',
      'typeEquipes',
      'mode',
      'modeCreationEquipes',
      'complement',
      'avecTerrains',
    ],
    fkMappings: {},
    hadUpdatedAt: false,
  },
  {
    name: 'tournoi',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`name` text NOT NULL',
      '`nbTours` integer NOT NULL',
      '`nbMatchs` integer NOT NULL',
      '`nbPtVictoire` integer NOT NULL',
      '`speciauxIncompatibles` integer NOT NULL',
      '`memesEquipes` integer NOT NULL',
      '`memesAdversaires` integer NOT NULL',
      '`typeEquipes` text NOT NULL',
      '`typeTournoi` text NOT NULL',
      '`avecTerrains` integer NOT NULL',
      '`mode` text NOT NULL',
      '`estTournoiActuel` integer NOT NULL',
      '`create_at` integer NOT NULL',
      '`updated_at` integer NOT NULL',
      '`synced` integer DEFAULT 0 NOT NULL',
      '`deleted` integer DEFAULT 0 NOT NULL',
    ].join(', '),
    dataColumns: [
      'name',
      'nbTours',
      'nbMatchs',
      'nbPtVictoire',
      'speciauxIncompatibles',
      'memesEquipes',
      'memesAdversaires',
      'typeEquipes',
      'typeTournoi',
      'avecTerrains',
      'mode',
      'estTournoiActuel',
      'create_at',
    ],
    fkMappings: {},
    hadUpdatedAt: true,
  },
  {
    name: 'equipe',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`equipe_id` integer NOT NULL',
      '`synced` integer DEFAULT 0 NOT NULL',
      '`updated_at` integer NOT NULL',
      '`deleted` integer DEFAULT 0 NOT NULL',
    ].join(', '),
    dataColumns: ['equipe_id'],
    fkMappings: {},
    hadUpdatedAt: true,
  },
  {
    name: 'equipes_joueurs',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`joueur_id` text NOT NULL',
      '`equipe_id` text NOT NULL',
      '`synced` integer DEFAULT 0 NOT NULL',
      '`updated_at` integer NOT NULL',
      '`deleted` integer DEFAULT 0 NOT NULL',
    ].join(', '),
    dataColumns: [],
    fkMappings: { joueur_id: 'joueurs', equipe_id: 'equipe' },
    hadUpdatedAt: false,
  },
  {
    name: 'joueurs_listes',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`joueur_id` text NOT NULL',
      '`liste_id` text NOT NULL',
      '`synced` integer DEFAULT 0 NOT NULL',
      '`updated_at` integer NOT NULL',
      '`deleted` integer DEFAULT 0 NOT NULL',
    ].join(', '),
    dataColumns: [],
    fkMappings: { joueur_id: 'joueurs', liste_id: 'listes_joueurs' },
    hadUpdatedAt: false,
  },
  {
    name: 'joueurs_preparation_tournois',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`joueur_id` text NOT NULL',
      '`preparation_tournoi_id` text NOT NULL',
    ].join(', '),
    dataColumns: [],
    fkMappings: {
      joueur_id: 'joueurs',
      preparation_tournoi_id: 'preparation_tournoi',
    },
    hadUpdatedAt: false,
  },
  {
    name: 'terrains_preparation_tournois',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`terrain_id` text NOT NULL',
      '`preparation_tournoi_id` text NOT NULL',
    ].join(', '),
    dataColumns: [],
    fkMappings: {
      terrain_id: 'terrains',
      preparation_tournoi_id: 'preparation_tournoi',
    },
    hadUpdatedAt: false,
  },
  {
    name: 'match',
    v2Columns: [
      '`id` text PRIMARY KEY NOT NULL',
      '`match_id` integer NOT NULL',
      '`tournoi_id` text NOT NULL',
      '`tour_id` integer NOT NULL',
      '`tour_name` text',
      '`equipe1_id` text NOT NULL',
      '`equipe2_id` text NOT NULL',
      '`score1` integer',
      '`score2` integer',
      '`terrain_id` text',
      '`synced` integer DEFAULT 0 NOT NULL',
      '`updated_at` integer NOT NULL',
      '`deleted` integer DEFAULT 0 NOT NULL',
    ].join(', '),
    dataColumns: ['match_id', 'tour_id', 'tour_name', 'score1', 'score2'],
    fkMappings: {
      tournoi_id: 'tournoi',
      equipe1_id: 'equipe',
      equipe2_id: 'equipe',
      terrain_id: 'terrains',
    },
    hadUpdatedAt: true,
  },
];

// ─── Utilitaires ──────────────────────────────────────────────────────────────

/**
 * Vérifie si la migration UUID a déjà été appliquée en inspectant le type
 * de la colonne `id` de la table `joueurs`.
 */
async function isUuidMigrationDone(db: SQLiteDatabase): Promise<boolean> {
  try {
    const columns = await db.getAllAsync<{ name: string; type: string }>(
      `PRAGMA table_info(joueurs);`,
    );
    const idCol = columns.find((c) => c.name === 'id');
    return idCol?.type?.toUpperCase() === 'TEXT';
  } catch {
    return false;
  }
}

// ─── Migration principale ─────────────────────────────────────────────────────

export async function runUuidMigration(db: SQLiteDatabase): Promise<void> {
  if (await isUuidMigrationDone(db)) {
    return; // déjà migré
  }

  const now = Date.now();

  await db.withTransactionAsync(async () => {
    await db.execAsync('PRAGMA foreign_keys = OFF;');

    // 1. Créer la table de mapping
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS \`id_mapping\` (
        \`table_name\` text NOT NULL,
        \`old_id\` text NOT NULL,
        \`new_id\` text NOT NULL,
        PRIMARY KEY (\`table_name\`, \`old_id\`)
      );
    `);

    // 2. Pour chaque table (parents d'abord), créer _v2 et copier
    for (const table of TABLES) {
      const v2Name = `${table.name}_v2`;

      // Créer la table _v2
      await db.execAsync(`CREATE TABLE \`${v2Name}\` (${table.v2Columns});`);

      // Recréer les index
      if (table.indexes) {
        for (const idx of table.indexes) {
          await db.execAsync(idx);
        }
      }

      // Lire les anciennes lignes
      const oldRows = await db.getAllAsync<Record<string, any>>(
        `SELECT * FROM \`${table.name}\`;`,
      );

      if (oldRows.length === 0) {
        continue;
      }

      // Construire la liste des colonnes à insérer
      const insertColumns = ['id', ...table.dataColumns];
      const fkColumns = Object.keys(table.fkMappings);
      insertColumns.push(...fkColumns);

      // Inclure updated_at uniquement si la table _v2 en a une colonne.
      // Les tables non-synchronisées (preparation_tournoi, *_preparation_tournois)
      // n'ont pas de colonnes synced/updated_at/deleted.
      const v2HasUpdatedAt = table.v2Columns.includes('updated_at');
      if (v2HasUpdatedAt) {
        insertColumns.push('updated_at');
      }

      // synced et deleted ne sont pas insérés explicitement : ils ont tous deux
      // DEFAULT NOT NULL dans la table _v2, la valeur par défaut est donc appliquée.

      for (const row of oldRows) {
        const newId = uuidv7();

        // Stocker le mapping old_id → new_id
        await db.runAsync(
          `INSERT INTO \`id_mapping\` (table_name, old_id, new_id) VALUES (?, ?, ?);`,
          [table.name, String(row.id), newId],
        );

        // Construire les valeurs
        const values: any[] = [newId];

        // Colonnes data (copie directe)
        for (const col of table.dataColumns) {
          values.push(row[col] ?? null);
        }

        // Colonnes FK (mapper old_id → new_id)
        for (const fkCol of fkColumns) {
          const parentTable = table.fkMappings[fkCol];
          const oldFkValue = row[fkCol];
          if (oldFkValue === null || oldFkValue === undefined) {
            values.push(null);
          } else {
            const mapped = await db.getAllAsync<{ new_id: string }>(
              `SELECT new_id FROM \`id_mapping\` WHERE table_name = ? AND old_id = ?;`,
              [parentTable, String(oldFkValue)],
            );
            values.push(mapped[0]?.new_id ?? null);
          }
        }

        // updated_at : copier la valeur existante si la table l'avait, sinon `now`.
        // Uniquement pour les tables dont la v2 a une colonne updated_at.
        if (v2HasUpdatedAt) {
          if (table.hadUpdatedAt && row['updated_at'] != null) {
            values.push(row['updated_at']);
          } else {
            values.push(now);
          }
        }

        // Construire la requête INSERT
        const placeholders = values.map(() => '?').join(', ');
        const colList = insertColumns.map((c) => `\`${c}\``).join(', ');
        await db.runAsync(
          `INSERT INTO \`${v2Name}\` (${colList}) VALUES (${placeholders});`,
          values,
        );
      }
    }

    // 3. Supprimer les anciennes tables et renommer les _v2
    for (const table of TABLES) {
      await db.execAsync(`DROP TABLE IF EXISTS \`${table.name}\`;`);
      await db.execAsync(
        `ALTER TABLE \`${table.name}_v2\` RENAME TO \`${table.name}\`;`,
      );
    }

    // 4. Renommer l'index unique de joueurs_suggestion si nécessaire
    await db.execAsync(`DROP INDEX IF EXISTS \`nameUniqueIndex_v2\`;`);
    await db.execAsync(
      `CREATE UNIQUE INDEX IF NOT EXISTS \`nameUniqueIndex\` ON \`joueurs_suggestion\` (\`name\`);`,
    );

    // 5. Supprimer la table de mapping
    await db.execAsync(`DROP TABLE IF EXISTS \`id_mapping\`;`);

    // 6. Créer la table sync_state
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS \`sync_state\` (
        \`user_id\` text PRIMARY KEY NOT NULL,
        \`last_pulled_at\` integer,
        \`clock_offset\` integer,
        \`purged_at\` integer
      );
    `);

    await db.execAsync('PRAGMA foreign_keys = ON;');
  });
}
