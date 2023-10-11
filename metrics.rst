=======
Metrics
=======

NethSecurity uses `netdata <https://www.netdata.cloud/>`_ as monitoring tool.
Netdata is an open-source, real-time, performance monitoring and troubleshooting tool for systems and applications.
It provides comprehensive insights into the performance and health of systems and applications through visualizations and detailed metrics.
Netdata is designed to be lightweight, fast, and easy to use.

The Netdata web user interface is accessible at the LAN IP address of the firewall on port ``19999``, with the HTTP protocol.
Address example: ``http://192.168.1.1:19999``

Netdata metrics are saved in RAM and will be reset at very machine reboot.
If the firewall is connected to the :ref:`remote controller <controller-section>`, metrics will be stored to the controller itself and preserved across reboots.
