.. _zones-section:

==================
Zones and policies
==================


Firewall zones categorize network interfaces, defining trust boundaries, while firewall rules dictate traffic handling between zones.
Zones organize network segments, and rules enforce security policies by specifying conditions for permitted or denied actions.
Together, they allow the definition and application of rules for network traffic within the firewall.


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

Guests and DMZ zones
--------------------

In addition to the default zones, the firewall can be configured with additional zones to accommodate specific network requirements.
Two common examples are the Guest and DMZ (Demilitarized Zone) zones.
Sometimes the Guest zone is also known as the blue zone while the DMZ is also named as orange.


Guests zone (blue)
^^^^^^^^^^^^^^^^^^^

The Guest zone represents a network segment for guest devices, such as visitors or temporary users.
This zone is typically isolated from the LAN zone to prevent unauthorized access to internal resources.
But it is allowed to access the WAN zone.

To create a Guest zone, follow these steps:

- access the ``Zones & policies`` section
- click on the ``Add zone`` button
- enter **guest** inside the ``Name`` field, in this case the zone will be highlighted in blue
- leave empty the ``Allow forwards to`` field
- select ``LAN`` inside the ``Allow forwards from`` field
- enable the ``Traffic to WAN`` option
- select ``Drop`` for both ``Traffic to firewall`` and ``Traffic for the same zone`` fields
- click on the ``Save`` button and apply the changes

.. note::
  If the firewall is intended to provide ``DHCP`` and ``DNS`` services, create a firewall ``input rule`` allowing traffic on ports ``53 TCP/UDP (DNS)`` as well port ``67 UDP (DHCP)`` for the ``Guest`` zone.
  If these services are not required or provided by another device in this network, the corresponding ports can remain blocked.

DMZ zone (orange)
^^^^^^^^^^^^^^^^^

The DMZ represents a network segment for servers and services that need to be accessible from the internet but isolated from the internal network.

To create a DMZ, follow these steps:

- access the ``Zones & policies`` section
- click on the ``Add zone`` button
- enter **dmz** inside the ``Name`` field, in this case the zone will be highlighted in orange
- leave empty both the ``Allow forwards to`` and ``Allow forwards from`` fields
- enable the ``Traffic to WAN`` option
- select ``Drop`` for both ``Traffic to firewall`` and ``Traffic for the same zone`` fields
- click on the ``Save`` button and apply the changes
