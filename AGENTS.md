# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Commit messages

- Write **all commit messages in English**. This is a public, English-first project;
  Chinese commit subjects mixed into the English GitHub UI look out of place.

## Docs

- `README.md` is the primary (English) documentation; `README-cn.md` is the Chinese translation.
  Keep the two in sync when features or deployment change.
- Screenshots live in `docs/screenshots/` and are referenced from both READMEs.

## Checks

Run these before committing:

```bash
npm run lint
npm test
npm run build
```
