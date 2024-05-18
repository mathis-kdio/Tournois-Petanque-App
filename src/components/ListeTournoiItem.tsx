import React from 'react'
import { connect } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';
import { withTranslation } from 'react-i18next';
import { Box, HStack, Text, Button, ButtonText, AlertDialog, AlertDialogBody, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, Heading, CloseIcon, AlertDialogFooter, ButtonGroup, AlertDialogCloseButton, Input, InputField } from '@gluestack-ui/themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { Tournoi } from '@/types/interfaces/tournoi';

export interface Props {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
  tournoiNameText: string;
  tournoi: OptionsTournoi;
}

interface State {
  renommerOn: boolean;
  modalDeleteIsOpen: boolean;
}

class ListeTournoiItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    props.tournoiNameText = ""
    this.state = {
      renommerOn: false,
      modalDeleteIsOpen: false
    }
  }

  _chargerTournoi(tournoi: Tournoi) {
    const actionUpdateListeMatchs = {type: "AJOUT_MATCHS", value: tournoi.tournoi};
    this.props.dispatch(actionUpdateListeMatchs);
    this.props.navigation.reset({
      index: 0,
      routes: [{
        name: 'ListeMatchsInscription', 
        params: {
          tournoiId: tournoi.tournoiId, 
          tournoi: tournoi
        }
      }]
    });
  }

  _supprimerTournoi(tournoiId: number) {
    const actionSupprimerTournoi = {type: "SUPPR_TOURNOI", value: {tournoiId: tournoiId}};
    this.props.dispatch(actionSupprimerTournoi);
  }

  _modalSupprimerTournoi(tournoiId: number) {
    const { t } = this.props;
    return (
      <AlertDialog isOpen={this.state.modalDeleteIsOpen} onClose={() => this.setState({modalDeleteIsOpen: false})}>
      <AlertDialogBackdrop/>
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading>{t("supprimer_tournoi_modal_titre")}</Heading>
          <AlertDialogCloseButton>
            <CloseIcon/>
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text>{t("supprimer_tournoi_modal_texte", {id: tournoiId + 1})}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup>
            <Button variant='outline' action='secondary' onPress={() => this.setState({modalDeleteIsOpen: false})}>
              <ButtonText>{t("annuler")}</ButtonText>
            </Button>
            <Button action='negative' onPress={() => this._supprimerTournoi(tournoiId)}>
              <ButtonText>{t("oui")}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog> 
    )
  }
  
  _showRenameTournoi(tournoi: OptionsTournoi) {
    let name: string;
    let bgColor: string;
    let action;
    if (!this.state.renommerOn) {
      name = 'edit';
      bgColor = '#004282';
      action = () => this.setState({renommerOn: true});
    } else if (this.props.tournoiNameText == '') {
      name = 'times';
      bgColor = '#5F5F5F';
      action = () => this.setState({renommerOn: false});
    } else {
      name = 'check';
      bgColor = '#348352';
      action = () => this._renameTournoi(tournoi);
    }

    return (
      <Box>
        <FontAwesome5.Button name={name} backgroundColor={bgColor} iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={action}/>
      </Box>
    )
  }

  _renameTournoiInput(tournoi) {
    this.setState({
      renommerOn: true
    });
    this.props.tournoiNameText = tournoi.name;
  }

  _renameTournoi(tournoi: OptionsTournoi) {
    if (this.props.tournoiNameText != "") {
      this.setState({renommerOn: false});
      const actionRenameTournoi = { type: "RENOMMER_TOURNOI", value: {tournoiId: tournoi.tournoiId, newName: this.props.tournoiNameText} };
      this.props.dispatch(actionRenameTournoi);
      this.props.tournoiNameText = "";
    }
  }

  _tournoiTextInputChanged(text: string) {
    this.props.tournoiNameText = text;
    this.setState({renommerOn: true});
  }

  _tournoiName(tournoi: OptionsTournoi) {
    const { t } = this.props;
    let tournoiName = tournoi.name ? tournoi.name : 'n°' + tournoi.tournoiId;
    if (this.state.renommerOn) {
      return (
        <Input>
          <InputField
            placeholder={tournoiName}
            autoFocus={true}
            onChangeText={(text: string) => this._tournoiTextInputChanged(text)}
            onSubmitEditing={() => this._renameTournoi(tournoi)}
          />
        </Input>
      )
    }
    else {
      return (
        <Text color='$white'>{t("tournoi")} {tournoiName}</Text>
      )
    }
  }

  render() {
    const { tournoi, _showModalTournoiInfos, t } = this.props;
    let btnDisabled = false;
    if (this.props.listeMatchs && tournoi.tournoiId == this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID) {
      btnDisabled = true;
    }
    return (
      <HStack px={'$2'} my={'$2'} space='md' alignItems='center'>
        <Box flex={1}>
          {this._tournoiName(tournoi)}
        </Box>
        <HStack space='sm'>
          {this._showRenameTournoi(tournoi)}
          <FontAwesome5.Button name="info-circle" backgroundColor="#004282" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => _showModalTournoiInfos(tournoi)}/>
          <Button isDisabled={btnDisabled} action='primary' onPress={() => this._chargerTournoi(tournoi)}>
            <ButtonText>{t("charger")}</ButtonText>
          </Button>
          <FontAwesome5.Button disabled={btnDisabled} name="times" backgroundColor={btnDisabled ? "#C0C0C0" : "#E63535"} iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this.setState({modalDeleteIsOpen: true})}/>
        </HStack>
        {this._modalSupprimerTournoi(tournoi.tournoiId)}
      </HStack>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeTournoiItem))