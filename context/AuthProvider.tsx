/**
 * AuthProvider — starts anonymous sign-in and exposes the current user, a
 * status, any error, and a signOut helper through context.
 */
import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react'
import type { User } from 'firebase/auth'
import { watchAuth, ensureAnonymous, signOutUser } from '../firebase/authServices'
import { isFirebaseConfigured } from '../firebase/config'

type AuthStatus = 'loading' | 'signed-in' | 'error'

interface AuthContextValue {
	user: User | null
	status: AuthStatus
	error: string | null
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
	user: null,
	status: 'loading',
	error: null,
	signOut: async () => {},
})

export function useAuth(): AuthContextValue {
	return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [status, setStatus] = useState<AuthStatus>('loading')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!isFirebaseConfigured) {
			setStatus('error')
			setError(
				'Firebase is not configured. Copy .env.example to .env and add your keys.',
			)
			return
		}
		const unsubscribe = watchAuth((nextUser) => {
			if (nextUser) {
				setUser(nextUser)
				setStatus('signed-in')
			} else {
				ensureAnonymous().catch((e: unknown) => {
					setStatus('error')
					setError(
						e instanceof Error ? e.message : 'Anonymous sign-in failed.',
					)
				})
			}
		})
		return unsubscribe
	}, [])

	return (
		<AuthContext.Provider value={{ user, status, error, signOut: signOutUser }}>
			{children}
		</AuthContext.Provider>
	)
}
