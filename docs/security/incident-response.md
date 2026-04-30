# Tailor Pad — Incident Response Plan

> One-page runbook. Owner: Tobiloba Sulaimon (sole DRI for now). Reviewed: 2026-04-30.

## What counts as an incident

Anything that suggests:
- **Data loss** — a tester reports their templates / customers disappeared unexpectedly.
- **Data exposure** — someone other than the tester is asking about / sharing a tester's customer measurements.
- **Vulnerability disclosure** — an external researcher reports a flaw via `security@thegoodstuff.com.ng`.
- **Suspicious behaviour** — Sentry shows a crash pattern that suggests tampering or a malicious payload.
- **Lost / stolen tester device** — a tester reports their phone is gone.

If unsure → treat as an incident, downgrade later.

## Severity

| Level | Definition | Initial response time |
|---|---|---|
| **S0** | Actively exploited; data exfiltration confirmed; multiple testers affected | Within 1 hour |
| **S1** | Known-exploitable but no confirmed exploitation; one tester affected | Within 4 hours |
| **S2** | Theoretical or low-likelihood; future-tense | Within 48 hours |

## What to do — first hour for S0/S1

1. **Acknowledge** — reply to the report (tester or researcher) within the response time. A sentence is fine: "Got this, I'm investigating, you'll hear back within 24h."
2. **Stop the bleeding if possible** — pull the affected APK from any active distribution channel; pause `eas update` rollouts; revoke shared-link credentials.
3. **Preserve evidence** — save the original report (email, screenshots), pull recent Sentry events, take a snapshot of the current main branch.
4. **Open a private investigation log** — a dated markdown file under `docs/security/incidents/YYYY-MM-DD-<slug>.md` with: timeline, what's known, what's assumed, decisions, contacts.
5. **Decide scope** — single tester / multi-tester / all users. Drives notification scope.

## Notification triggers

| Trigger | Required | When |
|---|---|---|
| Affected testers | Yes | As soon as scope is known. Plain-language email or WhatsApp. |
| **NDPC** (Nigeria Data Protection Commission) | Yes if PII confirmed exposed and affected ≥1 data subject | Within **72 hours** of awareness per NDPA Art 40. Use NDPC's online portal. |
| Apple App Store / Google Play | Yes if app ships through stores | Per their incident-disclosure policy (varies; Google has 24h for severe exploits). |
| Public disclosure | Coordinate with reporter | Default 90 days from report; sooner if actively exploited and a patch is available. |

NDPC contact: [https://ndpc.gov.ng](https://ndpc.gov.ng) | DPO email field on their breach-notification form.

## Templates (pre-drafted so you don't write them at 2 AM)

### Tester notification (data loss only, no exposure)

> Hi [name], we hit a bug in Tailor Pad v[version] that wiped local data on some devices. We've fixed it in v[next] (just released via OTA). Can you please:
> 1. Open the app and confirm whether your data is still there.
> 2. If not — and you have a recent backup file — import it via Drawer → Backup → Import.
> 3. Reply with what you see, even if everything's fine.
> Sorry for the disruption.

### Tester notification (PII exposure suspected)

> Hi [name], a security issue in Tailor Pad means there's a chance some of your customer measurement data was accessible to others. Specifically: [one-line description of what could leak — e.g., "your backup file shared via Drive could be readable by anyone with the link"]. We've [what you did]. Recommended actions: [revoke share, change link, etc.]. We're in touch with NDPC per Nigerian data-protection law. Reply with any questions; if you've shared with someone outside Tailor Pad, please let me know so we can scope this together.

### NDPC notification (skeleton)

> Subject: NDPA Article 40 breach notification — Tailor Pad
> Date of awareness: [date+time]
> Nature: [one paragraph — what happened, what data, how many subjects]
> Categories of personal data: customer names, body measurements
> Likely consequences: [be specific — embarrassment, identity-adjacent, etc.]
> Mitigation: [what you've done]
> DPO contact: [tobiloba's email]

## After the incident (within 7 days)

- Write the post-incident review in `docs/security/incidents/YYYY-MM-DD-<slug>.md`. Include: what happened, why it happened (root cause, not just symptom), what was missing in the threat model, what changed.
- Update `docs/security/threat-model.md` if a new threat was uncovered.
- Open the issue in the public repo (with PII redacted) once any embargo expires.

## What's NOT an incident

- A tester's phone is hot/slow → support, not security.
- A tester forgot their lock password → expected per the threat model; "Wipe lock and all data" is the documented recovery.
- A tester sees a UI glitch → Sentry-tracked bug, not an incident.

## Communication discipline

- **No PII** in Sentry breadcrumbs (already filtered in `utils/monitoring.ts`).
- **No tester names** in commit messages or PR descriptions.
- **No screenshots of customer data** in support threads.

If in doubt: ask before sending.
