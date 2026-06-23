---
title: "Oggetti firewall"
sidebar_position: 2
---

# Oggetti firewall

Gli oggetti firewall sono insiemi predefiniti di indirizzi di rete che possono essere utilizzati per semplificare la configurazione del firewall. Questi oggetti consentono di raggruppare indirizzi IP correlati, reti o nomi di dominio in unità riutilizzabili, facilitando la creazione e la manutenzione di regole firewall, port forward e altre politiche di rete.

I vantaggi dell'utilizzo di oggetti firewall includono:

- migliore organizzazione e leggibilità della configurazione del firewall
- riduzione del rischio di errori durante l'inserimento manuale di indirizzi IP o reti
- manutenzione più semplice - l'aggiornamento di un oggetto aggiorna automaticamente tutte le regole associate
- gestione delle regole più efficiente, specialmente per le reti complesse

Gli oggetti firewall sono particolarmente utili quando si hanno più regole che fanno riferimento allo stesso set di indirizzi o quando è necessario modificare frequentemente gruppi di indirizzi. Tuttavia, per configurazioni semplici con solo poche regole statiche, l'utilizzo di oggetti potrebbe non essere necessario e potrebbe aggiungere una complessità inutile.

Il sistema fornisce diversi tipi di oggetti firewall:

- Lease statici (Prenotazioni DHCP): assegnazioni di IP statici per dispositivi specifici
- Record DNS: nomi di dominio associati a indirizzi IP specifici
- Utenti VPN: utenti con indirizzi IP riservati da OpenVPN Road Warrior
- Insiemi di host: gruppi di indirizzi IP, reti o intervalli
- Insiemi di domini: collezioni di nomi di dominio che si risolvono in indirizzi IP

## Lease statici

I [lease statici](../network/dns_dhcp.md#static_leases-section), noti anche come prenotazioni DHCP, consentono di assegnare indirizzi IP fissi a dispositivi specifici sulla rete. Questa funzione combina la comodità del DHCP con la stabilità dell'indirizzamento IP statico.

Vantaggi principali:

- garantisce che i dispositivi ricevano sempre lo stesso indirizzo IP
- consente di associare nomi host facili da ricordare ai dispositivi
- semplifica la gestione della rete e la risoluzione dei problemi

Un lease statico è composto da:

- hostname: Un nome riconoscibile per il dispositivo
- indirizzo IP: L'IP fisso che si desidera assegnare (deve essere entro l'intervallo DHCP)
- indirizzo MAC: L'identificatore hardware univoco del dispositivo

## Record DNS

I [record DNS](../network/dns_dhcp.md#dns_records-section) consentono di creare mapping locali da hostname a indirizzo IP. Questi record locali hanno la priorità sulle query DNS esterne, offrendo un maggiore controllo sulla risoluzione dei nomi sulla rete.

Un record DNS include:

- hostname: Il nome di dominio che si desidera risolvere localmente
- indirizzo IP: L'indirizzo IP corrispondente per l'hostname

Casi d'uso per i record DNS locali:

- creare scorciatoie alle risorse interne (ad esempio, \"intranet.mycompany.local\")
- sovrascrivere il DNS esterno per scopi di test o di sicurezza
- configurare nomi di dominio personalizzati per servizi locali

Utilizzando lease statici e record DNS locali, è possibile creare un ambiente di rete più organizzato e facilmente gestibile. Queste funzioni funzionano perfettamente con altri oggetti firewall come gli insiemi di host, fornendo potenti strumenti per l'amministrazione della rete.

Per istruzioni dettagliate su come creare e gestire lease statici e record DNS, consultare il [capitolo sulla configurazione DHCP e DNS](../network/dns_dhcp.md).

## Utenti VPN

Gli [utenti OpenVPN](../vpn/openvpn_roadwarrior.md) con prenotazioni IP possono essere utilizzati come oggetti firewall, abilitando il controllo dell'accesso di rete specifico per l'utente. Questa funzione si applica sia agli utenti locali che a quelli remoti (LDAP) configurati per l'accesso OpenVPN.

Punti chiave:

- a ogni utente può essere assegnato uno specifico indirizzo IP OpenVPN
- questi utenti possono essere referenziati nelle regole firewall come origine o destinazione
- si applica sia agli utenti locali che a quelli remoti (LDAP)
- consente la creazione di politiche di accesso specifiche per l'utente

Casi d'uso:

- limitare gli utenti OpenVPN a risorse di rete specifiche
- creare elenchi di autorizzazione/negazione basati su utente
- implementare politiche di accesso basate sul tempo per utenti remoti
- monitorare e controllare l'utilizzo della larghezza di banda per singolo utente

Requisiti:

- l'utente ha l'accesso OpenVPN abilitato
- un indirizzo IP specifico è riservato per l'utente

Utilizzando gli utenti OpenVPN come oggetti firewall, è possibile creare un ambiente di rete più sicuro con politiche di accesso legate direttamente alle identità degli utenti.

## Insiemi di host

Gli insiemi di host sono oggetti firewall versatili che consentono di raggruppare più indirizzi IP, reti o intervalli in un'unica unità facilmente gestibile. Questi insiemi possono essere utilizzati in varie regole firewall, semplificando il processo di controllo del traffico per più destinazioni o fonti.

Caratteristiche principali degli insiemi di host:

1.  Supporto versione IP:
    - disponibile sia per indirizzi IPv4 che IPv6
    - ogni insieme di host è specifico per una versione IP
2.  Contenuto flessibile, gli insiemi di host possono includere:
    - singoli indirizzi IP
    - intervalli di rete in notazione CIDR
    - intervalli IP
    - prenotazioni DHCP
    - nomi di record DNS
    - utenti VPN (solo per IPv4)
3.  Gestione facile:
    - creare, modificare o eliminare insiemi di host senza modificare direttamente le regole firewall
    - le modifiche a un insieme di host si applicano automaticamente a tutte le regole che lo utilizzano
4.  Casi d'uso:
    - raggruppare i server aziendali per il controllo dell'accesso
    - creare elenchi di autorizzazione o negazione per segmenti di rete specifici
    - gestire l'accesso remoto per più utenti VPN

:::note

Gli insiemi di host sono completamente supportati nella loro completezza espressiva (IP, CIDR, intervallo, raggruppamenti) all'interno delle regole firewall. Altre pagine potrebbero supportare solo un sottoinsieme ridotto, ad esempio MultiWAN supporta solo singoli indirizzi IP e CIDR. In questi casi, solo gli insiemi di host compatibili verranno visualizzati nei menu a discesa quando si utilizza l'oggetto all'interno della regola.

:::

### Gestisci insiemi di host

Accedi alla pagina `Oggetti` nella sezione `Utenti e oggetti` dal menu della barra laterale sinistra, quindi passa al tab `Insiemi di host`.

La pagina visualizzerà un elenco degli insiemi di host esistenti, inclusi i loro nomi, versioni IP e il numero di record in ogni insieme.

All'interno dell'elenco, puoi trovare anche oggetti host provenienti da altre sezioni come:

- Lease statici
- Record DNS
- Utenti VPN

Questi oggetti possono essere utilizzati negli insiemi di host per creare regole più complesse, ma non possono essere modificati direttamente dalla pagina degli insiemi di host.

Quando un oggetto non viene utilizzato in nessun insieme di host né in nessuna regola firewall, sarà contrassegnato come `non utilizzato` nell'elenco.

Per vedere dove viene utilizzato un oggetto, fai clic sul link `Mostra utilizzi` accanto all'oggetto.

Tieni presente che gli oggetti utilizzati non possono essere eliminati fino a quando non vengono rimossi da tutti gli insiemi di host e dalle regole firewall.

#### Aggiungi un insieme di host

1.  Accedi alla pagina `Oggetti` nella sezione `Utenti e oggetti` dal menu della barra laterale sinistra.
    - Passa al tab `Insiemi di host`
    - Fai clic sul pulsante **Aggiungi insieme di host**
2.  Inserisci il nome dell'insieme di host
    - Nel campo `Nome`, inserisci un nome descrittivo per il tuo insieme di host
    - Utilizza solo lettere e numeri; gli spazi e i caratteri speciali non sono consentiti
    - Scegli un nome che identifichi chiaramente lo scopo del gruppo di host
3.  Seleziona la versione IP
    - In `Versione IP`, scegli tra IPv4 e IPv6
    - Seleziona IPv4 per gli indirizzi di protocollo internet standard
    - Scegli IPv6 se stai utilizzando il nuovo formato di indirizzo espanso
4.  Aggiungi record
    - Nel campo `Record`, puoi aggiungere gli host per questo insieme
    - Fai clic sul menu a discesa per scegliere tra le opzioni predefinite o inserisci un valore personalizzato
    - Puoi aggiungere i seguenti tipi di record:
      - Singoli indirizzi IP (ad esempio, `192.168.1.10`)
      - Reti in notazione CIDR (ad esempio, `10.10.0.0/24`)
      - Intervalli IP (ad esempio, `10.10.1.1-10.10.1.5`)
      - Oggetti creati in precedenza
    - Dopo aver inserito ogni record, fai clic su **Aggiungi record** per includerlo nell'insieme
    - Ripeti questo processo per aggiungere più record secondo necessità
5.  Finalizza l'insieme di host
    - Rivedi tutte le informazioni inserite per verificarne l'accuratezza
    - Se devi rimuovere un record, usa l'icona di eliminazione (cestino) accanto ad esso
    - Una volta soddisfatto della configurazione dell'insieme di host, fai clic su **Aggiungi insieme di host** per crearlo
    - Se devi ricominciare o annullare il processo, fai clic su **Annulla**

## Insiemi di domini {#domain_sets-section}

Gli insiemi di domini sono oggetti firewall che consentono di raggruppare più nomi di dominio in un'unica unità gestibile. Questi insiemi sono particolarmente utili per creare regole basate su indirizzi web anziché su indirizzi IP, che possono cambiare frequentemente per molti siti web.

Caratteristiche principali degli insiemi di domini:

1.  Risoluzione DNS:
    - i nomi di dominio nell'insieme vengono automaticamente risolti in indirizzi IP
    - la risoluzione viene aggiornata periodicamente per garantire l'accuratezza
2.  Supporto versione IP:
    - può essere configurato per IPv4 o IPv6
    - ogni insieme di domini è specifico per una versione IP
3.  Contenuto flessibile, gli insiemi di domini possono includere:
    - nomi di dominio completamente qualificati (ad esempio, `www.example.com`)
    - domini con wildcard (ad esempio, `example.com`, corrisponderà a tutti i sottodomini)
4.  Timeout automatico:
    - i record DNS nell'insieme vengono memorizzati nella cache per una durata specificata
    - un processo di aggiornamento automatico aggiorna la risoluzione periodicamente
5.  Gestione facile:
    - creare, modificare o eliminare insiemi di domini senza modificare direttamente le regole firewall
    - le modifiche a un insieme di domini si applicano automaticamente a tutte le regole che lo utilizzano

Casi d'uso per gli insiemi di domini:

- controllo delle applicazioni: gestire l'accesso ai servizi cloud o ai social media
- sicurezza: creare regole di autorizzazione per domini affidabili
- prevenzione del malware: creare regole di negazione per domini malevoli noti

Vantaggi dell'utilizzo degli insiemi di domini:

- semplificare la gestione delle regole basate su indirizzi web
- gestire automaticamente i cambiamenti di indirizzo IP dei siti web
- ridurre la necessità di aggiornamenti manuali alle regole firewall
- fornire un modo più intuitivo per controllare l'accesso ai servizi basati su web

Quando utilizzare gli insiemi di domini:

- quando è necessario controllare l'accesso a siti web che potrebbero cambiare indirizzi IP
- per l'implementazione di politiche di filtro dei contenuti
- quando si gestisce l'accesso ai servizi cloud o alle applicazioni web
- per la creazione di politiche di sicurezza basate sulla reputazione del dominio

### Timing della cache DNS

Le voci dell'insieme di domini vengono aggiornate quando dnsmasq esegue una nuova ricerca per il dominio. Se la risposta viene fornita dalla cache locale, l'IP non viene aggiunto nuovamente all'insieme.

Vedi [Timing dell'aggiornamento dell'insieme di domini](../network/dns_dhcp.md#dns_dhcp_domain_set_refresh-section) per come il timing della cache influisce sugli aggiornamenti dell'insieme di domini.

### Gestisci insiemi di domini

Accedi alla pagina `Oggetti` nella sezione `Utenti e oggetti` dal menu della barra laterale sinistra, quindi passa al tab `Insiemi di domini`.

La pagina visualizzerà un elenco degli insiemi di domini esistenti, inclusi i loro nomi, versioni IP e il numero di domini in ogni insieme.

Se un insieme di domini non viene utilizzato in nessuna regola firewall, sarà contrassegnato come `non utilizzato` nell'elenco. Per vedere dove viene utilizzato un insieme di domini, fai clic sul link `Mostra utilizzi` accanto all'insieme.

#### Aggiungi un insieme di domini

1.  Accedi all'interfaccia Aggiungi insieme di domini
    - Accedi alla pagina `Oggetti` nella sezione `Utenti e oggetti` dal menu della barra laterale sinistra
    - Passa al tab `Insiemi di domini`
    - Fai clic sul pulsante **Aggiungi insieme di domini**
2.  Inserisci il nome dell'insieme di domini:
    - Nel campo `Nome`, inserisci un nome descrittivo per il tuo insieme di domini
    - Utilizza solo lettere e numeri; gli spazi e i caratteri speciali non sono consentiti
    - Scegli un nome che identifichi chiaramente lo scopo del gruppo di domini
3.  Seleziona la versione IP:
    - In `Versione IP`, scegli tra IPv4 e IPv6
    - I domini inseriti verranno risolti in IPv4 o IPv6 in base alla versione IP selezionata
    - Se è necessario creare un insieme di domini per entrambe le versioni IP, sarà necessario creare insiemi separati per ogni versione
4.  Aggiungi domini:
    - Nel campo `Domini`, puoi aggiungere i domini per questo insieme
    - Inserisci i nomi di dominio nel campo fornito
    - Dopo aver inserito ogni dominio, fai clic su **Aggiungi dominio** per includerlo nell'insieme
    - Ripeti questo processo per aggiungere più domini secondo necessità
5.  Finalizza l'insieme di domini:
    - Rivedi tutte le informazioni inserite per verificarne l'accuratezza
    - Se devi rimuovere un dominio, usa l'icona di eliminazione (cestino) accanto ad esso
    - Una volta soddisfatto della configurazione dell'insieme di domini, fai clic su **Aggiungi insieme di domini** per crearlo
    - Se devi ricominciare o annullare il processo, fai clic su **Annulla**
