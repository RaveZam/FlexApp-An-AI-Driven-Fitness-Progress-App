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

const supabase = createClient(
  "https://qllxnvkwkxdghlexyrnr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsbHhudmt3a3hkZ2hsZXh5cm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDM0MzIsImV4cCI6MjA2NTI3OTQzMn0._7gAj53uIsOPIGdJFYuAEH8qOsoPzTmYBPlBipr6mMo",
  {
    auth: {
      storage: createSafeStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export { supabase };
