# Agent Guide: NethSecurity Documentation

This repository contains the source for the NethSecurity documentation, built using Sphinx and reStructuredText (RST).

## Project Overview

- **Framework:** [Sphinx](https://www.sphinx-doc.org/)
- **Markup Language:** [reStructuredText (RST)](https://docutils.sourceforge.io/rst.html)
- **Primary Configuration:** `conf.py`
- **Output Theme:** `sphinx_book_theme`
- **Localization:** Managed via `gettext` and `weblate`, stored in `locale/` directory.

## Core Directories and Files

- `/`: Contains the main `.rst` chapters of the documentation.
- `index.rst`: The master document that defines the documentation structure (Table of Contents).
- `conf.py`: Sphinx configuration, including extensions, theme options, and custom build logic (like fetching the latest release version).
- `_static/`: Custom CSS (`custom.css`), JS (`kapa.js`), and images/graphics.
- `locale/`: Translation files (`.po`).
- `Makefile`: Build automation.
- `requirements.txt`: Python dependencies.

## Key Workflows

### 1. Building Documentation
To build the HTML version locally:
```bash
# Setup virtual environment (if not done)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Build
make html
```
Build output will be in `_build/html/`.

After building, if any error or warning occurs, fix it.

### 2. Adding a New Chapter
1. Create a new `.rst` file in the root directory.
2. Add the file name (without extension) to the `toctree` in `index.rst`.
3. Follow the editing guidelines in `README.rst` (headers, cross-references, etc.).

### 3. Localization
- Source strings are extracted using `make gettext`.
- Translations are updated via `sphinx-intl update -p _build/gettext -l <lang>`.
- The `locale/it/LC_MESSAGES/` directory contains Italian translations.
- Localization is automatically handled using a GitHub workflow, so do not translate
  anything when adding or modifying the doc

## Editing Guidelines (RST)

- **Titles:** Use `=` over and under for the main title.
- **Section Headers:** 
    - Level 1: `=`
    - Level 2: `-`
    - Level 3: `^`
    - Level 4: `~`
- **Cross-references:** Use ".. _label_with_space-section:" before a header and ":ref:`label_with_space-section`" to link to it.
- **Notes/Warnings:** Use ".. note::" or ".. warning::" blocks.
- **UI Elements:** Use ":guilabel:`label`" for buttons and double backticks ``label`` for inline UI text.

## CI/CD
- Builds are automated via GitHub Actions (see `.github/workflows/`).
- Translations are automatically updated after commits.
- Stable and Dev release tables are dynamically generated during the build process (see `conf.py` logic).
