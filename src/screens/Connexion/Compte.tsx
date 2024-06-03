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
import { withSession } from '@/components/supabase/withSession';
import { synchroniserTournois } from '@/services/tournois/tournoisService';
import { Tournoi } from '@/types/interfaces/tournoi';
import { PropsFromRedux, connector } from '@/store/connector';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
  session: Session | null;
}

interface State {
  loading: boolean;
  username: string;
  website: string;
  avatarUrl: string;
}

class Compte extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: true,
      username: "",
      website: "",
      avatarUrl: "",
    }
  }

  async getProfile(): Promise<void> {
    const { session } = this.props;
    try {
      this.setState({loading: true})
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
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

  synchronisation(): void {
    let tournois: Tournoi[] = this.props.listeTournois;
    console.log(tournois.slice(0, 2))
    synchroniserTournois(tournois.slice(0, 2));
  }

  deconnexion(): void {
    supabase.auth.signOut();
    this.props.navigation.navigate('AccueilGeneral')
  }

  render() {
    const { t, session } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView height={'$1'} bgColor='#0594ae'>
          <TopBarBack title={t("mon_compte")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} justifyContent='space-between'>
            <VStack>
              <Text color='$white'>{session?.user?.email}</Text>
            </VStack>
            <VStack>
              <Button onPress={() => this.synchronisation()} >
                <ButtonText>Forcer la synchronisation</ButtonText>
              </Button>
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

export default connector(withSession(withTranslation()(Compte)))