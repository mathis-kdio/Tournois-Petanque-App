import { Box } from '@/components/ui/box';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';

export interface Props {
  joueurUniqueBDDId: number;
  isInscription: boolean;
  typeEquipes: TypeEquipes;
  setRenommerOn: (value: React.SetStateAction<boolean>) => void;
  onDeleteJoueur: (id: number) => void;
}

const DeleteJoueurButton: React.FC<Props> = ({
  joueurUniqueBDDId,
  isInscription,
  typeEquipes,
  setRenommerOn,
  onDeleteJoueur,
}) => {
  const supprimerJoueur = () => {
    setRenommerOn(false);
    onDeleteJoueur(joueurUniqueBDDId);

    if (typeEquipes === TypeEquipes.TETEATETE) {
      //TODO
      /*const actionUpdateEquipe = {
        type: 'UPDATE_ALL_JOUEURS_EQUIPE',
        value: [modeTournoi],
      };
      dispatch(actionUpdateEquipe);*/
    }
  };

  if (!isInscription) {
    return;
  }

  return (
    <Box className="ml-2">
      <FontAwesome5.Button
        name="times"
        backgroundColor="#E63535"
        iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
        onPress={supprimerJoueur}
      />
    </Box>
  );
};

export default DeleteJoueurButton;
