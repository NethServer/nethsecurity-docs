---
title: "Avahi (mDNS reflector)"
sidebar_position: 1
---

# Avahi (mDNS reflector) {#avahi-section}

Multicast DNS (mDNS) allows devices to discover services on a local network without a centralized DNS server, using multicast traffic within the `.local` domain. A typical use case is IoT network segmentation: when IoT devices live in a dedicated network, control devices like smartphones and PCs rely on mDNS for discovery. However, mDNS traffic does not cross network boundaries, so an mDNS reflector such as Avahi is required to bridge the gap and allow service discovery across network segments.

On NethSecurity, the `avahi-nodbus-daemon` package is available in the official repositories but is not installed by default.

:::note

Starting from version 8.7.2, extra packages are automatically reinstalled after system upgrade. For earlier versions and for additional information, refer to this documentation: [Restore extra packages](../system/updates.md#restore_extra_packages-section).

:::

## Installation

Install the package with:

    apk update
    apk add avahi-nodbus-daemon

## Configuration

By default, the mDNS reflector functionality is disabled. To enable it:

1.  Edit the Avahi daemon configuration file: :

        sed -i 's/^enable\-reflector\=no$/enable\-reflector\=yes/g' /etc/avahi/avahi-daemon.conf

2.  Restart the Avahi daemon to apply the changes: :

        /etc/init.d/avahi-daemon restart

After enabling the reflector, mDNS traffic will be reflected across network interfaces, allowing service discovery to work between different network segments.
