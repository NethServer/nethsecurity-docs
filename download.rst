.. _download-section:

========
Download
========

Begin by downloading the most recent x86_64 image from the table below.

For verification, download also the hash file and execute the following command in a Linux shell to ensure the integrity of the downloaded image:

.. parsed-literal::

   grep |image| sha256sums | sha256sum -c

To proceed with the installation of NethSecurity, you have two options: write the downloaded image directly to your disk or create a bootable USB stick.
Refer to the :ref:`installation <install-section>` page for detailed instructions on both methods.

.. csv-table:: Stable releases
   :file: stable.csv
   :widths: 60, 20, 20
   :header-rows: 1

.. csv-table:: Development releases
   :file: dev.csv
   :widths: 60, 20, 20
   :header-rows: 1
