-- =============================================================================
-- 2. Schéma distant (Supabase / Postgres) — tables miroirs de synchronisation
-- =============================================================================
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
-- =============================================================================

-- ─── 1. Tables miroirs ─────────────────────────────────────────────────────────

-- 1.1 joueurs
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

-- 1.2 joueurs_suggestion
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

-- 1.3 listes_joueurs
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

-- 1.4 terrains
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

-- 1.5 tournoi
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

-- 1.6 equipe
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

-- 1.7 equipes_joueurs
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

-- 1.8 joueurs_listes
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

-- 1.9 match
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

-- ─── 2. Index pour un pull efficace ────────────────────────────────────────────

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

-- ─── 3. Trigger générique : LWW + server_updated_at + deleted_at ──────────────

CREATE OR REPLACE FUNCTION public.maintain_sync_columns()
RETURNS trigger
LANGUAGE plpgsql
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

-- ─── 4. Row Level Security (2.2) ──────────────────────────────────────────────

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

-- ─── 5. Purge des tombstones (2.4) ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.purge_old_tombstones()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM "joueurs"          WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM "joueurs_suggestion" WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM "listes_joueurs"   WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM "terrains"         WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM "tournoi"          WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM "equipe"           WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM "equipes_joueurs"  WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM "joueurs_listes"   WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
  DELETE FROM "match"            WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days';
END;
$$;

-- Schedule pg_cron (daily at 03:00 UTC)
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('purge_old_tombstones', '0 3 * * *', 'SELECT public.purge_old_tombstones();');
