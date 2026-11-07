# Copilot instructions — Kalkulátor Bázis 2.1

Read and follow the repository's root `AGENTS.md` before editing. Its build, testing, business, safety, and PR rules apply to all Copilot-generated changes.

- This is an existing Node.js >=24.8, static-first website; **do not rewrite it as 3.0** or introduce a new framework for routine changes.
- Prefer a small PR for one issue. Do not modify `main` directly, merge or deploy without the owner's authorization.
- Use real `package.json` scripts, not guessed commands; run affected tests and `npm run quality` for relevant source changes.
- Respect the canonical static build (`npm run static:build`); review and commit necessary generated files, including updated asset fingerprints and homepage fragments. A dirty post-build diff must be understood, not ignored.
- Preserve HU/EN/DE translations, calculation correctness, 9%/15% selectable tax scenarios, API compatibility, SEO, accessibility, and the intended maximum three authored ad placements per page.
- Never treat a tax proposal as enacted law. Use dated official sources for legal, financial and news content.
- On CI failure, inspect logs, fix the root cause on the same PR branch and rerun. Never bypass required checks; escalate after three focused unsuccessful cycles.
- In the PR, state what changed, tests **actually run**, remaining risks and safe rollback steps.
