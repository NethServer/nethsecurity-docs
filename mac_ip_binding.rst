.. _mac_ip_binding-section:

==============
MAC-IP Binding
==============

MAC-IP binding is a security feature that allows the firewall to enforce strict control over which devices can communicate on the network.
By associating a specific IP address with a specific MAC address, the firewall can ensure that only known devices are allowed to send and receive traffic.
This helps to prevent unauthorized devices from accessing the network and can be particularly useful in environments where security is a high priority.

The firewall can use the list of DHCP reservations to strictly check all traffic generated from hosts inside local networks.
DHCP server could be disabled but the administrator must still create reservations to associate the IP with a MAC address. See :ref:`static_leases-section` for more details.


Enable MAC-IP binding
=====================

Once configured a DHCP server through the UI, you can create bindings for the interface by setting a `ns_binding` option
in the DHCP server configuration. The IP/MAC bindings will be created based on the static leases defined in the
configuration.

For instance, if the DHCP server is named ``lan``, to add the necessary rules for the interface you must:

::

 uci set dhcp.lan.ns_binding='1'
 uci commit dhcp
 reload_config

This will create the necessary rules to enable `soft` binding mode for the `lan` interface.
From now on, the IP/MAC bindings will be automatically generated and updated whenever the dhcp configuration is changed.

Binding mode
============

When IP/MAC binding is enabled, the administrator will choose what policy will be applied to hosts without a DHCP reservation.
There are two modes: 

- The `soft` mode will allow hosts without a reservation to access the firewall and the external network, but it will block the traffic if the IP/MAC in the static leases mismatch.
- The `hard` mode will block all traffic from hosts without a reservation, please note that DHCP traffic will be allowed to reach the server.
  In this case, hosts without a reservation will not be able to access the firewall nor the external network.

.. note::

  When using the `hard` mode, remember to create at least one DHCP reservation before enabling the IP/MAC binding mode, otherwise,
  no hosts will be able to manage the server using the web interface or SSH.


The `ns_binding` option can take the following values:

.. list-table::
   :header-rows: 1

   * - Binding value
     - Description
   * - `0`
     - Disables the binding
   * - `1`
     - Enables the soft binding, enforces the block only if the IP/MAC in the static leases mismatch
   * - `2`
     - Enables the hard binding, enforces block if the client is not registered in the static leases


Disable MAC-IP binding
======================

To disable the binding, you can either remove the ``ns_binding`` option or set it to ``0``:

::

 uci set dhcp.lan.ns_binding='0' # or uci delete dhcp.lan.ns_binding
 uci commit dhcp
 reload_config
