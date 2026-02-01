import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCallback, useEffect, useState } from 'react';
import TopBarBack from '@/components/topBar/TopBarBack';
import { useTranslation } from 'react-i18next';
import { Divider } from '@/components/ui/divider';
import { Complement } from '@/types/enums/complement';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import Loading from '@/components/Loading';
import { usePreparationTournoiV2 } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { useJoueursPreparationTournoisV2 } from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';
import ComplementCard from '@/screens/complement/components/ComplementCard';
import { screenStackNameType } from '@/types/types/searchParams';

export interface Props {
  screenStackName: screenStackNameType;
}

const ChoixComplement: React.FC<Props> = ({ screenStackName }) => {
  const { t } = useTranslation();

  const { preparationTournoiVM } = usePreparationTournoiV2();

  const { joueurs } = useJoueursPreparationTournoisV2(preparationTournoiVM?.id);

  const [options, setOptions] = useState<Complement[]>([]);

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

  const prepareComplements = useCallback(
    (typeEquipes: TypeEquipes, nbJoueurs: number) => {
      switch (typeEquipes) {
        case TypeEquipes.TETEATETE:
          throw new Error('Complement TETEATETE impossible');
        case TypeEquipes.DOUBLETTE:
          setOptions(complementDoublette(nbJoueurs));
          break;
        case TypeEquipes.TRIPLETTE:
          setOptions(complementTriplette(nbJoueurs));
          break;
      }
    },
    [],
  );

  useEffect(() => {
    if (!preparationTournoiVM || !joueurs) {
      return;
    }
    const { typeEquipes } = preparationTournoiVM;
    if (!typeEquipes) {
      return;
    }
    prepareComplements(typeEquipes, joueurs.length);
  }, [joueurs, preparationTournoiVM, prepareComplements]);

  if (!preparationTournoiVM || !joueurs) {
    return <Loading />;
  }

  const { typeEquipes, avecTerrains } = preparationTournoiVM;
  if (!typeEquipes || !avecTerrains) {
    throw Error;
  }

  const nbModulo = typeEquipes === TypeEquipes.DOUBLETTE ? '4' : '6';

  return (
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
            <ComplementCard
              complement={complement}
              screenStackName={screenStackName}
              avecTerrains={avecTerrains}
            />
            {index + 1 !== options.length && <Divider className="mt-5 h-1" />}
          </VStack>
        ))}
      </VStack>
    </ScrollView>
  );
};

export default ChoixComplement;
