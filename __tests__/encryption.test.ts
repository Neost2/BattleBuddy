import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import {
	ENCRYPTION_ENABLED,
	encrypt,
	decrypt,
	resetKeyCache,
} from '../services/encryption'

const ENC_KEY_ID = 'battlebuddy.enckey.v1'

beforeEach(() => {
	;(AsyncStorage as any).__reset()
	;(SecureStore as any).__reset()
	resetKeyCache()
})

describe('encryption service', () => {
	test('encryption is enabled', () => {
		expect(ENCRYPTION_ENABLED).toBe(true)
	})

	test('round-trips plaintext and does not leak it', async () => {
		const secret = 'My private journal entry about a hard day.'
		const enc = await encrypt(secret)
		expect(enc).not.toBe(secret)
		expect(enc.startsWith('enc:v1:')).toBe(true)
		expect(enc).not.toContain('private journal')
		expect(await decrypt(enc)).toBe(secret)
	})

	test('handles empty, unicode, and long strings', async () => {
		for (const v of ['', 'a', 'niño 日本語 🌙 émoji', 'x'.repeat(5000)]) {
			expect(await decrypt(await encrypt(v))).toBe(v)
		}
	})

	test('stores a 256-bit (64 hex char) key in the keychain', async () => {
		await encrypt('anything')
		const key = await SecureStore.getItemAsync(ENC_KEY_ID)
		expect(key).toMatch(/^[0-9a-f]{64}$/)
	})

	test('reuses the same key across calls', async () => {
		await encrypt('one')
		const k1 = await SecureStore.getItemAsync(ENC_KEY_ID)
		await encrypt('two')
		const k2 = await SecureStore.getItemAsync(ENC_KEY_ID)
		expect(k1).toBe(k2)
	})

	test('decrypts correctly after the in-memory cache is cleared', async () => {
		const enc = await encrypt('survives a cache reset')
		resetKeyCache()
		expect(await decrypt(enc)).toBe('survives a cache reset')
	})

	test('passes through legacy plaintext with no prefix', async () => {
		expect(await decrypt('legacy plaintext value')).toBe('legacy plaintext value')
	})

	test('returns empty string for corrupt ciphertext', async () => {
		await encrypt('seed a key')
		expect(await decrypt('enc:v1:not-real-ciphertext')).toBe('')
	})

	test('falls back to AsyncStorage when the keychain is unavailable', async () => {
		;(SecureStore as any).__setFail(true)
		const enc = await encrypt('fallback works')
		expect(await decrypt(enc)).toBe('fallback works')
		expect(await AsyncStorage.getItem(ENC_KEY_ID)).toMatch(/^[0-9a-f]{64}$/)
	})
})
