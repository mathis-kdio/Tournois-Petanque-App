import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

export interface Props {
  navigation: StackNavigationProp<any, any>;
  title: string;
}

interface State {}

class TopBarBack extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, navigation } = this.props;
    return (
      <HStack className="items-center px-5 py-2">
        <Pressable
          onPress={() => navigation.goBack()}
          className="rounded-2xl p-2"
        >
          <FontAwesome5 name="arrow-left" size={15} color="white" />
        </Pressable>
        <Text className="text-xl text-white">{title}</Text>
      </HStack>
    );
  }
}

export default TopBarBack;
