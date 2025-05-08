import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pjwgepngyhmvvaranelt.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqd2dlcG5neWhtdnZhcmFuZWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5MjE4MzAsImV4cCI6MjAzMDQ5NzgzMH0.-h8UsqhhF01VeCDLHtj4NuDxiWCYF38ChofcwUKM0aI';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
