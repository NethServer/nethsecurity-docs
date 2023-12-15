.. _updates-section:

=======
Updates
=======

NethSecurity allows two types of updates, both available from the ``Update`` section under the ``System`` menu.

**1. Bug & security fixes**

These updates are intended for minor updates and bugfixes.

Typically they are performed automatically, but at any time it is possible to check for new updates available by clicking on :guilabel:`Check for Fixes` button.
These updates do not require a restart of NethSecurity, they are tied to a specific version and distributed using packages.

**2. System updates** (switching to a different version)

These updates involve the transition to a new version of the firmware that introduces new features, improvements and wider hardware support.

This type of update will reboot the device (which will therefore not be reachable for a few dozen seconds) and then completely rewrites the firmware, preserving all the configurations.
However it is recommended to save a configuration backup before proceeding with the upgrade.

If a new version is available, the user interface will display an information banner and a dedicated button :guilabel:`Update System` that will allow you to perform the update.

Alternatively, it is always possible to manually upload a compatible image using the :guilabel:`Update with image file` button and proceed with the update.

You can also perform a ``System update`` from the command line.
To do this, simply save download the new image file (it is recommended to save it inside ``/tmp`` directory) and run the following command: ::

  sysupgrade -v nethsecurity-<version>-x86-64-generic-squashfs-combined.img.gz

The ``sysupgrade`` command flashes the new image file to the device.
