=============
Release notes
=============

NethSecurity releases changelogs.

- List of `known bugs <https://github.com/NethServer/nethsecurity/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug>`_
- Discussions around `possible bugs <http://community.nethserver.org/c/bug>`_

Major changes on 2024-04-29
===========================

**Relase Candidate 2**

Image version: `8-23.05.3-ns.0.0.5-rc2`

The Release Candidate 2 release focuses on fixing bugs and improving the overall user experience.

Detailed changelog can be found `here <https://github.com/NethServer/nethsecurity/milestone/1?closed=1>`__.

.. rubric:: New features and improvements

- Firewall rules: improved display of rules section.
- FlashStart: added DNS resolution functionality after service disabling.
- Dashboard: enhanced card organization and added links.
- Routes: enabled creation of routes without gateway.
- Autoreload VPN pages: implemented automatic data reload every 10 seconds.
- Migration to vue-components lib: migrated components and utils to vue-components.
- UI: set rpcd timeout to 300 seconds to support long running tasks.
- DHCP: introduced network scanning feature.
- User database: sorted users by username and ensured consistent execution of LDAP queries.
- DHCP: enabled force option by default for DHCP servers, exposed the option in the UI.
- OpenVPN road warrior: implemented sorting of OpenVPN road warrior users by username.

.. rubric:: Bug fixes

- Firewall rules: resolved glitch displaying incorrect content.
- FlashStart: fixed DNS resolution failure post service disabling.
- Routes: prevented editing of IPsec rules.
- IPsec: validated remote/local networks to avoid duplicates.
- Port forward: corrected reflection option label.
- Migration: ensured proper import of host groups into firewall rules.
- Firewall rules: allowed insertion of custom IP addresses.
- Threat shield: apply changes to allowlist immediately.
- Migration: enabled editing of imported IPsec tunnel.
- OpenVPN road warrior: resolved issue with user recreation from LDAP.
- Fixed axios error when committing changes.
- OpenVPN road warrior: fixed issue with bridged configuration.
- IPsec: improved handling of multiple networks with a single tunnel.
- Zones: fixed radio buttons IDs in Zones page.
- FlashStart: fixed ineffective redirect rule.
- Controller: refined behavior based on subscription presence.
- Firewall: updated ipset after IP address removal.
- Migration: fixed issue with IPsec tunnel editing.


Major changes on 2024-04-10
===========================

**Release Candidate 1**

Image version: `8-23.05.3-ns.0.0.3-rc1`

The Release Candidate 1 release focuses on fixing bugs, adding the centralized controller, and improving the migration process from NethServer 7.

The issue tracker has been moved to GitHub. The new URL is: `https://github.com/NethServer/nethsecurity/issues <https://github.com/NethServer/nethsecurity/issues>`_.

.. rubric:: New features and improvements

* NethSecurity has been rebased on `OpenWrt 23.05.3 <https://forum.openwrt.org/t/openwrt-23-05-3-service-release/192587>`_.
* Added the :ref:`centralized controller <controller-section>` to manage multiple NethSecurity instances from a single interface.
* Port forwards: support port ranges in the source port field.
* Firewall rules: support IP ranges as destination rules.
* Backup: allow download of the backup file from the UI even if the machine has an enterprise subscription and remote backup server is not available.
* Threat shield: improve visualization of the threat shield page if the firewall does not have Internet access.
* Subscription: show subscription even if the machine has no Internet access.
* MultiWAN: improved management of the balance policy configuration.
* Network page: the up/down status of network interfaces now accurately reflects the cable status instead of the kernel status.
* Firewall rules: improve the visualization of the disabled firewall rules.
* Added an option to enable the privacy policy link during login.
* Remote support (don): allow access to UI and preserve the session after a firewall restart.
* Users: support bind on remote LDAP user datbases.

.. rubric:: Bug fixes

* 2FA: enable 2FA for user only after OTP verification.
* IPsec tunnels: correctly associate the ipsecX interface to the selected WAN.
* IPsec: make sure to start after a migration even if the associated WAN is not available.
* Migration: rework the network migration process to avoid issues with bonds, bridges, and aliases configuration.
* Migration: display bonds and bridges in the remapping page during the migration.
* Migration, update and backup: implement new upload and download methods to avoid issues with large files.
* Migration: fixed an issue that prevented the DHCP server from starting when DHCP options were present in the configuration.
* DPI: prevent loss of Enterprise signatures after an upgrade.
* Storage: added the ability to recreate a deleted storage partition.
* Network: fix creation of VLANs over bridges.
* Port forward and IPsec tunnels: fixed the visualization of WAN IPs, the page now displays all aliases and avoids duplicates even if the WAN is not available.
* Port forward: list LAN zone inside hairpin NAT destinations.
* OpenVPN tunnel: fixed an issue that prevented the modification of a P2P tunnel.
* MultiWAN page: correctly sort WAN interfaces by priority.
* MultiWAN page: do not show WAN aliases inside the policy page.
* DHCP: hide static leases inside the dynamic leases tab.
* Proxy pass: fix an issue that was preventing the modification of a proxy pass rule.
* OpenVPN tunnel: fix default cipher selection for P2P tunnels.
* DPI: restart netifyd after a network configuration change.
* FlashStart: fix firewall registration to the FlashStart service.
* FlashStart: fix secondary DNS address.
* Firewall rules: fix duplicated host in source and destination address.
* OpenVPN Road Warrior: fix bulk user creation for large user lists.

.. rubric:: Known bugs

Network bonds still suffer from some issues. If you're migrating from NethServer 7, please be aware of the following:

* VLAN over a bond interface is not created if bond hasn't a role
* During bond creation, sometimes, the web UI doesn't show the devices to add to the bond
* The newly created bond shows a button saying "Configure bond", but then it does not configure the bond itself but the interface member of the bond

.. rubric:: Upgrade notes

If you are upgrading from a previous beta version and have any IPsec tunnels configured, you must run the following commands after the upgrade:

.. code-block:: shell

  uci delete ipsec.ns_ipsec_global.interface
  uci commit ipsec
  /etc/init.d/swanctl restart


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
- Enhanced authentication: addressed OpenVPN Roadwarrior authentication failures using local users in NethSecurity beta1.
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

.. rubric:: Known bugs

IPsec:

- Only the first subnet in the IPSec tunnel is functional: when defining more than one network in an IPSec tunnel between different devices,
  only the first network works; traffic destined to other subnets in the tunnel is not routed correctly.
  A workaround is to create multiple tunnels with individual subnets.
  This issue does not occur between two NethSecurity 8 devices (as they use the same daemon), but it can occur between, for example,
  a NethSecurity 8 and a NethServer 7.9.

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
