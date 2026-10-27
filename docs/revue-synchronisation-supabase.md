# Revue de l'implémentation de la synchronisation SQLite ↔ Supabase

Revue technique de l'implémentation décrite dans `architecture-synchronisation-supabase.md`
(branche `vibe/sync-supabase-architecture-09706b`, PR #313), incluant une vérification en
direct du projet Supabase (`pjwgepngyhmvvaranelt`) et du dépôt GitHub.

## 1. Conformité à l'architecture

L'implémentation suit fidèlement le document d'architecture :

| Élément du doc | État | Preuve |
| --- | --- | --- |
| UUID v7 client, colonnes `synced/updatedAt/deleted` sur les 9 tables, `sync_state`, `stampForSync`/`stampForDelete` | Conforme | `src/db/schema/*`, `src/db/sync/*`, repositories (filtres `deleted = false` partout, deletes → tombstones) |
| Tables miroirs, PK `(user_id, id)`, triggers LWW + `server_updated_at`, index, RLS | Conforme | Migration 0001 **appliquée sur le projet distant** : 9 tables avec RLS actif, 18 policies correctes, 9 triggers, cron `purge_old_tombstones` (03:00 UTC) vérifiés en direct |
| Moteur push/pull/LWW/mutex/curseur/clockOffset | Conforme | `syncEngine.ts` (pull en 2 phases, transaction unique, all-or-nothing) |
| Déclencheurs (login, NetInfo, AppState 5 min, debounce 2 s) | Conforme | `syncTrigger.tsx` |
| Adoption / logout conditionnel / suppression compte | Conforme | `syncAccount.ts` + RPC `delete_own_account` (SECURITY DEFINER, `search_path=''`, anon révoqué) |
| Tests moteur Jest sqlite in-memory | **29/29 passent** | `npx jest src/services/sync` |

## 2. Failles critiques (fonctionnelles)

> **Statut : corrigées.** Les points 2.1 à 2.4 sont appliqués dans
> `syncEngine.ts` et `syncAccount.ts` (helpers `src/db/sync/localTransaction.ts`) :
> application du pull parents-d'abord avec FK désactivées le temps de
> l'écriture interne, tombstone distante convertie en tombstone locale,
> `purgeSyncedRows` en ordre enfants-d'abord, tri `server_updated_at` sur
> la pagination du pull.

### 2.1 `PULL_ORDER` insère les enfants avant les parents → violation FK

Le schéma local porte des FK réelles :

- `match → tournoi / equipe / terrains`
- `equipes_joueurs → joueurs / equipe`
- `joueurs_listes → joueurs / listes_joueurs`

`runPull` applique les inserts dans `PULL_ORDER` (`match` en premier, parents ensuite).
Sur un premier téléchargement (nouvel appareil), l'insert d'un `match` dont le `tournoi`
n'a pas encore été inséré provoque `SQLITE_CONSTRAINT` → **ROLLBACK de toute la
transaction, curseur jamais avancé, synchro bloquée en boucle**.

Le document d'architecture a lui-même le raisonnement inversé (« pull : ordre inverse,
FK locales satisfaites à l'insert ») : l'ordre enfants-d'abord est correct pour les
*deletes*, faux pour les *inserts*.

Les tests Jest ne détectent pas le problème car la base in-memory n'active pas
`PRAGMA foreign_keys` — alors qu'expo-sqlite l'active par défaut et que le projet la
restaure explicitement à ON (`runUuidMigration.ts:424`).

**Correctif** : deux passes — inserts parents-d'abord (ordre `PUSH_ORDER`), deletes
enfants-d'abord (ordre `PULL_ORDER`) ; ou FK différées ; ou `PRAGMA foreign_keys = OFF`
ponctuel autour de l'application du pull.

### 2.2 `purgeSyncedRows` (login, changement de compte) supprime parents-d'abord

`syncAccount.ts` itère `Object.values(TABLES_BY_NAME)` (ordre du littéral : parents
d'abord) → suppression de `tournoi` avant ses `match` → même violation FK, ROLLBACK,
l'adoption au login échoue. `purgeLocalData` a le bon ordre (`PULL_ORDER`) ; cette
fonction non.

**Correctif** : itérer dans `PULL_ORDER` (enfants d'abord), comme `purgeLocalData`.

### 2.3 Tombstone parent vs enfants locaux non-sync survivants

Si un tournoi est supprimé sur l'appareil A pendant que B a des matchs non sync (le LWW
les conserve volontairement), B reçoit la tombstone `tournoi` et fait un delete
physique du parent alors que des enfants vivants le référencent encore → violation FK
→ pull en échec **permanent** pour cet appareil.

**Correctif** : conserver la tombstone parent localement tant que des enfants existent,
ou désactiver temporairement les FK pendant l'application du pull.

### 2.4 Pagination du pull sans `.order()`

`runPull` : `.gt('server_updated_at', ...).range(offset, ...)` sans tri. L'ordre des
pages Postgres est non déterministe ; des lignes peuvent être sautées ou dupliquées
entre pages pendant des écritures concurrentes.

**Correctif** : `.order('server_updated_at', { ascending: true })` — l'index
`(user_id, server_updated_at)` existe déjà et sera utilisé via le filtre RLS.

## 3. Failles sécurité (vérifiées en direct sur le projet Supabase)

> **Statut : corrigées** via la migration `0004_security_hardening.sql`,
> appliquée au projet distant (vérifiée en direct : privilèges, policies,
> advisor sécurité). Restent hors SQL : la protection des mots de passe
> compromis (dashboard Auth) et l'exposition GraphQL aux utilisateurs
> authentifiés (désactiver l'API GraphQL si inutilisée).

### 3.1 `purge_old_tombstones()` exécutable par anon ET authenticated

Vérifié via `has_function_privilege` : `true` pour les deux rôles. N'importe qui avec
l'URL publique et la clé anon peut appeler cette RPC qui supprime des tombstones
**de tous les utilisateurs**. Impact limité (le cron le fait quotidiennement) mais
c'est une action destructive globale exposée sans auth.

**Correctif** (migration 0004) :

```sql
REVOKE EXECUTE ON FUNCTION public.purge_old_tombstones() FROM anon, authenticated;
```

### 3.2 Advisor sécurité Supabase — points relevés

- `function_search_path_mutable` sur 4 fonctions (`now`, `handle_new_user`,
  `maintain_sync_columns`, `purge_old_tombstones`). `purge_old_tombstones` cumule
  SECURITY DEFINER + search_path mutable → ajouter `SET search_path = ''` et qualifier
  les tables.
- `pg_graphql_anon_table_exposed` : les 10 tables sont découvrables en GraphQL par
  anon → révoquer `SELECT` à `anon` si le GraphQL n'est pas utilisé.
- **Leaked password protection désactivée** (HaveIBeenPwned) → activer dans la config Auth.

### 3.3 `delete_own_account`

Correct sur le principe (SECURITY DEFINER, `search_path = ''`, propriétaire `postgres`,
anon révoqué, `auth.uid()` obligatoire), mais :

- un delete direct de `auth.users` ne révoque pas les JWT en circulation (valides
  jusqu'à expiration) ; l'API admin Supabase est recommandée ;
- une seule RPC suffit à détruire le compte irréversiblement — envisager une étape de
  ré-authentification avant l'appel.

### 3.4 Divers

- `profiles` a une policy `SELECT true` (full_name, username, avatar_url lisibles
  publiquement — template starter) → à resserrer.
- Observation : `auth.users` contient 1124 comptes — si les inscriptions sont ouvertes,
  vérifier que la confirmation d'email est active.
- La clé anon commitée dans `src/utils/supabase.ts` est conforme au design (publique,
  protection par RLS uniquement) ; aucune clé service_role n'est présente dans le dépôt
  (vérifié).
- RLS : policies `USING` + `WITH CHECK` correctes sur les 9 tables ; `ON DELETE
  CASCADE` sur `user_id` → purge RGPD fonctionnelle.

## 4. Failles moyennes

> **Statut : corrigées.** 4.1 : marquage `synced = true` conditionné à
> `updatedAt` inchangé (`syncEngine.ts`) ; 4.2 : curseur de pull avec recul
> de sécurité de 5 s (`PULL_CURSOR_LAG_MS`, réapplication idempotente) ;
> 4.3 : push suspendu pendant le dialogue d'adoption (`firePush` garde
> `adoptionPromptRef`) ; 4.4 : migration `0005_lww_clock_clamp.sql` — le
> trigger serveur plafonne `updated_at` à `now()` avant la comparaison LWW
> (appliquée au projet distant, testée en direct : un futur plafonné, un
> update obsolète rejeté).

### 4.1 Race `synced = true` dans `runPush`

Une écriture UI entre le `select` du batch et le `set({ synced: true })` (marquage par
`id` seul) est marquée synchronisée **sans avoir été poussée**. Le pull suivant peut
ensuite l'écraser avec des données plus anciennes (puisque `localRow.synced` force
l'overwrite).

**Correctif** : conditionner le marquage à `updatedAt` inchangé par rapport à la
valeur lue dans le batch.

### 4.2 Race du curseur de pull

Une ligne poussée par un autre appareil *après* la lecture de sa table mais avec un
`server_updated_at` ≤ au max vu sur une autre table est sautée définitivement (le
filtre utilise `lastPulledAt`, mais le curseur avance à `newCursor` global). Fenêtre
étroite.

**Atténuation** : léger recul de curseur (ex. −5 s ; l'application LWW est idempotente,
re-recevoir des lignes anciennes est sans effet).

### 4.3 Push non suspendu pendant le dialogue d'adoption

`runPush` ne vérifie pas `adoptionPromptRef` (seuls les cycles sont suspendus) — un
push debouncé résiduel peut pousser des données locales vers le nouveau compte avant
que l'utilisateur choisisse « remplacer ».

**Correctif** : vérifier le flag d'adoption dans `firePush`.

### 4.4 LWW et horloges décalées

Le trigger serveur compare les `updated_at` **clients bruts** : un appareil avec 10
minutes d'avance écrase systématiquement les modifications des autres. Le `clockOffset`
ne corrige que les comparaisons locales du pull. Tradeoff assumé dans le document
d'architecture (le serveur est l'arbitre), mais à connaître.

## 5. Priorités suggérées

1. Corriger l'ordre FK (2.1–2.3) — bloquant : le premier pull sur un nouvel appareil
   échoue actuellement.
2. Ajouter `.order('server_updated_at')` au pull (2.4).
3. `REVOKE EXECUTE` sur `purge_old_tombstones` (3.1) + `search_path` sur les fonctions (3.2).
4. Marquage `synced` conditionnel (4.1).
5. Ajouter un test Jest avec `PRAGMA foreign_keys = ON` pour figer 2.1 (les tests
   actuels, 29/29 verts, n'activent pas les FK et ne peuvent pas détecter ces régressions).
