import { VStack } from '@/components/ui/vstack';
import { ScrollView } from '@/components/ui/scroll-view';
import React from 'react';
import { Session } from '@supabase/supabase-js';
import { withTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/TopBarBack';
import { withSession } from '@/components/supabase/withSession';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';

export interface Props {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  session: Session | null;
}

interface UserDetail {
  Nom: { label: string; value: string };
  Prenom: { label: string; value: string };
  Email: { label: string; value: string };
  Pays: { label: string; value: string };
  Club: { label: string; value: string };
}

interface State {
  userDetails: UserDetail;
}

class InfosPerso extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userDetails: {
        Nom: { label: 'nom', value: 'Non renseigné' },
        Prenom: { label: 'prenom', value: 'Non renseigné' },
        Email: { label: 'email', value: 'Non renseigné' },
        Pays: { label: 'pays', value: 'Non renseigné' },
        Club: { label: 'club', value: 'Non renseigné' },
      },
    };
  }

  componentDidMount() {
    const { session } = this.props;
    this.setState((prevState) => ({
      userDetails: {
        ...prevState.userDetails,
        Email: { ...prevState.userDetails.Email, value: session.user.email },
      },
    }));
  }

  render() {
    const { t } = this.props;
    const { userDetails } = this.state;
    const detailsArray = Object.entries(userDetails);
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack
            title={t('informations_personnelles')}
            navigation={this.props.navigation}
          />
          <VStack className="flex-1 px-10">
            {detailsArray.map(([key, detail], index) => (
              <HStack key={index} className="mb-5">
                <Text className="text-white flex-1">{t(detail.label)} :</Text>
                <Text className="text-white flex-1">{detail.value}</Text>
              </HStack>
            ))}
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default withSession(withTranslation()(InfosPerso));
