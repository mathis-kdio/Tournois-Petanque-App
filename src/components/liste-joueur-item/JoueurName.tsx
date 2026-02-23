import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import React from 'react';

export interface Props {
  joueur: JoueurModel;
  renommerOn: boolean;
  setRenommerOn: React.Dispatch<React.SetStateAction<boolean>>;
  setJoueurText: React.Dispatch<React.SetStateAction<string>>;
  handleRenommerJoueur: () => Promise<void>;
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
