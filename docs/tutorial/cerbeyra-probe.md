---
title: "Cerbeyra probe"
sidebar_position: 14
---
# Cerbeyra probe

## About Cerbeyra

[Cerbeyra](https://www.cerbeyra.com/) is a security platform that provides two core services to help organizations stay on top of their security posture:

- **Vulnerability Assessment**: automated scanning and analysis of systems to identify security weaknesses, misconfigurations, and known vulnerabilities. The service classifies and prioritizes findings so you can remediate the most critical issues first.
- **Asset Management**: continuous discovery and tracking of all devices and software in your network. Keeping an accurate inventory of assets is the foundation of any effective security program — you cannot protect what you do not know exists.

To perform vulnerability scans against your network, Cerbeyra needs a VPN tunnel into the network being assessed.

## Probe Script

The script configures NethSecurity 8 as a **VPN probe (OpenVPN server)** for Cerbeyra vulnerability assessments. It automates the creation of an OpenVPN server, generation of the client configuration, and the associated firewall rules.

By default, the first configured LAN is scanned. To modify or add LAN networks, use the **Local Networks** field of the `cerbeyra` OpenVPN tunnel server.

## Requirements

- NethSecurity 8
- Run the script as **root**
- A free UDP port (default: **1201**). The script verifies port availability before proceeding.
- Run in a maintenance window; the script restarts OpenVPN.

## Main variables (fixed in the script)

- `VPN_CIDR` = `10.244.162.0/24` — range assigned to the server/tunnel
- `VPN_PORT` = `1201` — port used by the OpenVPN server
- `SERVICE_NAME` = `cerbeyra` — service name used for identifiers
- `REMOTE_NETWORK` = `172.30.29.0/24` — Cerbeyra dummy network (not used in routing)
- `ALLOWED_SOURCE` = `91.143.200.128/25` — Cerbeyra remote network allowed to initiate the VPN

The script can auto-detect the gateway's public IP, or you can supply it with the `-p <public_ip>` option.

## Command-Line Options

- `-i` : **Interactive mode** — prompts for confirmation before each action.
- `-r` : **Remove mode** — removes a previously applied Cerbeyra configuration (asks for confirmation if `-i` is active).
- `-p <public_ip>` : provides the public IP to use for the tunnel (otherwise the script attempts auto-detection).

Example for non-interactive execution with an explicit public IP:

```bash
./cerbeyra-config.sh -p 1.2.3.4
```

## Installation

1. Download the script:

```bash
curl "https://docs.nethsecurity.org/_static/tutorial/cerbeyra-probe/cerbeyra-config.sh" -o cerbeyra-config.sh
```

2. Set ownership and permissions:

```bash
chown root:root cerbeyra-config.sh
chmod 700 cerbeyra-config.sh
```

3. Run the script:

```bash
# Interactive mode (recommended for first run):
./cerbeyra-config.sh -i

# Non-interactive with explicit public IP:
./cerbeyra-config.sh -p 1.2.3.4
```

## Recommended Procedure

1. **Backup**: take a backup before proceeding.
2. Verify port `1201` is free (the script checks too):

```bash
netstat -uln | grep 1201
```

3. Plan a maintenance window: warn users that existing OpenVPN connections may drop.
4. Run the script as root (with `-i` if you want confirmations):

```bash
./cerbeyra-config.sh -i
```

5. **Connectivity test**: test the VPN using the Cerbeyra dashboard test, or import the OpenVPN tunnel `.json` into another NethSecurity 8.

## Removing the Configuration

Use the `-r` option to automatically remove the created entries (asks for confirmation if `-i` is active):

```bash
./cerbeyra-config.sh -r
```

Alternatively, restore the backup files created during the pre-check phase and restart the services.

## Troubleshooting

- **No traffic after connecting**: check firewall rules and OpenVPN logs.
- **Testing with another NethSecurity**: add the IP to the firewall rule **Input → Allow-ovpncerbeyra**.

## Operational Recommendations

- Always **back up** configurations before running the script.
- Run in a maintenance window (impacts on existing VPN connections).
- After execution, any reconfiguration or advanced VPN management can be done through the NethSecurity **UI**.
