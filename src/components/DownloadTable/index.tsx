import type {ReactNode} from 'react';
import {useVersionData} from '@site/src/hooks/useVersionData';
import type {Release, VersionData} from '@site/src/hooks/useVersionData';

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

// Renders any shell command that needs live version data.
// Pass a template function: (v: VersionData) => string
// Falls back to '…' while loading, or a placeholder string on error.
const FALLBACK: VersionData = {
  version: '<version>',
  image: 'nethsecurity-<version>-x86-64-generic-squashfs-combined-efi.img.gz',
  imageNoGz: 'nethsecurity-<version>-x86-64-generic-squashfs-combined-efi.img',
  downloadUrl: '#',
  stable: [],
  dev: [],
};

export function VersionCommand({
  template,
}: {
  template: (v: VersionData) => string;
}): ReactNode {
  const {data, loading} = useVersionData();
  const text = loading ? '…' : template(data ?? FALLBACK);
  return (
    <pre>
      <code>{text}</code>
    </pre>
  );
}

// Renders the sha256 verification command with the live latest image name.
export function ImageVerifyCommand(): ReactNode {
  const {data, loading} = useVersionData();
  const name = loading
    ? '…'
    : (data?.image ??
      'nethsecurity-<version>-x86-64-generic-squashfs-combined-efi.img.gz');
  return (
    <pre>
      <code>{`grep ${name} sha256sums | sha256sum -c`}</code>
    </pre>
  );
}
