import React from 'react'
import { connect } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';
import JoueurType from '@components/JoueurType'
import { withTranslation } from 'react-i18next';
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, Box, Button, ButtonGroup, ButtonText, CloseIcon, HStack, Heading, Text } from '@gluestack-ui/themed';

class JoueurSuggere extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      joueurType: undefined,
      modalRemoveIsOpen: false
    }
  }

  _modalRemovePlayer(playerId) {
    const { t } = this.props;
    return (
      <AlertDialog isOpen={this.state.modalRemoveIsOpen} onClose={() => this.setState({modalRemoveIsOpen: false})}>
        <AlertDialogBackdrop/>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading>{t("supprimer_joueur_suggestions_modal_titre")}</Heading>
            <AlertDialogCloseButton>
              <CloseIcon/>
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t("supprimer_joueur_suggestions_modal_texte")}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button variant='outline' action='secondary' onPress={() => this.setState({modalRemoveIsOpen: false})}>
                <ButtonText>{t("annuler")}</ButtonText>
              </Button>
              <Button action='negative' onPress={() => this._removePlayer(playerId)}>
                <ButtonText>{t("oui")}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  _removePlayer(playerId) {
    const actionSuppr = {type: "SUPPR_JOUEUR", value: ["historique", playerId]};
    this.props.dispatch(actionSuppr);
  }

  _addPlayer(playerName) {
    let equipe = undefined;
    if (this.props.optionsTournoi.typeEquipes == "teteatete") {
      equipe = this.props.listesJoueurs.avecEquipes.length + 1;
    }
    const action = { type: "AJOUT_JOUEUR", value: [this.props.optionsTournoi.mode, playerName, this.state.joueurType, equipe] };
    this.props.dispatch(action);
  }

  _setJoueurType(type) {
    this.setState({
      joueurType: type
    })
  }

  render() {
    const { joueur } = this.props;
    return (
      <HStack borderWidth={'$1'} borderColor='$white' borderRadius={'$xl'} m={'$1'} px={'$1'} alignItems='center'>
        <Box flex={1}>
          <Text color='$white' fontSize={'$xl'} fontWeight='$bold'>{joueur.name}</Text>
        </Box>
        <Box flex={1}>
          <JoueurType
            joueurType={this.state.joueurType}
            _setJoueurType={(type) => this._setJoueurType(type)}
          />
        </Box>
        <Box ml={'$2'}>
          <FontAwesome5.Button name="times" backgroundColor="red" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this.setState({modalRemoveIsOpen: true})}/>
        </Box>
        <Box ml={'$2'}>
          <FontAwesome5.Button name="plus" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._addPlayer(joueur.name)}/>
        </Box>
        {this._modalRemovePlayer(joueur.id)}
      </HStack>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(withTranslation()(JoueurSuggere))