import * as React from 'react';
import { Text, Pressable, HStack, Image } from "@gluestack-ui/themed";
import { FontAwesome5 } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

export interface Props {
  text: string;
  action: () => void; 
  icon: string;
  type: string;
  drapeau: string | ImageSourcePropType;
}

interface State {
}

class Item extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { text, action, icon, type, drapeau } = this.props;

    let colorTxt = '$white';
    let btnColor = 'white';
    if (type == "danger") {
      colorTxt = '$red500';
      btnColor = 'red';
    }
    else if (type == "modal") {
      colorTxt = '$black';
      btnColor = 'black';
    }
    return (
      <Pressable onPress={() => action()}>
        <HStack m={'$2'} alignItems='center' justifyContent='space-between'>
          <HStack alignItems='center'>
            {drapeau == undefined ?
              <FontAwesome5 name={icon} size={16} color={btnColor} style={{marginRight: 5}}/>
              :
              <Image source={drapeau} alt="drapeau" size='xs'/>
            }
            <Text fontSize={'$md'} color={colorTxt}>{text}</Text>
          </HStack>
          <FontAwesome5 name="arrow-right" size={20} color={btnColor}/>
        </HStack>
      </Pressable>
    )
  }
}

export default Item