import React from 'react'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VStack, Text, FlatList, Divider, Modal, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody, Heading, CloseIcon } from '@gluestack-ui/themed'
import { withTranslation } from "react-i18next";
import TopBarBack from '@components/TopBarBack'
import ChangelogData from '@assets/ChangelogData.json'
import Item from '@components/Item'

class Changelog extends React.Component {
  constructor(props) {
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
      let title = "Version "+this.state.modalChangelogItem.version;
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
    return (
      <VStack>
        <Item text={"Version "+item.version+" :"} action={() => this.setState({modalChangelogOpen: true, modalChangelogItem: item})} icon={undefined} type={undefined} drapeau={undefined}/>
        <Divider/>
      </VStack>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor='#0594ae'>
          <TopBarBack title={t("nouveautes")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'}>
            <Text fontSize={'$xl'} color='$white' mb={'$1'}>{t("nouveautes")}</Text>
            <FlatList 
              height={'$1'}
              data={Object.values(ChangelogData).reverse()}
              keyExtractor={(item) => item.id.toString() }
              renderItem={({item}) => this._changelogItem(item)}
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

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    savedLists: state.listesJoueurs.listesSauvegarde,
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois,
    listeTerrains: state.listeTournois.listeTerrains,
    optionsTournoi: state.optionsTournoi.options,
  }
}

export default connect(mapStateToProps)(withTranslation(['common', 'changelog'])(Changelog))