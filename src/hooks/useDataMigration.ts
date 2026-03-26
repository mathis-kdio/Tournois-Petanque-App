import { DataMigrationService } from '@/services/dataMigrationService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/configureStore';

export const useDataMigration = (migrationDone: boolean) => {
  const [dataMigrationDone, setDataMigrationDone] = useState(false);

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
      await DataMigrationService.migrateDataFromRedux(
        listesJoueurs,
        listesSauvegarde,
        listeTournois,
        listematchs,
        options,
        listeTerrains,
      );
      setDataMigrationDone(true);
    };
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

  return dataMigrationDone;
};
