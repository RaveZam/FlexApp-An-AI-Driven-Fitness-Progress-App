import { signOut as signOutService } from "@/src/features/auth/services/authService";
import { cancelAllInProgressForUser, deleteAllSessionsForUser } from "@/src/features/workouts";
import {
  getCurrentUserAvatarUrl,
  getCurrentUserEmail,
  getCurrentUserId,
  getCurrentUserName,
} from "@/src/lib/current-user";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export function useSettings() {
  const [loggingOut, setLoggingOut] = useState(false);

  const userId = getCurrentUserId();
  const userEmail = getCurrentUserEmail() ?? "";
  const userName = getCurrentUserName() || userEmail.split("@")[0] || "";
  const avatarUri = getCurrentUserAvatarUrl();

  const clearHistory = () => {
    if (userId) deleteAllSessionsForUser(userId);
  };

  const cancelInProgress = () => {
    if (userId) cancelAllInProgressForUser(userId);
  };

  const logout = async () => {
    setLoggingOut(true);
    const { error } = await signOutService();
    setLoggingOut(false);
    if (error) {
      Alert.alert("Logout Failed", error.message);
    } else {
      router.replace("/login");
    }
  };

  return { userName, userEmail, avatarUri, loggingOut, clearHistory, cancelInProgress, logout };
}
