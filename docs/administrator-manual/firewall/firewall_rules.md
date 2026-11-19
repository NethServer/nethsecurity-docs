---
title: "Rules"
sidebar_position: 3
---

# Rules {#firewall_rules-section}

Firewall rules define how network traffic is segmented and controlled between different zones. Firewalls acts as barriers between trusted internal networks and untrusted external networks, such as the internet. These rules specify which traffic is allowed, denied, or monitored based on predefined security policies.

The order of rules is important; the first matching rule is applied, determining the fate of the network packet.

The page is organized into three tabs, each serving a specific purpose:

- `Forward rules` tab: this tab is dedicated to configuring rules for data packets moving between different zones in the network.
- `Input rules` tab: this tab is dedicated to configuring rules for incoming packets destined for the firewall itself.
- `Output rules` tab: this tab is dedicated to configuring rules for packets emitted by the firewall.

Locate the button to add a new rule, click on it to initiate the rule creation process. Fill in the following fields for the new rule:

- `Status`: enable or disable the rule based on your requirements. By default the rule is enabled during creation.

- `Rule name`: assign a descriptive name to identify the rule.

- `Source address`: select the source address from four different options:

  - enter one or more IPv4/IPv6 addresses/networks or IP ranges
  - select one firewall object from the available ones
  - any source address
  - enter one or more MAC addresses, see [MAC address source](#mac-address-source)

  This field is not present for `Output rules`, as the source address is always the firewall itself.

- `Source zone`: specify the traffic source zone. Choose a specific zone or select \'Any\' to include traffic from any zone.

- `Destination address`: select the destination address from three different options:

  - enter one or more IPv4/IPv6 addresses/networks or IP ranges
  - select one firewall object from the available ones
  - any destination address

  This field is not present for `Input rules`, as the destination address is always the firewall itself.

- `Destination zone`: specify the traffic destination zone. Choose a specific zone. Bear in mind that the source and destination zones can\'t be the same.

- `Destination service`: select from the list or choose \'Custom\' to enter specific ports and select protocols.

- `Action`: define the action when the rule conditions are met:

  - `Accept`: accept the network traffic.
  - `Reject`: block the traffic and notify the sender host.
  - `Drop`: block the traffic, packets are dropped and no notification is sent to the sender host.
  - `Don't track`: bypass connection tracking for matching traffic. This action is available only in `Forward rules` and `Input rules`, requires a source zone, and is not available in `Output rules`.

- `Rule position`: decide whether to add the rule to the bottom or top of the rule list.

- `Logging`: indicate whether traffic matching this rule should be logged. The log entry will include the rule name as a prefix. By default, logging is limited to 1 entry per second. See the [Logging limits](#logging-limits) section for instructions on changing this limit.

- `Tags`: optionally, add tags for organizational purposes. Note that the \'automated\' tag is reserved for system use.

## MAC address source {#mac-address-source}

`Forward rules` and `Input rules` can match traffic by the source MAC address instead of the source IP address. This is useful to allow or block a device regardless of the IP address it is using, for example when the IP addresses are assigned by a DHCP server other than NethSecurity.

To create a rule based on MAC addresses, select the `MAC address` option in the `Source address` field and enter one or more MAC addresses. The rule matches the traffic coming from any of the listed MAC addresses.

MAC addresses can be entered using either `:` or `-` as separator, in uppercase or lowercase (e.g. `00:1A:2B:3C:4D:5E` or `00-1a-2b-3c-4d-5e`).

A rule can match either MAC addresses, IP addresses or a firewall object: it is not possible to combine MAC addresses with source IP addresses or objects in the same rule. Source MAC addresses are not available for `Output rules`.

:::note

MAC addresses can be matched only for hosts on the same network segment as the firewall: traffic coming through another router carries the MAC address of that router.

:::

## Logging limits

Logging can be enabled on the following objects:

- zones
- firewall rules
- redirect rules (port-forwarding)

When the logging is enabled, the firewall will add logging limits to various rules. This ensures that logging does not overwhelm the system by setting a limit on the logging rate.

By default, the following logging limits are applied:

- 1 log entry per second for firewall rules
- 5 log entries per second for zones
- 1 log entry per second for redirect rules

### Changing the default logging limits

:::warning

Changing the default logging limits can impact system performance. Use caution when changing these limits.

:::

Default limits are saved in the `ns_defaults` section of the firewall configuration:

- `zone_log_limit`: the default limit for zones
- `rule_log_limit`: the default limit for firewall rules
- `redirect_log_limit`: the default limit for redirect rules

1.  Set the desired log limit for the firewall rules using the `uci` command: :

        uci set firewall.ns_defaults.zone_log_limit="10/s"
        uci commit firewall

2.  Run the `firewall-apply-default-logging` script to apply the new log limit: :

        firewall-apply-default-logging
