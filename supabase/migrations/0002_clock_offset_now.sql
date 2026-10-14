-- =============================================================================
-- 0002 : fonction public.now() pour le calcul du clockOffset
--
-- syncEngine.updateClockOffset() appelle supabase.rpc('now') après chaque cycle
-- de sync réussi (architecture §1.2 / §3.3 : le serveur renvoie son now() pour
-- corriger les comparaisons LWW des horloges décalées).
--
-- PostgREST n'expose que les fonctions du schéma public : la builtin now()
-- vit dans pg_catalog et n'est pas joignable par rpc('now'). On crée donc un
-- wrapper public, qualifié en pg_catalog.now() pour éviter la récursion.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.now()
RETURNS timestamptz
LANGUAGE sql
STABLE
AS $$
  SELECT pg_catalog.now();
$$;

REVOKE ALL ON FUNCTION public.now() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.now() TO anon, authenticated;
