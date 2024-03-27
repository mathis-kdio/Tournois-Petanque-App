import React from 'react'
import { connect } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';
import { withTranslation } from 'react-i18next';
import { Box, HStack, Input, Text, InputField } from '@gluestack-ui/themed';

export interface Props {
  terrainText: string;
}

interface State {
  renommerOn: boolean;
}

class ListeTerrainItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.props.terrainText = "";
    this.state = {
      renommerOn: false
    }
  }

  _supprimerTerrain(terrain) {
    this.setState({renommerOn: false});
    const actionSuppr = {type: "SUPPR_TERRAIN", value: {terrainId: terrain.id}};
    this.props.dispatch(actionSuppr);
  }

  _showRenommerTerrain(terrain) {
    let name;
    let bgColor;
    let action;
    if (!this.state.renommerOn) {
      name = 'edit';
      bgColor = '#004282';
      action = () => this.setState({renommerOn: true});
    } else if (this.props.terrainText == '') {
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
    )
  }

  _renommerTerrain(terrain) {
    if (this.props.terrainText != "") {
      this.setState({renommerOn: false});
      const actionRenommer = { type: "RENOMMER_TERRAIN", value: {terrainId: terrain.id, newName: this.props.terrainText}};
      this.props.dispatch(actionRenommer);
      this.props.terrainText = "";
    }
  }

  _terrainTxtInputChanged(text) {
    this.props.terrainText = text;
    this.setState({renommerOn: true});
  }

  _terrainName(terrain) {
    if (this.state.renommerOn) {
      return (
        <Input>
          <InputField
            placeholder={terrain.name}
            autoFocus={true}
            onChangeText={(text) => this._terrainTxtInputChanged(text)}
            onSubmitEditing={() => this._renommerTerrain(terrain)}
          />
        </Input>
      )
    }
    else {
      return (
        <Text color='$white'>{(terrain.id+1)} - {terrain.name}</Text>
      )
    }
  }

  render() {
    const { terrain } = this.props;
    return (
      <HStack px={'$2'} my={'$2'} space='md' alignItems='center'>
        <Box flex={1}>
          {this._terrainName(terrain)}
        </Box>
        <HStack space='md'>
          {this._showRenommerTerrain(terrain)}
          <FontAwesome5.Button name="times" backgroundColor="#E63535" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._supprimerTerrain(terrain)}/>
        </HStack>
      </HStack>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeTerrains: state.listeTerrains.listeTerrains
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeTerrainItem))