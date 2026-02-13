import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import { JoueurType } from '@/types/enums/joueurType';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';

export interface Props {
  joueurType: JoueurType | undefined;
  typeEquipes: TypeEquipes;
  modeTournoi: ModeTournoi;
  typeTournoi: TypeTournoi;
}

const JoueurTypeIcon: React.FC<Props> = ({
  joueurType,
  typeEquipes,
  modeTournoi,
  typeTournoi,
}) => {
  if (joueurType === undefined) {
    return;
  }
  const showTireurPointeur =
    modeTournoi === ModeTournoi.SAUVEGARDE ||
    (typeTournoi === TypeTournoi.MELEDEMELE &&
      (typeEquipes === TypeEquipes.DOUBLETTE ||
        typeEquipes === TypeEquipes.TRIPLETTE));
  if (showTireurPointeur) {
    return (
      <Box>
        {joueurType === JoueurType.ENFANT && (
          <FontAwesome5 name="child" color="darkgray" size={24} />
        )}
        {joueurType === JoueurType.TIREUR && (
          <Image
            source={require('@assets/images/tireur.png')}
            alt="tireur"
            className="w-[30px] h-[30px]"
          />
        )}
        {joueurType === JoueurType.POINTEUR && (
          <Image
            source={require('@assets/images/pointeur.png')}
            alt="tireur"
            className="w-[30px] h-[30px]"
          />
        )}
      </Box>
    );
  } else {
    return (
      <Box>
        {joueurType === JoueurType.ENFANT && (
          <FontAwesome5 name="child" color="darkgray" size={24} />
        )}
      </Box>
    );
  }
};

export default JoueurTypeIcon;
