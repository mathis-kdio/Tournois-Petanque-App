import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux'
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

class PDFExport extends React.Component {
  constructor(props) {
    super(props);
  }

  calculClassement() {
    let victoires = []
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs
    for (let i = 1; i < listeJoueurs.length + 1; i++) {
      let nbVictoire = 0;
      let nbPoints = 0;
      let listeMatchs = this.props.listeMatchs
      for (let j = 0; j < listeMatchs[listeMatchs.length - 1].nbMatchs; j++) {
        if (listeMatchs[j].equipe[0].includes(i) && listeMatchs[j].score1) {
          if (listeMatchs[j].score1 == 13) {
            nbVictoire++;
            nbPoints += 13 - listeMatchs[j].score2;
          }
          else {
            nbPoints -= 13 - listeMatchs[j].score1;
          }
         }
        if (listeMatchs[j].equipe[1].includes(i) && listeMatchs[j].score2) {
          if (listeMatchs[j].score2 == 13) {
            nbVictoire++;
            nbPoints += 13 - listeMatchs[j].score1;
          }
          else {
            nbPoints -= 13 - listeMatchs[j].score2;
          }
        }
      }
      victoires[i-1] = {joueurId: i, victoires: nbVictoire, points: nbPoints, position: undefined};
    }
    victoires.sort(
      function(a, b) {          
        if (a.victoires === b.victoires) {
          return b.points - a.points;
        }
        return b.victoires - a.victoires;
      }
    );
    let position = 1;
    for (let i = 0; i < victoires.length; i++) {
      if(i > 0 && victoires[i-1].victoires === victoires[i].victoires && victoires[i-1].points === victoires[i].points) {
        victoires[i].position = victoires[i-1].position;
      }
      else {
        victoires[i].position = position;
      }
      position++;
    }
    return victoires
  }

  generatePDF = async (affichageScore, affichageClassement) => {
    let toursParLigne = 3
    let nbTours = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbTours;
    let nbMatchs = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbMatchs;
    let listeMatchs = this.props.listeMatchs;
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs;
    let matchsParTour = nbMatchs / nbTours;
    let html = `<!DOCTYPE html><html><head><style>@page{margin: 10px;} table{width: 100%;} table,th,td{border: 1px solid black;border-collapse: collapse;} td{min-width: 50px; word-break:break-all;} .td-score{min-width: 20px;} .text-right{text-align: right;} .text-center{text-align: center;} .no-border-top{border-top: none;} .no-border-bottom{border-bottom: none;}</style></head><body>
    <h1 class="text-center">Tournoi</h1>`;
    for (let k = 0; k < nbTours / toursParLigne; k++) {
      let tourLigneNb = k * toursParLigne;
      html += '<table><tr>';
      for (let i = 1; i <= toursParLigne; i++) {
        html += '<th colspan="4">Tour n°' + (tourLigneNb + i) + '</th>';      
      }
      html += '</tr>';
      for (let i = 0; i < matchsParTour; i++) {
        html += '<tr>';
        for (let j = 0; j < toursParLigne; j++) {
          html += '<td class="no-border-bottom">'+ listeJoueurs[listeMatchs[tourLigneNb + i + j * matchsParTour].equipe[0][0] - 1].name +'</td>';
          html += '<td rowspan="2" class="td-score text-center">';
          if (affichageScore == true && listeMatchs[tourLigneNb + i + j * matchsParTour].score1) {
            html += listeMatchs[tourLigneNb + i + j * matchsParTour].score1;
          }
          html += '</td><td rowspan="2" class="td-score text-center">';
          if (affichageScore == true && listeMatchs[tourLigneNb + i + j * matchsParTour].score2) {
            html += listeMatchs[tourLigneNb + i + j * matchsParTour].score2;
          }
          html += '</td>';
          html += '<td class="text-right no-border-bottom">'+ listeJoueurs[listeMatchs[tourLigneNb + i + j * matchsParTour].equipe[1][0] - 1].name +'</td>';
        }
        html += '</tr><tr>';
        for (let j = 0; j < toursParLigne; j++) {
          html += '<td class="no-border-top">'+ listeJoueurs[listeMatchs[tourLigneNb + i + j * matchsParTour].equipe[0][1] - 1].name +'</td>';
          html += '<td class="text-right no-border-top">'+ listeJoueurs[listeMatchs[tourLigneNb + i + j * matchsParTour].equipe[1][1] - 1].name +'</td>';
        }
        html += '</tr>';
      }
      html += '</tr></table><br>';
    }
    if (affichageClassement == true) {
      html += '<br><table><tr>';
      html += '<th>Place</th><th>Victoires</th><th>Matchs Joués</th><th>Points</th>';
      let classement = this.calculClassement();
      for (let i = 0; i < listeJoueurs.length; i++) {
        html += '<tr>';
        html += '<td>'+ listeJoueurs[i].name +'</td>';
        html += '<td class="text-center">'+ classement[i].victoires +'</td>';
        html += '<td class="text-center">'+ classement[i].points +'</td>';
        html += '<td class="text-center">'+ classement[i].position +'</td>';
        html += '</tr>';
      }
      html += '</tr></table>';
    }
    html += '</body></html>';
    const { uri } = await Print.printToFileAsync({ html });
    Sharing.shareAsync(uri);
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View style={styles.buttonView}>
            <Button color="#1c3969" title="Exporter en PDF (sans scores)" onPress={() => this.generatePDF(false, false)}/>
          </View>
          <View style={styles.buttonView}>
            <Button color="#1c3969" title="Exporter en PDF (avec scores)" onPress={() => this.generatePDF(true, false)}/>
          </View>
          <View style={styles.buttonView}>
            <Button color="#1c3969" title="Exporter en PDF (avec scores + classement)" onPress={() => this.generatePDF(true, true)}/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  body_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
});

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(PDFExport)