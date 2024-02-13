.. _ddns-section:

Dynamic DNS
===========

Dynamic DNS (DDNS) automatically updates your domain name's DNS record with your current IP address, even if it changes dynamically.
This allows you to access your firewall remotely using a consistent domain name instead of remembering a potentially changing IP address.

Supported Providers
-------------------

NethSecurity supports the following DDNS providers:

- `Cloudflare <https://www.cloudflare.com>`_
- `DigitalOcean <https://www.digitalocean.com>`_
- `DNSpod <https://www.dnspod.com>`_
- `Freedns <https://freedns.afraid.org>`_
- `Gandi <https://www.gandi.net>`_
- `GCP (Google Cloud Platform) <https://cloud.google.com>`_
- `GoDaddy <https://www.godaddy.com>`_
- `Luadns <https://luadns.com>`_
- `No-IP <https://www.noip.com>`_
- `NS1 <https://ns1.com>`_
- `One.com <https://www.one.com>`_
- `Pdns <https://www.powerdns.com>`_
- `Route53 <https://aws.amazon.com/route53>`_
- `TransIP <https://www.transip.nl>`_

Prerequisites:

- A NethSecurity firewall with internet access.
- An account with your chosen DDNS provider.
- A registered domain name with your DDNS provider.

General configuration steps
---------------------------

1. Open a terminal window on your firewall.
2. Select your chosen DDNS provider from the list of supported providers. To obtain the list of supported providers, run the following command: ::

    ddns service update
    ddns service list-available

3. Enter your DDNS configuration details, including your provider credentials in the designated fields. These may include:

   - The DDNS provider's service name, from the above list: use the ``service_name`` field.
   - Username or client ID: use the ``username`` field.
   - Password or API key: use the ``password`` field.
   - Domain name to be associated with your dynamic IP address: use the ``domain`` field, you can also use the ``lookup_host`` field.
   - Interface to monitor for IP address changes (e.g., "wan"): use the ``interface`` field.

While the general steps remain consistent, specific configuration details may vary slightly depending on your chosen provider.
It's recommended to consult your provider's documentation for detailed instructions and any additional settings required.

Due to the variety of supported providers, including their unique interfaces and authentication methods,
it's not possible to provide specific configuration steps for each provider within this guide.

If your provider is not listed, you may still be able to configure it using a :ref:`custom configuration <custom-ddns-section>`.

Using the UCI command line
--------------------------

Use uci commands to set and commit configuration options: ::

  uci set ddns.myddns.service_name="ddnsprovider.com"
  uci set ddns.myddns.domain="host.yourdomain.net"
  uci set ddns.myddns.username="your_user_name"
  uci set ddns.myddns.password="p@ssw0rd"
  uci set ddns.myddns.interface="wan"
  uci set ddns.myddns.enabled="1"
  uci commit ddns

Remember to replace placeholders with your values.

Then, restart the DDNS service: ::

  /etc/init.d/ddns restart

See the `UCI documentation <https://openwrt.org/docs/guide-user/base-system/ddns>`_ for a full list of supported settings.

Additional notes:

- Ensure your chosen DDNS provider plan supports API access and dynamic updates.
- Double-check all entered credentials for accuracy to avoid update failures.
- Consider enabling logging for the DDNS service to monitor updates and troubleshoot any issues.
- Some providers may offer advanced features like wildcards and subdomain updates. Explore these options based on your specific needs.

Example: afraid.org (FreeDNS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Configure a domain with FreeDNS (afraid.org) using the UCI command line.
The domain is named "sanchio.crabdance.com" and the username and password are "myuser" and "mypass", respectively. ::

  uci set ddns.afraid=service
  uci set ddns.afraid.service_name='afraid.org-v2-basic'
  uci set ddns.afraid.lookup_host='sanchio.crabdance.com'
  uci set ddns.afraid.enabled='1'
  uci set ddns.afraid.use_ipv6='0'
  uci set ddns.afraid.domain='sanchio.crabdance.com'
  uci set ddns.afraid.username='myuser'
  uci set ddns.afraid.password='mypass'
  uci set ddns.afraid.ip_source='network'
  uci set ddns.afraid.ip_network='wan'
  uci set ddns.afraid.interface='wan'
  uci set ddns.afraid.use_syslog='1'
  uci set ddns.afraid.check_unit='minutes'
  uci set ddns.afraid.force_unit='minutes'
  uci set ddns.afraid.retry_unit='seconds'
  uci commit ddns
  /etc/init.d/ddns restart

.. _custom-ddns-section:

Custom example: dyndns.it (DynDNS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can also configure some custom DDNS providers using the UCI command line.
Configure a domain with DynDNS using the UCI command line.
The domain is named "nstest1.freeddns.it" and the username and password are "nstest1" and "nstest", respectively. ::

  uci set ddns.dyndns_it=service
  uci set ddns.dyndns_it.enabled='1'
  uci set ddns.dyndns_it.lookup_host='nstest1.freeddns.it'
  uci set ddns.dyndns_it.domain='nstest1.freeddns.it'
  uci set ddns.dyndns_it.username='nstest1'
  uci set ddns.dyndns_it.password='nstest'
  uci set ddns.dyndns_it.interface='wan'
  uci set ddns.dyndns_it.ip_source='network'
  uci set ddns.dyndns_it.ip_network='wan'
  uci set ddns.dyndns_it.force_interval='24'
  uci set ddns.dyndns_it.force_unit='hours'
  uci set ddns.dyndns_it.check_interval='10'
  uci set ddns.dyndns_it.check_unit='minutes'
  uci set ddns.dyndns_it.update_url='http://update.dyndns.it/nic/update?hostname=[DOMAIN]&user=[USERNAME]&password=[PASSWORD]'
  uci commit ddns
  /etc/init.d/ddns restart

Using Luci
----------

The :ref:`Luci <luci-section>` web interface offers a simplified way to configure DDNS on NethSecurity.
Refer to the `official documentation <https://openwrt.org/docs/guide-user/services/ddns/client#web_interface_instructions>`_ for detailed instructions on using Luci to configure DDNS.