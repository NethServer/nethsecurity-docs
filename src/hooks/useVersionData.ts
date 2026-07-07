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
  return `${BASE_URL}/${prefix}/${version}/targets/x86/64/${imageName(version)}`;
}

function makeHashUrl(prefix: string, version: string): string {
  return `${BASE_URL}/${prefix}/${version}/targets/x86/64/sha256sums`;
}

function makeSbomUrl(prefix: string, version: string): string {
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
      imageUrl: makeImageUrl(prefix, v),
      hashUrl: makeHashUrl(prefix, v),
      sbomUrl: hasSbom ? makeSbomUrl(prefix, v) : '',
    };
  });
}

async function collectReleases(prefix: string): Promise<string[]> {
  let folders = await listReleaseFolders(prefix);
  folders = folders.filter((e) => e !== '24.10.0');
  folders.sort(compareVersions);
  return folders;
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
        const [versionText, stableFolders, stagingFolders, devFolders] = await Promise.all([
          // Degrade gracefully if latest_release has CORS issues.
          fetch(`${BASE_URL}/stable/latest_release`)
            .then((r) => (r.ok ? r.text() : ''))
            .catch(() => ''),
          collectReleases('stable'),
          collectReleases('staging'),
          collectReleases('dev'),
        ]);

        if (cancelled) return;

        const stable = buildRows('stable', stableFolders);
        const staging = buildRows('staging', stagingFolders);
        const dev = buildRows('dev', devFolders);
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
