/** In-memory mock of @react-native-async-storage/async-storage for tests. */
let store: Record<string, string> = {}

const AsyncStorage = {
	getItem: async (k: string): Promise<string | null> =>
		Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null,
	setItem: async (k: string, v: string): Promise<void> => {
		store[k] = v
	},
	removeItem: async (k: string): Promise<void> => {
		delete store[k]
	},
	multiRemove: async (keys: string[]): Promise<void> => {
		keys.forEach((k) => delete store[k])
	},
	getAllKeys: async (): Promise<string[]> => Object.keys(store),
	clear: async (): Promise<void> => {
		store = {}
	},
	__reset: (): void => {
		store = {}
	},
	__dump: (): Record<string, string> => ({ ...store }),
}

export default AsyncStorage
