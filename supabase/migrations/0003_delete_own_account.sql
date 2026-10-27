-- =============================================================================
-- 0003 : suppression du compte — purge RGPD
--
-- `deleteAccountAndPurge()` (syncAccount.ts) appelle supabase.rpc('delete_own_account').
-- Le ON DELETE CASCADE sur `user_id uuid REFERENCES auth.users(id)` (0001)
-- purge toutes les tables du compte dès que la ligne auth.users disparaît.
--
-- La fonction est SECURITY DEFINER (créée par la migration, donc propriétaire
-- postgres) : seul l'utilisateur authentifié peut se supprimer lui-même, et
-- uniquement via cette RPC — auth.users n'est pas accessible autrement.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non authentifié';
  END IF;

  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_own_account() FROM anon; -- default privileges Supabase
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;
