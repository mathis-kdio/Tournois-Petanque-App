import { Box } from '@/components/ui/box';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';

export interface Props {
  renommerOn: boolean;
  setRenommerOn: React.Dispatch<React.SetStateAction<boolean>>;
  joueurText: string;
  handleRenommerJoueur: () => Promise<void>;
}

const RenameJoueurButton: React.FC<Props> = ({
  renommerOn,
  setRenommerOn,
  joueurText,
  handleRenommerJoueur,
}) => {
  let name: string;
  let bgColor: string;
  let action;
  if (!renommerOn) {
    name = 'edit';
    bgColor = '#004282';
    action = () => setRenommerOn(true);
  } else if (joueurText === '') {
    name = 'times';
    bgColor = '#5F5F5F';
    action = () => setRenommerOn(false);
  } else {
    name = 'check';
    bgColor = '#348352';
    action = async () => await handleRenommerJoueur();
  }

  return (
    <Box>
      <FontAwesome5.Button
        name={name}
        backgroundColor={bgColor}
        iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
        onPress={action}
      />
    </Box>
  );
};

export default RenameJoueurButton;
