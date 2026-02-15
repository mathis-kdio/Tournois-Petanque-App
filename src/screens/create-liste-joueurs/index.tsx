import Loading from '@/components/Loading';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useJoueurs } from '@/repositories/joueurs/useJoueurs';
import { JoueurType } from '@/types/enums/joueurType';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { listeType } from '@/types/types/searchParams';
import Inscriptions from '@components/Inscriptions';
import { useTranslation } from 'react-i18next';
import SubmitButton from './components/SubmitButton';
import { useCreateListeJoueur } from './hooks/useCreateListeJoueur';

export interface Props {
  type: listeType;
  idList: number;
}

const CreateListeJoueur: React.FC<Props> = ({ type, idList }) => {
  const { t } = useTranslation();

  const { renameJoueur, checkJoueur, addEquipeJoueur } = useJoueurs();
  const {
    listeJoueurs,
    removeAllJoueursList,
    removeJoueurList,
    addJoueurInList,
  } = useCreateListeJoueur(idList);

  const handleAddJoueur = async (
    joueurName: string,
    joueurType: JoueurType | undefined,
  ) => {
    await addJoueurInList(joueurName, joueurType, idList);
  };

  const handleDeleteJoueur = async (id: number) => {
    await removeJoueurList(id);
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
    await removeAllJoueursList(idList);
  };

  if (!listeJoueurs) {
    return <Loading />;
  }

  const preparationTournoi: PreparationTournoiModel = {
    id: 0,
    typeEquipes: TypeEquipes.TETEATETE,
    mode: ModeTournoi.AVECNOMS,
    typeTournoi: TypeTournoi.MELEDEMELE,
  };

  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('creation_liste_joueurs_navigation_title')} />
      <VStack className="flex-1 justify-between">
        <Text className="text-typography-white text-xl text-center">
          {t('nombre_joueurs', { nb: listeJoueurs.length })}
        </Text>
        <Inscriptions
          loadListScreen={true}
          listeJoueurs={listeJoueurs}
          preparationTournoi={preparationTournoi}
          onAddJoueur={handleAddJoueur}
          onDeleteJoueur={handleDeleteJoueur}
          onAddEquipeJoueur={handleAddEquipeJoueur}
          onUpdateName={handleUpdateName}
          onCheckJoueur={handleCheckJoueur}
          onDeleteAllJoueurs={handleDeleteAllJoueurs}
        />
        <Box className="px-10">
          <SubmitButton type={type} listeJoueurs={listeJoueurs} />
        </Box>
      </VStack>
    </VStack>
  );
};

export default CreateListeJoueur;
