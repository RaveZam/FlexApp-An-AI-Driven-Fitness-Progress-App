import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useColorScheme } from "@/hooks/useColorScheme";

export type ThemePreference = "light" | "dark" | "system";
export type ColorScheme = "light" | "dark";

const THEME_PREFERENCE_KEY = "theme-preference";

type ThemeContextValue = {
  preference: ThemePreference;
  scheme: ColorScheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const systemScheme = useColorScheme();

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(THEME_PREFERENCE_KEY)
      .then((stored) => {
        if (!isMounted) return;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setPreferenceState(stored);
        }
      })
      .catch(() => {
        // Ignore read failures — default preference ("system") already applies.
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(THEME_PREFERENCE_KEY, next).catch(() => {
      // Ignore write failures — in-memory preference still applies for this session.
    });
  };

  const scheme: ColorScheme =
    preference !== "system" ? preference : systemScheme ?? "dark";

  const value = useMemo(
    () => ({ preference, scheme, setPreference }),
    [preference, scheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
