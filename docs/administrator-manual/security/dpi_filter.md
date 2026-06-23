---
title: "Deep Packet Inspection (DPI) filter"
sidebar_position: 4
---

# Deep Packet Inspection (DPI) filter {#dpi_filter-section}

NethSecurity uses the [Netify Agent](https://www.netify.ai/resources) to employ Deep Packet Inspection (DPI) techniques for filtering network traffic.

The Netify Agent functions as a deep-packet inspection server, leveraging nDPI (formerly OpenDPI) to identify network protocols and applications. Detected information can be stored locally, accessed through UNIX or TCP sockets, or sent via HTTP POSTs to a remote third-party server. Details such as flow metadata, network statistics, and detection classifications can be used to take decision on the flow.

Here\'s how it operates:

- the Netify flow actions plugin assigns labels to matching connections
- nft rules can then either block or adjust priority (DSCP) for connections based on these labels

The administrator can create Deep Packet Inspection (DPI) rules for each interface.

## Configuration

To configure these rules, the administrator initiates the process by selecting the particular network interface on which the rule is intended to operate. This step ensures that the rule is precisely applied to the designated segment of the network, allowing for targeted and effective management of network traffic.

Following the selection of the interface, the administrator is prompted to specify the applications that are to be blocked or regulated. This essential step involves choosing from a comprehensive list of applications accessible through the system interface.

The interface, as a default feature, presents a catalog of commonly used applications. However, it provides an advanced search functionality enabling the administrator to explore and pinpoint specific applications and application categories that require special attention.

### Premium application signatures

:::note

Subscription required

This feature is available only if the firewall has a valid [Community or Enterprise subscription](../system/subscription.md).

:::

In the absence of a subscription, the system inherently recognizes a baseline of approximately 400 applications. However, with an active subscription, this capacity significantly expands, encompassing more than 2300 applications. In this scenario, the list of recognized applications undergoes daily updates, ensuring that the system stays abreast of the ever-evolving landscape of applications and digital services.

### Applications and protocols list

The full list of all applications and protocols supported by the Enterprise version is available here:

- [Applications](https://www.netify.ai/resources/applications_reference)
- [Protocols](https://www.netify.ai/resources/protocols)

### Exceptions

DPI exclusion allows for the exclusion of specific network addresses, such as the gateway or other critical infrastructure, preventing them from being blocked.

To add a new exception, click the `Add exception` button. Enter the `IP address or CIDR` that should be exempted from the filter. You can include a description explaining the reason for the exclusion.

Each exception can be enabled or disabled as desired.

### Netify traffic bypass

By default, Netifyd processes all traffic passing from, to, and out of the firewall. In some cases it may be desirable to completely ignore traffic analysis for specific hosts or subnets. Bypasses are configured using the `bypassv4` and `bypassv6` options, which take a list of IP addresses or CIDR subnets. A description can be added after a `|` pipe character.

To add a new bypass entry:

    uci add_list netifyd.config.bypassv4='10.45.23.0/24|Remote network'
    uci add_list netifyd.config.bypassv4='192.168.5.164|Critical host'
    uci commit netifyd
    reload_config

To edit and manage UCI list entries, refer to the [UCI list management](../../tutorial/uci.md#uci-lists) section.

To visualize the applied bypass entries and netifyd capture configuration:

    nft list table inet netifyd
