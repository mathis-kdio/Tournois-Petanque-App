import { Box } from '@/components/ui/box';
import React, { useState } from 'react';
import { Button, ButtonIcon } from '../ui/button';
import { CloseIcon } from '../ui/icon';

export interface Props {
  joueurUniqueBDDId: number;
  isInscription: boolean;
  setRenommerOn: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteJoueur: (id: number) => Promise<void>;
}

const DeleteJoueurButton: React.FC<Props> = ({
  joueurUniqueBDDId,
  isInscription,
  setRenommerOn,
  onDeleteJoueur,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const supprimerJoueur = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setRenommerOn(false);

    await onDeleteJoueur(joueurUniqueBDDId);
    setIsLoading(false);
  };

  if (!isInscription) {
    return;
  }

  return (
    <Box className="ml-2">
      <Button
        isDisabled={isLoading}
        className="bg-error-500"
        onPress={supprimerJoueur}
      >
        <ButtonIcon as={CloseIcon} />
      </Button>
    </Box>
  );
};

export default DeleteJoueurButton;
