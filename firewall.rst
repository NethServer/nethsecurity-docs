.. _firewall-section:

========
Firewall
========

Firewall zones categorize network interfaces, defining trust boundaries, while firewall rules dictate traffic handling between zones.
Zones organize network segments, and rules enforce security policies by specifying conditions for permitted or denied actions.
Together, they allow the definition and application of rules for network traffic within the firewall.

.. _zones-section:

Zones and policies
==================

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

.. _firewall-rules-section:

Rules
=====

Firewall rules define how network traffic is segmented and controlled between different zones. 
Firewalls acts as barriers between trusted internal networks and untrusted external networks, such as the internet.
These rules specify which traffic is allowed, denied, or monitored based on predefined security policies.

The order of rules is important; the first matching rule is applied, determining the fate of the network packet.

The page is organized into three tabs, each serving a specific purpose:

* ``Forward rules`` tab: thiis tab is dedicated to configuring rules for data packets moving between different zones in the network.
* ``Input rules`` tab: this tab is dedicated to configuring rules for incoming packets destined for the firewall itself.
* ``Output rules`` tab: this tab is dedicated to configuring rules for data packets leaving the firewall.

Locate the button to add a new rule, click on it to initiate the rule creation process.
Fill in the following fields for the new rule:

* ``Status``: enable or disable the rule based on your requirements. By default the rule is enabled during creation.
* ``Rule name``: assign a descriptive name to identify the rule.
* ``Source address``: enter one or more IPv4/IPv6 addresses or networks. Leave unselected for any source address.
  This field is not present for ``Output rules``, as the source address is always the firewall itself.
* ``Source zone``: specify the traffic source zone. Choose a specific zone or select 'Any' to include traffic from any zone.
* ``Destination address``: enter one or more IPv4/IPv6 addresses or networks. Leave unselected for any destination address.
  This field is not present for ``Input rules``, as the destination address is always the firewall itself.
* ``Destination zone``: specify the traffic destination zone. Choose a specific zone. Bear in mind that the source and destination zones can't be the same.
* ``Destination service``: select from the list or choose 'Custom' to enter specific ports and select protocols.
* ``Action``: define the action when the rule conditions are met:
  * ``Accept``: accept the network traffic.
  * ``Reject``: block the traffic and notify the sender host.
  * ``Drop``: block the traffic, packets are dropped and no notification is sent to the sender host.
* ``Rule position``: decide whether to add the rule to the bottom or top of the rule list.
* ``Logging``: indicate whether traffic matching this rule should be logged. The log entry will include the rule name as a prefix.
* ``Tags``: optionally, add tags for organizational purposes. Note that the 'automated' tag is reserved for system use.
