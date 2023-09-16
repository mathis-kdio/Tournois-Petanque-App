import React from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { rankingCalc } from '@utils/ranking';
import { withTranslation } from 'react-i18next';
import { generationPDFTournoi } from 'utils/pdf/tournoi';
import { generationPDFCoupe } from 'utils/pdf/coupe';

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
    let html = "";
    if (typeTournoi == "coupe") {
      html = generationPDFCoupe(affichageScore, affichageClassement, listeJoueurs, listeMatchs, nbMatchsParTour, toursParLigne, nbToursRestants, nbTables);
    }
    else {
      html = generationPDFTournoi(affichageScore, affichageClassement, listeJoueurs, listeMatchs, nbMatchsParTour, toursParLigne, nbToursRestants, nbTables);
    }
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
    let pressableDisabled = false;
    let opacityStyle = 1;
    if (this.state.btnIsLoading[buttonId]) {
      pressableDisabled = true;
      opacityStyle = 0.7;
    }
    return (
      <Pressable
        disabled={pressableDisabled}
        onPress={() => this._onPressExportBtn(buttonId, affichageScore, affichageClassement)}
      >
        <View style={{...styles.button, opacity: opacityStyle}}>
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