import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Button, ButtonGroup, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';

import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import JoueurType from '@components/JoueurType';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { Joueur } from '@/types/interfaces/joueur';
import { PropsFromRedux, connector } from '@/store/connector';
import { ModeTournoi } from '@/types/enums/modeTournoi';

export interface Props extends PropsFromRedux {
  t: TFunction;
  joueur: Joueur;
}

interface State {
  joueurType: JoueurTypeEnum;
  modalRemoveIsOpen: boolean;
}

class JoueurSuggere extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      joueurType: undefined,
      modalRemoveIsOpen: false,
    };
  }

  _modalRemovePlayer(playerId: number) {
    const { t } = this.props;
    return (
      <AlertDialog
        isOpen={this.state.modalRemoveIsOpen}
        onClose={() => this.setState({ modalRemoveIsOpen: false })}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-black">
              {t('supprimer_joueur_suggestions_modal_titre')}
            </Heading>
            <AlertDialogCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t('supprimer_joueur_suggestions_modal_texte')}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup flexDirection="row">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => this.setState({ modalRemoveIsOpen: false })}
              >
                <ButtonText className="text-black">{t('annuler')}</ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={() => this._removePlayer(playerId)}
              >
                <ButtonText>{t('oui')}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  _removePlayer(playerId: number) {
    const actionSuppr = {
      type: 'SUPPR_JOUEUR',
      value: [ModeTournoi.HISTORIQUE, playerId],
    };
    this.props.dispatch(actionSuppr);
  }

  _addPlayer(playerName: string) {
    let equipe = undefined;
    if (this.props.optionsTournoi.typeEquipes === TypeEquipes.TETEATETE) {
      equipe = this.props.listesJoueurs.avecEquipes.length + 1;
    }
    const action = {
      type: 'AJOUT_JOUEUR',
      value: [
        this.props.optionsTournoi.mode,
        playerName,
        this.state.joueurType,
        equipe,
      ],
    };
    this.props.dispatch(action);
  }

  _setJoueurType(type: JoueurTypeEnum) {
    this.setState({
      joueurType: type,
    });
  }

  render() {
    const { joueur } = this.props;
    return (
      <HStack className="border border-white rounded-xl m-1 px-1 items-center">
        <Box className="flex-1">
          <Text className="text-white text-xl font-bold break-words">
            {joueur.name}
          </Text>
        </Box>
        <Box className="flex-1">
          <JoueurType
            joueurType={this.state.joueurType}
            _setJoueurType={(type: JoueurTypeEnum) => this._setJoueurType(type)}
          />
        </Box>
        <Box className="ml-2">
          <FontAwesome5.Button
            name="times"
            backgroundColor="#E63535"
            iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
            onPress={() => this.setState({ modalRemoveIsOpen: true })}
          />
        </Box>
        <Box className="ml-2">
          <FontAwesome5.Button
            name="plus"
            backgroundColor="#348352"
            iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
            onPress={() => this._addPlayer(joueur.name)}
          />
        </Box>
        {this._modalRemovePlayer(joueur.id)}
      </HStack>
    );
  }
}

export default connector(withTranslation()(JoueurSuggere));
