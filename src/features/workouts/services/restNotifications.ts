import * as Notifications from "expo-notifications";

// While the app is foregrounded the in-app timer handles the alert, so suppress
// the notification's own banner/sound to avoid a double alert. This handler only
// affects foreground presentation — when the app is closed/backgrounded the OS
// still delivers the scheduled notification with sound + haptic.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

let scheduledId: string | null = null;

export async function scheduleRestEndNotification(endsAt: number) {
  if (endsAt - Date.now() <= 0) return;

  const { granted } = await Notifications.getPermissionsAsync();
  if (!granted) {
    const requested = await Notifications.requestPermissionsAsync();
    if (!requested.granted) return;
  }

  await cancelRestEndNotification();
  scheduledId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Rest's up! 💪",
      body: "Time for your next set.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(endsAt),
    },
  });
}

export async function cancelRestEndNotification() {
  if (!scheduledId) return;
  await Notifications.cancelScheduledNotificationAsync(scheduledId);
  scheduledId = null;
}
