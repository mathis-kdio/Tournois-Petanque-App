import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import React from 'react';
import { JoueurModel } from '@/types/interfaces/joueurModel';

export interface Props {
  joueur: JoueurModel;
  renommerOn: boolean;
  setRenommerOn: (value: React.SetStateAction<boolean>) => void;
  setJoueurText: (value: React.SetStateAction<string>) => void;
  handleRenommerJoueur: () => void;
}

const JoueurName: React.FC<Props> = ({
  joueur,
  renommerOn,
  setRenommerOn,
  setJoueurText,
  handleRenommerJoueur,
}) => {
  const { name, joueurTournoiId } = joueur;

  const joueurTxtInputChanged = (text: string) => {
    setJoueurText(text);
    setRenommerOn(true);
  };

  if (renommerOn) {
    return (
      <Input variant="underlined">
        <InputField
          className="text-typography-white placeholder:text-typography-white"
          placeholder={name}
          autoFocus={true}
          onChangeText={joueurTxtInputChanged}
          onSubmitEditing={handleRenommerJoueur}
        />
      </Input>
    );
  } else {
    return (
      <Text className="text-typography-white text-xl font-bold break-words">
        {`${joueurTournoiId + 1}-${name}`}
      </Text>
    );
  }
};

export default JoueurName;
