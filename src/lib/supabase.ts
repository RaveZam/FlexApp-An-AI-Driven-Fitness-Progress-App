import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Create a safe storage wrapper that handles AsyncStorage initialization issues
const createSafeStorage = () => {
  return {
    getItem: async (key: string) => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.warn("AsyncStorage getItem failed:", error);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.warn("AsyncStorage setItem failed:", error);
      }
    },
    removeItem: async (key: string) => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.warn("AsyncStorage removeItem failed:", error);
      }
    },
  };
};

// Load Supabase config from environment variables (EXPO_PUBLIC_* are exposed to the app)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: createSafeStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export { supabase };
