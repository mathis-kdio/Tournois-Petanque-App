import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://pjwgepngyhmvvaranelt.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqd2dlcG5neWhtdnZhcmFuZWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5MjE4MzAsImV4cCI6MjAzMDQ5NzgzMH0.-h8UsqhhF01VeCDLHtj4NuDxiWCYF38ChofcwUKM0aI';

const isServerPrerender =
  Platform.OS === 'web' && typeof window === 'undefined';

const memoryStorage = {
  getItem: async (_key: string) => null,
  setItem: async (_key: string, _value: string) => {
    /**/
  },
  removeItem: async (_key: string) => {
    /**/
  },
};

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isServerPrerender ? memoryStorage : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
