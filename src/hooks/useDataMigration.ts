import { DataMigrationService } from '@/services/dataMigrationService';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';

export const useDataMigration = (migrationDone: boolean) => {
  const listesJoueurs = useSelector(
    (state: RootState) => state.listesJoueurs.listesJoueurs,
  );
  const listesSauvegarde = useSelector(
    (state: RootState) => state.listesJoueurs.listesSauvegarde,
  );
  const listeTournois = useSelector(
    (state: RootState) => state.listeTournois.listeTournois,
  );
  const listematchs = useSelector(
    (state: RootState) => state.gestionMatchs.listematchs,
  );
  const options = useSelector(
    (state: RootState) => state.optionsTournoi.options,
  );
  const listeTerrains = useSelector(
    (state: RootState) => state.listeTerrains.listeTerrains,
  );

  useEffect(() => {
    const migrateData = async () => {
      if (!migrationDone) {
        return;
      }
      // compute flags before entering try/catch so there are no value blocks inside
      // the exception handling block. This keeps the logic simple and lets the
      // React compiler/memoizer reason about the effect more easily.
      const hasPlayerData =
        listesJoueurs.avecNoms.length > 0 ||
        listesJoueurs.sansNoms.length > 0 ||
        listesJoueurs.avecEquipes.length > 0 ||
        listesJoueurs.historique.length > 0 ||
        listesJoueurs.sauvegarde.length > 0;

      const hasTournamentData = listeTournois.length > 0;
      const hasTerrainData = listeTerrains.length > 0;

      if (!(hasPlayerData || hasTournamentData || hasTerrainData)) {
        console.log('No data to migrate from Redux store');
        return;
      }

      // prepare a safe copy of match list outside of try/catch so the expression
      // isn't evaluated inside the block (avoids value block complaint)
      const safeListematchs = listematchs || [];

      try {
        console.log('Checking if data migration is needed...');
        console.log('Data found in Redux store, attempting migration...');

        const migrationResult = await DataMigrationService.migrateDataFromRedux(
          listesJoueurs,
          listesSauvegarde,
          listeTournois,
          safeListematchs,
          options,
          listeTerrains,
        );

        if (migrationResult) {
          console.log('Data migration completed successfully!');
        }
      } catch (error) {
        console.error('Data migration error:', error);
      }
    };

    // Run migration when component mounts
    migrateData();
  }, [
    listesJoueurs,
    listesSauvegarde,
    listeTournois,
    listematchs,
    options,
    listeTerrains,
    migrationDone,
  ]);
};
