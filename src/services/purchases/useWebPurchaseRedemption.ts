import { useEffect } from 'react';
import { Platform } from 'react-native';
import { refreshPremium } from './premiumStore';
import { isPurchasesConfigured, redeemWebPurchaseFromUrl } from './revenuecat';

export function useWebPurchaseRedemption() {
  useEffect(() => {
    if (Platform.OS !== 'web' || !isPurchasesConfigured()) {
      return;
    }
    const href = window.location.href;
    redeemWebPurchaseFromUrl(href)
      .then((res) => {
        if (res) {
          refreshPremium();
          window.history.replaceState({}, '', window.location.pathname);
        }
      })
      .catch((e) => console.warn('[RevenueCat] redemption web error', e));
  }, []);
}
