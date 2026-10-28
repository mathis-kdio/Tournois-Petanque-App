/**
 * Tests de la configuration de la migration UUID (integer → UUID v7).
 *
 * Garde-fous de non-régression (revue sync, point 5 — les tests du moteur
 * mockent Drizzle et ne peuvent pas détecter ces régressions) :
 *  - chaque table déclarant des FK (fkMappings) doit recréer les
 *    contraintes REFERENCES dans sa définition _v2, à l'image du schéma
 *    Drizzle — sinon l'intégrité référentielle est perdue après migration ;
 *  - les tables référencées doivent être déclarées AVANT leurs enfants
 *    (les _v2 sont créées dans l'ordre du tableau).
 *
 * NOTE : ces tests valident la configuration déclarative. L'exécution réelle
 * (expo-sqlite) ne peut pas être exécutée sous Jest — pas de driver SQLite
 * natif disponible — la vérification en conditions réelles reste à faire sur
 * appareil (migration d'une base contenant des données).
 */

import { TABLES } from './uuidMigrationTables';

describe('uuidMigrationTables', () => {
  it('chaque table avec fkMappings déclare ses contraintes REFERENCES', () => {
    for (const table of TABLES) {
      const fkColumns = Object.keys(table.fkMappings);
      if (fkColumns.length === 0) continue;

      for (const column of fkColumns) {
        const parent = table.fkMappings[column];
        // la colonne doit référencer parent(id), comme le schéma Drizzle
        expect(table.v2Columns).toContain(
          `REFERENCES \`${parent}\`(\`id\`)`,
        );
      }
    }
  });

  it('les tables référencées sont déclarées avant leurs enfants', () => {
    const declared = new Set<string>();

    for (const table of TABLES) {
      for (const parent of Object.values(table.fkMappings)) {
        // le parent doit être déclaré avant l'enfant qui le référence
        expect(declared.has(parent)).toBe(true);
      }
      declared.add(table.name);
    }
  });

  it('les colonnes FK non nulles du schéma sont NOT NULL dans les _v2', () => {
    // Miroir des nullabilités du schéma Drizzle : match.terrain_id est le
    // seul nullable ; toutes les autres FK sont NOT NULL.
    for (const table of TABLES) {
      for (const column of Object.keys(table.fkMappings)) {
        const definition = table.v2Columns;
        const columnDef = definition
          .split(', ')
          .find((c) => c.startsWith(`\`${column}\``));
        expect(columnDef).toBeDefined();

        const isNullable = table.name === 'match' && column === 'terrain_id';
        if (isNullable) {
          expect(columnDef).not.toContain('NOT NULL');
        } else {
          expect(columnDef).toContain('NOT NULL');
        }
      }
    }
  });
});
