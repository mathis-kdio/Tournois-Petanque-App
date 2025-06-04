import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import React, { useState } from 'react';
import { AppState } from 'react-native';
import { supabaseClient } from '@/utils/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StackNavigationProp } from '@react-navigation/stack';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { FontAwesome5 } from '@expo/vector-icons';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabaseClient.auth.startAutoRefresh();
  } else {
    supabaseClient.auth.stopAutoRefresh();
  }
});

const Authentification = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginIncorrect, setLoginIncorrect] = useState(false);

  const mdpInput = React.createRef<any>();

  const signInWithEmail = async () => {
    setLoading(true);
    const { error, data } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false);

    console.log(data);
    console.log(error);
    if (error) {
      setLoginIncorrect(true);
    } else {
      navigation.navigate('AccueilGeneral');
    }
  };

  const inscription = () => {
    navigation.navigate('Inscription');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-[#0594ae]">
        <TopBarBack title={t('authentification')} />
        <VStack className="flex-1 px-10 justify-between">
          <VStack className="mb-5">
            <FormControl
              isInvalid={loginIncorrect}
              isRequired={true}
              className="mb-5"
            >
              <FormControlLabel className="mb-1">
                <FormControlLabelText className="text-white">
                  {t('email')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  className="text-white placeholder:text-white"
                  placeholder={t('email_adresse')}
                  keyboardType="email-address"
                  returnKeyType="next"
                  autoCapitalize="none"
                  onChangeText={(text) => setEmail(text)}
                  onSubmitEditing={() => mdpInput.current.focus()}
                />
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {t('identifiants_invalides')}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl
              isInvalid={loginIncorrect}
              isRequired={true}
              className="mb-5"
            >
              <FormControlLabel className="mb-1">
                <FormControlLabelText className="text-white">
                  {t('mot_de_passe')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  className="text-white placeholder:text-white"
                  placeholder={t('mot_de_passe')}
                  secureTextEntry={!showPassword}
                  autoCapitalize={'none'}
                  onChangeText={(text) => setPassword(text)}
                  ref={mdpInput}
                />
                <InputSlot className="pr-3">
                  <FontAwesome5.Button
                    name={showPassword ? 'eye' : 'eye-slash'}
                    backgroundColor="#00000000"
                    iconStyle={{ marginRight: 0 }}
                    size={16}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                </InputSlot>
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {t('identifiants_invalides')}
                </FormControlErrorText>
              </FormControlError>
              <Button
                className="text-white self-end"
                size="sm"
                variant="link"
                isDisabled={true}
              >
                <ButtonText className="text-white">
                  {t('mot_de_passe_oublie')}
                </ButtonText>
              </Button>
            </FormControl>
            <FormControl>
              <Button
                size="lg"
                isDisabled={loading}
                onPress={() => signInWithEmail()}
              >
                <ButtonText>{t('se_connecter')}</ButtonText>
              </Button>
            </FormControl>
          </VStack>
          <VStack space="md">
            <Text className="text-white self-center" size="lg">
              {t('ou_connecter_avec')}
            </Text>
            <HStack className="flex" space="lg">
              <Button
                className="grow"
                size="lg"
                variant="outline"
                isDisabled={true}
              >
                <FontAwesome5
                  name="apple"
                  color="white"
                  size={18}
                  style={{ marginRight: 5 }}
                />
                <ButtonText className="text-white">Apple</ButtonText>
              </Button>
              <Button
                className="grow"
                size="lg"
                variant="outline"
                isDisabled={true}
              >
                <FontAwesome5
                  name="google"
                  color="white"
                  size={14}
                  className="mr-2"
                />
                <ButtonText className="text-white">Google</ButtonText>
              </Button>
            </HStack>
          </VStack>
          <Divider className="my-5" />
          <VStack space="md">
            <Text className="text-white self-center" size="lg">
              {t('pas_encore_compte')}
            </Text>
            <Button
              size="lg"
              isDisabled={loading}
              onPress={() => inscription()}
            >
              <ButtonText>{t('creer_un_compte')}</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Authentification;
