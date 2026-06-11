import { useAuth } from "@/src/features/auth";
import { cancelAllInProgressForUser, deleteAllSessionsForUser } from "@/src/features/workouts";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useSettings() {
  const { signOut, session, user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [session]);

  const userEmail = user?.email ?? "";
  const userName = user?.user_metadata?.username || user?.email?.split("@")[0] || "";
  const avatarUri = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;

  const clearHistory = () => {
    if (user) deleteAllSessionsForUser(user.id);
  };

  const cancelInProgress = () => {
    if (user) cancelAllInProgressForUser(user.id);
  };

  const logout = async () => {
    setLoggingOut(true);
    const { error } = await signOut();
    setLoggingOut(false);
    if (error) {
      Alert.alert("Logout Failed", error.message);
    } else {
      router.replace("/login");
    }
  };

  return { userName, userEmail, avatarUri, loggingOut, clearHistory, cancelInProgress, logout };
}
