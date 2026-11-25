import Purchases, { CustomerInfo, LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
  web: process.env.EXPO_PUBLIC_REVENUECAT_WEB_KEY,
  default: undefined,
});

export const PREMIUM_ENTITLEMENT_ID = 'premium';

export function isPurchasesConfigured(): boolean {
  return !!API_KEY;
}

export async function initRevenueCat(): Promise<void> {
  if (!API_KEY) {
    console.warn('[RevenueCat] Clé API manquante (EXPO_PUBLIC_REVENUECAT_*)');
    return;
  }
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }
  Purchases.configure({ apiKey: API_KEY });
}

export async function loginRevenueCat(
  userId: string,
): Promise<CustomerInfo | undefined> {
  if (!isPurchasesConfigured()) {
    return undefined;
  }
  const { customerInfo } = await Purchases.logIn(userId);
  return customerInfo;
}

export async function logoutRevenueCat(): Promise<void> {
  if (!isPurchasesConfigured()) {
    return;
  }
  const currentId = await Purchases.getAppUserID();
  if (currentId.startsWith('$RCAnonymousID')) {
    return;
  }
  await Purchases.logOut();
}

export async function getCustomerInfo(): Promise<CustomerInfo | undefined> {
  if (!isPurchasesConfigured()) {
    return undefined;
  }
  return Purchases.getCustomerInfo();
}

export async function restorePurchases(): Promise<CustomerInfo | undefined> {
  if (!isPurchasesConfigured()) {
    return undefined;
  }
  if (Platform.OS === 'web') {
    return getCustomerInfo();
  }
  return Purchases.restorePurchases();
}

export function addCustomerInfoListener(
  cb: (info: CustomerInfo) => void,
): () => void {
  if (!isPurchasesConfigured()) {
    return () => {
      /* */
    };
  }
  Purchases.addCustomerInfoUpdateListener(cb);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(cb);
  };
}

export async function redeemWebPurchaseFromUrl(url: string) {
  if (Platform.OS !== 'web' || !isPurchasesConfigured()) {
    return null;
  }
  const redemption = await Purchases.parseAsWebPurchaseRedemption(url);
  if (!redemption) {
    return null;
  }
  return Purchases.redeemWebPurchase(redemption);
}
