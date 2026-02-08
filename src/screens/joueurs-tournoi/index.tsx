import { FlatList } from '@/components/ui/flat-list';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ButtonText, Button } from '@/components/ui/button';
import ListeJoueurItem from '@components/ListeJoueurItem';
import { useTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { ListRenderItem } from 'react-native';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { useRouter } from 'expo-router';
import { useTournois } from '@/repositories/tournois/useTournois';
import Loading from '@/components/Loading';

const JoueursTournoi = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { actualTournoi, joueursTournoi } = useTournois();

  if (!actualTournoi || !joueursTournoi) {
    return <Loading />;
  }

  const { options, tournoiId } = actualTournoi;

  const retourMatchs = () => {
    router.navigate('/tournoi');
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
        nbJoueurs={joueursTournoi.length}
        showCheckbox={true}
        tournoiID={tournoiId}
        listesJoueurs={joueursTournoi}
        onDeleteJoueur={() => ''}
        onAddEquipeJoueur={() => ''}
        onUpdateName={() => ''}
        onCheckJoueur={() => ''}
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
