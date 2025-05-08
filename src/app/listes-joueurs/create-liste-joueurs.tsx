import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import Inscriptions from '@components/Inscriptions';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { StackNavigationProp } from '@react-navigation/stack';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

type CreateListeJoueurRouteProp = {
  params: {
    type: string;
    listId: number;
  };
};

const CreateListeJoueur = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const route = useRoute<CreateListeJoueurRouteProp>();
  const dispatch = useDispatch();

  const listesJoueurs = useSelector(
    (state: any) => state.listesJoueurs.listesJoueurs,
  );

  const _dispatch = (type: string, listId: number) => {
    if (type === 'create') {
      const addSavedList = {
        type: 'ADD_SAVED_LIST',
        value: {
          typeInscription: ModeTournoi.AVECNOMS,
          savedList: listesJoueurs.sauvegarde,
        },
      };
      dispatch(addSavedList);
    } else if (type === 'edit' && listId !== undefined) {
      const updateSavedList = {
        type: 'UPDATE_SAVED_LIST',
        value: {
          typeInscription: ModeTournoi.AVECNOMS,
          listId: listId,
          savedList: listesJoueurs.sauvegarde,
        },
      };
      dispatch(updateSavedList);
    }

    navigation.dispatch(StackActions.pop(1));
  };

  const _submitButton = () => {
    let params = route.params;
    if (params) {
      let nbPlayers = listesJoueurs.sauvegarde.length;
      let title = 'error';
      if (params.type === 'create') {
        title = t('creer_liste');
      } else if (params.type === 'edit') {
        title = t('valider_modification');
      }
      return (
        <Button
          isDisabled={nbPlayers === 0}
          action="positive"
          onPress={() => _dispatch(params.type, params.listId)}
        >
          <ButtonText>{title}</ButtonText>
        </Button>
      );
    }
  };

  let nbJoueurs = 0;
  if (listesJoueurs.sauvegarde) {
    nbJoueurs = listesJoueurs.sauvegarde.length;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-[#0594ae]">
        <TopBarBack
          title={t('creation_liste_joueurs_navigation_title')}
          navigation={navigation}
        />
        <VStack className="flex-1 justify-between">
          <Text className="text-white text-xl text-center">
            {t('nombre_joueurs', { nb: nbJoueurs })}
          </Text>
          <Inscriptions navigation={navigation} loadListScreen={true} />
          <Box className="px-10">{_submitButton()}</Box>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default CreateListeJoueur;
