.. _dns_over_http-section:

=============================
DNS over HTTPS with filtering
=============================

.. highlight:: bash

DNS over HTTPS (DoH) is a protocol for encrypting DNS queries over HTTPS, enhancing privacy by preventing eavesdropping on DNS traffic.
This feature allows you to configure upstream DNS servers that support the DoH protocol.
The ``https-dns-proxy`` package provides a local DNS-to-HTTPS proxy that forwards DNS queries to a remote DoH provider.

This document provides instructions for installing and configuring the DoH upstream servers that provide
filtering and are based in the EU, but you can use any DoH provider that suits your needs.

A list of DoH providers that support European locations and filtering are available on the
`European Alternatives <https://european-alternatives.eu/category/public-dns>`_ site.

Some popular alternatives include:

- `JoinDNS4 <https://joindns4.eu/>`_, european-based DNS service with protective resolution and ad blocking capabilities.
- `Quad9 <https://dns.quad9.net/dns-query>`_, privacy-focused with malware blocking
- `Mullvad <https://doh.mullvad.net/dns-query>`_, includes malware blocking, ad blocking and basic filtering (Porn, Gambling, etc.)
- `Cloudflare <https://developers.cloudflare.com/1.1.1.1/setup/>`_, fast and widely used DoH provider with malware blocking (1.1.1.1 for families)


Installation
============

The ``https-dns-proxy`` package is not included in default NethSecurity images, so you will need to install it manually: ::

  opkg update
  opkg install https-dns-proxy

Configuration
=============

By default, the package includes two providers (Cloudflare and Google).
To use a custom DoH provider, you'll need to:

1. Remove the default providers (optional)
2. Add your preferred DoH provider configuration
3. Commit and apply the configuration

Configuration steps
-------------------

In this example, we will configure the JoinDNS4 DoH provider.

1. Remove default providers (if you want to use only JoinDNS4): ::

     uci del https-dns-proxy.@https-dns-proxy[1]
     uci del https-dns-proxy.@https-dns-proxy[0]

2. Add the JoinDNS4 DoH provider: ::

     uci set https-dns-proxy.joindns4=https-dns-proxy
     uci set https-dns-proxy.joindns4.upstream_url='https://noads.joindns4.eu/dns-query'
     uci set https-dns-proxy.joindns4.listen_addr='127.0.0.1'
     uci set https-dns-proxy.joindns4.listen_port='5053'
     uci set https-dns-proxy.joindns4.enabled='1'
     uci commit https-dns-proxy  

3. Apply the configuration, https-dns-proxy will automatically use the local DoH proxy as upstream DNS: ::

     reload_config

Verification
============

To verify that the DoH proxy is working correctly, check the service status: ::

  /etc/init.d/https-dns-proxy status

You can also test DNS resolution: ::

  dig google.com @127.0.0.1 -p 5053

Troubleshooting
---------------

DNS forcing is a feature that forces all DNS queries to be sent to the local DoH proxy, 
it's enabled by default to ensure that all DNS traffic is encrypted, but it may cause issues with certain devices or applications.

If you encounter a "Private DNS server cannot be accessed" error on your Android device,
you can fix it by disabling DNS forcing in the ``https-dns-proxy`` configuration.

Run the following commands via SSH or terminal: ::

  uci set https-dns-proxy.config.force_dns='0'
  uci commit https-dns-proxy
  service https-dns-proxy restart
