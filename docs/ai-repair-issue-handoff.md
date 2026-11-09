# AI repair issue handoff — Kalkulátor Bázis 2.1

## Purpose

The `.github/workflows/ai-repair-issue-handoff.yml` workflow makes a **GitHub Issue** from a narrow class of failed pull-request CI checks. It builds on the existing read-only diagnostics (#355) without replacing them.

This is **not automatic code repair or Copilot assignment yet**. It creates a bounded, reviewable coding-agent task. The repository owner may assign an eligible issue to GitHub Copilot and review its proposed PR.

## When it acts

Only when all of the following are true:

1. A `Site quality` workflow completes with `failure` and was triggered by a `pull_request` event.
2. The workflow run references **exactly one** pull request.
3. GitHub's current PR API says the PR is open, targets `main`, and its head branch belongs to this same repository; bot-authored PRs are ignored.
4. Every failed job step identified by the existing diagnostics classifier is categorized `generated-assets` (for example, `Verify committed asset fingerprints`).
5. There is **no already-open, GitHub Actions bot-authored Issue** containing the stable marker for that PR.

If any condition is not satisfied, the workflow skips issue creation. A GitHub API failure also stops it rather than reporting a misleading success. The workflow never treats a step-name classification as proof of the underlying cause.

The open Issue includes links to the original PR and failed Actions run and suggests:
`npm run ai:prepare` → review generated changes → commit intended files → `npm run ai:check`.

## How to use it

Navigate to GitHub **Issues** and find `CI repair: PR #... – generated asset fingerprints`. Read the linked CI logs and decide whether to assign the Issue to GitHub Copilot coding agent or handle it manually.

For Copilot assignment, the repository must have Copilot cloud agent enabled and the account must have eligible paid Copilot access. GitHub supports assignment via the Issue interface, or via REST/GraphQL with a user-to-server token. **No user PAT, API key, secret, or automatic Copilot assignment is configured by this PR.**

If a repair issue already exists for a PR, the workflow does not create an additional one as long as that issue is open. If it is later closed and the PR fails again, a new issue may be created.

## Security boundaries

- The workflow requests only `actions: read`, `contents: read`, and `issues: write`. Its only authorized persistent write is creating an Issue for an eligible PR.
- It checks out **trusted `main` only**, with persisted checkout credentials disabled. It does not execute untrusted PR code or read PR artifacts / raw logs.
- It validates repository identity, the triggering event, the live pull-request metadata and the failure category via GitHub APIs. Fork and bot PRs are skipped.
- The generated Issue body uses fixed instructions and GitHub-validated numeric PR/run identifiers. It does not copy arbitrary log lines or free-form PR metadata into an agent prompt.
- CI tests do not run with an issue-writing token. Only the final workflow step receives `GITHUB_TOKEN`.
- The concurrency group serializes handoffs from the same originating branch, and the Issue marker is checked before creation to reduce duplicates.
- This workflow must land on `main` before GitHub will trigger it automatically on a future failure.
- No automatic PR modification, test bypass, review approval, merge, release or deployment is permitted.

## Verification and next phase

The Node unit suite is `npm run test:ci-repair-handoff`, also included in the existing `test:build-pipeline` task used by `Site quality`.

The first real, qualifying failed PR run is the integration verification: confirm the newly created Issue, deduplication and job output. No synthetic CI failure is required to activate this feature.

The next separate phase could offer **opt-in Copilot assignment**, but only after explicit setup of a suitable user token and agreement on cost ceilings, maximum attempt count and mandatory human review. In particular, do not grant PR-branch code execution to a privileged `workflow_run` job.
