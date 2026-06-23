---
title: "Introduzione"
sidebar_position: 1
---

# Introduzione

## Informazioni su NethSecurity

NethSecurity è una soluzione Unified Threat Management (UTM) che fornisce una suite completa di funzioni di sicurezza, inclusi firewall, content filtering, deep packet inspection (DPI) utilizzando Netifyd, hotspot, VPN e un controller remoto opzionale. È progettato per essere facile da installare e configurare, il che lo rende una buona scelta sia per le piccole e medie imprese (PMI) che per le organizzazioni enterprise.

NethSecurity è basato su [OpenWrt](https://openwrt.org), una popolare distribuzione Linux per dispositivi embedded. Questo offre una serie di vantaggi, tra cui:

- flessibilità: può essere installato su un'ampia gamma di hardware
- personalizzazione: può essere personalizzato per soddisfare le esigenze specifiche di ogni organizzazione
- supporto della comunità: beneficia della grande e attiva [comunità NethServer](https://community.nethserver.org)

NethSecurity include una varietà di funzioni di sicurezza, tra cui:

- Firewall: il firewall di NethSecurity fornisce ispezione e filtraggio dei pacchetti con stato per proteggere le reti da accessi non autorizzati
- Filtraggio dei contenuti DNS: la funzione di content filtering di NethSecurity blocca gli utenti dall'accesso a siti Web inappropriati o dannosi
- Deep Packet Inspection (DPI): NethSecurity utilizza Netifyd per eseguire DPI, che gli consente di ispezionare il contenuto dei pacchetti e identificare il traffico dannoso o indesiderato
- [Icaro hotspot](https://nethesis.github.io/icaro/): Icaro hotspot è una soluzione di captive portal che può essere utilizzata per gestire e autenticare gli utenti su reti wireless.
- VPN: OpenVPN, IPSec e Wireguard sono protocolli VPN open-source popolari che possono essere utilizzati per creare tunnel sicuri tra reti.
- Controller remoto: NethSecurity offre una funzione di controller remoto che consente agli amministratori di gestire centralmente più installazioni di NethSecurity da una singola interfaccia.
- Informativa sulla privacy: per affrontare i requisiti di privacy, utilizzare questo [comando](../installation/remote_access.md#privacy_policy-section) per abilitare un collegamento all'Informativa sulla privacy nella home page.

Oltre a queste funzioni di sicurezza, NethSecurity include anche una serie di altre funzioni, come:

- quality of service (QoS): la funzione QoS di NethSecurity consente agli amministratori di dare priorità al traffico e garantire che le applicazioni critiche abbiano sempre la larghezza di banda di cui hanno bisogno.
- Supporto IPv6: NethSecurity supporta IPv6, il protocollo Internet di nuova generazione

## Ottenere supporto

Desideri saperne di più o cercare aiuto? Consulta la nostra fantastica [comunità](https://community.nethserver.org)!

Se stai cercando ulteriori dettagli tecnici, dai un'occhiata al [manuale degli sviluppatori](https://nethserver.github.io/nethsecurity/).

I bug possono essere discussi e segnalati all'interno del [forum della comunità](https://community.nethserver.org). Un tracker dei problemi pubblico è disponibile su [GitHub](https://github.com/NethServer/nethsecurity/issues).
