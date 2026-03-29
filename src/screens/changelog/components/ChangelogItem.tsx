import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { Changelog as ChangelogInterface } from '@/types/interfaces/changelog';
import Item from '@components/Item';
import { useTranslation } from 'react-i18next';

export interface Props {
  item: ChangelogInterface;
  openModalChangelog: React.Dispatch<React.SetStateAction<boolean>>;
  setModalChangelogItem: React.Dispatch<
    React.SetStateAction<ChangelogInterface | undefined>
  >;
}

const ChangelogItem: React.FC<Props> = ({
  item,
  openModalChangelog,
  setModalChangelogItem,
}) => {
  const { t } = useTranslation(['common', 'changelog']);

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

export default ChangelogItem;
