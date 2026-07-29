import AsyncStorage from '@react-native-async-storage/async-storage'
import {
	getTodayTasks,
	toggleTask,
	exportStore,
	importStore,
	clearAll,
} from '../services/mission'

beforeEach(() => {
	;(AsyncStorage as any).__reset()
})

describe('mission log', () => {
	test('creates five default tasks the first time', async () => {
		const tasks = await getTodayTasks()
		expect(tasks.length).toBe(5)
		expect(tasks.every((t) => t.done === false)).toBe(true)
		expect(tasks.map((t) => t.label)).toContain('Daily Check-In')
	})

	test('is stable across calls (same ids, not regenerated)', async () => {
		const a = await getTodayTasks()
		const b = await getTodayTasks()
		expect(b.map((t) => t.id)).toEqual(a.map((t) => t.id))
	})

	test('toggles a task on and off', async () => {
		const tasks = await getTodayTasks()
		const id = tasks[0].id
		const on = await toggleTask(id)
		expect(on.find((t) => t.id === id)!.done).toBe(true)
		const off = await toggleTask(id)
		expect(off.find((t) => t.id === id)!.done).toBe(false)
	})

	test('export/import store round trip (import replaces)', async () => {
		const tasks = await getTodayTasks()
		await toggleTask(tasks[0].id)
		const store = await exportStore()
		await clearAll()
		expect(await exportStore()).toEqual({})
		await importStore(store)
		expect(await exportStore()).toEqual(store)
	})
})
