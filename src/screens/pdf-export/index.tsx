import Loading from '@/components/Loading';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { StyledSwitch } from '@/components/ui/switch/styled-switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTournois } from '@/repositories/tournois/useTournois';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExportButton from './components/ExportButton';

const PDFExport = () => {
  const { t } = useTranslation();

  const [ajoutScore, setAjoutScore] = useState(true);
  const [ajoutClassement, setAjoutClassement] = useState(true);
  const [affichageCompact, setAffichageCompact] = useState(false);

  const { actualTournoi, joueursTournoi } = useTournois();

  if (!actualTournoi || !joueursTournoi) {
    return <Loading />;
  }

  return (
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
        <ExportButton
          tournoi={actualTournoi}
          listeJoueurs={joueursTournoi}
          affichageScore={ajoutScore}
          affichageClassement={ajoutClassement}
          affichageCompact={affichageCompact}
        />
      </VStack>
    </ScrollView>
  );
};

export default PDFExport;
