import RestActivity from "@/modules/rest-activity";
import { Platform } from "react-native";

// iOS-only Live Activity for the rest timer. No-op everywhere else.
export function startRestActivity(endsAt: number) {
  if (Platform.OS !== "ios" || !RestActivity) return;
  try {
    RestActivity.start(endsAt, "Resting");
  } catch (e) {
    console.warn("startRestActivity failed", e);
  }
}

export function endRestActivity() {
  if (Platform.OS !== "ios" || !RestActivity) return;
  try {
    RestActivity.end();
  } catch (e) {
    console.warn("endRestActivity failed", e);
  }
}
