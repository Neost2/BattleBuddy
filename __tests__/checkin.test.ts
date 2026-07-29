import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { resetKeyCache } from '../services/encryption'
import {
	MOODS,
	getCheckIns,
	getTodayCheckIn,
	addCheckIn,
	exportCheckIns,
	importCheckIns,
	clearAll,
} from '../services/checkin'

const KEY = 'battlebuddy.checkin.v1'

beforeEach(() => {
	;(AsyncStorage as any).__reset()
	;(SecureStore as any).__reset()
	resetKeyCache()
})

describe('mood scale', () => {
	test('has five moods from Struggling to Strong', () => {
		expect(MOODS.map((m) => m.value)).toEqual([1, 2, 3, 4, 5])
		expect(MOODS[0].label).toBe('Struggling')
		expect(MOODS[4].label).toBe('Strong')
	})
})

describe('check-ins', () => {
	test('adds and reads back a check-in with a decrypted note', async () => {
		await addCheckIn(4, 'Good', 'Felt steady today.')
		const today = await getTodayCheckIn()
		expect(today).not.toBeNull()
		expect(today!.mood).toBe(4)
		expect(today!.moodLabel).toBe('Good')
		expect(today!.note).toBe('Felt steady today.')
	})

	test('encrypts the note at rest', async () => {
		await addCheckIn(3, 'Okay', 'a sensitive private note')
		const raw = await AsyncStorage.getItem(KEY)
		expect(raw).toBeTruthy()
		expect(raw).not.toContain('sensitive private note')
		expect(raw).toContain('enc:v1:')
	})

	test('keeps only one check-in per day (latest wins)', async () => {
		await addCheckIn(1, 'Struggling', 'first')
		await addCheckIn(5, 'Strong', 'second')
		const all = await getCheckIns()
		expect(all.length).toBe(1)
		expect(all[0].mood).toBe(5)
		expect(all[0].note).toBe('second')
	})

	test('exports decrypted and re-imports (re-encrypting at rest)', async () => {
		await addCheckIn(2, 'Low', 'export me')
		const exported = await exportCheckIns()
		expect(exported[0].note).toBe('export me')
		await clearAll()
		expect(await getCheckIns()).toEqual([])
		await importCheckIns(exported)
		expect(await AsyncStorage.getItem(KEY)).toContain('enc:v1:')
		const restored = await getCheckIns()
		expect(restored[0].note).toBe('export me')
		expect(restored[0].mood).toBe(2)
	})

	test('clearAll empties storage', async () => {
		await addCheckIn(3, 'Okay', 'x')
		await clearAll()
		expect(await getTodayCheckIn()).toBeNull()
	})
})
