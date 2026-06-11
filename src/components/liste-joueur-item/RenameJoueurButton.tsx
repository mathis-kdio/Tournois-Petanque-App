import { Box } from '@/components/ui/box';
import { IIconComponentType } from '@gluestack-ui/core/lib/esm/icon/creator/createIcon';
import React from 'react';
import { ColorValue } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { Button, ButtonIcon } from '../ui/button';
import { CheckIcon, CloseIcon, EditIcon } from '../ui/icon';

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
  let name: IIconComponentType<
    | SvgProps
    | { fill?: ColorValue | undefined; stroke?: ColorValue | undefined }
  >;
  let bgColor: string;
  let action;
  if (!renommerOn) {
    name = EditIcon;
    bgColor = 'bg-primary-500';
    action = () => setRenommerOn(true);
  } else if (joueurText === '') {
    name = CloseIcon;
    bgColor = 'bg-[#5F5F5F]';
    action = () => setRenommerOn(false);
  } else {
    name = CheckIcon;
    bgColor = 'bg-success-500';
    action = async () => await handleRenommerJoueur();
  }

  return (
    <Box>
      <Button className={bgColor} onPress={action}>
        <ButtonIcon as={name} />
      </Button>
    </Box>
  );
};

export default RenameJoueurButton;
