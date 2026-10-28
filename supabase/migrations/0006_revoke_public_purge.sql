-- =============================================================================
-- 0006 : purge_old_tombstones — révocation de PUBLIC
--
-- PostgreSQL accorde EXECUTE à PUBLIC sur toute nouvelle fonction. La
-- migration 0004 révoquait anon et authenticated, mais pas PUBLIC : un
-- appelant non authentifié restait donc en mesure d'invoquer via RPC cette
-- fonction SECURITY DEFINER qui supprime les tombstones de tous les
-- utilisateurs (purge prématurée → résurrection de lignes supprimées chez
-- les autres appareils du propriétaire).
--
-- La fonction reste exécutable par le rôle du cron (superutilisateur) et
-- service_role. La révocation avait été posée à la main sur le projet
-- distant après la revue ; cette migration l'enregistre dans l'historique et
-- l'applique aux installations fraîches.
-- =============================================================================

REVOKE ALL ON FUNCTION public.purge_old_tombstones() FROM PUBLIC;
