-- =============================================================================
-- 0002 : durcissement sécurité — delta idempotent sur la base déjà migrée (0001)
-- =============================================================================
-- Applique sur le projet live les correctifs de la revue de la MR #313 :
--   1. delete_own_account : step-up (aal2 OU amr 'password' < 10 min) ;
--   2. suppression des 9 index *_pull_idx morts (jamais utilisés) ;
--   3. REVOKE TRUNCATE/TRIGGER/REFERENCES sur public.profiles FROM authenticated ;
--   4. CHECK de longueur sur les champs texte métier (anti-DoS stockage) ;
--   5. DROP COLUMN tournoi.est_tournoi_actuel : le tournoi en cours est purement
--      local (chaque appareil a le sien) — la colonne distante est supprimée.
-- =============================================================================

-- 1. Step-up avant suppression du compte
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_aal text;
  v_amr jsonb;
  v_method jsonb;
  v_recent_password boolean := false;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non authentifié';
  END IF;

  v_aal := coalesce(auth.jwt() ->> 'aal', 'aal1');
  v_amr := coalesce((auth.jwt() -> 'amr')::jsonb, '[]'::jsonb);

  IF v_aal = 'aal2' THEN
    DELETE FROM auth.users WHERE id = auth.uid();
    RETURN;
  END IF;

  FOR v_method IN SELECT * FROM jsonb_array_elements(v_amr)
  LOOP
    IF v_method ->> 'method' = 'password'
       AND (v_method ->> 'timestamp')::bigint >= extract(epoch from now()) - 600 THEN
      v_recent_password := true;
      EXIT;
    END IF;
  END LOOP;

  IF NOT v_recent_password THEN
    RAISE EXCEPTION 'Ré-authentification requise (mot de passe saisi dans les 10 dernières minutes) pour supprimer le compte';
  END IF;

  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- 2. Index morts (advisor unused_index : le pull filtre sur server_updated_at)
DROP INDEX IF EXISTS public.joueurs_pull_idx;
DROP INDEX IF EXISTS public.joueurs_suggestion_pull_idx;
DROP INDEX IF EXISTS public.listes_joueurs_pull_idx;
DROP INDEX IF EXISTS public.terrains_pull_idx;
DROP INDEX IF EXISTS public.tournoi_pull_idx;
DROP INDEX IF EXISTS public.equipe_pull_idx;
DROP INDEX IF EXISTS public.equipes_joueurs_pull_idx;
DROP INDEX IF EXISTS public.joueurs_listes_pull_idx;
DROP INDEX IF EXISTS public.match_pull_idx;

-- 3. profiles : RLS ne couvre pas TRUNCATE/TRIGGER/REFERENCES
REVOKE TRUNCATE, TRIGGER, REFERENCES ON public.profiles FROM authenticated;

-- 4. Limites de taille des champs texte (anti-DoS stockage)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE connamespace = 'public'::regnamespace AND conname = 'joueurs_name_len_check') THEN
    ALTER TABLE public."joueurs" ADD CONSTRAINT "joueurs_name_len_check" CHECK (length("name") <= 200);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE connamespace = 'public'::regnamespace AND conname = 'joueurs_type_len_check') THEN
    ALTER TABLE public."joueurs" ADD CONSTRAINT "joueurs_type_len_check" CHECK (length("type") <= 50);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE connamespace = 'public'::regnamespace AND conname = 'joueurs_suggestion_name_len_check') THEN
    ALTER TABLE public."joueurs_suggestion" ADD CONSTRAINT "joueurs_suggestion_name_len_check" CHECK (length("name") <= 200);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE connamespace = 'public'::regnamespace AND conname = 'listes_joueurs_name_len_check') THEN
    ALTER TABLE public."listes_joueurs" ADD CONSTRAINT "listes_joueurs_name_len_check" CHECK (length("name") <= 200);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE connamespace = 'public'::regnamespace AND conname = 'terrains_name_len_check') THEN
    ALTER TABLE public."terrains" ADD CONSTRAINT "terrains_name_len_check" CHECK (length("name") <= 200);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE connamespace = 'public'::regnamespace AND conname = 'tournoi_name_len_check') THEN
    ALTER TABLE public."tournoi" ADD CONSTRAINT "tournoi_name_len_check" CHECK (length("name") <= 200);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE connamespace = 'public'::regnamespace AND conname = 'tournoi_type_equipes_len_check') THEN
    ALTER TABLE public."tournoi" ADD CONSTRAINT "tournoi_type_equipes_len_check" CHECK (length("type_equipes") <= 20);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE connamespace = 'public'::regnamespace AND conname = 'tournoi_type_tournoi_len_check') THEN
    ALTER TABLE public."tournoi" ADD CONSTRAINT "tournoi_type_tournoi_len_check" CHECK (length("type_tournoi") <= 20);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE connamespace = 'public'::regnamespace AND conname = 'tournoi_mode_len_check') THEN
    ALTER TABLE public."tournoi" ADD CONSTRAINT "tournoi_mode_len_check" CHECK (length("mode") <= 20);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE connamespace = 'public'::regnamespace AND conname = 'match_tour_name_len_check') THEN
    ALTER TABLE public."match" ADD CONSTRAINT "match_tour_name_len_check" CHECK (length("tour_name") <= 200);
  END IF;
END $$;

-- 5. Tournoi en cours local : la colonne distante n'est plus utilisée
-- (idempotent : no-op si déjà supprimée)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tournoi' AND column_name = 'est_tournoi_actuel') THEN
    ALTER TABLE public."tournoi" DROP COLUMN "est_tournoi_actuel";
  END IF;
END $$;
