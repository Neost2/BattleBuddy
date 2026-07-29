import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { resetKeyCache } from '../services/encryption'
import {
	buildBackup,
	serializeBackup,
	parseBackup,
	restoreBackup,
} from '../services/backup'
import { addEntry, getEntries, clearAll as clearJournal } from '../services/journal'
import {
	addCheckIn,
	getCheckIns,
	clearAll as clearCheckins,
} from '../services/checkin'
import {
	getTodayTasks,
	toggleTask,
	exportStore,
	clearAll as clearMission,
} from '../services/mission'

beforeEach(() => {
	;(AsyncStorage as any).__reset()
	;(SecureStore as any).__reset()
	resetKeyCache()
})

async function seed() {
	await addEntry('a journal entry')
	await addCheckIn(4, 'Good', 'a check-in note')
	const tasks = await getTodayTasks()
	await toggleTask(tasks[0].id)
}

describe('backup build + serialize', () => {
	test('buildBackup collects decrypted data', async () => {
		await seed()
		const bundle = await buildBackup()
		expect(bundle.app).toBe('battlebuddy')
		expect(bundle.version).toBe(1)
		expect(typeof bundle.exportedAt).toBe('string')
		expect(bundle.journal[0].body).toBe('a journal entry')
		expect(bundle.checkins[0].note).toBe('a check-in note')
		expect(Object.keys(bundle.mission).length).toBe(1)
	})

	test('serialize without a passphrase is plain JSON', async () => {
		await seed()
		const obj = JSON.parse(serializeBackup(await buildBackup()))
		expect(obj.app).toBe('battlebuddy')
		expect(obj.encrypted).toBeUndefined()
	})

	test('serialize with a passphrase encrypts the whole bundle', async () => {
		await seed()
		const text = serializeBackup(await buildBackup(), 'hunter2')
		const obj = JSON.parse(text)
		expect(obj.encrypted).toBe(true)
		expect(typeof obj.payload).toBe('string')
		expect(text).not.toContain('a journal entry')
		expect(text).not.toContain('a check-in note')
	})
})

describe('backup parse', () => {
	test('round-trips without a passphrase', async () => {
		await seed()
		const parsed = parseBackup(serializeBackup(await buildBackup()))
		expect(parsed.journal[0].body).toBe('a journal entry')
	})

	test('round-trips with the correct passphrase', async () => {
		await seed()
		const text = serializeBackup(await buildBackup(), 's3cret')
		expect(parseBackup(text, 's3cret').checkins[0].note).toBe('a check-in note')
	})

	test('throws when an encrypted backup is opened without a passphrase', async () => {
		await seed()
		const text = serializeBackup(await buildBackup(), 'pw')
		expect(() => parseBackup(text)).toThrow(/encrypted/i)
	})

	test('throws on a wrong passphrase', async () => {
		await seed()
		const text = serializeBackup(await buildBackup(), 'right')
		expect(() => parseBackup(text, 'wrong')).toThrow()
	})

	test('throws on invalid JSON', () => {
		expect(() => parseBackup('not json at all')).toThrow(/backup/i)
	})

	test('throws on a foreign JSON object', () => {
		expect(() => parseBackup(JSON.stringify({ app: 'somethingelse' }))).toThrow(
			/Battle Buddy backup/i,
		)
	})
})

describe('end-to-end backup + restore', () => {
	test('export encrypted, wipe, then restore recovers everything', async () => {
		await seed()
		const text = serializeBackup(await buildBackup(), 'passphrase!')
		await clearJournal()
		await clearCheckins()
		await clearMission()
		expect(await getEntries()).toEqual([])
		expect(await getCheckIns()).toEqual([])
		const parsed = parseBackup(text, 'passphrase!')
		await restoreBackup(parsed)
		expect((await getEntries())[0].body).toBe('a journal entry')
		expect((await getCheckIns())[0].note).toBe('a check-in note')
		expect(Object.keys(await exportStore()).length).toBe(1)
	})
})
