/**
 * Journal service. Local-first (AsyncStorage) so it works offline immediately.
 * Entry bodies are encrypted at rest via the encryption service.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { JournalEntry } from '../types'
import { uid, todayKey } from '../utils/id'
import { encrypt, decrypt } from './encryption'

const KEY = 'battlebuddy.journal.v1'

async function readRaw(): Promise<JournalEntry[]> {
	const raw = await AsyncStorage.getItem(KEY)
	if (!raw) return []
	try {
		return JSON.parse(raw) as JournalEntry[]
	} catch {
		return []
	}
}

export async function getEntries(): Promise<JournalEntry[]> {
	const arr = await readRaw()
	const decrypted = await Promise.all(
		arr.map(async (e) => ({ ...e, body: await decrypt(e.body) })),
	)
	return decrypted.sort((a, b) => b.createdAt - a.createdAt)
}

export async function addEntry(body: string): Promise<JournalEntry> {
	const arr = await readRaw()
	const now = Date.now()
	const stored: JournalEntry = {
		id: uid(),
		date: todayKey(),
		body: await encrypt(body),
		createdAt: now,
		updatedAt: now,
	}
	arr.unshift(stored)
	await AsyncStorage.setItem(KEY, JSON.stringify(arr))
	return { ...stored, body }
}

export async function deleteEntry(id: string): Promise<void> {
	const arr = await readRaw()
	await AsyncStorage.setItem(KEY, JSON.stringify(arr.filter((e) => e.id !== id)))
}

/** Decrypted export for backups. */
export async function exportEntries(): Promise<JournalEntry[]> {
	return getEntries()
}

/** Restore from a backup (re-encrypts bodies at rest). */
export async function importEntries(entries: JournalEntry[]): Promise<void> {
	const stored = await Promise.all(
		entries.map(async (e) => ({ ...e, body: await encrypt(e.body) })),
	)
	await AsyncStorage.setItem(KEY, JSON.stringify(stored))
}

export async function clearAll(): Promise<void> {
	await AsyncStorage.removeItem(KEY)
}
