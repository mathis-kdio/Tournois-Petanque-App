import { ScrollView } from '@/components/ui/scroll-view';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { useState } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { File, Paths } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
import { useTranslation } from 'react-i18next';
import { generationPDFTournoi } from '@utils/pdf/tournoi';
import { generationPDFCoupe } from '@utils/pdf/coupe';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Platform } from 'react-native';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { dateFormatDateFileName } from '@/utils/date';
import { Tournoi } from '@/types/interfaces/tournoi';
import { useSelector } from 'react-redux';
import { StyledSwitch } from '@/components/ui/switch/styled-switch';
import { genererPdf } from '@/utils/pdf/generate/genererPdf';

const PDFExport = () => {
  const { t } = useTranslation();

  const tournoi = useSelector((state: any) => state.gestionMatchs.listematchs);
  const listeTournois = useSelector(
    (state: any) => state.listeTournois.listeTournois,
  );

  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const [ajoutScore, setAjoutScore] = useState(true);
  const [ajoutClassement, setAjoutClassement] = useState(true);
  const [affichageCompact, setAffichageCompact] = useState(false);

  const _generatePDF = async (
    affichageScore: boolean,
    affichageClassement: boolean,
    affichageCompact: boolean,
  ) => {
    let toursParLigne = affichageCompact ? 3 : 1;
    let optionsTournoi = tournoi.at(-1) as OptionsTournoi;
    let nbTours = optionsTournoi.nbTours;
    let nbMatchs = optionsTournoi.nbMatchs;
    let listeMatchs = tournoi;
    let listeJoueurs = optionsTournoi.listeJoueurs;
    let typeTournoi = optionsTournoi.typeTournoi;
    let tournoiID = optionsTournoi.tournoiID;
    let infosTournoi = listeTournois.find(
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
        t,
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
        t,
      );
    }

    const date = dateFormatDateFileName(infosTournoi.creationDate);
    const newFileName = `tournoi-petanque-${infosTournoi.tournoiId}-${date}.pdf`;

    if (Platform.OS === 'web') {
      await genererPdf(newFileName, html);

      _toggleLoading();
    } else {
      const { uri } = await Print.printToFileAsync({ html });

      const oldfile = new File(Paths.cache, newFileName);
      if (oldfile.exists) {
        oldfile.delete();
      }

      const file = new File(uri);
      file.move(Paths.cache);
      file.rename(newFileName);

      if (Platform.OS === 'android') {
        // TODO : à remplacer par nouvelle API quand équivalent disponible : https://github.com/expo/expo/issues/39056
        let contentUri = await FileSystem.getContentUriAsync(file.uri);
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
          type: 'application/pdf',
        }).then(() => _toggleLoading());
      } else if (Platform.OS === 'ios') {
        if (await Sharing.isAvailableAsync()) {
          Sharing.shareAsync(file.uri).then(() => _toggleLoading());
        } else {
          _toggleLoading();
        }
      } else {
        _toggleLoading();
      }
    }
  };

  const _toggleLoading = () => {
    setBtnIsLoading((prevState) => !prevState);
  };

  const _onPressExportBtn = () => {
    _toggleLoading();
    _generatePDF(ajoutScore, ajoutClassement, affichageCompact);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-custom-background">
        <TopBarBack title={t('exporter_pdf_navigation_title')} />
        <VStack space="xl" className="flex-1 px-10 justify-center">
          <HStack>
            <Text className="text-typography-white mr-3">
              {t('export_pdf_ajout_scores')}
            </Text>
            <Box className="justify-center">
              <StyledSwitch
                value={ajoutScore}
                onValueChange={() => setAjoutScore(!ajoutScore)}
                thumbColor={'#ffffff'}
                activeThumbColor={'#ffffff'}
                ios_backgroundColor={'#ffffff'}
                trackColorclassName="bg-custom-dark-blue"
              />
            </Box>
          </HStack>
          <HStack>
            <Text className="text-typography-white mr-3">
              {t('export_pdf_ajout_classement')}
            </Text>
            <Box className="justify-center">
              <StyledSwitch
                value={ajoutClassement}
                onValueChange={() => setAjoutClassement(!ajoutClassement)}
                thumbColor={'#ffffff'}
                activeThumbColor={'#ffffff'}
                ios_backgroundColor={'#ffffff'}
                trackColorclassName="bg-custom-dark-blue"
              />
            </Box>
          </HStack>
          <HStack>
            <Text className="text-typography-white mr-3">
              {t('export_pdf_affichage_compact')}
            </Text>
            <Box className="justify-center">
              <StyledSwitch
                value={affichageCompact}
                onValueChange={() => setAffichageCompact(!affichageCompact)}
                thumbColor={'#ffffff'}
                activeThumbColor={'#ffffff'}
                ios_backgroundColor={'#ffffff'}
                trackColorclassName="bg-custom-dark-blue"
              />
            </Box>
          </HStack>
          <Button isDisabled={btnIsLoading} onPress={() => _onPressExportBtn()}>
            {btnIsLoading && <ButtonSpinner className="mr-1 color-white" />}
            <ButtonText>{t('export_pdf')}</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PDFExport;
