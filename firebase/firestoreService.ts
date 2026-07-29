/**
 * Generic Firestore helpers, scoped per user: users/{uid}/{collection}/{id}.
 *
 * These are ready for Stage 2, when journal/mission move from local storage to
 * cloud sync. In Milestone 2 the data services use local storage (AsyncStorage)
 * so the app runs immediately without any Firestore rules setup.
 */
import {
	collection,
	doc,
	setDoc,
	getDocs,
	deleteDoc,
} from 'firebase/firestore'
import { db } from './config'

export async function saveDoc(
	uid: string,
	coll: string,
	id: string,
	data: Record<string, unknown>,
): Promise<void> {
	await setDoc(doc(db, 'users', uid, coll, id), data)
}

export async function listDocs<T>(uid: string, coll: string): Promise<T[]> {
	const snap = await getDocs(collection(db, 'users', uid, coll))
	return snap.docs.map((d) => d.data() as T)
}

export async function removeDoc(
	uid: string,
	coll: string,
	id: string,
): Promise<void> {
	await deleteDoc(doc(db, 'users', uid, coll, id))
}

export async function clearCollection(uid: string, coll: string): Promise<void> {
	const snap = await getDocs(collection(db, 'users', uid, coll))
	await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
}
