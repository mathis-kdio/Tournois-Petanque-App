import { Badge, BadgeText } from "@/components/ui/badge";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import * as React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

export interface Props {
  text: string;
  icon: string;
  navigate: () => void;
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
      <Pressable
        onPress={() => navigate()}
        className="bg-primary-500 flex-1 py-5 rounded-3xl justify-center">
        {newBadge ?
          <HStack className={` mt-${-20} `}>
            <Badge size='lg' variant='outline' action='error' className="rounded-full">
              <FontAwesome5 name='bolt' color='#EF4444' size={12}/>
              <BadgeText className="mx-2">Nouveau</BadgeText>
              <FontAwesome5 name='bolt' color='#EF4444' size={12}/>
            </Badge>
          </HStack>
        : <></> }
        <VStack className="items-center">
          <FontAwesome5 name={icon} color='white' size={24}/>
          <Text className="text-white">{text}</Text>
        </VStack>
      </Pressable>
    );
  }
}

export default CardButton