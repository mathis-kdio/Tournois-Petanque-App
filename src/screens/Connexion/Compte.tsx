import { VStack } from '@/components/ui/vstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import React from 'react';
import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';
import { withTranslation } from 'react-i18next';
import Item from '@components/Item';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { withSession } from '@/components/supabase/withSession';
import { LoaderIcon, TrashIcon } from '@/components/ui/icon';
import { Divider } from '@/components/ui/divider';
import { synchroniserTournois } from '@/services/tournoisService';
import { Tournoi } from '@/types/interfaces/tournoi';
import { connector, PropsFromRedux } from '@/store/connector';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  session: Session | null;
}

interface State {}

class Compte extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  deconnexion() {
    supabase.auth.signOut();
    this.props.navigation.navigate('AccueilGeneral');
  }

  synchronisation(): void {
    let tournois: Tournoi[] = this.props.listeTournois;
    console.log(tournois.slice(0, 2));
    synchroniserTournois(tournois.slice(0, 2));
  }

  async supprimerCompte() {}

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack
            title={t('mon_compte')}
            navigation={this.props.navigation}
          />
          <VStack className="flex-1 px-10 justify-between">
            <VStack className="border border-white rounded-lg">
              <Item
                text={t('informations_personnelles')}
                action={() => this.props.navigation.navigate('InfosPerso')}
                icon={'info-circle'}
                type={undefined}
                drapeau={undefined}
              />
              <Divider />
              <Item
                text={t('securite')}
                action={() => this.props.navigation.navigate('Securite')}
                icon={'lock'}
                type={undefined}
                drapeau={undefined}
              />
            </VStack>
            <VStack space="xl" className="mt-5">
              <Button onPress={() => this.deconnexion()}>
                <ButtonText>{t('se_deconnecter')}</ButtonText>
              </Button>
              <Button onPress={() => this.synchronisation()}>
                <ButtonIcon as={LoaderIcon} />
                <ButtonText className="ml-2">
                  {t('forcer_synchronisation')}
                </ButtonText>
              </Button>
              <Button
                action="negative"
                isDisabled={true}
                onPress={() => this.supprimerCompte()}
              >
                <ButtonIcon as={TrashIcon} />
                <ButtonText className="ml-2">
                  {t('supprimer_compte')}
                </ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connector(withSession(withTranslation()(Compte)));
