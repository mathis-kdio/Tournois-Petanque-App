import { useSyncGate } from '@/services/sync/useSyncGate';
import {
  getAutoSyncEnabled,
  setAutoSyncEnabled,
} from '@/services/sync/autoSyncSetting';
import { useEffect, useState } from 'react';

/**
 * État du bouton « synchronisation automatique » de l'écran compte :
 * valeur du réglage local + gardien premium (useSyncGate). Le bouton
 * n'est fonctionnel que si le gardien autorise la synchro ; sinon il est
 * verrouillé et renvoie vers le paywall.
 */
export function useAutoSyncEnabled() {
  const { gate } = useSyncGate();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAutoSyncEnabled().then((v) => {
      if (!cancelled) setEnabled(v);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = async (value: boolean) => {
    setEnabled(value);
    await setAutoSyncEnabled(value);
  };

  return { gate, enabled, toggle };
}
