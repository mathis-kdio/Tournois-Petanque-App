import { VStack } from '@/components/ui/vstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { useAuth } from '@/components/supabase/SessionProvider';

interface UserDetail {
  Nom: { label: string; value: string };
  Prenom: { label: string; value: string };
  Email: { label: string; value: string };
  Pays: { label: string; value: string };
  Club: { label: string; value: string };
}

const InfosPerso = () => {
  const { t } = useTranslation();
  const { session } = useAuth();

  const userDetailsInit: UserDetail = {
    Nom: { label: 'nom', value: 'Non renseigné' },
    Prenom: { label: 'prenom', value: 'Non renseigné' },
    Email: { label: 'email', value: 'Non renseigné' },
    Pays: { label: 'pays', value: 'Non renseigné' },
    Club: { label: 'club', value: 'Non renseigné' },
  };

  const [userDetails, setUserDetails] = useState<UserDetail>(userDetailsInit);

  useEffect(() => {
    if (!session || session.user.email === undefined) {
      return;
    }
    const email = session.user.email;

    setUserDetails((prevState) => ({
      ...prevState,
      Email: {
        ...prevState.Email,
        value: email,
      },
    }));
  }, [session]);

  const detailsArray = Object.entries(userDetails);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-custom-background">
        <TopBarBack title={t('informations_personnelles')} />
        <VStack className="flex-1 px-10">
          {detailsArray.map(([key, detail], index) => (
            <HStack key={index} className="mb-5">
              <Text className="text-white flex-1">{t(detail.label)} :</Text>
              <Text className="text-white flex-1">{detail.value}</Text>
            </HStack>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InfosPerso;
