.. _updates-section:

=======
Updates
=======

NethSecurity allows two types of updates, both available from the ``Update`` section under the ``System`` menu:

- normal updates for bugfixes and security patches
- system upgrades to switch to a different version

Bug & security fixes
====================

These updates are intended for minor updates and bugfixes.

Typically they could be performed automatically, but at any time it is possible to check for new updates available by clicking on :guilabel:`Check for Fixes` button.
These updates do not require a restart of NethSecurity, they are tied to a specific version and distributed using packages.

When using this method, the version of the image shown inside the dashboard does not change, but the system is updated with the latest fixes.

System upgrades
===============

This types of upgrages involve the transition to a new version of the firmware that introduces new features, improvements and wider hardware support.

.. note::

  The upgrade will preserve all the configurations and settings, but it will not preserve extra packages installed by the user.

This type of update will reboot the device (which will therefore not be reachable for a few dozen seconds) and then completely rewrites the firmware, preserving all the configurations.
However it is recommended to save a configuration backup before proceeding with the upgrade.

If a new version is available, the user interface will display an information banner and a dedicated button :guilabel:`Update System` that will allow you to perform the update.

Alternatively, it is always possible to manually upload a compatible image using the :guilabel:`Update with image file` button and proceed with the update.

.. rubric:: Update from command line

You can also perform a ``System update`` from the command line.
To do this, simply download the new image file, it is recommended to save it inside ``/tmp`` directory.
Then run the following command: ::

  sysupgrade -k -v nethsecurity-<version>-x86-64-generic-squashfs-combined.img.gz

The ``sysupgrade`` command flashes the new image file to the device.

.. _restore_extra_packages-section:

Restore extra packages
----------------------

During the upgrade, the system will be completely rewritten, so all the extra packages installed by the user will be lost.
Still, the list of installed packages is saved in the configuration backup, so it is possible to restore them after the upgrade.

After the upgrade, make sure the system can access the internet, then restore previously installed packages using the following commands: ::

  opkg update
  grep -E '\w+\s+overlay$' /etc/backup/installed_packages.txt | awk '{print $1}' | xargs opkg install

Automatic updates
=================

.. admonition:: Subscription required

   This feature is available only if the firewall has a valid subscription.

Automatic updates can be enabled from the ``Update`` section under the ``System`` menu, by enabling the ``Automatic updates`` option.
Updates are checked daily and, if available, they are automatically downloaded and installed.