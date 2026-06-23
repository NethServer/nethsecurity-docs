// Generate src/data/versions.json at build time.
//
// Ports the dynamic logic that used to live in the Sphinx conf.py:
//  - fetch the latest stable release tag
//  - list the stable/ and dev/ release folders from the public
//    DigitalOcean Spaces bucket and build the download tables
//
// No AWS SDK dependency: the bucket is public, so we use the S3 ListObjectsV2
// XML API over plain HTTPS. If the network is unavailable (e.g. offline local
// build) the script writes a minimal fallback so the Docusaurus build still
// succeeds.

import {writeFile, mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const BASE_URL = 'https://updates.nethsecurity.nethserver.org';
const REGION = 'ams3';
const BUCKET = 'nethsecurity';
const S3_ENDPOINT = `https://${REGION}.digitaloceanspaces.com`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = `${__dirname}/../src/data/versions.json`;

function imageName(version) {
  return `nethsecurity-${version}-x86-64-generic-squashfs-combined-efi.img.gz`;
}

function imageUrl(prefix, version) {
  return `${BASE_URL}/${prefix}/${version}/targets/x86/64/${imageName(version)}`;
}

function hashUrl(prefix, version) {
  return `${BASE_URL}/${prefix}/${version}/targets/x86/64/sha256sums`;
}

function sbomUrl(prefix, version) {
  return `${BASE_URL}/${prefix}/${version}/targets/x86/64/nethsecurity-${version}-x86-64-generic.bom.cdx.json`;
}

// Parse a NethSecurity version tag into comparable parts. Tags look like
// "1.5.2", "1.5.1-beta1", or dev builds "1.5.1-beta1-3-g4c5b89a". Returns null
// for tags we cannot parse (they sort last).
function parseVersion(tag) {
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

// NethSecurity renumbered from the OpenWrt date-based scheme (23.05.x, 24.x —
// major >= 20) to a product scheme (8.x.x). The product scheme is newer, so it
// must sort above the old date-based tags regardless of raw numbers.
function isNewScheme(v) {
  return v.major < 20;
}

function compareVersions(a, b) {
  const va = parseVersion(a);
  const vb = parseVersion(b);
  if (va && vb) {
    if (isNewScheme(va) !== isNewScheme(vb)) {
      return isNewScheme(va) ? -1 : 1; // new scheme (8.x.x) first
    }
    for (const k of ['major', 'minor', 'patch']) {
      if (va[k] !== vb[k]) return vb[k] - va[k]; // descending
    }
    // A release (no prerelease) sorts above a prerelease of the same x.y.z
    if (!va.pre && vb.pre) return -1;
    if (va.pre && !vb.pre) return 1;
    if (va.pre && vb.pre && va.pre !== vb.pre) {
      return vb.pre.localeCompare(va.pre);
    }
    const ba = va.build ?? -1;
    const bb = vb.build ?? -1;
    if (ba !== bb) return bb - ba; // higher build first
    return 0;
  }
  // Unparseable tags sort after parseable ones, then lexically descending.
  if (va && !vb) return -1;
  if (!va && vb) return 1;
  return b.localeCompare(a);
}

async function fetchText(url) {
  const res = await fetch(url, {signal: AbortSignal.timeout(20000)});
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

// List the immediate subfolders (CommonPrefixes) under a prefix using the
// public S3 ListObjectsV2 XML API.
async function listReleaseFolders(prefix) {
  const url = `${S3_ENDPOINT}/${BUCKET}?list-type=2&delimiter=/&prefix=${encodeURIComponent(
    prefix + '/',
  )}`;
  const xml = await fetchText(url);
  const folders = [];
  const re = /<Prefix>([^<]+)<\/Prefix>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const entry = m[1].replace(new RegExp(`^${prefix}/`), '').replace(/\/$/, '');
    if (entry && entry !== prefix) folders.push(entry);
  }
  return folders;
}

function buildRows(prefix, versions) {
  return versions.map((v) => {
    const parsed = parseVersion(v);
    // SBOM (CycloneDX) is published for the product-scheme releases (8.x.x).
    const hasSbom = parsed != null && isNewScheme(parsed);
    return {
      version: v,
      imageUrl: imageUrl(prefix, v),
      hashUrl: hashUrl(prefix, v),
      sbomUrl: hasSbom ? sbomUrl(prefix, v) : '',
    };
  });
}

async function collectReleases(prefix) {
  let folders = await listReleaseFolders(prefix);
  // Drop entries that are not NethSecurity releases (mirrors conf.py).
  folders = folders.filter((e) => e !== '24.10.0');
  folders.sort(compareVersions);
  return folders;
}

async function main() {
  let version = '';
  let stable = [];
  let dev = [];

  try {
    version = (await fetchText(`${BASE_URL}/stable/latest_release`)).trim();
  } catch (e) {
    console.warn(`[versions] could not fetch latest_release: ${e.message}`);
  }

  try {
    stable = buildRows('stable', await collectReleases('stable'));
  } catch (e) {
    console.warn(`[versions] could not list stable releases: ${e.message}`);
  }

  try {
    dev = buildRows('dev', await collectReleases('dev'));
  } catch (e) {
    console.warn(`[versions] could not list dev releases: ${e.message}`);
  }

  // Fall back to the newest stable folder if latest_release was unavailable.
  if (!version && stable.length) version = stable[0].version;

  const data = {
    version,
    image: version ? imageName(version) : '',
    imageNoGz: version ? imageName(version).replace(/\.gz$/, '') : '',
    downloadUrl: version ? imageUrl('stable', version) : '',
    stable,
    dev,
  };

  await mkdir(dirname(OUT_FILE), {recursive: true});
  await writeFile(OUT_FILE, JSON.stringify(data, null, 2) + '\n');
  console.log(
    `[versions] wrote ${OUT_FILE} (version=${version || 'unknown'}, ` +
      `stable=${stable.length}, dev=${dev.length})`,
  );
}

main().catch((e) => {
  console.error(`[versions] unexpected error: ${e.message}`);
  process.exit(1);
});
