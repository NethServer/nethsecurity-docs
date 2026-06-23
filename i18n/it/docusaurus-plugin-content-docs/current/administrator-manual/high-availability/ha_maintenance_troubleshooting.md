---
title: "Manutenzione e risoluzione dei problemi"
sidebar_position: 3
---

# Manutenzione e risoluzione dei problemi {#ha_maintenance_and_troubleshooting-section}

## Avvisi

:::note

Sottoscrizione obbligatoria

Questa funzione è disponibile solo se il firewall ha una sottoscrizione valida.

:::

Il cluster HA fornisce monitoraggio automatico e notifiche per aiutare gli amministratori a rispondere rapidamente agli eventi di failover o ai problemi di sincronizzazione.

Sono disponibili i seguenti avvisi:

- **ha:sync:failed**: Attivato quando la sincronizzazione della configurazione tra i nodi primario e secondario non riesce. Di solito indica che il nodo secondario è irraggiungibile a causa di problemi di rete, guasto hardware o interruzione del servizio.
- **ha:primary:failed**: Attivato durante gli eventi di failover quando il nodo primario diventa non disponibile.

## Manutenzione

Il cluster HA è progettato per essere altamente disponibile e richiede una manutenzione minima. Tuttavia, ci sono momenti in cui potrebbe essere necessario eseguire manutenzione su uno dei nodi primario o secondario.

### Nodo secondario

Il nodo secondario può essere spento per manutenzione senza influire sul nodo primario.

1.  Arresta `keepalived` sul **nodo secondario**:

        /etc/init.d/keepalived stop

2.  Esegui la manutenzione.

3.  Avvia `keepalived` sul **nodo secondario**:

        /etc/init.d/keepalived start

### Nodo primario

Il nodo primario può essere spento per manutenzione, il nodo secondario assumerà gli indirizzi IP virtuali e tutti i servizi.

1.  Arresta `keepalived` sul **nodo primario**:

        /etc/init.d/keepalived stop

2.  Esegui la manutenzione.

3.  Avvia `keepalived` sul **nodo primario**:

        /etc/init.d/keepalived start

### Accesso remoto

Il nodo primario è accessibile sia dalle interfacce LAN che WAN. Pertanto, il nodo secondario è accessibile solo dall'interfaccia LAN. Quando ci si connette al nodo secondario da una rete remota, è necessario accedere prima al nodo primario e quindi connettersi al nodo secondario utilizzando SSH.

Dopo aver stabilito la connessione al nodo primario, utilizza il seguente comando per accedere al nodo secondario:

    ns-ha-config ssh-remote

Questo comando stabilirà una connessione SSH al nodo secondario utilizzando la chiave SSH generata durante la configurazione HA.

### Aggiornamento

Il nodo secondario non riceve gli aggiornamenti di sistema automaticamente perché non ha accesso diretto a Internet. Per aggiornare il nodo secondario, è necessario connettersi al nodo primario ed eseguire il comando di aggiornamento sul nodo secondario:

    ns-ha-config upgrade-remote

Questo comando scaricherà l'immagine più recente, la caricherà sul nodo secondario e l'installerà. Come un normale aggiornamento, il nodo secondario si riavvierà dopo l'installazione.

## Risoluzione dei problemi {#troubleshooting_ha-section}

La risoluzione dei problemi della configurazione HA può essere impegnativa, soprattutto se il nodo secondario non è raggiungibile o il nodo primario non risponde come previsto.

Ricorda che il nodo secondario non ha accesso diretto a Internet nel suo normale stato di standby. Pertanto:

- Non può risolvere i nomi DNS esterni.
- Non può raggiungere il Controller o altri portali esterni.
- Non riceverà gli aggiornamenti di sistema.

Le seguenti istruzioni possono aiutarti a identificare e risolvere i problemi comuni. Per iniziare la risoluzione dei problemi, è necessario accedere alla console SSH di entrambi i nodi.

### Identificazione dei nodi

Poiché il nome host del nodo secondario si sincronizza con il primario, il prompt bash cambia per indicare il ruolo del nodo:

- Prompt del nodo primario: `root@NethSec [P]:~#`
- Prompt del nodo secondario: `root@NethSec [S]:~#`

### Stato di Keepalived

Esegui `ns-ha-config status` per controllare le statistiche di Keepalived. Estrai dall'output:

    Keepalived Statistics:
      advert_rcvd: 249
      advert_sent: 0
      become_master: 1
      release_master: 0
      packet_len_err: 0
      advert_interval_err: 0
      ip_ttl_err: 0
      invalid_type_rcvd: 0
      addr_list_err: 0
      invalid_authtype: 0
      authtype_mismatch: 0
      auth_failure: 0
      pri_zero_rcvd: 1
      pri_zero_sent: 0

Su un nodo primario, `master.become_master` dovrebbe essere `1` o più, indicando che ha assunto con successo il ruolo di master. Inoltre, `master.advert.sent` dovrebbe essere maggiore di `0`, indicando che sta inviando attivamente annunci al nodo secondario.

Su un nodo secondario, `master.advert_rcvd` dovrebbe essere maggiore di `0`, indicando che sta ricevendo annunci dal nodo primario. Se `master.become_master` è `0`, significa che il nodo non ha assunto il ruolo di master, il che è previsto per un nodo secondario.

### Traffico VRRP

Il nodo primario invia annunci VRRP al nodo secondario ogni secondo. È possibile controllare il traffico VRRP utilizzando il seguente comando sul nodo primario:

    tcpdump -vnnpi <lan_interface> vrrp

Sostituisci `\<lan_interface\>` con il nome dell'interfaccia LAN (ad esempio, `eth0`).

L'output dovrebbe mostrare pacchetti VRRP inviati dal nodo primario al nodo secondario. Alcuni esempi di output:

    tcpdump: listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
     13:54:16.629467 IP (tos 0xc0, ttl 255, id 19404, offset 0, flags [none], proto VRRP (112), length 44)
     192.168.100.238 > 192.168.100.239: VRRPv2, Advertisement, vrid 100, prio 200, authtype simple, intvl 1s, length 24, addrs(2): 192.168.122.49,192.168.100.240 auth "1655e3d3"

Se lo stesso comando viene eseguito sul nodo secondario, dovrebbe mostrare pacchetti VRRP ricevuti dal nodo primario.

### Log

Tutti i log sono archiviati in `/var/log/messages` su entrambi i nodi.

È possibile esaminare componenti specifici del sistema HA nei log:

- Controlla i log di sincronizzazione rsync:

      grep ns-rsync.sh /var/log/messages

- Esamina le attività di connessione SSH per la sincronizzazione:

      grep dropbear /var/log/messages

- Visualizza i cambiamenti di stato e gli eventi di keepalived:

      grep Keepalived /var/log/messages

- Traccia gli importi della configurazione di rete sul nodo secondario:

      grep "ns-ha: Importing network configuration" /var/log/messages

### Debug

Quando i file di log non sono sufficienti, è possibile abilitare la registrazione di debug per componenti specifici:

Debug dello script `ns-ha-config`:

    bash -x ns-ha-config <action> [<options>]

Visualizza la configurazione attiva di `keepalived`:

    cat /tmp/keepalived.conf

Abilita la registrazione di debug di `keepalived` (sul primario):

    uci set keepalived.primary.debug=1
    uci commit keepalived
    reload_config

Quindi, cerca `Keepalived_vrrp` nel file `/var/log/messages`.

### Ripristina la configurazione

Il comando reset ripristina la configurazione del cluster al suo stato predefinito. Tipicamente, dopo il reset, il nodo primario può continuare a operare normalmente, mentre il nodo secondario, non più utilizzato nel cluster dovrebbe essere ripristinato al valore predefinito per evitare conflitti. Dopo il reset, rimane attiva solo l'interfaccia HA, quindi è necessario un riavvio per completare il processo. Il reset deve essere eseguito localmente sul nodo primario.

Il comando reset:

- Arresta e disabilita `keepalived` e `conntrackd`.
- Rimuove i file di configurazione HA.
- Pulisce la configurazione di `dropbear` incluse le chiavi SSH.

Alla fine, è necessario un riavvio per applicare le modifiche. Basta eseguire:

    ns-ha-config reset
    reboot
