---
title: "FAQ"
sidebar_position: 1
---

# FAQ

## 1. Where can I find information about NethSecurity 8?

Refer to the [release notes](../administrator-manual/about/release_notes.md) for the latest information about NethSecurity 8.

## 2. Can I use NethSecurity 8 in production?

Absolutely! NethSecurity 8 is a mature product ready for production use.

If you haven't used it before, follow this path to avoid problems:

- Test NethSecurity thoroughly in a home lab before deploying it for customers.
- Start with a clean installation and only then try migration.
- Once confident, deploy it for customers — start with simple new installations before using the migration tool.

:::note
The firewall **migration** is the **last** thing to try, not the first.
:::

## 3. Where can I download NethSecurity 8?

Download it from the [download page](../administrator-manual/installation/download.mdx).

## 4. How do I install NethSecurity 8?

See the [installation guide](../administrator-manual/installation/install.mdx) for full details. In summary:

### Installation on bare metal systems (Nethesis boxes, servers)

**a. Direct write to the production storage**

- Write the downloaded image **directly** to the storage of your box/server (use `dd` from Linux only).
- The storage is immediately bootable after writing.

**b. Write via USB stick**

You can write to the storage without removing it from the device using a USB stick, following a procedure similar to the factory default of NethSecurity 7 boxes:

- Write the USB stick with the image using `dd` from Linux (Windows tools may modify the partition table and are **not supported**).
- Boot from the USB stick.
- Log in with the default credentials: `root` / `Nethesis,1234`.
- Write the device storage with: `ns-install`.
- When the procedure completes, the device shuts down automatically.
- Remove the USB stick — the device is ready.

:::note
The USB stick is only needed for the initial installation, not afterwards and not for factory reset. See [FAQ 7](#7-how-do-i-perform-factory-reset-on-nethsecurity-8) for factory reset instructions.
:::

### Installation on a hypervisor

- Convert the image to a virtual disk format suitable for your hypervisor (decompress it first).
- Start the system.
- To store logs on a dedicated volume, create a separate virtual disk and configure it in the **Storage** section.

## 5. Which boxes can I install NethSecurity 8 on?

All boxes in the [Nethesis shop](https://nethshop.nethesis.it/product-category/nethsecurity/) ship with NethSecurity 8 pre-installed.

You can also install NethSecurity 8 on all Z-series boxes and 64-bit boxes from previous series up to approximately 2018 (S20, S30, S40, S60+, S120, S150, S200).

## 6. Are 2.5 Gbps network cards supported?

Yes, 2.5 Gbps network cards are supported on NethSecurity 8.

## 7. How do I perform factory reset on NethSecurity 8?

Factory reset is **always possible without external media** — it is managed natively by the system (no USB stick required, unlike previous versions).

Factory reset is available from the UI (**System** → **Factory reset** section) and from the terminal, including in Failsafe mode.

See the [factory reset guide](../administrator-manual/system/reset_recovery.md) for full details.

## 8. Where do I configure Blue and Orange zones?

On NethSecurity 8 the Blue and Orange zones are not present by default. In the **Firewall** section you can create zones freely and define their behavior. To ease the transition from the previous version, two ready-made templates for Blue and DMZ zones are available.

See [Zones and policies](../administrator-manual/firewall/zones_and_policies.md) for details.

## 9. Where do I configure hairpin NAT?

On NethSecurity 8, hairpin NAT is no longer a global setting. It is now more granular and is configured per port forward in the advanced properties. When configuring it, specify which zones it should be enabled for.

See [Port forward](../administrator-manual/firewall/port_forward.md) for details.

## 10. How do I create rules in QoS?

On NethSecurity 8, QoS works differently from NethSecurity 7. The system automatically identifies traffic types (voice, video, other) and assigns them to the correct priority class, always ensuring sufficient bandwidth for all uses.

Custom rules are not currently supported — the tool works well out of the box. If custom rules become necessary, they will be introduced in a future release.

See [Quality of Service (QoS)](../administrator-manual/network/qos.md) for details.
