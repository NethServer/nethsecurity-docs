# Documentation Translation Sync System

This system automates translation synchronization between English and Italian versions of NethSecurity documentation.

## Overview

The translation workflow automatically detects changes to documentation files and generates corresponding translations using AI, maintaining consistency between the English (`docs/`) and Italian (`i18n/it/`) documentation.

## How It Works

### Workflow Trigger
The workflow activates automatically when:
- A Pull Request is created or updated
- The PR targets the `main` branch
- Documentation files (`.md` or `.mdx`) are modified in either `docs/` (English) or `i18n/it/docusaurus-plugin-content-docs/current/` (Italian) directories

### Execution Flow

#### 1. Commit History Analysis
When the workflow starts, it:
- Fetches all commits in the PR to determine the **primary language** of the changes (related to the entire PR)
- Queries the GitHub API to find the **last successful workflow execution** on the branch
- Determines which commits need processing:
  - If this is the first run: processes all commits from the PR start to current HEAD
  - If previous runs exist: processes only new commits after the last processed commit
- This ensures that re-triggered workflows don't re-process already translated content

#### 2. Primary Language Detection
The system analyzes commits in order to detect whether the PR is primarily adding content in English or Italian:

- **Scans each commit** in the PR (from oldest to newest)
- **Categorizes files** as English (`docs/`) or Italian (`i18n/it/`)
- **Determines language** based on the first commit that contains documentation changes:
  - **English (EN)**: If a commit has only English files
  - **Italian (IT)**: If a commit has only Italian files
  - **Majority vote**: If a commit has both EN and IT files, the language with more files wins
  - If equal numbers, continues to the next commit
  
This approach ensures consistent behavior: all changes in the PR are assumed to follow the same language pattern established in the first meaningful commit.

#### 3. File-by-File Translation Decision
For each modified file in commits needing translation:

- **Checks if it matches the PR's primary language**
  - Files matching the primary language → candidate for translation
  - Files not matching → skipped (no automatic translation)

- **Checks for manual translations in the same commit**
  - If both the English and Italian counterpart files are modified in the **same commit** → **skips automatic translation** (assumes the developer manually translated)
  - If only the English file is modified → translates to Italian automatically
  - If only the Italian file is modified → translates to English automatically

#### 4. Translation Execution
For each file requiring translation:
- **Skips commits from the translation bot**: Workflow-generated commits (containing "auto-sync translations") are not re-processed
- **Extracts changed content** from the git diff
- **Calls the Translation Agent** with the git diff and context
- **Applies AI-powered intelligent positioning**: The agent analyzes where new content should be inserted in the target file
- **Preserves formatting**: Markdown structure, links, code blocks, and IDs remain unchanged
- **Commits translations** back to the PR branch

#### 5. Translation Agent Role
The Python agent (`translation-sync-agent.py`) handles the core translation logic:
- Processes git diffs to identify new or modified content
- Maps file paths between English (`docs/`) and Italian (`i18n/it/docusaurus-plugin-content-docs/current/`) directories
- Uses GitHub Models API (GPT-4o) for translation
- Applies translations while preserving markdown formatting and structure
- Maintains technical terminology consistency across both languages

## File Structure

### English Documentation
```
docs/
├── tutorial/
├── administrator-manual/
└── user-manual/
```

### Italian Documentation
```
i18n/it/docusaurus-plugin-content-docs/current/
├── tutorial/
├── administrator-manual/
└── user-manual/
```

## Best Practices & Recommendations

### ✅ Recommended Workflow
For best results and optimal automatic translation:

1. **Keep changes in a single language per commit or PR**
   - Add or modify documentation in **only English** across your commits, OR
   - Add or modify documentation in **only Italian** across your commits
   - This allows the workflow to clearly detect the primary language

2. **Let the workflow handle translations**
   - Modify files in your primary language
   - Commit the changes
   - Push to your PR
   - The workflow will automatically generate translations for the other language

3. **Avoid manual translations of automatically-translated content**
   - If the workflow has already translated content to the other language, edit the auto-generated translation rather than manually retranslating
   - This maintains consistency and prevents duplicate work

### Scenarios and Behavior

#### Scenario 1: Pure English PR
**What you do:**
- Modify only files in `docs/` (English)
- Commit and push

**What the workflow does:**
1. Detects primary language: **English**
2. For each modified English file without an Italian counterpart modification: generates Italian translation automatically
3. Italian translations are committed back to your PR

**Result:** ✅ Automatic translation to Italian

---

#### Scenario 2: Pure Italian PR
**What you do:**
- Modify only files in `i18n/it/docusaurus-plugin-content-docs/current/` (Italian)
- Commit and push

**What the workflow does:**
1. Detects primary language: **Italian**
2. For each modified Italian file without an English counterpart modification: generates English translation automatically
3. English translations are committed back to your PR

**Result:** ✅ Automatic translation to English

---

#### Scenario 3: Manual Translation in Same Commit (No Auto-Translation)
**What you do:**
- In the **same commit**, modify both:
  - `docs/tutorial/my-page.md` (English version)
  - `i18n/it/docusaurus-plugin-content-docs/current/tutorial/my-page.md` (Italian version)
- This signals that you've manually translated the content

**What the workflow does:**
1. Detects primary language: typically based on file count or skips if equal
2. For this specific commit: detects that **both counterparts are modified together**
3. **Skips automatic translation** (assumes manual translation is intentional and complete)

**Result:** ✅ No automatic translation (manual work is respected)

---

#### Scenario 4: Mixed Language PR (Not Recommended)
**What you do:**
- In different commits, modify:
  - First commit: only English files → primary language set to **English**
  - Later commit: mix of English and Italian files

**What the workflow does:**
1. Primary language: **English** (determined from first commit)
2. For mixed commits: only processes English files and skips Italian ones
3. Italian counterparts still lack automatic translations

**Result:** ⚠️ Partial coverage (some files not automatically translated)

**Recommendation:** Avoid this pattern. Keep language changes separated or indicate manual translations by modifying both files in the same commit.

---

#### Scenario 5: Re-triggered Workflow (No Duplicate Processing)
**What you do:**
- First run: workflow processes commits and creates translations
- You push feedback or fixes to the PR
- Workflow is manually triggered again (or automatically due to new commits)

**What the workflow does:**
1. **Identifies the last successful workflow execution** on the branch
2. Processes only **new commits** since that execution
3. Previously processed commits (now with their translations) are **not re-processed**
4. New commits receive fresh translations if needed

**Result:** ✅ Efficient re-triggering (no redundant work)

---

### When Auto-Translation is Skipped

The workflow will **NOT automatically translate** in these cases:

| Condition | Reason |
|-----------|--------|
| Both English and Italian counterparts modified in the same commit | Indicates manual translation |
| File language doesn't match PR's primary language | Prevents confusion in mixed PRs |
| Commit message contains "auto-sync translations" | Workflow-generated commit (avoid loops) |
| Workflow cannot determine primary language | Ambiguous PR structure (equal EN/IT files across all commits) |

### API and Performance Notes

- The workflow tests **GitHub Models API connectivity** before processing
- Translations use **GPT-4o** for accuracy and consistency
- The system includes **exponential backoff retry logic** to handle rate limiting
- Large PRs with many files may take longer; consider splitting very large changes

## Requirements

- Active GitHub Copilot subscription for the organization
- Standard GitHub Actions permissions (automatically configured)
- Documentation files in Docusaurus markdown format

## Usage Examples

### Example 1: Adding a New English Page
**Your PR contains:**
- New file: `docs/tutorial/new-feature.md` (English)

**Workflow behavior:**
1. Detects primary language: **English**
2. Creates automatic Italian translation: `i18n/it/docusaurus-plugin-content-docs/current/tutorial/new-feature.md`
3. Commits the translation to your PR

**Original English content:**
```markdown
## New Feature
This feature helps users manage their settings.
```

**Auto-generated Italian translation:**
```markdown
## Nuova Funzionalità
Questa funzionalità aiuta gli utenti a gestire le loro impostazioni.
```

---

### Example 2: Updating English Documentation
**Your PR contains:**
- Modified: `docs/tutorial/existing-page.md` (English)
  - Added a new section
  - Updated existing section

**Workflow behavior:**
1. Extracts the diff from git
2. Translates only the changed sections to Italian
3. Intelligently positions translations in the corresponding Italian file
4. Commits the update to your PR

---

### Example 3: Manual Italian Translation (Both Files in Same Commit)
**Your PR contains (in the same commit):**
- Modified: `docs/administrator-manual/index.md` (English)
- Modified: `i18n/it/docusaurus-plugin-content-docs/current/administrator-manual/index.md` (Italian)

**Workflow behavior:**
1. Detects both files modified in same commit
2. **Skips automatic translation** (respects your manual translation)
3. No additional commits added to PR

This scenario is useful when you:
- Want more control over translations
- Need to adjust terminology in specific contexts
- Prefer to translate manually for quality assurance

## Architecture Details

For technical implementation details, file specifications, and advanced configuration options, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Monitoring

Check the GitHub Actions workflow logs to monitor:
- Translation processing progress
- API connectivity status  
- Generated translations quality