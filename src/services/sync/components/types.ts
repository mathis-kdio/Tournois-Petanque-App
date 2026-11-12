import type { LoginSyncPlan } from '@/services/sync/syncAccount';

export interface AdoptionPrompt {
  userId: string;
  plan: LoginSyncPlan;
}
