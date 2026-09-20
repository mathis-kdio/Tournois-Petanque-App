# Architecture de synchronisation SQLite ↔ Supabase

## Objectif

Permettre à un utilisateur connecté de retrouver ses données (tournois, listes de joueurs,
terrains, etc.) sur n'importe quel appareil connecté au même compte, tout en conservant un
fonctionnement **hors ligne complet** : SQLite reste la source de vérité locale, Supabase est le
hub de synchronisation.

## Décisions actées

| Sujet | Décision |
| --- | --- |
| Résolution de conflits | **Dernier écrit gagne** (LWW sur `updated_at`, granularité ligne) |
| Identifiants | **Migration vers UUID v7** générés côté client |
| Partage multi-comptes | Données personnelles maintenant, schéma conçu pour permettre un partage en **lecture** plus tard |
| Réactivité | Sync à l'ouverture + sync continue après chaque écriture (score, etc.) quand l'appareil est en ligne |
| Déconnexion | Purge des données locales, **uniquement après confirmation que tout est sync** |
| Suppression de compte | Purge côté Supabase (RGPD) via cascade sur `user_id` |

## Principes directeurs

1. **Offline-first** : toute écriture passe d'abord par SQLite (déjà le cas via les repositories
   Drizzle). La synchro est un processus distinct, jamais bloquant pour l'UI.
2. **ID globalement uniques générés côté client** : indispensable pour créer des données hors
   ligne sans collision entre appareils.
3. **Une seule direction de vérité par champ** : pas de fusion partielle, la ligne entière la
   plus récente gagne (LWW).
4. **Aucune donnée n'est perdue avant d'être sync** : les écritures non sync restent dans la base
   locale (pattern « outbox » via la colonne `synced`).
5. **Suppressions = tombstones** : un delete local devient un soft-delete sync, pour propager la
   suppression aux autres appareils.

---

## 1. Schéma local (SQLite / Drizzle)

### 1.1 IDs : migration integer → UUID

Aujourd'hui toutes les tables utilisent `id: integer().primaryKey()` (auto-incrément implicite).
Deux appareils hors ligne généreraient le même `id` → collision garantie.

**Changement** : `id` devient `text().primaryKey()` contenant un **UUID v7** (triable, adapté aux
index) généré côté client au moment de l'insertion.

- Dépendance : `uuid` (package `uuid` v9+, compatible React Native via `react-native-get-random-values`
  ou l'option `crypto.getRandomValues` de `expo-sqlite`/Hermes ; alternative sans dépendance :
  implémentation maison d'UUID v7 à partir de `Date.now()` + `crypto.getRandomValues`).
- Les colonnes métier (`joueur_id`, `equipe_id`, `match_id`, etc.) restent des entiers : ce sont
  des identifiants *métier* internes au tournoi, sans rapport avec la clé de sync.
- Les clés étrangères (`references(() => joueurs.id)` etc.) passent de `integer` à `text`.

**Migration des données existantes** : nouvelle migration Drizzle qui, pour chaque table :
1. crée la nouvelle table `*_v2` avec `id text`,
2. copie les lignes en générant un UUID v7 par ligne et un mapping
   `ancien_id → nouvel_uuid` (table temporaire `id_mapping(table_name, old_id, new_id)`),
3. réécrit les FK via le mapping (FK par FK, dans l'ordre de dépendance),
4. remplace l'ancienne table,
5. conserve le mapping jusqu'à la fin de la migration complète, puis le supprime.

Les IDs étant actuellement des `number` en TypeScript, l'impact se limite aux repositories et aux
types (`Joueur.id: string`, etc.). Les IDs métier (`joueurId`, `equipeId`…) restent des `number`,
ce qui limite la casse dans l'UI.

### 1.2 Colonnes de sync sur toutes les tables

`equipe`, `match`, `terrains`, `listes_joueurs` ont déjà `updated_at` + `synced`. Il faut :

- les **généraliser** à toutes les tables, y compris `joueurs`, `tournoi`, `preparation_tournoi`,
  et les tables de jointure (`equipes_joueurs`, `joueurs_listes`, `joueurs_preparation_tournois`,
  `terrains_preparation_tournois`) et `joueurs_suggestion` ;
- ajouter partout :

```ts
synced: integer({ mode: 'boolean' }).default(false).notNull(),   // outbox : en attente de push
updatedAt: integer({ mode: 'timestamp_ms' }).notNull(),           // horloge LWW (epoch ms)
deleted: integer({ mode: 'boolean' }).default(false).notNull(),  // tombstone locale
```

- les repositories passent par un **helper commun** `stampForSync()` qui, à chaque
  insert/update, force `updatedAt = Date.now()` et `synced = false` ;
- les `delete()` des repositories deviennent des updates `deleted = true` (+ purge différée des
  tombstones de plus de 30 jours et déjà sync) ;
- `updatedAt` est une **horloge locale** : pour rendre LWW robuste aux horloges désynchronisées,
  le serveur renvoie son `now()` à chaque sync (endpoint `sync/ping` ou header de réponse) et
  l'app stocke le décalage `clockOffset = serverNow - Date.now()` dans `sync_state` pour corriger
  les comparaisons.

### 1.3 Table locale `sync_state`

```ts
export const syncState = sqliteTable('sync_state', {
  userId: text('user_id').primaryKey(),        // id du compte Supabase
  lastPulledAt: integer('last_pulled_at'),     // curseur de pull (epoch ms, horloge serveur)
  clockOffset: integer('clock_offset'),        // décalage horloge serveur/locales
  purgedAt: integer('purged_at'),              // date de la dernière purge (logout)
});
```

---

## 2. Schéma distant (Supabase / Postgres)

### 2.1 Tables miroirs

Une table Postgres par table SQLite, colonnes identiques (mêmes noms snake_case), plus :

```sql
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
updated_at timestamptz NOT NULL DEFAULT now(),
deleted_at timestamptz,                        -- tombstone distante
server_updated_at timestamptz NOT NULL DEFAULT now()  -- horodatage serveur (trigger)
```

- `id text PRIMARY KEY` (l'UUID v7 généré par le client) ;
- clé composite `PRIMARY KEY (user_id, id)` — même si l'UUID est global, cela prépare le partage
  futur et rend les index pertinents ;
- `(user_id, updated_at)` indexé pour un pull efficace ;
- trigger `before update` qui maintient `server_updated_at = now()` ;
- le pull utilise le **max(`server_updated_at`)** comme curseur, jamais `updated_at` client
  (évite les trous dus aux horloges décalées).

### 2.2 Row Level Security

```sql
ALTER TABLE tournoi ENABLE ROW LEVEL SECURITY;

CREATE POLICY tournoi_owner_select ON tournoi
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY tournoi_owner_write ON tournoi
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

Répliqué sur chaque table. Le `ON DELETE CASCADE` sur `user_id` garantit la purge RGPD
automatique à la suppression du compte (`auth.users` → toutes les lignes du compte supprimées).

### 2.3 Préparation du partage futur (lecture seule)

Le design actuel (données personnelles) n'ajoute **aucune table de partage**, mais le schéma est
déjà compatible avec l'ajout ultérieur d'un modèle sans migration destructrice :

```sql
-- Prévu (plus tard) :
CREATE TABLE shared_refs (
  table_name text NOT NULL,
  record_id text NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  permission text NOT NULL DEFAULT 'read',  -- 'read' | 'write'
  PRIMARY KEY (table_name, record_id, shared_with)
);
```

Avec une fonction de policy réutilisable :

```sql
CREATE FUNCTION can_read(table_name text, record_id text) RETURNS boolean
  SECURITY DEFINER ...  -- vérifie shared_refs + appartenance
```

Les policies `FOR SELECT` deviendront alors
`USING (user_id = auth.uid() OR can_read('tournoi', id))`. Rien à faire maintenant, mais ne
jamais intégrer `user_id` dans les UUID ni présumer dans le code que `user_id` est unique par ligne.

### 2.4 Purge des tombstones

Fonction RPC `purge_old_tombstones()` (pg_cron, exécution quotidienne) supprimant les lignes
`deleted_at < now() - interval '30 days'`. Le pull ne renvoie jamais les tombstones purgées :
les appareils qui reçoivent une tombstone appliquent le delete local et purgent leur propre
tombstone après 30 jours.

---

## 3. Moteur de synchronisation

Nouveau module `src/services/sync/` :

```
src/services/sync/
├── syncEngine.ts          # orchestration push/pull, verrou, curseur, clockOffset
├── syncTables.ts          # registre ordonné des tables (parents avant enfants)
├── syncTrigger.ts         # hook React + NetInfo + debounce après écriture
├── syncMappers/           # conversion ligne SQLite ↔ ligne Postgres, par table
└── syncAccount.ts         # login (adoption), logout (purge), suppression compte
```

### 3.1 Ordre de sync (dépendances FK)

```ts
// push : parents d'abord ; pull : ordre inverse (FK locales satisfaites à l'insert)
const PUSH_ORDER = [
  'joueurs_suggestion', 'joueurs', 'listes_joueurs',
  'terrains', 'preparation_tournoi', 'tournoi',
  'joueurs_listes', 'equipe', 'equipes_joueurs',
  'joueurs_preparation_tournois', 'terrains_preparation_tournois',
  'match',
];
```

### 3.2 Push (outbox)

1. `syncEngine.push()` : pour chaque table dans `PUSH_ORDER`,
   `select * where synced = false` (hors `deleted = true` déjà push) ;
2. mapping SQLite → Postgres (ajout de `user_id` = session courante) ;
3. `upsert` par batch (`onConflict: 'user_id,id'`, `.upsert()` de supabase-js, chunks de ~200
   lignes) avec `ignoreDuplicates: false` ;
4. le serveur applique LWW côté distant : trigger `before insert or update` qui ignore l'écriture
   si `EXCLUDED.updated_at <= updated_at` existante — le serveur est l'arbitre final du LWW ;
5. succès → `update ... set synced = true where id in (...)` localement ;
6. échec (réseau, RLS, conflit) → la transaction du batch est abandonnée, les lignes restent
   `synced = false`, retry au prochain trigger avec backoff exponentiel (max 5 tentatives par
   cycle, puis attente du prochain déclencheur).

### 3.3 Pull

1. Curseur `last_pulled_at` = max `server_updated_at` vu (stocké dans `sync_state`, horloge
   serveur) ;
2. pour chaque table (ordre inverse du push) :
   `select * where user_id = auth.uid() and server_updated_at > last_pulled_at`
   — les tombstones (`deleted_at not null`) incluses ;
3. pour chaque ligne reçue :
   - absente localement → insert (sauf tombstone : ignore) ;
   - présente localement → LWW : si `updated_at` distant (corrigé du `clockOffset`) >
     `updated_at` local **ou** ligne locale `synced = true` → écraser ; sinon ignorer
     (la ligne locale `synced = false` sera poussée au cycle suivant) ;
   - tombstone distante → delete local physique si la ligne locale est sync, sinon conserver
     (l'écriture locale non sync gagne, cas rare : suppression sur appareil A pendant une
     édition hors ligne sur appareil B — l'édition survit, ce qui est le comportement LWW) ;
4. nouveau `last_pulled_at` = max `server_updated_at` reçu, **commité en même temps** que les
   écritures locales (une seule transaction SQLite) — pas de perte de curseur en cas de crash.

Le pull est paginé (`.range()`) et adapté à un premier téléchargement complet sur un nouvel
appareil (écran de chargement « Récupération de vos données… »).

### 3.4 Déclencheurs

| Événement | Action |
| --- | --- |
| Ouverture de l'app (session existante) | `pull()` puis `push()` |
| Login réussi | adoption (voir 4.1) puis `pull()` + `push()` |
| Chaque écriture (score, ajout joueur…) | `push()` debouncé (2 s), uniquement si online |
| Retour du réseau (NetInfo) | cycle complet |
| Mise en avant de l'app (AppState → active) | cycle complet si le dernier date de > 5 min |
| Logout | vérification outbox vide → purge (voir 4.2) |

Un **verrou (mutex)** empêche deux cycles concurrents ; les écritures UI ne sont jamais
bloquées par la synchro (SQLite local d'abord, toujours).

---

## 4. Cycle de vie du compte

### 4.1 Login : adoption des données locales

Cas d'usage : l'utilisateur utilise l'app en anonyme, crée des tournois, puis se connecte.

1. avant push : `select count(*) where synced = false` — s'il existe des lignes **et** que le
   compte distant a déjà des données, afficher un choix à l'utilisateur :
   - « Conserver les données locales et les fusionner » (push des lignes locales ; risque
     minimal de doublon si la même donnée existe des deux côtés — les UUID distincts créent
     deux lignes ; acceptable pour LWW et déterministe),
   - « Remplacer par les données du compte » (purge locale puis pull complet) ;
2. lignes déjà sync (d'un compte précédent) → purgées au login du nouveau compte (le device
   appartenait à un autre compte) ;
3. lignes jamais sync → conservées, `user_id` du nouveau compte appliqué au push.

### 4.2 Logout : purge locale conditionnelle

1. si `synced = false` quelque part → bloquer le logout avec un message explicite
   (« Des données ne sont pas synchronisées ») et proposer :
   - « Réessayer la synchro » (forcée, même hors ligne → feedback),
   - « Se déconnecter quand même et perdre ces données » (confirmation explicite) ;
2. si outbox vide → `deleteAll()` sur toutes les tables + reset `sync_state`, puis `signOut()`.

### 4.3 Suppression du compte : purge Supabase

`ON DELETE CASCADE` sur `user_id REFERENCES auth.users(id)` fait tout le travail côté base.
La suppression du compte est initiée par `supabase-js` (`auth.admin.deleteUser` via une Edge
Function, ou deletion depuis l'app si la policy le permet) → toutes les tables du compte sont
purgées. Purge locale ensuite (comme logout). Aucune donnée orpheline possible grâce à la FK.

---

## 5. Plan d'implémentation

| Phase | Contenu | Fichiers principaux |
| --- | --- | --- |
| **1. IDs + colonnes sync** | Migration UUID v7 + mapping, `synced/updatedAt/deleted` sur les 12 tables, `sync_state`, helper `stampForSync`, repositories refactorés (delete → tombstone) | `src/db/schema/*`, `drizzle/` (migration), `src/repositories/*`, `src/db/runManualMigration.ts` (web) |
| **2. Schéma distant** | SQL Supabase (tables miroirs, RLS, triggers LWW serveur, cron purge), mappers type-safe | `supabase/migrations/*.sql`, `src/services/sync/syncMappers/*` |
| **3. Moteur** | `syncEngine` (push/pull/verrou/curseur/clockOffset), `syncTrigger` (NetInfo + AppState + debounce), tests Jest du moteur avec base sqlite in-memory | `src/services/sync/*`, `tests/` |
| **4. Cycle de vie** | Adoption au login, purge au logout, suppression compte, écran « récupération des données », journal des purges | `src/services/sync/syncAccount.ts`, `src/app/compte/*`, `src/components/supabase/SessionProvider.tsx` |

Chaque phase est livrable indépendamment : après la phase 1 l'app fonctionne comme avant
(les colonnes sont juste ignorées), après la phase 3 la synchro est opérationnelle.

## 6. Points d'attention

- **Web (Tauri/expo web)** : la synchro doit fonctionner aussi sur web (proxy Drizzle) —
  les helpers ne doivent rien supposer de `Platform`.
- **`useLiveQuery`** : le pull qui modifie SQLite déclenchera automatiquement le rafraîchissement
  des écrans via les live queries Drizzle existants — aucun wiring UI supplémentaire nécessaire.
- **Taille des batchs** : un tournoi complet (128 joueurs, ~500 matchs) tient largement dans les
  limites d'upsert Postgres, mais le moteur découpe quand même en chunks de 200 lignes.
- **Tests** : le moteur (merge LWW, adoption, purge, tombstones) est testé en Jest avec une base
  sqlite in-memory et un mock de `supabase-js`, sans réseau.
- **Sécurité** : la clé anon Supabase déjà présente dans `src/utils/supabase.ts` est conçue pour
  être publique ; la protection vient exclusivement des RLS — à vérifier avec des tests
  Postgres (`supabase/test`).
