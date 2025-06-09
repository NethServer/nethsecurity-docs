.. _high_availability:

======================
High Availability (HA)
======================

NethSecurity High Availability (HA) ensures continuous network operation by providing redundancy through a cluster of two firewalls.
If the primary firewall fails due to hardware issues, software problems, or maintenance, a backup firewall automatically takes over all network services and
traffic handling, minimizing downtime.

This is crucial for businesses or organizations where uninterrupted internet access, VPN connectivity, and security services are essential for daily operations,
preventing loss of productivity or revenue during an outage.

Key concepts
============

Some key concepts to understand before setting up HA:

- **Primary Node**: The firewall that actively handles traffic and services.
- **Backup Node**: The firewall that automatically takes over in case of failure on the primary node.
- **Virtual IP (VIP)**: A shared IP address used by both nodes for each configured interface to ensure uninterrupted client access to services.
  Clients on the network should *always* use the VIP address (e.g., as their gateway, DNS server, or VPN endpoint) to ensure seamless failover.

Configuration changes must **always** be made on the **primary node**. The backup node should be considered read-only.
Most configurations, such as firewall rules, VPN settings, or Threat Shield rules, are automatically synchronized from the primary to the backup node.

This is how the HA system works:

- **Heartbeat**: The primary and backup firewalls continuously check each other's status using the VRRP protocol. If the primary fails, the backup takes over.
- **Settings synchronization**: The primary firewall securely sends its settings, including details about active connections like VPNs and network routes,
  to the backup firewall.
- The system automatically adjusts what each firewall does based on whether it's the active (primary) or standby (backup) unit:

  - **Backup receives configuration updates**: When the backup firewall gets new settings, it saves them but keeps related services (like VPNs) turned off.
    The backup firewall holds a complete copy of the primary's configuration but keeps most background tasks inactive.
    This includes things like checking for software updates, performing remote backups, or sending reports.
    This ensures only the active primary firewall handles these tasks, preventing conflicts.
  - **Firewall becomes active**: When a firewall takes over as the primary (either starting up normally or during a failover),
    it activates all necessary services and connections.
  - **Firewall becomes standby**: When a firewall is in backup mode (either at startup or when the primary comes back online),
    it deactivates most services and connections.

While the HA system is designed to be as automatic as possible, some configurations require manual intervention.
For example, if you add a new network interface or change an existing one, you need to inform the HA system about these changes.
Specific actions are needed to ensure the backup node is aware of the new network configuration:

- Beside the first LAN and WAN configured in the initial setup, all other interfaces must be explicitly added to the HA cluster.
  This is done using the ``ns-ha-config add-lan-interface`` or ``ns-ha-config add-wan-interface`` command.
  This command registers the new interface in the HA cluster configuration and associates a Virtual IP (VIP) with it for failover.
- Similarly, when adding an IP alias to an interface on the primary node, you must also register this alias within the HA cluster configuration
  using ``ns-ha-config add-alias``.

Supported features and limitations
===================================

The HA cluster supports synchronization for a wide range of features, including:

- Firewall rules, port forwarding, DHCP, DNS
- VPN configurations (OpenVPN, IPsec, WireGuard)
- QoS, Multi-WAN, DPI rules
- Reverse proxy, ACME certificates, and more.
- Static routes
- Netifyd informatics configuration
- Threat shield IP (banip)
- Threat shield DNS (adblock)
- Users and objects database
- Netmap
- Flashstart
- SNMP server (snmpd)
- NAT helpers
- Dynamic DNS (ddns)
- SMTP client (msmtp)
- Backup encryption password
- Controller connection and subscription (ns-plug)
- Active connections tracking (conntrackd)
- Hotspot (dedalo)

Be aware of the following current limitations:

- IPv4 only (IPv6 is not supported).
- VLANs are supported only on physical interfaces.
- Extra packages such as NUT are not supported.
- Syslog daemon (rsyslog) configuration is not synced: if you need to send logs to a remote server, you must use the controller.
- PPPoE or DHCP WAN is not supported (see Static IP requirement)

Also note that after the first synchronization, the backup node will have the same hostname as the primary node.
The web user interface will show the hostname of the primary node, but the dashboard will indicate the node's role (primary or backup).
Also, when accessing the SSH console, the prompt will change to indicate the node's role.
See the :ref:`troubleshooting_ha-section` section for more details.

Requirements
============

Before setting up HA, ensure the following requirements are met:

- Two firewalls with identical network devices. Each device must have the exact same name and numbering (e.g., eth0, eth1, eth2, eth3)
- Both nodes must be connected to the same LAN; connect the LAN interfaces to the same broadcast domain (usually the same switch).
- Static IP addresses for all interfaces that will host a virtual IP.

Setup and configuration
========================

The HA setup process involves several steps.
If you just want to see the commands, you can skip to the `Configuration example`_ section,
but it's recommended to read the entire section to understand the process and requirements.

The setup process is as follows:

1. **Install the same NethSecurity version** on two identical machines (physical or virtual).
   See :ref:`install-section` for detailed installation instructions.

2. **Connect network cables properly** to ensure redundancy.
   See `Network cabling`_ section below for proper cabling guidelines.

3. **Configure LAN interfaces** on both nodes with static IP addresses. Create any VLANs or other network devices
   that will be needed for the cluster before proceeding with HA setup.
   See `LAN interfaces`_ section below for detailed instructions.

4. **Initialize the cluster** using the `ns-ha-config` commands to establish the HA cluster foundation.
   The initialization process configures the necessary services and prepares both nodes for synchronization.
   During the first configuration, all network interfaces that will be used in the HA cluster must must have the cable connected on both nodes,
   otherwise the node may enter a fault state and the HA cluster will not work properly.
   See `Cluster initialization`_ section below for detailed instructions.

5. **Add WAN interface** to cluster configuration to ensure proper failover for internet connectivity.
   This step is crucial for maintaining internet access during failover scenarios.
   See `WAN Interfaces`_ section below for detailed instructions.

6. **Verify the configuration** to ensure everything is set up correctly.
   Use the `ns-ha-config` commands to check the status and configuration of the HA cluster.
   See `Verify the configuration`_ section below for detailed instructions.

7. **Configure additional interfaces** for the cluster as needed (optional).
   This step is optional and depends on your network setup. You can add any additional interfaces that require HA support.
   See `Additional interfaces`_ section below for detailed instructions.
   If you need to configure an hotspot, see `Hotspot support`_ section below for specific requirements.

8. **Add IP aliases** to the primary node on relevant interfaces (optional).
   This step is optional and allows you to add additional IP addresses to the primary node for services that require multiple IPs.
   See `Network aliases`_ section below for detailed instructions.

The detailed steps for each of these points are covered in the sections below.

Sometimes, you may need to remove interfaces or aliases from the HA configuration.
This can be done using the `ns-ha-config` commands.
See `Remove interfaces and aliases`_ section below for detailed instructions.

Network cabling
---------------

Proper network cabling is essential to ensure high availability and seamless failover between the primary and backup firewalls.

1. **General Recommendations**:

   - For each network zone (LAN, WAN, DMZ, etc.), use a dedicated switch or VLAN to connect both firewalls' interfaces.
   - Avoid connecting the firewalls directly to each other; always use a switch or network segment in between.
   - Label all cables and switches for clarity and easier troubleshooting.

2. **LAN Connections**:

   - Connect the LAN interfaces of both the primary and backup nodes to the same network segment.
   - Ideally, use **two separate switches** for redundancy. Connect each firewall's LAN port to both switches (if supported), or at least ensure each firewall is 
     connected to a different switch. This avoids a single point of failure if one switch fails.
   - If using two separate switches for redundancy, they must be properly interconnected and support Spanning Tree Protocol (STP) to prevent network loops.
     Unmanaged switches without STP support may cause broadcast storms when interconnected.
   - If only one switch is available, use VLAN segmentation to logically separate each network zone and minimize broadcast domains.
   - Repeat this process for **each network interface** configured for HA (e.g., LAN, GUEST, DMZ). Each interface should be connected to its corresponding network segment, preferably through redundant switches.

3. **WAN Connections**:

   - Connect the WAN interfaces of both nodes to the ISP or upstream router.
   - For best redundancy, use the same approach as with the LAN connections.
   - If only one WAN switch/router is available, both firewalls should connect to it, but this introduces a single point of failure.
   - If your ISP provides a router with HA capability (e.g., VRRP or HSRP), you can connect both firewalls' WAN ports directly to the ISP's redundant routers.
   - Alternatively, you can configure MultiWAN directly in NethSecurity to manage multiple WAN uplinks and failover.

This setup ensures that if any single firewall or switch fails, network connectivity is maintained through the backup node and the remaining switch.

The below diagram illustrates the recommended redundant network setup, switches are omitted for clarity.

.. image:: _static/high_availability.png
   :alt: High Availability network diagram showing proper cabling
   :align: center

LAN interfaces
--------------

The HA cluster requires static IP addresses for all interfaces that will host a virtual IP.
Follow these steps:

- Power on the backup node, access the web interface and set a static LAN IP address (e.g., `192.168.100.239`).
- Power on the primary node, access the web interface and set a static LAN IP address (e.g., `192.168.100.238`).

These static IP addresses are used to access the nodes directly, even if the HA cluster is disabled. Consider them *management IP addresses*.

Cluster initialization
----------------------

The setup process configures `keepalived` for failover, `rsync` over SSH for configuration synchronization, and `conntrackd` to sync the connection tracking table.
Use the `ns-ha-config` script to simplify the process.

Before diving into the actual setup, it's important to ensure that both nodes are properly configured and meet the necessary requirements.

Access the console or SSH into the primary node and run the following commands.

Check requirements
^^^^^^^^^^^^^^^^^^

For the primary node::

  ns-ha-config check-primary-node [lan_interface] [wan_interface]

This checks:

- LAN interface has a static IP. If the ``lan_interface`` parameter is not provided, it searches for a LAN interface named ``lan``.
- At least one WAN interface exists. If the ``wan_interface`` parameter is not provided, it searches for a WAN interface named ``wan``.
  The WAN interface must be configured with a static IP address; PPPoE and DHCP are not supported.
- If DHCP server is running:

  - ``Force DHCP server start`` option is enabled.
  - ``3: router`` DHCP option is set (should be the virtual IP).
  - ``6: DNS server`` DHCP option is set.

For the backup node::

  ns-ha-config check-backup-node <backup_node_ip> [lan_interface]

This checks:

- Backup node is reachable via SSH on port 22 with root user.
- LAN interface has a static IP. If the ``lan_interface`` parameter is not provided, it searches for a LAN interface named ``lan``.
- At least one WAN interface exists.

WAN interface can be omitted on the backup node, but bear in mind that in case of failover, the UI of the backup node
will show an unknown interface.
It's recommended to configure the WAN interface on the backup node as well, even if it does not have a static IP address.

The script will request the root password for the backup node. You can also pipe the password: ::

   echo "password" | ns-ha-config check-backup-node <backup_node_ip>

Ensure the backup node can be reached via SSH from the primary node on standard port 22.

Initialize nodes
^^^^^^^^^^^^^^^^

Initialize the primary node::

   ns-ha-config init-primary-node <primary_node_ip> <backup_node_ip> <virtual_ip> [lan_interface] [wan_interface]

Where the ``primary_node_ip`` is the static IP of the primary node already set for the LAN interface,
and ``backup_node_ip`` is the static LAN IP of the backup node
The ``virtual_ip`` is the virtual IP address for the LAN interface where all LAN hosts should point to.
The ``lan_interface`` parameter is optional and specifies the LAN interface name (default is `lan`).

This script will:

- Initialize `keepalived` with the virtual IP for the LAN interface.
- Configure `conntrackd`.
- Generate a random password and public key for synchronization.
- Configure `dropbear` (SSH server) to listen on port `65022` and allow only key-based authentication for sync.

Initialize the backup node (always execute the command on the primary node)::

   ns-ha-config init-backup-node

The script will ask for the root password of the backup node. You can also pipe the password: ::

   echo "password" | ns-ha-config init-backup-node

At this point, the nodes are configured to communicate over LAN, and the LAN virtual IP will failover.

WAN interfaces
--------------

The WAN interface is the first interface to be added to the HA cluster.
Remember that the WAN interface must be configured with a static IP address, so make sure also to setup
 :ref:`DNS forwarders <forwarding_servers-section>`.

Configure the WAN interface::

   ns-ha-config add-wan-interface <interface> <virtual_ip_address> <gateway>

Where ``<interface>`` is the name of the WAN interface (e.g., `wan`, `eth1`, etc.),
Ensure you provide the virtual IP in CIDR notation (e.g., `192.168.1.100/24`) and the gateway IP.
The script configures the interface on both nodes using fake IP addresses from the `169.254.x.0/24` range and sets up the virtual IP in `keepalived`.

Verify the configuration
------------------------

The cluster is now ready to be used. You can check the status of the cluster and verify that the configuration is correct.

Verify current configuration: ::

      ns-ha-config show-config

Check the status of the HA cluster. The first sync may take up to 5 minutes. ::

      ns-ha-config status

Initial status might show `Last Sync Status: SSH Connection Failed`. After sync, it should show `Last Sync Status: Up to Date`.

Additional interfaces
---------------------

It's possible to add additional interfaces to the HA cluster after the initial setup.
Before adding an interface, ensure that the interface is configured with a static IP address on the primary node
and on the secondary node, much like the LAN interface configured during the initial setup.
Interfaces can be ethernets, bridges, VLANs, or bonds. Please note that VLANs over logical interfaces are not supported.

You can use this command to add any non-WAN interface, like a second LAN, DMZ or GUEST interface to the HA cluster.

Add additional interfaces as needed::

   ns-ha-config add-lan-interface <primary_node_ip> <backup_node_ip> <virtual_ip_address>

The following checks are performed:

- virtual IP address must be in CIDR notation (e.g., `192.168.100.1/24`)
- make sure a device with given static IP address exists on the node
- If DHCP server is running, the following

  - ``Force DHCP server start`` option is enabled.
  - ``3: router`` DHCP option is set (should be the virtual IP).
  - ``6: DNS server`` DHCP option is set.


Example: ::

   ns-ha-config add-lan-interface 192.168.200.1 192.168.200.2 192.168.200.253/24


Hotspot support
---------------

The hotspot feature is supported in HA clusters, but there are important requirements:

- The backup node must have the exact same network devices as the primary node. For example, if the primary node has a
  VLAN interface named ``eth1.1``, the backup node must also have a ``eth1.1`` interface with the same name and configuration.
  If the interfaces do not match, the hotspot will not function correctly after a failover.
- The hotspot can only operate on a physical interface or a VLAN interface.
- To maintain hotspot functionality during failover, the MAC address of the interface running the hotspot on the primary node is automatically
  copied to the corresponding interface on the backup node when a switchover occurs.

Note that active sessions are stored in RAM and will be lost during a switchover; clients must re-authenticate unless auto-login is enabled.

Network aliases
----------------

You can add IP aliases to the primary node on relevant interfaces.
This is useful for services that require multiple IP addresses on the same interface, such as virtual servers or load balancing.
First, on the primary node, access the web interface and add the alias to the network interface.

Then, use the `ns-ha-config` command to register the alias in the HA cluster configuration.

Aliases must be explicitly set on the primary node. ::

   ns-ha-config add-alias <interface> <alias_ip_cidr> [<gateway>]

Provide the gateway only if the alias is for a WAN interface.

Example of a LAN alias: ::

   ns-ha-config add-alias lan 192.168.100.66/24

Example of a WAN alias: ::

   ns-ha-config add-alias wan 192.168.122.66/24 192.168.122.1

**Note:** the alias will not appear in the network configuration page of the backup node.

Remove interfaces and aliases
-----------------------------

Remove an interface from HA configuration: ::

   ns-ha-config remove-interface <interface>

Example: ::
   
   ns-ha-config remove-interface guest

This removes the interface from `keepalived` and from the backup node's network configuration.
Also, the virtual IP address associated with the interface will be moved to the network interface of the primary node.


Remove an alias from HA configuration: ::

   ns-ha-config remove-alias <interface> <alias_ip_cidr>

Example: ::

   ns-ha-config remove-alias wan 192.168.122.66/24

This removes the alias from `keepalived` but not from the backup node's network configuration.
Then, proceed to remove the alias using the primary node's web interface.

Configuration example
---------------------

Assuming:

- Primary Node LAN IP: `192.168.100.238`
- Backup Node LAN IP: `192.168.100.239`
- LAN Virtual IP: `192.168.100.240/24`
- WAN Interface: `wan` (e.g., `eth1`)
- WAN Virtual IP: `192.168.122.49/24`
- WAN Gateway: `192.168.122.1`
- Backup Node Root Password: `backup_root_password`

Execute the following commands on the **primary node**:

1. Check requirements and initialize: ::

      # Check requirements first
      ns-ha-config check-primary-node
      echo "backup_root_password" | ns-ha-config check-backup-node 192.168.100.239

      # Initialize primary
      ns-ha-config init-primary-node 192.168.100.238 192.168.100.239 192.168.100.240/24

      # Initialize backup (run from primary node)
      echo "backup_root_password" | ns-ha-config init-backup-node

2. Add WAN interface: ::

      ns-ha-config add-wan-interface wan 192.168.122.49/24 192.168.122.1

Alerting
========

.. admonition:: Subscription required

   This feature is available only if the firewall and the controller have a valid subscription.

The HA cluster provides automated monitoring and notifications to help administrators respond quickly to failover events or synchronization issues.

The following alerts are available:

- **ha:sync:failed**: Triggered when the configuration synchronization between primary and backup nodes fails.
  This usually indicates that the backup node is unreachable due to network issues, hardware failure, or service interruption.

- **ha:primary:failed**: Triggered during failover events when the primary node becomes unavailable.
  

Maintenance
===========

The HA cluster is designed to be highly available and requires minimal maintenance.
However, there are times when you may need to perform maintenance on either the primary or backup node.

Backup node
-----------

The backup node can be switched off for maintenance without affecting the primary node.

1. Stop `keepalived` on the **backup node**: ::

     /etc/init.d/keepalived stop

2. Perform maintenance.
3. Start `keepalived` on the **backup node**: ::

     /etc/init.d/keepalived start


Primary node
------------

The primary node can be switched off for maintenance, the backup node will take over the virtual IP addresses
and all services.

1. Stop `keepalived` on the **primary node**: ::

     /etc/init.d/keepalived stop

2. Perform maintenance.
3. Start `keepalived` on the **primary node**: ::

   /etc/init.d/keepalived start

Remote access
-------------

The primary node is accessible both from the LAN and WAN interfaces.
Therefore, the backup node is accessible from the LAN interface only.
When connecting to the backup node from a remote network, you need to access the primary node first and then connect to the backup node using SSH.

After connecting to the primary node, use the following command to access the backup node: ::

   ns-ha-config ssh-remote

This command will establish an SSH connection to the backup node using the SSH key generated during the HA setup.

Upgrade
-------

The backup node does not receive system updates automatically because it does not have direct Internet access.
To update the backup node, you need to connect to the primary node and run the update command on the backup node: ::

  ns-ha-config upgrade-remote

This command will download the latest image, upload it to the backup node, and install it.
As a normal upgrade, the backup node will reboot after the installation.

.. _troubleshooting_ha-section:

Troubleshooting
===============

Troubleshooting the HA setup can be challenging, especially if the backup node is not reachable or the primary node is not responding as expected.

Remember the backup node does not have direct internet access in its normal standby state. Therefore:

- It cannot resolve external DNS names.
- It cannot reach the Controller or other external portals.
- It will not receive system updates.

The following instructions can help you identify and resolve common issues.
To start troubleshooting, you need to access the SSH console of both nodes.

Identifying the nodes
---------------------

Since the backup node hostname syncs with the primary, the bash prompt changes to indicate the node's role:

- Primary node prompt: ``root@NethSec [P]:~#``
- Backup node prompt: ``root@NethSec [B]:~#``

Keepalived status
-----------------

Execute ``ns-ha-config status`` to check Keepalived statistics.
Extract from the output:
```
Keepalived Statistics:
  advert_rcvd: 249
  advert_sent: 0
  become_master: 1
  release_master: 0
  packet_len_err: 0
  advert_interval_err: 0
  ip_ttl_err: 0
  invalid_type_rcvd: 0
  addr_list_err: 0
  invalid_authtype: 0
  authtype_mismatch: 0
  auth_failure: 0
  pri_zero_rcvd: 1
  pri_zero_sent: 0
```

On a primary node, the `master.became_master` should be `1` or more, indicating it has successfully taken over as the master.
Also the `master.advertisements.sent` should be greater than `0`, indicating it is actively sending advertisements to the backup node.

On a backup node, the `master.advertisements.received` should be greater than `0`, indicating it is receiving advertisements from the primary node.
If the `master.became_master` is `0`, it means the node has not taken over as the master, which is expected for a backup node.

VRRP traffic
------------

The primary node sends VRRP advertisements to the backup node every second.
You can check the VRRP traffic using the following command on the primary node: ::

  tcpdump -vnnpi <lan_interface> vrrp

Replace `<lan_interface>` with the name of the LAN interface (e.g., `eth0`).

The output should show VRRP packets being sent from the primary node to the backup node. Some example output: ::

   tcpdump: listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
13:54:16.629467 IP (tos 0xc0, ttl 255, id 19404, offset 0, flags [none], proto VRRP (112), length 44)
    192.168.100.238 > 192.168.100.239: VRRPv2, Advertisement, vrid 100, prio 200, authtype simple, intvl 1s, length 24, addrs(2): 192.168.122.49,192.168.100.240 auth "1655e3d3"

If the same command is run on the backup node, it should show VRRP packets being received from the primary node.

Logs
----

All logs are stored in ``/var/log/messages`` on both nodes.

You can examine specific components of the HA system in logs:

- Check rsync synchronization logs::

   grep ns-rsync.sh /var/log/messages

- Examine SSH connection activities for syncing::

   grep dropbear /var/log/messages

- View keepalived status changes and events::

   grep Keepalived /var/log/messages

- Track network configuration imports on backup node::

   grep "ns-ha: Importing network configuration" /var/log/messages

Debugging
---------

When log files are not sufficient, you can enable debug logging for specific components:

Debug the `ns-ha-config` script: ::

   bash -x ns-ha-config <action> [<options>]

View active `keepalived` configuration: ::

   cat /tmp/keepalived.conf

Enable `keepalived` debug logging (on primary): ::

   uci set keepalived.primary.debug=1
   uci commit keepalived
   reload_config

Then, search for ``Keepalived_vrrp`` in the ``/var/log/messages`` file.

Reset the configuration
-----------------------

To completely remove the HA configuration: ::

   ns-ha-config reset

This script will:

- Stop and disable `keepalived` and `conntrackd`.
- Remove HA configuration files.
- Clean up `dropbear` configuration including SSH keys.

The network configuration of the nodes remains unchanged. You can manage them as standalone nodes using their static management IPs.
