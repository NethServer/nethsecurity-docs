.. _migration-section:

======================
NethServer 7 migration
======================

Migration is the process to convert a NethServer 7 machine (*source*) into a NethSecurity (*destination*).

Migrating the firewall configuration from NethServer 7 to NethSecurity is a crucial process to ensure the continuity and security of your network services.

Migration requirements:

- ensure access to Cockpit on NethServer 7
- install the ``Firewall Migration`` application on NethServer 7. After installation, the application will be available in the Cockpit applications list

Migration scenarios:

- Migration in-place (firewall only): if the original NethServer 7 only contains the firewall module, you can perform an in-place migration and
  reuse the existing hardware. This scenario simplifies the migration process without the need for additional hardware.

- Migration with other installed modules: if NethServer 7 contains additional modules such as the mail server, suitable hardware is required to run NethSecurity.
  In this case you will need to :ref:`import the configuration <import_migration-section>` on a freshly installed NethSecurity.

Migration from NethServer 6 is not supported. If you are running NethServer 6.x, you must first upgrade to NethServer 7 before migrating to NethSecurity.

Testing the migration
=====================

This method allows for thorough testing without affecting your existing installation.
A test system will boot from an USB drive leaving the existing installation untouched. 

To perform a test migration, follow these steps:

1. Access ``Firewall Migration`` page on NethServer 7 Cockpit: the page will list all migrated configurations

2. Download the live USB image: click :guilabel:`Download` in the ``Download live USB image`` section

3. Prepare the USB drive: write the downloaded image using your preferred method to an USB drive, see the 
   :ref:`installation section <install-section>` for more info on how to copy the image on a disk.

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

After completing the migration, follow the :ref:`post-migration steps <post-migration-section>` to ensure the system is correctly configured.

.. _import_migration-section:

Migration with other installed modules
======================================

This scenario involves exporting a special configuration archive from NethServer 7 and importing it into NethSecurity.

This method is recommended when the original NethServer 7 setup includes additional modules, such as the mail server.
To perform this migration, you will need to install NethSecurity on new hardware and then import the configuration into the newly installed NethSecurity system.

To perform the migration from NethServer 7 to NethSecurity, follow these steps:

1. Install NethSecurity on a new machine: follow the :ref:`installation instructions <install-section>`

2. Access ``Firewall Migration`` page on NethServer 7 Cockpit: the page will list all migrated configurations

3. Download the archive with exported configuration: click :guilabel:`Download` in the ``Download export archive`` section

4. Access the ``Backup & Restore`` page on NethSecurity and go to the ``Migration`` tab, then click :guilabel:`Upload migration file` and select the archive downloaded in the previous step

5. When importing the configuration onto new hardware, the MAC addresses of the network interfaces change, requiring a decision on how to remap these interfaces.
   The user interface displays the interfaces of the source machine on the left and those of the destination machine on the right.
   If the source machine had configured VLANs, the user must remap the physical interface, and the system will automatically recreate the VLAN on the underlying interface.

6. Click :guilabel:`Migrate` to start the migration process

After completing the migration, follow the :ref:`post-migration steps <post-migration-section>` to ensure the system is correctly configured.

.. _post-migration-section:

Post migration steps
====================

The in-place migration process is executed when the system is offline. Since the registration process requires an active Internet connections,
the subscription is not migrated during the in-place migration.
If you have performed an in-place migration, you must :ref:`register the system <subscription-section>` again.
This step is not necessary if you have performed a migration with the exported archive method.

When using a remote LDAP or Active Directory server to authenticate OpenVPN Road Warrior clients, make sure that the remote server is 
reachable from the new NethSecurity machine by verifying also the DNS name resolution. If necessary, update the DNS configuration on the new machine.
Also review the :ref:`remote user database page <remote_user_databases-section>` to check if all users have been correctly imported.

Then, verify that all services are working correctly. If you encounter any issues, refer to the :ref:`troubleshooting section <troubleshooting-section>`.

The migration process is logged inside a special log file located at ``/root/migration.log``.
This file contains all the actions performed during the migration process.
Please note that the log file is deleted after an image upgrade.

Migrated configurations
=======================

During the migration, the following configurations will be imported from NethServer 7:

- Password of the *root* user: it can be used to access the system via SSH and the web interface
- Network configuration: everything should be migrated except for bridges over bonds that are not supported
- If the interfaces have labels, these labels are converted into the interface names in NethSecurity 8, except for WAN interfaces.
- Date and timezone
- DHCP servers and reservations: DHCP server on bonds interfaces are not supported
- DNS configuration with host definition: TFTP options are migrated, but not the content of the TFTP server.
  To re-enable the service make sure to manually setup ``tftp_root`` option
- Static IPv4 routes
- Port forwards
- Firewall zones: zones are migrated and should retain the same behavior of the original configuration:
  green zones will be mapped to ``lan``, red zones to ``wan``, orange zones to ``dmz``, and blue zones to ``guest`` zones;
  if a blue zone was present on NethServer 7, rules for accepting DNS and DHCP requests will be automatically added
- Firewall rules: rules using NDPI services are not supported; source and destination objects, including zones, are not currently supported and will be converted
  to rules with IP/CIDR addresses; all NAT helpers are automatically loaded after the migration with standard kernel parameters
- MultiWAN configuration: providers will be preserved while divert rules (policy routing) are not migrated
- QoS: classes with reserved bandwidth and rules are not supported
- OpenVPN Road Warrior: all settings are migrated; the accounting database of client connections is not migrated; mail notification is still not supported on NethSecurity.
  If the machine was connected to a remote Active Directory and the OpenVPN server was configured to authenticate against it, please see also :ref:`remote_user_databases-section`.
- OpenVPN tunnels
- IPSec tunnels
- Threat shield IP: only enterprise lists are migrated, community lists must be reconfigured manually
- Subscription: the subscription is migrated only when using the exported archive method
- Hotspot: if the migration has been executed on a new hardware, the hotspot interface will change MAC address and it must be registered again 
  to the remote hotspot manager
- Let's Encrypt certificate configuration: certificates will be regenerated after the migration
- Reverse proxy configuration: the configuration is migrated, but the certificates will be regenerated after the migration
- FlashStart Cloud DNS filter

The following features are not migrated to NethSecurity:

- Web proxy (Squid) and filter (ufdbGuard)
- IPS (Suricata) and IPS alerts (EveBox)
- UPS monitoring (NUT)
- System statistics (Collectd)
- Reports (Dante)
- Bandwidth monitor (ntopng)
- Fail2ban, it is replaced by Threat shield :ref:`brute force attempt block feature <brute_force-section>`
- Threat shield DNS, currently :ref:`available only from command line <threat_shield_dns-section>`

.. _custom_zones_migration-section:

Custom Zones
============
Custom zones are rarely used in NethServer 7 and tipically for very specific tasks. 
They are required to define a network segment with firewall rules different from those of the primary interface or, more commonly, to correctly manage traffic coming from a network other than the one to which the interface is connected.
These zones allow for defining specific behavior for that network segment and ensure correct routing in complex environments (e.g., a port forwarding rule with a remote host destination via MPLS or a VPN tunnel).

In NethSecurity, zones work differently from NethServer 7, offering for these cases a much simpler management.
Typically, in NethSecurity, all previous configurations made with custom zones can be easily managed **without the need to recreate any custom zone**, thanks to the following default behavior.

**1. Policy inheritance for incoming traffic**

All traffic incoming from a NethSecurity interface automatically inherits the same policies as the connected interface, regardless of the originating network. This includes automatic masquerading when traffic is destined for the internet.

Let's look at an example:

A local interface named "office" is operating on the 192.168.1.0/24 network segment and is assigned to the "lan" zone.
A gateway with IP 192.168.1.220 is connected to the same switch as the "office" interface, providing access to the remote network 10.10.10.0/24.
The remote network 10.10.10.0/24 must use NethSecurity to reach the internet.

In NethSecurity, no additional configuration is needed, all packets sent to the "office" interface are correctly routed, even if they originate from a different network segment. Masquerading is also applied to all outbound packets.

**2. No need to create new zones for different segments**

Just like policies, standard rules can be applied to this traffic without needing to create a new zone. If you want to apply different policies for this segment, you can simply create standard firewall rules. For convenience, you can use a host set with the CIDR network in firewall objects.

**3. Routing works seamlessly without extra rules**

Routing for this specific network segment functions correctly without any additional rules or zones. In NethServer 7, it was mandatory to create a zone to ensure proper routing for incoming packets, as mentioned in the initial port forwarding's example.

USB-to-Ethernet adapters
========================
It may rarely happen that the NethServer 7 being migrated has a USB to Ethernet adapter connected to add a network device. These adapters should not be used in a firewall and are **not supported on NethSecurity 8**. However, it is possible to install certain specific drivers for experimental purposes, not for production environments. These drivers might be useful for temporarily managing the migrated firewall while awaiting hardware with all the necessary network cards. More information can be found in the :ref:`network section <network-section>`.

.. warning::

  If you are using these adapters, remember that they will not work until the correct driver is installed. Keep in mind that NethSecurity 8 may not have the correct driver for the adapter you are using on NethServer 7. In this case, you will need to use a different adapter.

.. note::

 If you are using a USB to Ethernet adapter for a RED/WAN interface, be aware that you won't be able to download the necessary modules to make it work properly on NethSecurity 8 unless you have other RED/WAN interfaces running on network cards directly connected to the motherboard.
