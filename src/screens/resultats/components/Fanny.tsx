import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import React from 'react';
import { OptionsTournoiModel } from '@/types/interfaces/optionsTournoiModel';
import { MatchModel } from '@/types/interfaces/matchModel';

export interface Props {
  joueur: JoueurModel;
  matchs: MatchModel[];
  options: OptionsTournoiModel;
}

const Fanny: React.FC<Props> = ({ joueur, matchs, options }) => {
  let fanny = false;
  let nbFanny = 0;
  for (let i = 0; i < options.nbMatchs; i++) {
    const match = matchs[i];
    if (match.equipe[0].includes(joueur) && match.score1 === 0) {
      fanny = true;
      nbFanny++;
    } else if (match.equipe[1].includes(joueur) && match.score2 === 0) {
      fanny = true;
      nbFanny++;
    }
  }

  if (!fanny) {
    return;
  }

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
};

export default Fanny;
