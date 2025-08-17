import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

interface Props {
  title: string;
}

const TopBar: React.FC<Props> = ({ title }) => {
  return (
    <HStack className="items-center px-5 py-2">
      <Text className="text-xl text-typography-white">{title}</Text>
    </HStack>
  );
};

export default TopBar;
