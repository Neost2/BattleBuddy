/**
 * Mission Log service. Tracks a daily checklist, stored locally per day.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { MissionTask } from '../types'
import { uid, todayKey } from '../utils/id'

const KEY = 'battlebuddy.mission.v1'
const DEFAULT_LABELS = [
	'Walked',
	'Ate Breakfast',
	'Exercise',
	'Sleep 8 Hours',
	'Daily Check-In',
]

type Store = Record<string, MissionTask[]>

async function readStore(): Promise<Store> {
	const raw = await AsyncStorage.getItem(KEY)
	if (!raw) return {}
	try {
		return JSON.parse(raw) as Store
	} catch {
		return {}
	}
}

async function writeStore(store: Store): Promise<void> {
	await AsyncStorage.setItem(KEY, JSON.stringify(store))
}

export async function getTodayTasks(): Promise<MissionTask[]> {
	const store = await readStore()
	const date = todayKey()
	if (!store[date]) {
		store[date] = DEFAULT_LABELS.map((label) => ({
			id: uid(),
			label,
			done: false,
			date,
		}))
		await writeStore(store)
	}
	return store[date]
}

export async function toggleTask(id: string): Promise<MissionTask[]> {
	const store = await readStore()
	const date = todayKey()
	const list = store[date] ?? []
	store[date] = list.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
	await writeStore(store)
	return store[date]
}

/** Full per-day store, for backups. */
export async function exportStore(): Promise<Store> {
	return readStore()
}

/** Restore the per-day store from a backup. */
export async function importStore(store: Store): Promise<void> {
	await writeStore(store)
}

export async function clearAll(): Promise<void> {
	await AsyncStorage.removeItem(KEY)
}
