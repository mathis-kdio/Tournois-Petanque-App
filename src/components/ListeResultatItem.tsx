import { Joueur } from '@/types/interfaces/joueur';
import { HStack, Text, Image, Divider, VStack } from '@gluestack-ui/themed';
import { TFunction } from 'i18next';
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

export interface Props {
  t: TFunction;
  joueur: Joueur;
}

interface State {
  modalVisible: boolean;
}

class ListeResultatItem extends React.Component<Props, State> {

  _displayName(joueurId: number) {
    const { t } = this.props;
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs;
    let joueur = listeJoueurs.find((item: Joueur) => item.id === joueurId);
    let joueurName = "";
    if (joueur.name === undefined) {
      joueurName = t("sans_nom") + ' (' + (joueur.id+1) + ')';
    }
    else if (joueur.name == "") {
      joueurName = t("joueur") + " " + (joueur.id+1);
    }
    else {
      joueurName = joueur.name + ' (' + (joueur.id+1) + ')';
    }

    return (
      <Text color='$white' fontSize={'$lg'}>{joueurName}</Text>
    )
  }

  _fanny(joueurNumber: number) {
    let listeMatchs = this.props.listeMatchs;
    let fanny = false;
    let nbFanny = 0;
    for (let i = 0; i < listeMatchs[listeMatchs.length - 1].nbMatchs; i++) {
      if (listeMatchs[i].equipe[0].includes(joueurNumber) && listeMatchs[i].score1 == '0') {
        fanny = true;
        nbFanny++;
      }
      else if (listeMatchs[i].equipe[1].includes(joueurNumber) && listeMatchs[i].score2 == '0') {
        fanny = true;
        nbFanny++;
      }
    }
    if (fanny == true) {
      return (
        <HStack>
          <Image size='2xs' alt='Fanny' source={require('@assets/images/fanny.png')} /> 
          <Text color='$white' fontSize={'$lg'}>X{nbFanny}</Text>
        </HStack>
      )
    }
  }

  render() {
    const { joueur } = this.props;
    return (
      <VStack>
        <HStack px={'$2'} py={'$0.5'}>
          <HStack flex={2}>
            <Text color='$white' fontSize={'$lg'}>{joueur.position} - </Text>
            {this._displayName(joueur.joueurId)}
          </HStack>
          <Text flex={1} textAlign='center' color='$white' fontSize={'$lg'}>{joueur.victoires}</Text>
          <Text flex={1} textAlign='center' color='$white' fontSize={'$lg'}>{joueur.nbMatchs}</Text>
          <HStack flex={1} justifyContent='flex-end'>
            {this._fanny(joueur.joueurId)}
            <Text color='$white' fontSize={'$lg'}> {joueur.points}</Text>
          </HStack>
        </HStack>
        <Divider/>
      </VStack>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeResultatItem))