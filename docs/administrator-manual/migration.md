---
title: "NethServer 7 migration"
sidebar_position: 10.5
---
# NethServer 7 migration

Migration is the process to convert a NethServer 7 machine (*source*) into NethSecurity (*destination*).

Migrating the firewall configuration from NethServer 7 to NethSecurity is a crucial process to ensure the continuity and security of your network services.

**Migration requirements:**

- Ensure access to Cockpit on NethServer 7
- Install the `Firewall Migration` application on NethServer 7. After installation, the application will be available in the Cockpit applications list

## Migration Scenarios

| Source system | Supported method | Notes |
|---|---|---|
| NethServer 7 with only the firewall role | In-place or export/import | You can reuse the existing hardware if NethSecurity 8 detects all required disks and network cards. |
| NethServer 7 with additional roles such as NethService, NethVoice or mail | Export/import only | In-place migration is not supported. Install NethSecurity 8 on a dedicated machine and import only the firewall configuration. |
| NethServer 6.x | Not supported | Upgrade to NethServer 7 first. |

:::note
If you are using High Availability (HA) with NethServer 7, please refer also to the [HA maintenance and troubleshooting](./high-availability/ha_maintenance_troubleshooting.md) guide for detailed instructions on migrating while maintaining HA functionality.
:::

## Hardware Compatibility

Before reusing the existing hardware, boot the live USB image or a fresh NethSecurity 8 installation and verify that all disks and network cards are detected. No special migration step is required for supported 10 Gb SFP/SFP+ adapters: if the card is detected, proceed with the migration normally. If it is not detected, use different hardware or a network card already supported by NethSecurity 8.

USB-to-Ethernet adapters are not supported in production on NethSecurity 8. See the [USB-to-Ethernet adapters](#usb-to-ethernet-adapters) section for more details.

## Testing the Migration

This method allows for thorough testing without affecting your existing installation. A test system boots from a USB drive leaving the existing installation untouched.

To perform a test migration:

1. Access the **Firewall Migration** page on NethServer 7 Cockpit — the page lists all migrated configurations.
2. Click **Download** in the **Download live USB image** section.
3. Write the downloaded image to a USB drive. See [Installation](./installation/system_requirements.md) for instructions.
4. Shut down the firewall, plug in the USB drive, and boot from it (typically via BIOS/UEFI settings).
5. The system loads from the USB drive. Any changes or tests occur in this isolated environment.

After testing, remove the USB drive and reboot normally — the original installation is fully restored.

## Migration In-Place

If NethServer 7 has only the firewall module, you can migrate and reuse the current hardware. This approach eliminates the need for additional hardware.

:::warning
The in-place migration is a destructive process. Create a full backup before proceeding.
:::

To perform the in-place migration:

1. Access the **Firewall Migration** page on NethServer 7 Cockpit.
2. Download the configuration archive as a precaution: click **Download** in the **Download exported archive** section and keep it in a secure location.
3. Click **Migrate** to start the process.
4. **Select the target disk**: choose the disk where NethSecurity will be installed. NethSecurity does not support RAID. If the server has more than one disk, the other disks remain unchanged.
5. Click **Migrate** again to confirm. The system downloads the NethSecurity image, writes it to the selected disk, and automatically reboots.
6. On first boot, the NethServer 7 configuration is automatically applied. Verify all settings and services.

After completing the migration, follow the [post-migration steps](#post-migration-steps).

## Migration with Other Installed Modules

This scenario involves exporting a configuration archive from NethServer 7 and importing it into a fresh NethSecurity installation. Use this method when NethServer 7 also runs additional modules such as mail server, WebTop groupware, or NethVoice PBX.

To perform the migration:

1. Install NethSecurity on a new machine following the [installation instructions](./installation/system_requirements.md).
2. Access the **Firewall Migration** page on NethServer 7 Cockpit.
3. Click **Download** in the **Download export archive** section.
4. On NethSecurity, open **Backup & Restore** → **Migration** tab, click **Upload migration file**, and select the downloaded archive.
5. **Remap network interfaces**: since MAC addresses change on new hardware, map source interfaces (left) to destination interfaces (right). If the source had VLANs, remap the physical interface — the system automatically recreates the VLANs.
6. Click **Migrate** to start the process.

After completing the migration, follow the [post-migration steps](#post-migration-steps).

## Post-Migration Steps

The in-place migration runs while the system is offline, so the subscription is not carried over. If you performed an in-place migration, [register the system](./system/subscription.md) again. This step is not required when using the exported archive method.

When using a remote LDAP or Active Directory server to authenticate OpenVPN Road Warrior clients, verify that the remote server is reachable from the new machine (including DNS resolution). Review the [remote user databases](./users-objects/users_databases.md) page to confirm all users were imported correctly.

NethSecurity only listens on HTTPS (port 443) for reverse proxy rules. If you had HTTP (port 80) reverse proxy rules on NethServer 7, update them to HTTPS. See [Reverse proxy](./network/reverse_proxy.md) for details.

Verify that all services are working. If you encounter issues, refer to the [troubleshooting guide](../tutorial/troubleshooting.md).

The migration process is logged at `/root/migration.log`. This file is deleted after an image upgrade.

### Fixing bond and VLAN naming for high availability

After migrating from NethServer 7, bonded network devices may have long names like `bond-bond0` instead of the shorter `bond0` format used in fresh NethSecurity 8 installations. While this does not affect basic functionality, these longer names can prevent setting up [High Availability](./high-availability/ha_overview_features_limitations.md).

If you plan to use High Availability or prefer cleaner device names, rename them with the following steps.

Back up your network configuration:

```bash
cp /etc/config/network /root/network.ori
```

Run the rename command:

```bash
sed -i \
  -e "/option[[:space:]]\+ifname/s/'bond-bond\([0-9]\+\)'/'bond-b\1'/" \
  -e "/option[[:space:]]\+device/s/'bond-bond\([0-9]\+\)'/'bond-b\1'/" \
  -e "/option[[:space:]]\+name/s/'bond-bond\([0-9]\+\)\(\.[0-9]\+\)'/'b\1\2'/" \
  -e "/option[[:space:]]\+name/s/'bond-bond\([0-9]\+\)'/'bond-b\1'/" \
  -e "s/^\([[:space:]]*option[[:space:]]\+name[[:space:]]\+\)'b\([0-9]\+\)'\([[:space:]]*\)$/\1'bond-b\2'\3/" \
  /etc/config/network
```

Restart the network or reboot:

```bash
/etc/init.d/network restart
```

Once verified, delete the backup:

```bash
rm -f /root/network.ori
```

After the changes, devices use shorter names (e.g., `b0`, `b0.20`), compatible with High Availability and matching fresh installations.

## Migration coverage matrix

| Area | Result | Notes |
|---|---|---|
| Root password | Migrated | The same password can be used for SSH and the web interface. |
| Network interfaces and VLANs | Migrated with limits | Bridges over bonds are not supported. On new hardware, VLANs are recreated automatically on the remapped physical interface. See [Fixing bond and VLAN naming](#fixing-bond-and-vlan-naming-for-high-availability). |
| Network interface labels | Migrated | Source labels are kept as interface names, except on WAN interfaces which keep their original names. |
| Date and timezone | Migrated | |
| DHCP servers and reservations | Migrated with limits | DHCP servers on bond interfaces are not supported. |
| DNS configuration and local hosts | Migrated with limits | TFTP options are migrated, but TFTP content is not. Configure `tftp_root` manually to re-enable it. |
| Static IPv4 routes | Migrated | |
| Port forwards | Migrated | If you use port forwarding for an FTP server, you must explicitly enable the FTP conntrack helper on the WAN zone. See [Port Forward](./firewall/port_forward.md) for details. |
| Firewall zones | Migrated | Green → `lan`, red → `wan`, orange → `dmz`, blue → `guest`. If a blue zone existed, DNS and DHCP accept rules are added automatically. |
| Firewall rules | Migrated with conversion | Rules using NDPI services are not supported. Source/destination objects are converted to IP/CIDR values. NAT helpers are loaded automatically. |
| Firewall objects | Not recreated | Objects cannot be reimported automatically. Rules that used objects are converted to the corresponding IP/CIDR values. |
| MultiWAN | Partial | Providers are preserved. Divert rules (policy routing) are not migrated. |
| QoS | Partial | Classes with reserved bandwidth and related rules are not supported. |
| OpenVPN Road Warrior | Partial | Settings are migrated. The accounting database and mail notifications are not migrated. For remote Active Directory auth, see [Remote databases](./users-objects/users_databases.md). |
| OpenVPN tunnels | Migrated | |
| IPSec tunnels | Migrated | |
| Threat Shield IP | Partial | Only enterprise lists are migrated. Community lists must be configured manually. |
| Subscription | Conditional | Migrated only when using the exported archive method. |
| Hotspot | Conditional | On new hardware the MAC address changes — the hotspot must be registered again on the remote manager. |
| Let's Encrypt and reverse proxy certificates | Regenerated | Configuration is migrated, but certificates are regenerated after migration. |
| FlashStart Cloud DNS filter | Migrated | |

### Remapping Examples

- **VLAN remapping**: if VLAN 20 was on `eth1` on the source and `eth1` is mapped to `eth2` on the destination, VLAN 20 is automatically recreated on `eth2`.
- **Firewall object conversion**: if a rule used a host set `BranchOffice` with value `10.20.30.0/24`, the migrated rule keeps `10.20.30.0/24` directly instead of recreating the object.

### Not migrated features

The following features are not migrated to NethSecurity:

- **Web proxy** (Squid) and filter (ufdbGuard): replaced by [Content Filtering](./security/content_filter.md) and [Deep Packet Inspection (DPI)](./security/dpi_filter.md)
- **IPS** (Suricata) and IPS alerts (EveBox): replaced by [Intrusion Prevention System (Snort)](./security/ips.md)
- **UPS monitoring** (NUT): available from command line via [UPS (NUT)](./advanced-cli/ups.md)
- **System statistics** (Collectd): replaced by Netdata in [Real-time monitoring](./monitoring/monitoring.md)
- **Reports** (Dante): replaced by controller metrics in [Metrics](./system/controller.md)
- **Bandwidth monitor** (ntopng): available in [Real-time monitoring](./monitoring/monitoring.md) and [Metrics](./system/controller.md)
- **Fail2ban**: replaced by Threat Shield [brute force protection](./security/threat_shield_ip.md)
- **Threat Shield DNS**: must be reconfigured manually — see [Threat Shield DNS](./security/threat_shield_dns.md)

## Custom Zones

Custom zones are rarely used in NethServer 7 and typically for very specific tasks: defining a network segment with different firewall rules from the primary interface, or managing traffic coming from a network other than the one the interface is connected to.

In NethSecurity, zones work differently and offer simpler management. All previous custom zone configurations can typically be managed **without recreating any custom zone**, thanks to the following default behaviors.

### Policy inheritance for incoming traffic

All traffic arriving on a NethSecurity interface automatically inherits the same policies as the connected interface, regardless of the originating network — including automatic masquerading when traffic is destined for the internet.

**Example:** a local interface "office" operates on `192.168.1.0/24` (zone: `lan`). A gateway at `192.168.1.220` connects to the same switch and provides access to the remote network `10.10.10.0/24`. Traffic from `10.10.10.0/24` needs to reach the internet through NethSecurity. No additional configuration is needed — all packets arriving on the "office" interface are correctly routed and masqueraded.

### No need to create new zones for different segments

Standard firewall rules can be applied to this traffic without creating a new zone. To apply different policies for a specific segment, create standard firewall rules and use a host set with the CIDR network in firewall objects.

### Routing works seamlessly without extra rules

Routing for the specific network segment works correctly without additional rules or zones. In NethServer 7, creating a zone was mandatory to ensure proper routing for incoming packets.

## USB-to-Ethernet adapters

USB-to-Ethernet adapters are **not supported on NethSecurity 8** in production. It is possible to install specific drivers for experimental/temporary use while awaiting hardware with the necessary network cards. More information is in the [network section](./network/network.md).

:::warning
USB-to-Ethernet adapters will not work until the correct driver is installed. NethSecurity 8 may not have the correct driver for the adapter used on NethServer 7. In that case, use a different adapter.
:::

:::note
If a USB-to-Ethernet adapter is used for a RED/WAN interface, you won't be able to download the necessary driver modules unless you have other RED/WAN interfaces running on network cards directly connected to the motherboard.
:::
