import { Badge, BadgeText } from '@/components/ui/badge';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  FontAwesome,
  FontAwesomeIconName,
} from '@react-native-vector-icons/fontawesome';

interface Props {
  text: string;
  icons: FontAwesomeIconName[];
  navigate: () => void;
  newBadge: boolean;
}

const CardButton: React.FC<Props> = ({ text, icons, navigate, newBadge }) => {
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
            <FontAwesome name="bolt" color="#EF4444" size={12} />
            <BadgeText className="mx-2">Nouveau</BadgeText>
            <FontAwesome name="bolt" color="#EF4444" size={12} />
          </Badge>
        </HStack>
      ) : (
        <></>
      )}
      <VStack className="items-center">
        <HStack space="md">
          {icons.map((icon, index) => (
            <FontAwesome
              key={index}
              name={icon}
              size={24}
              className="text-custom-text-button"
            />
          ))}
        </HStack>
        <Text className="color-custom-text-button">{text}</Text>
      </VStack>
    </Pressable>
  );
};

export default CardButton;
