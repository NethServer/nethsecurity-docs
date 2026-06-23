---
description: 'Convert a Freshdesk helpdesk solution article into a Docusaurus tutorial page for the nethsecurity-docs repository. Use when the user wants to import a Freshdesk article, mentions "/freshdesk", or asks to convert a helpdesk solution to documentation. Supports: (1) Fetching article content via Freshdesk API, (2) Filtering content relevant to NethSecurity only, (3) Downloading and saving screenshots, (4) Creating both English and Italian versions, (5) Placing files in the correct tutorial directories'
name: freshdesk-to-tutorial
---

# Freshdesk Solution → NethSecurity Tutorial

## Overview

Fetch a Freshdesk helpdesk article and convert it into a Docusaurus tutorial page
for the `nethsecurity-docs` repository, in **both English and Italian**.

---

## Step 1 — Collect inputs

### 1a. Auth token

Check whether the auth token is already stored in the **session SQL database**:

```sql
SELECT value FROM session_state WHERE key = 'freshdesk_token';
```

If the row exists, use that token for all API calls.
If it **does not exist**, ask the user:

> "Please provide your Freshdesk API token (it will be kept only for this session and never stored permanently)."

After receiving the token, save it to the session:

```sql
CREATE TABLE IF NOT EXISTS session_state (key TEXT PRIMARY KEY, value TEXT);
INSERT OR REPLACE INTO session_state (key, value) VALUES ('freshdesk_token', '<token>');
```

**Never** write the token to any file, commit, or memory tool.

### 1b. Article URL

If the user has not already provided the URL, ask:

> "Please paste the Freshdesk article URL (e.g. https://helpdesk.nethesis.it/a/solutions/articles/3000019251)."

Extract the numeric article ID from the URL (last path segment).

---

## Step 2 — Fetch the article

Base URL: `https://nethesis.freshdesk.com/api/v2`
Auth: HTTP Basic with `<token>:X` (token as username, literal `X` as password).

```bash
# Fetch the article by ID
curl -s -u "<TOKEN>:X" \
  -H "Content-Type: application/json" \
  "https://nethesis.freshdesk.com/api/v2/solutions/articles/<ARTICLE_ID>"
```

The response is JSON with at least these fields:

| Field | Description |
|---|---|
| `title` | Article title |
| `description` | Full HTML body of the article |
| `description_text` | Plain-text version (no HTML) |
| `folder_id` | Parent folder |
| `status` | 1 = draft, 2 = published |
| `tags` | Array of tag strings |

Fetch the folder and category to understand context:

```bash
# Folder info (contains category_id)
curl -s -u "<TOKEN>:X" \
  "https://nethesis.freshdesk.com/api/v2/solutions/folders/<FOLDER_ID>"

# Category info
curl -s -u "<TOKEN>:X" \
  "https://nethesis.freshdesk.com/api/v2/solutions/categories/<CATEGORY_ID>"
```

---

## Step 3 — Assess NethSecurity relevance

Examine `description_text` and the category/folder names.

**The article is relevant to NethSecurity if** it mentions any of:
- "NethSecurity", "NethSecurity 8", "NethSecurity8"
- Firewall, VPN, OpenWrt, network monitoring, log retention, HA, IAM, or other NethSecurity concepts
- The category/folder name contains "NethSecurity" or similar

If the article is **not relevant to NethSecurity**, stop and inform the user:
> "This article does not appear to be relevant to NethSecurity. No files were created."

---

## Step 4 — Extract and convert content

### 4a. Parse the HTML

Use Python with `html.parser` (stdlib) to parse `description`:

```python
from html.parser import HTMLParser
import re, textwrap, os, urllib.request, base64

# Convert HTML to Markdown:
# - <h1>…</h6> → ## … (start from ##, reserve # for the title)
# - <p> → paragraph
# - <ul>/<ol>/<li> → Markdown list
# - <strong>/<b> → **text**
# - <em>/<i> → *text*
# - <code>/<pre> → inline code or fenced code block
# - <a href="…"> → [text](href)
# - <img src="…"> → collect for download (see Step 5)
# - <table> → Markdown GFM table
# - strip all other tags; decode HTML entities
```

Write a robust HTML-to-Markdown converter inline in the script.

**Word boundary rule (critical):** When closing one inline element and opening another (or continuing plain text), always check that a space exists at the boundary. If the last character of the emitted text is a word character (`\w`) and the next character to emit is also a word character, insert a single space. This prevents concatenation errors like `malicious destinationscontributing` (two adjacent `<a>` tags with no whitespace between them in the HTML).

```python
def safe_join(left: str, right: str) -> str:
    """Join two text fragments, ensuring a space at word boundaries."""
    if left and right and left[-1].isalnum() and right[0].isalnum():
        return left + ' ' + right
    return left + right
```

### 4b. Title cleanup

Before using the article title, strip product-version suffixes that are implicit in this docs site:

```python
import re

def clean_title(title: str) -> str:
    # Remove trailing "NethSecurity 8" and common separators
    title = re.sub(r'\s*[-–:|]\s*NethSecurity\s*8\b.*$', '', title, flags=re.IGNORECASE)
    # Remove leading "NethSecurity 8" prefix
    title = re.sub(r'^NethSecurity\s*8\s*[-–:|]\s*', '', title, flags=re.IGNORECASE)
    return title.strip()
```

Apply `clean_title()` to the article title from JSON before using it as the page title, frontmatter value, filename slug, and image directory name.

**Slug language rule (critical):** The filename slug is **always derived from the English title**, never from the Italian. If the source article is in Italian, first translate the title to English, derive the slug from that, then produce the Italian page. Both `docs/tutorial/<slug>.md` and `i18n/it/.../tutorial/<slug>.md` use the same English slug.

### 4c. Heading hierarchy

- Page `title` (from JSON, after cleanup) → Markdown frontmatter `title:` + `# Title` heading
- `<h1>` in the body → `##`
- `<h2>` → `###`
- … and so on (shift all headings down by one level)

### 4d. Filter irrelevant sections

Remove entire sections (heading + content until next same-level heading) that:
- Explicitly refer **only** to older NethSecurity releases (unless they describe migration)
- Refer to unrelated products (NethVoice, NethServer) unless the article is specifically about them
- Are generic boilerplate not specific to the product

Keep sections that mention both older and newer NethSecurity releases if they are comparative/migration context.

### 4e. Admonitions

Convert Freshdesk-style callouts:
- `<div class="note">` / `<aside class="note">` → `:::note`
- `<div class="warning">` / `<aside class="warning">` → `:::warning`
- `<div class="tip">` → `:::tip`
- `<div class="info">` → `:::info`

### 4f. Rewrite docs.nethserver.org links

If the converted content contains links to `docs.nethserver.org` that point to content already
present in this repository, replace them with **internal relative links** instead of keeping
external URLs.

Examples:
- `https://docs.nethserver.org/projects/ns8/en/latest/mail.html#rspamd-web-interface`
  → `../administrator-manual/applications/mail.md#rspamd-web-interface`
- `https://docs.nethserver.org/projects/ns8/en/latest/install.html#pre-built-image`
  → `../administrator-manual/installation/install.md#pre-built-image`

Rules:
1. Prefer relative links to files under `docs/` or `i18n/it/.../current/` when the target page
   exists in this repository.
2. Preserve heading anchors when converting the link.
3. Keep the external URL only if there is no matching local documentation page.

---

## Step 5 — Handle screenshots

For every `<img>` tag in the HTML:

1. Download the image with `curl` (or Python `urllib`).
2. Save to `static/_static/tutorial/<slug>/` where `<slug>` is derived from the article title
   (lowercase, spaces→hyphens, strip special chars).
3. Reference in Markdown as `![alt text](/_static/tutorial/<slug>/<filename>)`.
4. **Skip** images that are clearly UI chrome, icons, or decorative (tiny size < 5 KB, or filename
   suggests icon: `icon`, `logo`, `avatar`, `bullet`).
5. If downloading fails, insert a comment `<!-- image: <original-url> -->` instead.

```bash
mkdir -p static/_static/tutorial/<slug>
curl -s -o "static/_static/tutorial/<slug>/<filename>" "<image-url>"
```

---

## Step 6 — Generate the English file

Target path: `docs/tutorial/<slug>.md`

Frontmatter template:

```markdown
---
title: "<article title>"
sidebar_position: 99
---
```

Use `sidebar_position: 99` as a placeholder (user can adjust).

Full file structure:

```markdown
---
title: "Article Title"
sidebar_position: 99
---
# Article Title

<converted markdown body>
```

Do **not** include:
- Author names
- "Last updated" timestamps from Freshdesk
- Freshdesk-specific footer links
- Tags or category breadcrumbs
- External `docs.nethserver.org` links when an internal relative link is available

---

## Step 7 — Generate the Italian file

The Freshdesk account does not have multilingual API support, so **always translate yourself**.

**Language separation is strict — each file must contain ONLY its own language:**
- English file (`docs/tutorial/<slug>.md`): every sentence of prose must be in English.
- Italian file (`i18n/it/.../tutorial/<slug>.md`): every sentence of prose must be in Italian.
- Never leave Italian sentences in the English file or English sentences in the Italian file.
- Exceptions that appear unchanged in both files: code blocks, commands, config keys, file paths,
  UI element names, product names (NethSecurity, NethServer, WebTop, Samba, etc.), and image paths.

Determine the source language first:

```
If description_text is Italian:
    Italian file ← original Italian content (may need light cleanup)
    English file ← translate Italian → English
Else (source is English):
    English file ← converted content
    Italian file ← translate English → Italian
```

Italian translation guidelines:
- Use informal second person ("tu"), consistent with existing Italian docs.
- Translate `title:` frontmatter value.
- Preserve all Markdown syntax, admonitions, and image references unchanged.
- Translate prose naturally; do not translate product names.

Target path: `i18n/it/docusaurus-plugin-content-docs/current/tutorial/<slug>.md`

---

## Step 8 — Write the files

1. Create the image directory and download all images.
2. Write the English `.md` file.
3. Write the Italian `.md` file.
4. Update both tutorial index files to add the new tutorial link.

### 8a. Update tutorial indexes

Append a bullet to both index files listing the new tutorial:

**`docs/tutorial/index.md`** — add one line in English:
```markdown
- [<English title>](/<slug>) — <one-line English description>
```

**`i18n/it/docusaurus-plugin-content-docs/current/tutorial/index.md`** — add one line in Italian:
```markdown
- [<Italian title>](/<slug>) — <one-line Italian description>
```

Keep the list sorted alphabetically by title within each index file.

5. Print a summary:

```
✅ Created: docs/tutorial/<slug>.md
✅ Created: i18n/it/docusaurus-plugin-content-docs/current/tutorial/<slug>.md
✅ Updated: docs/tutorial/index.md
✅ Updated: i18n/it/docusaurus-plugin-content-docs/current/tutorial/index.md
📁 Images:  static/_static/tutorial/<slug>/  (<N> files)

Next steps:
- Review and adjust sidebar_position in both files
- Run: yarn build   (to validate the new pages)
```

---

## Step 9 — Validation

After creating the files, run:

```bash
cd /path/to/nethsecurity-docs && yarn build 2>&1 | tail -30
```

Fix any MDX or broken-link errors before declaring the task complete.

---

## Reference: Freshdesk API endpoints used

| Purpose | Method | URL |
|---|---|---|
| Get article | GET | `/api/v2/solutions/articles/{id}` |
| List translations | GET | `/api/v2/solutions/articles/{id}/translations` |
| Get folder | GET | `/api/v2/solutions/folders/{id}` |
| Get category | GET | `/api/v2/solutions/categories/{id}` |

Authentication: `curl -u "<token>:X"` (Basic Auth, literal `X` as password).

---

## NethSecurity docs conventions (apply to generated Markdown)

- One `#` heading per file (the page title); use `##` and below for sections.
- UI elements in **bold**: `**Save**`, `**Next**`.
- File paths, commands, config keys in `inline code`.
- Admonitions: `:::note`, `:::warning`, `:::tip`, `:::info`.
- Images: absolute path from repo root `/…`.
- Cross-links: relative paths like `../administrator-manual/installation/install.md`.
- Replace `docs.nethserver.org` links with internal relative links whenever the referenced page
  exists in this repository.
- Write in second person, present tense, imperative mood for procedures.
