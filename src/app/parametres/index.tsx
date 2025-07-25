import { ScrollView } from '@/components/ui/scroll-view';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from '@/components/ui/modal';

import { Button, ButtonText, ButtonGroup } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Box } from '@/components/ui/box';

import {
  AlertDialogContent,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCloseButton,
  AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';

import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useState } from 'react';
import { _openURL } from '@utils/link';
import { SafeAreaView } from 'react-native-safe-area-context';
import { _adsConsentShowForm } from '@utils/adMob/consentForm';
import { useTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import Item from '@components/Item';
import i18n from 'i18next';
import { Pressable } from '@/components/ui/pressable';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import { SELECTED_LANGUAGE_KEY } from '@/utils/async-storage/key';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { AppTheme, getThemeColor } from '@/utils/theme/theme';

const Parametres = () => {
  const githubRepository =
    'https://github.com/mathis-kdio/Tournois-Petanque-App';
  const mail = 'mailto:tournoispetanqueapp@gmail.com';
  const crowdin = 'https://crowdin.com/project/tournois-de-ptanque-gcu';

  const [alertOpen, openAlert] = useState(false);
  const [modalLanguagesOpen, openModalLanguages] = useState(false);
  const [modalThemeOpen, setModalTheme] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { setTheme } = useTheme();

  const _alertDialogClearData = () => {
    return (
      <AlertDialog isOpen={alertOpen} onClose={() => openAlert(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="color-custom-text-modal">
              {t('supprimer_donnees_modal_titre')}
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
            <Text>{t('supprimer_donnees_modal_texte')}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup flexDirection="row">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => openAlert(false)}
              >
                <ButtonText className="color-custom-text-modal">
                  {t('annuler')}
                </ButtonText>
              </Button>
              <Button action="negative" onPress={() => _clearData()}>
                <ButtonText>{t('oui')}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const _clearData = () => {
    openAlert(false);
    const actionRemoveAllPlayersAvecNoms = {
      type: 'SUPPR_ALL_JOUEURS',
      value: ['avecNoms'],
    };
    dispatch(actionRemoveAllPlayersAvecNoms);
    const actionRemoveAllPlayersSansNoms = {
      type: 'SUPPR_ALL_JOUEURS',
      value: ['sansNoms'],
    };
    dispatch(actionRemoveAllPlayersSansNoms);
    const actionRemoveAllPlayersAvecEquipes = {
      type: 'SUPPR_ALL_JOUEURS',
      value: ['avecEquipes'],
    };
    dispatch(actionRemoveAllPlayersAvecEquipes);
    const actionRemoveAllPlayersHistorique = {
      type: 'SUPPR_ALL_JOUEURS',
      value: ['historique'],
    };
    dispatch(actionRemoveAllPlayersHistorique);
    const actionRemoveAllPlayersSauvegarde = {
      type: 'SUPPR_ALL_JOUEURS',
      value: ['sauvegarde'],
    };
    dispatch(actionRemoveAllPlayersSauvegarde);
    const actionRemoveAllSavedList = { type: 'REMOVE_ALL_SAVED_LIST' };
    dispatch(actionRemoveAllSavedList);
    const actionRemoveAllTournaments = { type: 'SUPPR_ALL_TOURNOIS' };
    dispatch(actionRemoveAllTournaments);
    const actionRemoveAllMatchs = { type: 'REMOVE_ALL_MATCHS' };
    dispatch(actionRemoveAllMatchs);
    const actionRemoveAllTerrains = { type: 'REMOVE_ALL_TERRAINS' };
    dispatch(actionRemoveAllTerrains);
    const actionRemoveAllOptions = { type: 'SUPPR_ALL_OPTIONS' };
    dispatch(actionRemoveAllOptions);
  };

  const _modalLanguages = () => {
    let drapeauFrance = require('@assets/images/drapeau-france.png');
    let drapeauUSA = require('@assets/images/drapeau-usa.png');
    let drapeauPologne = require('@assets/images/drapeau-pologne.png');
    let drapeauPaysBas = require('@assets/images/drapeau-pays-bas.png');
    let drapeauAllemagne = require('@assets/images/drapeau-allemagne.png');
    let drapeauDanemark = require('@assets/images/drapeau-danemark.png');
    return (
      <Modal
        isOpen={modalLanguagesOpen}
        onClose={() => openModalLanguages(false)}
      >
        <ModalBackdrop />
        <ModalContent className="max-h-5/6">
          <ModalHeader>
            <Heading className="color-custom-text-modal">
              {t('languages_disponibles')}
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Item
              text={t('francais')}
              action={() => _changeLanguage('fr-FR')}
              icon={''}
              type="modal"
              drapeau={drapeauFrance}
            />
            <Divider />
            <Item
              text={t('anglais')}
              action={() => _changeLanguage('en-US')}
              icon={''}
              type="modal"
              drapeau={drapeauUSA}
            />
            <Divider />
            <Item
              text={t('polonais')}
              action={() => _changeLanguage('pl-PL')}
              icon={''}
              type="modal"
              drapeau={drapeauPologne}
            />
            <Divider />
            <Item
              text={t('neerlandais')}
              action={() => _changeLanguage('nl-NL')}
              icon={''}
              type="modal"
              drapeau={drapeauPaysBas}
            />
            <Divider />
            <Item
              text={t('allemand')}
              action={() => _changeLanguage('de-DE')}
              icon={''}
              type="modal"
              drapeau={drapeauAllemagne}
            />
            <Divider />
            <Item
              text={t('danois')}
              action={() => _changeLanguage('dk-DK')}
              icon={''}
              type="modal"
              drapeau={drapeauDanemark}
            />
            <Text className="text-center">{t('envie_aider_traduction')}</Text>
            <Pressable onPress={() => _openURL(crowdin)}>
              <Text className="text-center text-blue-500">
                {t('texte_lien_traduction')}
              </Text>
            </Pressable>
            <Text className="text-center">{t('remerciements_traduction')}</Text>
            <Text className="text-center">
              {`\u2022`} NMieczynska ({t('polonais_abreviation')})
            </Text>
            <Text className="text-center">
              {`\u2022`} GerKos653 ({t('neerlandais_abreviation')})
            </Text>
            <Text className="text-center">
              {`\u2022`} MHofmann ({t('allemand_abreviation')})
            </Text>
            <Text className="text-center">
              {`\u2022`} tskalshoej ({t('danois_abreviation')})
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  const _changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(SELECTED_LANGUAGE_KEY, language);
    openModalLanguages(false);
  };

  const _modalTheme = () => {
    return (
      <Modal isOpen={modalThemeOpen} onClose={() => setModalTheme(false)}>
        <ModalBackdrop />
        <ModalContent className="max-h-5/6">
          <ModalHeader>
            <Heading className="color-custom-text-modal">
              {t('themes_disponibles')}
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Item
              text={t('defaut')}
              action={() => _changeTheme('default')}
              icon={'copyright'}
              type="modal"
              drapeau={undefined}
            />
            <Divider />
            <Item
              text={t('clair')}
              action={() => _changeTheme('light')}
              icon={'sun'}
              type="modal"
              drapeau={undefined}
            />
            <Divider />
            <Item
              text={t('sombre')}
              action={() => _changeTheme('dark')}
              icon={'moon'}
              type="modal"
              drapeau={undefined}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  const _changeTheme = (theme: AppTheme) => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        const color = getThemeColor(theme);
        setStatusBarBackgroundColor(color);
        setBackgroundColorAsync(color);
      }, 200);
    }
    setTheme(theme);
    setModalTheme(false);
  };

  const version = Constants.expoConfig?.extra?.appVersion;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-custom-background">
        <TopBarBack title={t('parametres')} />
        <ScrollView className="h-1">
          <VStack space="lg" className="flex-1 px-10">
            <VStack>
              <Text className="text-xl text-typography-white mb-1">
                {t('a_propos')}
              </Text>
              <Box className="border border-custom-bg-inverse rounded-lg">
                <Item
                  text={t('voir_source_code')}
                  action={() => _openURL(githubRepository)}
                  icon="code"
                  type={''}
                  drapeau={undefined}
                />
                <Divider />
                <Item
                  text="tournoispetanqueapp@gmail.com"
                  action={() => _openURL(mail)}
                  icon="envelope"
                  type={''}
                  drapeau={undefined}
                />
              </Box>
            </VStack>
            <VStack>
              <Text className="text-xl text-typography-white mb-1">
                {t('reglages')}
              </Text>
              <Box className="border border-custom-bg-inverse rounded-lg">
                <Item
                  text={t('changer_theme')}
                  action={() => setModalTheme(true)}
                  icon="palette"
                  type={''}
                  drapeau={undefined}
                />
                <Divider />
                <Item
                  text={t('changer_langue')}
                  action={() => openModalLanguages(true)}
                  icon="language"
                  type={''}
                  drapeau={undefined}
                />
                <Divider />
                <Item
                  text={t('modifier_consentement')}
                  action={() => _adsConsentShowForm()}
                  icon="ad"
                  type={''}
                  drapeau={undefined}
                />
                <Divider />
                <Item
                  text={t('supprimer_donnees')}
                  action={() => openAlert(true)}
                  icon="trash-alt"
                  type="danger"
                  drapeau={undefined}
                />
              </Box>
            </VStack>
            <VStack>
              <Text className="text-xl text-typography-white mb-1">
                {t('nouveautes')}
              </Text>
              <Box className="border border-custom-bg-inverse rounded-lg">
                <Item
                  text={t('voir_nouveautes')}
                  action={() => router.navigate('/parametres/changelog')}
                  icon="certificate"
                  type={''}
                  drapeau={undefined}
                />
              </Box>
            </VStack>
          </VStack>
        </ScrollView>
        <Center>
          <Text className="text-center text-md text-typography-white">
            {t('version')} {version}
          </Text>
        </Center>
        {_alertDialogClearData()}
        {_modalLanguages()}
        {_modalTheme()}
      </VStack>
    </SafeAreaView>
  );
};

export default Parametres;
