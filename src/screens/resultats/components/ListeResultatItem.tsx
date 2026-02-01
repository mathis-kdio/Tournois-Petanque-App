import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { Victoire } from '@/types/interfaces/victoire';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Fanny from './Fanny';
import { MatchModel } from '@/types/interfaces/matchModel';
import { OptionsTournoiModel } from '@/types/interfaces/optionsTournoiModel';

export interface Props {
  victoire: Victoire;
  matchs: MatchModel[];
  options: OptionsTournoiModel;
}

const ListeResultatItem: React.FC<Props> = ({ victoire, matchs, options }) => {
  const { t } = useTranslation();

  const getName = (joueur: JoueurModel) => {
    if (joueur.name === undefined) {
      return t('sans_nom') + ' (' + (joueur.id + 1) + ')';
    } else if (joueur.name === '') {
      return t('joueur') + ' ' + (joueur.id + 1);
    } else {
      return joueur.name + ' (' + (joueur.id + 1) + ')';
    }
  };

  const { joueur, position, victoires, nbMatchs, points } = victoire;

  return (
    <VStack>
      <HStack className="flex px-2 py-0.5">
        <HStack className="basis-2/5">
          <Text className="text-typography-white text-lg">
            {`${position} - `}
          </Text>
          <Text className="text-typography-white text-lg">
            {getName(joueur)}
          </Text>
        </HStack>
        <Text className="basis-1/5 text-center text-typography-white text-lg">
          {victoires}
        </Text>
        <Text className="basis-1/5 text-center text-typography-white text-lg">
          {nbMatchs}
        </Text>
        <HStack className="basis-1/5 justify-end">
          <Fanny joueur={joueur} matchs={matchs} options={options} />
          <Text className="text-typography-white text-lg">{` ${points}`}</Text>
        </HStack>
      </HStack>
      <Divider />
    </VStack>
  );
};

export default ListeResultatItem;
