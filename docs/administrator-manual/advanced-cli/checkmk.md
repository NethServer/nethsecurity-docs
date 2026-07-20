---
title: "Checkmk"
sidebar_position: 11
---

# Checkmk {#checkmk-section}

Checkmk is a monitoring platform used to supervise servers, network devices, and appliances. The firewall can be monitored with [Checkmk](https://checkmk.com/) by installing the NethSecurity extra packages described in this chapter.

## NethSecurity packages

The Checkmk integration for NethSecurity is split into two packages:

- `checkmk-agent` is the standard Checkmk agent package.
- `ns-checkmk-utils` adds NethSecurity-specific monitoring scripts and is optional.

Installing `ns-checkmk-utils` also pulls in `checkmk-agent` as a dependency. If you only need the upstream agent, install `checkmk-agent` alone.

## Install the packages

Install the agent and the optional NethSecurity checks from the command line.

If you are running NethSecurity 8.8, use:

    apk update
    apk add ns-checkmk-utils

If you are running NethSecurity 8.7.2 or older, use:

    opkg update
    opkg install ns-checkmk-utils

After installation, the agent service is managed by `/etc/init.d/check_mk_agent` and it\'s started and enabled on boot by default.

Use the following command to check the status:

    /etc/init.d/check_mk_agent status

Verify the output locally with:

    check_mk_agent

## Restrict access to the agent

:::warning

The Checkmk agent exposes system and monitoring data over the network. Make sure to secure access to the agent port, allowing only trusted hosts; otherwise, sensitive information could leak.

:::

The agent listens on TCP port `6556`. By default, traffic from the LAN is allowed, so it is recommended to restrict access to this port to trusted hosts only.

You can manage firewall rules directly from the web user interface, see [Rules](../firewall/firewall_rules.md), or use the command line interface as shown below.

For example, to block access to the agent port from any source:

    uci add firewall rule
    uci set firewall.@rule[-1].name='Block-Checkmk'
    uci set firewall.@rule[-1].src='*'
    uci add_list firewall.@rule[-1].proto='tcp'
    uci set firewall.@rule[-1].dest_port='6556'
    uci set firewall.@rule[-1].target='DROP'
    uci commit firewall
    reload_config

If you need remote monitoring, add a specific allow rule scoped to the trusted Checkmk monitoring server and zone, and make sure it is ordered before the block rule above, since firewall rules are evaluated in order and the first match wins.
