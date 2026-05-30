import { Box } from '@/components/ui/box';
import { useJoueursPreparationTournois } from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';

export interface Props {
  joueurUniqueBDDId: number;
  isInscription: boolean;
  typeEquipes: TypeEquipes;
  setRenommerOn: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteJoueur: (id: number) => Promise<void>;
}

const DeleteJoueurButton: React.FC<Props> = ({
  joueurUniqueBDDId,
  isInscription,
  typeEquipes,
  setRenommerOn,
  onDeleteJoueur,
}) => {
  const isLoadingRef = useRef(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { updateJoueursEquipe } = useJoueursPreparationTournois();

  const supprimerJoueur = async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsDisabled(true);
    setRenommerOn(false);

    await onDeleteJoueur(joueurUniqueBDDId);
    if (typeEquipes === TypeEquipes.TETEATETE) {
      await updateJoueursEquipe();
    }
    isLoadingRef.current = false;
    setIsDisabled(false);
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
        disabled={isDisabled}
      />
    </Box>
  );
};

export default DeleteJoueurButton;
