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

export interface Props {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  session: Session | null;
}

interface State {}

class InfosPerso extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

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
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default withSession(withTranslation()(InfosPerso));
