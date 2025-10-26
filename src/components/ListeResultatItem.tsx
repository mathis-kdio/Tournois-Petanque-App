import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { Victoire } from '@/types/interfaces/victoire';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { OptionsTournoiModel } from '@/types/interfaces/optionsTournoiModel';
import { MatchModel } from '@/types/interfaces/matchModel';

export interface Props {
  victoire: Victoire;
}

const ListeResultatItem: React.FC<Props> = ({ victoire }) => {
  const { t } = useTranslation();

  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );

  const _displayName = (joueur: JoueurModel) => {
    let joueurName = '';
    if (joueur.name === undefined) {
      joueurName = t('sans_nom') + ' (' + (joueur.id + 1) + ')';
    } else if (joueur.name === '') {
      joueurName = t('joueur') + ' ' + (joueur.id + 1);
    } else {
      joueurName = joueur.name + ' (' + (joueur.id + 1) + ')';
    }

    return <Text className="text-typography-white text-lg">{joueurName}</Text>;
  };

  const _fanny = (joueur: JoueurModel) => {
    let fanny = false;
    let nbFanny = 0;
    const options = listeMatchs.at(-1) as OptionsTournoiModel;
    for (let i = 0; i < options.nbMatchs; i++) {
      const match = listeMatchs[i] as MatchModel;
      if (match.equipe[0].includes(joueur) && match.score1 === 0) {
        fanny = true;
        nbFanny++;
      } else if (match.equipe[1].includes(joueur) && match.score2 === 0) {
        fanny = true;
        nbFanny++;
      }
    }
    if (fanny === true) {
      return (
        <HStack>
          <Image
            size="2xs"
            alt="Fanny"
            source={require('@assets/images/fanny.png')}
          />
          <Text className="text-typography-white text-lg">X{nbFanny}</Text>
        </HStack>
      );
    }
  };

  return (
    <VStack>
      <HStack className="flex px-2 py-0.5">
        <HStack className="basis-2/5">
          <Text className="text-typography-white text-lg">
            {`${victoire.position} - `}
          </Text>
          {_displayName(victoire.joueur)}
        </HStack>
        <Text className="basis-1/5 text-center text-typography-white text-lg">
          {victoire.victoires}
        </Text>
        <Text className="basis-1/5 text-center text-typography-white text-lg">
          {victoire.nbMatchs}
        </Text>
        <HStack className="basis-1/5 justify-end">
          {_fanny(victoire.joueur)}
          <Text className="text-typography-white text-lg">{` ${victoire.points}`}</Text>
        </HStack>
      </HStack>
      <Divider />
    </VStack>
  );
};

export default ListeResultatItem;
