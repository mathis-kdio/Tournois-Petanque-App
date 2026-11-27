import { useSyncExternalStore } from 'react';
import type { CustomerInfo } from 'react-native-purchases';
import {
  addCustomerInfoListener,
  getCustomerInfo,
  isPurchasesConfigured,
  PREMIUM_ENTITLEMENT_ID,
} from './revenuecat';

let isPremium = false;
let isLoading = isPurchasesConfigured();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function setPremium(v: boolean) {
  if (isPremium !== v) {
    isPremium = v;
    emit();
  }
}

function setLoading(v: boolean) {
  if (isLoading !== v) {
    isLoading = v;
    emit();
  }
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getIsPremium(): boolean {
  return isPremium;
}

export { getIsPremium };

function getIsLoading(): boolean {
  return isLoading;
}

export async function refreshPremium(): Promise<void> {
  if (!isPurchasesConfigured()) {
    setPremium(false);
    setLoading(false);
    return;
  }
  setLoading(true);
  try {
    const info = await getCustomerInfo();
    setPremium(!!info?.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
  } catch (e) {
    setPremium(false);
    console.warn('[premium] refresh error', e);
  } finally {
    setLoading(false);
  }
}

export function initPremiumListener(): void {
  if (!isPurchasesConfigured()) {
    setLoading(false);
    return;
  }
  addCustomerInfoListener((info: CustomerInfo) => {
    setPremium(!!info.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
  });
  refreshPremium();
}

export function usePremium() {
  const premium = useSyncExternalStore(subscribe, getIsPremium, () => false);
  const loading = useSyncExternalStore(subscribe, getIsLoading, () => false);
  return { isPremium: premium, isLoading: loading, refresh: refreshPremium };
}
