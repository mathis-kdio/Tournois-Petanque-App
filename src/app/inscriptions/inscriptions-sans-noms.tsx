import { ScrollView } from '@/components/ui/scroll-view';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { JoueurType } from '@/types/enums/joueurType';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

const InscriptionsSansNoms = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );

  const [nbJoueurNormaux, setNbJoueurNormaux] = useState(0);
  const [nbJoueurEnfants, setNbJoueurEnfants] = useState(0);

  const secondInput = React.createRef<any>();

  const _textInputJoueursNormaux = (text: string) => {
    setNbJoueurNormaux(parseInt(text));
  };

  const _textInputJoueursEnfants = (text: string) => {
    setNbJoueurEnfants(parseInt(text));
  };

  const _ajoutJoueur = (type?: JoueurType) => {
    const action = {
      type: 'AJOUT_JOUEUR',
      value: [ModeTournoi.SANSNOMS, '', type, undefined],
    };
    dispatch(action);
  };

  const _supprimerJoueurs = () => {
    const suppressionAllJoueurs = {
      type: 'SUPPR_ALL_JOUEURS',
      value: [ModeTournoi.SANSNOMS],
    };
    dispatch(suppressionAllJoueurs);
  };

  const _commencer = (choixComplement: boolean) => {
    _supprimerJoueurs();

    for (let i = 0; i < nbJoueurNormaux; i++) {
      _ajoutJoueur();
    }

    for (let i = 0; i < nbJoueurEnfants; i++) {
      _ajoutJoueur(JoueurType.ENFANT);
    }

    let screenName = 'generation-matchs';
    if (choixComplement) {
      screenName = 'choix-complement';
    } else if (optionsTournoi.avecTerrains) {
      screenName = 'liste-terrains';
    }
    router.navigate({
      pathname: `/inscriptions/${screenName}`,
      params: {
        screenStackName: 'inscriptions-sans-noms',
      },
    });
  };

  const _nbJoueurs = () => {
    let nbJoueur = 0;
    if (!isNaN(nbJoueurNormaux)) {
      nbJoueur = nbJoueurNormaux;
    }
    if (!isNaN(nbJoueurEnfants)) {
      nbJoueur += nbJoueurEnfants;
    }
    return nbJoueur;
  };

  const _boutonCommencer = () => {
    let btnDisabled: boolean = false;
    let title = t('commencer_tournoi');
    let nbJoueurs = _nbJoueurs();
    let choixComplement = false;

    if (
      optionsTournoi.typeEquipes === TypeEquipes.TETEATETE &&
      (nbJoueurs % 2 !== 0 || nbJoueurs < 2)
    ) {
      title = t('tete_a_tete_multiple_2');
      btnDisabled = true;
    } else if (optionsTournoi.typeEquipes === TypeEquipes.DOUBLETTE) {
      if (nbJoueurs < 4) {
        title = t('joueurs_insuffisants');
        btnDisabled = true;
      } else if (nbJoueurs % 4 !== 0) {
        choixComplement = true;
      }
    } else if (optionsTournoi.typeEquipes === TypeEquipes.TRIPLETTE) {
      if (nbJoueurs < 6) {
        title = t('joueurs_insuffisants');
        btnDisabled = true;
      } else if (nbJoueurs % 6 !== 0) {
        choixComplement = true;
      }
    }

    return (
      <Button
        isDisabled={btnDisabled}
        action="positive"
        onPress={() => _commencer(choixComplement)}
        className="h-min min-h-10"
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-custom-background">
        <TopBarBack title={t('inscription_sans_noms_navigation_title')} />
        <VStack space="2xl" className="flex-1 px-10">
          <Text className="text-typography-white text-center text-xl">
            {t('nombre_joueurs', { nb: _nbJoueurs() })}
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
                onChangeText={(text) => _textInputJoueursNormaux(text)}
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
                onChangeText={(text) => _textInputJoueursEnfants(text)}
                ref={secondInput}
              />
            </Input>
          </VStack>
          <Text className="text-typography-white">
            {t('joueurs_enfants_explication')}
          </Text>
          {_boutonCommencer()}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InscriptionsSansNoms;
