# Agent Guide: NethSecurity Documentation

This repository contains the [Docusaurus](https://docusaurus.io/)-based
documentation for NethSecurity, the Unified Threat Management solution based on
OpenWrt. It was migrated from the previous Sphinx/reStructuredText sources.

## Build commands

```bash
# Install dependencies (Node.js >= 18)
yarn install

# Start a local dev server with hot reload (runs the version script first)
yarn start

# Build the static site (validates MDX, links and anchors)
yarn build

# Serve the production build locally
yarn serve

# Regenerate the version/download data only
yarn gen:versions
```

Always run `yarn build` before submitting changes: it fails on broken MDX and
reports broken links and anchors.

## Architecture

- The site is split into two manuals, each rendered as its own sidebar
  (see `sidebars.ts` and the navbar in `docusaurus.config.ts`):
  - `docs/administrator-manual/` — install, configure and manage NethSecurity.
    Chapters are grouped into subfolders (`about/`, `installation/`,
    `monitoring/`, `system/`, `network/`, `users-objects/`, `firewall/`,
    `security/`, `vpn/`, `high-availability/`, `advanced-cli/`,
    `best-practices/`), each with a `_category_.json` (sidebar label +
    position).
  - `docs/tutorial/` — step-by-step guides. New tutorials are imported from the
    Nethesis helpdesk using the `freshdesk-to-tutorial` skill
    (`.agents/skills/freshdesk-to-tutorial/`).
- Each manual root has an `index.md` with a `slug:` so the navbar/footer links
  resolve.
- `docusaurus.config.ts` sets `markdown.format: 'detect'`, so `.md` files are
  parsed as CommonMark (tolerant of bare `<...>`/`{...}`) and `.mdx` as MDX.
- **Dynamic version data:** `scripts/generate-version-data.mjs` runs before
  `start`/`build` (npm `prestart`/`prebuild` hooks). It fetches the latest
  release tag and lists the public release bucket, writing
  `src/data/versions.json` (gitignored). The download/install pages
  (`installation/download.mdx`, `installation/install.mdx`) and the
  `DownloadTable` component consume this data; `docusaurus.config.ts` reads the
  version into `customFields.productVersion`.
- **Search:** the kapa.ai AI widget is injected via the `src/kapa.js` client
  module. Algolia DocSearch is wired in `themeConfig.algolia` with placeholder
  keys — fill them in once provisioned.
- **Branding:** logo is `static/img/logo.svg` (the NethSecurity wordmark);
  favicon is `static/img/favicon.png`. The brand accent is cyan (`#0891b2`),
  set in `src/css/custom.css`.
- **Images** are served from `static/` and referenced with absolute paths such
  as `/_static/high_availability.png`.
- **Internationalization:** English only for now. The `i18n/it/` tree is
  scaffolded for a later translation pass — re-add `it` to `i18n.locales` and
  restore the `localeDropdown` navbar item once Italian content exists.

## Markdown conventions

- One top-level `#` heading per file; the page `title` is set in frontmatter.
- Use explicit heading ids where other pages link to them:
  `## My section {#my-section}`.
- UI elements (buttons, fields) use bold: `**Save**`.
- File paths, commands and config keys use inline code: `` `ns-install` ``.
- Admonitions use the Docusaurus syntax (`:::note`, `:::warning`, `:::tip`,
  `:::info`, `:::danger`).
- Pages that need the live version/image name must be `.mdx` and interpolate the
  imported `versions.json` (code fences cannot contain components — use
  `<pre><code>{`...`}</code></pre>`).

## Editorial conventions

These rules apply to both English (`docs/`) and Italian
(`i18n/it/docusaurus-plugin-content-docs/current/`) sources; keep the two
locales structurally parallel.

- **Sentence case titles** — capitalize only the first word and proper nouns
  (brands like NethSecurity/NethServer/Nethesis, product/feature names such as
  Threat Shield, FlashStart, Netify Informatics, WireGuard, OpenVPN, Cerbeyra,
  and acronyms like DNS, VPN, NAT, QoS, DPI, IPS, UCI). Never use ALL-CAPS and
  never Title-Case every word.
  - Wrong: `YOROI BLACKLIST AND NUMBER OF DEVICES TO PROTECT`,
    `Possible Solutions`, `Content Filtering`
  - Right: `YOROI blacklist and number of devices to protect`,
    `Possible solutions`, `Content filtering`
  - Applies to the frontmatter `title:`, the `#` H1, and every `##`/`###`
    sub-heading. Keep the `title:` and the H1 in sync, and never alter an
    existing `{#anchor}` when editing a heading.
- **Links** — every internal and external link must resolve. `yarn build` fails
  on broken links and anchors; run it before submitting.
- **Index parity** — each manual-root `index.md`
  (`administrator-manual/index.md`, `tutorial/index.md`) must list its sections
  in the same order the sidebar renders them (`_category_.json` `position` and
  per-page `sidebar_position`), in both locales.
- **Tutorial order** — tutorials follow this canonical sequence in both
  locales (set via `sidebar_position` and mirrored in `tutorial/index.md`):
  FAQ → Troubleshooting → GDPR compliance → remaining chapters (alphabetical)
  → Nethesis Threat Shield → Cerbeyra probe (these last two pinned to the end).

## CI

- `.github/workflows/deploy.yml` — builds and deploys to GitHub Pages on push
  to `main`.
- `.github/workflows/test-deploy.yml` — test build on pull requests.

## One-shot migration scripts

`scripts/convert_rst.py` performed the original Sphinx→Docusaurus conversion
(pandoc + cleanup). It is kept for reference; the `.rst` sources no longer live
in this repo.
