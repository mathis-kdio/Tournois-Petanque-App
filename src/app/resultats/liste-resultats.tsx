import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { FlatList } from '@/components/ui/flat-list';
import { HStack } from '@/components/ui/hstack';
import ListeResultatItem from '@components/ListeResultatItem';
import { ranking } from '@utils/ranking';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { PropsFromRedux, connector } from '@/store/connector';
import { ListRenderItem } from 'react-native';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { Victoire } from '@/types/interfaces/victoire';
import WithExitAlert from '@/app/with-exit-alert/WithExitAlert';
import { StackNavigationProp } from '@react-navigation/stack';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {}

class ListeResultats extends WithExitAlert<Props, State> {
  render() {
    const { t } = this.props;
    let listeMatchs = this.props.listeMatchs.slice(0, -1);
    let optionsTournois = this.props.listeMatchs.at(-1) as OptionsTournoi;
    const renderItem: ListRenderItem<Victoire> = ({ item }) => (
      <ListeResultatItem joueur={item} />
    );
    return (
      <VStack className="flex-1 bg-[#0594ae]">
        <VStack className="flex-1 justify-between">
          <HStack className="flex px-2">
            <Text className="basis-2/5 text-white text-lg">{t('place')}</Text>
            <Text className="basis-1/5 text-center text-white text-lg">
              {t('victoire')}
            </Text>
            <Text className="basis-1/5 text-center text-white text-lg">
              {t('m_j')}
            </Text>
            <Text className="basis-1/5 text-right text-white text-lg">
              {t('point')}
            </Text>
          </HStack>
          <Divider className="my-0.5" />
          <FlatList
            data={ranking(listeMatchs, optionsTournois)}
            keyExtractor={(item: Victoire) => item.joueurId.toString()}
            renderItem={renderItem}
          />
        </VStack>
      </VStack>
    );
  }
}

export default connector(withTranslation()(ListeResultats));
