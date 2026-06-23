---
title: "DNS & DHCP"
sidebar_position: 2
---

# DNS & DHCP {#dns_dhcp-section}

NethSecurity può fornire servizi DNS e DHCP a ogni rete locale. Questa sezione è suddivisa in 5 schede:

- DHCP e associazione MAC
- Prenotazioni statiche
- Prenotazioni dinamiche
- DNS
- Record DNS
- Scansione rete

## DHCP e associazione MAC {#dhcp_and_mac_binding-section}

Questa sezione consente di abilitare e gestire un server DHCP per ogni rete locale configurata nel tuo NethSecurity. Ogni interfaccia locale è fornita di una scheda dove è possibile abilitare il servizio facendo clic sul pulsante **Modifica**.

Campi disponibili:

- `Associazione MAC`:
  - `Stato`: abilita/disabilita la funzione di associazione MAC-IP per questa interfaccia
  - `Tipo`: è possibile scegliere tra due tipi di associazione MAC-IP:
    - `Associazione debole`: consente host senza prenotazione, blocca IP/MAC non corrispondenti

      **Esempio**: Una rete aziendale dove i dipendenti portano frequentemente i propri dispositivi (BYOD). In questo caso l'associazione debole consente ai dispositivi senza prenotazione di accedere alla rete, ma garantisce che qualsiasi dispositivo con un indirizzo IP/MAC non corrispondente sia bloccato. Ciò offre flessibilità ai dipendenti mantenendo un livello di sicurezza.

    - `Associazione ristretta`: Solo host con prenotazione consentiti, gli altri sono bloccati

      **Esempio**: Una rete aziendale con politiche di sicurezza rigorose. Qui l'associazione ristretta garantisce che solo i dispositivi con una prenotazione preconfigurata possono accedere alla rete. Ciò impedisce ai dipendenti di rubare un IP con autorizzazioni superiori.
- `DHCP`:
  - `Abilita DHCP`: abilita/disabilita il servizio
  - `Inizio intervallo IP`: primo indirizzo IP dell'intervallo DHCP
  - `Fine intervallo IP`: ultimo indirizzo IP dell'intervallo DHCP
  - `Tempo di lease`: tempo di lease (predefinito 1 ora)

**Impostazioni avanzate DHCP**

`Forza l'avvio del server DHCP`

All'avvio, il server DHCP controlla se ci sono altri server DHCP sulla rete. Con questa opzione disabilitata, il server DHCP non verrà attivato se ne viene rilevato un altro sulla rete. Se l'opzione di forzatura è abilitata, il server DHCP verrà avviato anche se ci sono altri server DHCP nella rete.

`Opzione DHCP`

È possibile dichiarare opzioni DHCP molto specifiche, cercando il campo da configurare (ad esempio DNS trasmesso ai client, indirizzo IP tftp e così via) e quindi specificare il valore. Il valore può anche essere un elenco di valori separati da virgola.

Esempio per ignorare il DNS trasmesso ai client con 2 server:

- opzione selezionata: `dns-server`
- valore: `1.1.1.1,8.8.8.8`

Vedi anche [Opzioni personalizzate non standard](#dns_dhcp_custom-section) per ulteriori informazioni sulle opzioni non standard.

## Prenotazioni statiche {#static_leases-section}

Le prenotazioni statiche assegnano indirizzi IP stabili e nomi host simbolici ai client DHCP. L'host è identificato dal suo indirizzo MAC, assegnato un indirizzo IP fisso e fornito di un nome host simbolico per facile riconoscimento.

Fai clic sul pulsante **Aggiungi prenotazione** per aggiungere la prenotazione di un nuovo dispositivo.

Campi disponibili:

- `Nome host`: nome host associato all'indirizzo IP
- `Indirizzo IP`: indirizzo IP da assegnare all'indirizzo MAC specificato. L'indirizzo IP deve essere all'interno dell'intervallo DHCP
- `Indirizzo MAC`: indirizzo MAC del dispositivo per il quale si desidera effettuare la prenotazione
- `Nome prenotazione`: facoltativo, campo liberamente configurabile

## Prenotazioni dinamiche {#dynamic_leases-section}

Le prenotazioni dinamiche rappresentano indirizzi IP attualmente in uso e allocati ai dispositivi sulla rete. Questa scheda mostra tutti i lease attualmente attivi.

:::note

Quando [Storage](../system/storage.md) è configurato, dnsmasq memorizza il file di lease in `/mnt/data/dnsmasq/dhcp.leases`, quindi le prenotazioni dinamiche sopravvivono ai riavvii. Altrimenti continua a utilizzare `/tmp/dhcp.leases`.

:::

### Configurazione predefinita

Per impostazione predefinita, il server DHCP ha un limite di 1000 lease concorrenti per prevenire attacchi DoS. Imposta l'opzione dnsmasq `dhcpleasemax` per modificare il limite.

Esegui questi comandi:

``` bash
uci set dhcp.@dnsmasq[0].dhcpleasemax='2500'
uci commit dhcp
reload_config
```

### Opzioni personalizzate non standard {#dns_dhcp_custom-section}

Oltre alle opzioni DHCP standard, NethSecurity consente di configurare opzioni personalizzate non standard, come l'opzione 82 (Informazioni dell'agente di inoltro DHCP). Queste opzioni possono essere utili per configurazioni avanzate o requisiti di rete specifici.

Per impostare un'opzione personalizzata dalla riga di comando, usa i seguenti comandi:

``` bash
uci add_list dhcp.lan.dhcp_option='82,myvalue'
uci commit dhcp
reload_config
```

Le opzioni personalizzate configurate dalla riga di comando vengono conservate anche quando vengono apportate modifiche tramite l'interfaccia utente. Le opzioni personalizzate possono essere rimosse in sicurezza dall'interfaccia utente.

Tuttavia, gli utenti dovrebbero evitare di modificare queste opzioni personalizzate direttamente dall'interfaccia utente per prevenire comportamenti imprevisti.

## DNS {#dns-section}

Il sistema impiega [Dnsmasq](https://thekelleys.org.uk/dnsmasq/doc.html) come server DNS cache a valle. Dnsmasq funziona come nameserver cache locale, che per impostazione predefinita inoltra le query DNS ai server DNS a monte forniti dal server DHCP delle interfacce WAN. Tuttavia, questo comportamento può essere personalizzato utilizzando le seguenti opzioni di configurazione:

- `Server di inoltro DNS`: fai clic sul pulsante **Aggiungi server DNS** per specificare il DNS a monte desiderato, puoi aggiungere più server, ognuno gestito individualmente.
- `Dominio DNS`: inserisci il dominio DNS locale, assicurando che le query per questo dominio siano sempre risolte localmente.
- `Registra query DNS`: abilitalo se desideri che tutte le query DNS vengano registrate dal sistema.

### Server di inoltro {#forwarding_servers-section}

Devi configurare i forward solo se le tue interfacce WAN sono impostate con indirizzi IP statici. Se le tue interfacce WAN sono configurate tramite DHCP, in genere fornite dal tuo ISP, il sistema utilizzerà automaticamente i server DNS forniti dalle interfacce WAN. I server DNS a monte configurati automaticamente possono essere trovati nel file `/tmp/resolv.conf.d/resolv.conf.auto`.

Puoi configurare quanto segue:

- **Specifica un singolo server DNS a monte:** inserisci l'indirizzo IP del server DNS desiderato nel campo designato.
- **Configura server DNS specifici del dominio:** ciò consente di instradare le query per domini specifici a server diversi.

Per una configurazione DNS incentrata sulla privacy utilizzando connessioni crittografate, consulta [DNS over HTTPS con filtro](../../tutorial/dns-over-https.md) per la configurazione DNS over HTTPS (DoH).

#### Server DNS specifici del dominio

Per utilizzare un server DNS personalizzato per un dominio specifico, utilizza la seguente sintassi:

`/DOMAIN/IP_ADDRESS#PORT`

dove:

- IP_ADDRESS: specifica l'indirizzo IP del server desiderato
- PORT: aggiungi la porta desiderata (dopo l'indirizzo IP utilizzando il carattere `\#`).

Il valore `PORT` è facoltativo, quindi solitamente la configurazione appare così:

`/DOMAIN/IP_ADDRESS`

Queste sono le opzioni principali supportate:

- Dominio vuoto (`//`): corrisponde ai nomi non qualificati (senza punti).
- Dominio specifico (`/google.com/`): corrisponde al dominio esatto e a tutti i suoi sottodomini (ad es. google.com, www.google.com, drive.google.com\...).
- Dominio wildcard (`*google.com/`): corrisponde a qualsiasi dominio **contenente** "google.com" (ad es. google.com, www.google.com, supergoogle.com).

Esempi:

- Invia tutte le query per "google.com" e i suoi sottodomini a 1.2.3.4: `/google.com/1.2.3.4`
- Invia tutti i nomi non qualificati (ad es. "localhost") a 10.0.0.1 e tutto il resto ai server standard: `//10.0.0.1`
- Invia query per il dominio "ad.nethserver.org" e i suoi sottodomini a 192.168.1.1 e tutto il resto ai server standard: `/ad.nethserver.org/192.168.1.1`

I domini più specifici hanno la precedenza sui domini meno specifici, quindi per una configurazione come questa:

- `/google.com/1.2.3.4`
- `/www.google.com/2.3.4.5`

NethSecurity invierà le query per google.com e gmail.google.com a 1.2.3.4, ma www.google.com andrà a 2.3.4.5

Questo è vero anche per i wildcard: se sono definiti sia domini specifici che wildcard per lo stesso modello, quello specifico ha la precedenza (ad es. avendo `/google.com/` e `/*google.com/`: il primo gestirà google.com e www.google.com, il wildcard gestirà supergoogle.com.

### Massimo numero di query DNS concorrenti {#dns_forward_max-section}

Per impostazione predefinita, dnsmasq ha un limite di 150 query DNS concorrenti per prevenire attacchi DoS. Se questo limite viene raggiunto, dnsmasq registrerà un errore e smetterà di elaborare nuove query DNS finché alcune di quelle esistenti non verranno completate.

In questo caso, dnsmasq registrerà un errore simile a:

``` text
May 12 09:27:23 fw1 dnsmasq[1]: Maximum number of concurrent DNS queries reached (max: 150)
```

Per aumentare il limite dalla CLI, esegui i seguenti comandi:

``` bash
uci set dhcp.@dnsmasq[0].dnsforwardmax=5000
uci commit dhcp
reload_config
```

Questa opzione non è esposta nell'interfaccia utente, ma la modifica persisterà negli aggiornamenti e non sarà sovrascritta dall'interfaccia utente.

### Temporizzazione dell'aggiornamento del set di domini {#dns_dhcp_domain_set_refresh-section}

Le voci del [set di domini](../users-objects/objects.md#domain_sets-section) vengono aggiornate quando dnsmasq esegue una nuova ricerca per il dominio. Quando le risposte vengono servite dalla cache locale anziché eseguire una nuova ricerca, gli indirizzi IP non vengono ri-aggiunti al set. Ciò può causare gap intermittenti se l'ipset scade prima della scadenza del TTL DNS, o se la cache impedisce a dnsmasq di eseguire ricerche fresche. Nota che Adblock può alterare il comportamento di dnsmasq e influenzare l'aggiornamento del set di domini.

Un cron job viene eseguito ogni 10 minuti per aggiornare tutti i set di domini, ma dipende anche da dnsmasq che esegue ricerche effettive piuttosto che servire risultati memorizzati nella cache.

Per risolvere i problemi di aggiornamento del set di domini, regola le impostazioni del TTL della cache DNS:

``` text
uci set dhcp.@dnsmasq[0].max_cache_ttl=300
uci set dhcp.@dnsmasq[0].max_ttl=300
uci commit dhcp
reload_config
```

Queste impostazioni garantiscono che le voci memorizzate nella cache scadano tempestivamente, consentendo a dnsmasq di eseguire ricerche fresche e aggiornare correttamente i set di domini. Nota che questa impostazione sovrascriverà il TTL predefinito fornito dai server DNS a monte. Un TTL così basso può aumentare il numero di query inviate ai server DNS a monte, il che può portare ad aumento del traffico di rete e potenziali problemi di prestazioni se i server a monte hanno limiti di velocità o se ci sono molti client che effettuano frequenti richieste DNS. Utilizza questa configurazione con cautela e monitora le prestazioni del sistema dopo averla applicata.

### Protezione dal DNS Rebind

La protezione dal DNS Rebind è una funzione di sicurezza che protegge dagli attacchi di DNS rebinding. Blocca l'uso di intervalli IP privati da parte di domini pubblici, impedendo ai siti Web dannosi di manipolare i browser per effettuare richieste non autorizzate ai dispositivi della rete locale.

La protezione dal DNS Rebind è abilitata per impostazione predefinita su NethSecurity e di solito non ha ripercussioni operative. In presenza di DNS split, risolvendo domini pubblici con risorse interne, la protezione del rebind può portare a problemi di risoluzione. In tali scenari, i potenziali problemi possono essere trovati nel log (`/var/log/messages`), dove possono apparire linee simili a queste:

``` text
Sep 21 13:09:36 fw1 dnsmasq[1]: possible DNS-rebind attack detected: ad.nethesis.it
```

:::note

Per garantire la massima compatibilità e prevenire malfunzionamenti nelle installazioni migrate utilizzando lo strumento dedicato da NethServer 7.9, la protezione dal DNS Rebind è disabilitata, garantendo lo stesso comportamento della versione precedente.

:::

#### Come correggere i problemi di protezione dal DNS rebind

Puoi facilmente correggere questi problemi dalla CLI.

**Soluzione 1**: whitelist il dominio

Metti il dominio specifico in una whitelist (consigliato):

``` bash
uci add_list dhcp.@dnsmasq[0].rebind_domain="nethesis.it"
```

quindi esegui il commit e riavvia:

``` bash
uci commit dhcp
/etc/init.d/dnsmasq restart
```

**Soluzione 2**: disabilita la protezione DNS

Disabilita completamente la protezione dal DNS rebind usando questi comandi:

``` bash
uci set dhcp.@dnsmasq[0].rebind_protection='0'
uci commit dhcp
/etc/init.d/dnsmasq restart
```

#### Come abilitare la protezione dal DNS rebind

Se hai precedentemente disabilitato la protezione del rebind o se la tua configurazione proviene da una migrazione e desideri abilitare la protezione del rebind, è consigliato attivare anche il parametro `rebind_localhost`. Questa impostazione ha effetto esclusivamente quando la protezione del rebind è abilitata e consente le risposte a monte da 127.0.0.0/8, essenziale per i servizi di blacklist basati su DNS. Esegui questi comandi:

``` bash
uci set dhcp.@dnsmasq[0].rebind_protection='1'
uci set dhcp.@dnsmasq[0].rebind_localhost='1'
uci commit dhcp
/etc/init.d/dnsmasq restart
```

## Record DNS {#dns_records-section}

Il sistema può gestire record DNS locali. Quando il server esegue una ricerca DNS, prima cercherà all'interno dei record DNS locali. Se non viene trovato alcun record locale, verrà eseguita una query DNS esterna.

:::note

I record DNS locali sostituiranno sempre i record dai server DNS esterni.

:::

Fai clic sul pulsante **Aggiungi record DNS** per aggiungere un nuovo nome host DNS.

Campi disponibili:

- `Nome host`: nome host DNS
- `Indirizzo IP`: indirizzo IP associato al nome host
- `Nome`: campo facoltativo
- `Record DNS wildcard`: abilitalo se desideri questa risposta per qualsiasi sottodominio che non hai già definito

## Scansione rete {#scan network-section}

Questa sezione descrive la funzione di scansione della rete locale. La pagina consente di scansionare tutte le reti locali disponibili, escludendo le reti WAN. La pagina mostra un elenco delle reti locali rilevate, ogni rete include un pulsante Scansiona rete, selezionando questo pulsante viene avviata una scansione completa della rete scelta.

### Risultati della scansione

Al termine dell'operazione, la pagina mostra una tabella con tutti gli host scoperti. Per ogni host vengono fornite le seguenti informazioni:

- Indirizzo IP
- Indirizzo MAC
- Nome host (se rilevato)
- Descrizione

Puoi selezionare qualsiasi host dalla tabella e creare una voce di record DNS o una prenotazione DHCP utilizzando il rispettivo menu con tre punti.

:::note

Il sistema supporta la scansione solo su reti con una netmask massima di 255.255.240.0 (CIDR /20), che corrisponde a un massimo di 4094 host. Le scansioni su reti più grandi non sono supportate.

:::

## Inoltro DHCP

L'inoltro DHCP consente al firewall di inoltrare le richieste DHCP dai client a un server DHCP esterno. L'inoltro DHCP non è disponibile dall'interfaccia utente, ma è possibile configurarlo dal terminale utilizzando `uci`.

- Sostituisci `\<INTERFACE_NAME\>` con il nome dell'interfaccia su cui l'inoltro DHCP deve ascoltare.
- Sostituisci `\<LOCAL_ADDR\>` con l'indirizzo IP del firewall su quella interfaccia.
- Sostituisci `\<SERVER_ADDR\>` con l'indirizzo IP del server DHCP a monte.

1. Crea una nuova voce di inoltro DHCP:

``` bash
uci add dhcp relay
```

2. Imposta l'interfaccia:

``` bash
uci set dhcp.@relay[-1].interface='<INTERFACE_NAME>'
```

3. Imposta l'indirizzo locale del firewall:

``` bash
uci set dhcp.@relay[-1].local_addr='<LOCAL_ADDR>'
```

4. Imposta l'indirizzo del server DHCP a monte:

``` bash
uci set dhcp.@relay[-1].server_addr='<SERVER_ADDR>'
```

5. Esegui il commit della configurazione:

``` bash
uci commit dhcp
```

6. Ricarica la configurazione del sistema:

``` bash
reload_config
```

### Esempio

``` bash
uci add dhcp relay
uci set dhcp.@relay[-1].interface='LAN'
uci set dhcp.@relay[-1].local_addr='192.168.1.1'
uci set dhcp.@relay[-1].server_addr='192.168.10.100'
uci commit dhcp
reload_config
```

## Riferimenti esterni

- [Documentazione DNS e DHCP di OpenWrt](https://openwrt.org/docs/guide-user/base-system/dhcp)
- [Manuale di Dnsmasq](https://thekelleys.org.uk/dnsmasq/docs/dnsmasq-man.html)
