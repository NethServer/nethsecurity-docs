.. _logs-section:

====
Logs
====

Logs are initially written to a temporary in-memory directory to prevent potential errors on the root file system in case of a failure.

1. **Local Storage**: Logs can be written directly to storage. This can be configured from the UI, see the :ref:`storage-section`.

2. **Remote Controller**: Logs can be automatically forwarded to a :ref:`remote controller <controller_logs-section>`.

3. **Custom Syslog Forwarder**: Logs can be sent to a remote syslog server.

The next paragraph will explain how to configure this latter option.

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
