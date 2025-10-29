.. _ha_maintenance_and_troubleshooting-section:

===============================
Maintenance and Troubleshooting
===============================

Alerting
========

.. admonition:: Subscription required

   This feature is available only if the firewall has a valid subscription.

The HA cluster provides automated monitoring and notifications to help administrators respond quickly to failover events or synchronization issues.

The following alerts are available:

- **ha:sync:failed**: Triggered when the configuration synchronization between primary and secondary nodes fails.
  This usually indicates that the secondary node is unreachable due to network issues, hardware failure, or service interruption.

- **ha:primary:failed**: Triggered during failover events when the primary node becomes unavailable.
  

Maintenance
===========

The HA cluster is designed to be highly available and requires minimal maintenance.
However, there are times when you may need to perform maintenance on either the primary or secondary node.

Secondary node
----------------------

The secondary node can be switched off for maintenance without affecting the primary node.

1. Stop `keepalived` on the **secondary node**: ::

     /etc/init.d/keepalived stop

2. Perform maintenance.
3. Start `keepalived` on the **secondary node**: ::

     /etc/init.d/keepalived start


Primary node
------------

The primary node can be switched off for maintenance, the secondary node will take over the virtual IP addresses
and all services.

1. Stop `keepalived` on the **primary node**: ::

     /etc/init.d/keepalived stop

2. Perform maintenance.
3. Start `keepalived` on the **primary node**: ::

   /etc/init.d/keepalived start

Remote access
-------------

The primary node is accessible both from the LAN and WAN interfaces.
Therefore, the secondary node is accessible from the LAN interface only.
When connecting to the secondary node from a remote network, you need to access the primary node first and then connect to the secondary node using SSH.

After connecting to the primary node, use the following command to access the secondary node: ::

   ns-ha-config ssh-remote

This command will establish an SSH connection to the secondary node using the SSH key generated during the HA setup.

Upgrade
-------

The secondary node does not receive system updates automatically because it does not have direct Internet access.
To update the secondary node, you need to connect to the primary node and run the update command on the secondary node: ::

  ns-ha-config upgrade-remote

This command will download the latest image, upload it to the secondary node, and install it.
As a normal upgrade, the secondary node will reboot after the installation.

.. _troubleshooting_ha-section:

Troubleshooting
===============

Troubleshooting the HA setup can be challenging, especially if the secondary node is not reachable or the primary node is not responding as expected.

Remember the secondary node does not have direct internet access in its normal standby state. Therefore:

- It cannot resolve external DNS names.
- It cannot reach the Controller or other external portals.
- It will not receive system updates.

The following instructions can help you identify and resolve common issues.
To start troubleshooting, you need to access the SSH console of both nodes.

Identifying the nodes
---------------------

Since the secondary node hostname syncs with the primary, the bash prompt changes to indicate the node's role:

- Primary node prompt: ``root@NethSec [P]:~#``
- Secondary node prompt: ``root@NethSec [S]:~#``

Keepalived status
-----------------

Execute ``ns-ha-config status`` to check Keepalived statistics.
Extract from the output: ::

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

On a primary node, the `master.become_master` should be `1` or more, indicating it has successfully taken over as the master.
Also the `master.advert.sent` should be greater than `0`, indicating it is actively sending advertisements to the secondary node.

On a secondary node, the `master.advert_rcvd` should be greater than `0`, indicating it is receiving advertisements from the primary node.
If the `master.become_master` is `0`, it means the node has not taken over as the master, which is expected for a secondary node.

VRRP traffic
------------

The primary node sends VRRP advertisements to the secondary node every second.
You can check the VRRP traffic using the following command on the primary node: ::

  tcpdump -vnnpi <lan_interface> vrrp

Replace `<lan_interface>` with the name of the LAN interface (e.g., `eth0`).

The output should show VRRP packets being sent from the primary node to the secondary node. Some example output: ::

   tcpdump: listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
    13:54:16.629467 IP (tos 0xc0, ttl 255, id 19404, offset 0, flags [none], proto VRRP (112), length 44)
    192.168.100.238 > 192.168.100.239: VRRPv2, Advertisement, vrid 100, prio 200, authtype simple, intvl 1s, length 24, addrs(2): 192.168.122.49,192.168.100.240 auth "1655e3d3"

If the same command is run on the secondary node, it should show VRRP packets being received from the primary node.

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

- Track network configuration imports on secondary node::

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

The reset command restores the cluster configuration to its default state. Typically, after the reset, the primary node can continue operating normally, while the secondary node, no longer used in the cluster should be reset to default to avoid any conflicts.
After the reset, only the HA interface remains active, so a reboot is required to complete the process. The reset must be performed locally on the primary node.
  
To reset command will:

- Stop and disable `keepalived` and `conntrackd`.
- Remove HA configuration files.
- Clean up `dropbear` configuration including SSH keys.

At the end, a reboot is required to apply the changes. Just execute: ::

   ns-ha-config reset
   reboot
