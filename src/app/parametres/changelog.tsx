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
import React from 'react';
import { withTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import ChangelogData from '@assets/ChangelogData.json';
import Item from '@components/Item';
import { PropsFromRedux, connector } from '@/store/connector';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { Changelog as ChangelogInterface } from '@/types/interfaces/changelog';
import { ListRenderItem } from 'react-native';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {
  alertOpen: boolean;
  modalChangelogOpen: boolean;
  modalChangelogItem: ChangelogInterface;
}

class Changelog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      alertOpen: false,
      modalChangelogOpen: false,
      modalChangelogItem: undefined,
    };
  }

  _modalChangelog() {
    const { t } = this.props;
    if (this.state.modalChangelogItem) {
      let title = t('version') + ' ' + this.state.modalChangelogItem.version;
      return (
        <Modal
          isOpen={this.state.modalChangelogOpen}
          onClose={() => this.setState({ modalChangelogOpen: false })}
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
                {t(`${this.state.modalChangelogItem.id}.infos`, {
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
  }

  _changelogItem(item) {
    const { t } = this.props;
    return (
      <VStack>
        <Item
          text={t('version') + ' ' + item.version + ' :'}
          action={() =>
            this.setState({
              modalChangelogOpen: true,
              modalChangelogItem: item,
            })
          }
          icon={undefined}
          type={undefined}
          drapeau={undefined}
        />
        <Divider />
      </VStack>
    );
  }

  render() {
    const { t } = this.props;
    const renderItem: ListRenderItem<ChangelogInterface> = ({ item }) =>
      this._changelogItem(item);
    return (
      <VStack className="flex-1 bg-[#0594ae]">
        <TopBarBack
          title={t('nouveautes')}
          navigation={this.props.navigation}
        />
        <VStack className="flex-1 px-10">
          <Text className="text-xl text-white mb-1">{t('nouveautes')}</Text>
          <FlatList
            data={Object.values(ChangelogData).reverse()}
            keyExtractor={(item: ChangelogInterface) => item.id.toString()}
            renderItem={renderItem}
            className="h-1 border border-white rounded-lg"
          />
        </VStack>
        {this._modalChangelog()}
      </VStack>
    );
  }
}

export default connector(withTranslation(['common', 'changelog'])(Changelog));
