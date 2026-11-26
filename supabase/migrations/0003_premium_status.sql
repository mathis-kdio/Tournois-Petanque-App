-- =============================================================================
-- 0003 : statut premium (RevenueCat) dans public.profiles
-- =============================================================================
-- La source de vérité du statut premium reste RevenueCat (SDK côté client).
-- Ces colonnes servent de miroir côté Supabase, alimenté par le webhook
-- RevenueCat (Edge Function `revenuecat-webhook`) et lisible par le client
-- en fallback. L'écriture est réservée au service role (Edge Function).
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS revenuecat_app_user_id text;

CREATE INDEX IF NOT EXISTS profiles_is_premium_idx
  ON public.profiles (is_premium)
  WHERE is_premium;

-- Lecture du propre profil (complète la policy existante du starter si besoin)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_select_own'
  ) THEN
    CREATE POLICY "profiles_select_own" ON public.profiles
      FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;
END $$;
