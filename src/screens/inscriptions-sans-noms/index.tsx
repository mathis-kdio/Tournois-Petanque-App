import { ScrollView } from '@/components/ui/scroll-view';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import Loading from '@/components/Loading';
import StartButton from './components/StartButton';

const InscriptionsSansNoms = () => {
  const { t } = useTranslation();

  const { preparationTournoiVM } = usePreparationTournoi();

  const [nbJoueurNormaux, setNbJoueurNormaux] = useState(0);
  const [nbJoueurEnfants, setNbJoueurEnfants] = useState(0);

  const secondInput = React.createRef<any>();

  if (!preparationTournoiVM) {
    return <Loading />;
  }

  const textInputJoueursNormaux = (text: string) =>
    setNbJoueurNormaux(parseInt(text));

  const textInputJoueursEnfants = (text: string) =>
    setNbJoueurEnfants(parseInt(text));

  return (
    <ScrollView className="h-1 bg-custom-background">
      <TopBarBack title={t('inscription_sans_noms_navigation_title')} />
      <VStack space="2xl" className="flex-1 px-10">
        <Text className="text-typography-white text-center text-xl">
          {t('nombre_joueurs', { nb: nbJoueurNormaux + nbJoueurEnfants })}
        </Text>
        <VStack>
          <Text className="text-typography-white text-md">
            {t('nombre_joueurs_adultes')}{' '}
          </Text>
          <Input className="border-custom-bg-inverse">
            <InputField
              className="text-typography-white placeholder:text-typography-white"
              placeholder={t('nombre_placeholder')}
              keyboardType="number-pad"
              returnKeyType="next"
              autoFocus={true}
              blurOnSubmit={false}
              onChangeText={(text) => textInputJoueursNormaux(text)}
              onSubmitEditing={() => secondInput.current.focus()}
            />
          </Input>
        </VStack>
        <VStack>
          <Text className="text-typography-white text-md">
            {t('nombre_joueurs_enfants')}{' '}
          </Text>
          <Input className="border-custom-bg-inverse">
            <InputField
              className="text-typography-white placeholder:text-typography-white"
              placeholder={t('nombre_placeholder')}
              keyboardType="number-pad"
              onChangeText={(text) => textInputJoueursEnfants(text)}
              ref={secondInput}
            />
          </Input>
        </VStack>
        <Text className="text-typography-white">
          {t('joueurs_enfants_explication')}
        </Text>
        <StartButton
          preparationTournoiModel={preparationTournoiVM}
          nbJoueurNormaux={nbJoueurNormaux}
          nbJoueurEnfants={nbJoueurEnfants}
        />
      </VStack>
    </ScrollView>
  );
};

export default InscriptionsSansNoms;
