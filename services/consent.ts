import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = 'wellness:consent:v1'

export type ConsentSettings = {
  syncWellnessCheckIns: boolean
  syncGoals: boolean
  shareWellnessTrends: boolean
  shareGoalProgress: boolean
  sharePrivateNotes: boolean
}

export const DEFAULT_CONSENT: ConsentSettings = {
  syncWellnessCheckIns: false,
  syncGoals: false,
  shareWellnessTrends: false,
  shareGoalProgress: false,
  sharePrivateNotes: false,
}

export async function getConsent(): Promise<ConsentSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    return raw ? { ...DEFAULT_CONSENT, ...JSON.parse(raw) } : DEFAULT_CONSENT
  } catch {
    return DEFAULT_CONSENT
  }
}

export async function saveConsent(settings: ConsentSettings) {
  await AsyncStorage.setItem(KEY, JSON.stringify(settings))
}
