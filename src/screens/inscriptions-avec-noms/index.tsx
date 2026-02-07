import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import Inscriptions from '@components/Inscriptions';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useTranslation } from 'react-i18next';
import { usePreparationTournoiV2 } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { useCallback } from 'react';
import Loading from '@/components/Loading';
import { JoueurType } from '@/types/enums/joueurType';
import { useJoueursV2 } from '@/repositories/joueurs/useJoueurs';
import {
  useJoueursPreparationTournois,
  useJoueursPreparationTournoisV2,
} from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';
import StartButton from './components/StartButton';

const InscriptionsAvecNoms = () => {
  const { t } = useTranslation();

  const { preparationTournoiVM } = usePreparationTournoiV2();

  const { renameJoueur, checkJoueur } = useJoueursV2();
  const {
    removeJoueursPreparationTournoi,
    removeAllJoueursPreparationTournoi,
  } = useJoueursPreparationTournois();

  const { joueurs, addJoueursPreparationTournoi } =
    useJoueursPreparationTournoisV2();

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
      let i = 1;
      while (true) {
        const nbJoueursDansEquipe = joueursParEquipe[i] || 0;
        if (nbJoueursDansEquipe < nbJoueursParEquipe) {
          equipeTrouvee = i;
          break;
        }
        i += 1;
      }
      return equipeTrouvee;
    }
  };

  const handleAddJoueur = async (
    joueurName: string,
    joueurType: JoueurType | undefined,
  ) => {
    if (!preparationTournoiVM) {
      throw Error('preparationTournoiVM devrait être défini');
    }
    const { typeEquipes } = preparationTournoiVM;
    if (!typeEquipes) {
      throw Error('typeEquipes devrait être défini');
    }
    const equipe = equipeAuto(joueurs, typeEquipes);
    const joueur: JoueurModel = {
      id: joueurs.length,
      name: joueurName,
      type: joueurType,
      equipe: equipe,
      isChecked: false,
    };

    await addJoueursPreparationTournoi(joueur);
  };

  const handleDeleteJoueur = (id: number) => {
    removeJoueursPreparationTournoi(id);
  };

  const handleAddEquipeJoueur = (id: number, equipeId: number) => { };

  const handleUpdateName = (joueurModel: JoueurModel, name: string) => {
    renameJoueur(joueurModel.id, name);
  };

  const handleCheckJoueur = (joueurModel: JoueurModel, isChecked: boolean) => {
    checkJoueur(joueurModel.id, isChecked);
  };

  const handleDeleteAllJoueurs = useCallback(async () => {
    await removeAllJoueursPreparationTournoi();
  }, [removeAllJoueursPreparationTournoi]);

  if (!preparationTournoiVM || !joueurs) {
    return <Loading />;
  }

  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('inscription_avec_noms_navigation_title')} />
      <VStack className="flex-1">
        <Text className="text-typography-white text-xl text-center">
          {t('nombre_joueurs', { nb: joueurs.length })}
        </Text>
        <Inscriptions
          listeJoueurs={joueurs}
          preparationTournoi={preparationTournoiVM}
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
            preparationTournoi={preparationTournoiVM}
            listeJoueurs={joueurs}
          />
        </Box>
      </VStack>
    </VStack>
  );
};

export default InscriptionsAvecNoms;
