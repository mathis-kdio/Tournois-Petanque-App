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

type SearchParams = {
  screenStackName?: string;
};

const ChoixComplement = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { screenStackName } = useLocalSearchParams<SearchParams>();
  const dispatch = useDispatch();

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );
  const listesJoueurs = useSelector(
    (state: any) => state.listesJoueurs.listesJoueurs,
  );

  const [options, setOptions] = useState<Complement[]>([]);

  const _navigate = (complement: Complement) => {
    const updateOptionComplement = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['complement', complement],
    };
    dispatch(updateOptionComplement);

    const { avecTerrains } = optionsTournoi;
    let screenName = avecTerrains ? 'liste-terrains' : 'generation-matchs';
    router.navigate({
      pathname: `/inscriptions/${screenName}`,
      params: {
        screenStackName: screenStackName,
      },
    });
  };

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

  const complementDoublette = (nbJoueurs: number): Complement[] => {
    switch (nbJoueurs % 4) {
      case 1:
        return [Complement.TROISVSDEUX];
      case 2:
        return [Complement.TETEATETE, Complement.TRIPLETTE];
      case 3:
        return [Complement.DEUXVSUN];
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

  useEffect(() => {
    const { typeEquipes, mode } = optionsTournoi;
    let nbJoueurs = listesJoueurs[mode].length;
    prepareComplements(typeEquipes, nbJoueurs);
  }, [listesJoueurs, optionsTournoi, prepareComplements]);

  const card = (complement: Complement) => {
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
    };
    const item = complementTextMap[complement];
    return (
      <VStack className="flex-1">
        <CardButton
          text={item.text}
          icons={item.icons}
          navigate={() => _navigate(complement)}
          newBadge={false}
        />
      </VStack>
    );
  };

  const { typeEquipes } = optionsTournoi;
  let nbModulo = typeEquipes === TypeEquipes.DOUBLETTE ? '4' : '6';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-[#0594ae]">
        <TopBarBack title={t('choix_complement')} />
        <VStack space="2xl" className="flex-1 px-10">
          <Text size={'lg'} className="text-white text-center">
            {t('choix_complement_title_1', { nbModulo: nbModulo })}
          </Text>
          <Text size={'lg'} className="text-white text-center">
            {t('choix_complement_title_2')}
          </Text>
          {options.map((complement, index) => (
            <VStack key={index}>
              {card(complement)}
              {index + 1 !== options.length && <Divider className="mt-5 h-1" />}
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChoixComplement;
