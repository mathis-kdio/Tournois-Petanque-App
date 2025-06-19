import { FlatList } from '@/components/ui/flat-list';
import { Heading } from '@/components/ui/heading';

import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogBackdrop,
  AlertDialogCloseButton,
} from '@/components/ui/alert-dialog';

import { Divider } from '@/components/ui/divider';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Button, ButtonGroup, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import React, { useCallback, useEffect, useState } from 'react';
import ListeJoueurItem from '@components/ListeJoueurItem';
import JoueurSuggere from '@components/JoueurSuggere';
import JoueurType from '@components/JoueurType';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { Joueur } from '@/types/interfaces/joueur';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { ListRenderItem, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import TriListeJoueurs from './inscriptions/TriListeJoueurs';
import { Tri } from '@/types/enums/tri';

export interface Props {
  loadListScreen: boolean;
}

const Inscription: React.FC<Props> = ({ loadListScreen }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const [joueurType, setJoueurType] = useState('');
  const [etatBouton, setEtatBouton] = useState(false);
  const [joueurText, setJoueurText] = useState<string>('');
  const [suggestions, setSuggestions] = useState([]);
  const [nbSuggestions, setNbSuggestions] = useState(5);
  const [modalRemoveIsOpen, setModalRemoveIsOpen] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [showTri, setshowTri] = useState(false);
  const [triType, setTriType] = useState<Tri>(Tri.ID);

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );
  const listesJoueurs = useSelector(
    (state: any) => state.listesJoueurs.listesJoueurs,
  );

  const addPlayerTextInput = React.createRef<any>();

  const _getSuggestions = useCallback(() => {
    let listeHistoriqueFiltre = listesJoueurs.historique.filter(
      (item1: Joueur) =>
        listesJoueurs[optionsTournoi.mode].every(
          (item2: Joueur) => item2.name !== item1.name,
        ),
    );
    if (listeHistoriqueFiltre.length > 0) {
      return listeHistoriqueFiltre.sort(function (a, b) {
        return b.nbTournois - a.nbTournois;
      });
    }
    return [];
  }, [listesJoueurs, optionsTournoi.mode]);

  useEffect(() => {
    let suggestions = _getSuggestions();
    setSuggestions(suggestions);
  }, [_getSuggestions]);

  useEffect(() => {
    const newSuggestions = _getSuggestions();
    if (newSuggestions.length !== suggestions.length) {
      setSuggestions(newSuggestions);
    }
  }, [_getSuggestions, suggestions]);

  const _ajoutJoueurTextInputChanged = (text: string) => {
    setJoueurText(text);
    //Possible d'utiliser le bouton sauf si pas de lettre
    if (text !== '') {
      setEtatBouton(true);
    } else {
      setEtatBouton(false);
    }
  };

  useEffect(() => {
    if (etatBouton === false && addPlayerTextInput.current) {
      addPlayerTextInput.current.clear();
      addPlayerTextInput.current.focus();
    }
  }, [addPlayerTextInput, etatBouton]);

  const _ajoutJoueur = () => {
    //Test si au moins 1 caractère
    if (joueurText !== '') {
      let equipe = 1;
      if (
        optionsTournoi.typeEquipes === TypeEquipes.TETEATETE &&
        listesJoueurs[optionsTournoi.mode]
      ) {
        equipe = listesJoueurs[optionsTournoi.mode].length + 1;
      }
      const action = {
        type: 'AJOUT_JOUEUR',
        value: [optionsTournoi.mode, joueurText, joueurType, equipe],
      };
      dispatch(action);
      setJoueurText('');

      setJoueurType('');
      setEtatBouton(false);
    }
  };

  const _modalRemoveAllPlayers = () => {
    return (
      <AlertDialog
        isOpen={modalRemoveIsOpen}
        onClose={() => setModalRemoveIsOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-black">
              {t('supprimer_joueurs_modal_titre')}
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
            <Text>{t('supprimer_joueurs_modal_texte')}</Text>
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
              <Button action="negative" onPress={() => _removeAllPlayers()}>
                <ButtonText>{t('oui')}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const _removeAllPlayers = () => {
    const actionRemoveAll = {
      type: 'SUPPR_ALL_JOUEURS',
      value: [optionsTournoi.mode],
    };
    dispatch(actionRemoveAll);
    setModalRemoveIsOpen(false);
  };

  const _loadSavedList = () => {
    router.navigate({
      pathname: '/listes-joueurs',
      params: {
        loadListScreen: 'true',
      },
    });
  };

  const _displayListeJoueur = () => {
    if (listesJoueurs[optionsTournoi.mode] === undefined) {
      return;
    }

    let listeJoueur = [...(listesJoueurs[optionsTournoi.mode] as Joueur[])];
    if (triType === Tri.ID) {
      listeJoueur.sort((a, b) => a.id - b.id);
    } else if (triType === Tri.ALPHA_ASC) {
      listeJoueur.sort((a, b) => a.name.localeCompare(b.name));
    } else if (triType === Tri.ALPHA_DESC) {
      listeJoueur.sort((a, b) => b.name.localeCompare(a.name));
    }
    let nbJoueurs = listeJoueur.length;
    let avecEquipes = optionsTournoi.mode === ModeTournoi.AVECEQUIPES;
    const renderItem: ListRenderItem<Joueur> = ({ item }) => (
      <ListeJoueurItem
        joueur={item}
        isInscription={true}
        avecEquipes={avecEquipes}
        typeEquipes={optionsTournoi.typeEquipes}
        modeTournoi={optionsTournoi.mode}
        typeTournoi={optionsTournoi.typeTournoi}
        nbJoueurs={nbJoueurs}
        showCheckbox={showCheckbox}
      />
    );
    return (
      <FlatList
        removeClippedSubviews={false}
        persistentScrollbar={true}
        data={listeJoueur}
        keyExtractor={(item: Joueur) => item.id.toString()}
        renderItem={renderItem}
        ListFooterComponent={
          <VStack space="md" className="flex-1">
            <VStack space="sm" className="px-10">
              {_buttonRemoveAllPlayers()}
              {_buttonLoadSavedList()}
            </VStack>
            {_displayListeJoueursSuggeres()}
          </VStack>
        }
        className="h-1"
      />
    );
  };

  const _displayListeJoueursSuggeres = () => {
    if (suggestions.length > 0) {
      let partialSuggested = suggestions.slice(0, nbSuggestions);
      const renderItem: ListRenderItem<Joueur> = ({ item }) => (
        <JoueurSuggere joueur={item} />
      );
      return (
        <VStack>
          <Text className="text-white text-xl text-center">
            {t('suggestions_joueurs')}
          </Text>
          <FlatList
            removeClippedSubviews={false}
            persistentScrollbar={true}
            data={partialSuggested}
            keyExtractor={(item: Joueur) => item.id.toString()}
            renderItem={renderItem}
          />
          <Box className="px-10 pb-2">{_buttonMoreSuggestedPlayers()}</Box>
        </VStack>
      );
    }
  };

  const _buttonMoreSuggestedPlayers = () => {
    if (nbSuggestions < suggestions.length) {
      return (
        <Button action="primary" onPress={() => _showMoreSuggestedPlayers()}>
          <FontAwesome5 name="chevron-down" />
          <ButtonText>{t('plus_suggestions_joueurs_bouton')}</ButtonText>
          <FontAwesome5 name="chevron-down" />
        </Button>
      );
    }
  };

  const _showMoreSuggestedPlayers = () => {
    setNbSuggestions((prevState) => prevState + 5);
  };

  const _buttonRemoveAllPlayers = () => {
    if (listesJoueurs[optionsTournoi.mode].length > 0) {
      return (
        <Button action="negative" onPress={() => setModalRemoveIsOpen(true)}>
          <ButtonText>{t('supprimer_joueurs_bouton')}</ButtonText>
        </Button>
      );
    }
  };

  const _buttonLoadSavedList = () => {
    if (!loadListScreen) {
      return (
        <Button action="primary" onPress={() => _loadSavedList()}>
          <ButtonText>{t('charger_liste_joueurs_bouton')}</ButtonText>
        </Button>
      );
    }
  };

  const _showCheckboxSection = () => {
    let icon = 'eye';
    let text = t('afficher');
    if (showCheckbox) {
      icon = 'eye-slash';
      text = t('cacher');
    }
    return (
      <Pressable
        onPress={() => setShowCheckbox(!showCheckbox)}
        className="my-1 flex-row items-center"
      >
        <FontAwesome5 name={icon} size={15} color="white" />
        <Text className="text-white text-md">
          {` ${text} ${t('case_a_cocher')}`}
        </Text>
      </Pressable>
    );
  };

  const _showTriSection = () => {
    return (
      <Box>
        <Pressable
          onPress={() => setshowTri(!showTri)}
          className="my-1 flex-row items-center"
        >
          <MaterialCommunityIcons name="sort" size={24} color="white" />
          <Text className="text-white text-md">{` ${t('trier_joueurs')}`}</Text>
        </Pressable>
        <TriListeJoueurs
          isOpen={showTri}
          onClose={() => setshowTri(false)}
          setTriType={setTriType}
        />
      </Box>
    );
  };

  return (
    <VStack className="flex-1">
      <HStack space="md" className="items-center mx-1">
        <Box className="flex-1">
          <Input className="border-white">
            <InputField
              className="text-white placeholder:text-white"
              placeholder={t('nom')}
              autoFocus={true}
              keyboardType="default"
              onChangeText={(text) => _ajoutJoueurTextInputChanged(text)}
              onSubmitEditing={() => _ajoutJoueur()}
              ref={addPlayerTextInput}
            />
          </Input>
        </Box>
        <Box className="flex-1">
          <JoueurType
            joueurType={joueurType}
            _setJoueurType={(type) => setJoueurType(type)}
          />
        </Box>
        <Box>
          <Button
            action="positive"
            isDisabled={!etatBouton}
            onPress={() => _ajoutJoueur()}
            size="md"
          >
            <ButtonText>{t('ajouter')}</ButtonText>
          </Button>
        </Box>
      </HStack>
      <Divider className="bg-white h-0.5 my-2" />
      <HStack className="px-1 items-center justify-between">
        <Box className="w-fit">{_showTriSection()}</Box>
        <Box className="w-fit">{_showCheckboxSection()}</Box>
      </HStack>
      <VStack className="flex-1">{_displayListeJoueur()}</VStack>
      {_modalRemoveAllPlayers()}
    </VStack>
  );
};

export default Inscription;
