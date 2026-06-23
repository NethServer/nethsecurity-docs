---
title: "Problemi di bind LDAP con Active Directory"
sidebar_position: 4
---

# Problemi di bind LDAP con Active Directory

Le versioni recenti di Microsoft Active Directory, incluso Windows Server 2025, impongono requisiti di sicurezza più stringenti che possono causare il fallimento delle operazioni di bind LDAP quando NethSecurity tenta di connettersi a un database utenti AD remoto. Questo tutorial spiega come diagnosticare il problema, applicare la correzione appropriata e configurare il database remoto AD su NethSecurity per autenticare gli utenti OpenVPN Road Warrior.

## Descrizione del problema

Quando si aggiunge un Active Directory Windows Server 2025 (o versioni successive) come database utenti remoto su NethSecurity, il bind LDAP può fallire con un errore del tipo **"Server is unavailable"** o **"Strong(er) authentication required"**. Questo avviene perché Windows Server 2025 disabilita per impostazione predefinita i bind LDAP senza firma digitale.

È possibile riprodurre il problema dalla console di NethSecurity:

```bash
LDAPTLS_REQCERT=never ldapsearch \
  -D 'binduser@example.com' \
  -w 'Password123!' \
  -b 'DC=example,DC=com' \
  -Z \
  -H ldap://192.168.10.100:389
```

Se il Domain Controller rifiuta la connessione, verranno visualizzati errori simili a:

```
ldap_start_tls: Server is unavailable (52)
        additional info: 00000000: LdapErr: DSID-0C09131E, comment: Error initializing SSL/TLS, data 0, v2580
```

## Soluzioni

Esistono due approcci per risolvere il problema. Scegliere quello adatto al proprio ambiente.

### Opzione 1: configurare LDAPS o StartTLS (consigliato per la produzione)

Configurare il Domain Controller con un certificato TLS valido e abilitare LDAPS (`ldaps://`, porta 636) o StartTLS (`ldap://`, porta 389 con **StartTLS** abilitato).

Nel database remoto su NethSecurity:
- Usare `ldaps://dc.example.com:636` come **LDAP URI** e lasciare **StartTLS** disabilitato, **oppure**
- Usare `ldap://dc.example.com:389` come **LDAP URI** e abilitare **StartTLS**.
- Se il Domain Controller usa un certificato autofirmato, disabilitare **Verify TLS certificate**.

Questo è l'approccio consigliato per qualsiasi ambiente esposto al di fuori di una LAN protetta.

### Opzione 2: disabilitare la firma LDAP sul Domain Controller (per lab / POC)

Se si ha bisogno di una soluzione rapida per un proof of concept o una rete isolata, è possibile allentare il requisito di firma LDAP sul Domain Controller.

Sul Domain Controller, aprire l'**Editor Criteri di Gruppo** (`gpedit.msc` o la gestione criteri di dominio) e navigare in:

```
Configurazione computer
  → Impostazioni di Windows
    → Impostazioni di sicurezza
      → Criteri locali
        → Opzioni di sicurezza
```

Individuare e configurare la seguente voce:

| Criterio | Valore |
|----------|--------|
| Controllore di dominio: requisiti per la firma del server LDAP | **Nessuno** |

Applicare il criterio e attendere la replica (o forzarla con `gpupdate /force`).

:::warning
Disabilitare la firma LDAP riduce la sicurezza dell'ambiente Active Directory consentendo bind LDAP non cifrati e non autenticati. Usare questo approccio solo su reti isolate o di laboratorio. Per gli ambienti di produzione, utilizzare l'[Opzione 1](#opzione-1-configurare-ldaps-o-starttls-consigliato-per-la-produzione).
:::

## Configurare il database remoto su NethSecurity

Dopo aver risolto il problema di bind LDAP, aggiungere Active Directory come database utenti remoto:

1. Andare su **Users and objects** → **Users databases**.
2. Fare clic su **Add remote database**.
3. Compilare i campi come descritto di seguito.

### Scenario A: autenticare tutti gli utenti nel contenitore Users predefinito

Usare questa configurazione quando si vuole autenticare qualsiasi utente nel contenitore `CN=Users` predefinito del dominio.

| Campo | Valore |
|-------|--------|
| LDAP URI | `ldap://dc.example.com:389` |
| Type | `Active Directory` |
| Base DN | `dc=example,dc=com` |
| User DN | `cn=Users,dc=example,dc=com` |
| User attribute field | `sAMAccountName` |
| User display name field | `displayName` |
| Custom user bind DN | `%u@example.com` |
| Bind DN | `svcaccount@example.com` |
| Bind password | `<password dell'account di servizio>` |
| StartTLS | disabilitato (o abilitato se si usa la correzione StartTLS) |

Sostituire `example.com` con il nome del proprio dominio e `svcaccount` con un account di servizio in sola lettura creato sul Domain Controller per questo scopo.

### Scenario B: autenticare gli utenti di una OU specifica

Usare questa configurazione quando si vuole limitare l'accesso VPN agli utenti appartenenti a una Unità Organizzativa dedicata (ad esempio `testVPN`).

| Campo | Valore |
|-------|--------|
| LDAP URI | `ldap://dc.example.com:389` |
| Type | `Active Directory` |
| Base DN | `dc=example,dc=com` |
| User DN | `ou=testVPN,dc=example,dc=com` |
| User attribute field | `sAMAccountName` |
| User display name field | `displayName` |
| Custom user bind DN | `%u@example.com` |
| Bind DN | `svcaccount@example.com` |
| Bind password | `<password dell'account di servizio>` |
| StartTLS | disabilitato (o abilitato se si usa la correzione StartTLS) |

Impostando `User DN` sul percorso della OU, l'enumerazione e l'autenticazione degli utenti vengono limitate solo a quel contenitore: gli utenti esterni alla OU non possono autenticarsi anche se le loro credenziali sono valide.
