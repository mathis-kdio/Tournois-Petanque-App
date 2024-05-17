import React from 'react'
import { connect } from 'react-redux'
import ListeResultatItem from '@components/ListeResultatItem'
import { ranking } from '@utils/ranking'
import { withTranslation } from 'react-i18next'
import { HStack, FlatList, Text, VStack, Divider } from '@gluestack-ui/themed'
import { TFunction } from 'i18next'

export interface Props {
  t: TFunction;
}

interface State {
}

class ListeResultats extends React.Component<Props, State> {

  render() {
    const { t } = this.props;
    return (
      <VStack flex={1} bgColor={"#0594ae"}>
        <VStack flex={1} justifyContent='space-between'>
          <HStack px={'$2'}>
            <Text flex={2} color='$white' fontSize={'$lg'}>{t("place")}</Text>
            <Text flex={1} textAlign='center' color='$white' fontSize={'$lg'}>{t("victoire")}</Text>
            <Text flex={1} textAlign='center' color='$white' fontSize={'$lg'}>{t("m_j")}</Text>
            <Text flex={1} textAlign='right' color='$white' fontSize={'$lg'}>{t("point")}</Text>
          </HStack>
          <Divider my={'$0.5'} />
          <FlatList
            data={ranking(this.props.listeMatchs)}
            keyExtractor={(item) => item.joueurId.toString()}
            renderItem={({item}) => (
              <ListeResultatItem
                joueur={item}
              />
            )}
          />
        </VStack>
      </VStack>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeResultats))