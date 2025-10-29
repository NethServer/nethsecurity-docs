=============
Release notes
=============

NethSecurity releases changelogs.

- List of `known bugs <https://github.com/NethServer/nethsecurity/issues?q=is%3Aissue%20is%3Aopen%20type%3ABug%20>`_
- Discussions around `possible bugs <http://community.nethserver.org/c/bug>`_


Major changes on 2025-10-29
===========================

Image version: `8-24.10.3-ns.1.7.0` 

.. rubric:: New Features

- High Availability is now production-ready after extensive testing and redesign, the design has changed from the beta version and requires reconfiguration.
- New WireGuard tunnel UI for creating and managing VPNs directly from the interface, with support for multiple servers and sharing via file or QR code.
Existing command-line WireGuard tunnels are automatically migrated to the new UI.
- Improved DDoS and flood protection handling; configuration centralized under Threat Shield IP.
- Added local URL allowlist to Threat Shield DNS for more granular control.
- Automatic configuration templates introduced for GUEST and DMZ zones.
- Added option to download unencrypted backups locally using a dedicated button.
- Manual DNS servers now always take priority over DHCP or PPPoE-provided ones.
- DHCP behavior with FlashStart improved; no need to define DNS in DHCP options when FlashStart is active.
- System-generated port forwarding rules are now visible but read-only, clearly marked as automated.
- Threat Shield IP automatically whitelists Nethesis enterprise service IPs to prevent false positives.
- Added support for IPSec DH Groups 19, 20, and 21.
- Added unit-group access control, IP-based restrictions, performance optimizations, and UI improvements in the controller.
- Controller data and logs are now transmitted through the VPN tunnel for improved security.
- Added unit description field synchronized between units and controller.
- Added MTU configuration to resolve connectivity issues on low-quality networks.
- Introduced remote support access (nethsupport) via temporary code; no credentials or 2FA required, with automatic revocation after session end.

.. rubric:: Bug Fixes

- Fixed enabling/disabling of port forward rules via the kebab menu when domain set objects are configured.
- Improved port forward validation to reject invalid IPs when a destination port is defined.
- Fixed OpenVPN tunnels with LZO compression failing to start.
- QoS and MultiWAN configurations now correctly update when a WAN interface is removed.
- DPI rules now correctly block ICMP traffic; resolved startup segfault and improved performance under load.
- Fixed kebab menu functionality in port forwarding when domain sets are used in the “limit access to” section.
- Reverse proxy certificate usage indicators now show the correct status.
- Fixed controller issue where 2FA could activate after canceling setup; now only activates after successful OTP confirmation.
- DHCP server now replies with a single message per request when multiple dnsmasq instances are configured.


Major changes on 2025-06-30
===========================

Image version: `8-24.10.0-ns.1.6.0`

.. rubric:: New Features

- High Availability: added support for two-node clusters in backup mode. automatic failover within seconds. configured via command line.
- Flashstarto ProPLus: added support for multi-profile configurations, dynamic blocklists, and improved dns client management.
- Security wizard: assists with initial security setup (password, ssh, and ui). appears after login if not yet completed and can be skipped.
- Automatic persistent storage for logs: free disk space is auto-assigned to logs by default, preventing log loss during reboot. admins can change the destination.
- Threat Shield: blocked ip management from the ui: added interface to view, search, and unblock ips. ipv4 and ipv6 blocklists manageable from the ui.
- Service center sync status: subscription page now shows connection status, last sync time, and a "sync now" button.
- SNAT limited by interface: allows SNAT rules on specific network interfaces. simplifies advanced routing and failover setups. manageable via ui.
- Static leases filtering: added filter for dhcp static leases by interface for easier management of complex setups.
- Version in migration logs: migration logs and exports now include migration tool and destination system versions.

.. rubric:: Bug Fixes

- OpenVPN: fixed issue where renamed/deleted ad users could still access with old credentials. access tracking now updates correctly.
- Firewall: prevented firewall zone names starting with numbers: avoids rule application issues.
- Port forward: allows port forwarding without specifying a destination address.
- Certificates: possible to delete let's encrypt requests even if still pending.
- OpenVPN: net-to-net openvpn tunnels with hyphens in the name can now be modified after migration.
- Logs: fixed issue where logs could occupy root filesystem after a restore.
- OpenVPN RW: adjusted renegotiation to prevent unexpected disconnections for certain authentication methods.


Major changes on 2025-04-10
===========================

Image version: `8-24.10.0-ns.1.5.1`

.. rubric:: Bug fixes

- Bond: fixed issue with bond interfaces not having proper kernel module loaded
- Real-time traffic: adjusted traffic values to be more accurate across tables
- Threat Shield DNS/IP: removed graphic issue where more lists appears to have been enabled than the actual ones
- Monitoring: removed WAN ip display if the interface is offline
- UI: doubled the speed of the UI compressing the data sent to the browser

-------------

Major changes on 2025-04-08
===========================

Image version: `8-24.10.0-ns.1.5.0`

This release addresses a bug spotted in the previous release due to strengthening of the API backend.

No additional changes have been made from the 1.5.0-rc1 to this release.

-------------

Major changes on 2025-03-28
===========================

Image version: `8-24.10.0-ns.1.5.0-rc1`

This release contains new User Interfaces for services previously accessible only via Command Line, along with security enhancements and bug fixes.

.. rubric:: New features and improvements

- IPS: UI has been released 
- Threat Shield DNS: UI has been released 
- IP/MAC Binding: UI has been released 
- Netify Informatics: UI has been released released for service registration
- FlashStart DNS: Implementation improvements. NethSecurity’s DNS management is now independent from the DNS used for FlashStart to avoid any interaction with firewall services. External DNS servers are no longer required for unfiltered networks.
- Various modifications have been made to strengthen the system, including: API hardening, SNMP service is now disabled by default, Backup management modifications (subscription only)


.. rubric:: Bug fixes (this is a limited list of the most reported ones)

- Migration: OpenVPN device name issue when exceeding 16 characters
- Migration: Loss of configuration for OpenVPN tunnels with similar names
- Migration: Road Warrior client migration interruption if a user certificate is missing
- MultiWAN does not allow the firewall to send traffic outside if the lowest metric route is unavailable
- OpenVPN Tunnel JSON export includes only the first remote endpoint, omitting others
- Enabling logging in firewall rules can overload the CPU
- Netmap rules not loaded after a version update
- OpenVPN server web interface crashes if the user database is removed
- Firewall: “any” zone displayed as inactive
- Port forward: error when assigning an object with an IP range

-------------

Major changes on 2024-12-18
===========================

Image version: `8-23.05.6-ns.1.4.1`

This release focuses on improved local monitoring and adds some experimental features.

.. rubric:: New features and improvements

- The Realtime monitoring feature now allows users to filter traffic data by selecting a host and one of the following options: application,
  remote host, or protocol
- Realtime monitoring: added latency and drop rate charts
- Improve Netifyd network configuration: the configuration has been updated to improve network performance by limiting the number of interfaces it inspects
- Ensure consistent hostname logging behavior in nginx logs: the nginx logs previously included the hostname twice, causing inconsistency inside Grafana
- MultiWAN: add routing rules for router initiated traffic
- FlashStart configuration is now automatically disabled if there is no active subscription
- Phonehome: collect statistics on the use of threat shield DNS

.. rubric:: Experimental features

The following features are experimental and must be configured from the CLI:

- MAC Binding: introduced MAC binding via DHCP reservation to enhance network security by associating specific MAC addresses with designated IP addresses
- NUT support: configure UPS devices with NUT. This is not officially supported on machines with a subscription
- WireGuard configuration: configure WireGuard through the CLI, enabling management of multiple server instances and peers
- Intrusion Prevention System (IPS): introduced Snort configuration via the CLI, allowing users to manage rules and policies

.. rubric:: Bug fixes

- Firewall rules: ipset reference not removed when modifying input rule
- Port forward: ipset reference not removed when modifying input rule
- Firewall objects: host set modifications not reflected in nft rules
- OpenVPN Road Warrior: fix route issue with bond management address
- Storage: disk was not displayed in UI after system update
- Flashstart: fixed and issue that prevented to send the heartbeat
- Migration: VPN accounts not visible if username contains uppercase letters
- Dashboard: incorrect error message despite successful API response
- Monitoring: error when OpenVPN RoadWarrior has an incomplete configuration
- Migration: PPPoE alias import fails with invalid argument error

Major changes on 2024-10-17
===========================

Image version: `8-23.05.5-ns.1.3.0`

This release focuses on monitoring, migration improvements and better NethSecurity Controller integration.

Detailed changelog can be found `here <https://github.com/NethServer/nethsecurity/milestone/5?closed=1>`__

.. rubric:: New features and improvements

- Update to OpenWrt 23.05.5: see upstream `changelog <https://openwrt.org/releases/23.05/notes-23.05.5>`_
- Centralized unit update management: from the controller it should be possible to update the unit seamlessly (packages and/or image)
- Real time monitoring page: create a comprehensive dashboard for NethSecurity monitoring
- Historical monitoring: historical monitoring allows the user to see how the firewall is behaving from the NethSecurity Controller
- Support virtual machine tools for KVM an VMware: remove all tools from the image and provide them as optional packages
- Port forward: support all objects inside restrict field: implement support for multiple object types in the "restrict access from" field
- Inventory, advanced usage statistics: gather anonymous statistics on system usage
- Improve Threat Shield UI: expose logging and brute force protection settings in the Threat Shield page
- NAT helpers UI: new NAT helper configuration page
- Remote support (ns-don): open netdata port (19999): add access to port 19999 from tunDON to allow viewing netdata UI from remote support sessions
- NAT rules: add "0.0.0.0/0 any address": add "0.0.0.0/0 any address" option among destination address suggestions
- Zoned and policies: allow to set the logging policy for each zone
- DNS and DHCP page: search is now case insensitive
- OpenVPN Road Warrior: add a button to download all OpenVPN certificates associated with a specific Road Warrior instance
- UI: improves usability, navigation, layout, and visual elements on multiple pages
- Migration: at the end of the migration, a log file is created with all the actions performed, the log is available at ``/root/migration.log``
- MultiWAN: improve default configuration to restore the uplink after all WANs losed connectivity

.. rubric:: Bug fixes

- Migration: fix firewall rules that were using blue zone
- Migration: network configuration not migrated if alias has no gateway
- Migration: fixes firewall rules with "any" service migrate incorrectly
- Migration: fixes root password authentication flag incorrectly displayed
- Migration: rename VPN interfaces that caused a firewall error if the name was too long
- Migration: fixes missing account_email in ACME that caused a certificate renewal failure
- Migration: fixes wrong zone for OpenVPN and IPsec custom rules
- Migration: fixes incorrect reflection zone on port forward for VPNs
- Migration: remove custom zones on migration, zones are converted to CIDR networks
- Migration: fixes FlashStart not enabled on guest/blue interface
- Migration: fixes OpenVPN Road Warrior certificate not exported if CN contains the dot character
- Migration: correctly import OpenVPN Road Warrior users without 'status' prop
- OpenVPN Road Warrior: add client compression setting missing that was missing in .ovpn file
- OpenVPN Road Warrior: fix IP pool management
- OpenVPN Road Warrior: fix expired CRL that was causing a connection failure after 6 months
- OpenVPN tunnel between NS7 and NS8 cipher: connection was failing despite showing "connected"
- OpenVPN tunnel client: fix displayed mode
- OpenVPN tunnel client: wrong "bridged" mode as new default, new default is now r"outed"
- OpenVPN tunnel client resets cipher to `AES-128-CBC`: correctly set cipher without resetting it
- OpenVPN tunnel client: correctly set "tap" and "tun" mode on client tunnel creation
- Unable to disable legacy LuCI UI after system upgrade: fix LuCI UI disable option
- Controller connection (ns-plug): force cleanup of package cache and sync unit status
- Migration: improve in place migrate, add delay before image write to reduce issues when writing the kernel
- Conntrack: make sure counters is set: Avoid error from missing counters.
- Reverse proxy: correctly set default certificate
- Reverse proxy: fix configuration to allow access only from the specified network
- Netdata: mitigated issue with orphaned fping process continuing to ping removed IPs
- Cannot logout while a toast notification is shown: prevent toast notifications from blocking the account menu
- API server: fix restarting on package update
- Interface page fails with QoS enabled on PPPoE: improve validator on network configuration page
- Cannot duplicate a port forward: fix duplication of port forwarding rule
- Report: disable "open report" button when UI is displayed from the controller
- DPI report: fix crash on netifyd restart

Major changes on 2024-08-08
===========================

Image version: `8-23.05.4-ns.1.2.0`

This release focuses on new features for subscriptions and improved user experience.

Detailed changelog can be found `here <https://github.com/NethServer/nethsecurity/milestone/4?closed=1>`__

.. rubric:: New features and improvements

- Update to OpenWrt 23.05.4: update OpenWrt to version 23.05.4 with relevant package and core changes
- Free Threat Shield lists for community: implement free Threat Shield lists for community users, enhancing overall threat protection
- Remote backup for all subscriptions: extend remote backup access to both Enterprise and Community subscriptions with additional backup information
- New script to update packages with logging and stable channel access: implement a new update-packages script with enhanced logging and force-stable flag
- Firewall objects: implement host set and domain set objects for enhanced firewall management
- Add objects support in MultiWAN rules: implement objects support in MultiWAN UI for source and destination addresses
- Add objects support in Port Forward rules: add objects support for destination address and restricted access in Port Forward rules
- Add objects support in Firewall rules: include objects support for source and destination addresses in Firewall rules
- OpenVPN Road Warrior IP reservation: improve handling of reserved IPs in OpenVPN configuration to prevent conflicts
- Backup: include installed package list in backup for easier restoration after image upgrade
- Let's Encrypt certificate on web interface extra port: extend Let's Encrypt certificate usage to the ns-ui extra port
- OpenVPN tunnel server: add option "remote-cert-tls" in exported file client configuration file
- Custom DNS for hotspot: add support for changing default DNS for hotspot
- Limited support for USB-to-Ethernet adapters: provide experimental support for USB-to-Ethernet adapters with manual driver installation
- Limited support for USB-to-Serial adapters: add experimental support for USB-to-Serial adapters with manual driver installation

.. rubric:: Bug fixes

- Deny creation of certificates with already requested domains: prevent creation of duplicate certificates with the same domain
- Visual issue with DHCP objects in OpenVPN Road Warrior: fix missing fields and display errors in DHCP options
- Cannot create reverse proxies: fix nginx configuration validation failure when creating reverse proxies
- Limit interface names to 13 characters: prevent mwan failure due to long interface names
- OpenVPN, unable to remove reserved IP for Road Warrior client: fix issue where reserved IP cannot be removed for Roadwarrior clients
- UI crash with over 3000 conntrack entries: fix UI crash and rpcd service break with large number of conntrack entries
- MultiWAN, missing WAN disconnection/reconnection alerts: new implementation of WAN alerts to correctly handle connection and reconnection events
- Controller, display the name of disconnected users: show the name of disconnected units instead of just the UUID
- Controller, display VPN port: add VPN port display in the NS8 UI for easier firewall configuration
- Controller, validate CN: add validation rule for controller name field to allow only letters and numbers
- Controller, do not remove .info file on disconnect: preserve unit information file for disconnected units
- Controller, units continuously toggle connected/disconnected: address issue with erratic connection status display for multiple units
- Migration, DHCP and DNS Services for blue/guest zone: enable DHCP and DNS services for migrated blue/guest zones
- Migration, OpenVPN reserved IP not assigned: address issue with reserved IP assignment for migrated certificates
- Migration, FlashStart username missing: fix issue where username field is not displayed in FlashStart interface after migration
- FlashStart, reduce number of queries: modify dnsdist configuration to optimize query handling and reduce unnecessary requests

Major changes on 2024-07-05
===========================

Image version: `8-23.05.3-ns.1.1.0`

This releases focuses on fixing bugs and delivering new features.

Detailed changelog can be found `here <https://github.com/NethServer/nethsecurity/milestone/3?closed=1>`__.

.. rubric:: New features and improvements

- Connections management: implemented interface for real-time monitoring and control of conntrack-tracked network connections
- MultiWAN sticky option: added sticky configuration in MultiWAN rules to maintain connection persistence across sessions
- DPI signature updates: enabled updated Deep Packet Inspection signatures for both community and enterprise subscription types
- Admin user management: implemented API functions to elevate local users to admin status and revoke admin privileges
- LDAP authentication enhancement: improved flexibility for Active Directory and non-standard LDAP Distinguished Name configurations
- Subscription repository authentication: implemented system_key verification for accessing subscription-based package repositories

.. rubric:: Bug fixes

- NVME storage utilization: resolved issue preventing usage of unallocated NVME drive space for system logging
- Backup restore validation: added specific error messaging for incorrect passphrase input during backup restoration process
- MWAN metrics adjustment: modified interface metric allocation to start at 20 and increment by 10 for improved load balancing
- Scheduled update UI consistency: corrected persistent display of completed scheduled updates in user interface
- MultiWAN policy labeling: fixed incorrect "balance" label display for custom single-gateway policies
- MultiWAN form validation and input handling: implemented proper input field state management and form validation in policy editor
- MultiWAN UI/UX refinement: enhanced port input flexibility and form submission logic for rules and policies
- Post-migration DHCP functionality: addressed DHCP address assignment failure after version 7.9 to 8 migration
- VPN account creation side-effect: prevented unintended removal of user display names upon VPN account creation
- Migration network configuration: implemented removal of extraneous gateway entries from non-red interfaces
- MultiWAN migration logic: added automatic disabling of MultiWAN configurations with single provider during migration
- IPsec configuration display: corrected UI to accurately reflect custom IPsec tunnel parameter values
- Reverse proxy functionality: resolved proxy pass issues for WebTop access post-migration
- Local user database integrity: fixed disappearance of local user entries following system updates
- Inventory system robustness: improved handling of VLAN devices on bridge interfaces and DNS configuration retrieval
- Controller configuration persistence: fixed configuration file corruption issue after saving cluster interface settings
- Controller setup workflow: improved configuration form with advanced options and clearer user guidance

Major changes on 2024-06-05
===========================

**This is a security release**

Image version: `8-23.05.3-ns.1.0.1`

Addressed security vulnerability: `GHSA-74xv-ww67-jjpx <https://github.com/NethServer/nethsecurity/security/advisories/GHSA-74xv-ww67-jjpx>`_ (disclosure will be published on 2024-06-20)

.. rubric:: Bug Fixes

- Security fix for GHSA-74xv-ww67-jjpx

- Ipsec: fix non working tunnel if selected WAN is a PPPoE over vlan
- MultiWAN: force maximum length for rules and policies names
- OpenVPN Road Warrior: prevent creation of users with trailing spaces
- Inventory: improve data collection for subscriptions and network
- Migration: fix OpenVPN Road Warrior users not visible in UI after migration
- API server: improved stability and performance by optimizing boot order for proper startup at boot time

Major changes on 2024-05-22
===========================

**Stable**

Image version: `8-23.05.3-ns.1.0.0`

The Stable release focuses on fixing bugs and improving the overall user experience.

Detailed changelog can be found `here <https://github.com/NethServer/nethsecurity/milestone/2?closed=1>`__.

.. rubric:: New features and improvements

- Routes: IPsec rules are now non-editable
- IPsec: added a validator for remote and local networks
- Autoreload VPN pages: VPN pages now automatically reload
- DHCP: added network scanning feature
- IPsec: improved handling of multiple networks within a single tunnel
- DHCP: force option for DHCP is now available in the UI
- Threat shield: remove enterprise list on subscription removal
- DPI: remove premium signatures on unregister
- Subscription: improve unregister modal
- Inventory: collect basic usage statistics
- IPsec: better expose PFS option
- Dashboard: add a notification of new available version
- Firewall rules: improve overall page readability
- Zones and policies: improved drawer for WAN zone
- Dashboard: show a warning if DNS is not configured
- NAT helpers: all NAT helpers are now included in the image but disabled by default

.. rubric:: Bug fixes

- FlashStart: DNS resolution fails after disabling the service
- FlashStart: fix first configuratin
- Let’s Encrypt: certificates are not created
- FlashStart: redirect rule is ineffective
- Firewall: ipset is not updated after removing an address
- Migration: host groups are not imported correctly in firewall rules
- Firewall rules: unable to insert custom IP address
- Threat shield: changes to allowlist are not immediately applied
- Migration: unable to edit imported IPsec tunnel
- OpenVPN road warrior: unable to re-create a previously created user from LDAP database
- OpenVPN RW: hosts are unreachable with bridged configuration
- MultiWAN: track IP is not updated
- Reverse Proxy: allow IP list should not be mandatory
- Controller: unable to connect unit if UI is disabled on port 443
- Subscription: unable to register a community subscription
- Install from USB: bad partition table
- Migration: unable to start PPPoE interface
- Threat shield: empty subscription feed
- Auto updates: cron job is not started during night
- Threat shield not started from the UI
- Migration: threat shield IP is not migrated
- EFI: unable to use free space as extra storage
- Zone: force creation in lowercase
- OpenVPN Road Warrior: OTP authentication, VPN disconnects after one hour
- ns-api: threatshield, set ban_nftexpiry and ban_logcount
- NAT helpers: active FTP sessions do not transfer files


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
- Migration: improve IPSec option migration and allow editing of imported IPsec tunnel.
- OpenVPN road warrior: resolved issue with user recreation from LDAP.
- Fixed axios error when committing changes.
- OpenVPN road warrior: fixed issue with bridged configuration.
- IPsec: improved handling of multiple networks with a single tunnel.
- Zones: fixed radio buttons IDs in Zones page.
- FlashStart: fixed ineffective redirect rule.
- Controller: refined behavior based on subscription presence.
- Firewall: updated ipset after IP address removal.

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
