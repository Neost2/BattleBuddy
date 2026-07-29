/**
 * Battle Buddy test config.
 *
 * These are fast, pure-logic tests for the service layer — they run under Node
 * with in-memory mocks for the native modules (AsyncStorage, SecureStore,
 * expo-crypto) and the REAL crypto-js, so they exercise the actual app code.
 * No device or emulator required: `npm test`.
 */
module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/__tests__'],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{ tsconfig: 'tsconfig.jest.json', diagnostics: { warnOnly: true } },
		],
	},
	moduleNameMapper: {
		'^@react-native-async-storage/async-storage$':
			'<rootDir>/test/mocks/asyncStorage.ts',
		'^expo-secure-store$': '<rootDir>/test/mocks/secureStore.ts',
		'^expo-crypto$': '<rootDir>/test/mocks/expoCrypto.ts',
	},
	clearMocks: true,
}
