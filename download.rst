.. _download-section:

========
Download
========

The table contains the following links for each release:

- the x86-64 image file, used to install NethSecurity
- the sha256sums file, which contains the SHA256 checksums to verify the integrity of the downloaded image
- the SBOM (Software Bill of Materials) file, in CDX (CycloneDX) format which contains the list of all software packages included in the image

Begin by downloading the most recent x86_64 image from the table below.

For verification, download also the hash file and execute the following command in a Linux shell to ensure the integrity of the downloaded image:

.. parsed-literal::

   grep |image| sha256sums | sha256sum -c

To proceed with the installation of NethSecurity, you have two options: write the downloaded image directly to your disk or create a bootable USB stick.
Refer to the :ref:`installation <install-section>` page for detailed instructions on both methods.

.. csv-table:: Stable releases
   :file: stable.csv
   :widths: 60, 10, 10, 10
   :header-rows: 1

.. csv-table:: Development releases
   :file: dev.csv
   :widths: 60, 10, 10, 10
   :header-rows: 1
