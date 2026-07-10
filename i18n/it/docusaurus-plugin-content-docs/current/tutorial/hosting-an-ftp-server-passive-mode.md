---
title: "Ospitare un server FTP in modalità passiva"
sidebar_position: 8.5
---

# Ospitare un server FTP in modalità passiva

Quando si ospita un server FTP all'interno della propria LAN dietro NethSecurity 8, i client esterni potrebbero non riuscire a scaricare file in modalità passiva per impostazione predefinita.

Per motivi di sicurezza, il firewall gestisce il NAT in modo dinamico e non tiene traccia automaticamente delle porte alte casuali richieste dalle connessioni FTP in modalità passiva.

Per consentire il traffico FTP in modalità passiva, è necessario abilitare esplicitamente l'helper di tracciamento delle connessioni FTP di Netfilter (`conntrack`) sulla zona WAN.

## Passaggi di configurazione

1. Caricare i moduli del kernel dalla pagina **NAT helpers** nell'interfaccia utente.

   Assicurarsi che i moduli del kernel richiesti per il tracciamento FTP e il NAT siano caricati sul sistema:

   ```text
   nf_conntrack_ftp
   nf_nat_ftp
   ```

2. Attivare l'helper FTP sulla zona WAN.

   Eseguire questi comandi UCI tramite SSH per assegnare l'helper FTP all'interfaccia `ns_wan` e disabilitare l'assegnazione automatica degli helper:

   ```bash
   uci set firewall.ns_wan.auto_helper='0'
   uci set firewall.ns_wan.helper='ftp'
   uci commit firewall
   reload_config
   ```

:::tip
Se si sta migrando una configurazione esistente da **NethServer 7**, il passaggio 1 non è necessario. Nei firewall migrati, gli helper sono abilitati per impostazione predefinita per garantire la compatibilità.
:::