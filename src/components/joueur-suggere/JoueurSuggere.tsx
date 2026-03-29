import JoueurTypeSelect from '@/components/JoueurTypeSelect';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { JoueurSuggestionModel } from '@/types/interfaces/joueurSuggestionModel';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import RemoveSuggereAlertDialog from './RemoveSuggereAlertDialog';

export interface Props {
  joueur: JoueurSuggestionModel;
  optionsTournoi: PreparationTournoiModel;
  onAddJoueur: (
    joueurName: string,
    joueurType: JoueurTypeEnum | undefined,
  ) => Promise<void>;
}

const JoueurSuggere: React.FC<Props> = ({
  joueur,
  optionsTournoi,
  onAddJoueur,
}) => {
  const [joueurType, setJoueurType] = useState<JoueurTypeEnum | undefined>(
    undefined,
  );
  const [modalRemoveIsOpen, setModalRemoveIsOpen] = useState(false);

  const { name, id } = joueur;

  const addJoueur = async () => {
    await onAddJoueur(name, joueurType);
  };

  return (
    <HStack className="border border-custom-bg-inverse rounded-xl m-1 px-1 items-center">
      <Box className="flex-1">
        <Text className="text-typography-white text-xl font-bold break-words">
          {name}
        </Text>
      </Box>
      <Box className="flex-1">
        <JoueurTypeSelect
          joueurType={joueurType}
          optionsTournoi={optionsTournoi}
          handleSetJoueurType={setJoueurType}
        />
      </Box>
      <Box className="ml-2">
        <FontAwesome5.Button
          name="times"
          backgroundColor="#E63535"
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={() => setModalRemoveIsOpen(true)}
        />
      </Box>
      <Box className="ml-2">
        <FontAwesome5.Button
          name="plus"
          backgroundColor="#348352"
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={addJoueur}
        />
      </Box>
      <RemoveSuggereAlertDialog
        id={id}
        modalRemoveIsOpen={modalRemoveIsOpen}
        setModalRemoveIsOpen={setModalRemoveIsOpen}
      />
    </HStack>
  );
};

export default JoueurSuggere;
