import React from 'react'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import ListeJoueurItem from '@components/ListeJoueurItem'
import JoueurSuggere from '@components/JoueurSuggere'
import JoueurType from '@components/JoueurType'
import { FontAwesome5 } from '@expo/vector-icons';
import { Box, HStack, Input, VStack, Button, Text, Icon, Divider, AlertDialog, ButtonGroup, AlertDialogHeader, AlertDialogContent, AlertDialogBody, ButtonText, AlertDialogFooter, InputField, AlertDialogBackdrop, AlertDialogCloseButton, CloseIcon, Heading } from '@gluestack-ui/themed';
import { withTranslation } from 'react-i18next'

class Inscription extends React.Component {

  constructor(props) {
    super(props)
    this.joueurText = "",
    this.addPlayerTextInput = React.createRef()
    this.state = {
      joueur: undefined,
      joueurType: undefined,
      etatBouton: false,
      suggestions: [],
      nbSuggestions: 5,
      modalRemoveIsOpen: false,
      showCheckbox: false
    }
  }

  componentDidMount() {
    let suggestions = this._getSuggestions();
    this.setState({
      suggestions: suggestions
    })
  }

  componentDidUpdate() {
    let newSuggestions = this._getSuggestions();
    if (newSuggestions.length != this.state.suggestions.length) {
      this.setState({
        suggestions: newSuggestions
      })
    }
  }

  _getSuggestions() {
    let listeHistoriqueFiltre = this.props.listesJoueurs.historique.filter(item1 => this.props.listesJoueurs[this.props.optionsTournoi.mode].every(item2 => item2.name !== item1.name));
    if (listeHistoriqueFiltre.length > 0) {
      return listeHistoriqueFiltre.sort(function (a, b) {return b.nbTournois - a.nbTournois;});
    }
    return [];
  }

  _ajoutJoueurTextInputChanged(text) {
    this.joueurText = text
    //Possible d'utiliser le bouton sauf si pas de lettre
    if (this.joueurText != '') {
      this.setState({
        etatBouton: true
      })
    }
    else {
      this.setState({
        etatBouton: false
      })
    }
  } 

  _ajoutJoueur() {
    //Test si au moins 1 caractère
    if (this.joueurText != '') {
      let equipe = 1
      if (this.props.optionsTournoi.typeEquipes == "teteatete" && this.props.listesJoueurs[this.props.optionsTournoi.mode]) {
        equipe = this.props.listesJoueurs[this.props.optionsTournoi.mode].length + 1
      }
      const action = { type: "AJOUT_JOUEUR", value: [this.props.optionsTournoi.mode, this.joueurText, this.state.joueurType, equipe] }
      this.props.dispatch(action);
      this.addPlayerTextInput.current.clear();
      this.joueurText = "";
      this.setState({
        joueurType: undefined,
        etatBouton: false
      })
      //Ne fonctionne pas avec: "this.addPlayerTextInput.current.focus()" quand validation avec clavier donc "hack" ci-dessous
      setTimeout(() => this.addPlayerTextInput.current.focus(), 0)
    }
  }

  _modalRemoveAllPlayers() {
    const { t } = this.props;
    return (
      <AlertDialog isOpen={this.state.modalRemoveIsOpen} onClose={() => this.setState({modalRemoveIsOpen: false})}>
        <AlertDialogBackdrop/>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading>{t("supprimer_joueurs_modal_titre")}</Heading>
            <AlertDialogCloseButton>
              <CloseIcon/>
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t("supprimer_joueurs_modal_texte")}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button variant='outline' action='secondary' onPress={() => this.setState({modalRemoveIsOpen: false})}>
                <ButtonText>{t("annuler")}</ButtonText>
              </Button>
              <Button action='negative' onPress={() => this._removeAllPlayers()}>
                <ButtonText>{t("oui")}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  _removeAllPlayers() {
    const actionRemoveAll = { type: "SUPPR_ALL_JOUEURS", value: [this.props.optionsTournoi.mode] }
    this.props.dispatch(actionRemoveAll);
    this.setState({modalRemoveIsOpen: false});
  }

  _loadSavedList() {
    this.props.navigation.navigate({
      name: 'ListesJoueurs',
      params: {
        loadListScreen: true
      }
    })
  }

  _displayListeJoueur() {
    if (this.props.listesJoueurs[this.props.optionsTournoi.mode] !== undefined) {
      let avecEquipes = false;
      if (this.props.optionsTournoi.mode == 'avecEquipes') {
        avecEquipes = true;
      }
      return (
        <FlatList
          removeClippedSubviews={false}
          persistentScrollbar={true}
          data={this.props.listesJoueurs[this.props.optionsTournoi.mode]}
          keyExtractor={(item) => item.id.toString() }
          renderItem={({item}) => (
            <ListeJoueurItem
              joueur={item}
              isInscription={true}
              avecEquipes={avecEquipes}
              typeEquipes={this.props.optionsTournoi.typeEquipes}
              nbJoueurs={this.props.listesJoueurs[this.props.optionsTournoi.mode].length}
              showCheckbox={this.state.showCheckbox}
            />
          )}
          ListFooterComponent={
            <VStack space='md'>
              <VStack px={'$10'} space='sm'>
                {this._buttonRemoveAllPlayers()}
                {this._buttonLoadSavedList()}
              </VStack>
              {this._displayListeJoueursSuggeres()}
            </VStack>
          }
        />
      )
    }
  }

  _displayListeJoueursSuggeres() {
    const { t } = this.props;
    if (this.state.suggestions.length > 0) {
      let partialSuggested = this.state.suggestions.slice(0, this.state.nbSuggestions);
      return (
        <VStack>
          <Text color='$white' fontSize={'$xl'} textAlign='center'>{t("suggestions_joueurs")}</Text>
          <FlatList
            removeClippedSubviews={false}
            persistentScrollbar={true}
            data={partialSuggested}
            keyExtractor={(item) => item.id.toString() }
            renderItem={({item}) => (
              <JoueurSuggere
                joueur={item}
              />
            )}
          />
          <Box px={'$10'} pb={'$2'}>
            {this._buttonMoreSuggestedPlayers()}
          </Box>
        </VStack>
      )
    }
  }

  _buttonMoreSuggestedPlayers() {
    const { t } = this.props;
    if (this.state.nbSuggestions < this.state.suggestions.length) {
      return (
        <Button
          bg='$green700'
          onPress={() => this._showMoreSuggestedPlayers()}
          startIcon={<Icon as={FontAwesome5} name="chevron-down"/>}
          endIcon={<Icon as={FontAwesome5} name="chevron-down"/>}
        >
          <ButtonText>{t("plus_suggestions_joueurs_bouton")}</ButtonText>
        </Button>
      )
    }
  }

  _showMoreSuggestedPlayers() {
    this.setState(prevState => ({ nbSuggestions: prevState.nbSuggestions + 5 }))
  }

  _buttonRemoveAllPlayers() {
    const { t } = this.props;
    if (this.props.listesJoueurs[this.props.optionsTournoi.mode].length > 0) {
      return (
        <Button
          bg='$red600'
          onPress={() => this.setState({modalRemoveIsOpen: true})}
        >
          <ButtonText>{t("supprimer_joueurs_bouton")}</ButtonText>
        </Button>
      )
    }
  }

  _buttonLoadSavedList() {
    const { t } = this.props;
    if (!this.props.loadListScreen) {
      return (
        <Button
          bg='$green700'
          onPress={() => this._loadSavedList()}
        >
          <ButtonText>{t("charger_liste_joueurs_bouton")}</ButtonText>
        </Button>
      )
    }
  }

  _showCheckboxSection() {
    const { t } = this.props;
    let icon = "eye";
    let text = t("afficher");
    if (this.state.showCheckbox) {
      icon = "eye-slash";
      text = t("cacher");
    }
    return (
      <HStack my={'$1'} alignItems='center'>
        <FontAwesome5 name={icon} size={15} color='white'/>
        <Text color='$white' fontSize={'$md'} onPress={() => this.setState({showCheckbox: !this.state.showCheckbox})}>{text} {t("case_a_cocher")}</Text>
      </HStack>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <VStack flex={1}>
        <HStack alignItems='center' mx={'$1'} space='md'>
          <Box flex={1}>
            <Input size='md' borderColor='$white'>
              <InputField
                placeholder={t("nom_joueur")}
                placeholderTextColor='white'
                autoFocus={true}
                defaultValue={this.nbToursTxt}
                keyboardType="default"
                onChangeText={(text) => this._ajoutJoueurTextInputChanged(text)}
                onSubmitEditing={() => this._ajoutJoueur()}
                ref={this.addPlayerTextInput}
              />
            </Input>
          </Box>
          <Box flex={1}>
            <JoueurType
              joueurType={this.state.joueurType}
              _setJoueurType={(type) => this.setState({joueurType: type})}
            />
          </Box>
          <Box>
            <Button
              bg='$green700'
              isDisabled={!this.state.etatBouton}
              onPress={() => this._ajoutJoueur()}
              size='md'
            >
              <ButtonText>{t("ajouter")}</ButtonText>
            </Button>
          </Box>
        </HStack>
        {this._showCheckboxSection()}
        <Divider bg='$white' h={'$0.5'} my={'$2'}/>
        <VStack flex={1}>
          {this._displayListeJoueur()}
        </VStack>
        {this._modalRemoveAllPlayers()}
      </VStack>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(withTranslation()(Inscription))