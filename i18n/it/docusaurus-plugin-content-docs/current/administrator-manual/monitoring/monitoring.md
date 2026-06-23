---
title: "Monitoraggio"
sidebar_position: 1
---

# Monitoraggio {#monitoring-section}

NethSecurity fornisce funzionalità di monitoraggio complete per aiutare gli amministratori a tracciare le prestazioni e la salute del firewall. Il monitoraggio è essenziale per garantire il funzionamento ottimale del firewall e identificare i potenziali problemi che potrebbero influenzare la sua funzionalità.

NethSecurity offre 3 visualizzazioni di monitoraggio:

- **Monitoraggio in tempo reale**: sfrutta Telegraf, Netifyd e i log per fornire informazioni immediate sulle prestazioni e lo stato del firewall, con grafici dettagliati e avvisi. Utilizza inoltre l'agente Netify e i log per fornire informazioni immediate sul traffico del firewall, le connessioni VPN e gli eventi di sicurezza.
- **Monitoraggio storico**: Telegraf scrive i suoi dati all'interno di VictoriaMetrics, che salva le metriche in un'archiviazione locale persistente, se disponibile. Il monitoraggio storico locale è disponibile a partire da NethSecurity 8.8 e non richiede un abbonamento.
- **Monitoraggio remoto**: quando il firewall è connesso a un controller, le metriche vengono archiviate anche in remoto utilizzando Prometheus. Ciò consente di preservare le metriche per un periodo più lungo e abilita il monitoraggio centralizzato. Si noti che il controller archivierà le metriche solo se sia il firewall che il controller stesso hanno un abbonamento valido.

## Monitoraggio in tempo reale {#real_time_monitoring-section}

Il monitoraggio in tempo reale è una funzionalità essenziale nei moderni sistemi firewall, che consente agli amministratori di avere una visibilità immediata nel traffico di rete, nelle connessioni VPN e nelle minacce alla sicurezza. In NethSecurity, il monitoraggio in tempo reale fornisce dati in tempo reale, garantendo che i problemi come la congestione della rete, l'accesso non autorizzato e le violazioni della sicurezza siano identificati e mitigati prontamente. Il monitoraggio in tempo reale archivia i dati nella RAM e si ripristina ad ogni riavvio della macchina.

La pagina `Real-time monitor` fornisce una panoramica completa delle prestazioni e dello stato del firewall, con informazioni dettagliate sul traffico di rete. È divisa in quattro sezioni principali: `Traffic`, `Live Flows`, `Top Talkers`, `WAN uplinks`, `VPN` e `Security`.

### Traffico giornaliero

I grafici di seguito leggono i dati dal daemon [dpireport](https://dev.nethsecurity.org/packages/ns-report/):

- `Daily total traffic`: questo contatore mostra il volume totale dei dati trasferiti attraverso il firewall per il giorno corrente.
- `Recent traffic`: l'istogramma del traffico giornaliero rappresenta visivamente il traffico di rete nel tempo, aggiornato ogni 60 minuti. Aiuta a identificare i periodi di intenso utilizzo e analizzare le fluttuazioni del traffico durante il giorno. I picchi o i cali improvvisi potrebbero indicare potenziali problemi di prestazioni o minacce alla sicurezza.
- `Local Hosts`: questo grafico si concentra sugli host interni (locali) e il loro traffico. Aiuta a identificare i dispositivi più attivi sulla rete, facilitando la gestione della larghezza di banda e il rilevamento dei potenziali rischi di sicurezza interni, come i dispositivi compromessi che generano traffico inaspettato.
- `Applications`: questo grafico visualizza il traffico per applicazione, permettendoti di monitorare quale software o servizi stanno generando il maggior traffico. È utile per comprendere il comportamento dell'applicazione, rilevare i servizi che consumano molta larghezza di banda e monitorare la conformità alle politiche di utilizzo.
- `Remote Hosts`: questo grafico elenca gli host esterni (remoti) che hanno scambiato il maggior numero di dati con la rete. Analizzando questi dati, gli amministratori possono tracciare le interazioni con entità esterne specifiche, aiutando a rilevare fonti esterne dannose o modelli di traffico in uscita insoliti.
- `Protocol`: questo grafico mostra il breakdown del traffico giornaliero per protocollo (ad esempio, HTTP, HTTPS, FTP). È utile per identificare quali protocolli stanno consumando la maggior parte della larghezza di banda e garantire che le risorse di rete vengano utilizzate in modo appropriato. Un utilizzo elevato di protocolli sconosciuti potrebbe indicare attività non autorizzate.

È possibile restringere la ricerca per un host specifico, un'applicazione o un protocollo facendo clic sull'etichetta corrispondente nella tabella sotto il grafico.

### Live Flows

La sezione Live Flows fornisce una visualizzazione in tempo reale di tutte le connessioni di rete attive, consentendo agli amministratori di monitorare il traffico mentre accade. Questa sezione è visualizzata in un formato tabella, con ogni riga che rappresenta un singolo flusso. La tabella include le seguenti informazioni per ogni connessione:

- `Application`: l'applicazione rilevata che genera il traffico.
- `Protocol`: il protocollo di rete utilizzato per il flusso (ad esempio TCP, UDP, HTTP).
- `Tags`: tutti i tag rilevanti assegnati al flusso per la classificazione (ad esempio Outgoing, Remote, Internal)
- `Source`: l'origine della connessione, che mostra generalmente l'indirizzo IP e la porta del dispositivo che avvia.
- `Destination`: la destinazione della connessione, che mostra generalmente il nome host o l'indirizzo IP e la porta del dispositivo di destinazione.
- `Download`: la velocità di trasferimento di download corrente del flusso, indicando la velocità con cui vengono ricevuti i dati.
- `Upload`: la velocità di trasferimento di upload corrente del flusso, indicando la velocità con cui vengono inviati i dati.
- `Duration`: il tempo totale in cui il flusso è stato attivo dal momento in cui è stato rilevato per la prima volta. Ciò aiuta a comprendere per quanto tempo una particolare connessione è stata mantenuta.
- `Last Seen At`: il timestamp dell'attività più recente per il flusso, questo indica quando il flusso ha trasmesso o ricevuto dati l'ultima volta, aiutando a identificare le connessioni inattive o inattive.
- `Details`: l'icona della lente d'ingrandimento con un segno più, facendo clic su questa icona si apre una visualizzazione dettagliata del flusso, mostrando tutte le informazioni disponibili, inclusi i dati non direttamente visualizzati nella tabella principale. Questo consente agli amministratori di accedere ai metadati di flusso completi per un'analisi più approfondita o la risoluzione dei problemi.

Questa tabella in tempo reale consente agli operatori di identificare rapidamente gli utenti pesanti, monitorare il comportamento dell'applicazione e risolvere i problemi di rete mentre si verificano.

#### Configurazione

La sezione Live Flows include anche opzioni di configurazione per gestire il comportamento del servizio di monitoraggio dei flussi:

- `Flows Daemon Enabled`: un interruttore per abilitare o disabilitare il servizio di monitoraggio dei flussi in tempo reale, spegnere il daemon interrompe la raccolta dei dati di flusso in tempo reale.
- `Flows Persistence After Expiration`: un'impostazione che determina per quanto tempo i record di flusso vengono conservati dopo la fine del flusso, questo consente agli amministratori di regolare la conservazione dei dati in base alle esigenze di monitoraggio e alla disponibilità di archiviazione.

### Top Talkers

Lo scopo principale della sezione Top Talkers è fornire una panoramica iniziale dell'utilizzo della larghezza di banda, identificando rapidamente i "contributori" principali al traffico di rete. Queste informazioni possono servire come punto di partenza per un'analisi più approfondita, la risoluzione dei problemi o il monitoraggio generale dell'efficienza della rete.

La sezione Top Talkers visualizza i dati di traffico aggiornati ogni 30 secondi, fornendo una panoramica rapida e aggiornata di quali entità stanno generando il maggior traffico di rete. È divisa in tre categorie:

- `Local Hosts`: elenca tutti gli host locali rilevati e il loro stato di traffico corrente, ordinati per volume di traffico. Ciò ti consente di identificare rapidamente quali dispositivi stanno utilizzando la maggior parte della larghezza di banda, senza distinguere il tipo di connessione o il protocollo.
- `Applications`: mostra tutte le applicazioni rilevate e il loro traffico corrente, ordinato per volume. Questa visualizzazione aiuta a comprendere quali servizi o applicazioni stanno consumando la maggior parte delle risorse di rete, indipendentemente dal dispositivo che li esegue.
- `Protocols`: elenca tutti i protocolli rilevati e il loro traffico corrente, ordinato per volume. Questo fornisce una comprensione immediata di quali tipi di traffico (ad esempio, HTTP, DNS, SMTP) stanno dominando la rete, senza considerare quale host o applicazione li sta generando.

### WAN uplinks

La sezione WAN uplinks fornisce una panoramica delle connessioni WAN, incluso lo stato, l'allocazione della larghezza di banda e i dati di traffico.

Questa pagina mostra le seguenti informazioni:

- `WANs`: elenco delle connessioni WAN con il loro stato corrente (UP/DOWN) e indirizzo IP pubblico. Le informazioni sullo stato aiutano a garantire che le connessioni di rete critiche siano online, e qualsiasi disattivazione è affrontata immediatamente. I dati provengono dallo stato mwan3 del firewall.
- `WAN events`: questa sezione elenca i recenti eventi di connessione e disconnessione WAN dalle ultime 24 ore, fornendo informazioni sulla stabilità della rete e sulle interruzioni. Aiuta gli amministratori a comprendere la frequenza e la durata dei disturbi della rete, facilitando la risoluzione dei problemi e la pianificazione della capacità. I dati vengono recuperati dai log degli ultimi 24 ore. Se i log non coprono l'intero periodo di 24 ore, i dati potrebbero essere incompleti. I risultati vengono memorizzati nella cache per 5 minuti.
- `WAN interface traffic`: questo istogramma mostra i dati di traffico per ogni connessione WAN negli ultimi 60 minuti. Aiuta a tracciare le prestazioni in tempo reale e a diagnosticare i problemi come il bilanciamento del carico non uniforme o la saturazione del collegamento WAN.
- `Latency to <address>`: questa sezione fornisce dati di latenza in tempo reale per un indirizzo IP specifico configurato all'interno del modulo [Ping latency monitoring](#ping_latency-section). Il grafico aiuta a monitorare le prestazioni della rete e identificare i potenziali problemi di connettività.
- `Packet delivery rate to <address>`: questa sezione fornisce dati sulla velocità di consegna dei pacchetti in tempo reale per un indirizzo IP specifico configurato all'interno del modulo [Ping latency monitoring](#ping_latency-section). Se la velocità è inferiore al 100%, potrebbe indicare congestione della rete o problemi di connettività.

### VPN

La sezione VPN fornisce informazioni dettagliate sui server OpenVPN Road Warrior, sui tunnel OpenVPN e sui tunnel IPsec.

Per ogni server OpenVPN Road Warrior, vengono visualizzate le seguenti informazioni:

- `Status`: questa sezione mostra lo stato corrente del server OpenVPN. Aiuta gli amministratori a monitorare la disponibilità del servizio VPN e a rilevare eventuali problemi che potrebbero influire sulla connettività degli utenti.
- `Connected clients`: mostra il numero totale di utenti attualmente registrati sul server VPN. Il monitoraggio degli utenti registrati è cruciale per garantire la pianificazione della capacità e le prestazioni della VPN, in particolare quando il sistema si avvicina al massimo utilizzo.
- `Total traffic by hour`: questo grafico mostra il totale dei dati trasferiti da tutti i client VPN durante ogni ora, fornendo una panoramica dell'utilizzo della larghezza di banda della VPN. Aiuta a tracciare la quantità di traffico di rete generato dalla VPN e a identificare le ore con utilizzo pesante, che potrebbe causare problemi di prestazioni.
- `Daily connections`: questa sezione elenca tutti gli utenti VPN attualmente connessi e l'ora in cui si sono connessi. È utile per tracciare la durata della sessione e rilevare il potenziale abuso della VPN, come le connessioni che durano insolitamente a lungo. I dati provengono dal database di connessione SQLite locale.
- `Connected clients by hour`: questo grafico visualizza il numero di client connessi alla VPN nel corso del tempo. Consente agli amministratori di monitorare l'attività della VPN durante il giorno, aiutando a identificare i tempi di picco e pianificare una capacità aumentata quando necessario. I dati provengono dal database di connessione SQLite locale.
- `Client traffic by hour`: questo grafico suddivide il traffico della VPN per singoli client nel corso del tempo. Aiuta a rilevare gli utenti che potrebbero consumare eccessivamente la larghezza di banda o impegnarsi in attività non autorizzate, aiutando nell'identificazione di potenziali minacce interne. I dati provengono dal database di connessione SQLite locale.

La sezione Site-to-Site VPN fornisce informazioni su tunnel OpenVPN e IPsec:

- `Connected tunnels`: questo contatore mostra il numero di tunnel VPN site-to-site attivi.
- `Configured tunnels`: questo contatore mostra l'elenco di tutti i tunnel VPN site-to-site configurati, incluso il loro stato e tipo.
- `Tunnel traffic`: questo istogramma fornisce dati di traffico in tempo reale per ogni tunnel VPN site-to-site negli ultimi 60 minuti. Aiuta a rilevare i problemi come il basso throughput o l'instabilità della connessione.

### Sicurezza

La sezione di sicurezza fornisce informazioni sul rilevamento del malware e il monitoraggio degli attacchi, aiutando gli amministratori a identificare e mitigare le minacce alla sicurezza. Per abilitare questa sezione, il modulo [Threat shield IP](../security/threat_shield_ip.md) deve essere abilitato. I dati provengono da log che coprono le ultime 24 ore. Se i log non si estendono all'intero periodo di 24 ore, i dati potrebbero essere incompleti. I risultati vengono memorizzati nella cache per 5 minuti per migliorare le prestazioni.

La sezione `Blocklist` fornisce una panoramica dei pacchetti bloccati in base alle liste di blocco abilitate. I grafici disponibili sono:

- `Blocked threats`: questo contatore mostra il numero totale di pacchetti bloccati dal firewall a causa del rilevamento del malware per il giorno corrente. Fornisce una chiara panoramica del volume di minacce intercettate, dando agli amministratori una misura dell'efficacia del firewall.
- `Blocked threats by hour`: questo grafico traccia il numero di pacchetti bloccati ogni ora. Aiuta a identificare i momenti della giornata in cui la rete è più vulnerabile agli attacchi, facilitando le misure preventive.
- `Threats by direction`: un grafico che mostra la distribuzione del malware bloccato per catena firewall. A seconda di quale opzione di registrazione è abilitata, il firewall può registrare i pacchetti dalle seguenti catene:
  - *inp-wan*: pacchetti provenienti dall'interfaccia WAN e destinati al firewall
  - *fwd-wan*: pacchetti provenienti dall'interfaccia WAN e destinati alla rete LAN
  - *fwd-lan*: pacchetti provenienti dalla rete LAN e destinati all'interfaccia WAN
  - *pre-ct*: pacchetti di inondazione che sono in uno stato non valido
  - *pre-syn*: pacchetti di inondazione che fanno parte di una connessione TCP e sono nello stato SYN
  - *pre-udp*: pacchetti di inondazione che fanno parte di una connessione UDP
- `Threats by category`: un grafico che suddivide il malware bloccato per categoria, aiutando gli amministratori a trovare le liste di blocco più efficaci.

La sezione `Brute force attacks` fornisce informazioni sul numero di IP bloccati in base al numero di tentativi di accesso non riusciti. I dati provengono da log che coprono le ultime 24 ore. Se i log non si estendono all'intero periodo di 24 ore, i dati potrebbero essere incompleti. I risultati vengono memorizzati nella cache per 5 minuti per migliorare le prestazioni. I grafici disponibili sono:

- `Blocked IP addresses`: questo contatore mostra il numero totale di indirizzi IP bloccati a causa di attività dannose per il giorno corrente. Aiuta a tracciare il volume dei tentativi di intrusione.
- `Blocked IP addresses by hour`: questo grafico traccia il numero di indirizzi IP bloccati nel tempo, aiutando a identificare i periodi di maggiore attività di attacco.
- `Most frequently blocked IP address`: questo grafico mostra gli indirizzi IP che sono stati bloccati più frequentemente. È utile per identificare minacce persistenti o fonti di attacco che dovrebbero essere investigate o inserite in una lista nera.

## Monitoraggio storico {#historical_monitoring-section}

A partire da NethSecurity 8.8, la pagina Monitoring include una nuova visualizzazione `Metrics` basata su VictoriaMetrics, Telegraf e vmalert. Telegraf legge le metriche e le scrive in VictoriaMetrics, mentre vmalert valuta le regole di avviso. VictoriaMetrics archivia i dati nella RAM per impostazione predefinita, ma passa automaticamente all'archiviazione persistente quando disponibile. Se l'archiviazione locale viene rimossa, il sistema torna all'archiviazione RAM.

Di conseguenza, le metriche di NethSecurity 8.8 rimangono persistenti anche senza un controller.

I periodi di conservazione dei dati sono i seguenti:

- **Archiviazione RAM**: 7 giorni
- **Archiviazione persistente**: 1 anno

La pagina `Metrics` ha due schede: `Charts` e `Alerts`.

### Grafici

La scheda `Charts` mostra i seguenti grafici:

- `CPU usage`
- `System load`
- `Disk I/O`
- `Disk usage (%)`
- `Total processes`
- `RAM usage`
- `Network interface traffic`: un grafico per ogni interfaccia configurata sull'unità
- `Network packets`
- `Connections (conntrack)`
- `Latency`: un grafico per ogni host ping configurato
- `Packet delivery`: un grafico per ogni host ping configurato, configurato all'interno della sezione [Ping latency monitoring](#ping_latency-section)

L'intervallo di tempo del grafico può essere modificato tra 5 minuti, 30 minuti, 1 ora, 12 ore, 24 ore e 7 giorni.

#### Monitoraggio latenza ping {#ping_latency-section}

Configura lo strumento di monitoraggio per valutare il tempo di andata e ritorno e la perdita di pacchetti trasmettendo messaggi ping ai host di rete. Questo strumento viene utilizzato per monitorare la qualità della connettività di rete. Hai la possibilità di includere uno o più host per il monitoraggio, ed è anche possibile aggiungere indirizzi IP all'interno di una VPN per valutare la qualità del tunnel.

Per monitorare un nuovo host o indirizzo IP, fai clic sul pulsante **Add host** e inserisci le informazioni richieste, infine fai clic sul pulsante **Save** per confermare le modifiche.

Le modifiche vengono applicate immediatamente. Per rimuovere un host dall'elenco, fai clic sull'icona di eliminazione.

Puoi vedere i grafici di latenza e consegna dei pacchetti nella pagina `Metrics` dopo aver configurato gli host.

### Avvisi {#alert-section}

Il sistema di avviso dà priorità solo agli avvisi che hanno il potenziale di interrompere o compromettere la funzionalità del firewall. Concentrandosi su indicatori critici, gli amministratori possono affrontare in modo efficiente i problemi che rappresentano una vera minaccia per la sicurezza e il funzionamento del firewall.

La scheda `Alerts` legge gli avvisi attuali in sospeso e in fase di attivazione da vmalert. Questi avvisi vengono visualizzati localmente nella pagina `Metrics` e nel cassetto di notifica aperto dall'icona della campana nell'angolo in alto a destra.

Avvisi disponibili:

- `BackupEncryptionDisabled`: la crittografia dei backup è disabilitata perché `/etc/backup.pass` è mancante o vuoto.
- `HighCpuUsage`: l'utilizzo della CPU è superiore al 70%.
- `CriticalCpuUsage`: l'utilizzo della CPU è superiore all'85%.
- `HighMemoryUsage`: l'utilizzo della memoria è superiore all'80%.
- `CriticalMemoryUsage`: l'utilizzo della memoria è superiore al 90%.
- `DiskSpaceWarning`: un file system montato è superiore all'80% di utilizzo.
- `DiskSpaceCritical`: un file system montato è superiore al 90% di utilizzo.
- `HighSystemLoad`: il carico del sistema per CPU è superiore a 2.
- `WanDown`: un'interfaccia WAN monitorata è offline.
- `ServiceDown`: un servizio `procd` configurato non è in esecuzione.
- `StorageStatus`: l'archiviazione dei dati configurata non è montata o è in errore.

#### Notifiche di avviso remoto

Se il server ha un [abbonamento](../system/subscription.md) valido, le notifiche di avviso vengono inviate senza problemi ai server remoti per il monitoraggio centralizzato e la gestione. Sia `my.nethesis.it` che `my.nethserver.com` fungono da hub centrali per la ricezione degli avvisi, consentendo agli amministratori di rimanere informati sullo stato del firewall e di rispondere prontamente a qualsiasi situazione critica.

Attualmente, solo i seguenti avvisi vengono inoltrati ai server di monitoraggio remoto:

- Spazio su disco: l'avviso di spazio su disco si attiva quando lo spazio su disco disponibile nel sistema raggiunge un livello critico. Questa notifica proattiva aiuta a prevenire le interruzioni affrontando i problemi di spazio su disco prima che influiscano sul funzionamento del firewall.
- Stato MultiWAN (Up/Down): questo avviso notifica gli amministratori quando ci sono modifiche nello stato di MultiWAN, indicando se le connessioni sono attive o disattive. La consapevolezza tempestiva dei cambiamenti nello stato di MultiWAN è cruciale per mantenere una connettività Internet continua e affidabile.

Altri avvisi, come l'utilizzo della CPU e della memoria, non vengono inoltrati ai server di monitoraggio remoto in questo momento.

## Monitoraggio remoto {#remote_monitoring-section}

:::note

Abbonamento richiesto

Questa funzione è disponibile solo se il firewall e il controller hanno un abbonamento valido.

:::

Il monitoraggio storico è disponibile localmente sull'unità e in remoto sul controller quando il firewall è connesso ad esso. Tutti i dati vengono inviati automaticamente al controller e archiviati in Prometheus, consentendo la conservazione a lungo termine e il monitoraggio centralizzato.

La pagina `Controller` mostrerà un messaggio che indica che il monitoraggio remoto è disabilitato.

Per abilitarlo, seguire questi passaggi:

1.  Disconnettere l'unità dal controller.
2.  Assicurati che NethServer 8 dove è installato il controller abbia un abbonamento valido.
3.  Ricollega l'unità al controller.

Vedi [controller metrics](../system/controller.md#controller_metrics-section) per ulteriori informazioni.

:::note

Se l'unità era connessa al controller prima dell'attivazione dell'abbonamento, il monitoraggio remoto non verrà abilitato automaticamente. Per abilitarlo, è necessario disconnettere l'unità dal controller e ricollegarla dopo che l'abbonamento è attivo.

:::

### Legacy Netdata {#legacy_netdata-section}

:::warning

A partire da 8.8, Netdata è stato deprecato e rimosso dall'installazione predefinita. Se hai ancora dashboard Grafana personalizzati che si basano su metriche Netdata, è consigliabile passare al nuovo formato Telegraf.

:::

NethSecurity 8.7.2 e versioni precedenti utilizzano [Netdata](https://www.netdata.cloud/) come strumento di monitoraggio in tempo reale. Netdata è uno strumento di monitoraggio delle prestazioni e troubleshooting in tempo reale, open-source, per sistemi e applicazioni. Fornisce informazioni approfondite sulle prestazioni e la salute di sistemi e applicazioni attraverso visualizzazioni e metriche dettagliate. Netdata è progettato per essere leggero, veloce e facile da usare.

Netdata è abilitato per impostazione predefinita su NethSecurity 8.7.2 e versioni precedenti ed è accessibile dalla rete LAN. Per accedervi, vai alla pagina `Monitoring` e fai clic sul pulsante **Open report** dalla scheda `Real-time report`.

Le metriche Netdata vengono salvate nella RAM e verranno ripristinate ad ogni riavvio della macchina. Se il firewall è connesso al [controller remoto](../system/controller.md), le metriche verranno archiviate nel controller stesso e preservate tra i riavvii.

### Installa Netdata su NethSecurity 8.8 {#install-netdata-on-nethsecurity-8.8}

Se hai configurato dashboard Grafana personalizzati che si basano su metriche Netdata nel Controller, si interromperanno dopo l'aggiornamento a NethSecurity 8.8 poiché Netdata è stato rimosso.

Per ripristinare i dashboard, puoi reinstallare Netdata manualmente su NethSecurity 8.8 utilizzando il seguente comando:

    apk update
    apk add netdata

Tuttavia, si consiglia vivamente di migrare i dashboard personalizzati al nuovo formato Telegraf. Ciò garantisce una migliore compatibilità a lungo termine e il supporto, poiché Netdata non è più mantenuto come parte di NethSecurity.
