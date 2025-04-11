import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = 'https://cwpyjyhwmfebxoeqdmla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3cHlqeWh3bWZlYnhvZXFkbWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjgxNDksImV4cCI6MjA1NzkwNDE0OX0.nvuWXWDND_RYtCQxdu4vwIJnJMMv2_y_MfVUWWlb-2g';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Please check your configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': `react-native-${Platform.OS}`,
    },
  },
}); 