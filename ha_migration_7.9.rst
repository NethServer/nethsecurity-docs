.. _ha_migration_7.9-section:

=======================================
Migration from NethSecurity 7.9 with HA
=======================================


This document describes the procedure for migrating a **NethSecurity 7.9** system configured with **High Availability (HA)** to **NethSecurity 8**, while keeping the HA setup active.
Several approaches are possible for this migration; this guide outlines one recommended method.

The migration process consists of two main phases:

* upgrading the NethSecurity 7.9 system to version 8,
* reconfiguring the High Availability service between the two firewalls running NethSecurity 8.

During the migration, the two firewalls are treated as independent systems.
One device will be upgraded to NethSecurity 8 by migrating its configuration, while the other will be reset to factory defaults and reconfigured as the secondary HA node.

Once the migration and validation of the primary node are complete, the High Availability service will be enabled again between the two NethSecurity 8 firewalls.

Prerequisites
-------------

* Take a note of the IP addresses used for the HA interface: primary, secondary, and VIP.
* Review the network configuration, especially for **local (non-WAN) interfaces**.
  Each of these interfaces now requires **three IP addresses**: previously only one was used, but in NethSecurity 8 additional LAN interfaces are also managed through **VIPs**, ensuring failover in case of issues affecting those interfaces.
* Take a note of all required IP addresses for the additional non-WAN interfaces.
* Perform a backup of both firewalls as a precaution.
* Verify **hardware compatibility** with NethSecurity 8.

Migration procedure
-------------------

1. **Power off the secondary firewall**
Before starting the migration, shut down the secondary firewall to prevent conflicts during the upgrade of the primary node.

2. **Choose the migration method**
Access the *Firewall Migration* tool on your NethSecurity 7.9. You can either:

* Download a migrated image to create a USB key for testing and verifying configurations before performing the actual migration, or
* run an **in-place migration** directly on the system.

Choose the option that best fits your needs: the first one is safer, while the second is faster.
If any issue occurs, simply power on the secondary firewall running version 7.9, which still retains the original configuration.

3. **Run the migration**

* If using in-place migration, once the process completes, verify that the firewall is now running NethSecurity 8 and that all features work as expected.
* If you are using the USB image, create it and boot the primary firewall from it. Verify that all features are working correctly. After that, write the appliance storage using the `ns-install` command, then reboot the hardware without the USB key.

4. **Configure the VIP address**
  
* Add the VIP (HA alias IP) to allow LAN hosts to access the network correctly. This ensures that all LAN clients can reach the Internet while you proceed with the restore process, without interrupting user connectivity.
Remember to do the same for every other non-WAN interface.
  
5. **Restore and reconfigure the secondary node**
After confirming that the primary firewall is working as expected:

* Disconnect all network cables from the secondary firewall to avoid conflicts with the primary.
* Reset the secondary firewall to factory defaults.
* Recreate the network configuration, ensuring that additional LAN interfaces are also managed using VIPs.
* Reconfigure High Availability between the two NethSecurity 8 systems.
