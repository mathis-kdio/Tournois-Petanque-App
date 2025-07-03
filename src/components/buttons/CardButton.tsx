import { Badge, BadgeText } from '@/components/ui/badge';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../ui/theme-provider/ThemeProvider';

interface Props {
  text: string;
  icons: string[];
  navigate: () => void;
  newBadge: boolean;
}

const CardButton: React.FC<Props> = ({ text, icons, navigate, newBadge }) => {
  const { theme } = useTheme();
  const iconColor = theme === 'dark' ? 'black' : 'white';
  return (
    <Pressable
      onPress={() => navigate()}
      className="bg-custom-dark-blue flex-1 py-5 rounded-3xl justify-center"
    >
      {newBadge ? (
        <HStack className="mt-20">
          <Badge
            size="lg"
            variant="outline"
            action="error"
            className="rounded-full"
          >
            <FontAwesome5 name="bolt" color="#EF4444" size={12} />
            <BadgeText className="mx-2">Nouveau</BadgeText>
            <FontAwesome5 name="bolt" color="#EF4444" size={12} />
          </Badge>
        </HStack>
      ) : (
        <></>
      )}
      <VStack className="items-center">
        <HStack space="md">
          {icons.map((icon, index) => (
            <FontAwesome5 key={index} name={icon} color={iconColor} size={24} />
          ))}
        </HStack>
        <Text className="color-custom-text-button">{text}</Text>
      </VStack>
    </Pressable>
  );
};

export default CardButton;
