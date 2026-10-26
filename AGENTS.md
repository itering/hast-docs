# Hast Docs Agent Instructions

Read `README.md` and `MAINTENANCE.md` before editing.

- Keep product documentation public-safe, accurate, and useful to a first-time reader.
- Retain English, Japanese, and Simplified Chinese page coverage and section IDs.
- Do not copy private engineering documents, customer information, credentials,
  deployment inventories, or raw operational responses into this repository.
- Keep examples free of credentials and real account data.
- Use TypeScript for new procedural scripts and the pinned Node.js/pnpm versions.
- Run `pnpm check`, `pnpm test`, and `pnpm build` before a merge.
- Do not add E2E flows or live product probes to CI. Local browser acceptance is
  separate from static checks and unit tests.
- An authorized mechanical documentation correction can be merged after its
  local checks pass and the reviewed PR head still matches. Use an imperative
  merge message. Do not bypass repository protection or enable auto-merge.
- Confirm the merge commit is on `main` and the Staging deployment reports that
  commit in `release.json`. Daily maintenance must stop at Staging. For an accepted stable product release, follow `RELEASES.md`; request only the fixed workflow and do not use deployment credentials directly.
