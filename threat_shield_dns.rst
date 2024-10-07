.. _threat_shield_dns-section:

=================
Threat Shield DNS
=================

Threat Shield DNS uses Adblock which blocks any request to a domain considered malicious.
The service can load community-maintained blocklist or use Enterprise feeds provided by Nethesis and Yoroi.

While Threat Shield DNS is primarily configured from the command line, this chapter will guide you through its setup and usage.

Enable Threat Shield DNS
=========================

To enable Threat Shield DNS, use the following commands: ::

  echo '{"enabled": true, "zones": ["lan"]}' | /usr/libexec/rpcd/ns.threatshield call dns-edit-settings
  uci commit adblock && service adblock restart

This command enables Threat Shield DNS and applies it to the "lan" zone. 
After enabling, all DNS requests from the configured zones are redirected to the firewall itself (ports 53 and 853 TCP/UDP). 
Note that this port forwarding is not visible from the port forward page.

If you want to filter other zones, replace "lan" with the desired zone name.

.. note:: Please use Threat Shield DNS only if you are not already using the FlashStart service because if used together, they may conflict.

Manage blocklists
=================

By default, a machine has access to all community free categories, if the machine has a subscription and a valid entitlement for Enterprise lists, 
it will have automatically access to enterprise categories.

1. List available blocklists: ::

    /usr/libexec/rpcd/ns.threatshield call dns-list-blocklist | jq

2. Enable a specific blocklist (e.g., malware_lvl2): ::

     echo '{"blocklist": "malware_lvl2", "enabled": true}' | /usr/libexec/rpcd/ns.threatshield call dns-edit-blocklist | jq

3. Apply changes: ::

    uci commit adblock && service adblock restart

4. Check the status: ::

    /etc/init.d/adblock status

Bypass Threat Shield DNS
========================

Some hosts may need to bypass Threat Shield DNS filtering.
To bypass filtering for specific hosts, execute: ::

  echo '{"address": "192.168.1.22"}' | /usr/libexec/rpcd/ns.threatshield call dns-add-bypass

Replace ``192.168.1.22`` with the IP address of the host you want to bypass.

Apply changes: ::

    uci commit adblock && service adblock restart

.. note:: 
  
  To preserve the effectiveness of the content filter it is suggested blocking alternative DNS protocols (DoT, DoH) 
  via :ref:`dpi_filter-section` and by enabling the ``doh_vpn_tor_proxy`` blocklist.

.. _block_website-section:

Block certain websites
======================

To block specific domains, you can use the Threat Shield service.
Add the domains that you want to block to the blocklist: ::

  cat << EOF > /etc/adblock/adblock.blacklist
  domain1.com
  domain2.com
  domain3.net
  EOF

Changes made to the blocklist require a reload of the service: ::

  /etc/init.d/adblock reload

.. warning::

  The DNS resolution for the names listed in the blocklist will also affect the firewall itself


Advanced configuration
======================

When Threat Shield DNS is enabled:

- A new category source file is generated based on the machine registration and entitlement.
- All DNS queries are redirected to the local machine.
- Adblock is configured to use the new category source file and will be started automatically.

Even if not recommended, it's possible to use Adblock without Threat Shield DNS.
For more detailed configuration options, please refer to the `developer manual <https://dev.nethsecurity.org/packages/ns-threat_shield/#ts-dns>`_.
