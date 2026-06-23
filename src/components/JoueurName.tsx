import { Text } from '@/components/ui/text';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import React from 'react';

export type EquipeId = 1 | 2;

export interface Props {
  joueur: JoueurModel;
  equipeId: EquipeId;
  size: 'md' | 'xl';
}

const JoueurName: React.FC<Props> = ({ joueur, equipeId, size }) => {
  if (equipeId === 1) {
    return (
      <Text
        key={joueur.joueurTournoiId}
        className="text-typography-white text-left"
        size={size}
      >
        {`${joueur.joueurTournoiId + 1} ${joueur.name}`}
      </Text>
    );
  } else {
    return (
      <Text
        key={joueur.joueurTournoiId}
        className="text-typography-white text-md text-right"
      >
        {`${joueur.name} ${joueur.joueurTournoiId + 1}`}
      </Text>
    );
  }
};

export default JoueurName;
