import React from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { rankingCalc } from '@utils/ranking';
import { withTranslation } from 'react-i18next';

class PDFExport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      btnIsLoading: [false, false, false],
    }
  }

  generatePDF = async (affichageScore, affichageClassement, buttonId) => {
    let toursParLigne = 3
    let nbTours = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbTours;
    let nbMatchs = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbMatchs;
    let listeMatchs = this.props.listeMatchs;
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs;
    let nbMatchsParTour = 0;
    let typeTournoi = this.props.listeMatchs[this.props.listeMatchs.length - 1].typeTournoi;
    if (typeTournoi == "coupe") {
      nbMatchsParTour = (nbMatchs + 1) / 2;
    }
    else {
      nbMatchsParTour = nbMatchs / nbTours;
    }
    let nbTables = Math.ceil(nbTours / toursParLigne);
    let nbToursRestants = nbTours;
    let html = `<!DOCTYPE html><html><head><style>@page{margin: 10px;} table{width: 100%;} table,th,td{border: 1px solid black;border-collapse: collapse;} td{min-width: 50px; word-break:break-all;} .td-score{min-width: 20px;} .text-right{text-align: right;} .text-center{text-align: center;} .no-border-top{border-top: none;} .no-border-bottom{border-bottom: none;} .border-top{border-top: 1px solid;}</style></head><body>
    <h1 class="text-center">Tournoi</h1>`;
    for (let tableIdx = 0; tableIdx < nbTables; tableIdx++) {
      let minTourTable = tableIdx * toursParLigne;
      html += '<table><tr>';
      let nbTourTable = toursParLigne;
      if (nbToursRestants < toursParLigne) {
        nbTourTable = nbToursRestants;
      }
      nbToursRestants -= toursParLigne; 
      for (let i = 1; i <= nbTourTable; i++) {
        html += '<th colspan="4">Tour n°' + (minTourTable + i) + '</th>';      
      }
      html += '</tr>';

      for (let i = 0; i < nbMatchsParTour; i++) {
        let matchNbJoueur = 1;
        if (listeMatchs[i].equipe[0][2] != -1) {
          matchNbJoueur = 3;
        }
        else if (listeMatchs[i].equipe[0][1] != -1) {
          matchNbJoueur = 2;
        }
        for (let jidx = 0; jidx < matchNbJoueur; jidx++) {
          if (jidx == 0) {
            html += '<tr class="border-top">';
          }
          else {
            html += '<tr class="">';
          }
          for (let j = 0; j < nbTourTable; j++) {
            console.log("test")
            let matchId = tableIdx * (toursParLigne * nbMatchsParTour) + j * nbMatchsParTour + i;
            console.log("tableIdx "+tableIdx)
            console.log("toursParLigne "+toursParLigne)
            console.log("nbMatchsParTour "+nbMatchsParTour)
            console.log("j "+j)
            console.log("i "+i)
            console.log("matchId "+matchId)
            console.log("end test4")
            //Joueur equipe 1
            html += '<td class="no-border-bottom no-border-top">';
            console.log(listeMatchs[matchId])
            console.log(listeMatchs[matchId].equipe)
            if (listeMatchs[matchId].equipe[0][jidx] != -1) {
              let joueur = listeJoueurs[listeMatchs[matchId].equipe[0][jidx]];
              if (joueur.name === undefined) {
                html += 'Sans Nom ('+ (joueur.id+1) +')';
              }
              else if (joueur.name == "") {
                html += 'Joueur '+ (joueur.id+1);
              }
              else {
                html += joueur.name +' ('+ (joueur.id+1) +')';
              }
            }
            html += '</td>';

            if (jidx == 0) {//Cases scores
              //score equipe 1
              html += '<td rowspan="'+ matchNbJoueur +'" class="td-score text-center">';
              if (affichageScore == true && listeMatchs[matchId].score1) {
                html += listeMatchs[matchId].score1;
              }
              html += '</td>';
              //score equipe 2
              html += '<td rowspan="'+ matchNbJoueur +'" class="td-score text-center">';
              if (affichageScore == true && listeMatchs[matchId].score2) {
                html += listeMatchs[matchId].score2;
              }
              html += '</td>';
            }

            //Joueur equipe 2
            html += '<td class="text-right no-border-bottom no-border-top">';
            console.log(listeMatchs[matchId].equipe)
            if (listeMatchs[matchId].equipe[1][jidx] != -1) {
              let joueur = listeJoueurs[listeMatchs[matchId].equipe[1][jidx]];
              if (joueur.name === undefined) {
                html += 'Sans Nom ('+ (joueur.id+1) +')';
              }
              else if (joueur.name == "") {
                html += 'Joueur '+ (joueur.id+1);
              }
              else {
                html += joueur.name +' ('+ (joueur.id+1) +')';
              }
            }
            html += '</td>';
            if (typeTournoi == "coupe") {
              nbMatchsParTour /= 2;
            }
          }
          if (typeTournoi == "coupe") {
            nbMatchsParTour = (nbMatchs + 1) / 2;
          }
          html += '</tr>';
        }
      }
      html += '</tr></table><br>';
    }
    if (affichageClassement == true) {
      html += '<br><table><tr>';
      html += '<th>Place</th><th>Victoires</th><th>Matchs Joués</th><th>Points</th>';
      let classement = rankingCalc(this.props.listeMatchs);
      for (let i = 0; i < listeJoueurs.length; i++) {
        html += '<tr>';
        html += '<td>' + classement[i].position + ' - ';
        let joueur = listeJoueurs[classement[i].joueurId];
        if (joueur.name === undefined) {
          html += 'Sans Nom ('+ (joueur.id+1) +')';
        }
        else if (joueur.name == "") {
          html += 'Joueur '+ (joueur.id+1);
        }
        else {
          html += joueur.name +' ('+ (joueur.id+1) +')';
        }
        html += '</td>'
        html += '<td class="text-center">'+ classement[i].victoires +'</td>';
        html += '<td class="text-center">'+ classement[i].nbMatchs +'</td>';
        html += '<td class="text-center">'+ classement[i].points +'</td>';
        html += '</tr>';
      }
      html += '</tr></table>';
    }
    html += '</body></html>';
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      Sharing.shareAsync(uri).then(this._toggleLoading(buttonId));
    }
    else {
      this._toggleLoading(buttonId)
    }
  }

  _toggleLoading(buttonId) {
    let newBtnIsLoading = this.state.btnIsLoading
    newBtnIsLoading[buttonId] = !this.state.btnIsLoading[buttonId]
    this.setState({
      btnIsLoading: newBtnIsLoading
    })
  };

  _onPressExportBtn(buttonId, affichageScore, affichageClassement) {
    this._toggleLoading(buttonId)
    this.generatePDF(affichageScore, affichageClassement, buttonId)
  };

  _exportButton(buttonId, buttonText, affichageScore, affichageClassement) {
    return (
      <Pressable 
        onPress={() => this._onPressExportBtn(buttonId, affichageScore, affichageClassement)}
      >
        <View style={styles.button}>
          {this.state.btnIsLoading[buttonId] && <ActivityIndicator size="small" color="white" />}
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      </Pressable>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View style={styles.buttonView}>
            {this._exportButton(0, t("export_pdf_sans_scores"), false, false)}
          </View>
          <View style={styles.buttonView}>
            {this._exportButton(1, t("export_pdf_avec_scores"), true, false)}
          </View>
          <View style={styles.buttonView}>
            {this._exportButton(2, t("export_pdf_avec_scores_classement"), true, true)}
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
  warning_text: {
    fontSize: 20,
    textAlign: "justify",
    color: 'white'
  },
  buttonView: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#1c3969',
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    letterSpacing: 0.25,
    color: 'white'
  },
});

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(withTranslation()(PDFExport))