# Security Policy

## Reporting a Vulnerability

If you find a security issue in Tailor Pad, please report it privately rather than opening a public GitHub issue.

**Contact:** seunainascott@thegoodstuff.com.ng

Include where possible:
- A description of the issue and what an attacker could do with it
- Steps to reproduce
- The Tailor Pad version (drawer → "App info") and platform (Android/iOS, OS version)
- Your name or handle, if you'd like credit

## Response Targets

- **Acknowledgement:** within 48 hours of receipt
- **Initial assessment:** within 7 days, including a severity call and rough fix timeline
- **Fix or mitigation:** depends on severity (Critical: days, High: weeks, Medium: next release)

This is a small project with one developer; targets are best-effort. If you don't hear back in a week, please re-send.

## Supported Versions

Only the latest published version is supported for security fixes. Older Beta APKs should be discarded once a new build is available — there is no backport channel.

## What's In Scope

- The Tailor Pad mobile app (Expo / React Native).
- Local data storage (AsyncStorage, SecureStore).
- Backup import/export flow.
- Password lock-screen flow.

## What's Out of Scope

- Issues in upstream Expo / React Native / npm dependencies (please report those upstream first; we'll track via Dependabot).
- Issues that require physical access to an unlocked device — those are inherent to a local-only mobile app and documented in our threat model (`docs/security/threat-model.md`).
- Self-XSS via a deliberately malformed backup file the user imported themselves.

## Disclosure

Please give us a reasonable window to fix the issue (typically 90 days from report) before public disclosure. We're happy to coordinate timing.

Thanks for helping keep customer measurement data safe.
