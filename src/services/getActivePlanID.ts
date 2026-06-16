import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { getActivePlanIdForUser } from "@/src/lib/dao/preferences";

export function getActivePlanID() {
  const { userId } = useAuth()
  return getActivePlanIdForUser(userId!)
}