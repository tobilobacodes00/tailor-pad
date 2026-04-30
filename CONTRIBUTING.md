# Contributing to Tailor Pad

Thanks for your interest. This is a small, single-developer project right now — contributions are welcome but please keep the bar high so review stays manageable.

## Before opening a PR

Run all three of these locally — they're what CI runs on every PR:

```bash
npx tsc --noEmit
npx expo lint
npm test
```

All three must pass. The `react-native/no-unused-styles` rule is intentionally off (it false-positives on the `makeStyles(colors)` factory pattern); please don't re-enable.

## Scope guidelines

- **Bug fixes** — open a PR. Include reproduction steps in the description.
- **Small UX improvements** (typo fixes, copy tweaks, accessibility annotations, color/contrast tweaks) — open a PR.
- **New features / new dependencies / architecture changes** — please open an issue first to discuss before writing code. Keeps you from sinking time into a direction that won't merge.
- **Security issues** — do **not** open a public issue. Email `seunainascott@thegoodstuff.com.ng`. See [SECURITY.md](./SECURITY.md).

## Style

- TypeScript strict mode, no `any`.
- Match the existing code style — formatting follows Prettier defaults via the Expo lint config; no `prettier --write` is run as part of CI but consistency is appreciated.
- Avoid adding code comments that just restate what the code does. Comments should explain *why* something non-obvious is the way it is.
- Don't add backwards-compatibility shims, feature flags, or "in case we need it later" abstractions. Three similar lines beats a premature abstraction.

## Threat model & privacy

If your change touches the lock flow, AsyncStorage persistence, the backup import/export path, or any part of how customer measurements are stored or shared, please:

1. Read [`docs/security/threat-model.md`](./docs/security/threat-model.md) first.
2. In the PR description, note which threats you considered and any new mitigations or accepted risks.

For changes that touch how customer data is collected/stored, also re-read [`docs/PRIVACY.md`](./docs/PRIVACY.md) — Tailor Pad is NDPA-scoped and any data-flow change may need the privacy notice updated too.

## Domain vocabulary

The app is built for tailors. Field names and UI copy use Nigerian-tailoring vocabulary (e.g. "Round Sleeve", "Native"). If you're proposing field-name changes, talk to a working tailor first — generic Western tailoring terms aren't always right.

## Releases

See [`docs/HOW_TO_RELEASE.md`](./docs/HOW_TO_RELEASE.md). Releases are cut by the maintainer; contributors don't need to bump versions in PRs.

## License

By contributing, you agree your code will be licensed under the same [MIT License](./LICENSE) as the rest of the project.
