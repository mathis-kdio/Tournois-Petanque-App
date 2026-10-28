# Revue de sécurité et de fiabilité — synchronisation Supabase

Date : 2026-10-28

Périmètre : revue de l'implémentation décrite dans
`docs/architecture-synchronisation-supabase.md`, y compris les migrations et le
code de synchronisation concernés.

## Constatations

### 1. Exécution publique de la purge des tombstones

- **Sévérité :** moyenne
- **Confiance :** 9/10
- **Fichier :** `supabase/migrations/0004_security_hardening.sql`, lignes 29-48
- **Risque :** `purge_old_tombstones()` est une fonction `SECURITY DEFINER`
  qui supprime des marqueurs de suppression de tous les utilisateurs. La
  migration révoque l'exécution à `anon` et `authenticated`, mais pas à
  `PUBLIC`. Comme PostgreSQL accorde par défaut l'exécution des nouvelles
  fonctions à `PUBLIC`, un appelant non authentifié pourrait invoquer cette
  fonction via RPC. Une purge prématurée peut faire réapparaître des données
  supprimées lorsqu'un appareil ancien se resynchronise.
- **Correction suggérée :** révoquer également l'exécution à `PUBLIC` et ne
  l'accorder qu'au rôle effectivement utilisé par la tâche planifiée.

### 2. Données locales non synchronisées transférées lors d'un changement de compte

- **Sévérité :** moyenne
- **Confiance :** 8/10
- **Fichiers :** `src/services/sync/syncAccount.ts`, lignes 141-169 ;
  `src/services/sync/syncTrigger.tsx`, lignes 149-162
- **Risque :** lors du passage d'un compte à un autre, les lignes locales déjà
  synchronisées sont purgées, mais les lignes non synchronisées peuvent rester
  présentes et être attribuées au nouveau compte. Si le compte distant est
  considéré vide (ou si la vérification des données distantes échoue), la
  synchronisation peut téléverser les données privées de l'ancien compte dans
  le nouveau sans confirmation explicite.
- **Correction suggérée :** isoler les données locales en attente par
  propriétaire ou demander une confirmation explicite avant de les associer à
  un autre compte, y compris si la vérification distante échoue.

### 3. Contraintes de clés étrangères non restaurées par la migration UUID

- **Catégorie :** fiabilité fonctionnelle
- **Sévérité :** moyenne
- **Confiance :** 10/10
- **Fichier :** `src/db/runUuidMigration.ts`, lignes 183-207, 239-260,
  307-311 et 397-402
- **Risque :** les tables de relations reconstruites lors de la migration
  traduisent les valeurs de clés étrangères, mais leurs définitions `_v2` ne
  recréent pas les contraintes `REFERENCES`. Après migration, SQLite ne
  garantit donc plus l'intégrité de ces relations et des écritures peuvent
  laisser des lignes orphelines.
- **Correction suggérée :** inclure les contraintes adaptées dans les
  définitions des tables reconstruites et vérifier le schéma obtenu après
  migration.

## Limites de la revue

Les constatations ci-dessus sont celles confirmées dans le périmètre examiné.
Aucune autre vulnérabilité avérée n'a été relevée concernant l'injection, la
cryptographie, SSRF ou XPIA.

## Suivi

| Constatation | Disposition |
| --- | --- |
| 1. Exécution publique de `purge_old_tombstones` | Migration `0006_revoke_public_purge.sql` (`REVOKE ... FROM PUBLIC`), appliquée au projet distant et vérifiée (`has_function_privilege` : anon / authenticated / public = false, service_role = true). L'ACL constatée sur le projet (déjà restreinte) est désormais reflétée dans le dépôt. |
| 2. Données non sync transférées au changement de compte | `prepareLoginSync` : `needsChoice` requis dès que des lignes non sync existent et que le propriétaire local précédent est un autre compte (`remoteHasData \|\| previousOwner !== null`). |
| 3. FK non restaurées par la migration UUID | Configuration extraite dans `src/db/uuidMigrationTables.ts` : les `_v2` recréent les `REFERENCES` du schéma Drizzle ; `PRAGMA foreign_keys` appliqué hors transaction (no-op garanti à l'intérieur). Test de non-régression : `src/db/uuidMigrationTables.test.ts`. |
