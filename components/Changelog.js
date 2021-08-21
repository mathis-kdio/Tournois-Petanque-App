import React from 'react'
import { StyleSheet, View, Text, Button, SafeAreaView, ScrollView } from 'react-native'
import { expo } from '../app.json'
import * as Linking from 'expo-linking'

class Changelog extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.main_container}>
        <ScrollView>
          <View style={styles.body_container}>
            <Text style={styles.titre}>Version actuelle : {expo.version}</Text>
            <View style={styles.informations_container}>
              <Text style={styles.titre}>Version 1.5 :</Text>
              <Text style={styles.informations_texte}>
                - Tournois en équipes formées disponible.{"\n"}
                - Tournois en tête-à-tête disponible.{"\n"}
                - Tournois sans noms en triplette disponible.{"\n"}
                - Améliorations de la répartition des joueurs pour les tournois en triplette.{"\n"}
                - En doublette, quand le nombre de joueurs est impair, il est possible de choisir d'avoir des équipes en triplettes ou en tête-à-tête.{"\n"}
                - Alerte si mise à jour disponible.{"\n"}
                - Corrections de bugs.{"\n"}
              </Text>
            </View>
            <View style={styles.informations_container}>
              <Text style={styles.titre}>Version 1.4 :</Text>
              <Text style={styles.informations_texte}>
                - Tournoi en triplettes disponible{"\n"}
                <Text style={{color: 'red'}}>Attentions : Si vous avez un tournoi en cours, vous ne pourrez plus y acceder après cette mise à jour !</Text>{"\n"}
                - Page de changelog{"\n"}
                - Bouton pour noter et laisser un commentaire{"\n"}
                - Corrections de bugs{"\n"}
              </Text>
            </View>
            <View style={styles.informations_container}>
              <Text style={styles.titre}>Version 1.3 :</Text>
              <Text style={styles.informations_texte}>
                - Menu pour choisir modes de tournois et doublettes ou triplettes{"\n"}
                <Text style={{color: 'red'}}>Attentions : les modes triplettes et avec équipe ne marchent pas (pour l'instant)</Text>{"\n"}
                - Inscriptions sans indiquer les noms des joueurs, il suffit d'indiquer le nombre de joueurs normaux et spéciaux{"\n"}
                - Affichage du numéro des joueurs sur la page du classement et sur la page pour rentrer les scores{"\n"}
                - Corrections de bugs{"\n"}
              </Text>
            </View>
            <View style={styles.informations_container}>
              <Text style={styles.titre}>Version 1.2 :</Text>
              <Text style={styles.informations_texte}>
                - Meilleur mélange des joueurs spéciaux
              </Text>
            </View>
            <View style={styles.informations_container}>
              <Text style={styles.titre}>Version 1.1 :</Text>
              <Text style={styles.informations_texte}>
                - Affichage du numéro du joueur en plus de son nom s'il en a un
              </Text>
            </View>
            <View style={styles.informations_container}>
              <Text style={styles.titre}>Version 1.0 :</Text>
              <Text style={styles.informations_texte}>
                - Nouveau logo{"\n"}
                - L'application est désormais aux couleurs du GCU{"\n"}
                - Il devient possible de lancer des tournois avec un nombre de joueurs multiple de 2 et plus seulement avec un multiple de 4
              </Text>
            </View>
          </View>
          <View style={styles.create_container}>
            <Button color="#1c3969" title='Code OpenSource' onPress={() => Linking.openURL('https://github.com/mathis-kdio/Petanque-GCU')}/>
            <Text style={styles.create_text}>Par Mathis Cadio</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  body_container : {
    flex: 1,
    alignItems: 'center',
  },
  titre: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  informations_container: {
    alignItems: 'center',
    paddingHorizontal: '10%',
    marginBottom: 5
  },
  informations_texte: {
    fontSize: 18,
    color: 'white'
  },
  create_container: {
    alignItems: 'center',
    paddingBottom: 10
  },
  create_text: {
    fontSize: 15,
    color: 'white'
  },
})

export default Changelog