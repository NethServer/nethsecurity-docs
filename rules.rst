.. _firewall_rules-section:

=====
Rules
=====


Firewall rules define how network traffic is segmented and controlled between different zones. 
Firewalls acts as barriers between trusted internal networks and untrusted external networks, such as the internet.
These rules specify which traffic is allowed, denied, or monitored based on predefined security policies.

The order of rules is important; the first matching rule is applied, determining the fate of the network packet.

The page is organized into three tabs, each serving a specific purpose:

* ``Forward rules`` tab: this tab is dedicated to configuring rules for data packets moving between different zones in the network.
* ``Input rules`` tab: this tab is dedicated to configuring rules for incoming packets destined for the firewall itself.
* ``Output rules`` tab: this tab is dedicated to configuring rules for packets emitted by the firewall.

Locate the button to add a new rule, click on it to initiate the rule creation process.
Fill in the following fields for the new rule:

* ``Status``: enable or disable the rule based on your requirements. By default the rule is enabled during creation.
* ``Rule name``: assign a descriptive name to identify the rule.
* ``Source address``: select the source address from three different options:

  - enter one or more IPv4/IPv6 addresses/networks or IP ranges
  - select one firewall object from the available ones
  - any source address

  This field is not present for ``Output rules``, as the source address is always the firewall itself.
* ``Source zone``: specify the traffic source zone. Choose a specific zone or select 'Any' to include traffic from any zone.
* ``Destination address``: select the destination address from three different options:

  - enter one or more IPv4/IPv6 addresses/networks or IP ranges
  - select one firewall object from the available ones
  - any destination address

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
