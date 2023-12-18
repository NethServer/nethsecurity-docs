.. _metrics-section:

=======
Metrics
=======

NethSecurity uses `netdata <https://www.netdata.cloud/>`_ as monitoring tool.
Netdata is an open-source, real-time, performance monitoring and troubleshooting tool for systems and applications.
It provides comprehensive insights into the performance and health of systems and applications through visualizations and detailed metrics.
Netdata is designed to be lightweight, fast, and easy to use.

Netdata is enabled by default on NethSecurity and it is accessible from the LAN network. To access it, go to the ``Report`` page
and click :guilabel:`Open report` button from the ``Real time report`` tab.

Netdata metrics are saved in RAM and will be reset at very machine reboot.
If the firewall is connected to the :ref:`remote controller <controller-section>`, metrics will be stored to the controller itself and preserved across reboots.

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

Ping latency monitoring
=======================

Configure the monitoring tool to evaluate round-trip time and packet loss by transmitting ping messages to network hosts.
This tool is employed to monitor the quality of network connectivity. You have the option to include one or more hosts for monitoring,
and it's also feasible to add IP addresses within a VPN for assessing tunnel quality.

To monitor a new host or IP address, click on the :guilabel:`Add host` button and enter the required information,
finally click on the :guilabel:`Save` button to confirm the changes.

Changes are applied immediately. To remove a host from the list, click on the delete icon.

You can see a graph of the ping latency by accessing Netdata from the report page.