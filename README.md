# Tailor Pad

> The simple way for tailors to save, organize, and reuse customer measurements.

A frontend-only React Native (Expo) app that stores customer measurements on the user's device. No backend, no account, no telemetry beyond optional crash reporting.

## What It Is

- **Audience:** individual tailors who currently track measurements on paper.
- **Core flow:** create reusable measurement templates → add customers under a template → enter and edit measurements → export to PDF or share.
- **Data:** customer name + arbitrary measurement key/value pairs. Stored locally via AsyncStorage. Lock password stored in iOS Keychain / Android Keystore via `expo-secure-store`.
- **Distribution:** Android first via APK / Play Console Internal Testing. iOS later.

## Tech

- Expo SDK 54 / React Native 0.81 / React 19
- TypeScript strict mode
- expo-router (file-based routing) with typed routes
- Zustand for state, with `persist` middleware over AsyncStorage
- Comfortaa font via `@expo-google-fonts/comfortaa`
- expo-secure-store for credentials, expo-local-authentication for biometric confirmation, expo-crypto for hashing/random
- expo-print + expo-sharing for PDF export, expo-document-picker + expo-file-system for backup import

## Local Development

```bash
npm install
npx expo start
```

Then press `a` to launch on Android (emulator or USB-connected device with developer mode), `i` for iOS simulator (macOS only), or scan the QR with Expo Go for a quick preview.

## Build for Distribution

```bash
# Preview APK for beta testers
eas build --profile preview --platform android

# Production APK / AAB
eas build --profile production --platform android
```

See `docs/HOW_TO_RELEASE.md` for the full release flow including OTA updates via `eas update`.

## Project Layout

```
app/                # expo-router screens (onboarding, lock-setup, customers, templates, setup)
components/         # shared UI (LockGate, drawer, sheets, buttons, icons)
stores/             # Zustand stores (customers, templates, preferences, lock)
hooks/              # useTheme, useHistory
utils/              # auth (SecureStore wrapper), backup, pdf, biometrics, time helpers
theme/              # colors, fonts
assets/             # icons, splash, illustrations
docs/security/      # threat model + incident response
```

## Security & Privacy

- Customer measurement data is **personally identifiable** under NDPA (Nigeria). The privacy notice lives at `docs/PRIVACY.md` and at `https://tobilobasulaimon.com/tailor/privacy`.
- See [`SECURITY.md`](./SECURITY.md) for vulnerability reporting.
- See [`docs/security/threat-model.md`](./docs/security/threat-model.md) for the in-scope risks and mitigations.

## Contributing

Solo project for now. PRs from the design partner welcome — see `docs/HOW_TO_RELEASE.md` for release expectations.

## License

Proprietary. All rights reserved.
