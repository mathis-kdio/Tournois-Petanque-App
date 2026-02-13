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
import { Changelog as ChangelogInterface } from '@/types/interfaces/changelog';
import { useTranslation } from 'react-i18next';

export interface Props {
  modalChangelogItem: ChangelogInterface;
  modalChangelogOpen: boolean;
  openModalChangelog: (value: React.SetStateAction<boolean>) => void;
}

const ChangelogModal: React.FC<Props> = ({
  modalChangelogItem,
  modalChangelogOpen,
  openModalChangelog,
}) => {
  const { t } = useTranslation(['common', 'changelog']);

  const title = `${t('version')} ${modalChangelogItem.version}`;
  return (
    <Modal
      isOpen={modalChangelogOpen}
      onClose={() => openModalChangelog(false)}
    >
      <ModalBackdrop />
      <ModalContent className="max-h-5/6">
        <ModalHeader>
          <Heading className="color-custom-text-modal">{title}</Heading>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text>
            {t(`${modalChangelogItem.id}.infos`, {
              ns: 'changelog',
              returnObjects: true,
              joinArrays: '\n',
            })}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangelogModal;
