/**
 * Panic Delete: immediately and permanently erase every local record and the
 * encryption key. There is no recovery. Used by the Privacy & Security screen.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { resetKeyCache } from './encryption'

const DATA_KEYS = [
	'battlebuddy.journal.v1',
	'battlebuddy.mission.v1',
	'battlebuddy.checkin.v1',
	'battlebuddy.chat.v1',
	'battlebuddy.settings.v1',
]
const ENC_KEY_ID = 'battlebuddy.enckey.v1'

export async function panicWipe(): Promise<void> {
	await AsyncStorage.multiRemove(DATA_KEYS)
	try {
		await SecureStore.deleteItemAsync(ENC_KEY_ID)
	} catch {
		await AsyncStorage.removeItem(ENC_KEY_ID)
	}
	// Forget the in-memory key so a fresh one is generated for any new data.
	resetKeyCache()
}
