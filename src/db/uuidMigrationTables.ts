/**
 * Configuration de la migration UUID (integer → UUID v7) : définition des
 * tables `_v2` recréées, dans l'ordre parents → enfants.
 *
 * Module purement déclaratif (aucune dépendance) — importable par la
 * migration ET par les tests sans charger expo-sqlite.
 *
 * Les contraintes REFERENCES reproduisent celles du schéma Drizzle
 * (`src/db/schema/*`) : les tables `_v2` remplacent les originales, elles
 * doivent donc porter les mêmes FK, sinon l'intégrité référentielle est
 * perdue après migration. Les références pointent vers les noms finaux (les
 * anciennes tables sont déposées puis les `_v2` renommées — SQLite résout
 * les FK par nom au moment des écritures, FK désactivées pendant la
 * migration).
 */

export interface TableMigration {
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

export const TABLES: TableMigration[] = [
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
      '`joueur_id` text NOT NULL REFERENCES `joueurs`(`id`)',
      '`equipe_id` text NOT NULL REFERENCES `equipe`(`id`)',
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
      '`joueur_id` text NOT NULL REFERENCES `joueurs`(`id`)',
      '`liste_id` text NOT NULL REFERENCES `listes_joueurs`(`id`)',
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
      '`joueur_id` text NOT NULL REFERENCES `joueurs`(`id`)',
      '`preparation_tournoi_id` text NOT NULL REFERENCES `preparation_tournoi`(`id`)',
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
      '`terrain_id` text NOT NULL REFERENCES `terrains`(`id`)',
      '`preparation_tournoi_id` text NOT NULL REFERENCES `preparation_tournoi`(`id`)',
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
      '`tournoi_id` text NOT NULL REFERENCES `tournoi`(`id`)',
      '`tour_id` integer NOT NULL',
      '`tour_name` text',
      '`equipe1_id` text NOT NULL REFERENCES `equipe`(`id`)',
      '`equipe2_id` text NOT NULL REFERENCES `equipe`(`id`)',
      '`score1` integer',
      '`score2` integer',
      '`terrain_id` text REFERENCES `terrains`(`id`)',
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
