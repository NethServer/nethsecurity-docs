.. _threat_shield_ip-section:

================
Threat shield IP
================

NethSecurity is equipped with various tools and integrations useful for countering threats coming from the internet.
One of these tools is Threat Shield, which blocks any traffic coming from compromised IP addresses or destined to them as well as any requests addressed to hostnames that could be malicious.

The service can load community-maintained blocklists or can rely on high-quality blocklists very frequently updated and maintained by `Nethesis <https://www.nethesis.it>`_ and `Yoroy <https://yoroi.company>`_
a leading company focused on CyberSecurity and member of `Cyber Threat Alliance <https://www.cyberthreatalliance.org>`_.
Yoroi blacklists ensure great effectiveness and high confidence, minimizing the possibility of false positives.

Please note that to access the Nethesis and Yoroi blocklist, the machine must have a valid extra entitlement for this service.

Configuration
=============

The service is disabled by default, to enable it navigate to the ``Threat shield`` page under the ``Security`` section.
Access the ``Settings`` tab and activate the ``Status`` switch.

When the service is enabled, the ``Blocklist`` tab will display all available blocklists.
You can enable or disable each blocklist by using the switch on the right side of the list.
Enabled blocklist will be automatically updated at regular intervals.
NethSecurity 8 allows the use of Community and Enterprise blocklists.

Community Blocklists
--------------------

Community blocklists are sourced from community contributors and cover various areas: Ads blocking, Malware blocking, Spam blocking, 
Tracker blocking, and so on. 
NethSecurity makes them available as they are.
The type of usage license may vary depending on the provider, so if the use is not personal, you may need to inquire with the provider.

.. rubric:: Community lists maintenance

Each blocklist is maintained by its specific provider. NethSecurity already includes the URLs for downloading the feeds, 
which are valid at the time of the release. However, because these URLs are hard-coded, if the provider changes them, some blocklists may no longer 
be downloadable.

Enterprise blocklists
---------------------

.. admonition:: Enterprise subscription required

   This feature is available only if the firewall has a valid enterprise subscription.

Enterprise blocklists are specifically focused on security and offer several advantages over community-maintained blocklists:

1. **Quality and Accuracy**: Enterprise blocklists, such as the ones provided by Nethesis and Yoroi, are curated and maintained by reputable cybersecurity companies.
   These companies have dedicated teams that continuously monitor and update the blocklists to ensure they are accurate and effective in blocking malicious traffic.
   This results in a higher level of quality and accuracy compared to community-maintained blocklists, which may not receive the same level of attention and updates.

2. **Timeliness**: Enterprise blocklists are frequently updated to include the latest threats and malicious IP addresses. 
   Cybersecurity companies like Nethesis and Yoroi actively track emerging threats and promptly add them to their blocklists. 
   This ensures that your system is protected against the most recent and evolving threats. 
   
3. **Reduced False Positives**: False positives occur when legitimate traffic is mistakenly blocked. 
   Enterprise blocklists are designed to minimize false positives by carefully curating and verifying the listed IP addresses and hostnames.
   The companies behind Enterprise blocklists have robust processes in place to ensure that only malicious entities are included in the blocklists.
   This reduces the chances of legitimate traffic being blocked, minimizing disruptions to your network or services.

4. **Enterprise Support**: Enterprise blocklists often come with additional support and services tailored for enterprise environments.
   This includes access to technical support, documentation, and integration assistance.
   If any issues or questions arise while using the Enterprise blocklists, you can rely on the support provided by the cybersecurity companies to help you
   address them effectively.

Yoroi and Nethesis blocklists are Enterprise blocklists.
These lists will be listed only if the machine has a valid Enterprise :ref:`subscription <subscription-section>` and a valid entitlement for the Threat Shield service.

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

.. _brute_force-section:

Brute Force Attempt Block
=========================

When Threat Shield is enabled, the system automatically starts checking for brute force attack attempts on firewall services. Currently, the monitored services include SSH access and the firewall's legacy web interface (Luci). The system detects login attempts and automatically blocks IPs that have failed to enter the correct credentials. By default, the allowed attempts are 3, and the block lasts for 30 minutes.

You can perform further actions using the command line; these are the supported commands:

* View all IP addresses currently on the blocklist: ``/etc/init.d/banip survey blocklistv4``
* Look up a specific IP in the blocklist: ``/etc/init.d/banip search IP_ADDRESS``
* Unban an IP address: ``nft delete element inet banIP blocklistv4 { IP_ADDRESS }``

.. note:: Bear in mind that you need to specify the correct blocklist in commands when prompted (``blocklistv4`` for IPv4, ``blocklistv6`` for IPv6).

You can modify the default values for the number of attempts and ban time using these commands:

* To change the number of attempts before a ban: ``uci set banip.global.ban_logcount='3'``
* To change the ban duration in minutes: ``uci set banip.global.ban_nftexpiry='30m'``

After changing the values, copy and paste these two commands: ::

  uci commit banip
  /etc/init.d/banip restart

