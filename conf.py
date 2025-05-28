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
import re
import boto3
import semver
from botocore import UNSIGNED
from botocore.client import Config

def owrt_version(release):
    match = re.match(r"^([\d.]+)(?:-(.+))?$", release)
    if match:
        version = match.group(1).split(".")
        return (int(version[0]), int(version[1]) if len(version) > 1 else 0,
                    int(version[2]) if len(version) > 2 else 0)
    else:
        raise ValueError(f"Invalid OpenWrt release format: {release}")

def ns_version(version):
    # convert from 0.0.1-beta1-3-g4c5b89a to 0.0.1-beta1.3
    # to correctly sort build part
    if version.count('-') > 1:
      parts = version.split('-')
      version = parts[0] + '-' + parts[1] + '.' + parts[2]
    try:
        return semver.VersionInfo.parse(version)
    except ValueError:
        return semver.VersionInfo.parse('0.0.0')

region = "ams3"
bucket_name = "nethsecurity"
s3_client = boto3.client("s3", region_name=region, endpoint_url='https://' + region + '.digitaloceanspaces.com', config=Config(signature_version=UNSIGNED))
for prefix in ['dev', 'stable']:
    unordered_versions = []
    response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=f'{prefix}/', Delimiter='/')
    for o in response.get('CommonPrefixes'):
        entry = entry = o.get('Prefix').removeprefix(f'{prefix}/').rstrip('/')
        if entry.startswith('8-'):
            unordered_versions.append(entry) 
    # Sort by OpenWrt release
    owrt_sorted = sorted(unordered_versions, key=lambda x: owrt_version(x))
    # Sort by NethSecurity release
    sorted_dev = sorted(owrt_sorted, key=lambda v: ns_version(v[13:]), reverse=True)
    fp = open(f'{prefix}.csv', 'w')
    fp.write("Version,Image,Hash,SBOM\n")
    for entry in sorted_dev:
        image = f'`x86-64 <{base_url}/{prefix}/{entry}/targets/x86/64/nethsecurity-{entry}-x86-64-generic-squashfs-combined-efi.img.gz>`__'
        hash = f'`SHA256 <{base_url}/{prefix}/{entry}/targets/x86/64/sha256sums>`__'
        entry_v = ns_version(entry[13:])
        # SBOM is available since only 1.5.1-15 prerelease and 1.5.2 stable
        if (entry_v.prerelease and entry_v >= semver.VersionInfo.parse('1.5.1-15') or (not entry_v.prerelease and entry_v > semver.VersionInfo.parse('1.5.1'))):
            sbom = f'`CDX <{base_url}/{prefix}/{entry}/targets/x86/64/nethsecurity-{entry}-x86-64-generic.bom.cdx.json>`__'
        else:
            sbom = ""
        fp.write(f'{entry},{image},{hash},{sbom}\n')
    fp.close()
