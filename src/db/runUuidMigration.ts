import { uuidv7 } from '@/utils/uuid/uuidv7';
import { SQLiteDatabase } from 'expo-sqlite';
import { TABLES } from './uuidMigrationTables';

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

  // PRAGMA foreign_keys est un no-op à l'intérieur d'une transaction SQLite :
  // il est appliqué hors transaction (avant le BEGIN), puis réactivé après —
  // sinon les FK resteraient actives pendant toute la migration.
  await db.execAsync('PRAGMA foreign_keys = OFF;');
  try {
    await db.withTransactionAsync(async () => {
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

      // 4. Supprimer la table de mapping
      await db.execAsync(`DROP TABLE IF EXISTS \`id_mapping\`;`);

      // 5. Créer la table sync_state
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS \`sync_state\` (
        \`user_id\` text PRIMARY KEY NOT NULL,
        \`last_pulled_at\` integer,
        \`clock_offset\` integer
      );
    `);
    });
  } finally {
    try {
      await db.execAsync('PRAGMA foreign_keys = ON;');
    } catch {
      // La réouverture de la base réactivera les FK (défaut expo-sqlite).
    }
  }
}
