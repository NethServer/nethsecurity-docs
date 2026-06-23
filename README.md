# NethSecurity documentation

[Docusaurus](https://docusaurus.io/)-based documentation for
[NethSecurity](https://www.nethsecurity.org), the Unified Threat Management
solution based on OpenWrt.

## Development

Requires Node.js >= 18.

```bash
yarn install      # install dependencies
yarn start        # local dev server with hot reload
yarn build        # production build (validates MDX, links and anchors)
yarn serve        # serve the production build locally
```

`yarn start` and `yarn build` first run `scripts/generate-version-data.mjs`,
which fetches the latest NethSecurity release and the download tables into
`src/data/versions.json`.

## Structure

- `docs/administrator-manual/` — install, configure and manage NethSecurity
- `docs/tutorial/` — step-by-step guides
- `src/` — theme, components and pages
- `static/` — images and other static assets
- `scripts/` — build-time data generation and the one-shot RST migration script

See [`AGENTS.md`](./AGENTS.md) for contributor and conventions detail.

## License

See [`LICENSE`](./LICENSE).
