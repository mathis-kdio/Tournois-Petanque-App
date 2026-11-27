import { usePremium } from '@/services/purchases/premiumStore';
import { checkSyncGate, type SyncGateResult } from './autoSyncSetting';

export interface SyncGate {
  gate: SyncGateResult;
  isPremium: boolean;
  isLoading: boolean;
}

export function useSyncGate(): SyncGate {
  const { isPremium, isLoading } = usePremium();
  return {
    gate: checkSyncGate(),
    isPremium,
    isLoading,
  };
}
