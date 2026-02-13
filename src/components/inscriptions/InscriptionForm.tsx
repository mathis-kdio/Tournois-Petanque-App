import JoueurTypeSelect from '@/components/JoueurTypeSelect';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  preparationTournoi: PreparationTournoiModel;
  onAddJoueur: (
    joueurName: string,
    joueurType: JoueurTypeEnum | undefined,
  ) => void;
}

const InscriptionForm: React.FC<Props> = ({
  preparationTournoi,
  onAddJoueur,
}) => {
  const { t } = useTranslation();

  const [joueurType, setJoueurType] = useState<JoueurTypeEnum | undefined>(
    undefined,
  );
  const [etatBouton, setEtatBouton] = useState(false);
  const [joueurText, setJoueurText] = useState('');

  const addPlayerTextInput = React.createRef<any>();

  const ajoutJoueurTextInputChanged = (text: string) => {
    setJoueurText(text);
    setEtatBouton(text !== '');
  };

  useEffect(() => {
    if (etatBouton === false && addPlayerTextInput.current) {
      addPlayerTextInput.current.clear();
      addPlayerTextInput.current.focus();
    }
  }, [addPlayerTextInput, etatBouton]);

  const ajoutJoueurFormulaire = () => {
    if (joueurText === '') {
      return;
    }

    onAddJoueur(joueurText, joueurType);

    setJoueurText('');
    setJoueurType(undefined);
    setEtatBouton(false);
  };

  return (
    <HStack space="md" className="items-center mx-1">
      <Box className="flex-1">
        <Input className="border-custom-bg-inverse">
          <InputField
            className="text-typography-white placeholder:text-typography-white"
            placeholder={t('nom')}
            autoFocus={true}
            keyboardType="default"
            onChangeText={(text) => ajoutJoueurTextInputChanged(text)}
            onSubmitEditing={ajoutJoueurFormulaire}
            ref={addPlayerTextInput}
          />
        </Input>
      </Box>
      <Box className="flex-1">
        <JoueurTypeSelect
          joueurType={joueurType}
          optionsTournoi={preparationTournoi}
          handleSetJoueurType={setJoueurType}
        />
      </Box>
      <Box>
        <Button
          action="positive"
          isDisabled={!etatBouton}
          onPress={ajoutJoueurFormulaire}
          size="md"
        >
          <ButtonText>{t('ajouter')}</ButtonText>
        </Button>
      </Box>
    </HStack>
  );
};

export default InscriptionForm;
