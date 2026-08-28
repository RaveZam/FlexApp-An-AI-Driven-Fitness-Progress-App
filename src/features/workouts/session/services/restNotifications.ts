import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Android delivers the buzz through the channel, not the notification, so the
// pattern lives here as [wait, vibrate, ...] and is fixed once at channel setup.
const CHANNEL_ID = "rest-timer";
const CHANNEL_VIBRATION = [0, 500, 150, 500, 150, 500];

// Marks our own notification so the foreground handler can silence it without
// silencing anything else the app might schedule later.
const REST_DONE_KIND = "rest-done";

let scheduledId: string | null = null;
let setupOnce: Promise<boolean> | null = null;

// While the app is in the foreground the rest modal is on screen and vibrates
// on its own, so the OS copy would be a duplicate. Anything else passes through.
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isRestDone =
      notification.request.content.data?.kind === REST_DONE_KIND;
    return {
      shouldShowBanner: !isRestDone,
      shouldShowList: !isRestDone,
      shouldPlaySound: !isRestDone,
      shouldSetBadge: false,
    };
  },
});

// Creates the Android channel and asks for permission, once per app run.
// Resolves to whether the OS is actually willing to alert the user.
function setup(): Promise<boolean> {
  setupOnce ??= (async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "Rest timer",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: CHANNEL_VIBRATION,
        sound: "default",
        enableVibrate: true,
      });
    }

    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;

    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  })().catch((e) => {
    console.warn("rest notification setup failed", e);
    return false;
  });

  return setupOnce;
}

// Hands the end of the rest interval to the OS as a local notification, so the
// user is alerted even though JS timers are suspended in the background.
// `endsAt` is an absolute epoch ms timestamp — the same one the on-screen ring
// counts down to. Only one rest alert is ever pending; scheduling replaces it.
//
// Returns true when the OS will fire the alert. A false means notifications are
// unavailable or denied, and the caller still owes the user an in-app buzz when
// the app comes back to the foreground.
export async function scheduleRestDoneAlert(endsAt: number): Promise<boolean> {
  if (Platform.OS === "web" || endsAt <= Date.now()) return false;

  await cancelRestDoneAlert();

  const allowed = await setup();
  if (!allowed) return false;

  try {
    scheduledId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rest over",
        body: "Time for your next set.",
        sound: "default",
        vibrate: CHANNEL_VIBRATION,
        interruptionLevel: "timeSensitive",
        data: { kind: REST_DONE_KIND },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: endsAt,
        channelId: CHANNEL_ID,
      },
    });
    return true;
  } catch (e) {
    console.warn("scheduleRestDoneAlert failed", e);
    return false;
  }
}

// Drops the pending rest alert and clears one that already landed in the tray,
// so skipping or leaving rest never leaves a stale "Rest over" behind.
export async function cancelRestDoneAlert(): Promise<void> {
  const id = scheduledId;
  if (!id) return;
  scheduledId = null;

  try {
    await Notifications.cancelScheduledNotificationAsync(id);
    await Notifications.dismissNotificationAsync(id);
  } catch (e) {
    console.warn("cancelRestDoneAlert failed", e);
  }
}
