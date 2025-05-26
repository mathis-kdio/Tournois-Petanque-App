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

import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import JoueurType from '@components/JoueurType';
import { useTranslation } from 'react-i18next';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { Joueur } from '@/types/interfaces/joueur';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { useDispatch, useSelector } from 'react-redux';

export interface Props {
  joueur: Joueur;
}

const JoueurSuggere: React.FC<Props> = ({ joueur }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [joueurType, setJoueurType] = useState('');
  const [modalRemoveIsOpen, setModalRemoveIsOpen] = useState(false);

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );
  const listesJoueurs = useSelector(
    (state: any) => state.listesJoueurs.listesJoueurs,
  );

  const _modalRemovePlayer = (playerId: number) => {
    return (
      <AlertDialog
        isOpen={modalRemoveIsOpen}
        onClose={() => setModalRemoveIsOpen(false)}
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
                onPress={() => setModalRemoveIsOpen(false)}
              >
                <ButtonText className="text-black">{t('annuler')}</ButtonText>
              </Button>
              <Button action="negative" onPress={() => _removePlayer(playerId)}>
                <ButtonText>{t('oui')}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const _removePlayer = (playerId: number) => {
    const actionSuppr = {
      type: 'SUPPR_JOUEUR',
      value: [ModeTournoi.HISTORIQUE, playerId],
    };
    dispatch(actionSuppr);
    setModalRemoveIsOpen(false);
  };

  const _addPlayer = (playerName: string) => {
    let equipe = undefined;
    if (optionsTournoi.typeEquipes === TypeEquipes.TETEATETE) {
      equipe = listesJoueurs.avecEquipes.length + 1;
    }
    const action = {
      type: 'AJOUT_JOUEUR',
      value: [optionsTournoi.mode, playerName, joueurType, equipe],
    };
    dispatch(action);
  };

  return (
    <HStack className="border border-white rounded-xl m-1 px-1 items-center">
      <Box className="flex-1">
        <Text className="text-white text-xl font-bold break-words">
          {joueur.name}
        </Text>
      </Box>
      <Box className="flex-1">
        <JoueurType
          joueurType={joueurType}
          _setJoueurType={(type: JoueurTypeEnum) => setJoueurType(type)}
        />
      </Box>
      <Box className="ml-2">
        <FontAwesome5.Button
          name="times"
          backgroundColor="#E63535"
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={() => setModalRemoveIsOpen(true)}
        />
      </Box>
      <Box className="ml-2">
        <FontAwesome5.Button
          name="plus"
          backgroundColor="#348352"
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={() => _addPlayer(joueur.name)}
        />
      </Box>
      {_modalRemovePlayer(joueur.id)}
    </HStack>
  );
};

export default JoueurSuggere;
