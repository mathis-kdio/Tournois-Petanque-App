import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      backBehavior="none"
      screenOptions={{
        tabBarStyle: { backgroundColor: '#0594ae' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: { fontSize: 15 },
      }}
    >
      <Tabs.Screen
        name="resultats"
        options={{
          title: t('resultats_classement_navigation_title'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="trophy" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="matchs"
        options={{
          headerShown: false,
          title: t('matchs_details_navigation_title'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="bars" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
