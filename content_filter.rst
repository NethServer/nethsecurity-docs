=================
Content Filtering
=================

Content filtering is a crucial aspect of network security, serving two primary purposes:

1. Blocking malware and preventing malicious attacks
2. Filtering unwanted sites, such as those containing adult content

NethSecurity offers four distinct filtering mechanisms to address these needs:

- **Threat Shield IP**: IP-based blocking system targeting malware threats
- **Threat Shield DNS**: DNS-based blocking system for malware and basic content filtering
- **Deep Packet Inspection (DPI) filter**: Application and protocol-specific filtering using netifyd
- **FlashStart DNS filter**: Commercial DNS-based filtering solution with comprehensive content control features

Threat Shield IP
=================

Threat Shield IP is an IP-based blocking system designed specifically to combat malware threats. It operates by blocking connections to or from known malicious 
IP addresses.

**Scope**: Targets malware and provides limited privacy and advertising (ads) removal features

**Lists**: 

- Community lists, free, targeting general malware, ads and trackers
- Enterprise lists, paid, focusing on high-value malware protection

Advantages:

- Fast processing as it works at the IP level
- Effective against entire malicious networks

Limitations:

- Cannot filter based on content type
- May occasionally block legitimate services sharing an IP with malicious ones

To configure Threat Shield IP, see the :ref:`threat_shield_ip-section`.

Threat Shield DNS
=================

Threat Shield DNS provides DNS-based blocking, offering protection against malware and basic content filtering capabilities.

**Scope**: Covers malware and limited content categories (e.g., adult content, gambling)

**Lists**:

- Community lists, free, focusing on general malware and simple content filtering
- Enterprise lists, paid, focus on high-value malware protection

Advantages:

- Can block specific domains regardless of IP address
- Offers basic content categorization (e.g., adult, gambling)

Limitations:

- Could be bypassed by using alternative DNS servers, but can be mitigated with DPI filtering and by enabling special block categories
- Less granular than full URL filtering

To configure Threat Shield DNS, see the :ref:`threat_shield_dns-section`.

FlashStart DNS filter
=====================

FlashStart is a commercial DNS-based filtering solution that offers comprehensive content control and reporting features.

**Scope**: Comprehensive content filtering beyond just malware and adult content

**Lists**: Commercial lists maintained by FlashStart

Advantages:

- High-quality block lists
- Customizable reports
- Cloud-based configuration, no direct firewall access required
- Extensive content categories
- Easy to manage
- Scalable for organizations of various sizes

To configure FlashStart DNS filtering, see the :ref:`flashstart-section`.

Deep Packet Inspection (DPI) filter
===================================

NethSecurity employs Deep Packet Inspection (DPI) techniques for filtering network traffic using the Netify Agent.

**Scope**: Application and protocol-specific filtering

**Lists**:

- Community signatures, free but limited in number and update frequency
- Enterprise signatures, included in any subscription, offering more comprehensive coverage

Advantages:

- Provides granular control over network traffic
- Can identify and filter based on specific applications or protocols
- Allows for dynamic traffic management based on real-time analysis

Considerations:

- May require more processing power compared to IP or DNS-based filtering
- Requires careful configuration to balance security and performance
- The administrator needs to create DPI rules for each interface

To configure DPI filtering, see the :ref:`dpi_filter-section`.

Comparison of filtering options
===============================

+-------------------+-------------------+---------------------+-----------------------------+------------------------+
| Feature           | Threat Shield IP  | Threat Shield DNS   | Flashstart DNS Filtering    | DPI Filter             |
+===================+===================+=====================+=============================+========================+
| Blocking method   | IP-based          | DNS-based           | DNS-based                   | Packet inspection      |
+-------------------+-------------------+---------------------+-----------------------------+------------------------+
| Primary focus     | Malware           | Malware + basic     | Comprehensive content       | Application/Protocol   |
|                   |                   | content             |                             | specific               |
+-------------------+-------------------+---------------------+-----------------------------+------------------------+
| List types        | Community,        | Community,          | Commercial                  | N/A (real-time         |
|                   | Enterprise        | Enterprise          |                             | analysis)              |
+-------------------+-------------------+---------------------+-----------------------------+------------------------+
| Configuration     | Firewall          | Firewall            | Cloud                       | Firewall (per          |
|                   |                   |                     |                             | interface)             |
+-------------------+-------------------+---------------------+-----------------------------+------------------------+
| Reporting         | None              | None                | Advanced, customizable      | Limited                |
+-------------------+-------------------+---------------------+-----------------------------+------------------------+

.. rubric:: Implementation strategies

For optimal security, consider a layered approach:

1. Use Threat Shield IP as the first line of defense against known malicious networks.
2. Implement a DNS filter, use one of the following options:

   * Threat Shield DNS to catch domain-based threats and provide basic content filtering or
   * Flashstart DNS Filtering for comprehensive content control, especially in environments requiring detailed policy management and reporting.
3. Utilize DPI filtering for granular control over specific applications and protocols, and to manage traffic based on real-time analysis.

This combination provides defense-in-depth, addressing various threat vectors and content filtering needs.