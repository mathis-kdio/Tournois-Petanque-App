import CardButton from '@/components/buttons/CardButton';
import { VStack } from '@/components/ui/vstack';
import { updateComplementPreparationTournoi } from '@/repositories/preparationTournoi/preparationTournoiActions';
import { Complement } from '@/types/enums/complement';
import { screenStackNameType } from '@/types/types/searchParams';
import { FontAwesomeIconName } from '@react-native-vector-icons/fontawesome';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

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

  const navigate = async () => {
    await updateComplementPreparationTournoi(complement);

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
    { text: string; icons: FontAwesomeIconName[] }
  > = {
    [Complement.TETEATETE]: {
      text: t('1contre1'),
      icons: ['user', 'handshake-o', 'user'],
    },
    [Complement.DOUBLETTES]: {
      text: t('2contre2'),
      icons: ['user', 'user', 'handshake-o', 'user', 'user'],
    },
    [Complement.TRIPLETTE]: {
      text: t('3contre3'),
      icons: ['users', 'handshake-o', 'users'],
    },
    [Complement.DEUXVSUN]: {
      text: t('2contre1'),
      icons: ['user', 'user', 'handshake-o', 'user'],
    },
    [Complement.TROISVSDEUX]: {
      text: t('3contre2'),
      icons: ['users', 'handshake-o', 'user', 'user'],
    },
    [Complement.QUATREVSTROIS]: {
      text: t('4contre3'),
      icons: ['users', 'user', 'handshake-o', 'users'],
    },
    [Complement.TROIS_VS_TROIS_ET_TROIS_VS_DEUX]: {
      text: t('3contre3_et_3contre2'),
      icons: [
        'users',
        'handshake-o',
        'users',
        'plus',
        'users',
        'handshake-o',
        'user',
        'user',
      ],
    },
  };

  const item = complementTextMap[complement];

  return (
    <VStack className="flex-1">
      <CardButton
        text={item.text}
        icons={item.icons}
        navigate={() => navigate()}
        newBadge={false}
      />
    </VStack>
  );
};
export default ComplementCard;
