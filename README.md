# Tailor Pad

> The simple way for tailors to save, organize, and reuse customer measurements.

**Status:** Public Beta. Distributed via APK to a small tester cohort. Play Store launch later.

A frontend-only React Native (Expo) app that stores customer measurements on the user's device. No backend, no account, no telemetry.

## What It Is

- **Audience:** individual tailors who currently track measurements on paper.
- **Core flow:** create reusable measurement templates → add customers under a template → enter and edit measurements → export to PDF or share.
- **Data:** customer name + arbitrary measurement key/value pairs. Stored locally in AsyncStorage. Lock password stored in iOS Keychain / Android Keystore via `expo-secure-store` (salted SHA-256, never plaintext).
- **Distribution:** Android-first via APK / Play Console Internal Testing. iOS later.

## Tech

- Expo SDK 54 / React Native 0.81 / React 19
- TypeScript strict mode
- expo-router (file-based routing) with typed routes
- Zustand for state, with `persist` middleware over AsyncStorage
- [Outfit](https://fonts.google.com/specimen/Outfit) via `@expo-google-fonts/outfit`
- `expo-secure-store` for credentials, `expo-crypto` for hashing/random IDs, `zod` for backup schema validation
- `expo-print` + `expo-sharing` for PDF export, `expo-document-picker` + `expo-file-system` for backup import/export
- `react-native-reanimated` + `react-native-gesture-handler` for swipe actions and draggable lists

## Local Development

```bash
npm install
npx expo start
```

Then press `a` for Android (emulator or USB-connected device with developer mode on), `i` for iOS simulator (macOS only), or scan the QR with Expo Go for a quick preview.

Run the same checks CI runs:

```bash
npx tsc --noEmit   # type-check
npx expo lint      # lint
npm test           # 15 unit tests
```

## Build for Distribution

```bash
# Preview APK for beta testers
eas build --profile preview --platform android

# Production AAB / APK
eas build --profile production --platform android
```

See [`docs/HOW_TO_RELEASE.md`](./docs/HOW_TO_RELEASE.md) for the full release flow, including OTA updates via `eas update`.

## Project Layout

```
app/                # expo-router screens (onboarding, lock-setup, customers, templates, setup)
components/         # shared UI (LockGate, drawer, sheets, buttons, error fallback)
stores/             # Zustand stores (customers, templates, preferences, lock) + zod schemas
hooks/              # useTheme, useHistory, useReducedMotion
utils/              # auth (SecureStore wrapper), backup, pdf, time helpers
theme/              # colors, fonts
assets/             # icons, splash, illustrations
docs/               # privacy notice, threat model, incident-response, release runbook
__tests__/          # jest-expo unit tests (stores + schemas + utils)
```

## Security & Privacy

- Customer measurement data is **personally identifiable** under NDPA (Nigeria). The canonical privacy notice is [`docs/PRIVACY.md`](./docs/PRIVACY.md).
- See [`SECURITY.md`](./SECURITY.md) for vulnerability reporting.
- See [`docs/security/threat-model.md`](./docs/security/threat-model.md) for the in-scope threats and the mitigations in place.
- See [`docs/security/incident-response.md`](./docs/security/incident-response.md) for what happens if something goes wrong.

## Contributing

PRs welcome — but please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) first. For anything bigger than a typo or copy fix, **open an issue before writing code** so we can talk through the approach.

For security issues, email `seunainascott@thegoodstuff.com.ng` directly. Don't open a public issue.

## Credits

- Built by [Tobiloba Sulaimon](https://tobilobasulaimon.com) ([@tobilobacodes00](https://github.com/tobilobacodes00))
- Designed by Abdul ui ux

## License

[MIT](./LICENSE) © 2026 Tobiloba Sulaimon
