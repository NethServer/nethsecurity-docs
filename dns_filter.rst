.. _dns_filter-section:

==========
DNS filter
==========

DNS filtering integrates with third-party DNS-based content filtering software, default supported content filter is the one provided from `Flashstart <https://www.flashstart.com>`_.

It basically links 2 components : filter configuration and network configuration.

1. Content filter configuration takes place entirely on the third-party platform, typically it is possible to block individual websites, as well as categories of sites (e.g. adult), manage exceptions, view reports and so on.

2. Network configuration is completely automated and is done on NethSecurity which takes care of:

* connect the firewall to the specific third party instance
* redirect all DNS requests to the external service
* automatically update IP addresses of all connectivities

.. note::

  Before configuring NethSecurity you need to create an account on Flashstart and configure the service.
  Flashstart is a payed service that allows you to use trial licenses.
  Please refer to the supplier's documentation `doc <https://cloud.flashstart.com/customerarea/support/docs>`_.

Once the account has been created and the service configured, NethSecurity can be configured.

Configuration
-------------

You can enable and disable the filter by changing the ``Status`` toggle.

Authentication
^^^^^^^^^^^^^^
Insert same username and password of your Flashstart account (tipically an email address), then click :guilabel:`Save` button.

Zones to filter
^^^^^^^^^^^^^^^
Choose zones to filter, only selected zones will be affected by DNS filter.

Bypass source IPs or networks
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
All listed IP addresses or networks here will not be affected by DNS filter.


.. note:: To preserve the effectiveness of the content filter it is suggested blocking alternative DNS protocols (DoT, DoH) via :ref:`dpi_filter-section`.

.. warning::

   Do not make changes to the DNS servers configured in your NethSecurity or in network clients.
   When content filtering is enabled, all DNS traffic from the clients will be automatically redirected to the external content filtering regardless of their configuration.

Block a specific web site
-------------------------

.. highlight:: bash

.. _block_website-section:

Access to specific internet sites can be also restricted by manipulating their DNS resolution.
Enabling ``AdBlock`` allows the interception and resolution of DNS queries from the lan client through the firewall DNS server.

To enable AdBlock, execute: ::

  uci set adblock.global.adb_enabled=1
  uci commit adblock
  /etc/init.d/adblock start

Navigate to the ``DNS & DHCP`` page under the ``Network`` section, select ``DNS records`` tab and click the ``Add DNS record`` button.
In the ``Hostname`` field, enter the hostname of the site you want to block, such as ``www.nethserver.org``, set the IP address to ``127.0.0.1`` and provide a descriptive name like “Block NethServer”.
Click the ``Save`` button and apply the changes.

.. note::  If you want to block an entire domain, enter the domain inside the Hostname filed like ``nethserver.org`` and enable the Wildcard DNS record: this will block also all nethserver.org subdomain.
