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
import TopBarBack from '@/components/topBar/TopBarBack';
import { withSession } from '@/components/supabase/withSession';
import { LoaderIcon, TrashIcon } from '@/components/ui/icon';
import { Divider } from '@/components/ui/divider';

export interface Props {
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

  async supprimerCompte() {}

  render() {
    const { t } = this.props;
    return (
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
            <Button isDisabled={true} onPress={() => undefined}>
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
    );
  }
}

export default withSession(withTranslation()(Compte));
