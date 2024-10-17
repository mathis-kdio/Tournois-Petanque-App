import TopBarBack from '@/components/TopBarBack';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TFunction } from 'i18next';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConnexionStackParamList } from '@/navigation/Navigation';

export interface Props {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  route: RouteProp<ConnexionStackParamList, 'ConfirmationEmail'>;
}

interface State {}

class ConfirmationEmail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { t } = this.props;
    let email = this.props.route.params.email;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack
            title={t('confirmation_email')}
            navigation={this.props.navigation}
          />
          <VStack className="px-10 justify-center items-center">
            <HStack className="justify-center">
              <MaterialCommunityIcons
                name="email-check-outline"
                size={128}
                color="white"
              />
            </HStack>
            <Text className="text-white">{t('confirmation_email_text_1')}</Text>
            <Text className="text-white">{email}</Text>
            <Text className="text-white">{t('confirmation_email_text_2')}</Text>
            <Button
              onPress={() => this.props.navigation.navigate('accueil')}
              className="mt-2"
            >
              <ButtonText>{t('retour_accueil')}</ButtonText>
            </Button>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(ConfirmationEmail);
