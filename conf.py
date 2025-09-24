# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# sys.path.insert(0, os.path.abspath('.'))
import datetime
import urllib.request

# -- Project information -----------------------------------------------------

project = 'NethSecurity'
author = 'Nethesis Srl and the NethSecurity project contributors'
#copyright = u'%d, %s' % (datetime.date.today().year, author)

copyright = u'%d, Nethesis Srl and the NethSecurity project contributors' % datetime.date.today().year


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
        'sphinx_copybutton',
        'sphinx.ext.extlinks'
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store', 'README.rst', "venv"]

# -- Options for translations ------------------------------------------------
locale_dirs = ['locale/']
gettext_compact = False
gettext_uuid = True
gettext_location = True
gettext_additional_targets = ['index']

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_book_theme'

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']
html_css_files = ["custom.css"]
html_js_files = ['kapa.js']

html_theme_options = {
    "repository_url": "https://github.com/NethServer/nethsecurity-docs",
    "use_repository_button": True,
    "use_download_button": False,
    "navigation_with_keys": False
}

html_tile = "NethSecurity documentation"
html_logo = "_static/logo.svg"
html_favicon = "_static/favicon.ico"

highlight_options = {'stripall': True}

# Retrieve latest release
base_url="https://updates.nethsecurity.nethserver.org"
version = ""
with urllib.request.urlopen(f'{base_url}/stable/latest_release') as f:
    version = f.read().decode('utf-8').strip()

rst_prolog = f"""
.. |image| replace:: nethsecurity-{version}-x86-64-generic-squashfs-combined-efi.img.gz
.. |image_no_gz| replace:: nethsecurity-{version}-x86-64-generic-squashfs-combined-efi.img
.. |version| replace:: {version}
.. |download_url| replace:: {base_url}/stable/{version}/targets/x86/64/nethsecurity-{version}-x86-64-generic-squashfs-combined-efi.img.gz
"""

# generate download table
import boto3
import semver
from botocore import UNSIGNED
from botocore.client import Config

def ns_version(version):
    if isinstance(version, str):
        # convert from 0.0.1-beta1-3-g4c5b89a to 0.0.1-beta1.3
        # to correctly sort build part
        version = version[13:]
        if version.count('-') > 1:
            parts = version.split('-')
            version = parts[0] + '-' + parts[1] + '.' + parts[2]
        try:
            return semver.VersionInfo.parse(version)
        except ValueError:
            return semver.VersionInfo.parse('0.0.0')
    elif isinstance(version, semver.VersionInfo):
        return version
    else:
        raise ValueError(f"Invalid version type: {type(version)}")

region = "ams3"
bucket_name = "nethsecurity"
s3_client = boto3.client("s3", region_name=region, endpoint_url='https://' + region + '.digitaloceanspaces.com', config=Config(signature_version=UNSIGNED))
for prefix in ['dev', 'stable']:
    unordered_versions = []
    response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=f'{prefix}/', Delimiter='/')
    for o in response.get('CommonPrefixes'):
        entry = o.get('Prefix').removeprefix(f'{prefix}/').rstrip('/')
        if entry == '24.10.0':
            # skipping a version that is not a NethSecurity release but gets parsed by semver
            continue
        elif entry.startswith('8-'):
            unordered_versions.append(entry)
        else:
            try:
                unordered_versions.append(semver.Version.parse(entry))
            except ValueError:
                print(f"Skipping invalid version: {entry}")
                continue

    if prefix == 'dev':
        sorted_versions = sorted(
            unordered_versions,
            key=lambda v: (
                ns_version(v).build.split('.')[-1] if ns_version(v).build else "",
                ns_version(v).prerelease is None  # Tagged builds (no prerelease) come last
            ),
            reverse=True
        )
    else:
        sorted_versions = sorted(unordered_versions, key=lambda v: ns_version(v) or "", reverse=True)
    fp = open(f'{prefix}.csv', 'w')
    fp.write("Version,Image,Hash,SBOM\n")
    for entry in sorted_versions:
        image = f'`x86-64 <{base_url}/{prefix}/{entry}/targets/x86/64/nethsecurity-{entry}-x86-64-generic-squashfs-combined-efi.img.gz>`__'
        hash = f'`SHA256 <{base_url}/{prefix}/{entry}/targets/x86/64/sha256sums>`__'
        entry_v = ns_version(entry)
        # SBOM is available since only 1.5.1-15 prerelease and 1.5.2 stable
        if entry_v > semver.VersionInfo.parse('1.5.1'):
            sbom = f'`CDX <{base_url}/{prefix}/{entry}/targets/x86/64/nethsecurity-{entry}-x86-64-generic.bom.cdx.json>`__'
        else:
            sbom = ""
        fp.write(f'{entry},{image},{hash},{sbom}\n')
    fp.close()

# Generate PNG from graphviz files
import os
import subprocess
# Directory containing dot files
dot_dir = '_static'

# Find all dot files in the directory
dot_files = [f for f in os.listdir(dot_dir) if f.endswith('.dot')]

# Convert each dot file to PNG
for dot_file in dot_files:
    input_path = os.path.join(dot_dir, dot_file)
    output_path = os.path.join(dot_dir, dot_file.replace('.dot', '.png'))
    
    # Run dot command to convert to PNG
    subprocess.run(['dot', '-Tpng', input_path, '-o', output_path], check=True)
    print(f"Generated {output_path}")
