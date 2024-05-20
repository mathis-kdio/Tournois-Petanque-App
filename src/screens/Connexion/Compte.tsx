import React from 'react';
import { supabase } from '@/utils/supabase';
import { Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { withTranslation } from 'react-i18next';
import { Button, ButtonText, Input, InputField, ScrollView, Text, VStack } from '@gluestack-ui/themed'

import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/TopBarBack';

export interface Props {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
  loading: boolean;
  username: string;
  website: string;
  avatarUrl: string;
  session: Session | null;
}

class Compte extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: true,
      username: "",
      website: "",
      avatarUrl: "",
      session: null
    }
  }

  componentDidMount() {
    supabase.auth.onAuthStateChange((event, session) => {
      this.setState({session: session});
      if (session) {
        this.getProfile();
      }
    })
  }

  async getProfile() {
    try {
      this.setState({loading: true})
      if (!this.state.session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', this.state.session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      console.log(data)

      if (data) {
        this.setState({
          username: data.username,
          website: data.website,
          avatarUrl: data.avatar_url
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      this.setState({loading: false})
    }
  }

  /*async updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      this.setState({loading: true})
      if (!this.state.session?.user) throw new Error('No user on the session!')

      const updates = {
        id: this.state.session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      this.setState({loading: false})
    }
  }*/

  deconnexion() {
    supabase.auth.signOut();
    this.props.navigation.navigate('AccueilGeneral')
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView height={'$1'} bgColor='#0594ae'>
          <TopBarBack title={t("mon_compte")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} justifyContent='space-between'>
            <VStack>
              <Text color='$white'>{this.state.session?.user?.email}</Text>
            </VStack>

            <VStack>
              <Button onPress={() => this.deconnexion()} >
                <ButtonText>{t("se_deconnecter")}</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default (withTranslation()(Compte))