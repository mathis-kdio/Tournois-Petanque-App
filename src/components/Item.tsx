import { Image } from '@/components/ui/image';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

export interface Props {
  text: string;
  action: () => void;
  icon: string;
  type: string;
  drapeau: string | ImageSourcePropType | undefined;
}

const Item: React.FC<Props> = ({ text, action, icon, type, drapeau }) => {
  let colorTxt = 'text-typography-white';
  let iconColor = 'text-custom-bg-inverse';
  if (type === 'danger') {
    colorTxt = 'text-red-500';
    iconColor = 'text-red-500';
  } else if (type === 'modal') {
    colorTxt = 'text-custom-text-modal';
    iconColor = 'text-custom-text-modal';
  }
  return (
    <Pressable onPress={() => action()}>
      <HStack className="m-2 items-center justify-between">
        <HStack className="items-center">
          {drapeau === undefined ? (
            <FontAwesome5
              name={icon}
              size={16}
              style={{ marginRight: 5 }}
              className={iconColor}
            />
          ) : (
            <Image source={drapeau} alt="drapeau" size="xs" />
          )}
          <Text className={`${colorTxt} text-md`}>{text}</Text>
        </HStack>
        <FontAwesome5 name="arrow-right" size={20} className={iconColor} />
      </HStack>
    </Pressable>
  );
};

export default Item;
