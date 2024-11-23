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

interface State {
}

class Securite extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { session } = this.props;
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack
            title={t('securite')}
            navigation={this.props.navigation}
          />
          <VStack className="flex-1 px-10">
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default withSession(withTranslation()(Securite));
