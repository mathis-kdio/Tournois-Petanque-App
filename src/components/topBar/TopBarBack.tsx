import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';

interface Props {
  title: string;
}

const TopBarBack: React.FC<Props> = ({ title }) => {
  const router = useRouter();
  return (
    <HStack className="items-center px-5 py-2">
      <Pressable onPress={() => router.back()} className="rounded-2xl p-2">
        <FontAwesome5
          name="arrow-left"
          size={15}
          className="text-custom-bg-inverse"
        />
      </Pressable>
      <Text className="text-xl text-typography-white">{title}</Text>
    </HStack>
  );
};

export default TopBarBack;
