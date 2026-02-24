import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { SELECTED_LANGUAGE_KEY } from '@/utils/async-storage/key';
import Item from '@components/Item';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { _openURL } from '@utils/link';
import { changeLanguage } from 'i18next';
import { useTranslation } from 'react-i18next';

export interface Props {
  modalLanguagesOpen: boolean;
  setModalLanguagesOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LanguagesModal: React.FC<Props> = ({
  modalLanguagesOpen,
  setModalLanguagesOpen,
}) => {
  const crowdin = 'https://crowdin.com/project/tournois-de-ptanque-gcu';

  const { t } = useTranslation();

  const handleChangeLanguage = async (language: string) => {
    await changeLanguage(language);
    await AsyncStorage.setItem(SELECTED_LANGUAGE_KEY, language);
    setModalLanguagesOpen(false);
  };

  const drapeauFrance = require('@assets/images/drapeau-france.png');
  const drapeauUSA = require('@assets/images/drapeau-usa.png');
  const drapeauPologne = require('@assets/images/drapeau-pologne.png');
  const drapeauPaysBas = require('@assets/images/drapeau-pays-bas.png');
  const drapeauAllemagne = require('@assets/images/drapeau-allemagne.png');
  const drapeauDanemark = require('@assets/images/drapeau-danemark.png');
  return (
    <Modal
      isOpen={modalLanguagesOpen}
      onClose={() => setModalLanguagesOpen(false)}
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
            action={() => handleChangeLanguage('fr-FR')}
            icon={''}
            type="modal"
            drapeau={drapeauFrance}
          />
          <Divider />
          <Item
            text={t('anglais')}
            action={() => handleChangeLanguage('en-US')}
            icon={''}
            type="modal"
            drapeau={drapeauUSA}
          />
          <Divider />
          <Item
            text={t('polonais')}
            action={() => handleChangeLanguage('pl-PL')}
            icon={''}
            type="modal"
            drapeau={drapeauPologne}
          />
          <Divider />
          <Item
            text={t('neerlandais')}
            action={() => handleChangeLanguage('nl-NL')}
            icon={''}
            type="modal"
            drapeau={drapeauPaysBas}
          />
          <Divider />
          <Item
            text={t('allemand')}
            action={() => handleChangeLanguage('de-DE')}
            icon={''}
            type="modal"
            drapeau={drapeauAllemagne}
          />
          <Divider />
          <Item
            text={t('danois')}
            action={() => handleChangeLanguage('dk-DK')}
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

export default LanguagesModal;
