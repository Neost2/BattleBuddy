import AsyncStorage from '@react-native-async-storage/async-storage'
import { getSettings, updateSettings } from '../services/settings'

const KEY = 'battlebuddy.settings.v1'

beforeEach(() => {
	;(AsyncStorage as any).__reset()
})

describe('settings', () => {
	test('defaults are privacy-off (opt-in)', async () => {
		expect(await getSettings()).toEqual({
			biometricEnabled: false,
			hidePreviews: false,
		})
	})

	test('updates and persists a partial patch, merging with existing', async () => {
		const next = await updateSettings({ biometricEnabled: true })
		expect(next).toEqual({ biometricEnabled: true, hidePreviews: false })
		expect(await getSettings()).toEqual({
			biometricEnabled: true,
			hidePreviews: false,
		})
		await updateSettings({ hidePreviews: true })
		expect(await getSettings()).toEqual({
			biometricEnabled: true,
			hidePreviews: true,
		})
	})

	test('recovers from corrupt storage by returning defaults', async () => {
		await AsyncStorage.setItem(KEY, 'not json{')
		expect(await getSettings()).toEqual({
			biometricEnabled: false,
			hidePreviews: false,
		})
	})
})
