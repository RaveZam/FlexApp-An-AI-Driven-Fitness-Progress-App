import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { deleteAllSessionsForUser } from "@/src/features/workouts/services/sessionLocalService";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Popup from "@/components/ui/Popup";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { signOut, session, user } = useAuth();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLogoutPopupVisible, setLogoutPopupVisible] = useState(false);
  const [isClearHistoryPopupVisible, setClearHistoryPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    } else if (user) {
      setUserEmail(user.email || "");
      setUserName(
        user.user_metadata?.username || user.email?.split("@")[0] || ""
      );
    }
  }, [session, user]);

  const handleLogout = () => {
    setLogoutPopupVisible(true);
  };

  const confirmClearHistory = () => {
    if (user) {
      deleteAllSessionsForUser(user.id);
    }
    setClearHistoryPopupVisible(false);
  };

  const confirmLogout = async () => {
    setLoading(true);
    const { error } = await signOut();
    setLoading(false);
    if (error) {
      Alert.alert("Logout Failed", error.message);
    } else {
      router.replace("/login");
    }
    setLogoutPopupVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f0f0f]">
      <View className="flex-1 bg-[#0f0f0f] px-5 pt-10">
        <Text className="text-white text-2xl font-bold mb-6">Settings</Text>

        <View className="mb-8 bg-[#191919] p-6 rounded-xl border border-[#1a472a]/20">
          <View className="flex-row items-center mb-4">
            <Image
              style={{ width: 60, height: 60 }}
              source={{
                uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              }}
              className="w-15 h-15 rounded-full"
            />
            <View className="ml-4 flex-1">
              <Text className="text-white text-lg font-semibold">
                {userName}
              </Text>
              <Text className="text-gray-400 text-sm">{userEmail}</Text>
            </View>
            <TouchableOpacity className="bg-[#1a472a]/80 p-2 rounded-full border border-[#10b981]/30">
              <Text className="text-[#10b981] text-xs font-semibold">Edit</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-400 text-xs uppercase mb-1">
                Member Since
              </Text>
              <Text className="text-white text-sm">January 2024</Text>
            </View>
            <View>
              <Text className="text-gray-400 text-xs uppercase mb-1">Plan</Text>
              <Text className="text-[#10b981] text-sm font-semibold">
                Premium
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-400 uppercase text-xs mb-2">Account</Text>
          <TouchableOpacity className="bg-[#191919]/60 p-4 rounded-xl mb-3 border border-[#1a472a]/30 backdrop-blur-sm">
            <Text className="text-white text-base">Change Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#191919]/60 p-4 rounded-xl border border-red-500/30 backdrop-blur-sm"
            onPress={handleLogout}
          >
            <Text className="text-red-400 text-base font-semibold">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-gray-400 uppercase text-xs mb-2">
            Preferences
          </Text>
          <View className="bg-[#191919]/60 p-4 rounded-xl mb-3 flex-row justify-between items-center border border-[#1a472a]/30 backdrop-blur-sm">
            <Text className="text-white">Notifications</Text>
            <Switch
              trackColor={{ false: "#374151", true: "#10b981" }}
              thumbColor={true ? "#ffffff" : "#9ca3af"}
            />
          </View>
          <View className="bg-[#191919]/60 p-4 rounded-xl flex-row justify-between items-center border border-[#1a472a]/30 backdrop-blur-sm">
            <Text className="text-white">Dark Mode</Text>
            <Switch
              value={true}
              trackColor={{ false: "#374151", true: "#10b981" }}
              thumbColor={true ? "#ffffff" : "#9ca3af"}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-400 uppercase text-xs mb-2">Data</Text>
          <TouchableOpacity
            className="bg-[#191919]/60 p-4 rounded-xl border border-red-500/30 backdrop-blur-sm"
            onPress={() => setClearHistoryPopupVisible(true)}
          >
            <Text className="text-red-400 text-base font-semibold">Clear History</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-gray-400 uppercase text-xs mb-2">App</Text>
          <TouchableOpacity className="bg-[#191919}/60 p-4 rounded-xl mb-3 border border-[#1a472a]/30 backdrop-blur-sm">
            <Text className="text-white">About</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#191919]/60 p-4 rounded-xl border border-[#1a472a]/30 backdrop-blur-sm">
            <Text className="text-white">Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View className="mt-auto pb-6">
          <Text className="text-gray-500 text-center text-xs">
            Version 1.0.0
          </Text>
        </View>

        <Popup
          isVisible={isLogoutPopupVisible}
          onClose={() => setLogoutPopupVisible(false)}
          iconName="questioncircleo"
          message="Are you sure you want to log out?"
          buttons={[
            { text: "Cancel", onPress: () => setLogoutPopupVisible(false) },
            { text: "Log Out", onPress: confirmLogout, style: "destructive" },
          ]}
        />
        <Popup
          isVisible={isClearHistoryPopupVisible}
          onClose={() => setClearHistoryPopupVisible(false)}
          iconName="exclamationcircleo"
          message="This will permanently delete all workout history. This cannot be undone."
          buttons={[
            { text: "Cancel", onPress: () => setClearHistoryPopupVisible(false) },
            { text: "Clear History", onPress: confirmClearHistory, style: "destructive" },
          ]}
        />
        <LoadingOverlay isVisible={loading} />
      </View>
    </SafeAreaView>
  );
}
