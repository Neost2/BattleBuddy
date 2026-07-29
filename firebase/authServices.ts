/** Thin wrappers around Firebase anonymous auth. */
import {
	signInAnonymously,
	onAuthStateChanged,
	signOut,
	type User,
} from 'firebase/auth'
import { auth } from './config'

/** Subscribe to auth state changes. Returns an unsubscribe function. */
export function watchAuth(cb: (user: User | null) => void) {
	return onAuthStateChanged(auth, cb)
}

/** Ensure there is an anonymous session; signs in if needed. */
export async function ensureAnonymous(): Promise<User | null> {
	if (!auth.currentUser) {
		await signInAnonymously(auth)
	}
	return auth.currentUser
}

export async function signOutUser(): Promise<void> {
	await signOut(auth)
}
