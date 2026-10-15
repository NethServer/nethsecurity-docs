---
title: "Deep Packet Inspection (DPI) filter"
sidebar_position: 4
---

# Deep Packet Inspection (DPI) filter {#dpi_filter-section}

NethSecurity uses the [Netify Agent](https://www.netify.ai/resources) to employ Deep Packet Inspection (DPI) techniques for filtering network traffic.

The Netify Agent functions as a deep-packet inspection server, leveraging nDPI (formerly OpenDPI) to identify network protocols and applications. Detected information can be stored locally, accessed through UNIX or TCP sockets, or sent via HTTP POSTs to a remote third-party server. Details such as flow metadata, network statistics, and detection classifications can be used to take decision on the flow.

Here\'s how it operates:

- the Netify Agent evaluates every flow against the DPI rules and assigns a label to the connections matching a rule
- nft rules then block the connections labelled by a **Block** rule

The DPI engine is always running: traffic is filtered as soon as at least one rule is enabled.

The **DPI filter** page is split into two tabs:

- **Rules**: the ordered list of rules that allow or block traffic
- **Application groups**: reusable sets of applications, protocols and categories used by the rules

## Application groups {#application-groups}

An application group is a named set of applications, protocols, application categories and protocol categories. Groups are created once and can be used by any number of rules.

To create a new group, open the **Application groups** tab and click **Create application group**:

- **Group name**: a unique name for the group, up to 64 characters
- **Applications** and **Protocols** tabs: select the content of the group. Items are organized by category:
  - selecting a category includes every item of that category, including the ones added in the future by signature updates
  - click a category to show its contents and select individual items
  - use the filter field and the **Show only selected** option to quickly find items

The selected items are listed in the **Selected** panel, where they can also be removed. A group must contain at least one application, protocol or category.

From the groups list, each group can be edited, duplicated or deleted. The **Used by rules** column shows which rules reference the group: a group used by one or more rules cannot be deleted.

## Rules {#rules}

DPI rules decide whether matching traffic is allowed or blocked. Rules are evaluated **from top to bottom and the first matching rule wins**: a rule never applies to traffic already matched by a rule above it. Traffic not matching any rule is allowed.

This makes it possible to combine **Allow** and **Block** rules. For example, to block streaming services for the whole LAN except for a single host:

1. an **Allow** rule matching all traffic from `192.168.1.10`
2. a **Block** rule matching the streaming application group from `192.168.1.0/24`

To create a new rule, open the **Rules** tab and click **Add rule**. Application groups must be created first if the rule needs to match specific applications. The rule wizard has four steps:

1. **General**: the rule **Name** and its **Status** (enabled or disabled)
2. **Source**: choose **Any source address** to apply the rule to every host, or **Enter one or more addresses** to narrow it down. Each entry can be an IP address, a CIDR network (e.g. `10.10.10.0/24`) or an IP range (e.g. `10.10.10.1-10.10.10.5`)
3. **Match and action**:
   - **Match type**: **Application groups** matches the traffic of the selected groups, while **All traffic** matches every flow from the source
   - **Action**: **Block matching traffic** or **Allow matching traffic**
   - **Rule position**: add the new rule at the **Top of the list** or at the **Bottom of the list**
4. **Review**: check the rule settings before saving it

From the rules list, each rule can be:

- edited
- enabled or disabled
- duplicated
- deleted
- moved by drag and drop to change the evaluation order; reordering is available only when no filter is applied to the list

The list can be filtered by name, source, match type and action.

### Firewall and WAN traffic {#firewall-and-wan-traffic}

DPI rules can never block the firewall itself: the IP addresses of all firewall interfaces are always exempted from the rules, so a rule can not lock the administrator out. Flows seen on the WAN interfaces are also excluded from the rules.

### Custom rules {#custom-rules}

Rules not created from the web interface, such as hand-written rules or rules migrated from a previous version, are marked as **Custom**. Custom rules can be enabled, disabled, moved, renamed or deleted, but their matching criteria can not be edited from the web interface.

### Upgrade from previous versions {#upgrade-from-previous-versions}

Previous releases configured DPI rules per network interface, with a separate list of exceptions. The configuration is converted automatically on upgrade, and also when restoring an old backup:

- each rule blocking applications or protocols becomes a **Custom** **Block** rule that keeps the original behavior
- each exception becomes an **Allow** rule placed at the top of the list, named after the exception description
- rules with a QoS action (bulk, best effort, video, voice) and rules matching nothing are removed, as these actions are no longer supported

Removed rules are logged in `/var/log/messages`. To take full advantage of the new features, consider replacing the migrated **Custom** rules with new rules based on application groups.

## Premium application signatures {#premium-application-signatures}

:::note

Subscription required

This feature is available only if the firewall has a valid [Community or Enterprise subscription](../system/subscription.md).

:::

In the absence of a subscription, the system inherently recognizes a baseline of approximately 200 applications and 300 protocols. With an active subscription, this capacity significantly expands to approximately 2500 applications, and the list of recognized applications is updated daily, ensuring that the system stays abreast of the ever-evolving landscape of applications and digital services.

For more details about application and protocol licensing, see the [Netify DPI licensing page](https://www.netify.ai/products/netify-dpi/licensing).

Without a subscription, the application group editor shows the full catalog, but the items not recognized by the community signatures are marked as **Available only with enterprise subscription** and can not be selected. Use the **Show only community apps** and **Show only community protocols** options to hide them.

### Applications and protocols list

The full list of all applications and protocols supported by the Enterprise version is available here:

- [Applications](https://www.netify.ai/resources/applications_reference)
- [Protocols](https://www.netify.ai/resources/protocols)

## Logging blocked connections {#logging-blocked-connections}

Blocked connections can be logged inside `/var/log/messages` with the `DPI block: ` prefix. To enable logging:

    uci set dpi.config.log_blocked=1
    uci commit dpi
    /etc/init.d/dpi reload

## Netify traffic bypass

By default, Netifyd processes all traffic passing from, to, and out of the firewall. In some cases it may be desirable to completely ignore traffic analysis for specific hosts or subnets. Bypasses are configured using the `bypassv4` and `bypassv6` options, which take a list of IP addresses or CIDR subnets. A description can be added after a `|` pipe character.

To add a new bypass entry:

    uci add_list netifyd.config.bypassv4='10.45.23.0/24|Remote network'
    uci add_list netifyd.config.bypassv4='192.168.5.164|Critical host'
    uci commit netifyd
    reload_config

To edit and manage UCI list entries, refer to the [UCI list management](../../tutorial/uci.md#uci-lists) section.

To visualize the applied bypass entries and netifyd capture configuration:

    nft list table inet netifyd
