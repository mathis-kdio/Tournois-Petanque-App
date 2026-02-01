import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { useState } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { File, Paths } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
import { useTranslation } from 'react-i18next';
import { generationPDFTournoi } from '@utils/pdf/tournoi';
import { generationPDFCoupe } from '@utils/pdf/coupe';
import { Platform } from 'react-native';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { dateFormatDateFileName } from '@/utils/date';
import { TournoiModel } from '@/types/interfaces/tournoi';

export interface Props {
  tournoi: TournoiModel;
  affichageScore: boolean;
  affichageClassement: boolean;
  affichageCompact: boolean;
}

const ExportButton: React.FC<Props> = ({
  tournoi,
  affichageScore,
  affichageClassement,
  affichageCompact,
}) => {
  const { t } = useTranslation();

  const [btnIsLoading, setBtnIsLoading] = useState(false);

  const getHtml = () => {
    const { options } = tournoi;
    const { nbTours, nbMatchs, listeJoueurs, typeTournoi } = options;

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

  const generatePDFWeb = (html: string) => {
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
  };

  const generatePDF = async () => {
    const html = getHtml();
    if (Platform.OS === 'web') {
      generatePDFWeb(html);
      toggleLoading();
    } else {
      const { uri } = await Print.printToFileAsync({ html });

      const date = dateFormatDateFileName(tournoi.creationDate);
      const newFileName = `tournoi-petanque-${tournoi.tournoiId}-${date}.pdf`;

      const oldfile = new File(Paths.cache, newFileName);
      if (oldfile.exists) {
        oldfile.delete();
      }

      const file = new File(uri);
      file.move(Paths.cache);
      file.rename(newFileName);

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
