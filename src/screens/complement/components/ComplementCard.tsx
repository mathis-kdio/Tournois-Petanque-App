import { VStack } from '@/components/ui/vstack';
import CardButton from '@/components/buttons/CardButton';
import { Complement } from '@/types/enums/complement';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { screenStackNameType } from '@/types/types/searchParams';
import { useDispatch } from 'react-redux';

interface Props {
  complement: Complement;
  screenStackName: screenStackNameType;
  avecTerrains: boolean;
}

const ComplementCard: React.FC<Props> = ({
  complement,
  screenStackName,
  avecTerrains,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const navigate = (
    complement: Complement,
    screenStackName: screenStackNameType,
    avecTerrains: boolean,
  ) => {
    const updateOptionComplement = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['complement', complement],
    };
    dispatch(updateOptionComplement);

    const screenName = avecTerrains ? 'liste-terrains' : 'generation-matchs';
    router.navigate({
      pathname: `/inscriptions/${screenName}`,
      params: {
        screenStackName: screenStackName,
      },
    });
  };

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
        navigate={() => navigate(complement, screenStackName, avecTerrains)}
        newBadge={false}
      />
    </VStack>
  );
};
export default ComplementCard;
