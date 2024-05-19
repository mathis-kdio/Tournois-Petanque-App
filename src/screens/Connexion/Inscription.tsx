import React, { useState } from 'react'
import { Alert, AppState } from 'react-native'
import { withTranslation } from 'react-i18next';
import { supabase } from '@/utils/supabase';
import { SafeAreaView } from 'react-native-safe-area-context'

import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { Button, ButtonText, Input, InputField, ScrollView, VStack } from '@gluestack-ui/themed';
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

class Inscription extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
      email: "",
      password: ""
    }
  }

  async signUpWithEmail() {
    this.setState({loading: true})
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: this.state.email,
      password: this.state.password,
    })
    console.log(error)
    console.log(session)
    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    this.setState({loading: false})
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView height={'$1'} bgColor='#0594ae'>
          <TopBarBack title={t("mode_tournoi")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} justifyContent='space-between'>
            <VStack>
              <Input
                /*label="Email"
                leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                onChangeText={(text) => this.setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={'none'}*/
              >
                <InputField
                  placeholder={"email@address.com"}
                  onChangeText={(text) => this.setState({email: text})}
                />
              </Input>
            </VStack>
            <VStack>
              <Input
                /*label="Password"
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize={'none'}*/
              />
              <Input size='md'>
                <InputField
                  placeholder={"Password"}
                  onChangeText={(text) => this.setState({password: text})}
                />
              </Input>
            </VStack>
            <VStack>
              <Button isDisabled={this.state.loading} onPress={() => this.signUpWithEmail()}>
                <ButtonText>Créer le compte</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default (withTranslation()(Inscription))