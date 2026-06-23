---
title: "MultiWAN"
sidebar_position: 4
---

# MultiWAN

La configurazione MultiWAN (Wide Area Network) è un'impostazione in cui il firewall utilizza contemporaneamente più connessioni Internet da diversi fornitori di servizi Internet (ISP). Questa configurazione mira a migliorare l'affidabilità della rete, aumentare la larghezza di banda e migliorare la velocità di Internet distribuendo il traffico di rete su più collegamenti. Può fornire protezione di failover, garantendo che se una connessione non riesce, il traffico di rete viene automaticamente reindirizzato alla connessione funzionante, riducendo al minimo i tempi di inattività e garantendo un accesso Internet continuo. Le configurazioni MultiWAN sono spesso utilizzate in aziende e organizzazioni che richiedono una connessione Internet altamente disponibile e stabile per le loro operazioni.

La configurazione MultiWAN richiede almeno due interfacce di rete nella zona WAN del sistema. Questo è il requisito fondamentale per implementare una connessione MultiWAN.

La prima volta che accedi alla pagina di configurazione, è obbligatorio creare un criterio predefinito. Questo criterio è essenziale e non può essere eliminato. Il criterio predefinito definisce il comportamento di base del sistema MultiWAN. È necessario specificare il suo comportamento. Sono disponibili due opzioni principali:

- `Bilanciato`: In questa modalità, le connessioni WAN vengono utilizzate simultaneamente e il traffico viene bilanciato in base al peso assegnato a ogni WAN. Il peso WAN può variare da 1 a 1000.
- `Backup`: In modalità backup, la connessione WAN secondaria entra in gioco solo se la connessione primaria non riesce. Questo garantisce una connettività di backup se il WAN primario non riesce.

C'è anche una `modalità personalizzata` che consente una configurazione più dettagliata, particolarmente utile quando si hanno tre o più connessioni WAN. Questa modalità offre maggiore flessibilità nella gestione del traffico tra diverse connessioni WAN.

Nella modalità personalizzata della configurazione Multi-WAN, si applicano i seguenti concetti:

- Livelli di priorità indipendenti: ogni livello di priorità opera indipendentemente dagli altri. Le interfacce WAN in un particolare livello di priorità non influenzano o dipendono dalle interfacce in altri livelli.
- Più interfacce WAN all'interno di un livello di priorità: ogni livello di priorità può contenere due o più interfacce WAN. Queste interfacce sono raggruppate insieme per impostazioni di configurazione specifiche.
- I pesi determinano la distribuzione del traffico: i pesi assegnati alle interfacce WAN all'interno di un livello di priorità determinano il modo in cui il traffico viene distribuito tra queste interfacce. Pesi più elevati indicano una proporzione più elevata di allocazione del traffico.
- La priorità diminuisce con i nuovi livelli: l'aggiunta di un nuovo livello di priorità comporta che le interfacce all'interno di questo livello hanno una priorità inferiore. Vengono utilizzate solo se tutte le interfacce nel livello precedente non riescono.

Considera uno scenario in cui le prime due interfacce WAN sono configurate in modalità bilanciamento e l'ultima interfaccia funge da backup se entrambe le prime due interfacce non riescono:

1.  selezionare le prime due interfacce WAN e impostarle in modalità bilanciamento assegnando pesi a entrambe a seconda delle prestazioni della connessione Internet
2.  aggiungere un nuovo livello di priorità facendo clic sul pulsante **Aggiungi livello di priorità**
3.  selezionare la terza interfaccia WAN e assegnare un peso. Tuttavia, in questo scenario, il peso non influenza la distribuzione del traffico poiché è l'unica interfaccia a questo livello. Funge da backup, entrando in gioco solo se entrambe le interfacce nel livello precedente non riescono.

## Regole di routing

Gli utenti possono creare regole di traffico in uscita basate su criteri specifici come indirizzo IP di origine, indirizzo IP di destinazione, porta/e di origine, porta/e di destinazione e tipi di protocollo IP. Questa funzione di routing basato su criteri consente agli utenti di personalizzare quali connessioni in uscita utilizzano interfacce WAN specifiche, consentendo una configurazione di rete perfezionata.

Ecco come puoi creare una regola personalizzata:

1.  Creare un nuovo criterio: per iniziare a personalizzare il routing del traffico, inizia creando un nuovo criterio. Fai clic sul pulsante **Crea criterio** per avviare il processo.
2.  Creare una nuova regola: quindi fai clic sul pulsante **Crea regola**. Questo passaggio ti consente di definire condizioni specifiche in cui il traffico verrà instradato diversamente dal criterio predefinito.
3.  Assegnare un nome significativo alla regola: assegna un nome descrittivo e significativo alla regola. Questo nome dovrebbe riflettere lo scopo o le condizioni della regola di routing del traffico per una facile identificazione.
4.  Specificare il tipo di traffico: definire i criteri per il traffico che si desidera personalizzare. Questo può includere l'indirizzo IP di origine, l'indirizzo IP di destinazione, protocolli specifici, porte o qualsiasi combinazione di questi fattori. Specificando questi parametri, si restringe l'ambito della regola a un tipo specifico di traffico. Con i campi `Indirizzo di origine` e `Indirizzo di destinazione`, è possibile scegliere dalle seguenti opzioni:
    - Immettere un indirizzo o un intervallo: specificare un singolo indirizzo IP o un CIDR. Solo IPv4 è supportato.
    - Qualsiasi indirizzo: selezionare questa opzione per corrispondere a qualsiasi indirizzo.
    - Selezionare un oggetto firewall: scegliere dall'elenco di oggetti firewall predefiniti.
5.  Selezionare il criterio creato per questo tipo di traffico: scegliere il criterio personalizzato creato nel primo passaggio come preferenza di routing per questo tipo di traffico specifico. Associando la regola a un criterio particolare, stai istruendo il sistema a instradare il traffico definito secondo le impostazioni specificate all'interno di quel criterio.

- Opzione `Sticky`: L'opzione sticky di una regola garantisce che il traffico proveniente dallo stesso indirizzo IP di origine esca sempre attraverso lo stesso WAN per una durata di 10 minuti. Questo può prevenire problemi durante la connessione a siti Web di banche, compagnie assicurative, ecc. Questa opzione è generalmente utilizzata per il traffico HTTPS (443/TCP).

Le seguenti sono le opzioni disponibili per la definizione delle porte del traffico:

- `<port>`: Porta singola
- `<port>,<port>`: Elenco di porte
- `<port>-<endport>`: Intervallo da \<port\> a \<endport\>

## Impostazioni generali

NethSecurity monitora ogni connessione WAN utilizzando test ICMP ripetuti.

La pagina `Impostazioni generali` consente agli utenti di specificare i seguenti parametri:

- Elenco di host da monitorare: gli utenti possono definire un elenco di host (computer, server o dispositivi) che il sistema monitorerà per lo stato di connettività. Questi host vengono controllati per assicurarsi che siano raggiungibili tramite la rete.
- Numero di pacchetti ICMP (ping) da inviare: gli utenti possono impostare il numero di pacchetti ICMP (Internet Control Message Protocol) da inviare durante ogni test di monitoraggio. Impostando il numero di pacchetti, è possibile controllare l'intensità del monitoraggio.
- Determinazione dell'irraggiungibilità dopo quanti test non riusciti: gli utenti possono configurare il sistema per determinare quando una connessione WAN deve essere considerata irraggiungibile. Questo viene fatto specificando una soglia - dopo quanti test consecutivi non riusciti la connessione WAN è considerata irraggiungibile.

## Reimpostare la configurazione

:::warning

Questo ripristinerà effettivamente la configurazione MultiWAN, con una perdita della connessione Internet se nessun WAN è configurato.

:::

Se il firewall è stato precedentemente configurato con due o più interfacce WAN e dopo la riconfigurazione c'è una sola interfaccia WAN, è consigliabile reimpostare la configurazione MultiWAN. Ciò garantirà che il firewall sia configurato correttamente e funzioni come previsto.

    /usr/libexec/rpcd/ns.mwan call clear_config
    uci commit mwan3
    reload_config
