import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import CardButton from '@components/buttons/CardButton';
import { useTranslation } from 'react-i18next';
import { Divider } from '@/components/ui/divider';
import { Complement } from '@/types/enums/complement';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { screenStackNameType } from '@/types/types/searchParams';
import Loading from '@/components/Loading';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';

type SearchParams = {
  screenStackName?: string;
};

const ChoixComplement = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const param = useLocalSearchParams<SearchParams>();
  const dispatch = useDispatch();

  const { getActualPreparationTournoi } = usePreparationTournoi();

  const [preparationTournoiModel, setPreparationTournoiModel] = useState<
    PreparationTournoiModel | undefined
  >(undefined);

  const [options, setOptions] = useState<Complement[]>([]);

  const listesJoueurs = useSelector(
    (state: any) => state.listesJoueurs.listesJoueurs,
  );

  useEffect(() => {
    const fetchData = async () => {
      const resultpreparationTournoi = await getActualPreparationTournoi();
      setPreparationTournoiModel(resultpreparationTournoi);
    };
    fetchData();
  }, [getActualPreparationTournoi]);

  const prepareComplements = useCallback(
    (typeEquipes: TypeEquipes, nbJoueurs: number) => {
      let options: Complement[] = [];
      switch (typeEquipes) {
        case TypeEquipes.TETEATETE:
          throw new Error('Complement TETEATETE impossible');
        case TypeEquipes.DOUBLETTE:
          options = complementDoublette(nbJoueurs);
          break;
        case TypeEquipes.TRIPLETTE:
          options = complementTriplette(nbJoueurs);
          break;
      }
      setOptions(options);
    },
    [],
  );

  useEffect(() => {
    if (!preparationTournoiModel) return;
    const { typeEquipes, mode } = preparationTournoiModel;
    if (!typeEquipes || !mode) return;
    let nbJoueurs = listesJoueurs[mode].length;
    prepareComplements(typeEquipes, nbJoueurs);
  }, [listesJoueurs, preparationTournoiModel, prepareComplements]);

  if (!preparationTournoiModel) {
    return <Loading />;
  }

  const _navigate = (
    complement: Complement,
    screenStackName: screenStackNameType,
    avecTerrains: boolean,
  ) => {
    const updateOptionComplement = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['complement', complement],
    };
    dispatch(updateOptionComplement);

    let screenName = avecTerrains ? 'liste-terrains' : 'generation-matchs';
    router.navigate({
      pathname: `/inscriptions/${screenName}`,
      params: {
        screenStackName: screenStackName,
      },
    });
  };

  const complementDoublette = (nbJoueurs: number): Complement[] => {
    switch (nbJoueurs % 4) {
      case 1:
        return [Complement.TROISVSDEUX];
      case 2:
        return [Complement.TETEATETE, Complement.TRIPLETTE];
      case 3:
        if (nbJoueurs === 7) {
          return [Complement.DEUXVSUN];
        }
        return [
          Complement.DEUXVSUN,
          Complement.TROIS_VS_TROIS_ET_TROIS_VS_DEUX,
        ];
      default:
        throw new Error('Nombre de joueurs ne nécessitant pas un complément');
    }
  };

  const complementTriplette = (nbJoueurs: number): Complement[] => {
    switch (nbJoueurs % 6) {
      case 1:
        return [Complement.QUATREVSTROIS];
      case 2:
        return [Complement.TETEATETE];
      case 3:
        return [Complement.DEUXVSUN];
      case 4:
        return [Complement.DOUBLETTES];
      case 5:
        return [Complement.TROISVSDEUX];
      default:
        throw new Error('Nombre de joueurs ne nécessitant pas un complément');
    }
  };

  const card = (
    complement: Complement,
    screenStackName: screenStackNameType,
    avecTerrains: boolean,
  ) => {
    const complementTextMap: Record<
      Complement,
      { text: string; icons: string[] }
    > = {
      [Complement.TETEATETE]: {
        text: t('1contre1'),
        icons: ['user-alt', 'handshake', 'user-alt'],
      },
      [Complement.DOUBLETTES]: {
        text: t('2contre2'),
        icons: ['user-friends', 'handshake', 'user-friends'],
      },
      [Complement.TRIPLETTE]: {
        text: t('3contre3'),
        icons: ['users', 'handshake', 'users'],
      },
      [Complement.DEUXVSUN]: {
        text: t('2contre1'),
        icons: ['user-friends', 'handshake', 'user-alt'],
      },
      [Complement.TROISVSDEUX]: {
        text: t('3contre2'),
        icons: ['users', 'handshake', 'user-friends'],
      },
      [Complement.QUATREVSTROIS]: {
        text: t('4contre3'),
        icons: ['users', 'handshake', 'users'],
      },
      [Complement.TROIS_VS_TROIS_ET_TROIS_VS_DEUX]: {
        text: t('3contre3_et_3contre2'),
        icons: [
          'users',
          'handshake',
          'users',
          'plus',
          'users',
          'handshake',
          'user-friends',
        ],
      },
    };
    const item = complementTextMap[complement];
    return (
      <VStack className="flex-1">
        <CardButton
          text={item.text}
          icons={item.icons}
          navigate={() => _navigate(complement, screenStackName, avecTerrains)}
          newBadge={false}
        />
      </VStack>
    );
  };

  const { typeEquipes, avecTerrains } = preparationTournoiModel;
  if (!typeEquipes || !avecTerrains) {
    throw Error;
  }

  const nbModulo = typeEquipes === TypeEquipes.DOUBLETTE ? '4' : '6';

  const { screenStackName } = param;
  if (
    screenStackName !== 'inscriptions-avec-noms' &&
    screenStackName !== 'inscriptions-sans-noms'
  ) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-custom-background">
        <TopBarBack title={t('choix_complement')} />
        <VStack space="2xl" className="flex-1 px-10">
          <Text size={'lg'} className="text-typography-white text-center">
            {t('choix_complement_title_1', { nbModulo: nbModulo })}
          </Text>
          <Text size={'lg'} className="text-typography-white text-center">
            {t('choix_complement_title_2')}
          </Text>
          {options.map((complement, index) => (
            <VStack key={index}>
              {card(complement, screenStackName, avecTerrains)}
              {index + 1 !== options.length && <Divider className="mt-5 h-1" />}
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChoixComplement;
