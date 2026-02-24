import { DataMigrationService } from '@/services/dataMigrationService';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';

export const useDataMigration = () => {
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
      try {
        console.log('Checking if data migration is needed...');

        // Only proceed if we have data to migrate
        const hasPlayerData =
          listesJoueurs.avecNoms.length > 0 ||
          listesJoueurs.sansNoms.length > 0 ||
          listesJoueurs.avecEquipes.length > 0 ||
          listesJoueurs.historique.length > 0 ||
          listesJoueurs.sauvegarde.length > 0;

        const hasTournamentData = listeTournois.length > 0;
        const hasTerrainData = listeTerrains.length > 0;

        if (hasPlayerData || hasTournamentData || hasTerrainData) {
          console.log('Data found in Redux store, attempting migration...');

          const migrationResult =
            await DataMigrationService.migrateDataFromRedux(
              listesJoueurs,
              listesSauvegarde,
              listeTournois,
              listematchs || [],
              options,
              listeTerrains,
            );

          if (migrationResult) {
            console.log('Data migration completed successfully!');
          }
        } else {
          console.log('No data to migrate from Redux store');
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
  ]);
};
