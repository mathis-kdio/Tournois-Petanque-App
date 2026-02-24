import Loading from '@/components/Loading';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useJoueurs } from '@/repositories/joueurs/useJoueurs';
import { useJoueursPreparationTournois } from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { JoueurType } from '@/types/enums/joueurType';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import Inscriptions from '@components/Inscriptions';
import { useTranslation } from 'react-i18next';
import StartButton from './components/StartButton';

const InscriptionsAvecNoms = () => {
  const { t } = useTranslation();

  const { preparationTournoiVM } = usePreparationTournoi();

  const { renameJoueur, checkJoueur, addEquipeJoueur } = useJoueurs();
  const {
    joueurs,
    addJoueursPreparationTournoi,
    removeJoueursPreparationTournoi,
    removeAllJoueursPreparationTournoi,
  } = useJoueursPreparationTournois();

  const equipeAuto = () => {
    if (!preparationTournoiVM) {
      throw Error('preparationTournoiVM devrait être défini');
    }
    const { typeEquipes } = preparationTournoiVM;
    if (!typeEquipes) {
      throw Error('typeEquipes devrait être défini');
    }

    if (typeEquipes === TypeEquipes.TETEATETE) {
      return joueurs.length + 1;
    } else {
      const nbJoueursParEquipe = typeEquipes === TypeEquipes.DOUBLETTE ? 2 : 3;

      // Compter le nombre de joueurs par équipe
      const joueursParEquipe: { [key: number]: number } = {};
      joueurs.forEach((joueur) => {
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
    const equipe = equipeAuto();

    await addJoueursPreparationTournoi(
      joueurs.length,
      joueurName,
      joueurType,
      equipe,
    );
  };

  const handleDeleteJoueur = async (id: number) => {
    await removeJoueursPreparationTournoi(id);
  };

  const handleAddEquipeJoueur = async (
    joueurModel: JoueurModel,
    equipeId: number,
  ) => {
    await addEquipeJoueur(joueurModel.uniqueBDDId, equipeId);
  };

  const handleUpdateName = async (joueurModel: JoueurModel, name: string) => {
    await renameJoueur(joueurModel.uniqueBDDId, name);
  };

  const handleCheckJoueur = async (
    joueurModel: JoueurModel,
    isChecked: boolean,
  ) => {
    await checkJoueur(joueurModel.uniqueBDDId, isChecked);
  };

  const handleDeleteAllJoueurs = async () => {
    await removeAllJoueursPreparationTournoi();
  };

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
