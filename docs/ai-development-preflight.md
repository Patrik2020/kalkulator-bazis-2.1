# AI development preflight (Kalkulátor Bázis 2.1)

This is a local, two-phase safety check for AI coding agents and human maintainers. It does not merge PRs or deploy the site, and it does not replace GitHub Actions.

## Prerequisites

Use a separate task branch, Node.js >=24.8.0 and `npm ci`. Work on the latest `main`; check for open PRs with overlapping files.

## Prepare source and generated output

After making the requested changes:

```sh
npm run ai:prepare
git status --short
git diff --check
git diff
```

`ai:prepare` runs the canonical `npm run static:build` pipeline and checks whitespace errors. **It can modify tracked generated files** (e.g. homepage fragments, fingerprints, sitemap). It never stages or commits anything. Review each change, discard unrelated drift and commit only the intended source and generated files to your task branch. If a change is unexpected, investigate before committing.

## Verify before opening the PR

From a **clean, committed working tree**:

```sh
npm run ai:check
```

`ai:check` verifies the tree is clean, runs the canonical build, rejects any new generated diff, runs `npm run quality`, runs `npm run test:build-pipeline` (including the preflight's own unit tests), and ensures there are no uncommitted changes after testing.

If the build introduces differences, **do not bypass the check**. Review the changed files, determine whether they are correct, commit only necessary changes, and rerun. The command deliberately does not auto-commit; mistakes in financial results, tax rules, translations or content must be reviewed.

## CI and delivery

The existing GitHub Actions PR workflows remain mandatory, including Site quality, browser regression, and repository security checks. These workflows cover additional specialized checks beyond `ai:check`.

On CI failure: read the exact job logs, repair the root cause on the same task branch, and rerun checks. Do not weaken branch protection or skip required tests. Keep high-risk tax/financial/API changes under explicit review. Merge/deploy only after the repository owner's authorization.

## What this first version does not do

This preflight does **not** itself watch GitHub Actions, dispatch an AI agent, retry failed CI, merge PRs, or publish news automatically. Those capabilities need a separate, permission-limited automation after the manual workflow proves reliable.
