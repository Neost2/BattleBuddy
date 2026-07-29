import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { resetKeyCache } from '../services/encryption'
import {
	getEntries,
	addEntry,
	deleteEntry,
	exportEntries,
	importEntries,
	clearAll,
} from '../services/journal'

const KEY = 'battlebuddy.journal.v1'

beforeEach(() => {
	;(AsyncStorage as any).__reset()
	;(SecureStore as any).__reset()
	resetKeyCache()
})

describe('journal', () => {
	test('adds and reads decrypted, encrypting at rest', async () => {
		const e = await addEntry('Dear journal, today was hard.')
		expect(e.body).toBe('Dear journal, today was hard.')
		const raw = await AsyncStorage.getItem(KEY)
		expect(raw).not.toContain('Dear journal')
		expect(raw).toContain('enc:v1:')
		const list = await getEntries()
		expect(list[0].body).toBe('Dear journal, today was hard.')
	})

	test('orders newest first', async () => {
		await addEntry('first')
		await addEntry('second')
		const list = await getEntries()
		expect(list.map((e) => e.body)).toEqual(['second', 'first'])
	})

	test('deletes by id', async () => {
		await addEntry('keep')
		const remove = await addEntry('remove')
		await deleteEntry(remove.id)
		const list = await getEntries()
		expect(list.map((e) => e.body)).toEqual(['keep'])
	})

	test('export/import round trip', async () => {
		await addEntry('backup body')
		const ex = await exportEntries()
		await clearAll()
		expect(await getEntries()).toEqual([])
		await importEntries(ex)
		expect((await getEntries())[0].body).toBe('backup body')
	})
})
