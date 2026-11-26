// Edge Function Supabase : webhook RevenueCat
// Déploiement : supabase functions deploy revenuecat-webhook

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PREMIUM_ENTITLEMENT = 'premium';

// Événements qui rendent l'entitlement actif (hors CANCELLATION : l'utilisateur
// reste actif jusqu'à la fin de la période payée, signalée par EXPIRATION).
const ACTIVE_TYPES = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'PRODUCT_CHANGE',
  'NON_RENEWING_PURCHASE',
]);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

serve(async (req) => {
  // Vérification du secret partagé si configuré
  const secret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
  if (secret) {
    const auth = req.headers.get('authorization') ?? '';
    if (auth !== `Bearer ${secret}`) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
      });
    }
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), {
      status: 405,
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
    });
  }

  // Le payload RevenueCat contient l'objet `event` (v2) ou est l'event (v1)
  const event = body?.event ?? body;
  const type: string | undefined = event?.type;
  const appUserId: string | undefined = event?.app_user_id;

  if (!type || !appUserId) {
    return new Response(JSON.stringify({ received: true, skipped: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // is_premium : priorité à l'objet entitlements s'il est présent, sinon au type d'event
  let isPremium: boolean;
  let expiresAt: string | null = null;
  const ent = event?.entitlements?.[PREMIUM_ENTITLEMENT];
  if (ent) {
    isPremium = ent.is_active === true;
    expiresAt = ent.expires_date ?? null;
  } else {
    isPremium = ACTIVE_TYPES.has(type);
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      is_premium: isPremium,
      premium_expires_at: expiresAt,
      revenuecat_app_user_id: appUserId,
    })
    .eq('id', appUserId);

  if (error) {
    console.error('[revenuecat-webhook] update error', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ received: true, type, isPremium }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
