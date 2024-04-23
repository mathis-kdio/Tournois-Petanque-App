import React from 'react';
import { connect } from 'react-redux'
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { withTranslation } from 'react-i18next';
import { generationPDFTournoi } from 'utils/pdf/tournoi';
import { generationPDFCoupe } from 'utils/pdf/coupe';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, Button, ButtonSpinner, ButtonText, ScrollView } from '@gluestack-ui/themed';
import TopBarBack from '../../components/TopBarBack';
import { Platform } from 'react-native';

class PDFExport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      btnIsLoading: [false, false, false],
    }
  }

  _generatePDF = async (affichageScore, affichageClassement, buttonId) => {
    let toursParLigne = 3;
    let listeMatchs = this.props.listeMatchs;
    let listeMatchsParams = listeMatchs[listeMatchs.length - 1];
    let nbTours = listeMatchsParams.nbTours;
    let nbMatchs = listeMatchsParams.nbMatchs;
    let listeJoueurs = listeMatchsParams.listeJoueurs;
    let typeTournoi = listeMatchsParams.typeTournoi;
    let tournoiID = listeMatchsParams.tournoiID;
    let infosTournoi = this.props.listeTournois.find((e) => e.tournoiId == tournoiID);
    let nbMatchsParTour = 0;
    if (typeTournoi == "coupe") {
      nbMatchsParTour = (nbMatchs + 1) / 2;
    } else {
      nbMatchsParTour = nbMatchs / nbTours;
    }
    let nbTables = Math.ceil(nbTours / toursParLigne);
    let nbToursRestants = nbTours;
    let html = "";
    if (typeTournoi == "coupe") {
      html = generationPDFCoupe(affichageScore, affichageClassement, listeJoueurs, listeMatchs, infosTournoi, nbMatchsParTour, toursParLigne, nbToursRestants, nbTables);
    } else {
      html = generationPDFTournoi(affichageScore, affichageClassement, listeJoueurs, listeMatchs, infosTournoi, nbMatchsParTour, toursParLigne, nbToursRestants, nbTables);
    }
    if (Platform.OS == 'web') {
      const pW = window.open('', '', `width=${screen.availWidth},height=${screen.availHeight}`)
      pW.document.write(html);
      pW.onafterprint = () => {
        pW.close();
      };
      pW.print();
      this._toggleLoading(buttonId)
    } else {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync() && uri != undefined) {
        Sharing.shareAsync(uri).then(this._toggleLoading(buttonId));
      } else {
        this._toggleLoading(buttonId)
      }
    }
  }

  _toggleLoading(buttonId) {
    let newBtnIsLoading = this.state.btnIsLoading;
    newBtnIsLoading[buttonId] = !this.state.btnIsLoading[buttonId];
    this.setState({
      btnIsLoading: newBtnIsLoading
    });
  };

  _onPressExportBtn(buttonId, affichageScore, affichageClassement) {
    this._toggleLoading(buttonId);
    this._generatePDF(affichageScore, affichageClassement, buttonId);
  };

  _exportButton(buttonId, buttonText, affichageScore, affichageClassement) {
    let pressableDisabled = false;
    let opacityStyle = 1;
    if (this.state.btnIsLoading[buttonId]) {
      pressableDisabled = true;
      opacityStyle = 0.7;
    }
    return (
      <Button isDisabled={pressableDisabled} onPress={() => this._onPressExportBtn(buttonId, affichageScore, affichageClassement)}>
        {this.state.btnIsLoading[buttonId] && <ButtonSpinner mr={'$1'} />}
        <ButtonText>{buttonText}</ButtonText>
      </Button>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView height={'$1'} bgColor='#0594ae'>
          <TopBarBack title={t("exporter_pdf_navigation_title")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} justifyContent='center' space='3xl'>
            {this._exportButton(0, t("export_pdf_sans_scores"), false, false)}
            {this._exportButton(1, t("export_pdf_avec_scores"), true, false)}
            {this._exportButton(2, t("export_pdf_avec_scores_classement"), true, true)}
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(withTranslation()(PDFExport))