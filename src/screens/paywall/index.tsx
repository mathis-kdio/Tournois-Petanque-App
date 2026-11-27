import { Box } from '@/components/ui/box';
import { usePremium } from '@/services/purchases/premiumStore';
import {
  isPurchasesConfigured,
  PREMIUM_ENTITLEMENT_ID,
} from '@/services/purchases/revenuecat';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import WebPaywall from './components/WebPaywall';
import AchatIndisponible from './components/AchatIndisponible';

const Paywall = () => {
  const router = useRouter();
  const { refresh } = usePremium();

  if (!isPurchasesConfigured()) {
    return <AchatIndisponible />;
  }

  if (Platform.OS === 'web') {
    return <WebPaywall />;
  }

  return (
    <Box className="flex-1 bg-custom-background">
      <RevenueCatUI.Paywall
        onPurchaseCompleted={async ({ customerInfo }) => {
          if (customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]) {
            await refresh();
            router.back();
          }
        }}
        onRestoreCompleted={async ({ customerInfo }) => {
          if (customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]) {
            await refresh();
            router.back();
          }
        }}
        onDismiss={() => router.back()}
      />
    </Box>
  );
};

export default Paywall;
