import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { ScrollView } from "@/components/ui/scroll-view";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import React from 'react'
import { Alert, AppState } from 'react-native'
import { withTranslation } from 'react-i18next';
import { supabase } from '@/utils/supabase';
import { SafeAreaView } from 'react-native-safe-area-context'

import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import TopBarBack from '@/components/TopBarBack';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { AlertCircleIcon, CheckIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { FontAwesome5 } from '@expo/vector-icons';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export interface Props {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
  loading: boolean;
  email: string;
  password: string;
  showPassword1: boolean;
  showPassword2: boolean;
  emailIncorrect: boolean;
  passwordIncorrect: boolean;
}

class Inscription extends React.Component<Props, State> {
  mdpInput1 = React.createRef<any>();
  mdpInput2 = React.createRef<any>();

  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
      email: "",
      password: "",
      showPassword1: false,
      showPassword2: false,
      emailIncorrect: false,
      passwordIncorrect: false,
    }
  }

  async signUpWithEmail() {
    this.setState({loading: true});
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: this.state.email,
      password: this.state.password,
    });
    this.setState({loading: false});

    console.log(error);
    console.log(session);
    if (error) {
      Alert.alert(error.message);
    } else {
      if (!session) {
        Alert.alert('Please check your inbox for email verification!');
      }
    }
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack title={t("inscription")} navigation={this.props.navigation}/>
          <VStack className="flex-1 px-10 justify-between">
            <VStack className="mb-5">
              <FormControl
                isInvalid={this.state.emailIncorrect}
                isRequired={true}
                className="mb-5"
              >
                <FormControlLabel className="mb-1">
                  <FormControlLabelText className="text-white">
                    {t("email")}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    className='text-white placeholder:text-white'
                    placeholder={t("email_adresse")}
                    keyboardType='email-address'
                    returnKeyType='next'
                    autoCapitalize='none'
                    onChangeText={(text) => this.setState({email: text})}
                    onSubmitEditing={() => this.mdpInput1.current.focus()}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {t("")}TODO
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl
                isInvalid={this.state.passwordIncorrect}
                isRequired={true}
                className="mb-5"
              >
                <FormControlLabel className="mb-1">
                  <FormControlLabelText className="text-white">
                    {t("mot_de_passe")}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    className='text-white placeholder:text-white'
                    placeholder={t("mot_de_passe")}
                    type={this.state.showPassword1 ? "text" : "password"}
                    autoCapitalize={'none'}
                    onChangeText={(text) => this.setState({password: text})}
                    onSubmitEditing={() => this.mdpInput2.current.focus()}
                    ref={this.mdpInput1}
                  />
                  <InputSlot className="pr-3">
                    <FontAwesome5.Button 
                      name={this.state.showPassword1 ? "eye" : "eye-slash"}
                      backgroundColor="#00000000"
                      iconStyle={{marginRight: 0}}
                      size={16}
                      onPress={() => this.setState({showPassword1: !this.state.showPassword1})}
                    />
                  </InputSlot>
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {t("")}TODO
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl
                isInvalid={this.state.passwordIncorrect}
                isRequired={true}
                className="mb-5"
              >
                <FormControlLabel className="mb-1">
                  <FormControlLabelText className="text-white">
                    {t("")}TODO
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    className='text-white placeholder:text-white'
                    placeholder={t("mot_de_passe")}
                    type={this.state.showPassword2 ? "text" : "password"}
                    autoCapitalize={'none'}
                    onChangeText={(text) => this.setState({password: text})}
                    ref={this.mdpInput2}
                  />
                  <InputSlot className="pr-3">
                    <FontAwesome5.Button 
                      name={this.state.showPassword2 ? "eye" : "eye-slash"}
                      backgroundColor="#00000000"
                      iconStyle={{marginRight: 0}}
                      size={16}
                      onPress={() => this.setState({showPassword2: !this.state.showPassword2})}
                    />
                  </InputSlot>
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {t("mot_de_passe_confirmation")}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl
                isInvalid={this.state.passwordIncorrect}
                isRequired={true}
                className="mb-5"
              >                
                <Checkbox value="Mango">
                  <CheckboxIndicator className='mr-2'>
                    <CheckboxIcon>
                      <CheckIcon />
                    </CheckboxIcon>
                  </CheckboxIndicator>
                  <CheckboxLabel>
                    {t("accepte_termes_conditions")}
                  </CheckboxLabel>
                </Checkbox>
              </FormControl>
              <FormControl>
                <Button size="lg" isDisabled={this.state.loading} onPress={() => this.signUpWithEmail()}>
                  <ButtonText>
                    {t("creer_le_compte")}
                  </ButtonText>
                </Button>
              </FormControl>
            </VStack>
            <VStack space="md">
              <Text className="text-white self-center" size="lg">
                {t("ou_creer_compte_avec")}
              </Text>
              <HStack className="flex" space="lg">
                <Button className="grow" size="lg" variant="outline" isDisabled={true}>
                  <FontAwesome5 name="apple" color='white' size={18} style={{marginRight: 5}}/>
                  <ButtonText className="text-white">
                    Apple
                  </ButtonText>
                </Button>
                <Button className="grow" size="lg" variant="outline" isDisabled={true}>
                  <FontAwesome5 name="google" color='white' size={14} className="mr-2"/>
                  <ButtonText className="text-white">
                    Google
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default (withTranslation()(Inscription));