#!/usr/bin/env python3
"""
Translation Sync Agent for NethSecurity Documentation

This agent analyzes changes in documentation files and automatically
synchronizes translations between English and Italian versions.
Uses GitHub Copilot Chat API for translations.
"""

import os
import sys
from pathlib import Path
from typing import Optional
import subprocess
import requests
import time
from git import Repo

class DocumentationSyncAgent:
    def __init__(self, commit_hash: Optional[str] = None):
        self.repo = Repo('.')
        self.github_token = os.getenv('GITHUB_TOKEN')
        self.base_path = Path('.')
        self.commit_hash = commit_hash  # Specific commit to analyze
        
        # Path mappings
        self.en_docs_path = Path('docs')
        self.it_docs_path = Path('i18n/it/docusaurus-plugin-content-docs/current')
        
        # GitHub Models API configuration
        self.models_api_url = "https://models.github.ai/inference/chat/completions"
        self.model_name = "openai/gpt-4o"  # Centralized model selection
        
        # Shared prompt templates and rules
        self.CRITICAL_FORMATTING_RULES = """CRITICAL FORMATTING RULES:
- NEVER include markdown code blocks markers like ```markdown or ``` in the output
- Translate section titles when appropriate (e.g., "New test section" → "Nuova sezione di test")
- Do NOT translate words that are common in both languages (e.g., "Feedback", "API", "Login")
- When translating section and subsection titles, translate only the title; DO NOT TRANSLATE the relative link (e.g., '## Section Title {#section-id}' → '## Titolo Sezione {#section-id}')
- Keep email links: [email@domain.com](mailto:email@domain.com)
- Keep internal links: [text](relative/path.md)
- Bold for UI elements: **Install**, **Configure**
- Backticks for code/values: `Nethesis,1234`"""

        self.TITLE_TRANSLATION_EXAMPLES = """TITLE TRANSLATION EXAMPLES:
- "Test section" → "Sezione di test"
- "Configuration" → "Configurazione" 
- "Installation guide" → "Guida all'installazione"
- "API" → "API" (no translation)
- "Feedback" → "Feedback" (no translation)
- "Dashboard" → "Dashboard" (no translation)
- "Overview" → "Overview" (no translation)"""

        self.SYSTEM_PROMPT_TRANSLATOR = "You are an expert technical documentation translator specializing in network security and firewall systems."
        
        self.SYSTEM_PROMPT_EDITOR = "You are an expert documentation editor specializing in intelligent content positioning and file merging."
        
        # Rate limiting configuration
        self.max_retries = 5
        self.base_retry_delay = 2  # seconds

    def _make_api_call_with_retry(self, headers: dict, payload: dict, operation_name: str = "API call") -> Optional[dict]:
        """Make API call with exponential backoff retry logic for rate limiting"""
        
        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    self.models_api_url,
                    headers=headers,
                    json=payload,
                    timeout=60
                )
                
                if response.status_code == 200:
                    return response.json()
                
                elif response.status_code == 429:
                    # Rate limited - retry with exponential backoff
                    retry_delay = self.base_retry_delay * (2 ** attempt)
                    
                    # Check for Retry-After header
                    retry_after = response.headers.get('Retry-After')
                    if retry_after:
                        try:
                            retry_delay = int(retry_after)
                        except ValueError:
                            pass
                    
                    print(f"⚠️ Rate limited (429) on {operation_name}")
                    print(f"   Attempt {attempt + 1}/{self.max_retries}")
                    print(f"   Retrying in {retry_delay} seconds...")
                    
                    time.sleep(retry_delay)
                    continue
                
                else:
                    # Other error
                    print(f"❌ GitHub Models API error on {operation_name}: {response.status_code}")
                    print(f"   Response: {response.text}")
                    return None
                    
            except requests.exceptions.Timeout:
                print(f"⚠️ Timeout on {operation_name}, attempt {attempt + 1}/{self.max_retries}")
                if attempt < self.max_retries - 1:
                    retry_delay = self.base_retry_delay * (2 ** attempt)
                    print(f"   Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    continue
                else:
                    print(f"❌ Max retries reached for {operation_name}")
                    return None
                    
            except Exception as e:
                print(f"❌ Unexpected error on {operation_name}: {e}")
                return None
        
        print(f"❌ Max retries ({self.max_retries}) exceeded for {operation_name}")
        return None

    def get_file_content(self, file_path: str) -> str:
        """Get content of a file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return ""

    def get_file_diff(self, file_path: str) -> str:
        """Get git diff for a specific file from a specific commit"""
        try:
            if self.commit_hash:
                # Get diff for this specific commit only
                result = subprocess.run(
                    ['git', 'diff-tree', '--no-commit-id', '-p', '-r', self.commit_hash, '--', file_path],
                    capture_output=True, text=True, check=True
                )
                diff_output = result.stdout
                
                print(f"🔍 Git diff command: git diff-tree --no-commit-id -p -r {self.commit_hash} -- {file_path}")
                print(f"🔍 Diff output length: {len(diff_output)} characters")
                if diff_output:
                    print(f"🔍 Diff preview: {diff_output[:300]}...")
                else:
                    print("🔍 No diff output for this commit")
            else:
                # Fallback to old behavior (compare with main branch)
                result = subprocess.run(
                    ['git', 'diff', 'origin/main..HEAD', '--', file_path],
                    capture_output=True, text=True, check=True
                )
                diff_output = result.stdout
                
                print(f"🔍 Git diff command: git diff origin/main..HEAD -- {file_path}")
                print(f"🔍 Diff output length: {len(diff_output)} characters")
                if diff_output:
                    print(f"🔍 Diff preview: {diff_output[:300]}...")
            
            return diff_output
        except subprocess.CalledProcessError as e:
            print(f"🔍 Git diff error: {e}")
            return ""

    def map_en_to_it_path(self, en_file: str) -> str:
        """Map English file path to Italian equivalent"""
        # Remove 'docs/' prefix and add Italian path
        relative_path = en_file[5:]  # Remove 'docs/'
        return f"i18n/it/docusaurus-plugin-content-docs/current/{relative_path}"

    def map_it_to_en_path(self, it_file: str) -> str:
        """Map Italian file path to English equivalent"""
        # Remove Italian path prefix and add 'docs/'
        relative_path = it_file[len('i18n/it/docusaurus-plugin-content-docs/current/'):]
        return f"docs/{relative_path}"

    def analyze_changes_with_ai(self, file_path: str, diff_content: str, source_lang: str, target_lang: str) -> Optional[str]:
        """Use GitHub Models to analyze changes and generate translation"""
        
        prompt = f"""You are a documentation translation agent for NethSecurity, an open source firewall/UTM system.

TASK: Analyze the git diff below and provide ONLY the translation of the NEW/MODIFIED content.

SOURCE LANGUAGE: {source_lang}
TARGET LANGUAGE: {target_lang}
FILE: {file_path}

GIT DIFF:
```
{diff_content}
```

INSTRUCTIONS:
1. Identify what content was ADDED or MODIFIED (lines starting with +)
2. Extract ONLY the new/modified markdown content (ignore git diff syntax)
3. Translate the content to {target_lang}
4. Maintain all markdown formatting, links, and IDs exactly as they are
5. Keep technical terms consistent (NethSecurity, OpenWrt, etc.)
6. For Italian: use formal tone, keep button labels in **bold**, code in `backticks`

{self.CRITICAL_FORMATTING_RULES}

{self.TITLE_TRANSLATION_EXAMPLES}

OUTPUT FORMAT:
Return ONLY the translated markdown content that should be added/modified, without any explanations, git diff syntax, or markdown code block markers.
"""

        try:
            headers = {
                "Authorization": f"Bearer {self.github_token}",
                "Accept": "application/vnd.github+json",
                "Content-Type": "application/json"
            }
            
            payload = {
                "messages": [
                    {
                        "role": "system", 
                        "content": self.SYSTEM_PROMPT_TRANSLATOR
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                "model": self.model_name,
                "temperature": 0.2
            }
            
            result = self._make_api_call_with_retry(
                headers, 
                payload, 
                f"translation of {file_path}"
            )
            
            if result:
                return result["choices"][0]["message"]["content"].strip()
            else:
                return None
                
        except Exception as e:
            print(f"Error with GitHub Models translation: {e}")
            return None

    def apply_translation_to_file(self, target_file: str, original_content: str, translated_content: str, diff_content: str):
        """Apply translated content to target file with AI-powered intelligent positioning"""
        
        # Create target directory if it doesn't exist
        target_path = Path(target_file)
        target_path.parent.mkdir(parents=True, exist_ok=True)
        
        # If target file doesn't exist, create it with translated content
        if not target_path.exists():
            if not translated_content:
                # Pure deletion with no target file: nothing to remove or create
                print(f"⚠️ Target file does not exist and no content to add: {target_file} - skipping")
                return
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(translated_content)
            print(f"Created new file: {target_file}")
            return

        # Read current target file content
        with open(target_path, 'r', encoding='utf-8') as f:
            current_content = f.read()

        # Nothing to insert and nothing removed in the source: no work to do.
        # For a pure deletion translated_content is empty but the diff still
        # carries removed lines, so we must proceed to positioning.
        if not translated_content and not self._diff_has_deletions(diff_content):
            return

        # Use AI to intelligently position the translated content
        updated_content = self._apply_ai_positioning(
            current_content, translated_content, original_content, diff_content, target_file
        )
        
        if updated_content:
            # Write the updated content
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"Updated file with AI positioning: {target_file}")
        else:
            # AI positioning failed - do not apply changes
            print(f"⚠️ AI positioning failed for: {target_file} - translation not applied")

    def _apply_ai_positioning(self, current_target_content: str, translated_content: str, original_source_content: str, diff_content: str, target_file: str) -> Optional[str]:
        """Use AI to intelligently position translated content in the target file"""

        if translated_content.strip():
            new_content_section = f"""- New translated content to be inserted:
```
{translated_content}
```"""
        else:
            new_content_section = (
                "- New translated content to be inserted: (NONE — this change ONLY "
                "REMOVES content).\n"
                "  IMPORTANT: This is a deletion-only change. You must return the "
                "current target file EXACTLY as it is, changing NOTHING except the "
                "removal of the parts that correspond to the lines deleted in the "
                "git diff. Do NOT translate, re-translate, rephrase, reformat, "
                "reorder or otherwise touch any other part of the file. Every line "
                "that is not the one being removed must remain byte-for-byte "
                "identical to the current target file content shown above."
            )

        prompt = f"""You are an expert documentation editor. Your task is to intelligently merge the changes shown in a git diff into an existing translated documentation file.

CONTEXT:
- Original source file (the file that was modified):
```
{original_source_content}
```

- Current target file content (where the change should be applied):
```
{current_target_content}
```

- Git diff showing what changed in the source file:
```
{diff_content}
```

{new_content_section}

TASK:
Analyze the changes shown in the git diff and apply the equivalent change to the current target file. Changes may ADD, MODIFY, or REMOVE content.

RULES:
1. **Understand the context**: Look at where the changes were made in the source file (lines starting with '+' were added, lines starting with '-' were removed)
2. **Find the equivalent position**: Locate the corresponding section in the target file
3. **Insert appropriately**:
   - If it's a NEW section/content: Insert it in the same relative position
   - If it's a MODIFICATION: Replace the existing content with the new translation
   - If it's an ADDITION to existing section: Add it in the correct place within that section
4. **Avoid duplication (CRITICAL)**: Before inserting anything, check whether that content — or its equivalent already-translated version — is ALREADY present in the current target file. If it is, do NOT add it again: leave that part of the file unchanged. The result must be IDEMPOTENT — if the change was already applied in a previous run, re-applying it must produce no further changes. Never create a second copy of a sentence, list item, paragraph or section that already exists in the target file.
5. **Handle deletions**: If the git diff shows removed lines (starting with '-' with no '+' counterpart), locate the sentence, paragraph or list item in the target file that corresponds to the removed source text and REMOVE only that part. Do NOT translate or re-insert the removed text. Everything else in the file must stay untouched — do NOT translate, re-translate, rephrase or reformat any surrounding content; leave it exactly as it currently is.
6. **Preserve structure**: Maintain the overall document structure and hierarchy. Do not add, remove or reword any content other than what the git diff indicates. Any content not affected by the diff must remain identical to the current target file, character for character.
7. **Keep formatting**: Preserve all markdown formatting, spacing, and line breaks

OUTPUT FORMAT:
Return the COMPLETE updated target file content with the translated content properly positioned.
CRITICAL: Do NOT wrap the output in markdown code blocks (```). Do NOT add any explanations.
Return ONLY the raw file content, starting directly with the file's content (e.g., starting with --- for frontmatter or # for headers).
"""

        try:
            headers = {
                "Authorization": f"Bearer {self.github_token}",
                "Accept": "application/vnd.github+json",
                "Content-Type": "application/json"
            }
            
            payload = {
                "messages": [
                    {
                        "role": "system", 
                        "content": self.SYSTEM_PROMPT_EDITOR
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                "model": self.model_name,
                "temperature": 0
            }
            
            print(f"🤖 Using AI positioning for {target_file}")
            
            result = self._make_api_call_with_retry(
                headers,
                payload,
                f"AI positioning for {target_file}"
            )
            
            if result:
                positioned_content = result["choices"][0]["message"]["content"].strip()
                print(f"✅ AI positioning successful")
                return positioned_content
            else:
                return None
                
        except Exception as e:
            print(f"❌ Error with AI positioning: {e}")
            return None

    def _is_file_deletion(self, diff_content: str) -> bool:
        """Check if the diff represents a full file deletion"""
        return any(
            line.startswith('deleted file mode')
            for line in diff_content.split('\n')
        )

    def _diff_has_additions(self, diff_content: str) -> bool:
        """Check if the diff contains any added lines (excluding the +++ header)"""
        return any(
            line.startswith('+') and not line.startswith('+++')
            for line in diff_content.split('\n')
        )

    def _diff_has_deletions(self, diff_content: str) -> bool:
        """Check if the diff contains any removed lines (excluding the --- header)"""
        return any(
            line.startswith('-') and not line.startswith('---')
            for line in diff_content.split('\n')
        )

    def translate_entire_file(self, file_path: str, source_content: str, source_lang: str, target_lang: str) -> Optional[str]:
        """Translate an entire file content for new files"""
        
        prompt = f"""You are a documentation translation agent for NethSecurity, an open source firewall/UTM system.

TASK: Translate the ENTIRE content of this documentation file from {source_lang} to {target_lang}.

SOURCE LANGUAGE: {source_lang}
TARGET LANGUAGE: {target_lang}
FILE: {file_path}

SOURCE CONTENT:
```
{source_content}
```

INSTRUCTIONS:
1. Translate the ENTIRE file content to {target_lang}
2. Maintain all markdown formatting, links, and IDs exactly as they are
3. Keep technical terms consistent (NethSecurity, OpenWrt, etc.)
4. For Italian: use formal tone, keep button labels in **bold**, code in `backticks`

{self.CRITICAL_FORMATTING_RULES}

{self.TITLE_TRANSLATION_EXAMPLES}

OUTPUT FORMAT:
Return the COMPLETE translated file content, without any explanations or markdown code block markers.
"""

        try:
            headers = {
                "Authorization": f"Bearer {self.github_token}",
                "Accept": "application/vnd.github+json",
                "Content-Type": "application/json"
            }
            
            payload = {
                "messages": [
                    {
                        "role": "system", 
                        "content": self.SYSTEM_PROMPT_TRANSLATOR
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                "model": self.model_name,
                "temperature": 0.2
            }
            
            print(f"🌍 Translating entire file: {file_path}")
            
            result = self._make_api_call_with_retry(
                headers,
                payload,
                f"full file translation of {file_path}"
            )
            
            if result:
                return result["choices"][0]["message"]["content"].strip()
            else:
                return None
                
        except Exception as e:
            print(f"Error with GitHub Models full file translation: {e}")
            return None

    def sync_translation(self, source_file: str, target_file: str, source_lang: str, target_lang: str):
        """Sync translation from source to target file"""
        
        # Check if target file exists to determine if this is a new file
        target_exists = Path(target_file).exists()
        
        # Get the diff for source file
        diff_content = self.get_file_diff(source_file)
        if not diff_content:
            print(f"No changes detected in {source_file}")
            return
        
        print(f"Processing changes in {source_file}")
        print(f"Diff content preview: {diff_content[:200]}...")

        # Handle full file deletion: the source file was removed entirely, so the
        # corresponding translated file must be deleted too (not emptied/merged).
        # This must be checked before the pure-deletion branch, since a deleted
        # file also contains only removed lines.
        if self._is_file_deletion(diff_content):
            print(f"🗑️ Detected full file deletion: {source_file}")
            target_path = Path(target_file)
            if target_path.exists():
                target_path.unlink()
                print(f"🗑️ Deleted translated file: {target_file}")
            else:
                print(f"ℹ️ Translated file does not exist, nothing to delete: {target_file}")
            return

        # Determine the kind of change we're dealing with
        has_additions = self._diff_has_additions(diff_content)
        has_deletions = self._diff_has_deletions(diff_content)
        is_pure_deletion = has_deletions and not has_additions

        if not target_exists:
            print(f"🆕 No existing translation for {source_file} - translating entire file")
            source_content = self.get_file_content(source_file)
            if not source_content:
                print(f"Source file is empty or missing, nothing to translate: {source_file}")
                return
            translated_content = self.translate_entire_file(source_file, source_content, source_lang, target_lang)
            if not translated_content:
                print(f"Could not generate translation for {source_file}")
                return
        elif is_pure_deletion:
            print(f"🗑️ Detected pure deletion: {source_file}")
            # no new content to translate/insert, just deletion
            # skip the translation call entirely to avoid mistakenly translating the removed lines as content to insert
            translated_content = ""
        else:
            print(f"📝 Detected file modification: {source_file}")
            # For modifications, use the existing diff-based approach
            translated_content = self.analyze_changes_with_ai(
                source_file, diff_content, source_lang, target_lang
            )
            if not translated_content:
                print(f"Could not generate translation for {source_file}")
                return

        print(f"Generated translation: {translated_content[:200]}...")
        
        # Get original content for context
        original_content = self.get_file_content(source_file)
        
        # Apply translation
        self.apply_translation_to_file(target_file, original_content, translated_content, diff_content)

    def run(self, specific_file: str = None):
        """Main execution method"""
        if self.commit_hash:
            print(f"🤖 Starting Documentation Translation Sync Agent")
            print(f"📦 Processing commit: {self.commit_hash}")
        else:
            print("🤖 Starting Documentation Translation Sync Agent")
        
        # Check if GitHub token is available
        if not self.github_token:
            print("❌ GITHUB_TOKEN not found. Cannot access GitHub Models API.")
            return
        
        # Process specific file (passed from workflow)
        if not specific_file:
            print("❌ No file specified. This agent expects a specific file as argument.")
            return
            
        if not specific_file.endswith(('.md', '.mdx')):
            print(f"❌ File {specific_file} is not a markdown file. Skipping.")
            return
            
        print(f"📝 Processing file: {specific_file}")
        
        # Determine source and target files based on file path
        if specific_file.startswith('docs/'):
            # English file -> translate to Italian
            source_file = specific_file
            target_file = self.map_en_to_it_path(specific_file)
            source_lang = "English"
            target_lang = "Italian"
            print(f"🔄 EN → IT: {source_file} → {target_file}")
            
        elif specific_file.startswith('i18n/it/docusaurus-plugin-content-docs/current/'):
            # Italian file -> translate to English
            source_file = specific_file
            target_file = self.map_it_to_en_path(specific_file)
            source_lang = "Italian"
            target_lang = "English"
            print(f"🔄 IT → EN: {source_file} → {target_file}")
            
        else:
            print(f"❌ File {specific_file} is not in a recognized documentation directory. Skipping.")
            return
        
        # Process the translation
        self.sync_translation(source_file, target_file, source_lang, target_lang)
        
        print("✅ Translation sync completed!")

if __name__ == "__main__":
    import sys
    
    # Check for commit hash argument
    specific_file = sys.argv[1] if len(sys.argv) > 1 else None
    commit_hash = sys.argv[2] if len(sys.argv) > 2 else None
    
    agent = DocumentationSyncAgent(commit_hash=commit_hash)
    agent.run(specific_file)