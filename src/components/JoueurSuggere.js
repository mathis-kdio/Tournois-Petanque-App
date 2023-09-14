import React from 'react'
import { connect } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';
import JoueurType from '@components/JoueurType'
import { withTranslation } from 'react-i18next';
import { AlertDialog, Box, Button, HStack, Text } from 'native-base';

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
        <AlertDialog.Content>
          <AlertDialog.Header>{t("supprimer_joueur_suggestions_modal_titre")}</AlertDialog.Header>
          <AlertDialog.Body>{t("supprimer_joueur_suggestions_modal_texte")}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={() => this.setState({modalRemoveIsOpen: false})}>
                {t("annuler")}
              </Button>
              <Button colorScheme="danger" onPress={() => this._removePlayer(playerId)}>
                {t("oui")}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
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
      <HStack borderWidth="1" borderColor="white" borderRadius="xl" margin="1" paddingX="1" alignItems="center">
        <Box flex="1">
          <Text color="white" fontSize="xl" fontWeight="bold">{joueur.name}</Text>
        </Box>
        <Box flex="1">
          <JoueurType
            joueurType={this.state.joueurType}
            _setJoueurType={(type) => this._setJoueurType(type)}
          />
        </Box>
        <Box ml="2">
          <FontAwesome5.Button name="times" backgroundColor="red" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this.setState({modalRemoveIsOpen: true})}/>
        </Box>
        <Box ml="2">
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