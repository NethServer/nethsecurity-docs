.. _threat_shield_ip-section:

================
Threat shield IP
================

NethSecurity is equipped with various tools and integrations useful for countering threats coming from the internet.
One of these tools is Threat Shield IP, which blocks any traffic coming from compromised IP addresses or destined to them as well as any requests addressed to hostnames that could be malicious.

The service can load community-maintained blocklists or can rely on high-quality blocklists very frequently updated and maintained by `Nethesis <https://www.nethesis.it>`_ and `Yoroy <https://yoroi.company>`_
a leading company focused on CyberSecurity and member of `Cyber Threat Alliance <https://www.cyberthreatalliance.org>`_.
Yoroi blacklists ensure great effectiveness and high confidence, minimizing the possibility of false positives.

Please note that to access the Nethesis and Yoroi blocklists, the machine must have a valid extra entitlement for this service.

Configuration
=============

The service is disabled by default, to enable it navigate to the ``Threat shield IP`` page under the ``Security`` section.
Access the ``Settings`` tab and activate the ``Status`` switch.

When the service is enabled, the ``Blocklist feeds`` tab will display all available blocklists.
You can enable or disable each blocklist by using the switch on the right side of the list.
Enabled blocklists will be automatically updated at regular intervals.
NethSecurity 8 allows the use of Community and Enterprise blocklists.

Community blocklists
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

.. admonition:: Subscription required

   This feature is available only if the firewall has a valid :ref:`Community or Enterprise subscription <subscription-section>`.

Enterprise blocklists are specifically focused on security and offer several advantages over community-maintained blocklists:

1. **Quality and accuracy**: Enterprise blocklists, such as the ones provided by Nethesis and Yoroi, are curated and maintained by reputable cybersecurity companies.
   These companies have dedicated teams that continuously monitor and update the blocklists to ensure they are accurate and effective in blocking malicious traffic.
   This results in a higher level of quality and accuracy compared to community-maintained blocklists, which may not receive the same level of attention and updates.

2. **Timeliness**: Enterprise blocklists are frequently updated to include the latest threats and malicious IP addresses. 
   Cybersecurity companies like Nethesis and Yoroi actively track emerging threats and promptly add them to their blocklists. 
   This ensures that your system is protected against the most recent and evolving threats. 
   
3. **Reduced false positives**: False positives occur when legitimate traffic is mistakenly blocked. 
   Enterprise blocklists are designed to minimize false positives by carefully curating and verifying the listed IP addresses and hostnames.
   The companies behind Enterprise blocklists have robust processes in place to ensure that only malicious entities are included in the blocklists.
   This reduces the chances of legitimate traffic being blocked, minimizing disruptions to your network or services.

4. **Enterprise support**: Enterprise blocklists often come with additional support and services tailored for enterprise environments.
   This includes access to technical support, documentation, and integration assistance.
   If any issues or questions arise while using the Enterprise blocklists, you can rely on the support provided by the cybersecurity companies to help you
   address them effectively.

Yoroi and Nethesis blocklists are Enterprise blocklists.
These lists will be listed only if the machine has a valid :ref:`Enterprise or Community subscription <subscription-section>` and a valid entitlement for the Threat Shield IP service.

Logging
-------

The Threat Shield IP feature includes advanced logging capabilities to monitor and track potential threats.
The logging section allows you to configure which types of blocked packets are logged:

1. Log packets blocked in pre-routing chain: when enabled, this option logs packets that are blocked in the pre-routing chain,
   which processes packets before they enter the routing table.

2. Log packets blocked in input chain: his option, when activated, logs packets blocked in the input chain, which handles packets destined
   to the firewall itself. Please note that this option can generate a large number of logs if the firewall is under heavy traffic.

3. Log packets blocked in forward chain: Enabling this logs packets blocked in the forward chain, which processes packets being routed through the firewall.

4. Log packets blocked forwarded from LAN: This option logs packets that are blocked when forwarded from the Local Area Network (LAN).

These logging options provide granular control over which blocked packets are recorded, allowing to expose metrics inside the 
:ref:`real-time monitoring <real_time_monitoring-section>` and :ref:`historical monitoring <historical_monitoring-section>` sections.

.. _local_allowlist-section:

Local allowlist
----------------

Sometimes it may be necessary to allow access to certain IP addresses, to do this you can use the ``Local allowlist`` tab.
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

.. _local_blocklist_ip-section:

Local blocklist
---------------

Threat Shield IP includes a local blocklist functionality, which allows you to manually specify addresses
that should always be blocked. This provides an additional layer of customization to your security setup.

To access and customize the blocklist, navigate to the ``Local blocklist`` tab in the Threat Shield IP interface.
Use the :guilabel:`Add address` button to include new entries. Each entry is composed by an address and a description.
Valid syntax for the address is the same as for the :ref:`local_allowlist-section`.

When adding addresses to the local blocklist, ensure you enter them correctly to avoid accidentally blocking legitimate traffic.
It's also a good practice to include a descriptive comment for each entry to help with future management and auditing of your blocklist.

.. _brute_force-section:

Block brute force attacks
=========================

When Threat Shield IP is enabled, the system automatically starts checking for brute force attack attempts on firewall services.
By default, the monitored services include SSH access and the login to NethSecurity UI.
The system detects login attempts and automatically blocks IPs that have failed to enter the correct credentials.

To enable or disable the brute force protection, navigate to the ``Block brute force attacks`` section in the Threat Shield IP interface,
under the ``Settings`` tab and use the switch to activate or deactivate the feature.

The feature can be customized by adjusting the following settings:

- ``Ban after N failed accesses``: this setting determines the number of failed login attempts allowed before an IP address is banned. 
  The default value is typically 3, but can be adjusted as needed. A lower value increases security but may also increase the risk of false positives,
  like blocking legitimate users who mistype their credentials.

- ``Patterns to detect attacks``: this field allows you to specify patterns that the system uses to identify potential brute force attacks.
  Common patterns include:

  - *Exit before auth from*: detects bad authentication attempts to SSH service
  - *authentication failed for user*: identifies failed authentication attempts to NethSecurity web interface
  - *TLS Auth Error*, *TLS handshake failed*, *AUTH_FAILED*: detects failed authentication attempts to OpenVPN service

  You can add additional patterns using the :guilabel:`Add pattern`` button to customize the detection mechanism.
  Each pattern can be a valid *grep* regular expression.

- ``Ban time``: this setting determines the duration for which an IP address remains banned after exceeding the allowed number of failed attempts.
  The default is often set to 30 minutes, but can be adjusted based on your security requirements.

You can perform further actions using the command line; these are the supported commands:

* View all IP addresses currently on the blocklist: ``/etc/init.d/banip survey blocklistv4``
* Look up a specific IP in the blocklist: ``/etc/init.d/banip search IP_ADDRESS``
* Unban an IP address: ``nft delete element inet banIP blocklistv4 { IP_ADDRESS }``

Bear in mind that you need to specify the correct blocklist in commands when prompted (``blocklistv4`` for IPv4, ``blocklistv6`` for IPv6).

Block DoS
---------

Threat Shield IP also includes protection against various types of Denial of Service (DoS) attacks.
DoS protection limits excessive suspicious requests of a certain type, blocking that kind of traffic until the situation normalizes.

- ``Block ICMP DoS``: when enabled, this option protects against DoS attacks using the Internet Control Message Protocol (ICMP).
  The limit is set to 100 packets per second for all traffic passing through the firewall.

- ``Block TCP DoS``: this option, when activated, guards against TCP-based DoS attacks based on bad packets.
  A packet could be considered bad if it is not part of an established connection or if it is part of a connection that has been closed.
  The limit is set to 10 bad packets per second for all traffic passing through the firewall.

- ``Block UDP DoS``: Enabling this protects against User Datagram Protocol (UDP) based DoS attacks.
  The limit is set to 100 packets per second for all traffic passing through the firewall.


