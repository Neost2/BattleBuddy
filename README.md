# Battle Buddy — Milestone 4 (Security)

Battle Buddy is a calm, private companion app. It's supportive without pretending
to be human. This milestone adds the security layer: a **biometric app lock**,
**Panic Delete**, **encrypted export / import**, and a **Privacy & Security**
screen — on top of the Milestone 3 journaling + encryption foundation.

## New in Milestone 4

- **Biometric lock.** Turn on Face ID / fingerprint (device passcode as fallback)
  under **Settings → Privacy & Security**. The app locks on launch and whenever
  it returns from the background. See `context/LockProvider.tsx` and
  `components/LockOverlay.tsx`.
- **Panic Delete.** One tap wipes every local record *and* the encryption key,
  with no recovery. In **Privacy & Security → Danger Zone**
  (`services/panic.ts`).
- **Encrypted export / import.** Export your journal, check-ins, and mission log
  as a backup — optionally AES-encrypted with a passphrase — then Share or Copy
  it. Restore on any device by pasting it back. See `app/backup.tsx` and
  `services/backup.ts`.
- **Privacy & Security screen** (`app/privacy.tsx`) with a “Hide Previews” option
  that masks your mood on the Home dashboard.

## Carried over

- Milestone 3: real local AES encryption (key in the device keychain),
  Daily Check-In + mood tracking.
- Milestone 2: Expo SDK 54 + TypeScript + Expo Router, Firebase anonymous auth
  + Firestore, dark military theme, Home / Chat / Journal / Mission / Settings.

## Quick start

```bash
npm install
# Align the native modules with your Expo version:
npx expo install expo-local-authentication expo-clipboard expo-secure-store expo-crypto
cp .env.example .env      # then paste in your Firebase web config
npm start                 # press a / i, or scan the QR with Expo Go
```

Enable **Anonymous** sign-in in the Firebase console
(Build → Authentication → Sign-in method).

## Notes on the biometric lock

- Uses `expo-local-authentication`. On a simulator with no enrolled biometrics,
  enabling the lock will fail confirmation — test on a real device, or enroll a
  fingerprint/passcode in the simulator settings.
- The lock hides the UI behind a full-screen cover; unlocking prompts the OS
  biometric dialog automatically.

## How backups work

1. Open **Settings → Backup & Restore** (or from Privacy & Security).
2. **Export:** optionally set a passphrase, then Share or Copy. With a passphrase
   the bundle is AES-encrypted (`{ "encrypted": true, "payload": "…" }`).
3. **Import:** paste a backup, add the passphrase if it was encrypted, and
   Restore. Importing replaces current local data.

## Next (Milestone 5 — AIPI Device)

Remove Firebase, offline on-device AI (llama.cpp), a local encrypted database,
and a Raspberry Pi launcher.
