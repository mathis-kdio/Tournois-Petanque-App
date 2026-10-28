-- =============================================================================
-- 0001 : schéma distant (Supabase / Postgres) — fusion des migrations 0001-0006
-- =============================================================================
-- Fusion de :
--   0001_schema_sync_mirror.sql    (tables miroirs, index, triggers, RLS, purge)
--   0002_clock_offset_now.sql      (fonction public.now() pour le clockOffset)
--   0003_delete_own_account.sql    (purge RGPD par l'utilisateur)
--   0004_security_hardening.sql    (durcissement sécurité)
--   0005_lww_clock_clamp.sql       (plafonnement updated_at au présent serveur)
--   0006_revoke_public_purge.sql   (révocation de PUBLIC sur purge_old_tombstones)
--
-- Contient l'état final de chaque objet (versions consolidées après les
-- migrations correctives), applicable en une fois sur une installation neuve.
--
-- Prérequis : la table public.profiles (template starter Supabase) doit exister
-- — elle est créée en dehors de ce fichier (voir section 8).
-- =============================================================================

-- ─── 1. Fonction public.now() — clockOffset (0002 + 0004) ────────────────────
--
-- syncEngine.updateClockOffset() appelle supabase.rpc('now') après chaque cycle
-- de sync réussi. PostgREST n'expose que les fonctions du schéma public : la
-- builtin now() vit dans pg_catalog et n'est pas joignable par rpc('now').
-- Wrapper public, qualifié en pg_catalog.now() pour éviter la récursion.

CREATE OR REPLACE FUNCTION public.now()
RETURNS timestamptz
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT pg_catalog.now();
$$;

REVOKE ALL ON FUNCTION public.now() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.now() TO authenticated;

-- ─── 2. Tables miroirs (0001) ─────────────────────────────────────────────────
--
-- Une table Postgres par table SQLite synchronisée, colonnes métier identiques
-- (snake_case), plus les colonnes de sync serveur :
--   user_id           uuid  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
--   updated_at        timestamptz NOT NULL DEFAULT now()   -- horloge LWW client
--   deleted           boolean NOT NULL DEFAULT false       -- tombstone (miroir SQLite)
--   deleted_at        timestamptz                           -- timestamp tombstone serveur
--   server_updated_at timestamptz NOT NULL DEFAULT now()   -- horodatage serveur (trigger)
--
-- Clé composite PRIMARY KEY (user_id, id) — l'UUID v7 est global mais cela
-- prépare le partage futur et rend les index pertinents.
--
-- Tables synchronisées (9) :
--   joueurs, joueurs_suggestion, listes_joueurs, terrains, tournoi,
--   equipe, equipes_joueurs, joueurs_listes, match
--
-- Tables NON synchronisées (état transitoire) : preparation_tournoi,
--   joueurs_preparation_tournois, terrains_preparation_tournois — absentes.

CREATE TABLE "joueurs" (
  "id" text NOT NULL,
  "joueur_id" integer NOT NULL,
  "name" text NOT NULL,
  "type" text,
  "equipe" integer,
  "is_checked" boolean DEFAULT false NOT NULL,
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "server_updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "id")
);

CREATE TABLE "joueurs_suggestion" (
  "id" text NOT NULL,
  "name" text NOT NULL,
  "occurence" integer NOT NULL,
  "cacher" boolean DEFAULT false NOT NULL,
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "server_updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "id")
);

CREATE TABLE "listes_joueurs" (
  "id" text NOT NULL,
  "name" text,
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "server_updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "id")
);

CREATE TABLE "terrains" (
  "id" text NOT NULL,
  "name" text NOT NULL,
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "server_updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "id")
);

CREATE TABLE "tournoi" (
  "id" text NOT NULL,
  "name" text NOT NULL,
  "nb_tours" integer NOT NULL,
  "nb_matchs" integer NOT NULL,
  "nb_pt_victoire" integer NOT NULL,
  "speciaux_incompatibles" boolean NOT NULL,
  "memes_equipes" boolean NOT NULL,
  "memes_adversaires" integer NOT NULL,
  "type_equipes" text NOT NULL,
  "type_tournoi" text NOT NULL,
  "avec_terrains" boolean NOT NULL,
  "mode" text NOT NULL,
  "est_tournoi_actuel" boolean NOT NULL,
  "create_at" timestamptz NOT NULL,
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "server_updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "id")
);

CREATE TABLE "equipe" (
  "id" text NOT NULL,
  "equipe_id" integer NOT NULL,
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "server_updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "id")
);

CREATE TABLE "equipes_joueurs" (
  "id" text NOT NULL,
  "joueur_id" text NOT NULL,
  "equipe_id" text NOT NULL,
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "server_updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "id")
);

CREATE TABLE "joueurs_listes" (
  "id" text NOT NULL,
  "joueur_id" text NOT NULL,
  "liste_id" text NOT NULL,
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "server_updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "id")
);

CREATE TABLE "match" (
  "id" text NOT NULL,
  "match_id" integer NOT NULL,
  "tournoi_id" text NOT NULL,
  "tour_id" integer NOT NULL,
  "tour_name" text,
  "equipe1_id" text NOT NULL,
  "equipe2_id" text NOT NULL,
  "score1" integer,
  "score2" integer,
  "terrain_id" text,
  "user_id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "server_updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "id")
);

-- ─── 3. Index pour un pull efficace (0001) ────────────────────────────────────

CREATE INDEX "joueurs_pull_idx" ON "joueurs" ("user_id", "updated_at");
CREATE INDEX "joueurs_suggestion_pull_idx" ON "joueurs_suggestion" ("user_id", "updated_at");
CREATE INDEX "listes_joueurs_pull_idx" ON "listes_joueurs" ("user_id", "updated_at");
CREATE INDEX "terrains_pull_idx" ON "terrains" ("user_id", "updated_at");
CREATE INDEX "tournoi_pull_idx" ON "tournoi" ("user_id", "updated_at");
CREATE INDEX "equipe_pull_idx" ON "equipe" ("user_id", "updated_at");
CREATE INDEX "equipes_joueurs_pull_idx" ON "equipes_joueurs" ("user_id", "updated_at");
CREATE INDEX "joueurs_listes_pull_idx" ON "joueurs_listes" ("user_id", "updated_at");
CREATE INDEX "match_pull_idx" ON "match" ("user_id", "updated_at");

-- Index secondaire sur server_updated_at pour le curseur de pull
CREATE INDEX "joueurs_server_updated_idx" ON "joueurs" ("user_id", "server_updated_at");
CREATE INDEX "joueurs_suggestion_server_updated_idx" ON "joueurs_suggestion" ("user_id", "server_updated_at");
CREATE INDEX "listes_joueurs_server_updated_idx" ON "listes_joueurs" ("user_id", "server_updated_at");
CREATE INDEX "terrains_server_updated_idx" ON "terrains" ("user_id", "server_updated_at");
CREATE INDEX "tournoi_server_updated_idx" ON "tournoi" ("user_id", "server_updated_at");
CREATE INDEX "equipe_server_updated_idx" ON "equipe" ("user_id", "server_updated_at");
CREATE INDEX "equipes_joueurs_server_updated_idx" ON "equipes_joueurs" ("user_id", "server_updated_at");
CREATE INDEX "joueurs_listes_server_updated_idx" ON "joueurs_listes" ("user_id", "server_updated_at");
CREATE INDEX "match_server_updated_idx" ON "match" ("user_id", "server_updated_at");

-- ─── 4. Trigger générique : LWW + clamp horloge + server_updated_at + deleted_at
--     (0001 + 0004 + 0005, version finale) ─────────────────────────────────────
--
-- 0005 : un appareil avec l'horloge en avance voyait ses écritures dominer
-- toutes les autres. Le plafonnement de updated_at à now() s'applique AVANT le
-- test LWW (sinon un futur systématiquement supérieur gagnerait toujours).
-- 0004 : search_path vide (fonction trigger SECURITY-safe, aucune référence
-- non qualifiée — now() se résout via pg_catalog même search_path vide).

CREATE OR REPLACE FUNCTION public.maintain_sync_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Horloges en avance : plafonner au présent serveur. L'écriture reste
  -- valide (elle est plus récente que l'existante), mais ne peut pas
  -- écraser indûment les écritures futures des autres appareils.
  IF NEW.updated_at > now() THEN
    NEW.updated_at := now();
  END IF;

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

-- Fonction trigger : seule exécutable par les triggers (0004)
REVOKE ALL ON FUNCTION public.maintain_sync_columns()
  FROM PUBLIC, anon, authenticated;

-- Attacher le trigger BEFORE INSERT OR UPDATE sur chaque table
CREATE TRIGGER trg_joueurs_sync BEFORE INSERT OR UPDATE ON "joueurs"
  FOR EACH ROW EXECUTE FUNCTION public.maintain_sync_columns();

CREATE TRIGGER trg_joueurs_suggestion_sync BEFORE INSERT OR UPDATE ON "joueurs_suggestion"
  FOR EACH ROW EXECUTE FUNCTION public.maintain_sync_columns();

CREATE TRIGGER trg_listes_joueurs_sync BEFORE INSERT OR UPDATE ON "listes_joueurs"
  FOR EACH ROW EXECUTE FUNCTION public.maintain_sync_columns();

CREATE TRIGGER trg_terrains_sync BEFORE INSERT OR UPDATE ON "terrains"
  FOR EACH ROW EXECUTE FUNCTION public.maintain_sync_columns();

CREATE TRIGGER trg_tournoi_sync BEFORE INSERT OR UPDATE ON "tournoi"
  FOR EACH ROW EXECUTE FUNCTION public.maintain_sync_columns();

CREATE TRIGGER trg_equipe_sync BEFORE INSERT OR UPDATE ON "equipe"
  FOR EACH ROW EXECUTE FUNCTION public.maintain_sync_columns();

CREATE TRIGGER trg_equipes_joueurs_sync BEFORE INSERT OR UPDATE ON "equipes_joueurs"
  FOR EACH ROW EXECUTE FUNCTION public.maintain_sync_columns();

CREATE TRIGGER trg_joueurs_listes_sync BEFORE INSERT OR UPDATE ON "joueurs_listes"
  FOR EACH ROW EXECUTE FUNCTION public.maintain_sync_columns();

CREATE TRIGGER trg_match_sync BEFORE INSERT OR UPDATE ON "match"
  FOR EACH ROW EXECUTE FUNCTION public.maintain_sync_columns();

-- ─── 5. Row Level Security (0001) ─────────────────────────────────────────────

ALTER TABLE "joueurs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "joueurs_suggestion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "listes_joueurs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "terrains" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tournoi" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "equipe" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "equipes_joueurs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "joueurs_listes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "match" ENABLE ROW LEVEL SECURITY;

-- Politiques : SELECT + FOR ALL (write) sur chaque table
-- Pattern : user_id = auth.uid()

CREATE POLICY joueurs_owner_select ON "joueurs"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY joueurs_owner_write ON "joueurs"
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY joueurs_suggestion_owner_select ON "joueurs_suggestion"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY joueurs_suggestion_owner_write ON "joueurs_suggestion"
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY listes_joueurs_owner_select ON "listes_joueurs"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY listes_joueurs_owner_write ON "listes_joueurs"
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY terrains_owner_select ON "terrains"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY terrains_owner_write ON "terrains"
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY tournoi_owner_select ON "tournoi"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY tournoi_owner_write ON "tournoi"
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY equipe_owner_select ON "equipe"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY equipe_owner_write ON "equipe"
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY equipes_joueurs_owner_select ON "equipes_joueurs"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY equipes_joueurs_owner_write ON "equipes_joueurs"
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY joueurs_listes_owner_select ON "joueurs_listes"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY joueurs_listes_owner_write ON "joueurs_listes"
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY match_owner_select ON "match"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY match_owner_write ON "match"
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ─── 6. Purge des tombstones (0001 + 0004 + 0006, version finale) ─────────────
--
-- Réservée au cron (superutilisateur / service_role) : SECURITY DEFINER,
-- tables qualifiées public.*, search_path vide, EXECUTE révoqué à
-- PUBLIC, anon et authenticated (0006 : sans la révocation de PUBLIC,
-- un appelant non authentifié pouvait purger prématurément les
-- tombstones de tous les utilisateurs).

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
  DELETE FROM public."terrains"           WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."tournoi"            WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."equipe"             WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."equipes_joueurs"    WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."joueurs_listes"     WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM public."match"              WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
END;
$$;

REVOKE ALL ON FUNCTION public.purge_old_tombstones() FROM PUBLIC, anon, authenticated;

-- Schedule pg_cron (daily at 03:00 UTC)
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('purge_old_tombstones', '0 3 * * *', 'SELECT public.purge_old_tombstones();');

-- ─── 7. Suppression du compte — purge RGPD (0003) ─────────────────────────────
--
-- `deleteAccountAndPurge()` (syncAccount.ts) appelle supabase.rpc('delete_own_account').
-- Le ON DELETE CASCADE sur `user_id uuid REFERENCES auth.users(id)` purge toutes
-- les tables du compte dès que la ligne auth.users disparaît.
--
-- La fonction est SECURITY DEFINER (créée par la migration, donc propriétaire
-- postgres) : seul l'utilisateur authentifié peut se supprimer lui-même, et
-- uniquement via cette RPC — auth.users n'est pas accessible autrement.

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

REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;

-- ─── 8. profiles + handle_new_user (0004) ─────────────────────────────────────
--
-- La table public.profiles est créée par le template starter Supabase, en
-- dehors de ce fichier (prérequis : elle doit exister au moment de l'application).

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

-- Fonction trigger : seule exécutable par le trigger sur auth.users
-- (supabase_auth_admin).
REVOKE ALL ON FUNCTION public.handle_new_user()
  FROM PUBLIC, anon, authenticated;

-- anon ne lit plus les tables miroirs ni profiles : RLS bloquait déjà les
-- lignes, ceci interdit en plus la découverte du schéma via l'API / GraphQL.
REVOKE SELECT ON public."joueurs", public."joueurs_suggestion", public."listes_joueurs",
  public."terrains", public."tournoi", public."equipe", public."equipes_joueurs",
  public."joueurs_listes", public."match", public.profiles
FROM anon;

-- profiles : lecture restreinte au propriétaire — le template starter
-- exposait full_name / avatar_url publiquement (l'app n'utilise pas cette table).
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

CREATE POLICY profiles_owner_select ON public.profiles
  FOR SELECT USING (id = auth.uid());

-- ─── 9. Non couvert ici (config Auth, pas du ressort du SQL) ──────────────────
--
--  - Leaked Password Protection : à activer dans le dashboard Supabase
--    (Authentication > Policies) ;
--  - la ré-authentification avant delete_own_account : côté client.
