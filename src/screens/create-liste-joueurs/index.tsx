import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import Inscriptions from '@components/Inscriptions';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { listeType } from '@/types/types/searchParams';
import SubmitButton from './components/SubmitButton';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useJoueursV2 } from '@/repositories/joueurs/useJoueurs';
import { useJoueursPreparationTournois } from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import Loading from '@/components/Loading';
import { JoueurType } from '@/types/enums/joueurType';

export interface Props {
  type: listeType;
  idList?: number;
}

const CreateListeJoueur: React.FC<Props> = ({ type, idList }) => {
  const { t } = useTranslation();

  const listesJoueurs: JoueurModel[] = [];

  const { preparationTournoiVM } = usePreparationTournoi();
  const preparationTournoiJoueurs: JoueurModel[] = [];

  const { renameJoueur, checkJoueur } = useJoueursV2();
  const {
    addJoueursPreparationTournoi,
    removeJoueursPreparationTournoi,
    removeAllJoueursPreparationTournoi,
  } = useJoueursPreparationTournois();

  const handleAddJoueur = async (
    joueurName: string,
    joueurType: JoueurType | undefined,
  ) => {
    if (!preparationTournoiVM) return;
    const { typeEquipes } = preparationTournoiVM;
    if (!typeEquipes) return;
    const equipe = undefined;
    const joueur: JoueurModel = {
      joueurTournoiId: preparationTournoiJoueurs.length,
      name: joueurName,
      type: joueurType,
      equipe: equipe,
      isChecked: false,
    };

    await addJoueursPreparationTournoi(joueur);
  };

  const handleDeleteJoueur = () => {
    removeJoueursPreparationTournoi(id);
  };

  const handleAddEquipeJoueur = () => { };

  const handleUpdateName = (joueurModel: JoueurModel, name: string) => {
    renameJoueur(joueurModel.joueurTournoiId, name);
  };

  const handleCheckJoueur = (joueurModel: JoueurModel, isChecked: boolean) => {
    checkJoueur(joueurModel.joueurTournoiId, isChecked);
  };

  const handleDeleteAllJoueurs = () => {
    removeAllJoueursPreparationTournoi();
  };

  if (!preparationTournoiJoueurs || !preparationTournoiVM) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-custom-background">
        <TopBarBack title={t('creation_liste_joueurs_navigation_title')} />
        <VStack className="flex-1 justify-between">
          <Text className="text-typography-white text-xl text-center">
            {t('nombre_joueurs', { nb: listesJoueurs.length })}
          </Text>
          <Inscriptions
            loadListScreen={true}
            listeJoueurs={preparationTournoiJoueurs}
            preparationTournoi={preparationTournoiVM}
            onAddJoueur={handleAddJoueur}
            onDeleteJoueur={handleDeleteJoueur}
            onAddEquipeJoueur={handleAddEquipeJoueur}
            onUpdateName={handleUpdateName}
            onCheckJoueur={handleCheckJoueur}
            onDeleteAllJoueurs={handleDeleteAllJoueurs}
          />
          <Box className="px-10">
            <SubmitButton
              type={type}
              listesJoueurs={listesJoueurs}
              idList={idList}
            />
          </Box>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default CreateListeJoueur;
