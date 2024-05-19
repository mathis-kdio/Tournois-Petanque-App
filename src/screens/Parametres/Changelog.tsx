import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VStack, Text, FlatList, Divider, Modal, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody, Heading, CloseIcon } from '@gluestack-ui/themed'
import { withTranslation } from "react-i18next";
import TopBarBack from '@components/TopBarBack'
import ChangelogData from '@assets/ChangelogData.json'
import Item from '@components/Item'
import { PropsFromRedux, connector } from '@/store/connector';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { Changelog as ChangelogInterface} from '@/types/interfaces/changelog'
import { ListRenderItem } from 'react-native';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
  alertOpen: boolean;
  modalChangelogOpen: boolean;
  modalChangelogItem: ChangelogInterface;
}

class Changelog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      alertOpen: false,
      modalChangelogOpen: false,
      modalChangelogItem: undefined,
    }
  }

  _modalChangelog() {
    const { t } = this.props;
    if (this.state.modalChangelogItem) {
      let title = t("version")+' '+this.state.modalChangelogItem.version;
      return (
        <Modal isOpen={this.state.modalChangelogOpen} onClose={() => this.setState({modalChangelogOpen: false})}>
          <ModalBackdrop/>
          <ModalContent maxHeight='$5/6'>
            <ModalHeader>
              <Heading>{title}</Heading>
              <ModalCloseButton>
                <CloseIcon/>
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text>{t(`${this.state.modalChangelogItem.id}.infos`, { ns: 'changelog', returnObjects: true, joinArrays: '\n' })}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )
    }
  }

  _changelogItem(item) {
    const { t } = this.props;
    return (
      <VStack>
        <Item text={t("version")+" "+item.version+" :"} action={() => this.setState({modalChangelogOpen: true, modalChangelogItem: item})} icon={undefined} type={undefined} drapeau={undefined}/>
        <Divider/>
      </VStack>
    )
  }

  render() {
    const { t } = this.props;
    const renderItem: ListRenderItem<ChangelogInterface> = ({item}) => (
      this._changelogItem(item)
    );
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor='#0594ae'>
          <TopBarBack title={t("nouveautes")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'}>
            <Text fontSize={'$xl'} color='$white' mb={'$1'}>{t("nouveautes")}</Text>
            <FlatList 
              height={'$1'}
              data={Object.values(ChangelogData).reverse()}
              keyExtractor={(item: ChangelogInterface) => item.id.toString() }
              renderItem={renderItem}
              borderWidth={'$1'}
              borderColor='white'
              borderRadius={'$lg'}
            />
          </VStack>
        </VStack>
        {this._modalChangelog()}
      </SafeAreaView>
    )
  }
}

export default connector(withTranslation(['common', 'changelog'])(Changelog))