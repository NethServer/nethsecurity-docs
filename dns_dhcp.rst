.. _dns_dhcp-section:

==========
DNS & DHCP
==========

.. highlight:: bash

NethSecurity can provide DNS and DHCP services to every local network.
This section is divided in 5 tabs:

* DHCP and MAC binding
* Static leases
* Dynamic leases
* DNS
* DNS records

DHCP and MAC binding
====================

This section allows you to enable and manage a DHCP server for every local network configured in your NethSecurity.
Every local interface is provided with a card where you can enable the service clicking on button :guilabel:`Edit`.

Available fields:

* ``Mac binding``:

  * ``Status``: enable/disable the MAC-IP binding feature for this interface
  * ``Type``: it's possible to choose between two types of MAC-IP binding:

    * ``Soft binding``: allows hosts without a reservation, blocks mismatched IP/MAC

      **Example**: An office network where employees frequently bring their own devices (BYOD). In this case Soft binding
      allows devices without a reservation to access the network, but ensures that any device with a mismatched IP/MAC
      address is blocked. This provides flexibility for employees while maintaining a level of security.

    * ``Hard binding``: Only hosts with a reservation allowed, others are blocked

      **Example**: A corporate network with strict security policies. Here hard binding ensures that only devices with
      a pre-configured reservation can access the network. This prevents that employees steal an IP with higher
      authorizations.

* ``DHCP``:

  * ``Enable DHCP`` : enable/disable the service
  * ``Range IP start`` : first IP address of DHCP range
  * ``Range IP end`` : last IP address of DHCP range
  * ``Lease time`` :  lease time (default 1 hour)

**DHCP Advanced settings**

``Force DHCP server start`` 

Upon startup, the DHCP server checks if there are other DHCP servers on the network. 
With this option disabled, the DHCP server won't be activated if another one is detected on the network.
If the force option is enabled, the DHCP server will be started even if there are other DHCP servers within the network.

``DHCP option`` 

It is possible to declare very specific DHCP options, searching for the field to configure (e.g. DNS passed to clients, tftp IP address and so on) and then specifying the value.
The value can be also a list of values separated by a comma.

Example to override the DNS passed to clients with 2 servers:

- selected option: ``dns-server``
- value: ``1.1.1.1,8.8.8.8``

See also :ref:`dns_dhcp_custom-section` for more information on non-standard options.


.. _static_leases-section:

Static Leases
-------------

Static leases assigns stable IP addresses and symbolic hostnames to DHCP clients. The host is identified by its MAC address, assigned a fixed IP address, and provided with a symbolic hostname for easy recognition.

Click the button :guilabel:`Add reservation` to add a new device's reservation.


Available fields:

* ``Hostname`` : Hostname associated to the IP address
* ``IP address`` : IP address to assign to the specified MAC Address.The IP address must be within the DHCP range
* ``MAC address`` : MAC address of the device where you want to make the reservation
* ``Reservation name`` : Optional, freely configurable filed

Dynamic leases
--------------

Dynamic leases represents IP addresses that are currently in use and have been allocated to devices on the network.
This tab shows all currently active leases.

Default Configuration
---------------------

By default, the DHCP server has a limit of 1000 concurrent leases to prevent DoS attacks. Set the dnsmasq ``dhcpleasemax`` option to change the limit.

Execute these commands: ::

  uci set dhcp.@dnsmasq[0].dhcpleasemax='2500'
  uci commit dhcp
  reload_config

.. _dns_dhcp_custom-section:

Non-standard custom options
---------------------------

In addition to the standard DHCP options, NethSecurity allows you to configure non-standard custom options,
such as option 82 (DHCP Relay Agent Information). These options can be useful for advanced configurations or specific network requirements.

To set a custom option from the command line, use the following commands:

.. code-block:: bash

  uci add_list dhcp.lan.dhcp_option='82,myvalue'
  uci commit dhcp
  reload_config

Custom options configured via the command line are preserved even when changes are made through the UI.
Custom options can be safely removed from the UI.

However, users should avoid modifying these custom options directly from the UI to prevent unexpected behavior.

DNS
===

The system employs `Dnsmasq <https://thekelleys.org.uk/dnsmasq/doc.html>`_ a as a downstream caching DNS server. Dnsmasq functions as a local
caching nameserver, which by default forwards DNS queries to the upstream DNS servers provided by the DHCP server of the WAN interfaces.
However, this behavior can be customized using the following configuration options:

* ``DNS forwarding servers``: Click the button :guilabel:`Add DNS Server` to specify the desired upstream DNS, you can add more servers, each one is individually managed.
* ``DNS Domain`` : Insert the the local DNS domain, ensuring that queries for this domain are always resolved locally.
* ``Log DNS queries``: enable it if you want all the DNS queries to be logged by the system.

Forwarding servers
------------------

You only need to configure forwarders if your WAN interfaces are set up with static IP addresses.
If your WAN interfaces are configured via DHCP, typically provided by your ISP, the system will automatically use the
DNS servers supplied by the WAN interfaces.
Automatically configured upstream DNS servers can be found in the `/tmp/resolv.conf.d/resolv.conf.auto` file.

You can configure the following:

- **Specify a single upstream DNS server:** enter the IP address of the desired DNS server in the designated field.
- **Set up domain-specific DNS servers:** this allows you to route queries for specific domains to different servers.

Domain-specific DNS servers
^^^^^^^^^^^^^^^^^^^^^^^^^^^

To use a custom DNS server for a specific domain, use the following syntax:

``/DOMAIN/IP_ADDRESS#PORT``

where:

- IP_ADDRESS: specify the IP address of the desired server
- PORT: append the desired port (after the IP address using `#` character).

The ``PORT`` value is optional so usually the configuration appears just like:

``/DOMAIN/IP_ADDRESS``

These are the main supported options:

- Empty domain (``//``): matches unqualified names (without dots).
- Specific domain (``/google.com/``): matches the exact domain and all its subdomains (e.g., google.com, www.google.com, drive.google.com...).
- Wildcard domain (``*google.com/``): matches any domain **containing** "google.com" (e.g., google.com, www.google.com, supergoogle.com).

Examples:

- Send all queries for "google.com" and its subdomains to 1.2.3.4:  ``/google.com/1.2.3.4``
- Send all unqualified names (e.g., "localhost") to 10.0.0.1 and everything else to standard servers: ``//10.0.0.1``
- Send queries for domain "ad.nethserver.org" and its subdomains to 192.168.1.1 and everything else to standard servers:
  ``/ad.nethserver.org/192.168.1.1``


More specific domains take precedence over less specific domains, so for a configuration like this:

- ``/google.com/1.2.3.4``
- ``/www.google.com/2.3.4.5``

NethSecurity will send queries for google.com and gmail.google.com to 1.2.3.4, but www.google.com will go to 2.3.4.5

This is true also for wildcards: if both specific and wildcard domains are defined for the same pattern, the specific one takes precedence (e.g., having ``/google.com/`` and ``/*google.com/`` : the first will handle google.com and www.google.com, the wildcard will handle supergoogle.com.

.. _dns_records-section:

DNS records
-----------

The system can handle local DNS records. When the server performs a DNS lookup, first it will search inside local DNS records. If no local record is found, an external DNS query will be done.

.. note:: Local DNS records will always override records from external DNS servers.

Click the button :guilabel:`Add DNS record` to add a new DNS hostname.

Available fields:

- ``Hostname`` : DNS hostname
- ``IP address`` : IP address associated to hostname
- ``Name`` : optional field
- ``Wildcard DNS record``: enable it if you want this answer for any subdomain you haven't already defined

DNS Rebind Protection
---------------------

DNS Rebind Protection is a security feature that safeguards against DNS rebinding attacks. It blocks the use of private IP ranges by public domains, preventing malicious websites from manipulating browsers to make unauthorized requests to local network devices.

DNS Rebind Protection is enabled by default on NethSecurity and usually does not have operational repercussions. 
In the presence of split DNS, resolving public domains with internal resources, rebind protection may lead to resolution issues.
In such scenarios, potential problems can be found in the log (``/var/log/messages``), where lines similar to these may appear:

.. code-block:: text

   Sep 21 13:09:36 fw1 dnsmasq[1]: possible DNS-rebind attack detected: ad.nethesis.it

.. note:: To ensure maximum compatibility and prevent malfunctions in migrated installations using the dedicated tool from NethServer 7.9, DNS Rebind Protection is disabled, ensuring the same behavior as the previous version.

How to fix DNS rebind protection issues
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can easily fix any of these issues from the CLI.

**Solution 1**: Whitelist the domain

Put the specific domain in a whitelist (suggested): ::

  uci add_list dhcp.@dnsmasq[0].rebind_domain="nethesis.it"

then commit and restart: ::

  uci commit dhcp
  /etc/init.d/dnsmasq restart

**Solution 2**: disable the DNS protection 

Completely disable DNS rebind protection using these commands: ::

 uci set dhcp.@dnsmasq[0].rebind_protection='0'
 uci commit dhcp
 /etc/init.d/dnsmasq restart

How to enable DNS rebind protection
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you have previously disabled rebind protection or if your configuration comes from a migration and you wish to enable rebind protection, it is recommended to also activate the ``rebind_localhost`` parameter.
This setting takes effect exclusively when rebind protection is enabled and permits upstream responses from 127.0.0.0/8, essential for DNS-based blacklist services.
Execute these commands: ::

 uci set dhcp.@dnsmasq[0].rebind_protection='1'
 uci set dhcp.@dnsmasq[0].rebind_localhost='1'
 uci commit dhcp
 /etc/init.d/dnsmasq restart
