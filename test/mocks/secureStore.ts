/** In-memory mock of expo-secure-store, with a failure toggle for fallbacks. */
let store: Record<string, string> = {}
let fail = false

export const __reset = (): void => {
	store = {}
	fail = false
}
export const __setFail = (v: boolean): void => {
	fail = v
}
export const __dump = (): Record<string, string> => ({ ...store })

export const getItemAsync = async (k: string): Promise<string | null> => {
	if (fail) throw new Error('keychain unavailable')
	return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null
}
export const setItemAsync = async (k: string, v: string): Promise<void> => {
	if (fail) throw new Error('keychain unavailable')
	store[k] = v
}
export const deleteItemAsync = async (k: string): Promise<void> => {
	if (fail) throw new Error('keychain unavailable')
	delete store[k]
}
