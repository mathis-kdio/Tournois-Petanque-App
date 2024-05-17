import React from 'react'
import { connect } from 'react-redux'
import { ChevronDownIcon, Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@gluestack-ui/themed';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { JoueurType as JoueurTypeEnum} from '../types/enums/joueurType';

export interface Props {
  t: TFunction;
  joueurType: JoueurTypeEnum;
}

interface State {
}

class JoueurType extends React.Component<Props, State> {
  constructor(props: Props) {
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
        <SelectItem label={t("tireur")} value={JoueurTypeEnum.TIREUR} key={1}/>,
        <SelectItem label={t("pointeur")} value={JoueurTypeEnum.POINTEUR} key={2}/>,
        <SelectItem label={t("milieu")} value={JoueurTypeEnum.MILIEU} key={3}/>
      ]
    }
    else if (type == "mele-demele" && typeEquipes == "doublette") {
      /*TEMPORAIRE AFFICHAGE DES POSTES TIREURS ET POINTEURS SEULEMENT EN DOUBLETTE*/
      return [
        <SelectItem label={t("tireur")} value={JoueurTypeEnum.TIREUR} key={1}/>,
        <SelectItem label={t("pointeur")} value={JoueurTypeEnum.POINTEUR} key={2}/>
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
        aria-label={t("choisir_poste")}
        onValueChange={itemValue => _setJoueurType(itemValue)}
      >
        <SelectTrigger variant='rounded'>
          <SelectInput placeholder={t("choisir_poste")}/>
          <SelectIcon mr={'$3'}>
            <ChevronDownIcon color='$white'/>
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop/>
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator/>
            </SelectDragIndicatorWrapper>
            <SelectItem label={t("enfant")} value={JoueurTypeEnum.ENFANT} key={0}/>
            {this._selectItemList()}
          </SelectContent>
        </SelectPortal>
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