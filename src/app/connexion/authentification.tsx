import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import React from 'react';
import { AppState } from 'react-native';
import { withTranslation } from 'react-i18next';
import { supabaseClient } from '@/utils/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
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

export interface Props {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {
  loading: boolean;
  email: string;
  password: string;
  showPassword: boolean;
  loginIncorrect: boolean;
}

class Authentification extends React.Component<Props, State> {
  mdpInput = React.createRef<any>();

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
      showPassword: false,
      loginIncorrect: false,
    };
  }

  async signInWithEmail() {
    this.setState({ loading: true });
    const { error, data } = await supabaseClient.auth.signInWithPassword({
      email: this.state.email,
      password: this.state.password,
    });
    this.setState({ loading: false });

    console.log(data);
    console.log(error);
    if (error) {
      this.setState({
        loginIncorrect: true,
      });
    } else {
      this.props.navigation.navigate('AccueilGeneral');
    }
  }

  inscription() {
    this.props.navigation.navigate('Inscription');
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack
            title={t('authentification')}
            navigation={this.props.navigation}
          />
          <VStack className="flex-1 px-10 justify-between">
            <VStack className="mb-5">
              <FormControl
                isInvalid={this.state.loginIncorrect}
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
                    onChangeText={(text) => this.setState({ email: text })}
                    onSubmitEditing={() => this.mdpInput.current.focus()}
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
                isInvalid={this.state.loginIncorrect}
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
                    secureTextEntry={!this.state.showPassword}
                    autoCapitalize={'none'}
                    onChangeText={(text) => this.setState({ password: text })}
                    ref={this.mdpInput}
                  />
                  <InputSlot className="pr-3">
                    <FontAwesome5.Button
                      name={this.state.showPassword ? 'eye' : 'eye-slash'}
                      backgroundColor="#00000000"
                      iconStyle={{ marginRight: 0 }}
                      size={16}
                      onPress={() =>
                        this.setState({
                          showPassword: !this.state.showPassword,
                        })
                      }
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
                  isDisabled={this.state.loading}
                  onPress={() => this.signInWithEmail()}
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
                isDisabled={this.state.loading}
                onPress={() => this.inscription()}
              >
                <ButtonText>{t('creer_un_compte')}</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Authentification);
