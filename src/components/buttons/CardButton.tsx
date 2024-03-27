import * as React from 'react';
import { Text, Pressable, VStack, HStack, Badge, BadgeText } from "@gluestack-ui/themed";
import { FontAwesome5 } from '@expo/vector-icons';

export interface Props {
  text: string;
  icon: string;
  navigate: ;
  newBadge: boolean;
}

interface State {
}

class CardButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { text, icon, navigate, newBadge } = this.props;
    return (
      <Pressable bg='#1c3969' flex={1} py={'$5'} rounded={'$3xl'} onPress={() => navigate()}>
        {newBadge ?
          <HStack mt={-20}>
            <Badge size='xl' variant='outline' borderRadius='$full' action='error'>
              <FontAwesome5 name='bolt' color='#EF4444' size={12}/>
              <BadgeText mx='$2'>Nouveau</BadgeText>
              <FontAwesome5 name='bolt' color='#EF4444' size={12}/>
            </Badge>
          </HStack>
        : <></> }
        <VStack alignItems='center'>
          <FontAwesome5 name={icon} color='white' size={24}/>
          <Text color='$white'>{text}</Text>
        </VStack>
      </Pressable>
    )
  }
}

export default CardButton