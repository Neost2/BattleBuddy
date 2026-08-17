# BattleBuddy → Wellness Companion MVP

This overlay turns the existing BattleBuddy Expo SDK 54 application into the first Wellness Companion MVP while preserving the existing BattleBuddy chat, journal, mission log, Firebase auth, biometric lock, encrypted local storage, backup/restore and privacy settings.

## What this pass adds

- Wellness Companion home dashboard
- BattleBuddy remains a primary tab
- Expanded daily wellness check-in: mood, stress, sleep and energy
- Local wellness trend/progress view
- Goal and healthy habit tracking
- Personal safety plan
- Wellness education hub
- One-touch Veterans Crisis Line / emergency support
- Existing Journal, Mission and Settings routes remain available, but are hidden from the primary five-tab navigation

## Apply to your current BattleBuddy repo

Copy the folders in this overlay into the root of your existing BattleBuddy repository and allow matching files to replace the current versions.

The primary replaced files are:
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/index.tsx`

The other files are new.

Then run:

```bash
npm install
npx expo start -c
```

No new dependency is required in this pass. It intentionally uses the AsyncStorage already present in BattleBuddy.

## Next production pass

1. Medication + appointment reminders using `expo-notifications`
2. Secure API gateway for cloud AI so an API secret is never shipped in Expo
3. Clinical-reviewed crisis escalation / safety workflow
4. Consent service for explicitly shared wellness data
5. Organization/admin web dashboard
6. Firebase sync for selected wellness data
7. Offline AI / local model integration
8. Automated tests for new wellness services and screens

## Safety note

This MVP labels BattleBuddy as a general wellness companion rather than a clinician. Crisis actions are intentionally separated from AI chat and route directly to human emergency/crisis resources.
