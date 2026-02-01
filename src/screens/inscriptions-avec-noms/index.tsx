import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import Inscriptions from '@components/Inscriptions';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useTranslation } from 'react-i18next';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { useCallback, useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { JoueurType } from '@/types/enums/joueurType';
import { useJoueurs } from '@/repositories/joueurs/useJoueurs';
import { useJoueursPreparationTournois } from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';
import StartButton from './components/StartButton';

const InscriptionsAvecNoms = () => {
  const { t } = useTranslation();

  const { getActualPreparationTournoi } = usePreparationTournoi();
  const { renameJoueur, checkJoueur } = useJoueurs();
  const {
    addJoueursPreparationTournoi,
    removeJoueursPreparationTournoi,
    removeAllJoueursPreparationTournoi,
    getAllJoueursPreparationTournoi,
  } = useJoueursPreparationTournois();

  const [preparationTournoi, setPreparationTournoi] = useState<
    PreparationTournoiModel | undefined
  >(undefined);
  const [listeJoueurs, setlisteJoueurs] = useState<JoueurModel[]>([]);

  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const resultpreparationTournoi = await getActualPreparationTournoi();
      setPreparationTournoi(resultpreparationTournoi);
      const joueurs = await getAllJoueursPreparationTournoi();
      console.log(joueurs);
      setlisteJoueurs(joueurs);
      setloading(false);
    };
    fetchData();
  }, [getActualPreparationTournoi, getAllJoueursPreparationTournoi]);

  const handleAddJoueur = useCallback(
    async (joueurName: string, joueurType: JoueurType | undefined) => {
      if (!preparationTournoi) return;
      const { typeEquipes } = preparationTournoi;
      if (!typeEquipes) return;
      const equipe = equipeAuto(listeJoueurs, typeEquipes);
      const joueur: JoueurModel = {
        id: listeJoueurs.length,
        name: joueurName,
        type: joueurType,
        equipe: equipe,
        isChecked: false,
      };

      const newjoueur = await addJoueursPreparationTournoi(joueur);
      setlisteJoueurs((prev) => [...prev, newjoueur]);
    },
    [addJoueursPreparationTournoi, listeJoueurs, preparationTournoi],
  );

  const handleDeleteJoueur = useCallback(
    async (id: number) => {
      await removeJoueursPreparationTournoi(id);
      setlisteJoueurs((prev) => prev.filter((u) => u.id !== id));
    },
    [removeJoueursPreparationTournoi],
  );

  const handleAddEquipeJoueur = useCallback(
    async (id: number, equipeId: number) => {
      //await deleteTournoi(id);
      setlisteJoueurs((prev) =>
        prev.map((u) => (u.id === id ? { ...u, equipe: equipeId } : u)),
      );
    },
    [],
  );

  const handleUpdateName = useCallback(
    async (joueurModel: JoueurModel, name: string) => {
      await renameJoueur(joueurModel, name);

      setlisteJoueurs((prev) =>
        prev.map((joueur) =>
          joueur.id === joueurModel.id ? { ...joueur, name: name } : joueur,
        ),
      );
    },
    [renameJoueur],
  );

  const handleCheckJoueur = useCallback(
    async (joueurModel: JoueurModel, isChecked: boolean) => {
      await checkJoueur(joueurModel, isChecked);

      setlisteJoueurs((prev) =>
        prev.map((joueur) =>
          joueur.id === joueurModel.id
            ? { ...joueur, isChecked: isChecked }
            : joueur,
        ),
      );
    },
    [checkJoueur],
  );

  const handleDeleteAllJoueurs = useCallback(async () => {
    await removeAllJoueursPreparationTournoi();
    setlisteJoueurs([]);
  }, [removeAllJoueursPreparationTournoi]);

  const equipeAuto = (
    listeJoueurs: JoueurModel[],
    typeEquipes: TypeEquipes,
  ) => {
    if (typeEquipes === TypeEquipes.TETEATETE) {
      return listeJoueurs.length + 1;
    } else {
      const nbJoueursParEquipe = typeEquipes === TypeEquipes.DOUBLETTE ? 2 : 3;

      // Compter le nombre de joueurs par équipe
      const joueursParEquipe: { [key: number]: number } = {};
      listeJoueurs.forEach((joueur) => {
        if (joueur.equipe) {
          joueursParEquipe[joueur.equipe] =
            (joueursParEquipe[joueur.equipe] || 0) + 1;
        }
      });

      // Trouver l'équipe avec l'id le plus proche de 0 qui n'a pas dépassé nbJoueursParEquipe
      let equipeTrouvee = 1;
      for (let i = 1; ; i++) {
        const nbJoueursDansEquipe = joueursParEquipe[i] || 0;
        if (nbJoueursDansEquipe < nbJoueursParEquipe) {
          equipeTrouvee = i;
          break;
        }
      }
      return equipeTrouvee;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!preparationTournoi) {
    throw Error();
  }

  const nbJoueur = listeJoueurs.length;
  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('inscription_avec_noms_navigation_title')} />
      <VStack className="flex-1">
        <Text className="text-typography-white text-xl text-center">
          {t('nombre_joueurs', { nb: nbJoueur })}
        </Text>
        <Inscriptions
          listeJoueurs={listeJoueurs}
          preparationTournoi={preparationTournoi}
          loadListScreen={false}
          onAddJoueur={handleAddJoueur}
          onDeleteJoueur={handleDeleteJoueur}
          onAddEquipeJoueur={handleAddEquipeJoueur}
          onUpdateName={handleUpdateName}
          onCheckJoueur={handleCheckJoueur}
          onDeleteAllJoueurs={handleDeleteAllJoueurs}
        />
        <Box className="px-10">
          <StartButton
            preparationTournoi={preparationTournoi}
            listeJoueurs={listeJoueurs}
          />
        </Box>
      </VStack>
    </VStack>
  );
};

export default InscriptionsAvecNoms;
