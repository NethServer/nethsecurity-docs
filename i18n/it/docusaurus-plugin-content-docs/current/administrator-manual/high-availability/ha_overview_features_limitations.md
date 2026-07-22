---
title: "Panoramica, caratteristiche, limitazioni"
sidebar_position: 1
---

# Panoramica, caratteristiche, limitazioni {#ha_overview_features_limitations-section}

La disponibilità elevata (HA) di NethSecurity garantisce il funzionamento continuo della rete fornendo ridondanza attraverso un cluster di due firewall. Se il firewall primario si guasta a causa di problemi hardware, problemi software o manutenzione, un firewall di backup assume automaticamente tutti i servizi di rete e la gestione del traffico, riducendo al minimo i tempi di inattività.

Questo è fondamentale per le aziende o le organizzazioni in cui l'accesso ininterrotto a Internet, la connettività VPN e i servizi di sicurezza sono essenziali per le operazioni quotidiane, prevenendo la perdita di produttività o ricavi durante un'interruzione.

## Concetti chiave

Alcuni concetti chiave da comprendere prima di configurare l'HA:

- **Nodo Primario**: Il firewall che gestisce attivamente il traffico e i servizi.
- **Nodo Secondario (o di backup)**: Il firewall che assume automaticamente il controllo in caso di guasto del nodo primario.
- **IP Virtuale (VIP)**: Un indirizzo IP condiviso utilizzato da entrambi i nodi per ogni interfaccia configurata per garantire l'accesso ininterrotto dei client ai servizi. I client sulla rete devono *sempre* utilizzare l'indirizzo VIP (ad esempio, come gateway, server DNS o endpoint VPN) per garantire un failover trasparente.

### Ruoli HA

- **Master**
  - Il nodo che attualmente ha tutte le interfacce attive ed elabora tutto il traffico di rete
  - In condizioni normali, il Nodo Primario opera in questo stato.
- **Backup**
  - Il nodo che non elabora il traffico di rete.
  - In condizioni normali, il Nodo Secondario opera in questo stato.

Le modifiche alla configurazione devono **sempre** essere effettuate sul **nodo primario**. Il nodo secondario deve essere considerato di sola lettura. L'unica eccezione è la configurazione di rete delle interfacce LAN che fanno parte del cluster HA.

Tutte le altre configurazioni rilevanti, come le regole del firewall, le impostazioni VPN o le regole di Threat Shield, vengono sincronizzate automaticamente dal nodo primario a quello secondario.

Ecco come funziona il sistema HA:

- **Heartbeat**: I firewall primario e secondario verificano continuamente lo stato l'uno dell'altro utilizzando il protocollo VRRP. Se il primario si guasta, il secondario assume il controllo. Il protocollo VRRP viene trasportato su un'interfaccia LAN dedicata chiamata **interfaccia HA**, maggiori informazioni saranno fornite in una sezione successiva.
- **Sincronizzazione delle impostazioni**: Il firewall primario invia in modo sicuro le sue impostazioni, inclusi i dettagli sulle connessioni attive come VPN e route di rete, al firewall secondario. Questa sincronizzazione avviene automaticamente ogni 10 minuti. Tenere presente questo intervallo quando si testa il cluster: vedere [Testare il failover](./ha_setup_and_management.md#testing-failover) per maggiori dettagli.
- Il sistema regola automaticamente cosa fa ogni firewall in base al fatto che sia l'unità attiva (primaria) o di standby (secondaria):
  - **Il secondario riceve gli aggiornamenti di configurazione**: Quando il firewall secondario riceve nuove impostazioni, le salva ma mantiene i servizi correlati (come le VPN) disattivati. Il firewall secondario contiene una copia completa della configurazione del primario ma mantiene la maggior parte dei processi in background inattivi. Ciò include cose come il controllo degli aggiornamenti software, l'esecuzione di backup remoti o l'invio di report. Ciò garantisce che solo il firewall primario attivo gestisca questi compiti, prevenendo conflitti.
  - **Il firewall diventa attivo**: Quando un firewall assume il controllo come primario (all'avvio normale o durante un failover), attiva tutti i servizi e le connessioni necessari.
  - **Il firewall diventa di standby**: Quando un firewall è in modalità backup (all'avvio o quando il primario torna online), disattiva la maggior parte dei servizi e delle connessioni.

Sebbene il sistema HA sia progettato per essere il più automatico possibile, alcune configurazioni richiedono un intervento manuale. Ad esempio, se aggiungi una nuova interfaccia di rete LAN o ne modifichi una esistente, devi informare il sistema HA di questi cambiamenti.

## Caratteristiche supportate e limitazioni

Il cluster HA supporta la sincronizzazione per un'ampia gamma di caratteristiche, incluse:

- Regole del firewall, port forwarding, DHCP, DNS
- Configurazioni VPN (OpenVPN, IPsec, WireGuard)
- QoS, Multi-WAN, regole DPI
- Reverse proxy, certificati ACME e altro ancora.
- Route statiche
- Configurazione dell'informatica Netifyd
- Threat shield IP (banip)
- Threat shield DNS (adblock)
- Database di utenti e oggetti
- Netmap
- Flashstart
- Server SNMP (snmpd)
- Helper NAT
- DNS dinamico (ddns)
- Client SMTP (msmtp)
- Password di crittografia del backup
- Connessione del controller e sottoscrizione (ns-plug)
- Tracciamento delle connessioni attive (conntrackd)
- Hotspot (dedalo) solo su interfacce fisiche

### Tipi di interfaccia WAN e configurazioni

- Indirizzi IPv4 e IPv6 statici
- IPv4 via DHCP
- Interfacce Ethernet fisiche
- Interfacce bond (link aggregation) composte da interfacce fisiche
- Interfacce bridge su interfacce fisiche
- VLAN su interfacce fisiche, interfacce bond o interfacce bridge
- PPPoE su interfacce fisiche o su interfacce VLAN

### Limitazioni delle Interfacce

- Solo IPv4 è supportato su interfacce LAN
- L'interfaccia HA deve essere un'interfaccia fisica
- I bond e i bridge sono supportati solo per interfacce LAN aggiuntive e WAN, non per l'interfaccia HA
- L'Hotspot è supportato solo su interfacce fisiche
- Se hai eseguito la migrazione da NethServer 7, i dispositivi bond con nomi lunghi (come `bond-bond0`) non sono compatibili con HA. Vedi la sezione relativa alla correzione della denominazione bond per le istruzioni su come rinominarli.

### Limitazioni generali

- I pacchetti extra non inclusi nell'immagine non sono supportati (ad esempio NUT, etherwake, ecc.)
- La configurazione del daemon syslog (rsyslog) non viene sincronizzata: se devi inviare i log a un server remoto, devi utilizzare il controller.
- Dopo la prima sincronizzazione, il nodo secondario avrà lo stesso nome host del nodo primario. L'interfaccia utente web mostrerà il nome host del nodo primario, ma la dashboard indicherà il ruolo del nodo (primario o secondario). Inoltre, quando accedi alla console SSH, il prompt cambierà per indicare il ruolo del nodo. Vedi la sezione [Risoluzione dei problemi](./ha_maintenance_troubleshooting.md#troubleshooting_ha-section) per maggiori dettagli.

### Sincronizzazione e conservazione dei log

L'HA sincronizza la configurazione, le sessioni attive e lo stato di runtime tra i nodi del cluster per garantire la continuità dei servizi durante il failover. I log e i dati di reporting, come i log di sistema o i database della cronologia OpenVPN Road Warrior, **non** vengono sincronizzati tra i nodi HA. Per la conservazione centralizzata e la reportistica unificata, utilizza il controller.
