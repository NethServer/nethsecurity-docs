.. _firewall-section:

==============
Firewall rules
==============

.. warning::

   This feature is still under development and can be configured only from LuCI web interface.

Firewall rules define how network traffic is segmented and controlled between different zones. 
Firewalls acts as barriers between trusted internal networks and untrusted external networks, such as the internet.
These rules specify which traffic is allowed, denied, or monitored based on predefined security policies.

The order of rules is important; the first matching rule is applied, determining the fate of the network packet.

Firewall rules can be configured from the ``Firewall`` page inside LuCI web interface, under the ``Network`` section.

.. _zones-section:

Zones and policies
==================

.. note::

  Zones and policies can be configured from the NethSecurity UI.

In a firewall system, zones and policies are fundamental concepts that help manage network security by controlling 
the flow of traffic between different segments of a network.
A zone in a firewall represents a specific network segment with its own level of trustworthiness. For instance, a common setup 
might include zones like WAN (Wide Area Network) representing the external, untrusted network (usually the internet) 
and LAN (Local Area Network) representing the internal, trusted network (devices within a private home or organization). 
Each zone has its own set of security rules and policies that dictate how traffic can flow to and from that zone.

Policies in a firewall define the rules and actions that determine how traffic is handled between different zones.
These rules specify which type of traffic is allowed, denied, or monitored based on predefined security criteria

Default zones:

- **WAN (Wide Area Network):** represents the external, untrusted network (e.g., the internet).
- **LAN (Local Area Network):** represents the internal, trusted network (e.g., devices within a private home or organization).

Accepted traffic:

- **from LAN to WAN:** traffic from devices within the LAN zone to the WAN zone is allowed, enabling internal devices to access the internet.
- **from LAN to firewall itself:** traffic from LAN devices to the firewall itself is permitted, facilitating communication for various purposes.
- **From LAN to LAN itself:** traffic between devices within the LAN zone is allowed, enabling internal devices to communicate with each other.

Denied traffic:

- **From WAN to firewall itself:** traffic from the WAN zone to the firewall itself is denied, preventing unauthorized external access attempts.
- **From WAN to WAN itself:** direct communication between external networks (WAN to WAN) is denied, isolating different external entities for enhanced security.

In this configuration, the firewall regulates traffic between the WAN and LAN zones, allowing internal devices to access the internet and communicate internally while maintaining security by blocking direct external access to the firewall and preventing communication between external networks.

Default zones can't be deleted but the network administrator can change existing policies or create new zones. 
