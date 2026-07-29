/**
 * Biometric app lock.
 *
 * When the lock is enabled, the app locks on launch and whenever it returns
 * from the background. Unlocking uses Face ID / fingerprint, falling back to
 * the device passcode where available (expo-local-authentication).
 */
import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import { getSettings, updateSettings } from '../services/settings'

interface LockContextValue {
	/** True when the app is currently locked and content should be hidden. */
	locked: boolean
	/** Whether the biometric lock preference is turned on. */
	biometricEnabled: boolean
	/** Whether this device can actually do biometric / passcode auth. */
	supported: boolean
	/** Prompt for auth; resolves true when unlocked. */
	unlock: () => Promise<boolean>
	/** Turn the lock on/off (enabling first verifies identity). */
	setBiometricEnabled: (value: boolean) => Promise<boolean>
}

const LockContext = createContext<LockContextValue>({
	locked: false,
	biometricEnabled: false,
	supported: false,
	unlock: async () => true,
	setBiometricEnabled: async () => false,
})

export function useLock(): LockContextValue {
	return useContext(LockContext)
}

export function LockProvider({ children }: { children: ReactNode }) {
	const [biometricEnabled, setBio] = useState(false)
	const [locked, setLocked] = useState(false)
	const [supported, setSupported] = useState(false)
	const appState = useRef<AppStateStatus>(AppState.currentState)

	useEffect(() => {
		;(async () => {
			const hw = await LocalAuthentication.hasHardwareAsync().catch(() => false)
			const enrolled = await LocalAuthentication.isEnrolledAsync().catch(() => false)
			setSupported(Boolean(hw && enrolled))
			const s = await getSettings()
			setBio(s.biometricEnabled)
			if (s.biometricEnabled) setLocked(true)
		})()
	}, [])

	useEffect(() => {
		const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
			const prev = appState.current
			appState.current = next
			if (biometricEnabled && prev === 'active' && /inactive|background/.test(next)) {
				setLocked(true)
			}
		})
		return () => sub.remove()
	}, [biometricEnabled])

	async function unlock(): Promise<boolean> {
		try {
			const res = await LocalAuthentication.authenticateAsync({
				promptMessage: 'Unlock Battle Buddy',
				disableDeviceFallback: false,
			})
			if (res.success) {
				setLocked(false)
				return true
			}
			return false
		} catch {
			return false
		}
	}

	async function setBiometricEnabled(value: boolean): Promise<boolean> {
		if (value) {
			const res = await LocalAuthentication.authenticateAsync({
				promptMessage: 'Confirm to enable the lock',
				disableDeviceFallback: false,
			}).catch(() => ({ success: false }) as { success: boolean })
			if (!res.success) return false
		}
		await updateSettings({ biometricEnabled: value })
		setBio(value)
		if (!value) setLocked(false)
		return true
	}

	return (
		<LockContext.Provider
			value={{ locked, biometricEnabled, supported, unlock, setBiometricEnabled }}
		>
			{children}
		</LockContext.Provider>
	)
}
