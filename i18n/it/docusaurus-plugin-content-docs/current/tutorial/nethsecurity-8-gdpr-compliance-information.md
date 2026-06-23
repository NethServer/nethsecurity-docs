---
title: "Conformità GDPR"
sidebar_position: 3
---

# Conformità GDPR

Il GDPR non richiede azioni fisse in ogni caso. Si basa sui concetti di responsabilizzazione e
misure adeguate.

Devi quindi eseguire una valutazione del rischio, per esempio quando il firewall è installato in
contesti come strutture sanitarie, e intraprendere azioni commisurate allo scenario reale.
Il tutto si traduce in nomine, procedure e apparati tecnologici adeguati.

La conformità al GDPR di un apparato non implica automaticamente la conformità dell'intera rete.

Detto questo, grazie ai sistemi di protezione attiva, di gestione dei dati e dei log,
NethSecurity 8 è pienamente in linea con le direttive del GDPR in vigore dal 25 maggio 2018,
grazie alle tecnologie avanzate per il controllo e la difesa della rete di cui dispone.

## Base tecnologica OpenWrt

Dal punto di vista tecnologico, NethSecurity 8 è basato su OpenWrt, una distribuzione Linux
specializzata per dispositivi di networking, riconosciuta per la sicurezza, la stabilità e la
trasparenza del codice open source.

OpenWrt fornisce una base solida e sicura per implementazioni enterprise, con aggiornamenti di
sicurezza tempestivi e una community attiva che garantisce la continua evoluzione della
piattaforma.

## Protezione in tempo reale

NethSecurity 8 offre diversi moduli dedicati alla sicurezza avanzata:

- **Threat Shield**: sistema di protezione automatica che blocca in modo proattivo le minacce
  note tramite blacklist dinamiche e threat intelligence
- **Snort IPS/IDS**: sistema di rilevamento e prevenzione delle intrusioni con regole aggiornate
  automaticamente
- **Advanced Application Filter**: Deep Packet Inspection (DPI) per il controllo granulare del
  traffico applicativo
- **Content Filtering**: controllo dei contenuti web basato su categorie
- **Automatic blocking**: meccanismi intelligenti di blocco basati su comportamenti anomali

## Tunnel cifrati (VPN)

I dati che passano nei tunnel VPN di NethSecurity 8 sono cifrati con algoritmi all'avanguardia.
Il sistema supporta tre tecnologie VPN principali per la massima flessibilità e sicurezza.

### Cifratura dei dati OpenVPN

**OpenVPN 2.6** integrato supporta:

**Tunnel net-to-net (Site-to-Site):**

- **Modalità predefinita**: AES-256-GCM (AEAD - Authenticated Encryption)
- **Fallback di compatibilità**: AES-192-CBC per sistemi legacy

**RoadWarrior (Client-to-Site):**

- **Client moderni (2.6+)**: AES-256-GCM, ChaCha20-Poly1305
- **Client legacy**: negoziazione automatica con algoritmi compatibili

**Modalità di cifratura OpenVPN disponibili:** AES-128-GCM, AES-192-GCM, AES-256-GCM,
AES-128-OCB, AES-192-OCB, AES-256-OCB, CHACHA20-POLY1305, AES-128-CBC, AES-192-CBC,
AES-256-CBC, AES-128-CFB, AES-192-CFB, AES-256-CFB, AES-128-OFB, AES-192-OFB,
AES-256-OFB, CAMELLIA-128-CBC, CAMELLIA-192-CBC, CAMELLIA-256-CBC

**Algoritmi di autenticazione OpenVPN:** SHA256, SHA384, SHA512, SHA224, SHA1

### Cifratura dei dati IPsec

- **Cifratura**: AES-128/192/256, 3DES, 128 bit Blowfish-CBC
- **Integrità**: MD5, SHA1, SHA256/384/512, AES CMAC, AES XCBX
- **Gruppi DH**: DH-2, DH-5, DH-14, DH-15, DH-16, DH-17, DH-18, DH-19, DH-20, DH-21,
  Curve25519 (X25519), NewHope-128

### Cifratura WireGuard

**WireGuard** integrato usa solo algoritmi crittografici moderni e sicuri:

- **Cifratura**: ChaCha20-Poly1305 (AEAD)
- **Scambio chiavi**: Curve25519 (ECDH)
- **Hash**: BLAKE2s, SipHash24, HKDF con SHA-256

WireGuard garantisce Perfect Forward Secrecy e prestazioni eccellenti con overhead minimo.

## Strumenti di analisi della rete

Grazie a dashboard interattive e report dettagliati puoi:

- Monitorare in tempo reale il traffico di rete
- Fare analisi storiche (tramite controller)
- Integrare SIEM esterni via syslog

## Gestione avanzata dei log e privacy

**Politica di retention configurabile:**

- La retention dei log è personalizzabile (default: 12 mesi)
- Rotazione automatica per ottimizzare lo spazio

## Backup e continuità operativa

**Backup automatizzati sicuri:**

- Backup cloud cifrato su infrastruttura Nethesis
- Ripristino rapido con rollback point-in-time
- Export/import delle configurazioni per disaster recovery

**Alta affidabilità:**

- Configurazione High Availability con failover automatico
- Sincronizzazione di stato e sessioni attive
- **RTO**: < 5 secondi per failover hardware
- **RPO**: < 1 minuto per sincronizzazione dei dati

## Gestione reti ospiti e segmentazione

**Segmentazione di rete avanzata:**

- Isolamento completo delle reti ospiti dalla rete aziendale
- Micro-segmentazione con regole granulari
- Hotspot captive portal

## Threat intelligence e monitoring

**Nethesis Operation Center (NOC) avanzato:**

- Monitoraggio proattivo 24/7 delle installazioni

## Gestione identità e accessi

**Identity and Access Management (IAM):**

- Integrazione con Active Directory/LDAP
- Autenticazione multi-fattore
- Audit completo degli accessi amministrativi

Per i dettagli sulla creazione di account amministrativi, la configurazione della MFA e la consultazione dei log di audit, vedere [Utenti amministrativi](../administrator-manual/users-objects/administrative_users.md).
