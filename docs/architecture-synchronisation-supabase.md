# Architecture de synchronisation SQLite ↔ Supabase

> **État** : document de conception, mis à jour pour refléter l'implémentation livrée
> (moteur `src/services/sync/`, migrations `supabase/migrations/`, migration UUID
> `src/db/runUuidMigration.ts`). Toute divergence avec le code doit être corrigée ici.

## Objectif

Permettre à un utilisateur connecté de retrouver ses données (tournois, listes de joueurs,
terrains, etc.) sur n'importe quel appareil connecté au même compte, tout en conservant un
fonctionnement **hors ligne complet** : SQLite reste la source de vérité locale, Supabase est le
hub de synchronisation.

## Décisions actées

| Sujet | Décision |
| --- | --- |
| Résolution de conflits | **Dernier écrit gagne** (LWW sur `updated_at`, granularité ligne) |
| Identifiants | **Migration vers UUID v7** générés côté client (`src/utils/uuid/uuidv7.ts`, sans dépendance externe) |
| Partage multi-comptes | Données personnelles maintenant, schéma conçu pour permettre un partage en **lecture** plus tard |
| Réactivité | Sync à l'ouverture + push après chaque écriture (debounce 2 s) quand l'appareil est en ligne |
| Déconnexion | Purge des données locales, **uniquement après confirmation que tout est sync** (ou choix explicite « perdre ces données ») |
| Suppression de compte | RPC `delete_own_account()` avec **step-up d'authentification** (aal2 ou mot de passe < 10 min), purge RGPD via cascade sur `user_id` |

## Principes directeurs

1. **Offline-first** : toute écriture passe d'abord par SQLite (via les repositories Drizzle).
   La synchro est un processus distinct, jamais bloquant pour l'UI.
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

### 1.1 IDs : migration integer → UUID v7

Toutes les tables utilisaient `id: integer().primaryKey()` (auto-incrément implicite) : deux
appareils hors ligne auraient généré le même `id` → collision garantie.

**Réalisé** : `id` est `text().primaryKey()` avec un **UUID v7** généré côté client
(`$defaultFn(() => uuidv7())`), via une implémentation maison sans dépendance
(`src/utils/uuid/uuidv7.ts`, `Date.now()` + `crypto.getRandomValues` avec fallback `Math.random`).

- Les colonnes métier (`joueur_id`, `equipe_id`, `match_id`, etc.) restent des entiers : ce sont des
  identifiants *métier* internes au tournoi, sans rapport avec la clé de sync.
- Les clés étrangères (`references(() => joueurs.id)` etc.) sont passées de `integer` à `text`.

**Migration des données existantes** : migration **programmatique** `src/db/runUuidMigration.ts`
(lancée après la migration Drizzle dans `useDatabaseMigrations.ts`, car la génération d'UUID et le
remapping des FK sont impossibles en SQL pur) :

1. crée la table de mapping `id_mapping(table_name, old_id, new_id)` ;
2. pour chaque table (parents d'abord), crée `*_v2` avec `id text`, copie les lignes en générant un
   UUID v7 par ligne et réécrit les FK via le mapping ;
3. drop les anciennes tables, renomme les `_v2` ;
4. drop `id_mapping`, crée `sync_state`.

Idempotente (détection via `PRAGMA table_info(joueurs)`), exécutée dans une transaction avec
`PRAGMA foreign_keys = OFF` appliqué hors transaction. La migration Drizzle
(`drizzle/20260929211527_closed_deathbird`) ne crée que `sync_state` + les colonnes de sync ; son
snapshot reflète le schéma final (IDs `text`) pour bloquer `drizzle-kit generate`.

### 1.2 Colonnes de sync sur les tables synchronisées

Les 9 tables synchronisées portent désormais :

```ts
synced: integer({ mode: 'boolean' }).default(false).notNull(),   // outbox : en attente de push
updatedAt: integer({ mode: 'timestamp_ms' }).notNull(),           // horloge LWW (epoch ms)
deleted: integer({ mode: 'boolean' }).default(false).notNull(),  // tombstone locale
```

- **exception** : `preparation_tournoi`, `joueurs_preparation_tournois`,
  `terrains_preparation_tournois` ne sont **pas** synchronisées (état transitoire de création de
  tournoi) — pas de colonnes sync sur ces 3 tables.
- les repositories passent par le helper commun `stampForSync()` / `stampForDelete()`
  (`src/db/sync/stampForSync.ts`) qui force `updatedAt = new Date()`, `synced = false` (et
  `deleted = true` pour un delete) et notifie le bus d'écritures `writeBus` ;
- les `delete()` des repositories sont devenus des soft-deletes (`deleted = true`) ;
- purge différée des tombstones locales de plus de 30 jours **déjà sync** à la fin de chaque cycle
  (`purgeLocalTombstones()` dans le moteur).

### 1.3 Horloge et curseur : table `sync_state`

```ts
export const syncState = sqliteTable('sync_state', {
  userId: text('user_id').primaryKey(),        // id du compte Supabase
  lastPulledAt: integer('last_pulled_at'),     // curseur de pull (epoch ms, horloge serveur)
  clockOffset: integer('clock_offset'),        // serverNow - localNow
});
```

`updatedAt` est une horloge **locale** ; pour rendre le LWW robuste aux horloges désynchronisées,
le client récupère l'heure serveur via `rpc('now')` (wrapper `public.now()` — PostgREST n'expose pas
`pg_catalog.now()`) après chaque cycle réussi (`updateClockOffset`) et stocke
`clockOffset = serverNow - Date.now()`.

---

## 2. Schéma distant (Supabase / Postgres)

`supabase/migrations/0001_init.sql` (installation neuve, état final consolidé) +
`0002_security_hardening.sql` (delta idempotent pour le projet live).

### 2.1 Tables miroirs

Une table Postgres par table SQLite synchronisée, colonnes métier identiques (snake_case), plus :

```sql
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
updated_at timestamptz NOT NULL DEFAULT now(),   -- horloge LWW client
deleted boolean NOT NULL DEFAULT false,          -- miroir du tombstone SQLite
deleted_at timestamptz,                          -- timestamp de la tombstone (trigger)
server_updated_at timestamptz NOT NULL DEFAULT now()  -- horodatage serveur (trigger)
```

- clé composite `PRIMARY KEY (user_id, id)` — prépare le partage futur ;
- index `(user_id, server_updated_at)` par table : le pull filtre sur `server_updated_at`
  (jamais sur `updated_at` client, pour éviter les trous dus aux horloges décalées) ;
- trigger `BEFORE INSERT OR UPDATE` (`maintain_sync_columns`) qui :
  1. **plafonne** `updated_at` à `now()` si l'horloge client est en avance (anti domination) ;
  2. applique le **LWW serveur** : sur UPDATE, ignore l'écriture (`RETURN NULL`) si
     `NEW.updated_at <= OLD.updated_at` — le serveur est l'arbitre final ;
  3. pose `server_updated_at = now()` ;
  4. maintient `deleted_at` quand `deleted` passe à true.
- contraintes `CHECK length(...) <= N` sur les colonnes texte métier (anti-DoS stockage).

### 2.2 Row Level Security

```sql
ALTER TABLE tournoi ENABLE ROW LEVEL SECURITY;
CREATE POLICY tournoi_owner ON tournoi
  FOR ALL USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
```

- une seule policy `FOR ALL` par table (`(select auth.uid())` évalué une fois par requête) ;
- `REVOKE ALL ... FROM anon` sur les 9 tables + `profiles` ; `GRANT SELECT, INSERT, UPDATE, DELETE
  ... TO authenticated` uniquement (défense en profondeur, en plus de la RLS) ;
- `REVOKE TRUNCATE, TRIGGER, REFERENCES ON public.profiles FROM authenticated` et policy
  `profiles_owner_select` (le template starter exposait `full_name`/`avatar_url` publiquement).

Le `ON DELETE CASCADE` sur `user_id` garantit la purge RGPD automatique à la suppression du compte.

### 2.3 Préparation du partage futur (lecture seule)

Aucune table de partage aujourd'hui, mais le schéma reste compatible sans migration destructrice :
clé composite `(user_id, id)`, UUID non porteurs d'information. Ultérieurement, une table
`shared_refs(table_name, record_id, owner_id, shared_with, permission)` et une fonction
`can_read(...)` s'ajouteront dans les policies `FOR SELECT` :
`USING (user_id = auth.uid() OR can_read('tournoi', id))`.

### 2.4 Purge des tombstones et step-up

- `purge_old_tombstones()` (pg_cron quotidien 03:00 UTC) supprime les lignes
  `deleted_at < now() - interval '30 days'` — SECURITY DEFINER, `search_path` vide, EXECUTE révoqué
  à PUBLIC/anon/authenticated (réservée au cron).
- `delete_own_account()` (SECURITY DEFINER) exige un **step-up** : `aal2`, OU méthode `password`
  dans `amr` datant de moins de 10 minutes (produit par `signInWithPassword` côté client, demandé
  dans le dialogue de suppression). Un simple token de session AAL1 ne suffit pas.

---

## 3. Moteur de synchronisation

```
src/services/sync/
├── syncEngine.ts          # push/pull/cycle, mutex (timeout 2 min), curseur, clockOffset, purge tombstones
├── syncTables.ts          # registre unique SYNC_TABLES + PUSH_ORDER (parents d'abord) / PULL_ORDER (dérivé)
├── syncTrigger.tsx        # hook + NetInfo + AppState + debounce 2 s + SyncRefreshContext (pull-to-refresh manuel)
├── components/            # UI de SyncTrigger : RecoveringOverlay, AccountDeletedDialog, AdoptionDialog, types.ts
├── syncMappers/           # conversion ligne SQLite ↔ Postgres, par table (9 mappers)
├── syncAccount.ts         # login (adoption), logout (purge), suppression compte
└── purgeLog.ts            # journal des purges locales (AsyncStorage)
src/db/sync/
├── stampForSync.ts        # stamp updatedAt/synced/deleted + notification writeBus
├── writeBus.ts            # bus d'événements « écriture locale » (découplé de React)
└── localTransaction.ts    # BEGIN/COMMIT + PRAGMA foreign_keys OFF pour les écritures internes de la sync
```

### 3.1 Ordre de sync (dépendances FK)

```ts
const PUSH_ORDER = [
  'joueurs_suggestion', 'joueurs', 'listes_joueurs',
  'terrains', 'tournoi',
  'joueurs_listes', 'equipe', 'equipes_joueurs',
  'match',
]; // PULL_ORDER = reverse(PUSH_ORDER) — suppressions/purges enfants d'abord
```

Push et application du pull : parents d'abord. Les tables `preparation_*` sont absentes du registre.

### 3.2 Push (outbox)

1. pour chaque table dans `PUSH_ORDER` : `select * where synced = false` (tombstones incluses) ;
2. mapping SQLite → Postgres (ajout de `user_id` = session courante), upsert par batch de ~200
   (`onConflict: 'user_id,id'`, `ignoreDuplicates: false`) ;
3. **relecture** : après chaque upsert, `select id, server_updated_at, updated_at where id in (batch)`
   — le trigger LWW serveur peut ignorer une écriture sans erreur PostgREST, donc `synced = true`
   n'est posé que pour les lignes dont le serveur a réellement appliqué l'écriture
   (`server_updated_at` avancé, ou version distante strictement plus récente) ;
4. marquage `synced = true` avec **garde** `where id = ? and updatedAt = ?` : une écriture UI
   concurrente (qui repasse `synced = false` + nouvel `updatedAt`) n'est pas marquée à tort ;
5. échec → retry avec backoff exponentiel (max 5 tentatives par batch), les lignes restent
   `synced = false`.

Le `clockOffset` est pris en compte dans la comparaison (`local + offset`, tolérance 1 s) pour
couvrir le clamp serveur des horloges en avance.

### 3.3 Pull

Deux phases :

1. **fetch réseau bufferisé** : chaque table est lue par pages (`.range()`) depuis le curseur
   `server_updated_at > last_pulled_at`, avec `ORDER BY server_updated_at` (pagination déterministe).
   Un callback `onProgress(reçues)` est appelé après chaque page — l'overlay « Récupération de vos
   données… » affiche le compteur au-delà de 50 lignes.
   En cas d'erreur sur une table, **rien n'est appliqué** et le curseur n'avance pas ;
2. **application locale** : inserts/updates/tombstones + nouveau curseur, **commit en une seule
   transaction SQLite** (pas de perte de curseur en cas de crash), FK désactivées le temps de
   l'écriture (le miroir distant n'a pas de FK inter-tables).

Règles appliquées par ligne reçue :

- absente localement → insert (tombstone distante ignorée) ;
- présente → LWW : écraser si `updated_at` distant (corrigé du `clockOffset`) > `updated_at` local
  **ou** ligne locale `synced = true`, avec garde `updatedAt` (écriture UI concurrente préservée) ;
- champs purement locaux (`localOnlyFields` de `SYNC_TABLES`, ex. `tournoi.estTournoiActuel`) :
  exclus de l'update LWW — le pull ne les écrase jamais ; à l'insert (ligne absente localement),
  la valeur du mapper s'applique (`false` pour `estTournoiActuel`) ;
- tombstone distante → tombstone locale (`deleted = true`, `synced = true`) si la ligne locale est
  sync ; une ligne locale non sync est conservée (l'écriture locale gagne) ;
- cas particulier `joueurs_suggestion` : l'index unique local `nameUniqueIndex` n'a pas d'équivalent
  serveur — le pull fusionne aussi **par `name`** (update de la ligne locale vers l'id distant,
  `onConflictDoNothing` en garde-fou) pour éviter l'échec de toute la transaction.

Le curseur stocké est `max(server_updated_at) - 5 s` (`PULL_CURSOR_LAG_MS`) : la fenêtre est relue
au cycle suivant, l'application LWW étant idempotente. Si le curseur a plus de 30 jours
(rétention des tombstones), le pull repart **complet** (curseur 0) pour ne pas ressusciter des
lignes supprimées ailleurs.

### 3.4 Déclencheurs

| Événement | Action |
| --- | --- |
| Ouverture de l'app / login | adoption (voir 4.1) puis cycle complet `pull()` + `push()` |
| Chaque écriture (repositories → `stampForSync` → `writeBus`) | `push()` debouncé (2 s), uniquement si online, avec retry si un cycle tourne |
| Retour du réseau (NetInfo) | cycle complet |
| Mise en avant de l'app (AppState → active) | cycle complet si le dernier date de > 5 min |
| Pull-to-refresh manuel (écrans de liste) | cycle complet (raison `manual_refresh`) ; hors ligne, aucun cycle + toast gluestack |
| Logout | vérification outbox vide → purge (voir 4.2) |

Le pull-to-refresh manuel est exposé par `SyncTrigger` via `SyncRefreshContext`
(`useSyncRefresh()` → `refresh()` / `isSyncing`), consommé par
`SyncRefreshControl` (`src/components/SyncRefreshControl.tsx`) branché sur le
`refreshControl` des `LegendList` de `liste-tournois`, `listes-joueurs`,
`joueurs-tournoi`, `resultats` et `matchs/MatchsManche`. La garde hors ligne
est faite côté UI (`NetInfo.fetch()` avant tout cycle ; toast
`sync_hors_ligne_toast`). Après le pull, les `useLiveQuery` re-rendent les
listes sans wiring supplémentaire.

Sur **web** (Tauri/expo web), le geste pull-to-refresh n'existe pas
(`RefreshControl` y est un stub — LegendList web rend `null`, react-native-web
un `<View>`), donc un bouton `SyncRefreshButton`
(`src/components/SyncRefreshButton.tsx`, affiché uniquement si
`Platform.OS === 'web'`) est placé dans la top bar (`TopBarBack.rightAction`)
de `liste-tournois`, `listes-joueurs`, `joueurs-tournoi`, et dans le
`headerRight` des onglets tournoi (`resultats`, `matchs`). La logique
commune (garde NetInfo + toast + cycle + état) est factorisée dans le hook
`useManualRefresh` (`src/hooks/useManualRefresh.ts`), utilisé par
`SyncRefreshControl` et `SyncRefreshButton`.

Un **mutex** (avec timeout 2 min contre les crashs sans `finally`) empêche deux cycles concurrents.
Les écritures UI ne sont jamais bloquées (SQLite local d'abord, toujours).

---

## 4. Cycle de vie du compte

### 4.1 Login : adoption des données locales

`prepareLoginSync(userId)` (avant tout cycle) :

1. si les données locales appartiennent à un **autre compte** (propriétaire suivi dans
   AsyncStorage `LOCAL_DATA_OWNER_KEY`) → purge des lignes `synced = true` (restituées par le pull) ;
2. si l'appareil a des écritures hors ligne (`synced = false`) **et** (le compte distant a déjà des
   données **ou** ces écritures datent du compte précédent) → dialogue « fusionner / remplacer ».
   Le flag persistant `ADOPTION_PENDING_KEY` garantit que si l'app est fermée avant le choix, le
   dialogue est **re-présenté au prochain lancement** au lieu de pousser les données de l'ancien
   compte vers le nouveau ;
3. « fusionner » → `adoptMerge` (cycle complet) ; « remplacer » → purge locale + pull complet ;
4. sinon le propriétaire est enregistré et le cycle normal reprend.

### 4.2 Logout : purge locale conditionnelle

`checkLogout()` compte l'outbox ; `logoutAndPurge()` **re-vérifie l'outbox juste avant la purge**
(TOCTOU : une écriture UI entre le check et le logout) et lève une erreur si elle n'est pas vide.
Le dialogue propose « réessayer la synchro » ou « se déconnecter quand même » →
`forceLogoutAndPurge()` (purge sans vérifier, perte assumée, journalisée `logout_forced_purge`).
Outbox vide → purge totale (tables sync + `preparation_*` + `sync_state`, une transaction) puis
`signOut()`.

### 4.3 Suppression du compte : purge Supabase RGPD

`deleteAccountAndPurge(userId)` : re-vérifie l'outbox, appelle la RPC `delete_own_account()`
(step-up aal2 / mot de passe récent — le dialogue demande le mot de passe via `signInWithPassword`),
puis purge locale et `signOut()`. Le `ON DELETE CASCADE` sur `user_id` purge toutes les tables du
compte côté serveur.

---

## 5. Implémentation livrée

| Phase | Contenu | Fichiers principaux |
| --- | --- | --- |
| **1. IDs + colonnes sync** | Migration UUID v7 programmatique + mapping FK, `synced/updatedAt/deleted` sur les 9 tables, `sync_state`, `stampForSync`, repositories (delete → tombstone) | `src/db/runUuidMigration.ts`, `src/db/uuidMigrationTables.ts`, `drizzle/20260929211527_*`, `src/db/schema/*`, `src/repositories/*` |
| **2. Schéma distant** | SQL Supabase (tables miroirs, RLS, triggers LWW serveur, cron purge, step-up), mappers type-safe | `supabase/migrations/0001_init.sql`, `0002_security_hardening.sql`, `src/services/sync/syncMappers/*` |
| **3. Moteur** | `syncEngine` (push/pull/mutex/curseur/clockOffset/purge), `syncTrigger` (NetInfo + AppState + debounce), tests Jest | `src/services/sync/*`, `src/db/sync/*` |
| **4. Cycle de vie** | Adoption au login, purge au logout, suppression compte (step-up), écran « Récupération de vos données… », journal des purges, traductions (7 langues) | `src/services/sync/syncAccount.ts`, `src/screens/compte/*`, `src/services/sync/syncTrigger.tsx`, `src/services/sync/components/*` |

## 6. Menaces et sécurité

- **Clé anon publique** (`src/utils/supabase.ts`) : la protection vient exclusivement du serveur —
  `REVOKE ALL FROM anon`, grants réservés à `authenticated`, RLS `user_id = (select auth.uid())`
  en `FOR ALL` sur les 9 tables.
- **Token volé** : la suppression de compte exige un step-up (aal2 ou mot de passe < 10 min) ;
  `purge_old_tombstones` et `delete_own_account` ont EXECUTE révoqué à anon/authenticated pour la
  purge (cron uniquement).
- **Anti-DoS stockage** : CHECK de longueur sur les colonnes texte métier.
- **Horloges** : clamp serveur de `updated_at`, curseur de pull sur `server_updated_at`,
  `clockOffset` client.
- **À activer manuellement dans le dashboard Supabase** (hors SQL) : Leaked Password Protection
  (Authentication > Policies) ; pg_cron est créé par la migration.

## 7. Points d'attention

- **Web (Tauri/expo web)** : la synchro fonctionne aussi sur le proxy Drizzle web ; `affectedRows()`
  y retourne 1 par défaut (pas de compteur de lignes), la garde `updatedAt` reste correcte.
- **`useLiveQuery`** : le pull modifie SQLite, les écrans se rafraîchissent automatiquement via les
  live queries Drizzle existants — aucun wiring UI supplémentaire.
- **Taille des batchs** : chunks de 200 lignes ; un tournoi complet (128 joueurs, ~500 matchs)
  tient largement dans les limites PostgREST.
- **Tests** : 138 tests, 12 suites Jest — le moteur est testé avec des mocks de `getDrizzleDb`,
  `supabaseClient` et du schéma Drizzle (pas de base sqlite in-memory réelle), couvrant LWW,
  clockOffset, tombstones, adoption pending, TOCTOU logout/suppression.

## 8. Limites connues

- **Tournoi en cours purement local** : `estTournoiActuel` n'est **pas synchronisé** (colonne absente
  côté Supabase — `DROP COLUMN` dans 0002, appliquée en live — `setActualTournoi` hors
  `stampForSync`). Le pull ne l'écrase jamais sur une ligne existante (champ déclaré
  `localOnlyFields` dans `SYNC_TABLES`) ; `false` ne s'applique qu'à l'insert d'une ligne inconnue
  localement. Chaque appareil a son propre tournoi en cours — évite tout conflit LWW sur un
  invariant « un seul actif par compte » que la sync ne pourrait pas garantir. Conséquence : le
  tournoi en cours n'est pas repris sur un autre appareil.
- **Compte supprimé depuis un autre appareil** : le push reçoit une violation de clé étrangère
  `user_id → auth.users` (code Postgres `23503`). Le moteur pose alors `accountDeleted: true` sur le
  résultat du cycle (sans retry/backoff inutile), `syncTrigger` fait une **purge forcée locale**
  (`forceLogoutAndPurge`) et affiche un dialogue explicatif — sinon l'outbox resterait bloquée
  indéfiniment et le logout impossible (« données non synchronisées » alors qu'elles ne pourront
  jamais l'être).
- **LWW à granularité ligne entière** : si deux appareils éditent des champs différents de la même
  ligne hors ligne en même temps, un seul appareil gagne, l'autre champ est perdu. Accepté
  (données personnelles, conflits rares).
- **Pas de chiffrement end-to-end** : les données transitent et sont stockées en clair côté
  Supabase, protégées par la RLS.
- **Pas de partage effectif** aujourd'hui : le schéma est seulement *préparé* pour un partage en
  lecture futur (§2.3).
- **Fusion « merge » au login peut créer des doublons** (UUID distincts des deux côtés) — accepté,
  déterministe.
