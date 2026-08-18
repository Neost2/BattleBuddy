import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = 'wellness:consent-log:v1'

export type ConsentType =
  | 'VA_SYNC'
  | 'WELLNESS_DATA_SHARE'
  | 'TRIP_ASSISTANCE'
  | 'ORGANIZATION_REPORTING'

export type ConsentLogEntry = {
  id: string
  consentType: ConsentType
  granted: boolean
  version: string
  source: string
  createdAt: string
}

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`
}

export async function addConsentLog(
  consentType: ConsentType,
  granted: boolean,
  source = 'mobile'
) {
  const existing = await getConsentLogs()

  const entry: ConsentLogEntry = {
    id: id(),
    consentType,
    granted,
    version: '1.0',
    source,
    createdAt: new Date().toISOString(),
  }

  await AsyncStorage.setItem(KEY, JSON.stringify([entry, ...existing]))
  return entry
}

export async function getConsentLogs(): Promise<ConsentLogEntry[]> {
  const raw = await AsyncStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : []
}
