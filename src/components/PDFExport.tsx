import React from 'react';
import { connect } from 'react-redux'
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { withTranslation } from 'react-i18next';
import { generationPDFTournoi } from '@utils/pdf/tournoi';
import { generationPDFCoupe } from '@utils/pdf/coupe';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, Button, ButtonSpinner, ButtonText } from '@gluestack-ui/themed';
import TopBarBack from './TopBarBack';
import { Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { TypeTournoi } from '@/types/enums/typeTournoi';

export interface Props {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
  btnIsLoading: boolean[];
}

class PDFExport extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      btnIsLoading: [false, false, false],
    }
  }

  _generatePDF = async (affichageScore: boolean, affichageClassement: boolean, buttonId: number) => {
    let toursParLigne = 3;
    let nbTours = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbTours;
    let nbMatchs = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbMatchs;
    let listeMatchs = this.props.listeMatchs;
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs;
    let nbMatchsParTour = 0;
    let typeTournoi = this.props.listeMatchs[this.props.listeMatchs.length - 1].typeTournoi;
    if (typeTournoi == TypeTournoi.COUPE) {
      nbMatchsParTour = (nbMatchs + 1) / 2;
    } else {
      nbMatchsParTour = nbMatchs / nbTours;
    }
    let nbTables = Math.ceil(nbTours / toursParLigne);
    let nbToursRestants = nbTours;
    let html = "";
    if (typeTournoi == TypeTournoi.COUPE) {
      html = generationPDFCoupe(affichageScore, affichageClassement, listeJoueurs, listeMatchs, nbMatchsParTour, toursParLigne, nbToursRestants, nbTables);
    } else {
      html = generationPDFTournoi(affichageScore, affichageClassement, listeJoueurs, listeMatchs, nbMatchsParTour, toursParLigne, nbToursRestants, nbTables);
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
        Sharing.shareAsync(uri).then(() => this._toggleLoading(buttonId));
      } else {
        this._toggleLoading(buttonId)
      }
    }
  }

  _toggleLoading(buttonId: number) {
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
        <VStack flex={1} bgColor={"#0594ae"}>
          <TopBarBack title={t("exporter_pdf_navigation_title")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} justifyContent='center' space='3xl'>
            {this._exportButton(0, t("export_pdf_sans_scores"), false, false)}
            {this._exportButton(1, t("export_pdf_avec_scores"), true, false)}
            {this._exportButton(2, t("export_pdf_avec_scores_classement"), true, true)}
          </VStack>
        </VStack>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(withTranslation()(PDFExport))