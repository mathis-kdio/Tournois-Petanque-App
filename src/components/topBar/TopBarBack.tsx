import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useRouter } from 'expo-router';
import * as React from 'react';

interface Props {
  title: string;
  rightAction?: React.ReactNode;
}

const TopBarBack: React.FC<Props> = ({ title, rightAction }) => {
  const router = useRouter();
  return (
    <HStack className="items-center px-5 py-2">
      <Pressable onPress={() => router.back()} className="rounded-2xl p-2">
        <FontAwesome
          name="arrow-left"
          size={16}
          className="!text-custom-bg-inverse"
        />
      </Pressable>
      <Text className="text-xl text-typography-white">{title}</Text>
      {rightAction ? (
        <>
          <Box className="flex-1" />
          {rightAction}
        </>
      ) : null}
    </HStack>
  );
};

export default TopBarBack;
