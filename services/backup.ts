/**
 * Encrypted export / import.
 *
 * A backup bundle contains your decrypted journal, check-ins, and mission log.
 * When you provide a passphrase, the whole bundle is AES-encrypted with that
 * passphrase so it is safe to store or send. Import reverses the process.
 */
import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'
import type { JournalEntry, MoodCheckIn, MissionTask } from '../types'
import { exportEntries, importEntries } from './journal'
import { exportCheckIns, importCheckIns } from './checkin'
import { exportStore, importStore } from './mission'

export interface BackupBundle {
	app: 'battlebuddy'
	version: 1
	exportedAt: string
	journal: JournalEntry[]
	checkins: MoodCheckIn[]
	mission: Record<string, MissionTask[]>
}

interface EncryptedEnvelope {
	app: 'battlebuddy'
	encrypted: true
	payload: string
}

export async function buildBackup(): Promise<BackupBundle> {
	const [journal, checkins, mission] = await Promise.all([
		exportEntries(),
		exportCheckIns(),
		exportStore(),
	])
	return {
		app: 'battlebuddy',
		version: 1,
		exportedAt: new Date().toISOString(),
		journal,
		checkins,
		mission,
	}
}

export function serializeBackup(bundle: BackupBundle, passphrase?: string): string {
	const json = JSON.stringify(bundle, null, 2)
	if (passphrase && passphrase.length > 0) {
		const envelope: EncryptedEnvelope = {
			app: 'battlebuddy',
			encrypted: true,
			payload: AES.encrypt(json, passphrase).toString(),
		}
		return JSON.stringify(envelope, null, 2)
	}
	return json
}

export function parseBackup(text: string, passphrase?: string): BackupBundle {
	let obj: unknown
	try {
		obj = JSON.parse(text)
	} catch {
		throw new Error('That does not look like a Battle Buddy backup (invalid JSON).')
	}
	const maybe = obj as Partial<EncryptedEnvelope> & Partial<BackupBundle>
	if (maybe && maybe.encrypted) {
		if (!passphrase || passphrase.length === 0) {
			throw new Error('This backup is encrypted. Enter its passphrase to import.')
		}
		const json = AES.decrypt(maybe.payload ?? '', passphrase).toString(Utf8)
		if (!json) {
			throw new Error('Wrong passphrase, or the backup is corrupted.')
		}
		return JSON.parse(json) as BackupBundle
	}
	if (!maybe || maybe.app !== 'battlebuddy') {
		throw new Error('That does not look like a Battle Buddy backup.')
	}
	return obj as BackupBundle
}

export async function restoreBackup(bundle: BackupBundle): Promise<void> {
	await importEntries(bundle.journal ?? [])
	await importCheckIns(bundle.checkins ?? [])
	await importStore(bundle.mission ?? {})
}
