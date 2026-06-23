import TopBarBack from '@/components/topBar/TopBarBack';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
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
import { HStack } from '@/components/ui/hstack';
import {
  AlertCircleIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
} from '@/components/ui/icon';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { supabaseClient } from '@/utils/supabase';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useRouter } from 'expo-router';
import { useReducer, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

const validEmailTest = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validPasswordTest = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
  return passwordRegex.test(password);
};

type FormState = {
  loading: boolean;
  email: string;
  password: string;
  password2: string;
  conditionsCheckbox: boolean;
  showPassword1: boolean;
  showPassword2: boolean;
  emailIncorrect: boolean;
  passwordIncorrect: boolean;
  password2Incorrect: boolean;
};

const initialFormState: FormState = {
  loading: false,
  email: '',
  password: '',
  password2: '',
  conditionsCheckbox: false,
  showPassword1: false,
  showPassword2: false,
  emailIncorrect: false,
  passwordIncorrect: false,
  password2Incorrect: false,
};

const Inscription = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [formState, dispatch] = useReducer(
    (state: FormState, action: Partial<FormState>) => ({
      ...state,
      ...action,
    }),
    initialFormState,
  );

  const {
    loading,
    email,
    password,
    password2,
    conditionsCheckbox,
    showPassword1,
    showPassword2,
    emailIncorrect,
    passwordIncorrect,
    password2Incorrect,
  } = formState;

  const mdpInput1 = useRef<any>(null);
  const mdpInput2 = useRef<any>(null);

  const signUpWithEmail = async () => {
    const isValidEmail = validEmailTest(email);
    const isValidPassword = validPasswordTest(password);
    const isValidPassword2 = password2 === password;

    dispatch({
      emailIncorrect: !isValidEmail,
      passwordIncorrect: !isValidPassword,
      password2Incorrect: !isValidPassword2,
    });

    if (!isValidEmail || !isValidPassword || !isValidPassword2) {
      return;
    }

    dispatch({ loading: true });
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    dispatch({ loading: false });

    console.log(session);
    if (error) {
      console.log(error);
      Alert.alert(error.message);
    } else {
      if (!session) {
        router.navigate({
          pathname: '/connexion/confirmation-email',
          params: {
            email,
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
    <ScrollView className="h-1 bg-custom-background">
      <TopBarBack title={t('inscription')} />
      <VStack className="flex-1 px-10 justify-between">
        <VStack className="mb-5">
          <FormControl
            isInvalid={emailIncorrect}
            isRequired={true}
            className="mb-5"
          >
            <FormControlLabel className="mb-1 *:text-typography-white">
              <FormControlLabelText>{t('email')}</FormControlLabelText>
            </FormControlLabel>
            <Input className="border-custom-bg-inverse">
              <InputField
                className="text-typography-white placeholder:text-typography-white"
                placeholder={t('email_adresse')}
                keyboardType="email-address"
                returnKeyType="next"
                autoCapitalize="none"
                onChangeText={(text) => dispatch({ email: text })}
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
            <FormControlLabel className="mb-1 *:text-typography-white">
              <FormControlLabelText>{t('mot_de_passe')}</FormControlLabelText>
            </FormControlLabel>
            <Input className="border-custom-bg-inverse">
              <InputField
                className="text-typography-white placeholder:text-typography-white"
                placeholder={t('mot_de_passe')}
                secureTextEntry={!showPassword1}
                returnKeyType="next"
                autoCapitalize={'none'}
                onChangeText={(text) => dispatch({ password: text })}
                onSubmitEditing={() => mdpInput2.current.focus()}
                ref={mdpInput1}
              />
              <InputSlot className="pr-3">
                <Button
                  className="bg-transparent text-custom-bg-inverse"
                  onPress={() => dispatch({ showPassword1: !showPassword1 })}
                >
                  <ButtonIcon as={showPassword1 ? EyeOffIcon : EyeIcon} />
                </Button>
              </InputSlot>
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{t('mdp_non_valide')}</FormControlErrorText>
            </FormControlError>
            <FormControlHelper>
              <FormControlHelperText className="text-typography-white">
                {t('mdp_consignes')}
              </FormControlHelperText>
            </FormControlHelper>
          </FormControl>
          <FormControl
            isInvalid={password2Incorrect}
            isRequired={true}
            className="mb-5"
          >
            <FormControlLabel className="mb-1 *:text-typography-white">
              <FormControlLabelText>
                {t('mot_de_passe_confirmation')}
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="border-custom-bg-inverse">
              <InputField
                className="text-typography-white placeholder:text-typography-white"
                placeholder={t('mot_de_passe')}
                secureTextEntry={!showPassword2}
                autoCapitalize={'none'}
                onChangeText={(text) => dispatch({ password2: text })}
                ref={mdpInput2}
              />
              <InputSlot className="pr-3">
                <Button
                  className="bg-transparent text-custom-bg-inverse"
                  onPress={() => dispatch({ showPassword2: !showPassword2 })}
                >
                  <ButtonIcon as={showPassword2 ? EyeOffIcon : EyeIcon} />
                </Button>
              </InputSlot>
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{t('mdp_non_valide')}</FormControlErrorText>
            </FormControlError>
            <FormControlHelper>
              <FormControlHelperText className="text-typography-white">
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
              onChange={() =>
                dispatch({ conditionsCheckbox: !conditionsCheckbox })
              }
            >
              <CheckboxIndicator className="mr-2">
                <CheckboxIcon
                  as={CheckIcon}
                  className="text-typography-white bg-custom-background"
                />
              </CheckboxIndicator>
              <CheckboxLabel className="text-typography-white data-[hover=true]:text-typography-white data-[checked=true]:text-typography-white data-[hover=true]:data-[checked=true]:text-typography-white">
                {t('accepte_termes_conditions')}
              </CheckboxLabel>
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
          <Text className="text-typography-white self-center" size="lg">
            {t('ou_creer_compte_avec')}
          </Text>
          <HStack className="flex" space="lg">
            <Button
              className="grow"
              size="lg"
              variant="outline"
              isDisabled={true}
            >
              <FontAwesome
                name="apple"
                className="!text-custom-bg-inverse"
                size={18}
                style={{ marginRight: 5 }}
              />
              <ButtonText className="text-typography-white">Apple</ButtonText>
            </Button>
            <Button
              className="grow"
              size="lg"
              variant="outline"
              isDisabled={true}
            >
              <FontAwesome
                name="google"
                size={14}
                className="!text-custom-bg-inverse mr-2"
              />
              <ButtonText className="text-typography-white">Google</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default Inscription;
