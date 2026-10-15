# CI policy: fast editorial changes, strong protection for functional changes

The repository uses change-scoped GitHub Actions. Do not disable quality/security
checks to make a red PR appear green.

## Editorial-only PRs

Changes to `aktualis/**`, `aktualis.html`, and sitemap/content metadata run
**Site quality** and **Repository security baseline**. If the URL rules change,
**URL consolidation** runs too. These PRs do not need the full browser matrix,
the 132-page Chrome materialization pipeline, or the AdSense transformation suite.

## Functional PRs

- Calculator pages and JavaScript: browser regression plus the relevant
  calculator-specific checks.
- Shared UI, CSS, navigation, global JavaScript: browser regression.
- Static HTML generator, normalization, shared head config, layout templates:
  static-first materialization and drift verification.
- Monetization policy or AdSense templates: AdSense quality audit.
- Every PR: Site quality and repository security baseline.
- Production: existing main-branch smoke and scheduled checks.

## Before opening a PR

1. Keep changes narrowly scoped; do not regenerate unrelated HTML pages.
2. Run `npm run quality` and relevant targeted tests locally when practical.
3. For generator changes, run the documented static build and commit its output.
4. For content changes, verify the source, dates, links and sitemap metadata.
5. If CI fails, read the first failing step; do not rerun blindly or suppress errors.

GitHub branch protection still requires a pull request. No automated merge,
no surprise bot push to PR branches, and no skipped security validation.

**Important:** Path filters decide when workflows start, not whether the site
is correct. A real bug can still produce a red check. This policy reduces
irrelevant work; it does not promise zero failures.
