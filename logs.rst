.. _logs-section:

====
Logs
====

Logs are initially written to a temporary in-memory directory to prevent potential errors on the root file system in case of a failure.

1. **Local Storage**: Logs can be written directly to storage. This can be configured from the UI, see the :ref:`storage-section`.

2. **Remote Controller**: Logs can be automatically forwarded to a :ref:`remote controller <controller_logs-section>`.

3. **Custom Syslog Forwarder**: Logs can be sent to a remote syslog server.

4. **Cloud Log Manager**: Logs can be forwarded to the Nethesis Cloud Log Manager (CLM) service.

The next paragraphs will explain how to configure these latter options.

Forwarding to a remote server
=============================

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
================================

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
     - Unique identifier for the device, generated with ``uuidgen`` and prefixed with "L" to ensure it starts with a letter
     - This is required for the CLM service to identify the source of the logs
     - Example: ``L3d50ca11-4415-4e46-9ee9-b1da0f62c337``
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

Log rotation size
=================

The ``/var/log/messages`` log file is stored in RAM. Once it reaches a predefined size limit, the log is rotated and compressed to conserve space. 
The rotated log is saved as ``/var/log/messages.1.gz`` in gzip format. The system retains only two versions of the log: the active log file and the latest rotated, compressed file. 
From version 1.4.0, by default, the log rotation threshold is set to 10% of the tmpfs filesystem mounted at ``/tmp``.

The ``ns-log-size`` script manages the log rotation size for the Rsyslog service. It allows to **get** and **set** the log rotation size defined in bytes for the log file located at ``/var/log/messages``. 

- **Get current size**: Retrieve the current log rotation size in bytes.
- **Set new size**: Change the log rotation size to a specified value, ensuring that the new size is a positive integer and not less than 52428800 bytes (50 MB).
- **Configuration safety**: If the specified size is below the minimum threshold, the script warns the user and does not make any changes to the configuration.

Usage
-----

To use the script, run it with the following syntax:

::

 ns-log-size {get|set <size>}

- **get**: Outputs the current log rotation size in bytes.
- **set <size>**: Sets the log rotation size to the specified value (in bytes).

Example
^^^^^^^

To get the current log rotation size:

::

 ns-log-size get

To set a new log rotation size to 104857600 bytes (100 MB):

::

 ns-log-size set 104857600

The service rsyslog is restarted automatically after the size is set.

All changes to the log rotation size are directly written in the Rsyslog configuration file ``/etc/rsyslog.conf``.
