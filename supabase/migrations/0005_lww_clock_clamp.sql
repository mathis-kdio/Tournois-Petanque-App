-- =============================================================================
-- 0005 : LWW robuste aux horloges en avance (revue sync, section 4.4)
--
-- Le trigger LWW compare les updated_at clients bruts : un appareil avec
-- 10 minutes d'avance voyait ses écritures dominer toutes les autres
-- jusqu'à ce que l'horloge serveur rattrape son « futur ».
--
-- Correctif : plafonner updated_at à now() à l'arrivée (avant la
-- comparaison LWW). Le serveur reste l'arbitre, borné au présent ; un
-- appareil en avance écrit « maintenant », pas « dans le futur ».
--
-- Le plafonnement s'applique avant le test LWW (sinon un futur
-- systématiquement supérieur gagnerait toujours). CREATE OR REPLACE ne
-- touche pas aux ACL (les REVOKE de la migration 0004 restent en place).
-- =============================================================================

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
