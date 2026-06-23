---
title: "Network interface reorder after upgrade to 8.7.1"
sidebar_position: 10
---
# Network interface reorder after upgrade to 8.7.1

## Problem

In rare cases, after the upgrade, **the order of some network interfaces may change**, breaking firewall functionality and system accessibility.

## When the problem occurs

- Upgrade to version **8.7.1 or later** from any earlier version of NethSecurity 8 (including 8-24.10.0-ns.1.6.0)
- Presence of multiple **network interface types** with **different brands or drivers**

:::note
Having mixed interface types does **not automatically** mean the problem will occur. In most cases the upgrade completes without any issues.
:::

## When the problem does NOT occur

- Nethesis boxes
- Devices where **all interfaces are the same type**
- Migrations from **NethSecurity 7.9** — not affected even with heterogeneous hardware

## How to check

If you suspect a server may be at risk, check the output of **`lspci`** to look for mixed interface types. Example of a potentially affected machine (Intel and Realtek cards):

```
root@nethesis:~# lspci -nn | grep 0200
00:1f.6 Ethernet controller [0200]: Intel Corporation Ethernet Connection (2) I219-V [8086:15b8] (rev 31
01:00.0 Ethernet controller [0200]: Realtek Semiconductor Co., Ltd. RTL8111/8168/8211/8411 PCI Express Gigabit Ethernet Controller [10ec:8168] (rev 06)
02:00.0 Ethernet controller [0200]: Realtek Semiconductor Co., Ltd. RTL8111/8168/8211/8411 PCI Express Gigabit Ethernet Controller [10ec:8168] (rev 06)
```

- Plan the upgrade carefully if the machine appears potentially affected
- If you frequently use the same hardware models, note that behavior tends to be consistent:
  - if one machine has the problem, similar machines likely will too
  - if one is unaffected, others of the same type are likely fine as well

## Fix

For systems with ethernet interfaces from different manufacturers that have not yet been upgraded, a script is available that performs the upgrade while preserving the network configuration.

Quick instructions:

```bash
# Download the script
curl -fsSL https://docs.nethsecurity.org/_static/tutorial/network-interface-reorder-after-upgrade-8-7-1/ns-upgrade-fix-eth -o /root/ns-upgrade-fix-eth
# Make it executable
chmod a+x /root/ns-upgrade-fix-eth
# Run it
/root/ns-upgrade-fix-eth
```

### What it does

1. **Before the upgrade**: saves ethernet MAC addresses to `/root/eth-mac-mapping` and configures auto-correction on the next boot.
2. Asks whether to install the update immediately, then downloads it and reboots. If you cannot reboot immediately, use the NethSecurity UI to run or schedule the update. **Do not reboot NethSecurity before upgrading.**
3. **After the upgrade**: detects any ethernet name changes via MAC address, updates `/etc/config/network` to use the new device names, and reboots if names have changed.
4. If nothing changed, it only logs and does nothing. The additional reboot in case of changes adds about one minute to upgrade time (depends on BIOS).

All activity is logged to `/var/log/messages` and `/root/ns-upgrade-fix-eth.log`.

---

Reference: [Partner Forum](https://partner.nethesis.it/t/spostamento-schede-di-rete-dopo-aggiornamento-a-versione-8-7-1/9678/15)
