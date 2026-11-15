import Loading from '@/components/Loading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useActualTournoi } from '@/repositories/tournois/useActualTournoi';
import MatchsManche from '@/screens/matchs/components/MatchsManche';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, type ScrollViewInstance } from 'react-native';

export default function MatchsScreen() {
  const { t } = useTranslation();
  const { actualTournoi } = useActualTournoi();
  const [mancheActive, setMancheActive] = useState(1);

  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrollWidth = useRef(0);
  const itemLayouts = useRef<Record<number, { x: number; width: number }>>({});

  const onItemLayout = (numero: number) => (e: LayoutChangeEvent) => {
    itemLayouts.current[numero] = {
      x: e.nativeEvent.layout.x,
      width: e.nativeEvent.layout.width,
    };
  };

  const centrerTour = (numero: number) => {
    setMancheActive(numero);
    const layout = itemLayouts.current[numero];
    if (!layout || !scrollRef.current) return;
    const x = Math.max(0, layout.x - (scrollWidth.current - layout.width) / 2);
    scrollRef.current.scrollTo({ x, animated: true });
  };

  if (!actualTournoi) {
    return <Loading />;
  }

  const { matchs, options } = actualTournoi;

  const getTitle = (numero: number) => {
    if (options.typeTournoi === TypeTournoi.COUPE) {
      const mancheName = matchs.find((el) => el.manche === numero)?.mancheName;
      if (mancheName === undefined) {
        throw Error;
      }
      return mancheName;
    }
    return `${t('tour')} ${numero}`;
  };

  const topTabItemLabel = (numero: number) => {
    let iconColor = '#ffda00';
    let textColor = 'text-yellow-400';
    type IconBattery = 'battery-half' | 'battery-full' | 'battery-empty';
    let iconName: IconBattery = 'battery-half';
    const matchsManche = matchs.filter((match) => match.manche === numero);

    let matchsRestant = matchsManche.length;
    if (matchsManche) {
      let count = matchsManche.reduce(
        (acc, obj) =>
          obj.score1 !== undefined && obj.score2 !== undefined
            ? (acc += 1)
            : acc,
        0,
      );
      if (count === matchsManche.length) {
        textColor = 'text-success-500';
        iconColor = 'green';
        iconName = 'battery-full';
      } else if (count === 0) {
        textColor = 'text-error-500';
        iconColor = 'red';
        iconName = 'battery-empty';
      }
      matchsRestant -= count;
    }

    return (
      <HStack className="items-center justify-center">
        <Text className="text-typography-white text-lg mr-2">
          {getTitle(numero)}
        </Text>
        <FontAwesome name={iconName} size={18} color={iconColor} />
        <Text className={`${textColor} ml-1`} size="xl">
          {matchsRestant.toString()}
        </Text>
      </HStack>
    );
  };

  return (
    <VStack className="flex-1 bg-custom-background">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="w-full flex-none bg-custom-background border-b border-outline-100"
        contentContainerStyle={{
          flexDirection: 'row',
          minWidth: '100%',
          alignItems: 'center',
        }}
        onLayout={(e) => {
          scrollWidth.current = e.nativeEvent.layout.width;
        }}
      >
        {Array.from({ length: options.nbTours }, (_, i) => {
          const numero = i + 1;
          const actif = numero === mancheActive;
          return (
            <Pressable
              key={`tour-${numero}`}
              onPress={() => centrerTour(numero)}
              onLayout={onItemLayout(numero)}
              style={{ flexGrow: 1, flexShrink: 0 }}
              className={`items-center justify-center px-4 py-3 border-b-2 ${actif ? 'border-custom-bg-inverse' : 'border-transparent'}`}
            >
              {topTabItemLabel(numero)}
            </Pressable>
          );
        })}
      </ScrollView>
      <MatchsManche mancheNumber={mancheActive} />
    </VStack>
  );
}
