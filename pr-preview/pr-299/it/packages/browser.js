const root = document.querySelector('#root');

if (!root) {
  throw new Error('Missing browser root element.');
}

const config = {
  bucket: document.body.dataset.bucket || 'nethsecurity',
  endpoint: (document.body.dataset.endpoint || 'https://ams3.digitaloceanspaces.com').replace(/\/$/, ''),
  cdnEndpoint: (document.body.dataset.cdnEndpoint || 'https://updates.nethsecurity.nethserver.org').replace(/\/$/, ''),
  docsHome: document.body.dataset.docsHome || '../index.html',
  downloadPage: document.body.dataset.downloadPage || '../download.html',
};

const state = {
  bucket: config.bucket,
  endpoint: config.endpoint,
  cdnEndpoint: config.cdnEndpoint,
  prefix: '',
  filter: '',
  currentFolders: [],
  currentFiles: [],
};

root.innerHTML = `
  <main class="app-shell">
    <header class="hero">
      <div>
        <p class="eyebrow">Public repository browser</p>
        <h1>NethSecurity</h1>
        <p class="hero-copy">Browse folders and download release artifacts from the public repository.</p>
      </div>
      <div class="hero-actions">
        <a class="button button-secondary" href="${config.docsHome}">Documentation</a>
        <a class="button button-secondary" href="${config.downloadPage}">Download page</a>
        <button id="home-button" class="button button-secondary" type="button">Home</button>
        <button id="refresh-button" class="button" type="button">Refresh</button>
      </div>
    </header>

    <nav id="breadcrumbs" class="breadcrumbs" aria-label="Breadcrumb"></nav>

    <section class="panel">
      <div class="toolbar">
        <label class="filter" for="filter-input">
          <span class="meta-label">Filter</span>
          <input id="filter-input" class="filter-input" type="search" placeholder="Filter folders and files in this view" autocomplete="off" />
        </label>
      </div>
      <div id="status" class="status" role="status">Loading...</div>
      <div class="table-wrapper">
        <table class="entries-table" aria-live="polite">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Modified</th>
            </tr>
          </thead>
          <tbody id="entries-body"></tbody>
        </table>
      </div>
    </section>
  </main>
`;

const breadcrumbs = document.querySelector('#breadcrumbs');
const filterInput = document.querySelector('#filter-input');
const status = document.querySelector('#status');
const entriesBody = document.querySelector('#entries-body');

document.querySelector('#home-button').addEventListener('click', () => navigateTo(''));
document.querySelector('#refresh-button').addEventListener('click', () => loadEntries());
filterInput.addEventListener('input', (event) => {
  state.filter = event.target.value.trim().toLowerCase();
  renderEntries();
});

window.addEventListener('hashchange', syncFromHash);

syncFromHash();

function syncFromHash() {
  const hashPrefix = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  state.prefix = normalizePrefix(hashPrefix);
  renderBreadcrumbs();
  loadEntries();
}

function navigateTo(prefix) {
  const normalizedPrefix = normalizePrefix(prefix);
  const nextHash = normalizedPrefix ? `#${encodeURIComponent(normalizedPrefix)}` : '';
  if (window.location.hash === nextHash) {
    state.prefix = normalizedPrefix;
    renderBreadcrumbs();
    loadEntries();
    return;
  }

  window.location.hash = nextHash;
}

async function loadEntries() {
  const requestedPrefix = state.prefix;
  status.textContent = 'Loading...';
  entriesBody.innerHTML = '';

  try {
    const xmlText = await fetchListing(requestedPrefix);
    if (requestedPrefix !== state.prefix) {
      return;
    }

    const { folders, files } = parseListBucketResult(xmlText, requestedPrefix);
    state.currentFolders = folders;
    state.currentFiles = files;
    renderEntries();
  } catch (error) {
    if (requestedPrefix !== state.prefix) {
      return;
    }

    state.currentFolders = [];
    state.currentFiles = [];
    status.textContent = `Unable to load bucket contents: ${error.message}`;
  }
}

function renderEntries() {
  entriesBody.innerHTML = '';

  const visibleFolders = state.currentFolders.filter((folder) => matchesFilter(folder.prefix));
  const visibleFiles = state.currentFiles.filter((file) => matchesFilter(file.key));

  if (state.prefix) {
    entriesBody.appendChild(createParentEntry(state.prefix));
  }

  visibleFolders.forEach((folder) => entriesBody.appendChild(createFolderEntry(folder)));
  visibleFiles.forEach((file) => entriesBody.appendChild(createFileEntry(file)));

  const totalCount = state.currentFolders.length + state.currentFiles.length;
  const visibleCount = visibleFolders.length + visibleFiles.length;

  if (totalCount === 0) {
    status.textContent = 'This folder is empty.';
    return;
  }

  if (!state.filter) {
    status.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
    return;
  }

  status.textContent = `${visibleCount} of ${totalCount} item${totalCount === 1 ? '' : 's'} match "${state.filter}"`;
}

async function fetchListing(prefix) {
  const url = new URL(`${state.endpoint}/${state.bucket}/`);
  url.searchParams.set('list-type', '2');
  url.searchParams.set('delimiter', '/');
  if (prefix) {
    url.searchParams.set('prefix', prefix);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`.trim());
  }

  return response.text();
}

function parseListBucketResult(xmlText, prefix) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'application/xml');
  const errorNode = xml.querySelector('parsererror');
  if (errorNode) {
    throw new Error('invalid XML response');
  }

  const folders = getNodes(xml, 'CommonPrefixes')
    .map((node) => ({
      prefix: getChildText(node, 'Prefix'),
    }))
    .filter((item) => item.prefix && item.prefix !== prefix);

  const files = getNodes(xml, 'Contents')
    .map((node) => ({
      key: getChildText(node, 'Key'),
      lastModified: getChildText(node, 'LastModified'),
      size: Number.parseInt(getChildText(node, 'Size') || '0', 10),
    }))
    .filter((item) => item.key && item.key !== prefix);

  return { folders, files };
}

function createParentEntry(prefix) {
  const row = document.createElement('tr');
  row.className = 'entry-row entry-parent';

  const nameCell = document.createElement('td');
  const button = document.createElement('button');
  button.className = 'entry-button';
  button.type = 'button';
  button.textContent = '..';
  button.addEventListener('click', () => navigateTo(parentPrefix(prefix)));
  nameCell.appendChild(button);
  row.appendChild(nameCell);

  row.appendChild(createTextCell('Parent'));
  row.appendChild(createTextCell(''));
  row.appendChild(createTextCell(''));

  return row;
}

function createFolderEntry(folder) {
  const row = document.createElement('tr');
  row.className = 'entry-row entry-folder';

  const nameCell = document.createElement('td');
  const button = document.createElement('button');
  button.className = 'entry-button';
  button.type = 'button';
  button.textContent = displayName(folder.prefix);
  button.addEventListener('click', () => navigateTo(folder.prefix));
  nameCell.appendChild(button);
  row.appendChild(nameCell);

  row.appendChild(createTextCell('Folder'));
  row.appendChild(createTextCell(''));
  row.appendChild(createTextCell(''));

  return row;
}

function createFileEntry(file) {
  const row = document.createElement('tr');
  row.className = 'entry-row entry-file';

  const nameCell = document.createElement('td');
  const link = document.createElement('a');
  link.className = 'entry-link';
  link.href = publicObjectUrl(file.key);
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = displayName(file.key);
  nameCell.appendChild(link);
  row.appendChild(nameCell);

  row.appendChild(createTextCell('File'));
  row.appendChild(createTextCell(formatBytes(file.size)));
  row.appendChild(createTextCell(formatDate(file.lastModified)));

  return row;
}

function createTextCell(value) {
  const cell = document.createElement('td');
  cell.textContent = value;
  return cell;
}

function renderBreadcrumbs() {
  breadcrumbs.innerHTML = '';

  const segments = state.prefix.split('/').filter(Boolean);
  if (segments.length === 0) {
    return;
  }

  const home = document.createElement('button');
  home.type = 'button';
  home.className = 'crumb';
  home.textContent = state.bucket;
  home.addEventListener('click', () => navigateTo(''));
  breadcrumbs.appendChild(home);

  let accumulated = '';
  segments.forEach((segment) => {
    accumulated += `${segment}/`;

    const separator = document.createElement('span');
    separator.className = 'crumb-separator';
    separator.textContent = '/';
    breadcrumbs.appendChild(separator);

    const crumb = document.createElement('button');
    crumb.type = 'button';
    crumb.className = 'crumb';
    crumb.textContent = segment;
    crumb.addEventListener('click', () => navigateTo(accumulated));
    breadcrumbs.appendChild(crumb);
  });
}

function getNodes(xml, tagName) {
  return Array.from(xml.getElementsByTagNameNS('*', tagName));
}

function getChildText(node, tagName) {
  return node.getElementsByTagNameNS('*', tagName)[0]?.textContent || '';
}

function parentPrefix(prefix) {
  const segments = prefix.split('/').filter(Boolean);
  segments.pop();
  return segments.length > 0 ? `${segments.join('/')}/` : '';
}

function normalizePrefix(prefix) {
  if (!prefix) {
    return '';
  }

  return prefix.endsWith('/') ? prefix : `${prefix}/`;
}

function displayName(value) {
  const trimmed = value.endsWith('/') ? value.slice(0, -1) : value;
  const parts = trimmed.split('/');
  return parts[parts.length - 1] || '/';
}

function matchesFilter(value) {
  if (!state.filter) {
    return true;
  }

  return value.toLowerCase().includes(state.filter);
}

function publicObjectUrl(key) {
  const encodedKey = key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return new URL(encodedKey, `${state.cdnEndpoint}/`).toString();
}

function formatBytes(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = size;
  let unitIndex = -1;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(value) {
  if (!value) {
    return 'unknown date';
  }

  return new Date(value).toLocaleString();
}
