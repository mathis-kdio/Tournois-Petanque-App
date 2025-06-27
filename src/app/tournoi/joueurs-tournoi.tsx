import { FlatList } from '@/components/ui/flat-list';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ButtonText, Button } from '@/components/ui/button';
import ListeJoueurItem from '@components/ListeJoueurItem';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Joueur } from '@/types/interfaces/joueur';
import { ListRenderItem } from 'react-native';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

const JoueursTournoi = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const tournoi = useSelector((state: any) => state.gestionMatchs.listematchs);

  const _retourMatchs = () => {
    router.navigate('/tournoi');
  };

  const _displayListeJoueur = (optionsTournoi: OptionsTournoi) => {
    if (optionsTournoi.listeJoueurs !== undefined) {
      const renderItem: ListRenderItem<Joueur> = ({ item }) => (
        <ListeJoueurItem
          joueur={item}
          isInscription={false}
          avecEquipes={optionsTournoi.mode === ModeTournoi.AVECEQUIPES}
          typeEquipes={optionsTournoi.typeEquipes}
          modeTournoi={optionsTournoi.mode}
          typeTournoi={optionsTournoi.typeTournoi}
          nbJoueurs={optionsTournoi.listeJoueurs.length}
          showCheckbox={true}
        />
      );

      return (
        <FlatList
          removeClippedSubviews={false}
          data={optionsTournoi.listeJoueurs}
          keyExtractor={(item: Joueur) => item.id.toString()}
          renderItem={renderItem}
        />
      );
    }
  };

  const optionsTournoi = tournoi.at(-1) as OptionsTournoi;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-custom-background">
        <TopBarBack title={t('liste_joueurs_inscrits_navigation_title')} />
        <Text className="text-white text-xl text-center">
          {t('nombre_joueurs', { nb: optionsTournoi.listeJoueurs.length })}
        </Text>
        <VStack className="flex-1 my-2">
          {_displayListeJoueur(optionsTournoi)}
        </VStack>
        <Box className="px-10 mb-2">
          <Button action="primary" onPress={() => _retourMatchs()}>
            <ButtonText>{t('retour_liste_matchs_bouton')}</ButtonText>
          </Button>
        </Box>
      </VStack>
    </SafeAreaView>
  );
};

export default JoueursTournoi;
