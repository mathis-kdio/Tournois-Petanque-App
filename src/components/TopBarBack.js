import * as React from 'react';
import { Text, HStack, Spacer, Pressable } from "native-base";
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
      <HStack alignItems="center" px="5" py="2">
        <Pressable rounded="2xl" p="10px" onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={15} color="white"/>
        </Pressable>
        <Text fontSize="xl" color="white">{title}</Text>
        <Spacer/>
      </HStack>
    )
  }
}

export default TopBarBack