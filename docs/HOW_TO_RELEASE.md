# How to release Tailor Pad

> One-page release runbook. Pair with `docs/security/incident-response.md`.

## TL;DR

```bash
# 1. Bump version in app.json (e.g., 1.0.0 → 1.0.1) — only when shipping native changes
# 2. Build APK
eas build --profile preview --platform android

# 3. Push JS-only fix instead (no rebuild)
eas update --branch preview --message "fix: <one-liner>"

# 4. Tag and push
git tag v1.0.1 && git push --tags
```

## When to do which

| Type of change | Tool |
|---|---|
| JS / TS / asset / config-via-Constants | `eas update --branch preview` (OTA, seconds) |
| New native module added (e.g., `expo install react-native-foo`) | `eas build --profile preview` (rebuild APK, ~10 min) |
| Native config change (`app.json` plugins, permissions, `runtimeVersion` policy) | `eas build --profile preview` |
| Production launch | `eas build --profile production --platform android` then `eas submit --profile production` |

## Pre-flight checks (run before every build)

```bash
npx tsc --noEmit            # type errors block release
npx expo lint               # lint errors block release
npm test                    # unit tests block release
npm audit --audit-level=high  # informational; only block if a Critical lands
```

CI runs these automatically on PR and main. Locally, `npm run lint && npm test` covers it.

## Release steps (production APK)

1. **Update `app.json` `version`** (semver: `MAJOR.MINOR.PATCH`).
   - Bump PATCH for bug fixes only.
   - Bump MINOR for new features.
   - Bump MAJOR for breaking schema changes (and write a `migrate` in every Zustand store that needs it).
2. **Update `CHANGELOG.md`** (TODO: create on first release) with what changed.
3. **Run pre-flight checks** (above).
4. `eas build --profile production --platform android`.
   - EAS auto-increments `versionCode` per `eas.json`.
   - Build takes ~10 min; you'll get a download URL.
5. **Compute APK SHA-256** and publish it alongside the download URL:
   ```bash
   sha256sum *.apk
   ```
   Post the SHA-256 to your website or pinned README section so testers can verify.
6. **Test on a real low-end Android device** before sharing the link. Cold launch, lock-set, lock-unlock, add customer, export backup, import backup, share PDF, dark mode toggle.
7. **Upload to Play Console Internal Testing track** (preferred) or share APK directly with cohort.
8. **Tag the release** in git: `git tag v1.x.y && git push --tags`.

## OTA updates (`eas update`)

For JS-only fixes after an APK is already in testers' hands:

```bash
# preview channel (used by all preview-build APKs)
eas update --branch preview --message "fix: lock cooldown countdown rounding"

# production channel
eas update --branch production --message "fix: <descriptive one-liner>"
```

Updates apply on next app launch (or on background-foreground transition, depending on the OS's background-fetch behaviour).

## Rollback

If a release breaks something:

```bash
# List recent updates on the channel
eas update:list --branch preview --limit 5

# Republish a known-good update
eas update:republish --update-id <ID> --branch preview
```

For a broken native build, you cannot OTA-rollback the native layer. You must publish a new APK and ask testers to re-install. Hence: test natives carefully before they ship.

## Sentry source-map upload

The `@sentry/react-native/expo` plugin handles this at build time, but it needs:
- `extra.sentryDsn` set in `app.json` (placeholder is `""` today — fill in from the Sentry project)
- A `SENTRY_AUTH_TOKEN` available at build time (set as an EAS secret: `eas secret:create --name SENTRY_AUTH_TOKEN --value <token>`)

Without these, builds still succeed but crash reports won't have de-minified stack traces.

## Privacy & store-listing checklist (before first Play Store submission)

- [ ] Privacy notice URL live and reachable
- [ ] Play Store Data Safety form filled (collected data: Name, Health & Fitness > Body Measurements; stored on device; not linked to user)
- [ ] App content rating questionnaire complete
- [ ] Screenshots, feature graphic, short/full description ready
- [ ] APK signed with the production keystore (EAS handles this)
- [ ] Internal Testing track set up with the beta cohort

## Apple App Store (when iOS launches)

Same as above plus:
- [ ] App Store Connect API key in `eas.json submit.production.ios`
- [ ] Apple privacy nutrition labels filled (Contact Info > Name; Health & Fitness > Body Measurements; Data Not Linked to You)
- [ ] iOS `usesNonExemptEncryption: false` is set ✅ (already in `app.json`; correct because we use no custom crypto)

## Common gotchas

- **AsyncStorage migrations**: when you change a Zustand-persisted shape, bump `version` and write `migrate(persistedState, fromVersion)`. Test with an APK build that reads pre-existing storage from a previous version.
- **EAS `runtimeVersion`**: with `policy: "appVersion"`, OTA updates only apply within the same `app.json.version`. Bumping version invalidates older clients' OTA path — they'll need a new APK.
- **iOS `inactive` AppState**: re-locking on `inactive` is annoying (Control Center pulldowns trigger it). We re-lock only on `background`. If you change this, regression-test on iOS.
- **Backup imports** are atomic + size-capped + Zod-validated. Don't loosen these without updating the threat model.

## Last reviewed

2026-04-30 — Tobiloba Sulaimon.
