#!/usr/bin/python3

# SPDX-License-Identifier: GPL-3.0-or-later
#
# This script automates the translation of software documentation and GUI labels from English to Italian.
#
# Key features:
# - Downloads and flattens English and Italian GUI label dictionaries from the NethServer/nethsecurity-ui repository.
# - Replaces English GUI labels in documentation with their Italian equivalents before translation, ensuring
#   accurate and consistent terminology.
# - Uses a carefully crafted prompt to instruct the LLM to preserve reStructuredText (reST) formatting,
#   code blocks, directives, references, and markup, translating only human-readable content.
# - Merges new entries from .pot files into existing Italian .po files, translating only untranslated entries.
# - Supports both OpenAI API and GitHub models via environment variables.
# - Ensures that technical terms, product names, and code are not translated, and that the impersonal form is
#   used in Italian translations.
#
# Usage:
#   Set the OPENAI_API_KEY or GITHUB_TOKEN environment variable.
#   Run the script in a directory containing a "pot" folder with .pot files.
#   The script will create or update Italian .po files in "it/LC_MESSAGES".
#

import os
import sys
import polib
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
import glob
import requests
import re

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # Set this to use OpenAI API
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # Set this to use GitHub models

def download_and_load_labels():
    url_en = "https://raw.githubusercontent.com/NethServer/nethsecurity-ui/refs/heads/main/src/i18n/en/translation.json"
    url_it = "https://raw.githubusercontent.com/NethServer/nethsecurity-ui/refs/heads/main/src/i18n/it/translation.json"
    response_en = requests.get(url_en)
    response_en.raise_for_status()
    labels_en = response_en.json()
    response_it = requests.get(url_it)
    response_it.raise_for_status()
    labels_it = response_it.json()
    return flatten_json(labels_en), flatten_json(labels_it)

# Load GUI label translations as a map
def flatten_json(y, prefix=''):
    out = {}
    if isinstance(y, dict):
        for k, v in y.items():
            new_key = f"{prefix}.{k}" if prefix else k
            out.update(flatten_json(v, new_key))
    else:
        out[prefix] = y
    return out

# Translate GUI labels in the message using the provided dictionaries.
# This avoid to pass the full translation dictionary to the LLM,
# which would be too large, inefficient and very expensive.
def translate_labels(message, flat_labels_en, flat_labels_it):
    if not message:
        return message

    # Replace English labels with Italian ones
    for key, value in flat_labels_en.items():
        if value in message:
            it_value = flat_labels_it.get(key)
            if it_value:
                print(f"Translating local label: {value} -> {it_value}")
                # Replace only if value is inside double backticks
                try:
                   message = re.sub(rf"``{re.escape(value)}``", f"``{it_value}``", message)
                   message = re.sub(rf"(:guilabel:`){re.escape(value)}(`)", rf"\1{it_value}\2", message)
                except:
                    # If the regex fails, just ignore the error (it can happen with string containing special chars)
                    pass

    return message

def translate(llm, prompt, text):
    # Use LangChain to generate a translation
    print(f"Translating with AI: {text[:30]!r}")
    chain = prompt | llm
    response = chain.invoke({"text": text})
    if hasattr(response, "content"):
        return response.content.strip()
    return str(response).strip()

def process_pot_files(llm, prompt, pot_dir):
    it_dir = "it/LC_MESSAGES"
    labels_en, labels_it = download_and_load_labels()

    pot_files = glob.glob(os.path.join(pot_dir, "*.pot"))
    for pot_file in pot_files:
        base = os.path.splitext(os.path.basename(pot_file))[0]
        it_file = os.path.join(it_dir, f"{base}.po")
        print(f"Processing {pot_file} -> {it_file}")
        if os.path.exists(it_file):
            # Merge new entries from pot into it.po
            it_po = polib.pofile(it_file)
            it_po.merge(polib.pofile(pot_file))
            if len(it_po.untranslated_entries()) <= 0:
                print(f"No new untranslated entries in {pot_file}, skipping translation.")
                continue
            for entry in it_po.untranslated_entries():
                msgid_translated = translate_labels(entry.msgid, labels_en, labels_it)
                translation = translate(llm, prompt, msgid_translated)
                entry.msgstr=translation
                it_po.save(it_file)
            print(f"Updated {it_file} with new translations from {pot_file}")
        else:
            pot = polib.pofile(pot_file)
            it_po = polib.POFile()
            for entry in pot:
                if not entry.msgid or entry.msgid.strip() == "":
                    continue
                msgid_translated = translate_labels(entry.msgid, labels_en, labels_it)
                translation = translate(llm, prompt, msgid_translated)
                # Update the entry with the translation
                new_entry = polib.POEntry(
                    msgid=entry.msgid,
                    msgstr=translation,
                    occurrences=entry.occurrences,
                    comment=entry.comment,
                    tcomment=entry.tcomment,
                    flags=entry.flags,
                )
                it_po.append(new_entry)
                it_po.save(it_file)


if __name__ == "__main__":
    if not OPENAI_API_KEY and not GITHUB_TOKEN:
        print("Please set the OPENAI_API_KEY or GITHUB_TOKEN environment variable.")
        sys.exit(1)

    if GITHUB_TOKEN != None:
        llm = ChatOpenAI(openai_api_key=GITHUB_TOKEN, model="gpt-4.1", temperature=0.1, base_url="https://models.inference.ai.azure.com")
    else:
        llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model="gpt-4.1", temperature=0.1)
  
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                f"You are a professional technical translator for software documentation. "
                f"Translate the following text from English to {{\"Italian\"}}. "
                f"Preserve all reStructuredText (reST) formatting, code blocks, directives, and references exactly as in the original. "
                f"Preserve the link references, such as :ref:`link-name`, :doc:`link-name`, and :term:`term-name` or link definitions like '.. _local_allowlist-section:'"
                f"Text enclosed in double backticks (``like this``) or in :guilabel:`like this` refers to GUI labels. "
                f"Translate these GUI labels carefully, preserving their markup and making sure the label is accurate and clear in Italian. "
                f"Do NOT translate placeholders, variable names, or any code. "
                f"Only translate the human-readable content."
                f"If the English text is already in Italian, return it unchanged. "
                f"If the Enlighs text is using the 'you' form, use an impersonal form in Italian "
                f"If something looks like a techical term, do not translate it. "
                f"If something looks like a product name, do not translate it. "
                .replace("{", "{{").replace("}", "}}"),
            ),
            ("human", "{text}"),
        ]
    )

    process_pot_files(llm, prompt, "pot")
