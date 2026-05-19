import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

export function useHideNavigationBar() {
  useEffect(() => {
    const hideNav = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    };
    hideNav();
  }, []);
}
