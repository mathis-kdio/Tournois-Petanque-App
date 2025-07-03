import { Image } from '@/components/ui/image';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';
import { useTheme } from './ui/theme-provider/ThemeProvider';

export interface Props {
  text: string;
  action: () => void;
  icon: string;
  type: string;
  drapeau: string | ImageSourcePropType | undefined;
}

const Item: React.FC<Props> = ({ text, action, icon, type, drapeau }) => {
  const { theme } = useTheme();

  let colorTxt = 'text-white';
  let btnColor = 'white';
  if (type === 'danger') {
    colorTxt = 'text-red-500';
    btnColor = 'red';
  } else if (type === 'modal') {
    colorTxt = 'color-custom-text';
    btnColor = theme === 'dark' ? 'white' : 'black';
  }
  return (
    <Pressable onPress={() => action()}>
      <HStack className="m-2 items-center justify-between">
        <HStack className="items-center">
          {drapeau === undefined ? (
            <FontAwesome5
              name={icon}
              size={16}
              color={btnColor}
              style={{ marginRight: 5 }}
            />
          ) : (
            <Image source={drapeau} alt="drapeau" size="xs" />
          )}
          <Text className={`${colorTxt} text-md`}>{text}</Text>
        </HStack>
        <FontAwesome5 name="arrow-right" size={20} color={btnColor} />
      </HStack>
    </Pressable>
  );
};

export default Item;
