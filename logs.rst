.. _logs-section:

====
Logs
====

Logs are used for troubleshooting, operational monitoring, incident analysis, and audit reconstruction.
Depending on the installation type and available services, logs can be **stored on persistent local storage** and/or **forwarded to external systems** for centralized collection, retention, and analysis, such as:

* remote syslog server
* NethSecurity Controller
* Nethesis Cloud Log Manager
  

For audit, troubleshooting, and long-term retention, persistent storage or remote log forwarding is recommended.

Log storage
===========

NethSecurity can store logs in different ways depending on the installation type and the available storage.

Physical appliances
-------------------

On NethSecurity physical appliances, persistent storage is configured automatically and used to store logs.
When persistent storage is available, logs are saved on disk and managed by log rotation. 

Virtual machines
----------------

On virtual machines, persistent storage must be configured explicitly.
For audit, troubleshooting, and long-term retention, it is recommended to attach and configure a dedicated virtual disk for logs. 

In-memory logs
--------------

If persistent storage is not configured, logs are written to a temporary in-memory directory. 
This prevents potential errors on the root file system in case of failure, but it is not suitable for long-term retention.
In-memory logs are useful for short-term troubleshooting only. For audit-oriented deployments, configure persistent storage or remote log forwarding.

OpenVPN connection history 
==========================

OpenVPN connection history is permanently saved on all systems equipped with persistent storage.
This allows administrators to review historical OpenVPN connection activity on systems with storage. 
OpenVPN connection logs can be useful to reconstruct VPN access history, support troubleshooting, and provide evidence during audit or incident analysis.


Forwarding to a remote server
=============================

NethSecurity can forward logs to a remote syslog server.
Remote log forwarding is recommended when logs must be centralized, retained for a longer period, protected from local deletion, or integrated with a SIEM or external monitoring system.

It is sufficient to configure the UCI database with the desired options, then commit the changes, and finally restart the service. 
Temporary logs will continue to be visible in ``/var/log/messages`` and will also be sent to the remote server. 

Most syslog servers are configured to listen on UDP port 514 by default.

Example configuration for sending logs to the syslog server with IP 192.168.1.88 on UDP port 514.
The configuration is named ``clm`` (custom log manager):

::

 uci set rsyslog.clm=forwarder
 uci set rsyslog.clm.source=*.* 
 uci set rsyslog.clm.protocol=udp
 uci set rsyslog.clm.port=514
 uci set rsyslog.clm.target=192.168.1.88

Once configured, simply commit the changes with the command: ::

 uci commit rsyslog

And finally, restart the service: ::

 /etc/init.d/rsyslog restart

By default the forwarder uses the TraditionalFileFormat (RFC 3164) for the logs.
It is possible also to configure RFC 5424 using the same syntax: ::

 uci set rsyslog.clm.rfc=5424

It is possible to configure multiple forwarders by repeating the operation using a different configuration name like ``clm2``.

Forwarding to Nethesis Cloud Log Manager
========================================

.. admonition:: Service entitlement required

   You need to purchase a subscription for the CLM service from Nethesis and obtain the tenant identifier.
   The service is currenlty reserved to Enterprise customers. For more information, please contact Nethesis sales.

The ``ns-clm`` package forwards syslog messages to the Nethesis Cloud Log Manager (CLM) service.
It provides the ``ns-clm-forwarder`` daemon, which tails ``/var/log/messages`` and tracks its read position in ``/var/run/ns-clm/last_offset``.
New syslog lines are parsed, batched, and sent as JSON via HTTP POST to the CLM endpoint.
The daemon polls for new lines every 10 seconds, detects log rotation automatically, and persists the offset on shutdown so it can resume after a restart.

The package is not included by default on NethSecurity 8.7.2 or earlier, but it is available in the package repository and can be
manually installed.
Install it with: ::

  opkg update
  opkg install ns-clm

The UCI configuration is stored in ``/etc/config/ns-clm``:

.. list-table::
   :header-rows: 1
   :widths: 20 30 50

   * - Option
     - Default
     - Description
   * - ``enabled``
     - ``0``
     - Enable (``1``) or disable (``0``) the forwarder
   * - ``uuid``
     - (empty)
     - Unique identifier for the device, generated with ``uuidgen`` and prefixed with "L" to ensure it starts with a letter.

       This is required for the CLM service to identify the source of the logs.

       Example: ``L3d50ca11-4415-4e46-9ee9-b1da0f62c337``
   * - ``address``
     - ``https://nar.nethesis.it``
     - CLM server address
   * - ``tenant``
     - (empty)
     - CLM tenant identifier, available inside the CLM portal, under ``Users and Companies`` -> ``Companies``
   * - ``debug``
     - ``0``
     - Enable debug output to stderr (``1``)

To enable the forwarder and set the tenant identifier, run: ::

 uci set ns-clm.config.uuid="L$(uuidgen)"
 uci set ns-clm.config.enabled=1
 uci set ns-clm.config.tenant=<tenant_id>
 uci commit ns-clm
 reload_config

You can find the tenant identifier in the CLM portal, under ``Users and Companies`` -> ``Companies``.

To also enable the service at boot: ::

 /etc/init.d/ns-clm enable && /etc/init.d/ns-clm start

To stop and disable the forwarder: ::

 /etc/init.d/ns-clm stop && /etc/init.d/ns-clm disable

.. _log-rotation-section:



Log rotation and retention
==========================

Logs are rotated to manage disk space and ensure that log files do not grow indefinitely.

Storage log rotation
--------------------

When using persistent storage, log rotation is managed by the ``logrotate`` utility, which is configured to rotate logs weekly and keep a maximum of 52 weeks (1 year) of logs.
After rotation, the logs are compressed using gzip and stored in the same directory with a naming convention that includes the date of rotation (e.g., ``/mnt/data/log/messages-20260315.gz``).


In-memory log rotation
----------------------

If a storage is not present the ``/var/log/messages`` log file is stored in RAM and it's rotated based on size.
Once it reaches a predefined size limit, the log is rotated and compressed to conserve space. 
The rotated log is saved as ``/var/log/messages.1.gz`` in gzip format. The system retains only two versions of the log: the active log file and the latest rotated, compressed file. 
From version 1.4.0, by default, the log rotation threshold is set to 10% of the tmpfs filesystem mounted at ``/tmp``.

The ``ns-log-size`` script manages the log rotation size for the Rsyslog service. It allows to **get** and **set** the log rotation size defined in bytes for the log file located at ``/var/log/messages``. 

- **Get current size**: Retrieve the current log rotation size in bytes.
- **Set new size**: Change the log rotation size to a specified value, ensuring that the new size is a positive integer and not less than 52428800 bytes (50 MB).
- **Configuration safety**: If the specified size is below the minimum threshold, the script warns the user and does not make any changes to the configuration.

Usage
^^^^^

To use the script, run it with the following syntax:

::

 ns-log-size {get|set <size>}

- **get**: Outputs the current log rotation size in bytes.
- **set <size>**: Sets the log rotation size to the specified value (in bytes).

Example
~~~~~~~

To get the current log rotation size:

::

 ns-log-size get

To set a new log rotation size to 104857600 bytes (100 MB):

::

 ns-log-size set 104857600

The service rsyslog is restarted automatically after the size is set.

All changes to the log rotation size are directly written in the Rsyslog configuration file ``/etc/rsyslog.conf``.

.. _storage-log-rotation-section:



Audit and compliance recommendations
====================================

For audit and compliance-oriented deployments, use persistent storage or remote log forwarding.

Recommended setup:

* on physical appliances, use the automatically configured storage;
* on virtual machines, configure a dedicated virtual disk for log storage;
* configure remote syslog forwarding, Controller forwarding, or Cloud Log Manager when centralized retention is required;
* verify that system time is synchronized with NTP;
* define a retention policy aligned with the organization security requirements;
* protect remote logs from unauthorized access or deletion;
* periodically verify that logs are correctly collected and forwarded;
* periodically review administrative access, configuration changes, VPN access, and relevant security events.

Local persistent storage provides useful historical information, but for stronger audit requirements it is recommended to forward logs to an external system such as a syslog server, SIEM, Controller, or Cloud Log Manager.

Related information
-------------------

Administrative actions performed through the NethSecurity UI are logged in `/var/log/messages`.
For details about administrative users, administrative audit logs, and how to reconstruct administrator activity, see the Administrative users section :ref:`administrative_users-section`.



