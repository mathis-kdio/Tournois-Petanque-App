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

import { Divider } from '@/components/ui/divider';
import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import ChangelogData from '@assets/ChangelogData.json';
import Item from '@components/Item';
import { Changelog as ChangelogInterface } from '@/types/interfaces/changelog';
import { ListRenderItem } from 'react-native';

const Changelog = () => {
  const [modalChangelogOpen, openModalChangelog] = useState(false);
  const [modalChangelogItem, setModalChangelogItem] =
    useState<ChangelogInterface>();

  const { t } = useTranslation(['common', 'changelog']);

  const _modalChangelog = () => {
    if (modalChangelogItem) {
      let title = t('version') + ' ' + modalChangelogItem.version;
      return (
        <Modal
          isOpen={modalChangelogOpen}
          onClose={() => openModalChangelog(false)}
        >
          <ModalBackdrop />
          <ModalContent className="max-h-5/6">
            <ModalHeader>
              <Heading className="text-black">{title}</Heading>
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
    }
  };

  const _changelogItem = (item: ChangelogInterface) => {
    return (
      <VStack>
        <Item
          text={t('version') + ' ' + item.version + ' :'}
          action={() => {
            openModalChangelog(true);
            setModalChangelogItem(item);
          }}
          icon={''}
          type={''}
          drapeau={undefined}
        />
        <Divider />
      </VStack>
    );
  };

  const renderItem: ListRenderItem<ChangelogInterface> = ({ item }) =>
    _changelogItem(item);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-[#0594ae]">
        <TopBarBack title={t('nouveautes')} />
        <VStack className="flex-1 px-10">
          <Text className="text-xl text-white mb-1">{t('nouveautes')}</Text>
          <FlatList
            data={Object.values(ChangelogData).reverse()}
            keyExtractor={(item: ChangelogInterface) => item.id.toString()}
            renderItem={renderItem}
            className="h-1 border border-white rounded-lg"
          />
        </VStack>
      </VStack>
      {_modalChangelog()}
    </SafeAreaView>
  );
};

export default Changelog;
