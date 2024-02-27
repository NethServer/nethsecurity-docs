=============
Release notes
=============

NethSecurity releases changelogs.

- List of `known bugs <https://github.com/NethServer/dev/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug>`_
- Discussions around `possible bugs <http://community.nethserver.org/c/bug>`_

Major changes on 2024-02-29
===========================

**Beta 2**

Image version: `8-23.05.2-ns.0.0.2-beta2`

The Beta2 release focuses on improving the new UI and enhancing the overall user experience.

.. rubric:: New features

New packages included in the image:

* Added SNMPD package for network monitoring and management.
* Dyndns package included for dynamic DNS services.
* Expanded driver support for older network interfaces and vmnet environments.

User interface (UI):

* Default UI port changed to 9090, accessible from WAN. The UI is also accessible from LAN and WAN on port 443.
* LuCI interface disabled by default for streamlined experience.
* New page configure Source NAT, Masquerading, No-NAT and netmap rules.
* Improved readability of network packet counts on the network page.

Network:

* PPPoE with DHCPv6-PD support implemented.
* It's now possible to configure bond network interfaces from the UI.

DPI:

* Automatic network change reconfiguration enabled.
* All non-WAN interfaces displayed on the DPI page. To upgrade the DPI configuration on existing installations, execute:

  .. code-block:: bash

    echo '{"changes": {"network": []}}' | /usr/libexec/rpcd/ns.commit call commit

Additional features:

* Improved the installation script ``ns-install``: installation is now faster and it halts the system at the end of the installation process.
* Improved migration UI for smoother upgrade experience.
* DHCP static lease creation from existing dynamic leases.
* Two-factor authentication (2FA) for administrator accounts.
* Redesigned login experience with a more integrated and admin-oriented look and feel.
* Pre and post commit hooks added for enhanced API control.
* Subscription-based opt-in feature for automatic updates, accessible only to users with active subscriptions.

.. rubric:: Bug fixes

MultiWAN:

- Improved rule flexibility: now allows specifying single IP addresses (not just CIDR format) in source/destination fields for rules.
- Policy protection: prevents accidental deletion of policies already used in rules.
- Fixed mwan chart display: mwan chart within Netdata now shows correctly after multi-WAN configuration.

Firewall:

- Enhanced protocol handling: creates rules for all protocols (not just TCP/UDP) when "any" is selected.
- Improved rule readability: in rules with 2 or more source/destination addresses, only the second address was readily visible in the tooltip.

Port Forwarding:

- Streamlined configuration: source and destination ports are only required for TCP/UDP protocols.
- Simplified ALL protocol selection: when "ALL" protocol is chosen, other protocol options are disabled as they are redundant.

Certificates:

- Fixed issue: custom certificate being overwritten with self-generated certificate when set as default certificate for the firewall FQDN.
- Correctly display certificate domain: on the certificate list, the subject displayed now corresponds to the client certificate instead of the first certificate in the chain.
- Fix Let's Encrypt certificate deletion: forced acme.sh to generate a new configuration when recreating a Let's Encrypt certificate for the same domain,
  instead of reusing the existing one.
- Let's Encrypt certificate request: disabled automatic redirection from port 80 to 443 to avoid conflicts with acme.sh.

DPI:

- Fixed configuration loss: resolved issue where saved DPI filter configurations were deleted during upgrade from previous versions

Network:

- Improved interface management: enabled editing of interfaces even after their associated zone is deleted.

API:

- Log consistency: standardized API server logs for NethSecurity API server to match objects passed to scripts.

OpenVPN:

- Resolved port update issue: changing OpenVPN Road Warrior service port through the UI now correctly reflects the update in the service configuration and associated firewall rule.
- Configuration protection: fixed issue where RoadWarrior configuration was lost when changing a user's password.
- Enhanced authentication: addressed OpenVPN Roadwarrior authentication failures using local users in Nethsecurity beta1.
- Resolved tunnel server status: fixed issue where the tunnel server status was not correctly displayed in the UI.

Hotspot:

- MAC address inclusion: resolved problem where MAC addresses were missing in the "unit" section of the Hotspot Manager when the hotspot relied on a VLAN.
- VLAN deletion: fixed issue preventing deletion of VLANs previously used by unregistered hotspots, even after the VLAN was freed.
- Enhanced status visibility: added enabled/disabled status to the main tab for quick reference.

DHCP:

- Fixed missing key value for a preconfigured advanced option, ensuring proper functionality.
- Improved display of multiple options by removing redundant label.

IPsec:

- IPsec rule NAT port: corrected port for Allow-IPsec-NAT rule, changed from 500 to 4500 (UDP)
- Duplicate rules: prevented duplicate firewall rule creation on tunnel creations
- Fix spelling of IPsec rule names

Major changes on 2024-02-01
===========================

**Beta 1**

Image version: `8-23.05.2-ns.0.0.1-beta1`

The Beta1 release marks the transition to the new UI as the primary configuration interface.
Luci remains active by default for configurations not yet available in the new UI and for verification purposes.
Known bugs in the new interface can be found `here <https://trello.com/b/FndRrgIp/nethsecurity-project?filter=label:BUG>`_.

Main changes:

- Added a dedicated page for managing certificates and reverse proxy settings. Improved the import process for both configurations.
- Introduced a new page for configuring firewall rules. Users are advised to use this page instead of Luci's, as using both may lead to incompatibilities.
- Added a page for Quality of Service (QoS) configuration to enhance network traffic management.
- Added a page for configuring OpenVPN Roadwarrior. Updated the migration process for the new implementation.
- Introduced the option to use a partition of the main disk as storage for logs.
- Improved the migration process for multiwan and OpenVPN tunnels, enhancing overall system compatibility.
- Streamlined the management of upgrades and migrations, focusing on a smoother transition.
- Implemented a new versioning system to uniquely identify each image, enhancing clarity in tracking releases.
- Incorporated numerous usability improvements and fixed issues across existing pages, ensuring a more user-friendly experience.

Major changes on 2023-12-11
===========================

**Alpha 2**

This alpha release is specifically crafted for evaluation purposes, focusing on testing the functionalities of the new system's user interface. 
Users are provided with the option to experience either the ongoing development of the new interface or stick with the established LuCI interface.
Known bugs in the new interface can be found `here <https://trello.com/b/FndRrgIp/nethsecurity-project?filter=label:BUG>`_.

**UI Enhancements**

- Resolved numerous bugs across various pages, including DHCP and DPI filter, enhancing overall pages stability.
- Introduced the OpenVPN tunnel configuration page.
- Added the IPsec tunnel configuration page.
- Incorporated the Hotspot (Dedalo) configuration page.
- Implemented the Backup and Restore page.
- Introduced exclusion functionality to the DPI filter page.
- Exposed netdata reports within the UI, featuring a configurable ping latency monitor.
- Addressed the default language issue for non-translated languages.
- Refactored and improved the Network page.
- Added a page to manage System Updates.
- Included a migration page from NethServer 7.
- Enabled factory reset functionality directly from the UI.
- Implemented a VPN Users page in preparation for the upcoming OpenVPN Road Warrior server.

**General Improvements**

- Updated the base OpenWrt to version 23.05.2.
- Established a mechanism to send alerts to remote portals, including my.nethesis.it and my.nethserver.com.
- Added support for One-Time Passwords (OTP) in future OpenVPN Road Warrior server configurations.

**Note**: the bond configuration is still in progress, and as a result, bond-type network interfaces are currently non-functional in this release.

Major changes on 2023-10-31
===========================

**Alpha 1**

This is an alpha release, designed for evaluation purposes to explore the functionalities of the new system.
Users have the option to use the new interface, which is currently under development or the legacy LuCI interface.
Please note that some features available on the old LuCI interface will be removed once the corresponding page on the new interface is completed.

While the entire backend functionality is already operational and thoroughly tested, the new interface is not yet complete.
Some bugs in the new interface are already known and can be found `here <https://trello.com/b/FndRrgIp/nethsecurity-project?filter=label:BUG>`_.

The new interface includes the following features:

- Dashboard
- Subscription Management
- Hostname and Timezone Configuration
- Additional Storage Setup
- Network Interface Configuration
- DNS and DHCP Settings
- Routing Configuration
- Multi-WAN Support
- Port Forwarding Options
- Zones and Policies Management
- Flashstart DNS Filtering
- Deep Packet Inspection (DPI) Filtering
- Root User Password Change
- Access to System Logs

.. _release_glossary-section:

Releases glossary
=================

The software release cycle includes four stages: Alpha, Beta, Release Candidate (RC), and Stable.

During the **Alpha** stage, the software is not thoroughly tested and may not include all planned features.
This release is not suitable for production environments. However, it can be used to preview what's coming in the upcoming version.
Please note that updates from an Alpha release to other releases are not supported.

The **Beta** stage indicates that the software is mostly feature complete, but it may still contain many known and unknown bugs.
This release should not be used on production environments. However, it can be used to test the software before deploying it to production.
Updates from a Beta release to an RC or Stable release are supported but may require a manual procedure.

During the **Release Candidate (RC)** stage, the software is feature complete, and it contains no known bugs.
If no major issues arise, it can be promoted to Stable. Updates from an RC release to a Stable release are supported
and should be almost automatic.
However, if you're new to the software, it's best to use it in production only if you already have some experience with it.

The **Stable** release is the most reliable and safe to use in production environments.
It has been thoroughly tested and is considered to be free of major bugs.
