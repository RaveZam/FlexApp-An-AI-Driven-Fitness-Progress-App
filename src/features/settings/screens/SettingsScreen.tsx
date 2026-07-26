import Avatar from "@/components/Avatar";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Popup from "@/components/ui/Popup";
import { useTheme, usePalette, type ThemePreference } from "@/src/theme";
import React, { useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../hooks/useSettings";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function Settings() {
  const p = usePalette();
  const { preference, setPreference } = useTheme();
  const { userName, userEmail, avatarUri, loggingOut, clearHistory, cancelInProgress, logout } =
    useSettings();
  const [isLogoutPopupVisible, setLogoutPopupVisible] = useState(false);
  const [isClearHistoryPopupVisible, setClearHistoryPopupVisible] = useState(false);
  const [isCancelInProgressPopupVisible, setCancelInProgressPopupVisible] = useState(false);

  const confirmClearHistory = () => {
    clearHistory();
    setClearHistoryPopupVisible(false);
  };

  const confirmCancelInProgress = () => {
    cancelInProgress();
    setCancelInProgressPopupVisible(false);
  };

  const confirmLogout = async () => {
    await logout();
    setLogoutPopupVisible(false);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: p.ink }}>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: p.ink }}
        contentContainerClassName="px-5 pt-10 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold mb-6" style={{ color: p.bone }}>Settings</Text>

        <View
          className="mb-8 p-6 rounded-xl border"
          style={{ backgroundColor: p.inkRaised, borderColor: p.accentBorderSoft }}
        >
          <View className="flex-row items-center mb-4">
            <Avatar
              uri={avatarUri}
              name={userName}
              email={userEmail}
              size={60}
            />
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold" style={{ color: p.bone }}>
                {userName}
              </Text>
              <Text className="text-sm" style={{ color: p.muted }}>{userEmail}</Text>
            </View>
            <TouchableOpacity
              className="p-2 rounded-full border"
              style={{ backgroundColor: p.accentSoft, borderColor: p.accentBorder }}
            >
              <Text className="text-xs font-semibold" style={{ color: p.accent }}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xs uppercase mb-1" style={{ color: p.muted }}>
                Member Since
              </Text>
              <Text className="text-sm" style={{ color: p.bone }}>January 2024</Text>
            </View>
            <View>
              <Text className="text-xs uppercase mb-1" style={{ color: p.muted }}>Plan</Text>
              <Text className="text-sm font-semibold" style={{ color: p.accent }}>
                Premium
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="uppercase text-xs mb-2" style={{ color: p.muted }}>Account</Text>
          <TouchableOpacity
            className="p-4 rounded-xl mb-3 border"
            style={{ backgroundColor: p.accentSoft, borderColor: p.accentBorderSoft }}
          >
            <Text className="text-base" style={{ color: p.bone }}>Change Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4 rounded-xl border"
            style={{ backgroundColor: p.dangerSoft, borderColor: p.dangerBorder }}
            onPress={() => setLogoutPopupVisible(true)}
          >
            <Text className="text-base font-semibold" style={{ color: p.danger }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="uppercase text-xs mb-2" style={{ color: p.muted }}>
            Preferences
          </Text>
          <View
            className="p-4 rounded-xl mb-3 flex-row justify-between items-center border"
            style={{ backgroundColor: p.accentSoft, borderColor: p.accentBorderSoft }}
          >
            <Text style={{ color: p.bone }}>Notifications</Text>
            <Switch
              trackColor={{ false: p.mutedSoft, true: p.accent }}
              thumbColor={p.bone}
            />
          </View>
          <View
            className="p-4 rounded-xl flex-row justify-between items-center border"
            style={{ backgroundColor: p.accentSoft, borderColor: p.accentBorderSoft }}
          >
            <Text style={{ color: p.bone }}>Theme</Text>
            <View className="flex-row" style={{ gap: 6 }}>
              {THEME_OPTIONS.map((opt) => {
                const selected = preference === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setPreference(opt.value)}
                    className="px-3 py-1.5 rounded-full border"
                    style={{
                      backgroundColor: selected ? p.accent : "transparent",
                      borderColor: selected ? p.accent : p.hairlineStrong,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: selected ? p.onAccent : p.muted }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="uppercase text-xs mb-2" style={{ color: p.muted }}>Data</Text>
          <TouchableOpacity
            className="p-4 rounded-xl mb-3 border"
            style={{ backgroundColor: p.accentSoft, borderColor: p.accentBorderSoft }}
            onPress={() => setCancelInProgressPopupVisible(true)}
          >
            <Text className="text-base" style={{ color: p.bone }}>Cancel In-Progress Workouts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4 rounded-xl border"
            style={{ backgroundColor: p.dangerSoft, borderColor: p.dangerBorder }}
            onPress={() => setClearHistoryPopupVisible(true)}
          >
            <Text className="text-base font-semibold" style={{ color: p.danger }}>Clear History</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="uppercase text-xs mb-2" style={{ color: p.muted }}>App</Text>
          <TouchableOpacity
            className="p-4 rounded-xl mb-3 border"
            style={{ backgroundColor: p.accentSoft, borderColor: p.accentBorderSoft }}
          >
            <Text style={{ color: p.bone }}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4 rounded-xl border"
            style={{ backgroundColor: p.accentSoft, borderColor: p.accentBorderSoft }}
          >
            <Text style={{ color: p.bone }}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View className="mt-8">
          <Text className="text-center text-xs" style={{ color: p.muted }}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      <Popup
          isVisible={isLogoutPopupVisible}
          onClose={() => setLogoutPopupVisible(false)}
          iconName="log-out-outline"
          message="Are you sure you want to log out?"
          buttons={[
            { text: "Cancel", onPress: () => setLogoutPopupVisible(false) },
            { text: "Log Out", onPress: confirmLogout, style: "destructive" },
          ]}
        />
        <Popup
          isVisible={isClearHistoryPopupVisible}
          onClose={() => setClearHistoryPopupVisible(false)}
          iconName="trash-outline"
          message="This will permanently delete all workout history. This cannot be undone."
          buttons={[
            { text: "Cancel", onPress: () => setClearHistoryPopupVisible(false) },
            { text: "Clear History", onPress: confirmClearHistory, style: "destructive" },
          ]}
        />
        <Popup
          isVisible={isCancelInProgressPopupVisible}
          onClose={() => setCancelInProgressPopupVisible(false)}
          iconName="warning-outline"
          message="This will mark all in-progress workouts as cancelled."
          buttons={[
            { text: "Cancel", onPress: () => setCancelInProgressPopupVisible(false) },
            { text: "Cancel Workouts", onPress: confirmCancelInProgress, style: "destructive" },
          ]}
        />
      <LoadingOverlay isVisible={loggingOut} />
    </SafeAreaView>
  );
}
