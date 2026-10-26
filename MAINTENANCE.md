# Public Documentation Maintenance

## Sources and scope

Maintain product usage guides and the public AIP API reference. Use checked-in
product contracts, UI behavior, tests, and public schemas as evidence. A feature
in source code is not evidence that the feature is available in production.
Describe deployment availability only when the corresponding release is known.

Private implementation access is read-only. Do not publish internal engineering
notes or copy private source trees. Keep the evidence range in the PR body;
retain detailed private source notes outside this repository.

## Method

1. Inspect the latest main branches and any existing maintenance PR first.
2. Compare changes since the last successful checkpoint. State the actual
   coverage; a focused correction is not a complete historical audit.
3. Update only the affected guides, translations, links, screenshots, navigation,
   examples, or public API snapshot. Search for duplicate explanations first.
4. Explain the change in terms of the user's task. Keep implementation details
   out of user-facing instructions unless the reader needs them to act.
5. Run the repository checks and review the complete diff for public safety.
6. Push one maintenance branch and create or update one PR. Re-read its head
   before merging. If it changed, review and validate the new head.
7. For an authorized mechanical correction, merge with an exact head match and
   an imperative commit message. Confirm its merge commit is on main.
8. Verify the Staging deployment and its source commit. Report failed or pending
   deployment separately from a successful merge. Daily maintenance stops at Staging. An accepted stable product release uses the narrow publication handoff in [RELEASES.md](RELEASES.md).

## Runtime

Use a separate workspace and private progress checkpoint for this project.
Run one writer per docs repository. Do not reset unrelated work, force-push,
broaden credentials, edit another project's settings, or create new automations.
Keep generated output and caches outside content directories and exclude them
from Git. If no correction is needed, leave the repository unchanged and record
the inspected source range. Scheduled no-change runs should be quiet.
