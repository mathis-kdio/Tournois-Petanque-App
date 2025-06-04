import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

interface Props {
  title: string;
}

const TopBarBack: React.FC<Props> = ({ title }) => {
  const navigation = useNavigation();
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
};

export default TopBarBack;
