.. _logs-section:

====
Logs
====

As default, logs are written in a volatile in-memory directory to prevent errors on the root file system in case of failure. 
NethSecurity allows you to permanently save logs in other ways, such as writing them directly to storage (this can be done directly from the UI, see the :ref:`Storage section <storage-section>`) or by sending them to a remote syslog server. 
The next paragraph will explain how to configure this latter option.

How to configure log forwarding to a remote server
------------------------------------------------

It is sufficient to configure the UCI database with the desired options, then commit the changes, and finally restart the service. 
Temporary logs will continue to be visible in ``/var/log/messages`` and will also be sent to the remote server. 

Example configuration for sending logs to the syslog server (reference clm) with IP 192.168.1.88 on UDP port 514 (the default for many syslog servers).

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

It is possible to configure multiple forwarders by repeating the operation using a different reference.
