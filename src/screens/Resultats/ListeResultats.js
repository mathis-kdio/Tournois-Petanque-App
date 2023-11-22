import React from 'react'
import { connect } from 'react-redux'
import ListeResultatItem from '@components/ListeResultatItem'
import { rankingCalc } from '@utils/ranking'
import { withTranslation } from 'react-i18next'
import { HStack, FlatList, Text, VStack, Divider } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import TopBarBack from '../../components/TopBarBack'

class ListeResultats extends React.Component {

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex={1} bgColor={"#0594ae"}>
          {<TopBarBack title={t("resultats_classement_navigation_title")} navigation={this.props.navigation}/>}
          <VStack flex={1} justifyContent='space-between'>
            <HStack px={'$2'}>
              <Text flex={2} color='white' fontSize={'$lg'}>{t("place")}</Text>
              <Text flex={1} textAlign='center' color='white' fontSize={'$lg'}>{t("victoire")}</Text>
              <Text flex={1} textAlign='center' color='white' fontSize={'$lg'}>{t("m_j")}</Text>
              <Text flex={1} textAlign='right' color='white' fontSize={'$lg'}>{t("point")}</Text>
            </HStack>
            <Divider my="$0.5" />
            <FlatList
              data={rankingCalc(this.props.listeMatchs)}
              keyExtractor={(item) => item.joueurId.toString()}
              renderItem={({item}) => (
                <ListeResultatItem
                  joueur={item}
                />
              )}
            />
          </VStack>
        </VStack>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeResultats))