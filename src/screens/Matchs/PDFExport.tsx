import { ScrollView } from '@/components/ui/scroll-view';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { withTranslation } from 'react-i18next';
import { generationPDFTournoi } from '@utils/pdf/tournoi';
import { generationPDFCoupe } from '@utils/pdf/coupe';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '../../components/TopBarBack';
import { Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { PropsFromRedux, connector } from '@/store/connector';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {
  btnIsLoading: boolean[];
}

class PDFExport extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      btnIsLoading: [false, false, false],
    };
  }

  _generatePDF = async (
    affichageScore: boolean,
    affichageClassement: boolean,
    buttonId: number,
  ) => {
    let toursParLigne = 3;
    let optionsTournoi = this.props.listeMatchs.at(-1) as OptionsTournoi;
    let nbTours = optionsTournoi.nbTours;
    let nbMatchs = optionsTournoi.nbMatchs;
    let listeMatchs = this.props.listeMatchs;
    let listeJoueurs = optionsTournoi.listeJoueurs;
    let typeTournoi = optionsTournoi.typeTournoi;
    let tournoiID = optionsTournoi.tournoiID;
    let infosTournoi = this.props.listeTournois.find(
      (e) => e.tournoiId == tournoiID,
    );
    let nbMatchsParTour = 0;
    if (typeTournoi == TypeTournoi.COUPE) {
      nbMatchsParTour = (nbMatchs + 1) / 2;
    } else {
      nbMatchsParTour = nbMatchs / nbTours;
    }
    let nbTables = Math.ceil(nbTours / toursParLigne);
    let nbToursRestants = nbTours;
    let html = '';
    if (typeTournoi == TypeTournoi.COUPE) {
      html = generationPDFCoupe(
        affichageScore,
        affichageClassement,
        listeJoueurs,
        optionsTournoi,
        listeMatchs,
        infosTournoi,
        nbMatchsParTour,
        toursParLigne,
        nbToursRestants,
        nbTables,
      );
    } else {
      html = generationPDFTournoi(
        affichageScore,
        affichageClassement,
        listeJoueurs,
        optionsTournoi,
        listeMatchs,
        infosTournoi,
        nbMatchsParTour,
        toursParLigne,
        nbToursRestants,
        nbTables,
      );
    }
    if (Platform.OS == 'web') {
      const pW = window.open(
        '',
        '',
        `width=${screen.availWidth},height=${screen.availHeight}`,
      );
      pW.document.write(html);
      pW.onafterprint = () => {
        pW.close();
      };
      pW.print();
      this._toggleLoading(buttonId);
    } else {
      const { uri } = await Print.printToFileAsync({ html });
      if ((await Sharing.isAvailableAsync()) && uri != undefined) {
        Sharing.shareAsync(uri).then(() => this._toggleLoading(buttonId));
      } else {
        this._toggleLoading(buttonId);
      }
    }
  };

  _toggleLoading(buttonId: number) {
    let newBtnIsLoading = this.state.btnIsLoading;
    newBtnIsLoading[buttonId] = !this.state.btnIsLoading[buttonId];
    this.setState({
      btnIsLoading: newBtnIsLoading,
    });
  }

  _onPressExportBtn(
    buttonId: number,
    affichageScore: boolean,
    affichageClassement: boolean,
  ) {
    this._toggleLoading(buttonId);
    this._generatePDF(affichageScore, affichageClassement, buttonId);
  }

  _exportButton(
    buttonId: number,
    buttonText: string,
    affichageScore: boolean,
    affichageClassement: boolean,
  ) {
    let pressableDisabled = false;
    let opacityStyle = 1;
    if (this.state.btnIsLoading[buttonId]) {
      pressableDisabled = true;
      opacityStyle = 0.7;
    }
    return (
      <Button
        isDisabled={pressableDisabled}
        onPress={() =>
          this._onPressExportBtn(buttonId, affichageScore, affichageClassement)
        }
      >
        {this.state.btnIsLoading[buttonId] && (
          <ButtonSpinner className="mr-1" />
        )}
        <ButtonText>{buttonText}</ButtonText>
      </Button>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack
            title={t('exporter_pdf_navigation_title')}
            navigation={this.props.navigation}
          />
          <VStack space="3xl" className="flex-1 px-10 justify-center">
            {this._exportButton(0, t('export_pdf_sans_scores'), false, false)}
            {this._exportButton(1, t('export_pdf_avec_scores'), true, false)}
            {this._exportButton(
              2,
              t('export_pdf_avec_scores_classement'),
              true,
              true,
            )}
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(PDFExport));
