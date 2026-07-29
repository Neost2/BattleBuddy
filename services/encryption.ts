/**
 * Client-side encryption for data stored on the device.
 *
 * A random 256-bit key is generated once and kept in the device keychain
 * (expo-secure-store). Journal entries, chat history, and check-in notes are
 * encrypted with AES before they are written to local storage.
 *
 * Values are tagged with a version prefix so legacy plaintext (written before
 * encryption was enabled) is still readable and is transparently upgraded the
 * next time it is saved.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto'
import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'

export const ENCRYPTION_ENABLED = true

const KEY_ID = 'battlebuddy.enckey.v1'
const PREFIX = 'enc:v1:'
let cachedKey: string | null = null

async function loadStoredKey(): Promise<string | null> {
	try {
		return await SecureStore.getItemAsync(KEY_ID)
	} catch {
		// SecureStore is unavailable (e.g. web) — fall back to AsyncStorage.
		return AsyncStorage.getItem(KEY_ID)
	}
}

async function storeKey(key: string): Promise<void> {
	try {
		await SecureStore.setItemAsync(KEY_ID, key)
	} catch {
		await AsyncStorage.setItem(KEY_ID, key)
	}
}

async function getKey(): Promise<string> {
	if (cachedKey) return cachedKey
	let key = await loadStoredKey()
	if (!key) {
		const bytes = await Crypto.getRandomBytesAsync(32)
		key = Array.from(bytes)
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('')
		await storeKey(key)
	}
	cachedKey = key
	return key
}

/** Forget the in-memory key (used after a Panic Delete). */
export function resetKeyCache(): void {
	cachedKey = null
}

export async function encrypt(plaintext: string): Promise<string> {
	const key = await getKey()
	return PREFIX + AES.encrypt(plaintext, key).toString()
}

export async function decrypt(value: string): Promise<string> {
	if (!value.startsWith(PREFIX)) {
		// Legacy / plaintext value written before encryption was enabled.
		return value
	}
	const key = await getKey()
	try {
		return AES.decrypt(value.slice(PREFIX.length), key).toString(Utf8)
	} catch {
		return ''
	}
}
