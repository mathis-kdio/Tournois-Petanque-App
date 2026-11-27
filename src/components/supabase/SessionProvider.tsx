import { refreshPremium } from '@/services/purchases/premiumStore';
import {
  loginRevenueCat,
  logoutRevenueCat,
} from '@/services/purchases/revenuecat';
import { Session, User } from '@supabase/supabase-js';
import { supabaseClient } from '@utils/supabase';
import { createContext, use, useEffect, useState } from 'react';

const linkRevenueCat = (userId: string | undefined) => {
  if (userId) {
    loginRevenueCat(userId)
      .then(() => refreshPremium())
      .catch((e) => console.warn('[RevenueCat] logIn error', e));
  } else {
    logoutRevenueCat()
      .then(() => refreshPremium())
      .catch((e) => console.warn('[RevenueCat] logOut error', e));
  }
};

const AuthContext = createContext<{
  session: Session | null | undefined;
  user: User | null | undefined;
  signOut: () => void;
}>({
  session: null,
  user: null,
  signOut: () => {
    console.log('signOut');
  },
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user);
      setLoading(false);
      linkRevenueCat(session?.user?.id);
    };

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user);
        setLoading(false);
        linkRevenueCat(session?.user?.id);
      },
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    signOut: () => supabaseClient.auth.signOut(),
  };

  // use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuth = () => {
  return use(AuthContext);
};
