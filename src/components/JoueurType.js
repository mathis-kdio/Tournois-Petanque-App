import React from 'react'
import { connect } from 'react-redux'
import { CheckIcon, ChevronDownIcon, Select } from 'native-base';

class JoueurType extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      joueurType: undefined,
    }
  }

  _selectItemList() {
    const { mode, type, typeEquipes } = this.props.optionsTournoi;
    if (mode == "sauvegarde") {
      return [
        <Select.Item label="Tireur" value="tireur"/>,
        <Select.Item label="Pointeur" value="pointeur"/>,
        <Select.Item label="Milieu" value="milieu"/>
      ]
    }
    else if (type == "mele-demele" && typeEquipes == "doublette") {
      /*TEMPORAIRE AFFICHAGE DES POSTES TIREURS ET POINTEURS SEULEMENT EN DOUBLETTE*/
      return [
        <Select.Item label="Tireur" value="tireur"/>,
        <Select.Item label="Pointeur" value="pointeur"/>
      ]
    }
    else {
      return [];
    }
  }

  render() {
    const { joueurType, _setJoueurType } = this.props;
    return (
      <Select
        selectedValue={joueurType ? joueurType : ""}
        accessibilityLabel="Choisir un poste"
        placeholder="Choisir un poste"
        placeholderTextColor="white"
        color="white"
        variant="rounded"
        dropdownIcon={<ChevronDownIcon color="white" mr="2" size="6"/>}
        _selectedItem={{
          bg: "#0594ae",
          endIcon: <CheckIcon size="5"/>
        }}
        onValueChange={itemValue => _setJoueurType(itemValue)}>
        <Select.Item label="Enfant" value="enfant"/>
        {this._selectItemList()}
      </Select>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(JoueurType)