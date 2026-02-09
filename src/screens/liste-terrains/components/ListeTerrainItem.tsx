import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { useTerrainsPreparationTournois } from '@/repositories/terrainsPreparationTournois/useTerrainsPreparationTournois';

export interface Props {
  terrain: TerrainModel;
}

const ListeTerrainItem: React.FC<Props> = ({ terrain }) => {
  const [renommerOn, setRenommerOn] = useState(false);
  const [terrainText, setTerrainText] = useState('');

  const { deleteTerrain, renameTerrain } = useTerrainsPreparationTournois();

  const supprimerTerrain = (terrain: TerrainModel) => {
    setRenommerOn(false);
    deleteTerrain(terrain.id);
  };

  const renommerButton = (terrain: TerrainModel) => {
    let name: string;
    let bgColor: string;
    let action;
    if (!renommerOn) {
      name = 'edit';
      bgColor = '#004282';
      action = () => setRenommerOn(true);
    } else if (terrainText === '') {
      name = 'times';
      bgColor = '#5F5F5F';
      action = () => setRenommerOn(false);
    } else {
      name = 'check';
      bgColor = '#348352';
      action = () => renommerTerrain(terrain);
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

  const renommerTerrain = (terrain: TerrainModel) => {
    if (terrainText === '') {
      throw Error('renommerTerrain ne devrait pas être possible');
    }

    setRenommerOn(false);

    renameTerrain(terrain.id, terrainText);

    setTerrainText('');
  };

  const terrainTxtInputChanged = (text: string) => {
    setTerrainText(text);
    setRenommerOn(true);
  };

  const getName = (terrain: TerrainModel) => {
    if (renommerOn) {
      return (
        <Input className="border-custom-bg-inverse">
          <InputField
            className="text-typography-white placeholder:text-typography-white"
            placeholder={terrain.name}
            autoFocus={true}
            onChangeText={(text) => terrainTxtInputChanged(text)}
            onSubmitEditing={() => renommerTerrain(terrain)}
          />
        </Input>
      );
    } else {
      return (
        <Text className="text-typography-white">
          {`${terrain.id + 1}- ${terrain.name}`}
        </Text>
      );
    }
  };

  return (
    <HStack space="md" className="px-2 my-2 items-center">
      <Box className="flex-1">{getName(terrain)}</Box>
      <HStack space="md">
        {renommerButton(terrain)}
        <FontAwesome5.Button
          name="times"
          backgroundColor="#E63535"
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={() => supprimerTerrain(terrain)}
        />
      </HStack>
    </HStack>
  );
};

export default ListeTerrainItem;
