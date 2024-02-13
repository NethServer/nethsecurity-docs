.. _snmp-server-configuration:

SNMP Server
===========

Simple Network Management Protocol (SNMP) provides a standardized way to monitor and manage network devices like your firewall remotely.
It allows authorized users to retrieve essential information like device status, performance metrics, and configuration settings.

The SNMP server is **enabled by default** on your firewall, allowing access from within your local area network (LAN) on all IPv4 and IPv6 addresses.

Configuring the SNMP Server
---------------------------

It's crucial to configure essential information that identifies your device. Here's how to do it through the command line:

1. Open a terminal window on your firewall.
2. Use the following commands to set the desired values for `sysLocation`, `sysContact`, and `sysName`:

.. code-block:: bash

    uci set snmpd.@system[0].sysLocation='<string>'
    uci set snmpd.@system[0].sysContact='<string>'
    uci set snmpd.@system[0].sysName='<string>'

Replace `<string>` with the relevant information. For example:

.. code-block:: bash
    
    uci set snmpd.@system[0].sysLocation='MyOffice'
    uci set snmpd.@system[0].sysContact='admin@nethsecurity.org'
    uci set snmpd.@system[0].sysName='firewall.nethsecurity.org'

3. After making changes, apply them using:

.. code-block:: bash

    uci commit snmpd

4. Restart the SNMP server to ensure the configurations take effect:

.. code-block:: bash

    /etc/init.d/snmpd restart

The SNMP server configuration is stored in the `/etc/config/snmpd` file.

You can test the configuration by using an SNMP client like `snmpwalk` or `snmpget` from a remote machine. For example: ::

    snmpwalk -v 2c -c public 127.0.0.1

Disabling the SNMP Server
-------------------------

If you don't require remote access to the SNMP server, you can disable it for additional security. Follow these steps:

1. Open a terminal window on your firewall.
2. Use the following commands to disable the server:

.. code-block:: bash

    uci set snmpd.general.enabled=0
    uci commit snmpd
    /etc/init.d/snmpd stop

**Remember:** Disabling the SNMP server might impact monitoring tools or applications relying on it.

Enabling remote access
----------------------

If you need to access the SNMP server from outside your LAN, create a firewall rule that allows incoming UDP traffic on port ``161`` to the firewall itself.
Remember, opening this port increases risk, so proceed with caution and make sure to restict the access only from selected IP addresses.


Security considerations
-----------------------

Prioritize security before enabling remote access:

- **Strong Community String:** Replace the default "public" community string with a complex and unique one.
- **Access Control:** Implement Access Control Lists (ACLs) to restrict access to authorized IP addresses only.
