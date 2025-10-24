import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import Inscriptions from '@components/Inscriptions';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { listeType } from '@/types/types/searchParams';
import { ListesJoueursRepository } from '@/repositories/listesJoueursRepository';
import { NewJoueur, NewJoueursListes, NewListesJoueurs } from '@/db/schema';
import { saveJoueurs } from '@/repositories/joueursRepository';
import { saveJoueursListes } from '@/repositories/joueursListesRepository';
import { Joueur } from '@/types/interfaces/joueur';

type SearchParams = {
  type?: string;
  listId?: string;
};

const CreateListeJoueur = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const param = useLocalSearchParams<SearchParams>();
  const dispatch = useDispatch();

  const listesJoueurs = useSelector(
    (state: any) => state.listesJoueurs.listesJoueurs,
  );

  const _dispatch = async (type: string, listId?: number) => {
    if (type === 'create') {
      console.log(listesJoueurs.sauvegarde);
      const a: NewListesJoueurs = {};
      console.log('a', a);
      const z = await ListesJoueursRepository.insertListeJoueurs(a);
      console.log('z', z);

      const b: NewJoueur[] = [];
      listesJoueurs.sauvegarde.forEach((joueur: Joueur) => {
        b.push({
          name: joueur.name,
          equipe: joueur.equipe,
          joueurId: joueur.id,
        });
      });
      console.log('b', b);
      const joueurs = await saveJoueurs(b);
      console.log('joueurs', joueurs);

      const c: NewJoueursListes[] = [];
      joueurs.forEach((joueur) => {
        c.push({ joueurId: joueur.id, listeId: z.at(0)?.id });
      });
      console.log('c', c);
      saveJoueursListes(c);
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

    router.back();
  };

  const _submitButton = (type: listeType, listId: number) => {
    let nbPlayers = listesJoueurs.sauvegarde.length;
    let title = 'error';
    if (type === 'create') {
      title = t('creer_liste');
    } else if (type === 'edit') {
      title = t('valider_modification');
    }

    return (
      <Button
        isDisabled={nbPlayers === 0}
        action="positive"
        onPress={() => _dispatch(type, listId)}
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  };

  let nbJoueurs = 0;
  if (listesJoueurs.sauvegarde) {
    nbJoueurs = listesJoueurs.sauvegarde.length;
  }

  let idList = parseInt(param.listId ?? '');
  if (
    (param.type !== 'create' && param.type !== 'edit') ||
    (param.type === 'edit' && isNaN(idList))
  ) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-custom-background">
        <TopBarBack title={t('creation_liste_joueurs_navigation_title')} />
        <VStack className="flex-1 justify-between">
          <Text className="text-typography-white text-xl text-center">
            {t('nombre_joueurs', { nb: nbJoueurs })}
          </Text>
          <Inscriptions loadListScreen={true} />
          <Box className="px-10">{_submitButton(param.type, idList)}</Box>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default CreateListeJoueur;
