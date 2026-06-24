# Dynamic Download Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the build-time `generate-version-data.mjs` script with a client-side React hook so the download page always shows live release data without a redeploy.

**Architecture:** Move the fetch-and-parse logic from the Node.js prebuild script into a `useVersionData` hook that runs in the browser. `DownloadTable` components call the hook; the `<pre>` verification command block becomes a component too. The prebuild script, its npm hooks, and the static JSON file are removed entirely.

**Tech Stack:** React 18 hooks, browser `fetch`, DigitalOcean Spaces S3 ListObjectsV2 XML API (public, no auth), Docusaurus v3 / TypeScript.

## Global Constraints

- TypeScript strict mode — no `any`, no non-null assertions without justification.
- No new npm dependencies — use only browser fetch + stdlib.
- Docusaurus SSR: hooks that call `fetch` must run in `useEffect` (not at module level). Components must render a non-null placeholder during SSR/pre-render.
- S3 endpoint: `https://ams3.digitaloceanspaces.com/nethsecurity` (CORS already open — confirmed by package browser in `static/packages/browser.js`).
- CDN endpoint: `https://updates.nethsecurity.nethserver.org` — CORS may not be configured. The hook must degrade gracefully if `latest_release` fails (fall back to `stable[0].version`).
- `24.10.0` must be filtered from release lists (matches existing script behaviour).
- Version sort order: product scheme (8.x.x, major < 20) sorts above old date scheme (23.x, 24.x); within each scheme descending semver.

---

## File Map

| Action | File |
|---|---|
| **Create** | `src/hooks/useVersionData.ts` |
| **Modify** | `src/components/DownloadTable/index.tsx` |
| **Modify** | `docs/administrator-manual/installation/download.mdx` |
| **Modify** | `i18n/it/docusaurus-plugin-content-docs/current/administrator-manual/installation/download.mdx` |
| **Modify** | `docusaurus.config.ts` |
| **Modify** | `package.json` |
| **Modify** | `.gitignore` |
| **Delete** | `scripts/generate-version-data.mjs` |
| **Delete** | `src/data/versions.json` (gitignored, may not exist on disk) |

---

## Task 1: Create `useVersionData` hook

**Files:**
- Create: `src/hooks/useVersionData.ts`

**Interfaces:**
- Produces: `useVersionData(): UseVersionDataResult` where `UseVersionDataResult = {data: VersionData | null, loading: boolean, error: string | null}`
- Produces: exported types `Release` and `VersionData` (consumed by Task 2)

- [ ] **Step 1: Create the hook file**

```typescript
// src/hooks/useVersionData.ts
import {useState, useEffect} from 'react';

const BASE_URL = 'https://updates.nethsecurity.nethserver.org';
const S3_ENDPOINT = 'https://ams3.digitaloceanspaces.com';
const BUCKET = 'nethsecurity';

export type Release = {
  version: string;
  imageUrl: string;
  hashUrl: string;
  sbomUrl: string;
};

export type VersionData = {
  version: string;
  image: string;
  stable: Release[];
  dev: Release[];
};

export type UseVersionDataResult = {
  data: VersionData | null;
  loading: boolean;
  error: string | null;
};

type ParsedVersion = {
  major: number;
  minor: number;
  patch: number;
  pre: string | null;
  build: number | null;
};

function imageName(version: string): string {
  return `nethsecurity-${version}-x86-64-generic-squashfs-combined-efi.img.gz`;
}

function imageUrl(prefix: string, version: string): string {
  return `${BASE_URL}/${prefix}/${version}/targets/x86/64/${imageName(version)}`;
}

function hashUrl(prefix: string, version: string): string {
  return `${BASE_URL}/${prefix}/${version}/targets/x86/64/sha256sums`;
}

function sbomUrl(prefix: string, version: string): string {
  return `${BASE_URL}/${prefix}/${version}/targets/x86/64/nethsecurity-${version}-x86-64-generic.bom.cdx.json`;
}

function parseVersion(tag: string): ParsedVersion | null {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([^-]+))?(?:-(\d+)-g[0-9a-f]+)?$/.exec(tag);
  if (!m) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    pre: m[4] ?? null,
    build: m[5] ? Number(m[5]) : null,
  };
}

function isNewScheme(v: ParsedVersion): boolean {
  // Product scheme (8.x.x) has major < 20; old date scheme (23.x, 24.x) has major >= 20.
  return v.major < 20;
}

function compareVersions(a: string, b: string): number {
  const va = parseVersion(a);
  const vb = parseVersion(b);
  if (va && vb) {
    if (isNewScheme(va) !== isNewScheme(vb)) {
      return isNewScheme(va) ? -1 : 1;
    }
    for (const k of ['major', 'minor', 'patch'] as const) {
      if (va[k] !== vb[k]) return vb[k] - va[k];
    }
    if (!va.pre && vb.pre) return -1;
    if (va.pre && !vb.pre) return 1;
    if (va.pre && vb.pre && va.pre !== vb.pre) return vb.pre.localeCompare(va.pre);
    const ba = va.build ?? -1;
    const bb = vb.build ?? -1;
    if (ba !== bb) return bb - ba;
    return 0;
  }
  if (va && !vb) return -1;
  if (!va && vb) return 1;
  return b.localeCompare(a);
}

async function listReleaseFolders(prefix: string): Promise<string[]> {
  const url =
    `${S3_ENDPOINT}/${BUCKET}?list-type=2&delimiter=/&prefix=` +
    encodeURIComponent(prefix + '/');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`S3 list ${prefix}: HTTP ${res.status}`);
  const xml = await res.text();
  const folders: string[] = [];
  const re = /<Prefix>([^<]+)<\/Prefix>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const entry = m[1].replace(new RegExp(`^${prefix}/`), '').replace(/\/$/, '');
    if (entry && entry !== prefix) folders.push(entry);
  }
  return folders;
}

function buildRows(prefix: string, versions: string[]): Release[] {
  return versions.map((v) => {
    const parsed = parseVersion(v);
    const hasSbom = parsed != null && isNewScheme(parsed);
    return {
      version: v,
      imageUrl: imageUrl(prefix, v),
      hashUrl: hashUrl(prefix, v),
      sbomUrl: hasSbom ? sbomUrl(prefix, v) : '',
    };
  });
}

async function collectReleases(prefix: string): Promise<string[]> {
  let folders = await listReleaseFolders(prefix);
  folders = folders.filter((e) => e !== '24.10.0');
  folders.sort(compareVersions);
  return folders;
}

export function useVersionData(): UseVersionDataResult {
  const [data, setData] = useState<VersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [versionText, stableFolders, devFolders] = await Promise.all([
          // Degrade gracefully if latest_release has CORS issues.
          fetch(`${BASE_URL}/stable/latest_release`)
            .then((r) => (r.ok ? r.text() : ''))
            .catch(() => ''),
          collectReleases('stable'),
          collectReleases('dev'),
        ]);

        if (cancelled) return;

        const stable = buildRows('stable', stableFolders);
        const dev = buildRows('dev', devFolders);
        const version = versionText.trim() || stable[0]?.version ?? '';

        setData({version, image: version ? imageName(version) : '', stable, dev});
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return {data, loading, error};
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/giacomo/projects/nethsecurity/nethsecurity-docs
yarn tsc --noEmit 2>&1 | head -30
```

Expected: no errors referencing `src/hooks/useVersionData.ts`.

---

## Task 2: Refactor `DownloadTable` component

**Files:**
- Modify: `src/components/DownloadTable/index.tsx` (currently 64 lines)

**Interfaces:**
- Consumes: `useVersionData`, `Release`, `VersionData` from `@site/src/hooks/useVersionData`
- Produces: `StableReleases`, `DevReleases`, `ImageVerifyCommand` (exported React components — consumed by Task 3)
- **Removes**: `Version`, `ImageName`, `DownloadUrl` exports (no longer needed — nothing in the repo uses them after this change)

- [ ] **Step 1: Verify nothing else imports the removed exports**

```bash
grep -r "ImageName\|DownloadUrl\|Version\b" \
  /home/giacomo/projects/nethsecurity/nethsecurity-docs/docs \
  /home/giacomo/projects/nethsecurity/nethsecurity-docs/i18n \
  /home/giacomo/projects/nethsecurity/nethsecurity-docs/src \
  --include="*.tsx" --include="*.mdx" --include="*.md" -l
```

Expected: only `src/components/DownloadTable/index.tsx` itself. If other files appear, update them before proceeding.

- [ ] **Step 2: Rewrite the component file**

```typescript
// src/components/DownloadTable/index.tsx
import type {ReactNode} from 'react';
import {useVersionData} from '@site/src/hooks/useVersionData';
import type {Release} from '@site/src/hooks/useVersionData';

function ReleaseTable({rows}: {rows: Release[]}): ReactNode {
  if (!rows || rows.length === 0) {
    return <p>No releases available.</p>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Version</th>
          <th>Image</th>
          <th>Hash</th>
          <th>SBOM</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.version}>
            <td>{r.version}</td>
            <td>
              <a href={r.imageUrl}>x86-64</a>
            </td>
            <td>
              <a href={r.hashUrl}>SHA256</a>
            </td>
            <td>{r.sbomUrl ? <a href={r.sbomUrl}>CDX</a> : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function StableReleases(): ReactNode {
  const {data, loading, error} = useVersionData();
  if (loading) return <p>Loading releases…</p>;
  if (error) return <p>Could not load releases: {error}</p>;
  return <ReleaseTable rows={data?.stable ?? []} />;
}

export function DevReleases(): ReactNode {
  const {data, loading, error} = useVersionData();
  if (loading) return <p>Loading releases…</p>;
  if (error) return <p>Could not load releases: {error}</p>;
  return <ReleaseTable rows={data?.dev ?? []} />;
}

// Renders the sha256 verification command with the live latest image name.
export function ImageVerifyCommand(): ReactNode {
  const {data, loading} = useVersionData();
  const name = loading
    ? '…'
    : (data?.image ?? 'nethsecurity-<version>-x86-64-generic-squashfs-combined-efi.img.gz');
  return (
    <pre>
      <code>{`grep ${name} sha256sums | sha256sum -c`}</code>
    </pre>
  );
}
```

- [ ] **Step 3: TypeScript check**

```bash
cd /home/giacomo/projects/nethsecurity/nethsecurity-docs
yarn tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

---

## Task 3: Update download pages (EN + IT)

**Files:**
- Modify: `docs/administrator-manual/installation/download.mdx`
- Modify: `i18n/it/docusaurus-plugin-content-docs/current/administrator-manual/installation/download.mdx`

**Interfaces:**
- Consumes: `ImageVerifyCommand` exported from Task 2

- [ ] **Step 1: Update English download page**

Replace the entire file content of `docs/administrator-manual/installation/download.mdx`:

```mdx
---
title: Download
sidebar_position: 2
---

import {StableReleases, DevReleases, ImageVerifyCommand} from '@site/src/components/DownloadTable';

# Download {#download-section}

The table contains the following links for each release:

- the x86-64 image file, used to install NethSecurity
- the sha256sums file, which contains the SHA256 checksums to verify the integrity of the downloaded image
- the SBOM (Software Bill of Materials) file, in CDX (CycloneDX) format which contains the list of all software packages included in the image

Begin by downloading the most recent x86_64 image from the table below.

For verification, download also the hash file and execute the following command in a Linux shell to ensure the integrity of the downloaded image:

<ImageVerifyCommand />

To proceed with the installation of NethSecurity, you have two options: write the downloaded image directly to your disk or create a bootable USB stick. Refer to the [installation](./install.mdx) page for detailed instructions on both methods.

You can use the [package browser](pathname:///packages/) to explore all available releases, download images, hash files, and packages directly.

The tables below list the available releases along with their respective download links.

## Stable releases

<StableReleases />

## Development releases

<DevReleases />
```

- [ ] **Step 2: Update Italian download page**

Replace the entire file content of `i18n/it/docusaurus-plugin-content-docs/current/administrator-manual/installation/download.mdx`:

```mdx
---
title: Download
sidebar_position: 2
---

import {StableReleases, DevReleases, ImageVerifyCommand} from '@site/src/components/DownloadTable';

# Download {#download-section}

La tabella contiene i seguenti link per ogni versione:

- il file immagine x86-64, utilizzato per installare NethSecurity
- il file sha256sums, che contiene i checksum SHA256 per verificare l'integrità dell'immagine scaricata
- il file SBOM (Software Bill of Materials), nel formato CDX (CycloneDX) che contiene l'elenco di tutti i pacchetti software inclusi nell'immagine

Inizia scaricando l'immagine x86_64 più recente dalla tabella sottostante.

Per la verifica, scarica anche il file hash ed esegui il seguente comando in una shell Linux per assicurare l'integrità dell'immagine scaricata:

<ImageVerifyCommand />

Per procedere con l'installazione di NethSecurity, hai due opzioni: scrivere l'immagine scaricata direttamente sul disco oppure creare una chiavetta USB avviabile. Fai riferimento alla pagina [installazione](./install.mdx) per istruzioni dettagliate su entrambi i metodi.

Puoi usare il [browser dei pacchetti](pathname:///packages/) per esplorare tutte le versioni disponibili e scaricare immagini, file hash e pacchetti direttamente.

Le tabelle sottostanti elencano le versioni disponibili insieme ai rispettivi link di download.

## Versioni stabili

<StableReleases />

## Versioni di sviluppo

<DevReleases />
```

---

## Task 4: Remove build-time infrastructure

**Files:**
- Modify: `docusaurus.config.ts` — remove `productVersion` read block and `customFields`
- Modify: `package.json` — remove `prestart` and `prebuild` scripts
- Modify: `.gitignore` — remove `/src/data/versions.json` entry
- Delete: `scripts/generate-version-data.mjs`
- Delete: `src/data/versions.json` (if present on disk)

**Interfaces:**
- Consumes: nothing from previous tasks — this is pure cleanup

- [ ] **Step 1: Remove `productVersion` from `docusaurus.config.ts`**

Find and remove these lines from `docusaurus.config.ts`:

```typescript
import * as fs from 'fs';
```

```typescript
let productVersion = '';
try {
  productVersion = JSON.parse(
    fs.readFileSync('./src/data/versions.json', 'utf8'),
  ).version;
} catch {
  // versions.json is absent on a fresh checkout; the prebuild script creates it.
}
```

```typescript
  customFields: {
    productVersion,
  },
```

Also remove the comment on line 8 (`// The latest NethSecurity version…`).

After removal, confirm `docusaurus.config.ts` still has a valid `const config: Config = {` block with no dangling commas.

- [ ] **Step 2: Remove prebuild hooks from `package.json`**

Remove these two lines from the `"scripts"` object:

```json
"prestart": "node ./scripts/generate-version-data.mjs",
"prebuild": "node ./scripts/generate-version-data.mjs",
```

- [ ] **Step 3: Remove gitignore entry**

In `.gitignore`, remove the line:

```
/src/data/versions.json
```

- [ ] **Step 4: Delete the script and data files**

```bash
rm /home/giacomo/projects/nethsecurity/nethsecurity-docs/scripts/generate-version-data.mjs
rm -f /home/giacomo/projects/nethsecurity/nethsecurity-docs/src/data/versions.json
```

- [ ] **Step 5: TypeScript check**

```bash
cd /home/giacomo/projects/nethsecurity/nethsecurity-docs
yarn tsc --noEmit 2>&1 | head -30
```

Expected: no errors. If `customFields` removal broke a plugin or theme reference, fix it before proceeding.

---

## Task 5: Build validation + manual smoke test

**Files:** none — validation only

- [ ] **Step 1: Full build**

```bash
cd /home/giacomo/projects/nethsecurity/nethsecurity-docs
yarn build 2>&1 | tail -40
```

Expected: exits 0. Warnings about `/packages/` footer link are benign (pre-existing). No MDX parse errors, no broken-link errors on the download page.

- [ ] **Step 2: Start dev server**

```bash
yarn start
```

Open `http://localhost:3000/docs/administrator-manual/installation/download` in a browser.

Verify:
- "Loading releases…" placeholder appears briefly on first load.
- Tables populate with real versions (stable and dev rows visible).
- `ImageVerifyCommand` renders the actual image filename, not `…` or the fallback placeholder.
- Clicking an Image/Hash/SBOM link opens the correct CDN URL.

- [ ] **Step 3: Verify Italian locale**

Open `http://localhost:3000/it/docs/administrator-manual/installation/download`.

Verify: same dynamic behaviour, Italian prose, `<ImageVerifyCommand />` shows the same live image name.

- [ ] **Step 4: Commit**

```bash
git add \
  src/hooks/useVersionData.ts \
  src/components/DownloadTable/index.tsx \
  docs/administrator-manual/installation/download.mdx \
  "i18n/it/docusaurus-plugin-content-docs/current/administrator-manual/installation/download.mdx" \
  docusaurus.config.ts \
  package.json \
  .gitignore \
  docs/superpowers/plans/2026-06-24-dynamic-download-table.md
git rm scripts/generate-version-data.mjs
git commit -m "feat: fetch download table data client-side instead of at build time

Remove the prestart/prebuild generate-version-data.mjs script.
Move version-fetching logic into useVersionData hook (browser fetch).
Add ImageVerifyCommand component for live image-name substitution.
"
```

---

## Self-Review

**Spec coverage:**
- Hook ports all logic from `generate-version-data.mjs` ✓
- `StableReleases` / `DevReleases` use hook ✓
- `ImageVerifyCommand` replaces inline `{versions.image}` interpolation ✓
- EN + IT download pages updated ✓
- Prebuild script removed ✓
- Config `productVersion` removed (unused since VersionFooter was removed) ✓
- CORS degradation for `latest_release` handled ✓
- `24.10.0` filter preserved ✓
- Version sort order preserved ✓

**Placeholder scan:** none found.

**Type consistency:** `Release` type defined once in `useVersionData.ts`, imported into `DownloadTable/index.tsx`. `UseVersionDataResult` used only in hook return and component destructuring — consistent.
