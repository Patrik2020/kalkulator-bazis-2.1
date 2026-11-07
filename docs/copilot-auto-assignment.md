# Opt-in Copilot cloud agent assignment — Kalkulátor Bázis 2.1

This optional phase builds on the existing CI diagnostics (#355) and repair Issue handoff (#358). **It is disabled by default and does not authorize automated merging, production deployment, or tax/calculation changes.**

## What happens when enabled?

When the existing trusted `AI repair issue handoff` workflow creates or finds a qualifying generated-asset repair Issue, a separate step can assign it to GitHub Copilot cloud agent, using GitHub's REST issue-assignee API.

Before sending any assignment, the script verifies:

1. The triggering workflow run is a failed `Site quality` run from exactly one PR.
2. The PR is still open, is from the same repository, targets `main`, is not bot-authored and its head SHA matches the failed run.
3. The failure is *exclusively* the allowlisted `generated-assets` category.
4. An open handoff Issue exists with the expected marker and was created by `github-actions[bot]`.
5. The Issue has no existing assignees, and it was created on the same UTC day.
6. Fewer than **two** automated repair Issues have been assigned to Copilot during the current UTC day.

The workflow serializes handoffs across branches to avoid simultaneous assignments exceeding the daily allowance. If any prerequisite is missing, the agent is **not** assigned; GitHub API errors fail the step visibly.

When assigned, Copilot receives explicit instructions to produce a **reviewable repair PR based on the existing feature branch**, not `main`. The developer must still examine and merge that fix PR into the feature branch, rerun the original PR CI, and explicitly approve the final original PR merge. Copilot may not actually succeed in making the repair.

**This opt-in does not make the original broken PR green by itself.** It creates a *second*, narrowly scoped repair PR for human review.

## Required setup (only when the owner wishes to enable it)

1. Confirm **paid GitHub Copilot access** and that GitHub Copilot cloud agent is enabled for the repository. In a GitHub Issue, check that **Copilot** is available under **Assignees**.
2. Obtain a suitable **user-to-server** GitHub token (e.g., a short-lived, fine-grained personal access token) scoped to this repository. GitHub's current preview documentation for Copilot issue assignment states that fine-grained tokens require **Metadata: read** and **Actions, Contents, Issues, Pull requests: read/write**. These are broad permissions: assess the risk carefully before storing a token. A normal `GITHUB_TOKEN` or installation token is *not* a substitute for this assignment API.
3. Store the token as a **GitHub Actions repository secret** named `KB_COPILOT_ASSIGNMENT_TOKEN`; never commit it, paste it into a PR, or send it in chat.
4. After checking that the secret and Copilot access work, add the **repository variable** `KB_COPILOT_AUTO_ASSIGN` with the literal value `true` under GitHub **Settings → Secrets and variables → Actions → Variables**. This is the **explicit opt-in switch**. Remove it or set it to `false` to stop future automatic assignments.
5. Test on a controlled, low-risk repair Issue and inspect the GitHub Actions `AI repair issue handoff` job summary. No artificial failing financial-calculation tests should be introduced merely to test assignment.

The secret is exposed **only to the opt-in assignment step**, after the read-only validation and Issue creation. No untrusted PR code is checked out or executed in the privileged workflow.

## Safety, costs and limitations

- Maximum **two** newly created repair Issues per UTC day can be automatically assigned (counted among GitHub Actions bot-authored repair Issues). This is an operational cap, **not a guarantee of a fixed dollar charge**: Copilot pricing, plan limits and premium-request consumption are separate.
- Assignments are **not retroactive**: older Issues are skipped and must be manually assigned if desired.
- The category is currently limited to **generated asset fingerprints**. Security, salary/tax, finance, API, localization, news and general CI failures do **not** trigger automatic assignments.
- Every assignment is a user-authorized external action performed by GitHub Actions after opt-in. GitHub's Copilot API is still in public preview; the provider may change the requirements or behavior.
- The workflow cannot verify the full root cause from step names. The agent must inspect the actual CI logs and avoid guessing.
- Broadly privileged user tokens carry risk. Prefer limited repository scope, short expiration and rotation. Disable the switch and revoke the secret if any unexpected behavior occurs.
- Creating repair PRs does not replace branch protections or mandatory human approval.

## Validation

```sh
npm run test:copilot-auto-assignment
```

Tests are also included in the existing `npm run test:build-pipeline` package script, which runs inside `Site quality`. The real GitHub API integration remains **unverified** until the account opts in, supplies valid credentials, and tests a qualifying failure.
