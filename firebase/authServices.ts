import { EmailAuthProvider, createUserWithEmailAndPassword, linkWithCredential, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { auth } from './config'

export function watchAuth(cb: (user: User | null) => void) { return onAuthStateChanged(auth, cb) }
export async function continueAnonymously(): Promise<User> {
  if (auth.currentUser) return auth.currentUser
  return (await signInAnonymously(auth)).user
}
export async function signInUser(email: string, password: string): Promise<User> {
  if (auth.currentUser?.isAnonymous) await signOut(auth)
  return (await signInWithEmailAndPassword(auth, email.trim(), password)).user
}
export async function createOrUpgradeAccount(email: string, password: string): Promise<User> {
  const current = auth.currentUser
  if (current?.isAnonymous) {
    const credential = EmailAuthProvider.credential(email.trim(), password)
    return (await linkWithCredential(current, credential)).user
  }
  return (await createUserWithEmailAndPassword(auth, email.trim(), password)).user
}
export async function signOutUser(): Promise<void> { await signOut(auth) }
