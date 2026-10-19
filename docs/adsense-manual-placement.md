# Maximum three AdSense blocks per page

The AdSense account's Auto ads slider exposed a minimum of six ads on 2026-10-19.
The publisher therefore controls placement using the existing responsive display
unit `2032035454`. `adsensePolicy` selects manual placement with a hard maximum of
three requests per document. Existing page eligibility and CMP readiness remain
required. Short pages may have fewer suitable boundaries or unfilled units.

The controller inserts only siblings of substantial, non-interactive main-content
sections. It never inserts inside a calculator, its result, a form, or a paragraph.
Old dynamic calculator units and desktop Multiplex rails are inactive in manual
mode, avoiding extra units. Empty/failed slots are not retried. A viewport change
or repeated consent event cannot add a fourth unit.

## Required AdSense account settings

- Auto ads: OFF for kalkulatorbazis.hu (manual ad units remain enabled).
- Auto optimize: OFF for this site, so experiments cannot re-enable automatic formats.
- No whole-homepage exclusion is necessary.

Publish the controller before switching off Auto ads. The account changes are
independent of GitHub deployment and can take time to propagate. Do not claim a
live three-ad limit until the account settings have been saved and verified.

Rollback requires coordination of the account settings and the code: do not
re-enable Auto ads while claiming the three-unit limit. Never remove or hide
Google's automatically inserted ads with DOM manipulation to enforce a count.
