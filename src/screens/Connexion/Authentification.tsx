import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { ScrollView } from "@/components/ui/scroll-view";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import React from 'react'
import { Alert, AppState } from 'react-native'
import { withTranslation } from 'react-i18next';
import { supabase } from '@/utils/supabase';
import { SafeAreaView } from 'react-native-safe-area-context'

import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import TopBarBack from '@/components/TopBarBack';

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
}

class Authentification extends React.Component<Props, State> {
  mdpInput = React.createRef<any>();

  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
      email: "",
      password: ""
    }
  }

  async signInWithEmail() {
    this.setState({loading: true})
    const { error, data } = await supabase.auth.signInWithPassword({
      email: this.state.email,
      password: this.state.password,
    })

    this.setState({loading: false})
    console.log(data)
    console.log(error)

    if (error) {
      Alert.alert(error.message)
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
      <SafeAreaView style={{flex: 1}}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack title={t("authentification")} navigation={this.props.navigation}/>
          <VStack className="flex-1 px-10 justify-between">
            <VStack className="mb-5">
              <VStack className="mb-5">
                <Text className="text-white text-md">{t("email")}</Text>
                <Input className='border-white'>
                  <InputField
                    className='text-white placeholder:text-white'
                    placeholder={t("email_adresse")}
                    keyboardType='email-address'
                    returnKeyType='next'
                    autoCapitalize='none'
                    onChangeText={(text) => this.setState({email: text})}
                    onSubmitEditing={() => this.mdpInput.current.focus()}
                  />
                </Input>
              </VStack>
              <VStack className="mb-5">
                <Text className="text-white text-md">{t("mot_de_passe")}</Text>
                <Input className='border-white'>
                  <InputField
                    className='text-white placeholder:text-white'
                    placeholder={t("mot_de_passe")}
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    onChangeText={(text) => this.setState({password: text})}
                    ref={this.mdpInput}
                  />
                </Input>
              </VStack>
              <VStack className="mb-5">
                <Button isDisabled={this.state.loading} onPress={() => this.signInWithEmail()}>
                  <ButtonText>Se connecter</ButtonText>
                </Button>
              </VStack>
            </VStack>
            <VStack>
              <Button isDisabled={this.state.loading} onPress={() => this.inscription()}>
                <ButtonText>Créer un compte</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default (withTranslation()(Authentification));