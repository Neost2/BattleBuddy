# BattleBuddy — Veteran Wellness Companion

BattleBuddy is an Expo/React Native wellness companion designed to help veterans manage everyday wellness, personal goals, safety planning, journaling, reminders, support resources, and transportation-related care coordination from one application.

The app can be used with an account or in anonymous mode. BattleBuddy is a wellness-support tool and is **not a replacement for licensed healthcare professionals, emergency services, or crisis services**.

---

## What BattleBuddy Includes

### BattleBuddy AI

The **BattleBuddy** chat gives users a place to talk through what is on their mind and connect conversations to wellness goals, safety planning, and other tools in the app.

The AI includes crisis-language handling that directs users toward real-world support when appropriate. It should not be presented as an emergency service or clinical provider.

### Daily Wellness Check-In

Users can record a daily check-in including:

- Mood
- Stress
- Sleep
- Energy
- Optional personal notes

The home dashboard shows the latest check-in information so users can quickly see where they are for the day.

### My Plan

The plan area is used for personal wellness goals and progress. Users can create and work through goals as part of their wellness routine.

### Journal

The journal provides a private place for personal entries and reflection.

### Safety Plan

The Safety Plan keeps important coping steps and support information accessible from the app. Sensitive Safety Plan data uses BattleBuddy's encryption service for storage.

### Reminders

Users can create reminders for things such as:

- Medication
- Appointments
- Wellness activities
- Other personal tasks

### Wellness Library

The Wellness section contains practical resources covering:

- Stress and resilience
- Sleep
- Nutrition
- Exercise
- Financial wellness

### Support

The support area provides crisis and emergency-support options when a user needs immediate help.

---

# My Trips — CarePath-Light Mobility Support

BattleBuddy includes a lightweight care-coordination feature called **My Trips**.

It is designed to help a veteran organize transportation needs around appointments and other important destinations without turning BattleBuddy into a full transportation or dispatch platform.

From the Home screen, select **My Trips**.

## Saved Locations

Before planning trips, users can save places they visit frequently.

Open:

**My Trips → Manage Locations**

A saved location can contain:

- Location name
- Location type
- Street address
- City
- State
- ZIP code
- Optional notes

Supported location types include:

- Home
- VA Medical
- Doctor
- Pharmacy
- Other

Saved addresses can then be selected while planning a trip or requesting assistance, so the user does not need to repeatedly enter the same information.

Sensitive saved-location fields are stored through BattleBuddy's encryption layer.

## Planning a Trip

Open:

**My Trips → Plan Trip**

The trip-planning flow allows the user to:

1. Choose one of their saved locations or enter a one-time destination.
2. Select the trip date using the calendar.
3. Select an easy time option or choose a custom time.
4. Select the trip type.
5. Indicate whether assistance is needed.
6. Add optional notes.
7. Select **Save Trip**.

After a successful save, BattleBuddy returns directly to **My Trips** and displays the trip.

The Save button is protected against repeated submission so multiple taps do not intentionally create duplicate copies while the request is being saved.

## Requesting Assistance

Open:

**My Trips → Request Assistance**

The user can:

1. Choose their current location from Saved Locations or enter it manually.
2. Choose the destination from Saved Locations or enter it manually.
3. Select the reason assistance is needed.
4. Add optional notes.
5. Submit the assistance request.

After submission, the user is returned to **My Trips**, where the request is shown with its current status.

## Get Me Home

**Get Me Home** uses the location saved with the **Home** type.

If no Home location exists, BattleBuddy directs the user to add one. Once Home has been saved, the user can use it when planning a trip or requesting help getting home.

## Navigation

Mobility screens include:

- **Back** — returns to the previous mobility area.
- **Home** — returns to the main BattleBuddy dashboard.

---

# Getting Started

## Requirements

For local development, install:

- Node.js
- npm
- Expo-compatible development environment

The project currently uses Expo SDK 54, React Native, TypeScript, Expo Router, Firebase, AsyncStorage, Secure Store, Expo Notifications, and CryptoJS.

## Install Dependencies

From the BattleBuddy project directory:

```bash
npm install
```

## Environment Configuration

BattleBuddy uses environment variables for configured external services. Do not commit private API keys, credentials, secrets, or production encryption keys to source control.

If your local project already contains the configured `.env` used by your working BattleBuddy installation, keep that file private when sharing the repository.

## Start the App

The default start command launches Expo with a tunnel and clears the Metro cache:

```bash
npm start
```

You can also run:

```bash
npm run android
npm run ios
npm run web
```

For a clean Expo restart:

```bash
npx expo start -c
```

---

# First-Time User Flow

When BattleBuddy opens, the user starts at the login experience.

Depending on the configured authentication flow, the user can use BattleBuddy with an account or anonymously.

After entering the app, the Home dashboard provides access to:

- My Trips
- Daily Wellness Check-In
- BattleBuddy AI
- Safety Plan
- Reminders
- Wellness Resources
- My Plan
- Account
- Support

A useful first-time setup is:

1. Complete a Daily Wellness Check-In.
2. Open My Plan and create wellness goals.
3. Review or create a Safety Plan.
4. Configure important reminders.
5. Open My Trips and save Home, VA, pharmacy, doctor, or other frequent locations.
6. Use BattleBuddy AI when additional wellness guidance or navigation through the app would help.

---

# Main Navigation

The bottom-tab application contains the primary BattleBuddy areas, including the Home dashboard and wellness features.

Additional screens are opened from cards and actions throughout the application.

If a user becomes lost in the My Trips workflow, select **Home** to return to the main dashboard.

---

# Privacy, Security, and Consent Features

BattleBuddy includes engineering foundations intended to support privacy-conscious wellness workflows, including:

- Encryption services for sensitive locally stored information
- Secure storage support
- Audit logging
- Consent logging and validation
- Consent-gated VA integration scaffolding
- Backup services
- Authentication and anonymous-use support

The repository also contains VA/FHIR integration scaffolding and bid-readiness engineering work. These components should be treated as development/integration functionality until they have been validated for the intended production environment.

Production deployment still requires appropriate security review, identity design, key management, infrastructure configuration, compliance review, and validation of any external healthcare integration.

---

# Testing and Validation

Before considering a development pass stable, run both TypeScript validation and the automated test suite.

## TypeScript

```bash
npx tsc --noEmit
```

or:

```bash
npm run typecheck
```

## Automated Tests

```bash
npm test
```

For test development:

```bash
npm run test:watch
```

A passing Jest suite does not automatically mean the Expo user interface is working correctly. After automated validation, manually test the major flows in Expo.

Recommended manual test:

1. Login or continue anonymously.
2. Complete a wellness check-in.
3. Open BattleBuddy chat.
4. Open Safety Plan.
5. Open My Trips.
6. Add a saved location with a complete address.
7. Plan a trip using the saved location.
8. Select a date and time.
9. Save the trip and verify that My Trips opens automatically.
10. Confirm only one trip was created.
11. Submit an assistance request.
12. Test Get Me Home.
13. Verify Back and Home navigation.
14. Confirm Sign Out works for authenticated sessions.

---

# Project Structure

Important directories include:

```text
app/
  (tabs)/              Main application tabs
  trips.tsx            My Trips dashboard
  plan-trip.tsx        Trip planning
  locations.tsx        Saved locations
  request-assistance.tsx
  safety-plan.tsx
  reminders.tsx
  support.tsx
  login.tsx
  register.tsx

components/
  mobility/            Mobility UI components

context/
  AuthProvider         Authentication state
  ThemeProvider        BattleBuddy design system

services/
  ai.ts                BattleBuddy AI
  checkin.ts           Daily check-ins
  encryption.ts        Encryption helpers
  audit.ts             Audit support
  consent.ts           Consent support
  journal.ts           Journal data
  reminders.ts         Reminder logic
  mobility/            Trips and saved-location services
  va/                  VA/FHIR integration scaffolding

__tests__/
  Automated Jest tests
```

---

# Development Guidelines

When changing BattleBuddy:

1. Keep new screens consistent with the existing BattleBuddy theme.
2. Reuse the existing ThemeProvider instead of introducing unrelated styling.
3. Keep sensitive information out of plaintext storage where the existing encrypted-storage pattern applies.
4. Keep the UI model and service model synchronized.
5. Prevent duplicate form submissions.
6. Preserve Back/Home navigation on secondary workflows.
7. Run TypeScript and Jest after every meaningful development pass.
8. Manually test Expo navigation after automated tests pass.
9. Never commit `.env`, private API keys, production credentials, or secrets.

---

# Current Mobility Scope

The CarePath-Light feature demonstrates how transportation support can integrate into a veteran wellness platform.

The current product direction includes veteran trip planning and assistance-request workflows. Coordinator and driver concepts exist in the development architecture, but any coordinator/driver workflow should be considered demonstration/development functionality until the corresponding production data, authorization, identity, dispatch, and operational systems are fully implemented and validated.

BattleBuddy intentionally does **not** claim to provide a production NEMT dispatch network, transportation marketplace, or payment platform.

---

# Technology

BattleBuddy currently uses:

- Expo
- React Native
- TypeScript
- Expo Router
- Firebase
- AsyncStorage
- Expo Secure Store
- Expo Notifications
- CryptoJS
- Jest
- ts-jest

---

# Important Disclaimer

BattleBuddy is a wellness-support application. It does not replace a doctor, therapist, licensed healthcare professional, emergency service, crisis service, VA clinical system, or professional transportation provider.

Features involving healthcare integration, transportation coordination, identity, consent, encryption, and audit controls must be independently reviewed and validated before production deployment.
