import React from 'react'
import { connect } from 'react-redux'
import { CheckIcon, ChevronDownIcon, Select } from 'native-base';
import { withTranslation } from 'react-i18next';

class JoueurType extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      joueurType: undefined,
    }
  }

  _selectItemList() {
    const { t } = this.props;
    const { mode, type, typeEquipes } = this.props.optionsTournoi;
    if (mode == "sauvegarde") {
      return [
        <Select.Item label={t("tireur")} value="tireur"/>,
        <Select.Item label={t("pointeur")} value="pointeur"/>,
        <Select.Item label={t("milieu")} value="milieu"/>
      ]
    }
    else if (type == "mele-demele" && typeEquipes == "doublette") {
      /*TEMPORAIRE AFFICHAGE DES POSTES TIREURS ET POINTEURS SEULEMENT EN DOUBLETTE*/
      return [
        <Select.Item label={t("tireur")} value="tireur"/>,
        <Select.Item label={t("pointeur")} value="pointeur"/>
      ]
    }
    else {
      return [];
    }
  }

  render() {
    const { joueurType, _setJoueurType, t } = this.props;
    return (
      <Select
        selectedValue={joueurType ? joueurType : ""}
        accessibilityLabel={t("choisir_poste")}
        placeholder={t("choisir_poste")}
        placeholderTextColor="white"
        color="white"
        variant="rounded"
        dropdownIcon={<ChevronDownIcon color="white" mr="2" size="6"/>}
        _selectedItem={{
          bg: "#0594ae",
          endIcon: <CheckIcon size="5"/>
        }}
        onValueChange={itemValue => _setJoueurType(itemValue)}>
        <Select.Item label={t("enfant")} value="enfant"/>
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

export default connect(mapStateToProps)(withTranslation()(JoueurType))