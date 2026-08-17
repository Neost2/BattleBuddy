# Wellness Companion + BattleBuddy — Auth Choice Pass

This ZIP is cumulative: it includes the Wellness MVP, reminders/consent/admin-demo pass, and the new account/anonymous authentication flow.

## New in this pass
- Continue Anonymously, Sign In, or Create Account at launch.
- Anonymous sessions only start after explicit choice.
- Email/password sign-in and registration.
- Anonymous users can upgrade the current Firebase identity with credential linking.
- Account screen and sign-out/end-session flow.
- Cloud wellness sync is blocked for anonymous users.

## Firebase Console
Enable both Authentication providers: Anonymous and Email/Password.

## Install and verify
```bash
npm install
npx expo install expo-notifications
npx expo install --fix
npx expo-doctor@latest
npx tsc --noEmit
npx expo start -c
```

Anonymous users retain local wellness features. Account users can enable consent-based Firebase wellness sync.
