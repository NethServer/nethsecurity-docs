.. _checkmk-section:

Checkmk
=======

Checkmk is a monitoring platform used to supervise servers, network devices, and appliances.
The firewall can be monitored with `Checkmk <https://checkmk.com/>`_ by installing the NethSecurity extra packages described in this chapter.

NethSecurity packages
---------------------

The Checkmk integration for NethSecurity is split into two packages:

* ``checkmk-agent`` is the standard Checkmk agent package.
* ``ns-checkmk-utils`` adds NethSecurity-specific monitoring scripts and is optional.

Installing ``ns-checkmk-utils`` also pulls in ``checkmk-agent`` as a dependency.
If you only need the upstream agent, install ``checkmk-agent`` alone.

Install the packages
--------------------

Install the agent and the optional NethSecurity checks from the command line::

    opkg update
    opkg install ns-checkmk-utils

After installation, the agent service is managed by ``/etc/init.d/check_mk_agent`` and it's started and
enabled on boot by default.

Use the following command to check the status::

    /etc/init.d/check_mk_agent status

Verify the output locally with::

    check_mk_agent

Allow remote monitoring
-----------------------

The agent listens on TCP port ``6556``.
By default, traffic from the LAN is allowed, but if you have a more restrictive firewall configuration, you may need
to allow access to this port from the Checkmk monitoring server.

You can add a firewall rule to allow access directly from web user interface, see :ref:`firewall_rules-section`, or use the command line interface to add a rule.

For example, to allow access from a monitoring host in the LAN::

    uci add firewall rule
    uci set firewall.@rule[-1].name='Allow-Checkmk'
    uci set firewall.@rule[-1].src='lan'
    uci set firewall.@rule[-1].proto='tcp'
    uci set firewall.@rule[-1].dest_port='6556'
    uci set firewall.@rule[-1].target='ACCEPT'
    uci commit firewall
    /etc/init.d/firewall restart

Bear in mind that if the monitoring server is located in a different zone, you will need to adjust the source zone and address accordingly.

When the rule is in place, the monitoring server can connect to the firewall and read the agent output, including the optional NethSecurity checks.
