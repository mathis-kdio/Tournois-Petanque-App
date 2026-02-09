import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import ChangelogData from '@assets/ChangelogData.json';
import { Changelog as ChangelogInterface } from '@/types/interfaces/changelog';
import { ListRenderItem } from 'react-native';
import ChangelogItem from './components/ChangelogItem';
import ChangelogModal from './components/ChangelogModal';

const Changelog = () => {
  const [modalChangelogOpen, openModalChangelog] = useState(false);
  const [modalChangelogItem, setModalChangelogItem] = useState<
    ChangelogInterface | undefined
  >(undefined);

  const { t } = useTranslation(['common', 'changelog']);

  const modalChangelog = () => {
    if (!modalChangelogItem) {
      return;
    }
    return (
      <ChangelogModal
        modalChangelogItem={modalChangelogItem}
        modalChangelogOpen={modalChangelogOpen}
        openModalChangelog={openModalChangelog}
      />
    );
  };

  const renderItem: ListRenderItem<ChangelogInterface> = ({ item }) => {
    return (
      <ChangelogItem
        item={item}
        openModalChangelog={openModalChangelog}
        setModalChangelogItem={setModalChangelogItem}
      />
    );
  };

  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('nouveautes')} />
      <VStack className="flex-1 px-10">
        <Text className="text-xl text-typography-white mb-1">
          {t('nouveautes')}
        </Text>
        <FlatList
          data={Object.values(ChangelogData).reverse()}
          keyExtractor={(item: ChangelogInterface) => item.id.toString()}
          renderItem={renderItem}
          className="h-1 border border-custom-bg-inverse rounded-lg"
        />
      </VStack>
      {modalChangelog()}
    </VStack>
  );
};

export default Changelog;
