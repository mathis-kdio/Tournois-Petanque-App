import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import React, { useState } from 'react';
import { Alert, AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabaseClient } from '@/utils/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { AlertCircleIcon, CheckIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { FontAwesome5 } from '@expo/vector-icons';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { useRouter } from 'expo-router';

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

const Inscription = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [conditionsCheckbox, setConditionsCheckbox] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [emailIncorrect, setEmailIncorrect] = useState(false);
  const [passwordIncorrect, setPasswordIncorrect] = useState(false);
  const [password2Incorrect, setPassword2Incorrect] = useState(false);

  const mdpInput1 = React.createRef<any>();
  const mdpInput2 = React.createRef<any>();

  const validEmailTest = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validPasswordTest = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    return passwordRegex.test(password);
  };

  const signUpWithEmail = async () => {
    let isValidEmail = validEmailTest(email);
    let isValidPassword = validPasswordTest(password);
    let isValidPassword2 = password2 === password;
    setEmailIncorrect(!isValidEmail);
    setPasswordIncorrect(!isValidPassword);
    setPassword2Incorrect(!isValidPassword2);
    if (!isValidEmail || !isValidPassword || !isValidPassword2) {
      return;
    }

    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
    });
    setLoading(false);

    console.log(session);
    if (error) {
      console.log(error);
      Alert.alert(error.message);
    } else {
      if (!session) {
        router.navigate({
          pathname: '/connexion/confirmation-email',
          params: {
            email: email,
          },
        });
      }
    }
  };

  const isButtonDisable = () => {
    return (
      loading ||
      email.length === 0 ||
      password.length === 0 ||
      password2.length === 0 ||
      !conditionsCheckbox
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-[#0594ae]">
        <TopBarBack title={t('inscription')} />
        <VStack className="flex-1 px-10 justify-between">
          <VStack className="mb-5">
            <FormControl
              isInvalid={emailIncorrect}
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
                  onSubmitEditing={() => mdpInput1.current.focus()}
                />
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {t('email_non_valide')}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl
              isInvalid={passwordIncorrect}
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
                  secureTextEntry={!showPassword1}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  onChangeText={(text) => setPassword(text)}
                  onSubmitEditing={() => mdpInput2.current.focus()}
                  ref={mdpInput1}
                />
                <InputSlot className="pr-3">
                  <FontAwesome5.Button
                    name={showPassword1 ? 'eye' : 'eye-slash'}
                    backgroundColor="#00000000"
                    iconStyle={{ marginRight: 0 }}
                    size={16}
                    onPress={() => setShowPassword1(!showPassword1)}
                  />
                </InputSlot>
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {t('mdp_non_valide')}
                </FormControlErrorText>
              </FormControlError>
              <FormControlHelper>
                <FormControlHelperText>
                  {t('mdp_consignes')}
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
            <FormControl
              isInvalid={password2Incorrect}
              isRequired={true}
              className="mb-5"
            >
              <FormControlLabel className="mb-1">
                <FormControlLabelText className="text-white">
                  {t('mot_de_passe_confirmation')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  className="text-white placeholder:text-white"
                  placeholder={t('mot_de_passe')}
                  secureTextEntry={!showPassword2}
                  autoCapitalize={'none'}
                  onChangeText={(text) => setPassword2(text)}
                  ref={mdpInput2}
                />
                <InputSlot className="pr-3">
                  <FontAwesome5.Button
                    name={showPassword2 ? 'eye' : 'eye-slash'}
                    backgroundColor="#00000000"
                    iconStyle={{ marginRight: 0 }}
                    size={16}
                    onPress={() => setShowPassword2(!showPassword2)}
                  />
                </InputSlot>
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {t('mdp_non_valide')}
                </FormControlErrorText>
              </FormControlError>
              <FormControlHelper>
                <FormControlHelperText>
                  {t('mdp_non_identique')}
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
            <FormControl
              isInvalid={!conditionsCheckbox}
              isRequired={true}
              className="mb-5"
            >
              <Checkbox
                value="conditionsCheckbox"
                onChange={() => setConditionsCheckbox(!conditionsCheckbox)}
              >
                <CheckboxIndicator className="mr-2">
                  <CheckboxIcon>
                    <CheckIcon />
                  </CheckboxIcon>
                </CheckboxIndicator>
                <CheckboxLabel>{t('accepte_termes_conditions')}</CheckboxLabel>
              </Checkbox>
            </FormControl>
            <FormControl>
              <Button
                size="lg"
                isDisabled={isButtonDisable()}
                onPress={() => signUpWithEmail()}
              >
                <ButtonText>{t('creer_le_compte')}</ButtonText>
              </Button>
            </FormControl>
          </VStack>
          <VStack space="md">
            <Text className="text-white self-center" size="lg">
              {t('ou_creer_compte_avec')}
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
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Inscription;
