#!/usr/bin/env python3
"""One-shot migration: convert the Sphinx .rst sources to Docusaurus Markdown.

Pipeline per file:
  1. preprocess Sphinx roles in the raw RST:
       - :guilabel: -> bold
       - :code:     -> inline code
       - :ref:/:doc: -> {{XREF|label|text}} / {{XDOC|name|text}} sentinels
  2. pandoc (rst -> commonmark_x): keeps heading ids ({#label}) and pipe tables
  3. post-process the Markdown:
       - GitHub alert blockquotes  -> :::admonitions
       - ::: {.admonition} divs    -> :::note
       - ::: {.parsed-literal} divs -> fenced code
       - ::: {#label} anchor divs  -> <a id="label"> + unwrapped content
       - image paths               -> absolute /_static/...
       - resolve {{XREF}}/{{XDOC}} -> relative Docusaurus links

`download` and `install` are authored by hand as .mdx (dynamic version data);
they are link *targets* (their anchors are declared in the .mdx) but are not
generated here. Legacy files (NS7 migration, HA 7.9) are excluded — refs into
them fall back to plain text.
"""

import json
import os
import re
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(REPO, "docs", "administrator-manual")
# Original RST restored from git history into this dir (see the migration notes).
RST_DIR = os.environ.get(
    "RST_DIR",
    "/tmp/claude-1000/-home-giacomo-projects-nethsecurity-nethsecurity-docs/"
    "17a83902-d058-4988-8a53-7101109fdc12/scratchpad/rst",
)

CATEGORIES = {
    "about": ("About", 1),
    "installation": ("Installation", 2),
    "monitoring": ("Monitoring", 3),
    "system": ("System", 4),
    "network": ("Network", 5),
    "users-objects": ("Users and objects", 6),
    "firewall": ("Firewall", 7),
    "security": ("Security", 8),
    "vpn": ("VPN", 9),
    "high-availability": ("High Availability", 10),
    "advanced-cli": ("Advanced (CLI)", 11),
    "best-practices": ("Best practices", 12),
}

# rst basename -> (folder, position). Generated .md files.
MAPPING = {
    "introduction": ("about", 1),
    "release_notes": ("about", 2),
    "system_requirements": ("installation", 1),
    "remote_access": ("installation", 4),
    "setup_wizard": ("installation", 5),
    "monitoring": ("monitoring", 1),
    "netify_informatics": ("monitoring", 2),
    "subscription": ("system", 1),
    "remote_support": ("system", 2),
    "backup": ("system", 3),
    "updates": ("system", 4),
    "storage": ("system", 5),
    "reset_recovery": ("system", 6),
    "controller": ("system", 7),
    "network": ("network", 1),
    "dns_dhcp": ("network", 2),
    "routing": ("network", 3),
    "multiwan": ("network", 4),
    "hotspot": ("network", 5),
    "reverse_proxy": ("network", 6),
    "qos": ("network", 7),
    "users_databases": ("users-objects", 1),
    "objects": ("users-objects", 2),
    "port_forward": ("firewall", 1),
    "nat": ("firewall", 2),
    "firewall_rules": ("firewall", 3),
    "connections": ("firewall", 4),
    "zones_and_policies": ("firewall", 5),
    "content_filter": ("security", 1),
    "threat_shield_ip": ("security", 2),
    "threat_shield_dns": ("security", 3),
    "dpi_filter": ("security", 4),
    "flashstart": ("security", 5),
    "ips": ("security", 6),
    "openvpn_roadwarrior": ("vpn", 1),
    "openvpn_tunnels": ("vpn", 2),
    "ipsec_tunnels": ("vpn", 3),
    "wireguard": ("vpn", 4),
    "ha_overview_features_limitations": ("high-availability", 1),
    "ha_setup_and_management": ("high-availability", 2),
    "ha_maintenance_troubleshooting": ("high-availability", 3),
    "avahi": ("advanced-cli", 1),
    "ddns": ("advanced-cli", 2),
    "dns_over_http": ("advanced-cli", 3),
    "smtp": ("advanced-cli", 4),
    "snmp": ("advanced-cli", 5),
    "custom_openvpn_tunnel": ("advanced-cli", 6),
    "logs": ("advanced-cli", 7),
    "speedtest": ("advanced-cli", 8),
    "ups": ("advanced-cli", 9),
    "wol": ("advanced-cli", 10),
    "checkmk": ("advanced-cli", 11),
    "victoria_logs": ("advanced-cli", 12),
    "uci": ("advanced-cli", 13),
    "troubleshooting": ("best-practices", 1),
}

# Hand-authored .mdx targets: basename -> doc-relative path under DOCS_DIR.
MDX_TARGETS = {
    "download": "installation/download.mdx",
    "install": "installation/install.mdx",
}

ALERT_MAP = {
    "NOTE": "note",
    "TIP": "tip",
    "IMPORTANT": "info",
    "WARNING": "warning",
    "CAUTION": "warning",
    "DANGER": "danger",
}

UNDERLINE_RE = re.compile(r"^[=\-^~\"'`#*+.]{3,}\s*$")
LABEL_RE = re.compile(r"^\.\. _([A-Za-z0-9_.\-]+):\s*$")


def output_relpath(basename):
    """Doc-relative path (under DOCS_DIR) for a given rst basename, or None."""
    if basename in MDX_TARGETS:
        return MDX_TARGETS[basename]
    if basename in MAPPING:
        folder, _ = MAPPING[basename]
        return f"{folder}/{basename}.md"
    return None


def _first_heading_line(lines):
    """Line index of the document's first heading (its H1 title)."""
    for j in range(len(lines)):
        s = lines[j]
        if s.strip() == "":
            continue
        # underlined: title / rule
        if j + 1 < len(lines) and UNDERLINE_RE.match(lines[j + 1]) and not UNDERLINE_RE.match(s):
            return j
        # overlined: rule / title / rule
        if (UNDERLINE_RE.match(s) and j + 2 < len(lines)
                and not UNDERLINE_RE.match(lines[j + 1])
                and UNDERLINE_RE.match(lines[j + 2])):
            return j
    return len(lines)


def build_index():
    """label -> {'basename', 'title', 'page'} across every rst (including
    excluded ones, so refs into excluded files degrade to plain text).
    `page` marks a label that sits on the document title (H1): Docusaurus does
    not assign the explicit id to the H1, so such refs must link to the page
    without an anchor."""
    index = {}
    for fn in os.listdir(RST_DIR):
        if not fn.endswith(".rst"):
            continue
        basename = fn[:-4]
        lines = open(os.path.join(RST_DIR, fn), encoding="utf-8").read().split("\n")
        first_heading = _first_heading_line(lines)
        for i, line in enumerate(lines):
            m = LABEL_RE.match(line)
            if not m:
                continue
            label = m.group(1)
            # Find the title that follows the label (skip blanks / other labels).
            title = ""
            j = i + 1
            while j < len(lines):
                s = lines[j]
                if s.strip() == "" or LABEL_RE.match(s):
                    j += 1
                    continue
                # overlined heading: rule / title / rule
                if (UNDERLINE_RE.match(s) and j + 2 < len(lines)
                        and UNDERLINE_RE.match(lines[j + 2])):
                    title = lines[j + 1].strip()
                # underlined heading: title / rule
                elif j + 1 < len(lines) and UNDERLINE_RE.match(lines[j + 1]):
                    title = s.strip()
                break
            index[label] = {
                "basename": basename,
                "title": title,
                "page": i <= first_heading,
            }
    return index


def doc_href(source_basename, target_basename, anchor):
    """Doc-relative href from source to target (#anchor optional), or None."""
    target = output_relpath(target_basename)
    if target is None:
        return None
    if target_basename == source_basename:
        rel = ""
    else:
        rel = os.path.relpath(target, os.path.dirname(output_relpath(source_basename)))
        if not rel.startswith("."):
            rel = "./" + rel
    return f"{rel}#{anchor}" if anchor else rel


def preprocess_rst(text, basename, index):
    text = re.sub(r":guilabel:`([^`]+)`", r"**\1**", text)
    text = re.sub(r":code:`([^`]+)`", r"`\1`", text)

    # Resolve cross-references directly into RST anonymous hyperlinks
    # ( `text <url>`__ ), which pandoc renders as [text](url). Doing it here —
    # before pandoc — avoids sentinel/substitution clashes.
    def ref(label, text_):
        entry = index.get(label)
        if not entry:
            return text_ or label  # unknown label -> plain text
        # Page-level labels live on the H1, which Docusaurus does not id; link to
        # the page without an anchor.
        anchor = "" if entry["page"] else label
        href = doc_href(basename, entry["basename"], anchor)
        label_text = text_ or entry["title"] or label
        if not href:
            return label_text  # excluded file or self page-level ref
        return f"`{label_text} <{href}>`__"

    def doc(name, text_):
        href = doc_href(basename, name, "")
        label_text = text_ or name
        return f"`{label_text} <{href}>`__" if href else label_text

    text = re.sub(r":ref:`([^`<]*?)\s*<([^>]+)>`", lambda m: ref(m.group(2).strip(), m.group(1).strip()), text)
    text = re.sub(r":ref:`([^`]+)`", lambda m: ref(m.group(1).strip(), ""), text)
    text = re.sub(r":doc:`([^`<]*?)\s*<([^>]+)>`", lambda m: doc(m.group(2).strip(), m.group(1).strip()), text)
    text = re.sub(r":doc:`([^`]+)`", lambda m: doc(m.group(1).strip(), ""), text)
    return text


def convert_github_alerts(text):
    lines = text.split("\n")
    out, i = [], 0
    alert_re = re.compile(r"^>\s*\[!([A-Z]+)\]\s*$")
    while i < len(lines):
        m = alert_re.match(lines[i])
        if m:
            kind = ALERT_MAP.get(m.group(1), "note")
            body, i = [], i + 1
            while i < len(lines) and lines[i].startswith(">"):
                body.append(re.sub(r"^>\s?", "", lines[i]))
                i += 1
            while body and body[0].strip() == "":
                body.pop(0)
            while body and body[-1].strip() == "":
                body.pop()
            out += [f":::{kind}", ""] + body + ["", ":::"]
        else:
            out.append(lines[i])
            i += 1
    return "\n".join(out)


DIV_ALERTS = {
    "note": "note",
    "warning": "warning",
    "tip": "tip",
    "important": "info",
    "caution": "warning",
    "danger": "danger",
    "seealso": "note",
    "hint": "tip",
    "attention": "warning",
    "error": "danger",
}

OPEN_RE = re.compile(r"^(:{3,})\s*\{([^}]*)\}\s*$")
CLOSE_RE = re.compile(r"^(:{3,})\s*$")


def _parse_attrs(attrs):
    classes = re.findall(r"\.([A-Za-z0-9_-]+)", attrs)
    m = re.search(r"#([A-Za-z0-9_.\-]+)", attrs)
    return classes, (m.group(1) if m else None)


def _parse_blocks(lines, i, fence):
    """Parse children until a close fence with >= `fence` colons. Returns
    (nodes, next_index). A node is ('text', line) or ('div', classes, id, children)."""
    nodes = []
    while i < len(lines):
        line = lines[i]
        mo = OPEN_RE.match(line)
        mc = CLOSE_RE.match(line)
        if mc and len(mc.group(1)) >= fence:
            return nodes, i + 1
        if mo:
            classes, anchor = _parse_attrs(mo.group(2))
            children, i = _parse_blocks(lines, i + 1, len(mo.group(1)))
            nodes.append(("div", classes, anchor, children))
        else:
            nodes.append(("text", line))
            i += 1
    return nodes, i


def _render(nodes):
    out = []
    for node in nodes:
        if node[0] == "text":
            out.append(node[1])
            continue
        _, classes, anchor, children = node
        cls = set(classes)
        alert = next((DIV_ALERTS[c] for c in classes if c in DIV_ALERTS), None)
        # drop redundant ::: {.title} children (pandoc repeats the admonition name)
        title_text = ""
        body = []
        for ch in children:
            if ch[0] == "div" and "title" in ch[1]:
                title_text = "\n".join(t[1] for t in ch[3] if t[0] == "text").strip()
            else:
                body.append(ch)
        body_md = _render(body)
        while body_md and body_md[0].strip() == "":
            body_md.pop(0)
        while body_md and body_md[-1].strip() == "":
            body_md.pop()
        if alert:
            out += [f":::{alert}", ""] + body_md + ["", ":::"]
        elif "admonition" in cls:
            block = [":::note", ""]
            if title_text:
                block += [f"**{title_text}**", ""]
            out += block + body_md + ["", ":::"]
        elif "parsed-literal" in cls:
            out += ["```text"] + body_md + ["```"]
        elif anchor:
            out += [f'<a id="{anchor}"></a>', ""] + body_md
        else:
            out += body_md  # unknown wrapper: unwrap
    return out


def convert_fenced_divs(text):
    nodes, _ = _parse_blocks(text.split("\n"), 0, 0)
    return "\n".join(_render(nodes))


def fix_image_paths(text):
    for a, b in [
        ("](../_static/", "](/_static/"),
        ("](_static/", "](/_static/"),
        ('src="../_static/', 'src="/_static/'),
        ('src="_static/', 'src="/_static/'),
    ]:
        text = text.replace(a, b)
    return text


def derive_title(md):
    for line in md.split("\n"):
        if line.startswith("# "):
            t = line[2:].strip()
            return re.sub(r"\s*\{#[^}]+\}\s*$", "", t)
    return ""


def convert_file(basename, folder, position, index):
    raw = open(os.path.join(RST_DIR, basename + ".rst"), encoding="utf-8").read()
    raw = preprocess_rst(raw, basename, index)
    md = subprocess.run(
        ["pandoc", "-f", "rst", "-t", "commonmark_x", "--wrap=none"],
        input=raw, capture_output=True, text=True, check=True,
    ).stdout
    # Parse pandoc's ::: {...} divs first (they use bare ::: closers), then
    # convert > [!NOTE] alerts — otherwise the ::: we emit for admonitions get
    # mis-parsed as div closers.
    md = convert_fenced_divs(md)
    md = convert_github_alerts(md)
    md = fix_image_paths(md)
    # RST default-role `text` -> commonmark_x [text]{.title-ref}; render as code.
    md = re.sub(r"\[([^\]]+)\]\{\.title-ref\}", r"`\1`", md)
    # Strip any remaining class-only attribute spans ({.align-center}, etc.).
    # Heading ids ({#id}) start with '#' and are preserved.
    md = re.sub(r"\{\.[^}]*\}", "", md)

    title = derive_title(md) or basename.replace("_", " ").title()
    fm = f'---\ntitle: "{title.replace(chr(34), chr(92)+chr(34))}"\nsidebar_position: {position}\n---\n\n'
    out_dir = os.path.join(DOCS_DIR, folder)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, basename + ".md")
    open(out_path, "w", encoding="utf-8").write(fm + md.strip() + "\n")
    return out_path


def write_categories():
    for folder, (label, position) in CATEGORIES.items():
        d = os.path.join(DOCS_DIR, folder)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "_category_.json"), "w", encoding="utf-8") as f:
            json.dump({"label": label, "position": position}, f, indent=2)
            f.write("\n")


def main():
    index = build_index()
    write_categories()
    n = 0
    for basename, (folder, position) in MAPPING.items():
        convert_file(basename, folder, position, index)
        n += 1
    print(f"Converted {n} files. Index has {len(index)} labels.")


if __name__ == "__main__":
    main()
