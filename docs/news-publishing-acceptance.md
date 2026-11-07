# News publishing acceptance criteria

Target: within 10 minutes of the owner's explicit approval, the approved article is publicly reachable on the production site. This is a target, not a guarantee until measured.

## Required workflow
1. Draft article is stored separately from production and sent for review with a stable preview and unique article identifier.
2. Approval is bound to that exact article revision; editing after approval requires renewed approval.
3. An approved revision is queued once (idempotency key); retry must not duplicate the article.
4. A publisher builds the article, homepage news listing, news index, sitemap, fragments, asset hashes and service-worker version using the canonical build.
5. Required CI gates stay enabled. Never bypass tests to meet the time target.
6. After deploy, probe the public article URL and the news index; only then report 'published'.
7. On failure, notify with actionable error and retry transient failures safely. Report a missed 10-minute target instead of claiming success.
8. Record approval time, queue time, CI duration, deployment time and successful public verification time. Alert before the target is missed.

## Verification before declaring done
- Successful end-to-end test using an approved test article, with timestamps.
- Repeated approval creates no duplicate publication.
- CI failure does not mark an article published.
- A new commit after approval cannot silently replace approved content.
- Public URL and index both show the article after deployment.
- Repeated trials meet the 10-minute target; document exceptions.

Current state: acceptance criteria only. The existing news-preflight command is not a deployed publication service and does not yet implement this workflow.
