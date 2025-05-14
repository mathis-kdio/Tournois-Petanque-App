import { ScrollView } from '@/components/ui/scroll-view';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import { withTranslation } from 'react-i18next';
import { generationPDFTournoi } from '@utils/pdf/tournoi';
import { generationPDFCoupe } from '@utils/pdf/coupe';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { PropsFromRedux, connector } from '@/store/connector';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import { Box } from '@/components/ui/box';
import { dateFormatDateFileName } from '@/utils/date';
import { Tournoi } from '@/types/interfaces/tournoi';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {
  btnIsLoading: boolean;
  ajoutScore: boolean;
  ajoutClassement: boolean;
  affichageCompact: boolean;
}

class PDFExport extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      btnIsLoading: false,
      ajoutScore: true,
      ajoutClassement: true,
      affichageCompact: false,
    };
  }

  _generatePDF = async (
    affichageScore: boolean,
    affichageClassement: boolean,
    affichageCompact: boolean,
  ) => {
    let toursParLigne = affichageCompact ? 3 : 1;
    let optionsTournoi = this.props.listeMatchs.at(-1) as OptionsTournoi;
    let nbTours = optionsTournoi.nbTours;
    let nbMatchs = optionsTournoi.nbMatchs;
    let listeMatchs = this.props.listeMatchs;
    let listeJoueurs = optionsTournoi.listeJoueurs;
    let typeTournoi = optionsTournoi.typeTournoi;
    let tournoiID = optionsTournoi.tournoiID;
    let infosTournoi = this.props.listeTournois.find(
      (e) => e.tournoiId === tournoiID,
    ) as Tournoi;
    let nbMatchsParTour = 0;
    if (typeTournoi === TypeTournoi.COUPE) {
      nbMatchsParTour = (nbMatchs + 1) / 2;
    } else {
      nbMatchsParTour = nbMatchs / nbTours;
    }
    let nbTables = Math.ceil(nbTours / toursParLigne);
    let nbToursRestants = nbTours;
    let html = '';
    if (typeTournoi === TypeTournoi.COUPE) {
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
    if (Platform.OS === 'web') {
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
      this._toggleLoading();
    } else {
      const { uri } = await Print.printToFileAsync({ html });

      const date = dateFormatDateFileName(infosTournoi.creationDate);
      const newFileName = `tournoi-petanque-${infosTournoi.tournoiId}-${date}.pdf`;
      const newUri = FileSystem.cacheDirectory + newFileName;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      if (Platform.OS === 'android') {
        let contentUri = await FileSystem.getContentUriAsync(newUri);
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
          type: 'application/pdf',
        }).then(() => this._toggleLoading());
      } else if (Platform.OS === 'ios') {
        if (await Sharing.isAvailableAsync()) {
          Sharing.shareAsync(newUri).then(() => this._toggleLoading());
        } else {
          this._toggleLoading();
        }
      } else {
        this._toggleLoading();
      }
    }
  };

  _toggleLoading() {
    this.setState({
      btnIsLoading: !this.state.btnIsLoading,
    });
  }

  _onPressExportBtn() {
    this._toggleLoading();
    this._generatePDF(
      this.state.ajoutScore,
      this.state.ajoutClassement,
      this.state.affichageCompact,
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
          <VStack space="xl" className="flex-1 px-10 justify-center">
            <HStack>
              <Text className="text-white mr-3">
                {t('export_pdf_ajout_scores')}
              </Text>
              <Box className="justify-center">
                <Switch
                  value={this.state.ajoutScore}
                  onValueChange={() =>
                    this.setState({
                      ajoutScore: !this.state.ajoutScore,
                    })
                  }
                  trackColor={{ false: '#ffffff', true: '#1c3969' }}
                  thumbColor={'#ffffff'}
                  ios_backgroundColor={'#ffffff'}
                />
              </Box>
            </HStack>
            <HStack>
              <Text className="text-white mr-3">
                {t('export_pdf_ajout_classement')}
              </Text>
              <Box className="justify-center">
                <Switch
                  value={this.state.ajoutClassement}
                  onValueChange={() =>
                    this.setState({
                      ajoutClassement: !this.state.ajoutClassement,
                    })
                  }
                  trackColor={{ false: '#ffffff', true: '#1c3969' }}
                  thumbColor={'#ffffff'}
                  ios_backgroundColor={'#ffffff'}
                />
              </Box>
            </HStack>
            <HStack>
              <Text className="text-white mr-3">
                {t('export_pdf_affichage_compact')}
              </Text>
              <Box className="justify-center">
                <Switch
                  value={this.state.affichageCompact}
                  onValueChange={() =>
                    this.setState({
                      affichageCompact: !this.state.affichageCompact,
                    })
                  }
                  trackColor={{ false: '#ffffff', true: '#1c3969' }}
                  thumbColor={'#ffffff'}
                  ios_backgroundColor={'#ffffff'}
                />
              </Box>
            </HStack>
            <Button
              isDisabled={this.state.btnIsLoading}
              onPress={() => this._onPressExportBtn()}
            >
              {this.state.btnIsLoading && (
                <ButtonSpinner className="mr-1 color-white" />
              )}
              <ButtonText>{t('export_pdf')}</ButtonText>
            </Button>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(PDFExport));
