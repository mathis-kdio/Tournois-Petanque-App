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
        {/*TEMPORAIRE AFFICHAGE DES POSTES TIREURS ET POINTEURS SEULEMENT EN DOUBLETTE*/}
        {this.props.optionsTournoi.typeEquipes == "doublette" && <Select.Item label="Tireur" value="tireur"/>}
        {this.props.optionsTournoi.typeEquipes == "doublette" && <Select.Item label="Pointeur" value="pointeur"/>}
        {this.props.optionsTournoi.typeEquipes == "doublette" && <Select.Item label="Milieu" value="milieu"/>}
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