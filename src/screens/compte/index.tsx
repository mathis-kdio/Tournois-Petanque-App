import TopBarBack from '@/components/topBar/TopBarBack';

import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { LoaderIcon, TrashIcon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/components/supabase/SessionProvider';
import { checkLogout, logoutAndPurge } from '@/services/sync/syncAccount';
import Item from '@components/Item';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import BlockLogoutAlertDialog from './components/BlockLogoutAlertDialog';
import DeleteAccountAlertDialog from './components/DeleteAccountAlertDialog';
import { useForceSync } from './hooks/useForceSync';

const Compte = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  const [logoutBlockedOpen, setLogoutBlockedOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const deconnexion = async () => {
    if (!user || actionLoading) return;
    setActionLoading(true);
    let canLogout: boolean;
    try {
      const check = await checkLogout();
      canLogout = check.canLogout;
    } catch (err) {
      Alert.alert(
        t('erreur_inattendue', {
          erreur: err instanceof Error ? err.message : String(err),
        }),
      );
      setActionLoading(false);
      return;
    }

    if (!canLogout) {
      setLogoutBlockedOpen(true);
      setActionLoading(false);
      return;
    }

    try {
      await logoutAndPurge(user.id);
      router.navigate('.');
    } catch (err) {
      Alert.alert(
        t('erreur_inattendue', {
          erreur: err instanceof Error ? err.message : String(err),
        }),
      );
    }
    setActionLoading(false);
  };

  const forceSync = useForceSync();

  const forcerSynchronisation = async () => {
    if (!user || actionLoading) return;
    setActionLoading(true);
    await forceSync();
    setActionLoading(false);
  };

  return (
    <ScrollView className="h-1 bg-custom-background">
      <TopBarBack title={t('mon_compte')} />
      <VStack className="flex-1 px-10 justify-between">
        <VStack className="border border-custom-bg-inverse rounded-lg">
          <Item
            text={t('informations_personnelles')}
            action={() => router.navigate('/compte/infos-perso')}
            icon={'info-circle'}
            type={''}
            drapeau={undefined}
          />
          <Divider />
          <Item
            text={t('securite')}
            action={() => router.navigate('/compte/securite')}
            icon={'lock'}
            type={''}
            drapeau={undefined}
          />
        </VStack>
        <VStack space="xl" className="mt-5">
          <Button onPress={deconnexion} isDisabled={!user || actionLoading}>
            <ButtonText>{t('se_deconnecter')}</ButtonText>
          </Button>
          <Button
            onPress={forcerSynchronisation}
            isDisabled={!user || actionLoading}
          >
            <ButtonIcon as={LoaderIcon} />
            <ButtonText className="ml-2">
              {t('forcer_synchronisation')}
            </ButtonText>
          </Button>
          <Button
            action="negative"
            isDisabled={!user || actionLoading}
            onPress={() => setDeleteAccountOpen(true)}
          >
            <ButtonIcon as={TrashIcon} />
            <ButtonText className="ml-2">{t('supprimer_compte')}</ButtonText>
          </Button>
        </VStack>
      </VStack>

      <BlockLogoutAlertDialog
        logoutBlockedOpen={logoutBlockedOpen}
        setLogoutBlockedOpen={setLogoutBlockedOpen}
        setActionLoading={setActionLoading}
      />

      <DeleteAccountAlertDialog
        deleteAccountOpen={deleteAccountOpen}
        setDeleteAccountOpen={setDeleteAccountOpen}
        setActionLoading={setActionLoading}
      />
    </ScrollView>
  );
};

export default Compte;
