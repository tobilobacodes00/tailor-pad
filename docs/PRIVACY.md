# Tailor Pad — Privacy Notice

> Plain-language privacy notice. The canonical version lives in this repository at [`docs/PRIVACY.md`](https://github.com/tobilobacodes00/tailor-pad/blob/main/docs/PRIVACY.md). A future hosted version may be published at `https://tobilobasulaimon.com/tailor/privacy`; until then, this file is the source of truth.
> Last updated: 2026-04-30. Effective: same.

## Who we are

Tailor Pad is a mobile app built and operated by **Tobiloba Sulaimon** ("we", "the developer"), based in Nigeria. Contact: `seunainascott@thegoodstuff.com.ng`.

For the purposes of this notice and the Nigeria Data Protection Act (NDPA, 2023), the **tailor using Tailor Pad is the data controller** for any customer measurement data they record. The developer is the **provider of the software**, not the controller of customer data — we do not have a copy of your customers' measurements, and we cannot retrieve them.

## What data the app handles

| Data | Stored where | Visible to developer? |
|---|---|---|
| Customer names you enter | On your device only (AsyncStorage) | No |
| Customer measurements you enter | On your device only (AsyncStorage) | No |
| Templates you create | On your device only (AsyncStorage) | No |
| Your app-lock password | On your device only (iOS Keychain / Android Keystore via `expo-secure-store`); stored as a salted hash, not as the original text | No |
| App preferences (theme, onboarding state) | On your device only (AsyncStorage) | No |
| Crash reports & app errors | **Not currently collected.** A future build may add opt-in crash reporting via Sentry — when that ships, this notice will be updated and an in-app opt-in will be added. | No |

We do not collect: your name, email, phone number, location, contacts, photos, or any analytics about your usage beyond crash reports.

## What we don't have

- We do not have a backend for Tailor Pad. There is no server holding your data.
- We cannot reset your lock password. If you forget it, the app's "Wipe lock and all data" flow is the only recovery — and it permanently deletes your customers and templates from the device.
- We cannot retrieve a backup we don't have. If you lose your phone without an exported backup, the data is gone.

## Sharing

- **PDF export and backup export:** when you tap Share, the app hands the file to your phone's standard share sheet (Drive, email, WhatsApp, etc.). What happens after that is governed by the destination service's privacy policy, not this one. **Backup files are unencrypted JSON** — treat them like sensitive customer data.
- We never sell, rent, or share data with third parties because we don't have your data to share.

## Crash reporting

**Currently disabled.** No crash reports leave your device today. We may add opt-in crash reporting (via Sentry) in a future build to help us fix bugs that are otherwise invisible. When that ships:

- It will be **opt-in**, not on by default.
- It will collect stack traces + OS / app version + a small set of "security-relevant" breadcrumbs (e.g., "lock attempt failed").
- It will **not** include customer names or measurement values — those are filtered out at the SDK boundary.

When this changes, this notice will be updated.

## Your rights (NDPA / similar laws)

Because the developer doesn't hold your customer data, most data-subject rights are exercised against your data on your device:
- **Access:** every customer record is visible to you in-app. You can also export a backup JSON.
- **Rectification:** edit any customer's measurements via the customer detail screen.
- **Erasure:** swipe left on a customer to delete; "Wipe lock and all data" deletes everything.
- **Portability:** the JSON backup export is your portability mechanism.

If you, as a tailor, store other people's measurements, you are the data controller for those people. NDPA expects you to inform them their data is being recorded, what you'll use it for, and how long you'll keep it. We recommend telling new customers up front.

## Children

Tailor Pad isn't designed for use by children. If you record measurements for minors (e.g., children's clothing), the parent/guardian is the relevant data subject for consent purposes.

## Security

- Lock password stored as a salted hash in iOS Keychain / Android Keystore.
- App backup blocked at the OS level (`allowBackup: false`) so other apps and ADB can't extract Tailor Pad's data.
- All backup imports are validated against a strict schema before they replace any data.
- See `docs/security/threat-model.md` in our public repo for the full threat-model.

## Changes to this notice

We'll update this page when something changes. Material changes get an in-app prompt the next time you open the app.

## Questions

`seunainascott@thegoodstuff.com.ng`. We respond within 7 days.
