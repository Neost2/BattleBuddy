import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('wellness-reminders', {
      name: 'Wellness reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }

  const existing = await Notifications.getPermissionsAsync()
  if (existing.status === 'granted') return true
  const requested = await Notifications.requestPermissionsAsync()
  return requested.status === 'granted'
}

export async function scheduleOneTimeReminder(
  title: string,
  body: string,
  when: Date,
  url = '/reminders',
): Promise<string | null> {
  if (Platform.OS === 'web') return null
  const allowed = await ensureNotificationPermission()
  if (!allowed) return null

  return Notifications.scheduleNotificationAsync({
    content: { title, body, data: { url } },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
      channelId: Platform.OS === 'android' ? 'wellness-reminders' : undefined,
    },
  })
}

export async function scheduleDailyReminder(
  title: string,
  body: string,
  hour: number,
  minute: number,
  url = '/reminders',
): Promise<string | null> {
  if (Platform.OS === 'web') return null
  const allowed = await ensureNotificationPermission()
  if (!allowed) return null

  return Notifications.scheduleNotificationAsync({
    content: { title, body, data: { url } },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: Platform.OS === 'android' ? 'wellness-reminders' : undefined,
    },
  })
}

export async function cancelReminder(notificationId?: string | null) {
  if (!notificationId || Platform.OS === 'web') return
  await Notifications.cancelScheduledNotificationAsync(notificationId)
}
