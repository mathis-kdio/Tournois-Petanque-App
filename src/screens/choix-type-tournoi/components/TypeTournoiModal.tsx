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
import { Text } from '@/components/ui/text';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { useTranslation } from 'react-i18next';

export interface Props {
  modalType: TypeTournoi;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TypeTournoiModal: React.FC<Props> = ({
  modalType,
  showModal,
  setShowModal,
}) => {
  const { t } = useTranslation();

  const infosModal = {
    'mele-demele': {
      title: t('melee_demelee'),
      text: t('description_melee_demelee'),
    },
    melee: {
      title: t('melee'),
      text: t('description_melee'),
    },
    championnat: {
      title: t('championnat'),
      text: t('description_championnat'),
    },
    coupe: {
      title: t('coupe'),
      text: t('description_coupe'),
    },
    'multi-chances': {
      title: t('multi_chances'),
      text: t('description_multi_chances'),
    },
  };

  const infos = infosModal[modalType] as { title: string; text: string };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <ModalBackdrop />
      <ModalContent className="max-h-5/6">
        <ModalHeader>
          <Heading className="color-custom-text-modal">{infos.title}</Heading>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text>{infos.text}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TypeTournoiModal;
