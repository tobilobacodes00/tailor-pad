# Tailor Pad — Threat Model

> **Methodology:** STRIDE for general threats, LINDDUN for privacy. Drawn from the Security audit (April 2026); this is the committable artifact.
> **Review cadence:** Re-review when (a) the architecture changes meaningfully (e.g., backend added, multi-user introduced), (b) a new feature touches PII or persistence, or (c) an incident reveals an unmodeled threat.

## What we're protecting

- **Customer names** and **body measurements** stored on the tailor's device.
- The **lock password** that gates the app.
- The **integrity of the app binary** distributed to beta testers.

## Trust boundaries

```
            Device (lost/stolen/shared)
            └── Tailor Pad APK
                ├── LockGate (password + biometric)              ← Boundary i
                ├── App state (Zustand)
                │   ├── customers (PII; AsyncStorage)            ← Boundary at-rest
                │   └── templates (AsyncStorage)
                ├── lock password & salt (expo-secure-store)     ← Boundary at-rest (Keystore)
                └── External I/O
                    ├── User input (TextInput)                   ← Boundary ii
                    ├── DocumentPicker (untrusted JSON)          ← Boundary iii
                    ├── Print engine (HTML → PDF)                ← Boundary iv
                    └── Sharing.shareAsync (user-chosen target)  ← Boundary v
```

## STRIDE threats (likelihood × impact)

| # | Threat | Category | Likelihood | Impact | Mitigation |
|---|---|---|---|---|---|
| T1 | Lost-or-stolen device → finder taps "Wipe lock and all data" → unauthenticated access to a fresh app | Spoofing | Medium-High | Medium (PII destroyed, not exfiltrated) | "Wipe lock and all data" rename makes destruction the cost of bypass. Lock has 5-attempt rate-limit + 30s cooldown. Biometric gate **explicitly rejected** by founder (project decision). |
| T2 | ADB backup of `/data/data/com.thegoodstuff.tailor/...` extracts AsyncStorage plaintext PII | Information Disclosure | Medium | High (full PII exposure) | `android:allowBackup="false"` in `app.json` blocks Android Backup Manager and `adb backup`. iOS file-system encryption applies by default. **Residual:** rooted device can still read AsyncStorage. Accepted at this stage. |
| T3 | Lock password reuse across services revealed via secure-store extraction | Information Disclosure | Low | High (cross-service compromise) | Password stored as SHA-256(salt+password) in `expo-secure-store` (iOS Keychain / Android Keystore, hardware-backed on most devices). Plaintext never persisted. Salt rotates per install. |
| T4 | Malicious backup-import file (social-engineered or rehosted) corrupts state | Tampering | Low (no auto-load) | Medium (data loss + potential follow-on app crash) | Zod schema validation (`BackupFileSchema`) rejects malformed input; 5 MB size cap; atomic apply with snapshot/rollback if either store-write throws. Confirmation dialog requires explicit user assent before replace. |
| T5 | Sideloaded malicious APK impersonates Tailor Pad | Spoofing | Low at current scale | High (full PII exposure) | User-education only at this stage. **Mitigation plan:** distribute via Play Console Internal Testing, publish APK SHA-256 alongside any direct-download link. |
| T6 | Backup-export shares unencrypted JSON to user-chosen destination | Information Disclosure (user-initiated) | Medium | Medium (PII at rest in Drive/email) | UI surfaces an explicit warning that backup files are unencrypted JSON. Treated as accepted user choice. |
| T7 | Supply-chain compromise of an Expo-toolchain build dependency (postcss, uuid, etc.) | Tampering | Low at current scale | High (compromised APK) | Dependabot weekly scans; `npm audit --audit-level=high` in CI; SBOM at first release. **Residual:** zero-day supply-chain attack pre-detection. |

## LINDDUN privacy threats

- **L1 Linkability** — customer names + measurements are linkable to identifiable persons. Unavoidable; the app's purpose.
- **L2 Identifiability** — directly identifiable. Mitigation: privacy notice + tailor-side responsibility (the tailor is the controller).
- **L3 Disclosure** — central concern; addressed by T2 + T3 mitigations + future AES-GCM-at-rest if a SaaS sync feature is ever added.
- **L4 Unawareness (data subject)** — the customer being measured doesn't directly consent through the app. Mitigation: privacy notice provided to the tailor, who is the controller and must inform their customers per NDPA Art 30-32. Future feature: an in-app prompt encouraging the tailor to share the privacy notice with new customers.
- **L5 Non-compliance** — NDPA registration as a controller may apply at processing thresholds; tracked in `docs/security/incident-response.md` § Regulatory.

## Highest-priority abuse cases

1. **Lost or stolen phone** (T1+T2 combined) — PII confidentiality.
2. **Curious bystander** picks up an already-unlocked session — re-lock-on-background.
3. **Malicious backup-import file** (T4) — Zod schema + size cap + atomic apply.
4. **Sideloaded-APK impersonation** (T5) — distribution-channel hardening.

## What's explicitly out of scope (accepted risk)

- Rooted/jailbroken device reading `/data/data/.../...` directly. Encryption-at-rest of AsyncStorage payloads is documented as a follow-up item.
- Targeted attacker with the user's unlocked phone *and* their fingerprint/face ID. The lock + biometric gate is best-effort against opportunistic threats.
- Network-based attackers. The app makes no app-originated network calls; outbound `Linking.openURL` only targets hardcoded HTTPS social URLs.

## Mitigations checklist

- [x] `android:allowBackup="false"` set in `app.json`
- [x] Lock password stored hashed in `expo-secure-store` with per-install salt
- [x] "Wipe lock and all data" rename (destruction-as-friction)
- [x] Lock-attempt rate limit (5 fails → 30s cooldown)
- [x] 6-character minimum lock password
- [x] Backup-import Zod validation + 5 MB size cap + atomic apply
- [x] `expo-secure-store` keychain-accessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY
- [x] Re-lock on app backgrounding (`AppState: active → background`)
- [x] Sentry crash-reporting wired (DSN set per environment)
- [x] App-level error boundary with user-facing fallback
- [x] HTML escaping on PDF generation (incl. share-sheet `dialogTitle`)
- [x] `SECURITY.md` with vulnerability reporting path
- [x] Dependabot weekly + `npm audit` informational in CI
- [—] Biometric gate (rejected by founder; password-only by design)
- [ ] AES-GCM encryption of AsyncStorage payloads (deferred)
- [ ] Play Console Internal Testing track for distribution
- [ ] APK SHA-256 published with each release
- [ ] Privacy notice published at a stable URL + linked from app
- [ ] First-customer prompt to tailor: "have you informed this customer their data is stored?"
- [ ] iOS file-protection class explicitly set to `NSFileProtectionComplete` (deferred — default is acceptable)

## Last reviewed

2026-04-30 — Tobiloba Sulaimon. Next review: when the first non-trivial architecture change lands, or every 6 months, whichever is sooner.
