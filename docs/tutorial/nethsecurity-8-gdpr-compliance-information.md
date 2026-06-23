---
title: "GDPR compliance"
sidebar_position: 3
---

# GDPR compliance

GDPR does not require fixed actions in every case. It is based on accountability and
appropriate measures.

You must therefore perform a risk assessment, for example when the firewall is deployed in
contexts such as healthcare facilities, and take actions that match the actual scenario.
This becomes a mix of appointments, procedures, and suitable technology.

GDPR compliance for a device does not automatically mean compliance for the whole network.

That said, thanks to active protection systems, data management, and log management,
NethSecurity 8 is fully aligned with the GDPR directives in force since 25 May 2018, thanks to
the advanced technologies it provides for network control and defense.

## OpenWrt technology base

At the technology level, NethSecurity 8 is based on OpenWrt, a Linux distribution specialized
for networking devices and known for security, stability, and open source code transparency.

OpenWrt provides a solid and secure base for enterprise deployments, with timely security
updates and an active community that keeps the platform evolving.

## Real-time protection

NethSecurity 8 provides several modules dedicated to advanced security:

- **Threat Shield**: automatic protection system that proactively blocks known threats through
  dynamic blacklists and threat intelligence
- **Snort IPS/IDS**: intrusion detection and prevention system with automatically updated rules
- **Advanced Application Filter**: Deep Packet Inspection (DPI) for granular control of
  application traffic
- **Content Filtering**: web content control based on categories
- **Automatic blocking**: intelligent blocking mechanisms based on anomalous behavior

## Encrypted tunnels (VPN)

Data passing through NethSecurity 8 VPN tunnels is encrypted with state-of-the-art algorithms.
The system supports three main VPN technologies for maximum flexibility and security.

### OpenVPN data encryption

Integrated **OpenVPN 2.6** supports:

**Net-to-net tunnels (Site-to-Site):**

- **Default mode**: AES-256-GCM (AEAD - Authenticated Encryption)
- **Compatibility fallback**: AES-192-CBC for legacy systems

**RoadWarrior (Client-to-Site):**

- **Modern clients (2.6+)**: AES-256-GCM, ChaCha20-Poly1305
- **Legacy clients**: automatic negotiation with compatible algorithms

**Available OpenVPN encryption modes:** AES-128-GCM, AES-192-GCM, AES-256-GCM,
AES-128-OCB, AES-192-OCB, AES-256-OCB, CHACHA20-POLY1305, AES-128-CBC, AES-192-CBC,
AES-256-CBC, AES-128-CFB, AES-192-CFB, AES-256-CFB, AES-128-OFB, AES-192-OFB,
AES-256-OFB, CAMELLIA-128-CBC, CAMELLIA-192-CBC, CAMELLIA-256-CBC

**OpenVPN authentication algorithms:** SHA256, SHA384, SHA512, SHA224, SHA1

### IPsec data encryption

- **Encryption**: AES-128/192/256, 3DES, 128-bit Blowfish-CBC
- **Integrity**: MD5, SHA1, SHA256/384/512, AES CMAC, AES XCBX
- **DH Groups**: DH-2, DH-5, DH-14, DH-15, DH-16, DH-17, DH-18, DH-19, DH-20, DH-21,
  Curve25519 (X25519), NewHope-128

### WireGuard encryption

Integrated **WireGuard** uses only modern and secure cryptographic algorithms:

- **Encryption**: ChaCha20-Poly1305 (AEAD)
- **Key exchange**: Curve25519 (ECDH)
- **Hash**: BLAKE2s, SipHash24, HKDF with SHA-256

WireGuard guarantees Perfect Forward Secrecy and excellent performance with minimal overhead.

## Network analysis tools

Thanks to interactive dashboards and detailed reports, you can:

- Monitor network traffic in real time
- Perform historical analysis (through controller)
- Integrate with external SIEM systems via syslog

## Advanced log management and privacy

**Configurable retention policy:**

- Log retention can be customized (default: 12 months)
- Automatic rotation to optimize space usage

## Backup and business continuity

**Secure automated backups:**

- Encrypted cloud backup on Nethesis infrastructure
- Fast restore with point-in-time rollback
- Export/import configurations for disaster recovery

**High availability:**

- High Availability configuration with automatic failover
- State and active session synchronization
- **RTO**: < 5 seconds for hardware failover
- **RPO**: < 1 minute for data synchronization

## Guest network management and segmentation

**Advanced network segmentation:**

- Complete isolation of guest networks from the corporate network
- Micro-segmentation with granular rules
- Captive portal hotspot

## Threat intelligence and monitoring

**Advanced Nethesis Operation Center (NOC):**

- Proactive 24/7 monitoring of installations

## Identity and access management

**Identity and Access Management (IAM):**

- Active Directory/LDAP integration
- Multi-factor authentication
- Full audit of administrative access

For details on creating administrative accounts, configuring MFA, and reviewing audit logs, see [Administrative users](../administrator-manual/users-objects/administrative_users.md).
