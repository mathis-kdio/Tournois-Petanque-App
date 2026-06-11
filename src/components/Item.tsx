import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import FontAwesome, {
  FontAwesomeIconName,
} from '@react-native-vector-icons/fontawesome';
import * as React from 'react';
import { ImageSourcePropType } from 'react-native';

export interface Props {
  text: string;
  action: () => void;
  icon: FontAwesomeIconName | null;
  type: string;
  drapeau: string | ImageSourcePropType | undefined;
}

const Item: React.FC<Props> = ({ text, action, icon, type, drapeau }) => {
  let colorTxt = 'text-typography-white';
  let iconColor = '!text-custom-bg-inverse';
  if (type === 'danger') {
    colorTxt = 'text-red-500';
    iconColor = '!text-red-500';
  } else if (type === 'modal') {
    colorTxt = 'text-custom-text-modal';
    iconColor = '!text-custom-text-modal';
  }
  return (
    <Pressable onPress={() => action()}>
      <HStack className="m-2 items-center justify-between">
        <HStack className="items-center">
          {icon !== null ? (
            <FontAwesome
              name={icon}
              size={16}
              className={`${iconColor} pr-2`}
            />
          ) : drapeau !== undefined ? (
            <Image source={drapeau} alt="drapeau" size="xs" />
          ) : (
            <></>
          )}
          <Text className={`${colorTxt} text-md`}>{text}</Text>
        </HStack>
        <FontAwesome name="arrow-right" size={18} className={iconColor} />
      </HStack>
    </Pressable>
  );
};

export default Item;
