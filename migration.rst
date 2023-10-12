.. _migration-section:

======================
NethServer 7 migration
======================

Migration is the process to convert a NethServer 7 machine (*source*) into a NethSecurity (*destination*).

Migrating the firewall configuration from NethServer 7 to NethSecurity is a crucial process to ensure the continuity and security of your network services.
This guide provides detailed instructions on how to perform the migration, covering two distinct scenarios based on the existing configuration of NethServer 7.

Migration requirements:

- ensure access to Cockpit on NethServer 7
- install the ``Firewall Migration`` application on NethServer 7. After installation, the application will be available in the Cockpit applications list

Migration scenarios:

- Migration in-place (firewall only): if the original NethServer 7 only contains the firewall module, you can perform an in-place migration and
  reuse the existing hardware. This scenario simplifies the migration process without the need for additional hardware.
- Migration with other installed modules: if NethServer 7 contains additional modules such as the mail server, suitable hardware is required to run NethSecurity.
  In this case you will need to import the configuration on a freshly installed NethSecurity.

Testing the migration
=====================

This method allows for thorough testing without affecting your existing installation.
It's a safe way to evaluate the new setup, ensuring compatibility and functionality before committing to a full migration.

To perform a test migration, follow these steps:

1. Access ``Firewall Migration`` page on NethServer 7 Cockpit: the page will list all migrated configurations

2. Download the live USB image: click :guilabel:`Download` in the ``Download live USB image`` section

3. Prepare the USB drive: write the downloaded image using your preferred method to an USB drive

4. Boot from USB drive: shutdown the firewall, plug the USB drive and restart it, ensuring it boots from the USB drive.
   This is typically done through BIOS/UEFI settings

5. Migration boot: during the boot process, the system loads from the USB drive instead of the internal hard drive

6. Testing environment: your system now operates using the migrated system stored on the USB.
   Any changes or tests performed occur within this isolated environment

Remember, after testing, you can simply remove the USB drive, reboot the firewall normally, and it will resume using the original setup,
leaving your existing installation untouched.

Migration in-place
==================

If the initial NethServer 7 setup includes only the firewall module, you can seamlessly migrate and reuse the current hardware.
This approach streamlines the migration, eliminating the necessity for extra hardware.

To perform the in-place migration from NethServer 7 to NethSecurity, follow these steps:

1. Backup your data: the in-place migration is a destructive process. It is strongly recommended to create a full backup of the machine before proceeding. This step is crucial to ensure data safety in case of any issues during the migration.

2. Access ``Firewall Migration`` page on NethServer 7 Cockpit: the page will list all migrated configurations

3. Download configuration archive as a precaution: as a precaution, download the archive containing the exported configuration by 
   clicking :guilabel:`Download` in the ``Download exported archive`` section. Keep this archive in a secure location; it may be useful if the in-place migration fails.

4. Initiate the migration: when ready, click the :guilabel:`Migrate` button to start the migration process.
   This signals the system to begin migrating from NethServer 7 to NethSecurity.

5. Select the target disk: choose the disk where NethSecurity will be installed. Note that NethSecurity does not support RAID.
   If the original NethServer 7 server has more than one disk, the other disks will remain unchanged and unused during the migration process.

6. Confirm and start the process: after selecting the disk, click :guilabel:`Migrate` to confirm.
   The system will download the NethSecurity image and write it to the selected disk. Subsequently, the system will automatically reboot.

7. Complete the migration on first boot: upon the first boot of NethSecurity, the configuration from NethServer 7 will be automatically migrated.
   Ensure to carefully verify all settings and services to confirm they have been migrated correctly.

Migration with other installed modules
======================================

.. warning::

   This feature is still under development and does not have a user interface yet. It can currently only be configured through the command line.

If NethServer 7 includes additional modules like the mail server, specific hardware is necessary for NethSecurity.
In this scenario, you'll have to import the configuration into a newly installed NethSecurity system.

To perform the migration from NethServer 7 to NethSecurity, follow these steps:

1. Install NethSecurity on a new machine: follow the :ref:`installation instructions <install-section>`

2. Access ``Firewall Migration`` page on NethServer 7 Cockpit: the page will list all migrated configurations

3. Download the archive with exported configuration: click :guilabel:`Download` in the ``Download export archive`` section

4. Upload the exported archive: from a Linux machine, use the following command to transfer the exported archive to the new NethSecurity installation
   via SSH. Example: ::

     scp -O export.tar.gz 192.168.1.1:/tmp

   If you are using a Windows machine, you can utilize tools like WinSCP to perform the transfer.

4. Migrate using the command line: access the NethSecurity machine via SSH and follow the instructions from
   the `developer manual <https://dev.nethsecurity.org/packages/ns-migration/#usage>`_.

Migrated configurations
=======================

During the migration, the following configurations will be imported from NethServer 7:

- root password
- network configuration: bridges over bonds are not supported
- date and timezone
- DHCP servers and reservations: DHCP server on bonds interfaces are not supported
- DNS configuration with host definition: TFTP options are migrated, but not the content of the TFTP server.
  To re-enable the service make sure to manually setup ``tftp_root`` option
- static routes
- port forwards
- firewall rules: rules using NDPI services are not supported; NAT helpers should be reconfigured manually after migration
- multiWAN configuration
- QoS: classes with reserved bandwidth and rules are not supported
- OpenVPN roadwarrior: mail notification is not supported, existing connection database is not migrated; OTP authentication is not supported
- OpenVPN runnels
- IPSec tunnels
- Threat shield
- Subscription
- Hotspot: if the migration has been executed on a new hardware, the hotspot interface will change MAC address and it must be registered again 
  to the remote hotspot manager
- Let's Encrypt certificate configuration
- Reverse proxy
- Flashstart

The following features are not migrated to NethSecurity:

- Web proxy (Squid) and filter (ufdbGuard)
- IPS (Suricata) and IPS alerts (EveBox)
- UPS monitoring (NUT)
- System statistics (Collectd)
- Reports (Dante)
- Bandwidth monitor (ntopng)
- Fail2ban
