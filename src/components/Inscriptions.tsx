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
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { ListRenderItem, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import TriListeJoueurs from './inscriptions/TriListeJoueurs';
import { Tri } from '@/types/enums/tri';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { useJoueursPreparationTournois } from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';

export interface Props {
  loadListScreen: boolean;
}

const Inscription: React.FC<Props> = ({ loadListScreen }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const { addJoueursPreparationTournoi } = useJoueursPreparationTournois();

  const [joueurType, setJoueurType] = useState<JoueurTypeEnum | undefined>(
    undefined,
  );
  const [etatBouton, setEtatBouton] = useState(false);
  const [joueurText, setJoueurText] = useState('');
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
      (item1: JoueurModel) =>
        listesJoueurs[optionsTournoi.mode].every(
          (item2: JoueurModel) => item2.name !== item1.name,
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

  const _ajoutJoueurFormulaire = () => {
    if (joueurText === '') {
      return;
    }

    ajoutJoueur(joueurText, joueurType);

    setJoueurText('');
    setJoueurType(undefined);
    setEtatBouton(false);
  };

  const ajoutJoueur = (
    joueurName: string,
    joueurType: JoueurTypeEnum | undefined,
  ) => {
    const { typeEquipes, mode } = optionsTournoi;
    const listeJoueurs: JoueurModel[] = listesJoueurs[mode];

    const equipe = equipeAuto(listeJoueurs, typeEquipes);

    const action = {
      type: 'AJOUT_JOUEUR',
      value: [mode, joueurName, joueurType, equipe],
    };
    dispatch(action);
    addJoueursPreparationTournoi(joueurName, joueurType, equipe);
  };

  const equipeAuto = (
    listeJoueurs: JoueurModel[],
    typeEquipes: TypeEquipes,
  ) => {
    if (typeEquipes === TypeEquipes.TETEATETE) {
      return listeJoueurs.length + 1;
    } else {
      let nbJoueursParEquipe = typeEquipes === TypeEquipes.DOUBLETTE ? 2 : 3;

      // Compter le nombre de joueurs par équipe
      const joueursParEquipe: { [key: number]: number } = {};
      listeJoueurs.forEach((joueur) => {
        if (joueur.equipe) {
          joueursParEquipe[joueur.equipe] =
            (joueursParEquipe[joueur.equipe] || 0) + 1;
        }
      });

      // Trouver l'équipe avec l'id le plus proche de 0 qui n'a pas dépassé nbJoueursParEquipe
      let equipeTrouvee = 1;
      for (let i = 1; ; i++) {
        const nbJoueursDansEquipe = joueursParEquipe[i] || 0;
        if (nbJoueursDansEquipe < nbJoueursParEquipe) {
          equipeTrouvee = i;
          break;
        }
      }
      return equipeTrouvee;
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
            <Heading className="color-custom-text-modal">
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
                <ButtonText className="color-custom-text-modal">
                  {t('annuler')}
                </ButtonText>
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

    let listeJoueur = [...(listesJoueurs[optionsTournoi.mode] as JoueurModel[])];
    if (triType === Tri.ID) {
      listeJoueur.sort((a, b) => a.id - b.id);
    } else if (triType === Tri.ALPHA_ASC) {
      listeJoueur.sort((a, b) => a.name.localeCompare(b.name));
    } else if (triType === Tri.ALPHA_DESC) {
      listeJoueur.sort((a, b) => b.name.localeCompare(a.name));
    }
    let nbJoueurs = listeJoueur.length;
    let avecEquipes =
      optionsTournoi.mode === ModeTournoi.AVECEQUIPES &&
      optionsTournoi.modeCreationEquipes === ModeCreationEquipes.MANUELLE;
    const renderItem: ListRenderItem<JoueurModel> = ({ item }) => (
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
        keyExtractor={(item: JoueurModel) => item.id.toString()}
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
      const renderItem: ListRenderItem<JoueurModel> = ({ item }) => (
        <JoueurSuggere
          joueur={item}
          optionsTournoi={optionsTournoi}
          ajoutJoueur={ajoutJoueur}
        />
      );
      return (
        <VStack>
          <Text className="text-typography-white text-xl text-center">
            {t('suggestions_joueurs')}
          </Text>
          <FlatList
            removeClippedSubviews={false}
            persistentScrollbar={true}
            data={partialSuggested}
            keyExtractor={(item: JoueurModel) => item.id.toString()}
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
          <FontAwesome5
            name="chevron-down"
            className="text-custom-text-button"
          />
          <ButtonText>{t('plus_suggestions_joueurs_bouton')}</ButtonText>
          <FontAwesome5
            name="chevron-down"
            className="text-custom-text-button"
          />
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
        <FontAwesome5
          name={icon}
          size={15}
          className="text-custom-bg-inverse"
        />
        <Text className="text-typography-white text-md">
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
          <MaterialCommunityIcons
            name="sort"
            size={24}
            className="text-custom-bg-inverse"
          />
          <Text className="text-typography-white text-md">{` ${t('trier_joueurs')}`}</Text>
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
          <Input className="border-custom-bg-inverse">
            <InputField
              className="text-typography-white placeholder:text-typography-white"
              placeholder={t('nom')}
              autoFocus={true}
              keyboardType="default"
              onChangeText={(text) => _ajoutJoueurTextInputChanged(text)}
              onSubmitEditing={() => _ajoutJoueurFormulaire()}
              ref={addPlayerTextInput}
            />
          </Input>
        </Box>
        <Box className="flex-1">
          <JoueurType
            joueurType={joueurType}
            optionsTournoi={optionsTournoi}
            _setJoueurType={(type) => setJoueurType(type)}
          />
        </Box>
        <Box>
          <Button
            action="positive"
            isDisabled={!etatBouton}
            onPress={() => _ajoutJoueurFormulaire()}
            size="md"
          >
            <ButtonText>{t('ajouter')}</ButtonText>
          </Button>
        </Box>
      </HStack>
      <Divider className="bg-custom-bg-inverse h-0.5 my-2" />
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
