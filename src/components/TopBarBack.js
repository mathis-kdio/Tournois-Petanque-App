import * as React from 'react';
import { Text, HStack, Pressable } from "@gluestack-ui/themed";
import { FontAwesome5 } from '@expo/vector-icons';

class TopBarBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { title, navigation } = this.props;
    return (
      <HStack alignItems='center' px={'$5'} py={'$2'}>
        <Pressable rounded={'$2xl'} p={'$2'} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={15} color='white'/>
        </Pressable>
        <Text fontSize={'$xl'} color='white'>{title}</Text>
      </HStack>
    )
  }
}

export default TopBarBack