# Wellness Companion + BattleBuddy — cumulative next-pass overlay

This ZIP contains BOTH the first Wellness Companion MVP overlay and the second pass. Copy its contents over the existing `Neost2/BattleBuddy` repository.

## Included now

First pass:
- Wellness Companion five-tab navigation
- Home dashboard
- BattleBuddy AI tab retained
- Expanded daily check-in
- Progress/trends
- Goals/habits
- Safety Plan
- Wellness library
- Veterans Crisis Line / emergency support

Second pass:
- `expo-notifications` SDK 54 integration
- Local daily reminders for medication/wellness
- Reminder enable/disable/delete
- Consent center
- Consent-aware Firestore sync
- Private check-in notes excluded from sync by default
- BattleBuddy receives limited wellness context (latest ratings + active goals)
- Crisis response routes users toward human support
- Organization dashboard demo that hides data unless consent is enabled
- `package.json` replacement including `expo-notifications ~0.32.17`
- `app.json` replacement including the Expo Notifications config plugin

## Install

From the BattleBuddy repo root after copying this overlay:

```bash
npm install
npx expo install expo-notifications
npx expo start -c
```

For local notifications, Expo SDK 54 supports scheduling with `expo-notifications`. Remote push notifications on Android require a development build; this MVP intentionally uses local notifications.

## Firebase

The sync layer uses the Firebase config already in BattleBuddy. It writes selected data beneath:

```text
users/{uid}/wellnessCheckIns/{checkinId}
users/{uid}/goals/{goalId}
users/{uid}/wellnessMeta/sync
```

Add Firestore security rules before any production pilot. A production organization dashboard should be a separate role-protected web application rather than exposing organization access in the veteran mobile app.

## AI security

`services/ai.ts` now prefers:

```env
EXPO_PUBLIC_BATTLEBUDDY_API_URL=https://your-secure-api.example.com/battlebuddy
```

That endpoint should keep the AI provider secret on the server.

For compatibility with the original repo, the old `EXPO_PUBLIC_OPENAI_API_KEY` path is retained only as a development fallback. Do not ship a production mobile build with the provider key inside the Expo environment.

## Recommended third pass

- Build the real organization web dashboard
- Add role-based organization authentication
- Create production Firestore rules
- Medication records with dose/instructions and adherence history
- Appointment calendar workflow
- Trusted-contact management
- Clinical/safety review of crisis workflow and wellness content
- Secure server-side BattleBuddy AI endpoint
- Tests for reminders, consent, sync and AI context
