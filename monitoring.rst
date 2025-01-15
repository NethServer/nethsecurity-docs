.. _monitoring-section:

==========
Monitoring
==========

NethSecurity provides comprehensive monitoring capabilities to help administrators track the performance and health of the firewall.
Monitoring is essential for ensuring the firewall's optimal operation and identifying potential issues that may impact its functionality.

NethSecurity offers two types of monitoring:

- **Real-time monitoring**: it leverages Netdata to provide immediate insights into the firewall's performance.
  It reads data from logs and local databases, storing metrics in RAM. Note that these metrics are reset upon every reboot, ensuring that only the most current data are displayed.
- **Historical monitoring**: for a more comprehensive view over time, historical monitoring stores data on a remote controller.
  This allows metrics to be preserved across reboots and enables centralized monitoring. Please note that this feature requires a valid subscription both on the firewall and the controller.

.. _real_time_monitoring-section:

Real-time monitoring
====================

Real-time monitoring is an essential feature in modern firewall systems, allowing administrators to have instant visibility into network traffic,
VPN connections, and security threats. In NethSecurity, real-time monitoring provides live data, ensuring that issues such as network congestion,
unauthorized access, and security breaches are identified and mitigated promptly.
Real-time monitoring stores data in RAM and resets at every machine reboot.

The ``Real-time monitor`` page provides a comprehensive overview of the firewall's performance and status, with detailed insights into network traffic.
It's divided into four main sections: ``Traffic``, ``WAN uplinks``, ``VPN``,  ``Security`` and ``Real-time Traffic``.

Traffic
-------

The below charts reads data from `dpireport <https://dev.nethsecurity.org/packages/ns-report/>`_ daemon:

- ``Daily total traffic``:  
  this counter shows the total volume of data transferred through the firewall for the current day.

- ``Recent traffic``:  
  the daily traffic histogram visually represents network traffic over time, updated every 60 minutes.
  It helps identify busy periods and analyze traffic fluctuations throughout the day.
  Sudden spikes or dips could indicate potential performance issues or security threats.

- ``Local Hosts``:  
  this chart focuses on internal (local) hosts and their traffic. It helps identify the most active devices on the network,
  aiding in bandwidth management and detection of potential internal security risks, such as compromised devices generating unexpected traffic.

- ``Applications``:  
  this chart displays traffic by application, allowing you to monitor which software or services are generating the most traffic.
  It is useful for understanding application behavior, detecting bandwidth hogs, and monitoring compliance with usage policies.

- ``Remote Hosts``:  
  this chart lists the external (remote) hosts that have exchanged the most data with the network.
  By analyzing this data, administrators can track interactions with specific external entities,
  helping to detect malicious external sources or unusual outbound traffic patterns.

- ``Protocol``:  
  this chart shows the breakdown of daily traffic by protocol (e.g., HTTP, HTTPS, FTP).
  It is useful for identifying which protocols are consuming the most bandwidth and ensuring that network resources are being used appropriately.
  High usage of unfamiliar protocols may indicate unauthorized activities.

It's possible to narrow the search for a specific host, application, or protocol by clicking on the respective label in the table below the chart.

Connectivity
------------

The connectivity section provides an overview of WAN connections, including status, bandwidth allocation, and traffic data.

This page shows the following information:

- ``WANs``: list of the WAN connections with their current status (UP/DOWN) and public IP address.
  The status information helps ensure that critical network connections are online, and any downtime are immediately addressed.
  Data are sourced from the firewall mwan3 status.

- ``WAN events``: 
  this section lists recent WAN connection and disconnection events from the last 24 hours, providing insight into network stability and outages.
  It helps administrators understand the frequency and duration of network disruptions, aiding in troubleshooting and capacity planning.
  Data are retrieved from the logs for the past 24 hours. 
  If the logs do not cover the full 24-hour period, the data may be incomplete. 
  The results are cached for 5 minutes.

- ``WAN interface traffic``:  
  this histogram shows the traffic data for each WAN connection over the past 60 minutes, sourced from Netdata.
  It helps track real-time performance and diagnose issues such as uneven load balancing or WAN link saturation.

- ``Latency to <address>``:
  this section provides real-time latency data for a specific IP address configured inside the :ref:`ping_latency-section` module.
  The cart helps to monitor network performance and identify potential connectivity issues.

- ``Packet delivery rate to <address>``:
  this section provides real-time packet delivery rate data for a specific IP address configured inside the :ref:`ping_latency-section` module.
  If the rate is below 100% it could indicate network congestion or connectivity issues.

VPN
---

The VPN section provides detailed insights into OpenVPN Road Warrior servers, OpenVPN tunnels and IPsec tunnels.

For each OpenVPN Road Warrior server, the following information is displayed:

- ``Status``:  
  this section shows the current status of the OpenVPN server.
  It helps administrators monitor the availability of the VPN service and detect any issues that may impact user connectivity.

- ``Connected clients``:
  this displays the total number of users currently registered on the VPN server.
  Monitoring registered users is crucial for ensuring capacity planning and VPN performance, particularly when the system approaches maximum usage.

- ``Total traffic by hour``:
  this graph shows the total data transferred by all VPN clients during each hour, providing an overview of VPN bandwidth usage.
  It helps in tracking how much network traffic the VPN generates and identifying hours with heavy usage, which could lead to performance issues.

- ``Daily connections``:
  this section lists all currently connected VPN users and the time they connected.
  It is useful for tracking session duration and detecting potential misuse of the VPN, such as connections that last unusually long.
  Data are sourced from local SQLite connection database.

- ``Connected clients by hour``:
  this chart displays the number of clients connected to the VPN over time.
  It allows administrators to monitor VPN activity throughout the day, helping to identify peak times and plan for increased capacity when necessary.
  Data are sourced from local SQLite connection database.

- ``Client traffic by hour``:
  this chart breaks down VPN traffic by individual clients over time.
  It helps detect users who may be consuming excessive bandwidth or engaging in unauthorized activities, aiding in the identification of potential insider threats.
  Data are sourced from local SQLite connection database.

The Site-to-Site VPN section provides insights into OpenVPN and IPsec tunnels:

- ``Connected tunnels``: 
  this counter shows the number of active site-to-site VPN tunnels.

- ``Configured tunnels``:
  this counter shows the list of all configured site-to-site VPN tunnels, including their status and type.
  
- ``Tunnel traffic``:
  this histogram provides real-time traffic data for each site-to-site VPN tunnel over the last 60 minutes.
  It helps detect issues such as low throughput or connection instability.

Security
--------

The security section provides insights into malware detection and attack monitoring, helping administrators identify and mitigate security threats.
To enable this section, the :ref:`threat_shield_ip-section` module must be enabled.
Data are sourced from logs covering the past 24 hours. If the logs do not span the entire 24-hour period, the data may be incomplete.  
Results are cached for 5 minutes to improve performance.

The ``Blocklist`` section provides an overview of blocked packets based on enabled blocklists. Available charts are:

- ``Blocked threats``:  
  this counter shows the total number of packets blocked by the firewall due to malware detection for the current day. 
  It provides a clear overview of the volume of threats intercepted, giving administrators a measure of the firewall’s effectiveness.

- ``Blocked threats by hour``:
  this chart tracks the number of packets blocked each hour. It helps identify the times of day when the network is most vulnerable to attacks,
  aiding in preventive measures.

- ``Threats by direction``:
  a chart that shows the distribution of blocked malware by firewall chain.
  Depending on what logging option is enabled, the firewall can log packets from the following chains:

  - *inp-wan*: packets coming from the WAN interface and destined to the firewall
  - *fwd-wan*: packets coming from the WAN interface and destined to the LAN network
  - *fwd-lan*: packets coming from the LAN network and destined to the WAN interface
  - *pre-ct*: flooding packets that are in invalid state
  - *pre-syn*: flooding packets that are part of a TCP connection and are in the SYN state
  - *pre-udp*: flooding packets that are part of a UDP connection

- ``Threats by category``:
  a chart that breaks down the blocked malware by category, helping administrators to find the most effective blocklists.

The ``Brute force attacks`` section provides insights into the number of blocked IP based on the number of failed login attempts.
Data are sourced from logs covering the past 24 hours. If the logs do not span the entire 24-hour period, the data may be incomplete.  
Results are cached for 5 minutes to improve performance.
Available charts are:

- ``Blocked IP addresses``:  
  this counter shows the total number of IP addresses blocked due to malicious activity for the current day.
  It helps in tracking the volume of attempted intrusions.

- ``Blocked IP addresses by hour``:  
  this graph tracks the number of blocked IP addresses over time, helping to identify periods of increased attack activity.

- ``Most frequently blocked IP address``:  
  this char shows the IP addresses that have been blocked most frequently.
  It is useful for identifying persistent threats or attack sources that should be investigated or blacklisted.

Real-time traffic
-----------------

The Real-time traffic section shows data updated every 2 minutes. It's divided into three categories:

- ``Local Hosts``: lists all detected local hosts and their current traffic status, ordered by traffic volume.
- ``Applications``: lists all detected applications and their current traffic status, ordered by traffic volume.
- ``Protocols``: lists all detected protocols and their current traffic status, ordered by traffic volume.

Netdata
-------

NethSecurity uses `Netdata <https://www.netdata.cloud/>`_ as Real-time monitoring tool.
Netdata is an open-source, real-time, performance monitoring and troubleshooting tool for systems and applications.
It provides comprehensive insights into the performance and health of systems and applications through visualizations and detailed metrics.
Netdata is designed to be lightweight, fast, and easy to use.

Netdata is enabled by default on NethSecurity and it is accessible from the LAN network. To access it, go to the ``Monitoring`` page
and click :guilabel:`Open report` button from the ``Real-time report`` tab.

Netdata metrics are saved in RAM and will be reset at very machine reboot.
If the firewall is connected to the :ref:`remote controller <controller-section>`, metrics will be stored to the controller itself and preserved across reboots.

.. _ping_latency-section:

Ping latency monitoring
------------------------

Configure the monitoring tool to evaluate round-trip time and packet loss by transmitting ping messages to network hosts.
This tool is employed to monitor the quality of network connectivity. You have the option to include one or more hosts for monitoring,
and it's also feasible to add IP addresses within a VPN for assessing tunnel quality.

To monitor a new host or IP address, click on the :guilabel:`Add host` button and enter the required information,
finally click on the :guilabel:`Save` button to confirm the changes.

Changes are applied immediately. To remove a host from the list, click on the delete icon.

You can see a graph of the ping latency by accessing Netdata from the report page.

.. _historical_monitoring-section:

Historical monitoring
=====================

.. admonition:: Subscription required

   This feature is available only if the firewall and the controller have a valid subscription.

If the unit was connected to the controller before the subscription was activated, historical monitoring will not be enabled automatically.
The ``Controller`` page will show a message indicating that historical monitoring is disabled.

To enable it, follow these steps:

1. Disconnect the unit from the controller.
2. Ensure that the NethServer 8 where the controller is installed has a valid subscription.
3. Reconnect the unit to the controller.

See the :ref:`controller metrics <controller_metrics-section>` for more information.

.. _alert-section:

Alerts
======

The alert system leverages the power of the Netdata engine for efficient monitoring and alerting.

The alert system prioritizes only those alerts that have the potential to disrupt or compromise the firewall's functionality.
By focusing on critical indicators, administrators can efficiently address issues that pose a genuine threat to the security and operation of the firewall.

If the server has a valid :ref:`subscription-section`, alert notifications are seamlessly sent to remote servers for centralized monitoring and management.
Both ``my.nethesis.it`` and ``my.nethserver.com`` serve as central hubs for receiving alerts, allowing administrators to stay informed about the firewall's
status and promptly respond to any critical situations.

Implemented alerts:

- Disk Space: the disk space alert triggers when available disk space on the system reaches a critical level.
  This proactive notification helps prevent potential disruptions by addressing disk space issues before they impact firewall operations.

- MultiWAN Status (Up/Down): this alert notifies administrators when there are changes in the MultiWAN status, indicating whether connections are up or down.
  Timely awareness of MultiWAN status changes is crucial for maintaining continuous and reliable internet connectivity.

