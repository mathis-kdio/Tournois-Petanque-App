import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { withTranslation } from 'react-i18next';
import { Terrain } from '@/types/interfaces/terrain';
import { PropsFromRedux, connector } from '@/store/connector';

export interface Props extends PropsFromRedux {
  terrain: Terrain;
}

interface State {
  renommerOn: boolean;
}

class ListeTerrainItem extends React.Component<Props, State> {
  terrainText: string = "";

  constructor(props: Props) {
    super(props)
    this.state = {
      renommerOn: false
    }
  }

  _supprimerTerrain(terrain: Terrain) {
    this.setState({renommerOn: false});
    const actionSuppr = {type: "SUPPR_TERRAIN", value: {terrainId: terrain.id}};
    this.props.dispatch(actionSuppr);
  }

  _showRenommerTerrain(terrain: Terrain) {
    let name: string;
    let bgColor: string;
    let action;
    if (!this.state.renommerOn) {
      name = 'edit';
      bgColor = '#004282';
      action = () => this.setState({renommerOn: true});
    } else if (this.terrainText == '') {
      name = 'times';
      bgColor = '#5F5F5F';
      action = () => this.setState({renommerOn: false});
    } else {
      name = 'check';
      bgColor = '#348352';
      action = () => this._renommerTerrain(terrain);
    }

    return (
      <Box>
        <FontAwesome5.Button name={name} backgroundColor={bgColor} iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={action}/>
      </Box>
    );
  }

  _renommerTerrain(terrain: Terrain) {
    if (this.terrainText != "") {
      this.setState({renommerOn: false});
      const actionRenommer = { type: "RENOMMER_TERRAIN", value: {terrainId: terrain.id, newName: this.terrainText}};
      this.props.dispatch(actionRenommer);
      this.terrainText = "";
    }
  }

  _terrainTxtInputChanged(text: string) {
    this.terrainText = text;
    this.setState({renommerOn: true});
  }

  _terrainName(terrain: Terrain) {
    if (this.state.renommerOn) {
      return (
        <Input>
          <InputField
            className='text-white placeholder:text-white'
            placeholder={terrain.name}
            autoFocus={true}
            onChangeText={(text) => this._terrainTxtInputChanged(text)}
            onSubmitEditing={() => this._renommerTerrain(terrain)}
          />
        </Input>
      );
    }
    else {
      return <Text className="text-white">{(terrain.id+1)}- {terrain.name}</Text>;
    }
  }

  render() {
    const { terrain } = this.props;
    return (
      <HStack space='md' className="px-2 my-2 items-center">
        <Box className="flex-1">
          {this._terrainName(terrain)}
        </Box>
        <HStack space='md'>
          {this._showRenommerTerrain(terrain)}
          <FontAwesome5.Button name="times" backgroundColor="#E63535" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._supprimerTerrain(terrain)}/>
        </HStack>
      </HStack>
    );
  }
}

export default connector(withTranslation()(ListeTerrainItem))