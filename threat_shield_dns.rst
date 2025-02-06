.. _threat_shield_dns-section:

=================
Threat shield DNS
=================

Threat shield DNS uses Adblock which blocks any request to domains considered malicious.
The service can load community-maintained blocklists or use Enterprise feeds provided by `Nethesis <https://www.nethesis.it>`_ and `Yoroy <https://yoroi.company>`_
a leading company focused on CyberSecurity and member of `Cyber Threat Alliance <https://www.cyberthreatalliance.org>`_.

Please note that to access the Nethesis and Yoroi blocklists, the unit must have a valid extra entitlement for this service.

.. _configuration-section:

Configuration
=============

.. note:: Please use Threat shield DNS only if you are not already using the FlashStart service because if used together, they may conflict.

The service is disabled by default, to enable it navigate to the ``Threat shield DNS`` page under the ``Security`` section.
Access the ``Settings`` tab and activate the ``Status`` switch.

When the service is enabled, the ``Blocklist sources`` tab will display all available blocklists.
You can enable or disable each blocklist by using the switch on the right side of the list.
Enabled blocklists will be automatically updated at regular intervals.

To specify on which zones the service should be active, select them in the ``Force DNS redirection on these zones`` combobox.

``Redirected ports`` allows you to specify which ports should be redirected to Threat shield DNS service.

.. _community_blocklists-section:

Community blocklists
--------------------

Community blocklists are sourced from community contributors and block various domains related to: ads, malware, spam, 
tracker, explicit sexual content, piracy and so on. 
NethSecurity makes them available as they are.
The type of usage license may vary depending on the provider, so if the use is not personal, you may need to inquire with the provider.

.. rubric:: Community lists maintenance

Each blocklist is maintained by its specific provider. NethSecurity already includes the URLs for downloading the feeds, 
which are valid at the time of the release. However, because these URLs are hard-coded, if the provider changes them, some blocklists may no longer 
be downloadable.

.. _enterprise_blocklists-section:

Enterprise blocklists
---------------------

.. admonition:: Subscription required

   This feature is available only if the unit has a valid :ref:`Community or Enterprise subscription <subscription-section>`.

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
These lists will be listed only if the unit has a valid :ref:`Enterprise or Community subscription <subscription-section>` and a valid entitlement for the Threat Shield service.

.. _filter_bypass-section:

Filter bypass
=============

Some hosts or subnets may need to bypass Threat shield DNS filtering. To configure filter bypass, navigate to the ``Filter bypass`` tab of Threat shield DNS.
Use the :guilabel:`Add bypass` button to add a new address to the list.
The address can be a valid IPv4/IPv6 address with optional CIDR notation.

.. _local_blocklist-section:

Local blocklist
===============

To block specific domains not included in the blocklists, you can navigate to the ``Local blocklist`` tab of Threat shield DNS.
Use the :guilabel:`Add domain` button to add a domain to the list; you can adda description to the domain to help you remember why it was added.

.. warning::

  The DNS resolution for the names listed in the blocklist will also affect the unit itself

.. _advanced_configuration-section:

Advanced configuration
======================

When Threat shield DNS is enabled:

- A new category source file is generated based on the unit registration and entitlement.
- All DNS queries are redirected to the local machine.
- Adblock is configured to use the new category source file and will be started automatically.

Even if not recommended, it's possible to use Adblock without Threat shield DNS.
For more detailed configuration options, please refer to the `developer manual <https://dev.nethsecurity.org/packages/ns-threat_shield/#ts-dns>`_.
