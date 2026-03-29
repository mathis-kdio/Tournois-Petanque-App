import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { dateFormatDateFileName } from '@/utils/date';
import { genererPdf } from '@/utils/pdf/generate/genererPdf';
import { generationPDFCoupe } from '@utils/pdf/coupe';
import { generationPDFTournoi } from '@utils/pdf/tournoi';
import { File, Paths } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export interface Props {
  tournoi: TournoiModel;
  listeJoueurs: JoueurModel[];
  affichageScore: boolean;
  affichageClassement: boolean;
  affichageCompact: boolean;
}

const ExportButton: React.FC<Props> = ({
  tournoi,
  listeJoueurs,
  affichageScore,
  affichageClassement,
  affichageCompact,
}) => {
  const { t } = useTranslation();

  const [btnIsLoading, setBtnIsLoading] = useState(false);

  const getHtml = () => {
    const { options } = tournoi;
    const { nbTours, nbMatchs, typeTournoi } = options;

    const toursParLigne = affichageCompact ? 3 : 1;
    const nbMatchsParTour =
      typeTournoi === TypeTournoi.COUPE
        ? (nbMatchs + 1) / 2
        : nbMatchs / nbTours;
    const nbTables = Math.ceil(nbTours / toursParLigne);
    const nbToursRestants = nbTours;
    if (typeTournoi === TypeTournoi.COUPE) {
      return generationPDFCoupe(
        affichageScore,
        affichageClassement,
        listeJoueurs,
        tournoi,
        nbMatchsParTour,
        toursParLigne,
        nbToursRestants,
        nbTables,
        t,
      );
    } else {
      return generationPDFTournoi(
        affichageScore,
        affichageClassement,
        listeJoueurs,
        tournoi,
        nbMatchsParTour,
        toursParLigne,
        nbToursRestants,
        nbTables,
        t,
      );
    }
  };

  const generatePDF = async () => {
    const html = getHtml();

    const date = dateFormatDateFileName(tournoi.creationDate);
    const fileName = `tournoi-petanque-${tournoi.tournoiId}-${date}`;

    if (Platform.OS === 'web') {
      await genererPdf(fileName, html);

      toggleLoading();
    } else {
      const { uri } = await Print.printToFileAsync({ html });

      const fileNameExt = `${fileName}.pdf`;

      const oldfile = new File(Paths.cache, fileNameExt);
      if (oldfile.exists) {
        oldfile.delete();
      }

      const file = new File(uri);
      file.move(Paths.cache);
      file.rename(fileNameExt);

      if (Platform.OS === 'android') {
        // TODO : à remplacer par nouvelle API quand équivalent disponible : https://github.com/expo/expo/issues/39056
        const contentUri = await FileSystem.getContentUriAsync(file.uri);
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
          type: 'application/pdf',
        }).then(() => toggleLoading());
      } else if (Platform.OS === 'ios') {
        if (await Sharing.isAvailableAsync()) {
          Sharing.shareAsync(file.uri).then(() => toggleLoading());
        } else {
          toggleLoading();
        }
      } else {
        toggleLoading();
      }
    }
  };

  const toggleLoading = () => {
    setBtnIsLoading((prevState) => !prevState);
  };

  const onPressExportBtn = () => {
    toggleLoading();
    generatePDF();
  };

  return (
    <Button isDisabled={btnIsLoading} onPress={() => onPressExportBtn()}>
      {btnIsLoading && <ButtonSpinner className="mr-1 color-white" />}
      <ButtonText>{t('export_pdf')}</ButtonText>
    </Button>
  );
};

export default ExportButton;
