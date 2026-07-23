import {useState, useEffect} from 'react';

const BASE_URL = 'https://updates.nethsecurity.nethserver.org';
const S3_ENDPOINT = 'https://ams3.digitaloceanspaces.com';
const BUCKET = 'nethsecurity';
const TARGET = 'targets/x86/64';

export type SupportStatus = 'supported' | 'limited' | 'eol' | 'not-supported';

export type Release = {
  version: string;
  imageUrl: string;
  hashUrl: string;
  sbomUrl: string;
  openwrtVersion: string | null;
  publishedDate: string | null;
  supportStatus: SupportStatus;
};

export type VersionData = {
  version: string;
  image: string;
  imageNoGz: string;
  downloadUrl: string;
  stable: Release[];
  staging: Release[];
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

function makeImageUrl(prefix: string, version: string): string {
  return `${BASE_URL}/${prefix}/${version}/${TARGET}/${imageName(version)}`;
}

function makeHashUrl(prefix: string, version: string): string {
  return `${BASE_URL}/${prefix}/${version}/${TARGET}/sha256sums`;
}

function makeSbomUrl(prefix: string, version: string): string {
  return `${BASE_URL}/${prefix}/${version}/${TARGET}/nethsecurity-${version}-x86-64-generic.bom.cdx.json`;
}

// --- Dev releases: naming scheme is unrelated to stable/staging, left as-is. ---

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

// Product scheme (8.x.x) has major < 20; old date scheme (23.x, 24.x) has major >= 20.
function isNewScheme(v: ParsedVersion): boolean {
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

// --- Stable/staging releases: two real naming schemes, both starting with "8". ---
// Legacy: 8-<openwrt-version>-ns.<build>            e.g. 8-23.05.3-ns.1.1.0
// Current: 8.<minor>.<patch>[-beta.<n>]             e.g. 8.7.2, 8.8.0-beta.3
// The bucket also contains bogus bare OpenWrt-version pointer folders (e.g. "23.05.3",
// "24.10.0") that are not real releases - they don't start with "8" and are excluded below.

const LEGACY_RE = /^8-(\d+\.\d+\.\d+)-ns\.(\d+)\.(\d+)\.(\d+)$/;
const CURRENT_RE = /^8\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/;

function releaseSortKey(version: string): number[] {
  const legacy = LEGACY_RE.exec(version);
  if (legacy) {
    const owrt = legacy[1].split('.').map(Number);
    const build = [Number(legacy[2]), Number(legacy[3]), Number(legacy[4])];
    return [0, ...owrt, ...build];
  }

  const current = CURRENT_RE.exec(version);
  if (current) {
    const minor = Number(current[1]);
    const patch = Number(current[2]);
    const betaNum = current[3] ? Number(current[3]) : null;
    const isFinal = betaNum === null ? 1 : 0;
    return [1, minor, patch, isFinal, betaNum ?? 0];
  }

  return [-1];
}

function compareReleaseKeys(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av !== bv) return bv - av;
  }
  return 0;
}

async function resolveReleaseMeta(
  prefix: string,
  version: string,
): Promise<{openwrtVersion: string | null; publishedDate: string | null}> {
  const legacy = LEGACY_RE.exec(version);
  const url = `${BASE_URL}/${prefix}/${version}/${TARGET}/profiles.json`;

  try {
    if (legacy) {
      // OpenWrt version is embedded in the folder name; only need Last-Modified.
      const res = await fetch(url, {method: 'HEAD'});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return {
        openwrtVersion: legacy[1],
        publishedDate: formatDateOnly(res.headers.get('last-modified')),
      };
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const profile = await res.json();
    const stripped = (profile.version_code || '').replace(/^v/, '');
    const openwrtVersion = /^\d+\.\d+\.\d+$/.test(stripped) ? stripped : null;
    return {
      openwrtVersion,
      publishedDate: formatDateOnly(res.headers.get('last-modified')),
    };
  } catch {
    return {openwrtVersion: null, publishedDate: null};
  }
}

function formatDateOnly(lastModified: string | null): string | null {
  if (!lastModified) return null;
  const date = new Date(lastModified);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
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

function buildLinks(prefix: string, version: string, hasSbom: boolean) {
  return {
    imageUrl: makeImageUrl(prefix, version),
    hashUrl: makeHashUrl(prefix, version),
    sbomUrl: hasSbom ? makeSbomUrl(prefix, version) : '',
  };
}

async function collectDevReleases(): Promise<Release[]> {
  let folders = await listReleaseFolders('dev');
  folders = folders.filter((e) => e !== '24.10.0');
  folders.sort(compareVersions);
  return folders.map((version) => {
    const parsed = parseVersion(version);
    const hasSbom = parsed != null && isNewScheme(parsed);
    return {
      version,
      ...buildLinks('dev', version, hasSbom),
      openwrtVersion: null,
      publishedDate: null,
      supportStatus: 'not-supported' as const,
    };
  });
}

async function collectStableOrStagingReleases(
  prefix: 'stable' | 'staging',
): Promise<Release[]> {
  const folders = await listReleaseFolders(prefix);
  const versions = folders
    .filter((entry) => /^8[.-]/.test(entry))
    .sort((a, b) => compareReleaseKeys(releaseSortKey(a), releaseSortKey(b)));

  const rows = await Promise.all(
    versions.map(async (version, index) => {
      const meta = await resolveReleaseMeta(prefix, version);
      const hasSbom = CURRENT_RE.test(version);
      const supportStatus: SupportStatus =
        prefix === 'staging' ? 'not-supported' : index === 0 ? 'supported' : index === 1 ? 'limited' : 'eol';

      return {
        version,
        ...buildLinks(prefix, version, hasSbom),
        openwrtVersion: meta.openwrtVersion,
        publishedDate: meta.publishedDate,
        supportStatus,
      };
    }),
  );

  return rows;
}

let _cache: VersionData | null = null;

export function useVersionData(): UseVersionDataResult {
  const [data, setData] = useState<VersionData | null>(_cache);
  const [loading, setLoading] = useState(_cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_cache) return;
    let cancelled = false;

    async function load() {
      try {
        const [versionText, stable, staging, dev] = await Promise.all([
          // Degrade gracefully if latest_release has CORS issues.
          fetch(`${BASE_URL}/stable/latest_release`)
            .then((r) => (r.ok ? r.text() : ''))
            .catch(() => ''),
          collectStableOrStagingReleases('stable'),
          collectStableOrStagingReleases('staging'),
          collectDevReleases(),
        ]);

        if (cancelled) return;

        const version = versionText.trim() || (stable[0]?.version ?? '');
        const image = version ? imageName(version) : '';

        const result: VersionData = {
          version,
          image,
          imageNoGz: image.replace(/\.gz$/, ''),
          downloadUrl: version ? makeImageUrl('stable', version) : '',
          stable,
          staging,
          dev,
        };
        _cache = result;
        setData(result);
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
