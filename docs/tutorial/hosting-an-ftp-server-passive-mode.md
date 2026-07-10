---
title: "Hosting an FTP server in passive mode"
sidebar_position: 8.5
---

# Hosting an FTP server in passive mode

When you host an FTP server inside your LAN behind NethSecurity 8, external clients can fail to download files in passive mode by default.

For security reasons, the firewall handles NAT dynamically and does not automatically track the random high ports requested by passive FTP connections.

To allow passive FTP traffic, explicitly enable the Netfilter FTP connection tracking helper (`conntrack`) on the WAN zone.

## Configuration steps

1. Load the kernel modules from the **NAT helpers** page in the UI.

   Make sure the required kernel modules for FTP tracking and NAT are loaded on the system:

   ```text
   nf_conntrack_ftp
   nf_nat_ftp
   ```

2. Activate the FTP helper on the WAN zone.

   Run these UCI commands over SSH to assign the FTP helper to the `ns_wan` interface and disable automatic helper assignment:

   ```bash
   uci set firewall.ns_wan.auto_helper='0'
   uci set firewall.ns_wan.helper='ftp'
   uci commit firewall
   reload_config
   ```

:::tip
If you are migrating an existing setup from **NethServer 7**, step 1 is not required. On migrated firewalls, the helpers are enabled by default for compatibility.
:::
