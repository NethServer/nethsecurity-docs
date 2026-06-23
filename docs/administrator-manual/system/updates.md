---
title: "Updates"
sidebar_position: 4
---

# Updates {#updates-section}

NethSecurity allows two types of updates, both available from the `Update` section under the `System` menu:

- normal updates for bugfixes and security patches
- system upgrades to switch to a different version

## Bug & security fixes {#bug-security-fixes}

These updates are intended for minor updates and bugfixes.

Typically they could be performed automatically, but at any time it is possible to check for new updates available by clicking on **Check for Fixes** button. These updates do not require a restart of NethSecurity, they are tied to a specific version and distributed using packages.

When using this method, the version of the image shown inside the dashboard does not change, but the system is updated with the latest fixes.

## System upgrades {#system_upgrades-section}

This types of upgrages involve the transition to a new version of the firmware that introduces new features, improvements and wider hardware support.

This type of update will reboot the device (which will therefore not be reachable for a few dozen seconds) and then completely rewrites the firmware, preserving all the configurations. However it is recommended to save a configuration backup before proceeding with the upgrade.

If a new version is available, the user interface will display an information banner and a dedicated button **Update System** that will allow you to perform the update.

Alternatively, it is always possible to manually upload a compatible image using the **Update with image file** button and proceed with the update.

**Update from command line**

You can also perform a `System update` from the command line. To do this, simply download the new image file, it is recommended to save it inside `/tmp` directory. Then run the following command: :

    sysupgrade -k -v nethsecurity-<version>-x86-64-generic-squashfs-combined.img.gz

The `sysupgrade` command flashes the new image file to the device.

### Restore extra packages {#restore_extra_packages-section}

Starting from version 8.7.2, extra packages are automatically reinstalled after system upgrade. Please note that the reinstall procedure requires access to Internet. If one or more packages cannot be installed because the network is not yet ready or a transient error occurs, the restore service stays enabled and retries automatically on the next boot until all packages are restored. Restored packages are reported inside the log. For example, a mixed restore may log:

    Restored package: etherwake
    Failed to restore package: qemu-ga
    Some packages failed to restore, will retry later

In case of error, proceed with the manual restore documented below. See the next section for earlier versions.

After the upgrade, you can run the following command to list all extra packages: :

    grep overlay /etc/backup/installed_packages.txt

This command returns all extra packages, allowing you to verify which ones are installed and present on the system.

#### Manually restore extra packages

This manual procedure is required only on versions before 8.7.2 or if the automatic reinstall procedure fails.

During the upgrade, the system is completely rewritten, and all extra packages installed by the user will be lost. However, the list of installed packages is saved in the configuration backup, allowing them to be restored after the upgrade.

After the upgrade, ensure that the system has internet access, then restore the previously installed packages using the following commands: :

    opkg update
    grep -E '\w+\s+overlay$' /etc/backup/installed_packages.txt | awk '{print $1}' | xargs opkg install

## Automatic package updates

:::note

No subscription required

Starting from NethSecurity 8.8, this feature is available even without a subscription.

:::

Automatic updates for packages can be enabled from the `Update` section under the `System` menu, by enabling the `Automatic updates` option. Updates are checked daily and, if available, they are automatically downloaded and installed.

## Package manager commands

NethSecurity 8.8 uses `apk`. NethSecurity 8.7.2 and earlier use `opkg`. Use the following quick reference when translating older command examples:

| OPKG command          | APK equivalent      | Description             |
|-----------------------|---------------------|-------------------------|
| `opkg install <pkg>`  | `apk add <pkg>`     | Install a package       |
| `opkg remove <pkg>`   | `apk del <pkg>`     | Remove a package        |
| `opkg upgrade`        | `apk upgrade`       | Upgrade all packages    |
| `opkg files <pkg>`    | `apk info -L <pkg>` | List package contents   |
| `opkg list-installed` | `apk info`          | List installed packages |
| `opkg update`         | `apk update`        | Update package lists    |
| `opkg search <pkg>`   | `apk search <pkg>`  | Search for packages     |

The `opkg find` command used in a few older examples maps to `apk search` on NethSecurity 8.8.
