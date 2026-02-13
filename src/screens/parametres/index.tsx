import TopBarBack from '@/components/topBar/TopBarBack';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import Item from '@components/Item';
import { _adsConsentShowForm } from '@utils/adMob/consentForm';
import { _openURL } from '@utils/link';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ClearDataAlertDialog from './components/ClearDataAlertDialog';
import LanguagesModal from './components/LanguagesModal';
import ThemeModal from './components/ThemeModal';

const Parametres = () => {
  const githubRepository =
    'https://github.com/mathis-kdio/Tournois-Petanque-App';
  const mail = 'mailto:tournoispetanqueapp@gmail.com';

  const [alertOpen, setAlertOpen] = useState(false);
  const [modalLanguagesOpen, setModalLanguagesOpen] = useState(false);
  const [modalThemeOpen, setModalThemeOpen] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const alertDialogClearData = () => {
    return (
      <ClearDataAlertDialog alertOpen={alertOpen} setAlertOpen={setAlertOpen} />
    );
  };

  const modalLanguages = () => {
    return (
      <LanguagesModal
        modalLanguagesOpen={modalLanguagesOpen}
        setModalLanguagesOpen={setModalLanguagesOpen}
      />
    );
  };

  const modalTheme = () => {
    return (
      <ThemeModal
        modalThemeOpen={modalThemeOpen}
        setModalThemeOpen={setModalThemeOpen}
      />
    );
  };

  const version = Constants.expoConfig?.extra?.appVersion;

  return (
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
                action={() => setModalThemeOpen(true)}
                icon="palette"
                type={''}
                drapeau={undefined}
              />
              <Divider />
              <Item
                text={t('changer_langue')}
                action={() => setModalLanguagesOpen(true)}
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
                action={() => setAlertOpen(true)}
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
      {alertDialogClearData()}
      {modalLanguages()}
      {modalTheme()}
    </VStack>
  );
};

export default Parametres;
