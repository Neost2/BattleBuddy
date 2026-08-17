import AsyncStorage from '@react-native-async-storage/async-storage'
import { cancelReminder, scheduleDailyReminder, scheduleOneTimeReminder } from './notifications'

const KEY = 'wellness:reminders:v1'

export type ReminderType = 'medication' | 'appointment' | 'wellness'

export type WellnessReminder = {
  id: string
  type: ReminderType
  title: string
  details: string
  timeISO?: string
  hour?: number
  minute?: number
  daily: boolean
  enabled: boolean
  notificationId?: string | null
  createdAt: string
}

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export async function getReminders(): Promise<WellnessReminder[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

async function save(items: WellnessReminder[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items))
}

export async function addReminder(input: Omit<WellnessReminder, 'id'|'createdAt'|'enabled'|'notificationId'>) {
  const items = await getReminders()
  const reminder: WellnessReminder = {
    ...input,
    id: makeId(),
    createdAt: new Date().toISOString(),
    enabled: true,
    notificationId: null,
  }

  if (reminder.daily && reminder.hour != null && reminder.minute != null) {
    reminder.notificationId = await scheduleDailyReminder(
      reminder.title,
      reminder.details || 'Wellness Companion reminder',
      reminder.hour,
      reminder.minute,
    )
  } else if (reminder.timeISO) {
    const when = new Date(reminder.timeISO)
    if (when.getTime() > Date.now()) {
      reminder.notificationId = await scheduleOneTimeReminder(
        reminder.title,
        reminder.details || 'Wellness Companion reminder',
        when,
      )
    }
  }

  await save([reminder, ...items])
  return reminder
}

export async function removeReminder(id: string) {
  const items = await getReminders()
  const item = items.find(x => x.id === id)
  await cancelReminder(item?.notificationId)
  await save(items.filter(x => x.id !== id))
}

export async function toggleReminder(id: string) {
  const items = await getReminders()
  const next = await Promise.all(items.map(async item => {
    if (item.id !== id) return item

    if (item.enabled) {
      await cancelReminder(item.notificationId)
      return { ...item, enabled: false, notificationId: null }
    }

    let notificationId: string | null = null
    if (item.daily && item.hour != null && item.minute != null) {
      notificationId = await scheduleDailyReminder(item.title, item.details, item.hour, item.minute)
    } else if (item.timeISO && new Date(item.timeISO).getTime() > Date.now()) {
      notificationId = await scheduleOneTimeReminder(item.title, item.details, new Date(item.timeISO))
    }

    return { ...item, enabled: true, notificationId }
  }))

  await save(next)
}
