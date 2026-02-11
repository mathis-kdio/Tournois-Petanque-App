import ListeJoueurItem from '@/components/liste-joueur-item/ListeJoueurItem';
import Loading from '@/components/Loading';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useJoueurs } from '@/repositories/joueurs/useJoueurs';
import { useTournois } from '@/repositories/tournois/useTournois';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';

const JoueursTournoi = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { actualTournoi, joueursTournoi } = useTournois();
  const { renameJoueur, checkJoueur } = useJoueurs();

  if (!actualTournoi || !joueursTournoi) {
    return <Loading />;
  }

  const { options } = actualTournoi;

  const retourMatchs = () => {
    router.navigate('/tournoi');
  };

  const onDeleteJoueur = () => {
    throw new Error('Impossible de supprimer un joueur dans un tournoi lancé');
  };

  const onAddEquipeJoueur = () => {
    throw new Error(
      "Impossible d'ajouter une équipe à un joueur dans un tournoi lancé",
    );
  };

  const onUpdateName = async (joueurModel: JoueurModel, name: string) => {
    await renameJoueur(joueurModel.uniqueBDDId, name);
  };

  const onCheckJoueur = async (
    joueurModel: JoueurModel,
    isChecked: boolean,
  ) => {
    await checkJoueur(joueurModel.uniqueBDDId, isChecked);
  };

  const renderItem: ListRenderItem<JoueurModel> = ({ item }) => {
    const { mode, typeEquipes, typeTournoi } = options;
    return (
      <ListeJoueurItem
        joueur={item}
        isInscription={false}
        avecEquipes={mode === ModeTournoi.AVECEQUIPES}
        typeEquipes={typeEquipes}
        modeTournoi={mode}
        typeTournoi={typeTournoi}
        showCheckbox={true}
        listesJoueurs={joueursTournoi}
        onDeleteJoueur={onDeleteJoueur}
        onAddEquipeJoueur={onAddEquipeJoueur}
        onUpdateName={onUpdateName}
        onCheckJoueur={onCheckJoueur}
      />
    );
  };

  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('liste_joueurs_inscrits_navigation_title')} />
      <Text className="text-typography-white text-xl text-center">
        {t('nombre_joueurs', { nb: joueursTournoi.length })}
      </Text>
      <VStack className="flex-1 my-2">
        <FlatList
          removeClippedSubviews={false}
          data={joueursTournoi}
          keyExtractor={(item: JoueurModel) => item.joueurTournoiId.toString()}
          renderItem={renderItem}
        />
      </VStack>
      <Box className="px-10 mb-2">
        <Button action="primary" onPress={() => retourMatchs()}>
          <ButtonText>{t('retour_liste_matchs_bouton')}</ButtonText>
        </Button>
      </Box>
    </VStack>
  );
};

export default JoueursTournoi;
