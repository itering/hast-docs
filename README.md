# Hast Docs

Public product documentation for Hast AIP, Task Agent, GTM, and accounts.
The repository owns the documentation content, its UI, images, and public API
snapshot. It has no dependency on a private repository or a running Hast backend.

- [Staging documentation](https://hast-docs-stg.vercel.app/en/docs/overview)
- [Hast](https://hast.so)
- Languages: English, Japanese, and Simplified Chinese

## Development

Use Node.js 24 and pnpm 11.7.0, as specified in `.nvmrc` and `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3219/en/docs/overview`. Set the public origins in
`.env.local` when needed. No token or product account is required to build docs.

## Content and checks

- `content/docs/{en,ja,zh-CN}` contains the product pages.
- `src/content/docs` contains navigation, translations, search registration,
  and the public API snapshot adapter.
- `src` contains the documentation components and MDX plugins.
- `public/docs` contains shared, public-safe screenshots.
- `public/openapi/task-agent.json` contains the public AIP API snapshot.

Keep page slugs, section IDs, API fields, and limits aligned across languages.
Register a new page in the catalogue and each content registry. Check the
complete affected documentation flow, including its links and images.

```sh
pnpm check
pnpm test
pnpm build
```

The build exports static files into `out/` and checks every translated page.
Do not put generated output inside the content tree.

## Deployment

A push to `main` runs the checks and deploys only Staging. The deployment writes
`release.json` with the exact source commit and run. Staging is excluded from
search indexing. An accepted stable product release invokes `Publish product
docs`, which publishes one compatible docs commit after its exact Staging run
passes. See [release ownership and recovery](RELEASES.md).

The separate `Deploy docs production` manual workflow remains available for an
explicitly authorized correction. It requires a full main source SHA and its
successful Staging push run. Both paths use the same build and deployment
implementation. A production export enables search indexing and uses
`https://docs.hast.so` for canonical URLs and the sitemap.

These workflows publish only the `hast-docs` Vercel project. Existing
`/{locale}/docs/{slug}` and legacy `task-api-*` paths remain valid. The main Hast
website keeps its marketing, customer stories and legal content; its old docs
URLs redirect to the separate docs site.

## License

Prose and documentation images use [CC BY 4.0](LICENSE-DOCS.md). Code uses
[MIT](LICENSE-CODE.md). Font licenses are included with the font files.
Hast names and logos identify the product; the license grants no trademark rights.

See [the maintenance guide](MAINTENANCE.md) for automated contributions.

## Agent ownership and releases

See [RELEASES.md](RELEASES.md) for daily Staging maintenance, stable product Docs
Production publication, recovery, and the two Agent responsibilities.
