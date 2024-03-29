.. _threat_shield-section:

=============
Threat shield
=============

NethSecurity is equipped with various tools and integrations useful for countering threats coming from the internet.
One of these tools is Threat Shield, which blocks any traffic coming from compromised IP addresses or destined to them as well as any requests addressed to hostnames that could be malicious.

The service can load community-maintained blocklists or can rely on high-quality blocklists very frequently updated and maintained by `Nethesis <https://www.nethesis.it>`_ and `Yoroy <https://yoroi.company>`_
a leading company focused on CyberSecurity and member of `Cyber Threat Alliance <https://www.cyberthreatalliance.org>`_.
Yoroi blacklists ensure great effectiveness and high confidence, minimizing the possibility of false positives.

Please note that to access the Nethesis and Yoroi blocklist, the machine must have a valid extra entitlement for this service.

IP based Threat shield
=======================

The service is disabled by default, to enable it navigate to the ``Threat shield`` page under the ``Security`` section.
Access the ``Settings`` tab and activate the ``Status`` switch.

When the service is enabled, the ``Blocklist`` tab will display all available blocklists.
You can enable or disable each blocklist by using the switch on the right side of the list.
Enabled blocklist will be automatically updated at regular intervals.

Yoroi and Nethesis blocklists will be listed only if the machine has a valid Enterprise :ref:`subscription <subscription-section>` and a valid entitlement for the Threat Shield service.

Allow list
----------

Sometimes it may be necessary to allow access to certain IP addresses, to do this you can use the ``Allowlist`` tab.
Use the :guilabel:`Add address` button to add a new address to the list.
The address can be a valid IPv4/IPv6 address with optional CIDR notation, a MAC address, or a fully qualified hostname (FQDN).

For example, the address can be:

- IPv4 address: 192.168.0.1
- IPv6 address: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
- IPv4 address with CIDR notation: 192.168.0.0/24
- MAC address: 00:0a:95:9d:68:16
- Fully qualified hostname: example.com

A comment can be associated with each address to facilitate management.

You can add a comment to provide additional information about the address, such as its purpose or owner.
This can help in organizing and managing the allowlist effectively.

DNS based Threat shield
=======================

The DNS filter uses AdBlock which blocks any request to a domain that is considered malicious.
The service can load community-maintained blocklist or use Yoroi feeds.

AdBlock can be configured from the command line interface as explained in the `developer manual <https://dev.nethsecurity.org/packages/ns-threat_shield/#ts-dns>`_.
