-- =============================================================================
-- 0004 : durcissement sécurité (revue sync, section 3)
--
--  1. purge_old_tombstones : réservée à pg_cron — plus exécutable par anon
--     ni authenticated ; tables qualifiées public.* + search_path fixé
--     (SECURITY DEFINER) ;
--  2. maintain_sync_columns : search_path fixé (trigger, aucune référence
--     non qualifiée — now() se résout via pg_catalog même search_path vide) ;
--  3. now() : search_path fixé, exécution réservée à authenticated
--     (updateClockOffset) ;
--  4. handle_new_user : search_path fixé + références qualifiées ;
--     exécution révoquée à anon et authenticated (fonction trigger, les
--     clients ne doivent pas pouvoir l'appeler) ;
--  5. anon ne peut plus lire les tables miroirs ni profiles : RLS bloquait
--     déjà les lignes, ceci interdit en plus la découverte du schéma via
--     l'API / GraphQL (advisor pg_graphql_anon_table_exposed) ;
--  6. profiles : lecture restreinte au propriétaire — le template starter
--     exposait full_name / avatar_url publiquement (l'app n'utilise pas
--     cette table).
--
-- Non couvert ici (config Auth, pas du ressort du SQL) :
--  - Leaked Password Protection : à activer dans le dashboard Supabase
--    (Authentication > Policies) ;
--  - la ré-authentification avant delete_own_account : côté client.
-- =============================================================================

-- ─── 1. purge_old_tombstones : réservée au cron ─────────────────────────────

CREATE OR REPLACE FUNCTION public.purge_old_tombstones()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public."joueurs"            WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."joueurs_suggestion" WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."listes_joueurs"     WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."terrains"          WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."tournoi"           WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."equipe"            WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."equipes_joueurs"   WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."joueurs_listes"    WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."match"             WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
END;
$$;

REVOKE ALL ON FUNCTION public.purge_old_tombstones() FROM anon, authenticated;

-- ─── 2. maintain_sync_columns : search_path fixé ────────────────────────────

CREATE OR REPLACE FUNCTION public.maintain_sync_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- LWW : sur UPDATE, ignorer si updated_at entrant <= updated_at existant
  IF TG_OP = 'UPDATE' AND NEW.updated_at <= OLD.updated_at THEN
    RETURN NULL;
  END IF;

  -- Horodatage serveur
  NEW.server_updated_at := now();

  -- Tombstone : mettre deleted_at quand deleted passe à true, effacer sinon
  IF NEW.deleted = true AND NEW.deleted_at IS NULL THEN
    NEW.deleted_at := now();
  ELSIF NEW.deleted = false THEN
    NEW.deleted_at := NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- ─── 3. now() : search_path fixé, réservée à authenticated ──────────────────

CREATE OR REPLACE FUNCTION public.now()
RETURNS timestamptz
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT pg_catalog.now();
$$;

-- authenticated conserve son GRANT explicite (migration 0002).
REVOKE ALL ON FUNCTION public.now() FROM PUBLIC, anon;

-- ─── 4. handle_new_user : search_path fixé, exécution réservée au trigger ────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- Trigger : seul le trigger sur auth.users l'exécute (supabase_auth_admin).
REVOKE ALL ON FUNCTION public.handle_new_user()
  FROM PUBLIC, anon, authenticated;

-- Hygiène : fonction trigger non appelable par les clients.
REVOKE ALL ON FUNCTION public.maintain_sync_columns()
  FROM PUBLIC, anon, authenticated;

-- ─── 5. anon ne lit plus les tables miroirs ni profiles ──────────────────────

REVOKE SELECT ON public."joueurs", public."joueurs_suggestion", public."listes_joueurs",
  public."terrains", public."tournoi", public."equipe", public."equipes_joueurs",
  public."joueurs_listes", public."match", public.profiles
FROM anon;

-- ─── 6. profiles : lecture restreinte au propriétaire ────────────────────────

DROP POLICY "Public profiles are viewable by everyone." ON public.profiles;

CREATE POLICY profiles_owner_select ON public.profiles
  FOR SELECT USING (id = auth.uid());
