import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { CheckIcon, CloseIcon, EditIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTerrainsPreparationTournois } from '@/repositories/terrainsPreparationTournois/useTerrainsPreparationTournois';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { IIconComponentType } from '@gluestack-ui/core/lib/esm/icon/creator/createIcon';
import React, { useState } from 'react';
import { ColorValue } from 'react-native';
import { SvgProps } from 'react-native-svg';

export interface Props {
  terrain: TerrainModel;
}

const ListeTerrainItem: React.FC<Props> = ({ terrain }) => {
  const [renommerOn, setRenommerOn] = useState(false);
  const [terrainText, setTerrainText] = useState('');

  const { deleteTerrain, renameTerrain } = useTerrainsPreparationTournois();

  const supprimerTerrain = async (terrain: TerrainModel) => {
    setRenommerOn(false);
    await deleteTerrain(terrain.id);
  };

  const renommerButton = (terrain: TerrainModel) => {
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
    } else if (terrainText === '') {
      name = CloseIcon;
      bgColor = 'bg-[#5F5F5F]';
      action = () => setRenommerOn(false);
    } else {
      name = CheckIcon;
      bgColor = 'bg-success-500';
      action = () => renommerTerrain(terrain);
    }

    return (
      <Box>
        <Button className={bgColor} onPress={action}>
          <ButtonIcon as={name} />
        </Button>
      </Box>
    );
  };

  const renommerTerrain = async (terrain: TerrainModel) => {
    if (terrainText !== '') {
      await renameTerrain(terrain.id, terrainText);
    }
    setRenommerOn(false);
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
        <Button
          className="bg-error-500"
          onPress={() => supprimerTerrain(terrain)}
        >
          <ButtonIcon as={CloseIcon} />
        </Button>
      </HStack>
    </HStack>
  );
};

export default ListeTerrainItem;
