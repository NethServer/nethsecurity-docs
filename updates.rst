.. _updates-section:

=======
Updates
=======

.. highlight:: bash

NethSecurity uses two different methods to update the system:

**1. Security and minor bugfixes are distributed using packages.** To update the system, run the following commands: ::

    opkg update && opkg upgrade

The ``opkg update`` command updates the list of available packages, and the ``opkg upgrade`` command upgrades all of the installed packages to the latest versions.

**2. New features are released with new images.** To update the system to a new version with new features, download the new image file and run the following command: ::

  sysupgrade -v nethsecurity-<version>-x86-64-generic-squashfs-combined.img.gz

The ``sysupgrade`` command flashes the new image file to the device.

**Note:** it is important to back up your configuration before updating your NethSecurity system.
