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
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import { AppTheme } from '@/utils/theme/theme';
import Item from '@components/Item';
import { useTranslation } from 'react-i18next';

export interface Props {
  modalThemeOpen: boolean;
  setModalThemeOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeModal: React.FC<Props> = ({ modalThemeOpen, setModalThemeOpen }) => {
  const { t } = useTranslation();
  const { setTheme } = useTheme();

  const changeTheme = (theme: AppTheme) => {
    setTheme(theme);
    setModalThemeOpen(false);
  };

  return (
    <Modal isOpen={modalThemeOpen} onClose={() => setModalThemeOpen(false)}>
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
            action={() => changeTheme('default')}
            icon={'copyright'}
            type="modal"
            drapeau={undefined}
          />
          <Divider />
          <Item
            text={t('clair')}
            action={() => changeTheme('light')}
            icon={'sun'}
            type="modal"
            drapeau={undefined}
          />
          <Divider />
          <Item
            text={t('sombre')}
            action={() => changeTheme('dark')}
            icon={'moon'}
            type="modal"
            drapeau={undefined}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ThemeModal;
