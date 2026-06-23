---
title: "Active Directory LDAP bind issues"
sidebar_position: 4
---

# Active Directory LDAP bind issues

Recent versions of Microsoft Active Directory, including Windows Server 2025, enforce stricter security requirements that can cause LDAP bind operations to fail when NethSecurity tries to connect to a remote AD user database. This tutorial explains how to diagnose the issue, apply the appropriate fix, and configure the AD remote database on NethSecurity to authenticate OpenVPN Road Warrior users.

## Problem description

When you add a Windows Server 2025 (or later) Active Directory as a remote user database on NethSecurity, the LDAP bind may fail with an error such as **"Server is unavailable"** or **"Strong(er) authentication required"**. This happens because Windows Server 2025 disables unsigned LDAP binds by default.

You can reproduce the failure from the NethSecurity console:

```bash
LDAPTLS_REQCERT=never ldapsearch \
  -D 'binduser@example.com' \
  -w 'Password123!' \
  -b 'DC=example,DC=com' \
  -Z \
  -H ldap://192.168.10.100:389
```

If the Domain Controller rejects the connection, you will see errors similar to:

```
ldap_start_tls: Server is unavailable (52)
        additional info: 00000000: LdapErr: DSID-0C09131E, comment: Error initializing SSL/TLS, data 0, v2580
```

## Solutions

Two approaches exist to resolve the bind failure. Choose the one that fits your environment.

### Option 1: configure LDAPS or StartTLS (recommended for production)

Configure the Domain Controller with a valid TLS certificate and enable LDAPS (`ldaps://`, port 636) or StartTLS (`ldap://`, port 389 with **StartTLS** enabled).

On the NethSecurity remote database:
- Use `ldaps://dc.example.com:636` as the **LDAP URI** and leave **StartTLS** disabled, **or**
- Use `ldap://dc.example.com:389` as the **LDAP URI** and enable **StartTLS**.
- If the Domain Controller uses a self-signed certificate, disable **Verify TLS certificate**.

This is the preferred approach for any environment exposed beyond a trusted LAN.

### Option 2: disable LDAP signing on the Domain Controller (for lab / POC)

If you need a quick solution for a proof of concept or an isolated network, you can relax the LDAP signing requirement on the Domain Controller.

On the Domain Controller, open the **Group Policy Management Editor** (`gpedit.msc` or the domain policy manager) and navigate to:

```
Computer Configuration
  → Windows Settings
    → Security Settings
      → Local Policies
        → Security Options
```

Locate and set the following policy:

| Policy | Value |
|--------|-------|
| Domain controller: LDAP server signing requirements | **None** |

Apply the policy and wait for replication (or force it with `gpupdate /force`).

:::warning
Disabling LDAP signing reduces the security of your Active Directory environment by allowing unencrypted, unauthenticated LDAP binds. Only use this approach on isolated or lab networks. For production environments, use [Option 1](#option-1-configure-ldaps-or-starttls-recommended-for-production) instead.
:::

## Configure the remote database on NethSecurity

After fixing the LDAP bind, add the Active Directory as a remote user database:

1. Go to **Users and objects** → **Users databases**.
2. Click **Add remote database**.
3. Fill in the fields as described below.

### Scenario A: authenticate all users in the default Users container

Use this when you want to authenticate any user stored in the default `CN=Users` container of the domain.

| Field | Value |
|-------|-------|
| LDAP URI | `ldap://dc.example.com:389` |
| Type | `Active Directory` |
| Base DN | `dc=example,dc=com` |
| User DN | `cn=Users,dc=example,dc=com` |
| User attribute field | `sAMAccountName` |
| User display name field | `displayName` |
| Custom user bind DN | `%u@example.com` |
| Bind DN | `svcaccount@example.com` |
| Bind password | `<service account password>` |
| StartTLS | disabled (or enabled if using StartTLS fix) |

Replace `example.com` with your domain name and `svcaccount` with a read-only service account created on the Domain Controller for this purpose.

### Scenario B: authenticate users from a specific OU

Use this when you want to restrict VPN access to users belonging to a dedicated Organizational Unit (e.g., `testVPN`).

| Field | Value |
|-------|-------|
| LDAP URI | `ldap://dc.example.com:389` |
| Type | `Active Directory` |
| Base DN | `dc=example,dc=com` |
| User DN | `ou=testVPN,dc=example,dc=com` |
| User attribute field | `sAMAccountName` |
| User display name field | `displayName` |
| Custom user bind DN | `%u@example.com` |
| Bind DN | `svcaccount@example.com` |
| Bind password | `<service account password>` |
| StartTLS | disabled (or enabled if using StartTLS fix) |

Changing `User DN` to the OU path restricts user enumeration and authentication to that container only, so users outside the OU cannot authenticate even if their credentials are valid.
