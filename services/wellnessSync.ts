import { collection, doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../firebase/config'
import { getConsent } from './consent'
import { getGoals, getWellnessCheckIns } from './wellnessStore'

export type SyncResult = { ok: boolean; message: string }

export async function syncConsentedWellnessData(): Promise<SyncResult> {
  if (!isFirebaseConfigured) return { ok: false, message: 'Firebase is not configured.' }

  const currentUser = auth.currentUser
  const uid = currentUser?.uid
  if (!uid) return { ok: false, message: 'Sign in before syncing.' }
  if (currentUser.isAnonymous) return { ok: false, message: 'Create an account before syncing wellness data.' }

  const consent = await getConsent()
  if (!consent.syncWellnessCheckIns && !consent.syncGoals) {
    return { ok: false, message: 'Nothing is selected for sync.' }
  }

  const batch = writeBatch(db)

  if (consent.syncWellnessCheckIns) {
    const checkins = await getWellnessCheckIns()
    checkins.slice(0, 90).forEach(item => {
      const ref = doc(collection(db, 'users', uid, 'wellnessCheckIns'), item.id)
      const safeItem = consent.sharePrivateNotes ? item : { ...item, note: '' }
      batch.set(ref, safeItem, { merge: true })
    })
  }

  if (consent.syncGoals) {
    const goals = await getGoals()
    goals.forEach(goal => {
      const ref = doc(collection(db, 'users', uid, 'goals'), goal.id)
      batch.set(ref, goal, { merge: true })
    })
  }

  await batch.commit()

  await setDoc(doc(db, 'users', uid, 'wellnessMeta', 'sync'), {
    consent,
    lastSyncAt: serverTimestamp(),
  }, { merge: true })

  return { ok: true, message: 'Consented wellness data synced.' }
}
