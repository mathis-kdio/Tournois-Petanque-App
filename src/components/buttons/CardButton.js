import * as React from 'react';
import { Text, Pressable } from "@gluestack-ui/themed";
import { FontAwesome5 } from '@expo/vector-icons';

class CardButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { text, icon, navigate } = this.props;
    return (
      <Pressable bg='#1c3969' flex={1} alignItems='center' justifyContent='center' py={'$5'} rounded={'$3xl'} onPress={() => navigate()}>
        <FontAwesome5 name={icon} color='white' size={24}/>
        <Text color='$white'>{text}</Text>
      </Pressable>
    )
  }
}

export default CardButton