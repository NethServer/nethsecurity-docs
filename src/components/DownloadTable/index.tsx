import type {ReactNode} from 'react';
import versions from '@site/src/data/versions.json';

type Release = {
  version: string;
  imageUrl: string;
  hashUrl: string;
  sbomUrl: string;
};

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
  return <ReleaseTable rows={versions.stable as Release[]} />;
}

export function DevReleases(): ReactNode {
  return <ReleaseTable rows={versions.dev as Release[]} />;
}

// Inline helpers for substituting the latest version / image name / download URL
// (the former Sphinx |version|, |image|, |download_url| substitutions).
export function Version(): ReactNode {
  return <>{versions.version}</>;
}

export function ImageName(): ReactNode {
  return <>{versions.image}</>;
}

export function DownloadUrl(): ReactNode {
  return <>{versions.downloadUrl}</>;
}
