/** Persisted app/privacy settings. */
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface AppSettings {
	biometricEnabled: boolean
	hidePreviews: boolean
}

const KEY = 'battlebuddy.settings.v1'
const DEFAULTS: AppSettings = {
	biometricEnabled: false,
	hidePreviews: false,
}

export async function getSettings(): Promise<AppSettings> {
	const raw = await AsyncStorage.getItem(KEY)
	if (!raw) return { ...DEFAULTS }
	try {
		return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AppSettings>) }
	} catch {
		return { ...DEFAULTS }
	}
}

export async function updateSettings(
	patch: Partial<AppSettings>,
): Promise<AppSettings> {
	const current = await getSettings()
	const next = { ...current, ...patch }
	await AsyncStorage.setItem(KEY, JSON.stringify(next))
	return next
}
