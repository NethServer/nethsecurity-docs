.. _dns_over_http-section:

=============================
DNS over HTTPS with filtering
=============================

.. highlight:: bash

DNS over HTTPS (DoH) is a protocol for encrypting DNS queries over HTTPS, enhancing privacy by preventing eavesdropping on DNS traffic.
This feature allows you to configure upstream DNS servers that support the DoH protocol.
The ``https-dns-proxy`` package provides a local DNS-to-HTTPS proxy that forwards DNS queries to a remote DoH provider.

This document provides instructions for configuring DoH upstream servers that
provide filtering and are based in the EU, but you can use any DoH provider
that suits your needs.
This configuration only applies to the upstream servers of the firewall: clients will continue to send DNS requests to the firewall in plaintext on port 53.

A list of DoH providers that support European locations and filtering are available on the
`European Alternatives <https://european-alternatives.eu/category/public-dns>`_ site.

Some popular alternatives include:

- `DNS4EU <https://joindns4.eu/>`_, european-based DNS service with protective resolution and ad blocking capabilities
- `Quad9 <https://dns.quad9.net/dns-query>`_, privacy-focused with malware blocking
- `Mullvad <https://doh.mullvad.net/dns-query>`_, includes malware blocking, ad blocking and basic filtering (Porn, Gambling, etc.)
- `Cloudflare <https://developers.cloudflare.com/1.1.1.1/setup/>`_, fast and widely used DoH provider with malware blocking (1.1.1.1 for families)


Installation
============

Since NethSecurity 8.8, the ``https-dns-proxy`` package is included in NethSecurity image, so no
separate installation step is required.

On NethSecurity 7.7, the package is not included in default NethSecurity image, so you will need to install it manually: ::

  opkg update
  opkg install https-dns-proxy

Configuration
=============

By default, the package includes two providers (Cloudflare and Google), listens
on ``127.0.0.1:5053`` and ``127.0.0.1:5054``, and keeps
``dnsmasq_config_update`` set to ``-`` so it does not modify the firewall DNS
configuration automatically.

To start using the proxy, you need to:

1. Remove the default providers (optional)
2. Add your preferred DoH provider configuration
3. Choose the ``dnsmasq_config_update`` value to use
4. Commit the configuration and enable the service

Configuration steps
-------------------

In this example, we will configure the DNS4EU (joindns4.eu) DoH provider.

1. Remove default providers (if you want to use only DNS4EU): ::

     uci del https-dns-proxy.@https-dns-proxy[1]
     uci del https-dns-proxy.@https-dns-proxy[0]

2. Add the DNS4EU DoH provider: ::

     uci set https-dns-proxy.joindns4=https-dns-proxy
     uci set https-dns-proxy.joindns4.resolver_url='https://noads.joindns4.eu/dns-query'
     uci set https-dns-proxy.joindns4.bootstrap_dns='86.54.11.13,86.54.11.213,2a13:1001::86:54:11:13,2a13:1001::86:54:11:213'
     uci set https-dns-proxy.joindns4.listen_addr='127.0.0.1'
     uci set https-dns-proxy.joindns4.listen_port='5053'
     uci commit https-dns-proxy  


The ``bootstrap_dns`` parameter is optional, if not provided, the system will use Google and Cloudflare DNS for bootstrap.

3. Enable integration with ``dnsmasq`` and start the service: ::

     uci set https-dns-proxy.config.dnsmasq_config_update='*'
     uci commit https-dns-proxy
     /etc/init.d/https-dns-proxy enable
     /etc/init.d/https-dns-proxy start

   The value ``*`` updates all ``dnsmasq`` instances. If you need a more
   specific integration, set ``dnsmasq_config_update`` to the instance name or
   index you want to manage.

Verification
^^^^^^^^^^^^

To verify that the DoH proxy is working correctly, check the service status: ::

  /etc/init.d/https-dns-proxy status

You can also test DNS resolution: ::

  dig google.com @127.0.0.1 -p 5053

Troubleshooting
===============

DNS redirection
----------------

By default, all DNS queries to any server are forced through the local DoH proxy to ensure that all DNS traffic is encrypted, but this may cause issues with certain devices or applications.

If you encounter a "Private DNS server cannot be accessed" error on your Android device,
you can fix it by disabling DNS forcing in the ``https-dns-proxy`` configuration.

Run the following commands via SSH or terminal: ::

  uci set https-dns-proxy.config.force_dns='0'
  uci commit https-dns-proxy
  service https-dns-proxy restart

Image update
------------

The package is included in the image, so it does not need to be reinstalled
after an upgrade.

However, NethSecurity treats ``dnsmasq_config_update='-'`` as the disabled
state. If that value is still set during an image upgrade, the first-boot
defaults script can disable ``https-dns-proxy`` again.


Blocking other DoH providers
----------------------------

To block DoH requests from clients to any other server while allowing requests originating from the firewall, you have 2 options:

1. Enable the "public DoH-Providers" category inside Threat Shield IP and whitelist the upstream server you choose as your DoH provider
2. Use DPI (Deep Packet Inspection) to block DoH, which operates only on forwarded traffic, allowing the firewall to use DoH while blocking clients from using it directly
