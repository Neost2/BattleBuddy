import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { panicWipe } from '../services/panic'
import { addEntry, getEntries } from '../services/journal'
import { addCheckIn, getCheckIns } from '../services/checkin'
import { getTodayTasks, exportStore } from '../services/mission'
import { updateSettings, getSettings } from '../services/settings'
import { encrypt, decrypt, resetKeyCache } from '../services/encryption'

const ENC_KEY_ID = 'battlebuddy.enckey.v1'
const DATA_KEYS = [
	'battlebuddy.journal.v1',
	'battlebuddy.mission.v1',
	'battlebuddy.checkin.v1',
	'battlebuddy.chat.v1',
	'battlebuddy.settings.v1',
]

beforeEach(() => {
	;(AsyncStorage as any).__reset()
	;(SecureStore as any).__reset()
	resetKeyCache()
})

describe('panic delete', () => {
	test('erases every data key and the encryption key', async () => {
		await addEntry('secret entry')
		await addCheckIn(3, 'Okay', 'note')
		await getTodayTasks()
		await updateSettings({ biometricEnabled: true })
		await AsyncStorage.setItem('battlebuddy.chat.v1', '[]')
		expect(await SecureStore.getItemAsync(ENC_KEY_ID)).toMatch(/^[0-9a-f]{64}$/)

		await panicWipe()

		for (const k of DATA_KEYS) {
			expect(await AsyncStorage.getItem(k)).toBeNull()
		}
		expect(await SecureStore.getItemAsync(ENC_KEY_ID)).toBeNull()
		expect(await getEntries()).toEqual([])
		expect(await getCheckIns()).toEqual([])
		expect(await exportStore()).toEqual({})
		expect(await getSettings()).toEqual({
			biometricEnabled: false,
			hidePreviews: false,
		})
	})

	test('rotates the key so old ciphertext is unrecoverable afterward', async () => {
		const oldCipher = await encrypt('old data')
		await panicWipe()
		await encrypt('new data') // generates a fresh key
		const newKey = await SecureStore.getItemAsync(ENC_KEY_ID)
		expect(newKey).toMatch(/^[0-9a-f]{64}$/)
		expect(await decrypt(oldCipher)).not.toBe('old data')
	})
})
