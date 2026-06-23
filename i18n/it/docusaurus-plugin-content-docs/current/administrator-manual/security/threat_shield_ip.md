---
title: "Threat shield IP"
sidebar_position: 2
---

# Threat shield IP {#threat_shield_ip-section}

NethSecurity è dotato di vari strumenti e integrazioni utili per contrastare le minacce provenienti da internet. Uno di questi strumenti è Threat Shield IP, che blocca qualsiasi traffico proveniente da indirizzi IP compromessi o ad essi destinato, nonché qualsiasi richiesta indirizzata a nomi host potenzialmente dannosi.

Il servizio può caricare liste di blocco mantenute dalla comunità oppure può affidarsi a liste di blocco di alta qualità, frequentemente aggiornate e mantenute da [Nethesis](https://www.nethesis.it) e [Yoroi](https://yoroi.company), un'azienda leader specializzata in CyberSecurity e membro di [Cyber Threat Alliance](https://www.cyberthreatalliance.org). Le liste nere di Yoroi garantiscono un'efficacia straordinaria e un'elevata affidabilità, minimizzando la possibilità di falsi positivi.

Si noti che per accedere alle liste di blocco di Nethesis e Yoroi, la macchina deve disporre di un valido diritto aggiuntivo per questo servizio.

## Configurazione

Il servizio è disabilitato per impostazione predefinita. Per abilitarlo, navigare alla pagina `Threat shield IP` nella sezione `Sicurezza`. Accedere alla scheda `Impostazioni` e attivare l'interruttore `Stato`.

Quando il servizio è abilitato, la scheda `Blocklist feeds` mostrerà tutte le liste di blocco disponibili. Puoi abilitare o disabilitare ogni lista di blocco utilizzando l'interruttore sul lato destro dell'elenco. Le liste di blocco abilitate verranno aggiornate automaticamente a intervalli regolari. NethSecurity 8 consente l'utilizzo di liste di blocco Community ed Enterprise.

### Liste di blocco Community

Le liste di blocco Community provengono da contributori della comunità e coprono varie aree: blocco degli annunci, blocco del malware, blocco dello spam, blocco dei tracker e così via. NethSecurity le rende disponibili così come sono.

Le liste Community non forniscono una metrica "Affidabilità" standardizzata, pertanto l'interfaccia utente mostra la loro affidabilità come "Sconosciuta". Come euristica pratica, quando il nome della lista contiene un indicatore di gravità o affidabilità (ad esempio "lvl 1", "level 1"), generalmente denota il tasso di falsi positivi più basso e la massima affidabilità; al contrario, i livelli indicati più alti (ad esempio "lvl 2", "lvl 3", "lvl 4") tipicamente implicano una minore affidabilità e un rischio più elevato di voci aggressive o scorrette. Tuttavia, le convenzioni di denominazione variano e non tutti i provider della comunità includono tali indicatori, quindi rivedi sempre i contenuti e lo scopo di una lista della comunità prima di abilitarla in produzione. Il tipo di licenza di utilizzo può variare a seconda del provider, quindi se l'utilizzo non è personale, potrebbe essere necessario contattare il provider.

**Manutenzione delle liste Community**

Ogni lista di blocco è mantenuta dal suo provider specifico. NethSecurity include già gli URL per scaricare i feed, che sono validi al momento del rilascio. Tuttavia, poiché questi URL sono hard-coded, se il provider li modifica, alcuni blocklist potrebbero non essere più scaricabili.

### Liste di blocco Enterprise

:::note

È richiesto un abbonamento

Questa funzione è disponibile solo se il firewall ha un valido [abbonamento Community o Enterprise](../system/subscription.md).

:::

Le liste di blocco Enterprise sono specificamente focalizzate sulla sicurezza e offrono diversi vantaggi rispetto alle liste di blocco mantenute dalla comunità:

1.  **Qualità e accuratezza**: Le liste di blocco Enterprise, come quelle fornite da Nethesis e Yoroi, sono curate e mantenute da rispettabili aziende di cybersicurezza. Queste aziende hanno team dedicati che monitorano e aggiornano continuamente le liste di blocco per garantire che siano accurate ed efficaci nel bloccare il traffico dannoso. Ciò si traduce in un livello più elevato di qualità e accuratezza rispetto alle liste di blocco mantenute dalla comunità, che potrebbero non ricevere lo stesso livello di attenzione e aggiornamenti.
2.  **Tempestività**: Le liste di blocco Enterprise vengono aggiornate frequentemente per includere le minacce più recenti e gli indirizzi IP dannosi. Aziende di cybersicurezza come Nethesis e Yoroi traccia attivamente le minacce emergenti e le aggiungono prontamente ai loro blocklist. Questo assicura che il tuo sistema sia protetto contro le minacce più recenti e in evoluzione.
3.  **Riduzione dei falsi positivi**: I falsi positivi si verificano quando il traffico legittimo viene bloccato per errore. Le liste di blocco Enterprise sono progettate per minimizzare i falsi positivi curando e verificando attentamente gli indirizzi IP e i nomi host elencati. Le aziende dietro ai blocklist Enterprise hanno processi robusti in atto per garantire che solo le entità dannose siano incluse nei blocklist. Questo riduce le possibilità che il traffico legittimo venga bloccato, minimizzando i disturbi alla tua rete o ai tuoi servizi.
4.  **Supporto Enterprise**: Le liste di blocco Enterprise spesso vengono fornite con supporto e servizi aggiuntivi personalizzati per ambienti aziendali. Questo include l'accesso al supporto tecnico, alla documentazione e all'assistenza di integrazione. Se si riscontrano problemi o domande durante l'utilizzo dei blocklist Enterprise, puoi affidarti al supporto fornito dalle aziende di cybersicurezza per risolverli efficacemente.

### Affidabilità

Le liste di blocco Enterprise includono un punteggio "Affidabilità" mostrato nell'interfaccia utente. Il punteggio è espresso come un valore da 1 a 10 e rappresenta la valutazione del provider sulla qualità della lista: valori più alti indicano un'affidabilità maggiore e una minore probabilità di falsi positivi. Questa metrica "Affidabilità" è disponibile solo per le liste Enterprise; le liste Community vengono presentate "così come sono" e mostrano "Sconosciuta" per l'affidabilità.

I blocklist di Yoroi e Nethesis sono blocklist Enterprise. Questi elenchi verranno visualizzati solo se la macchina ha un valido [abbonamento Enterprise o Community](../system/subscription.md) e un valido diritto per il servizio Threat Shield IP.

### Registrazione

La funzione Threat Shield IP include funzionalità avanzate di registrazione per monitorare e tracciare le minacce potenziali. La sezione di registrazione consente di configurare quali tipi di pacchetti bloccati vengono registrati:

1.  Registra i pacchetti bloccati nella catena pre-routing: quando abilitato, questa opzione registra i pacchetti bloccati nella catena pre-routing, che elabora i pacchetti prima che entrino nella tabella di routing.
2.  Registra i pacchetti bloccati nella catena di input: questa opzione, quando attivata, registra i pacchetti bloccati nella catena di input, che gestisce i pacchetti destinati al firewall stesso. Si noti che questa opzione può generare un gran numero di log se il firewall è sottoposto a traffico intenso.
3.  Registra i pacchetti bloccati nella catena forward: abilitare questo registra i pacchetti bloccati nella catena forward, che elabora i pacchetti instradati attraverso il firewall.
4.  Registra i pacchetti bloccati inoltrati dalla LAN: questa opzione registra i pacchetti bloccati quando inoltrati dalla rete locale (LAN).

Queste opzioni di registrazione forniscono un controllo granulare su quali pacchetti bloccati vengono registrati, consentendo di esporre metriche all'interno della sezione [monitoraggio in tempo reale](../monitoring/monitoring.md#real_time_monitoring-section) e [monitoraggio storico](../monitoring/monitoring.md#historical_monitoring-section).

### Allowlist locale {#local_allowlist-section}

A volte potrebbe essere necessario consentire l'accesso a determinati indirizzi IP. Per farlo, puoi utilizzare la scheda `Allowlist locale`. Usa il pulsante **Aggiungi indirizzo** per aggiungere un nuovo indirizzo all'elenco. L'indirizzo può essere un indirizzo IPv4/IPv6 valido con notazione CIDR opzionale, un indirizzo MAC o un nome host completamente qualificato (FQDN).

Ad esempio, l'indirizzo può essere:

- Indirizzo IPv4: 192.168.0.1
- Indirizzo IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
- Indirizzo IPv4 con notazione CIDR: 192.168.0.0/24
- Indirizzo MAC: 00:0a:95:9d:68:16
- Nome host completamente qualificato: example.com

Un commento può essere associato a ciascun indirizzo per facilitarne la gestione.

Puoi aggiungere un commento per fornire informazioni aggiuntive sull'indirizzo, come il suo scopo o il proprietario. Questo può aiutare nell'organizzazione e nella gestione efficace dell'allowlist.

### Blocklist locale {#local_blocklist_ip-section}

Threat Shield IP include una funzionalità di blocklist locale, che ti consente di specificare manualmente gli indirizzi che devono essere sempre bloccati. Questo fornisce un ulteriore livello di personalizzazione della tua configurazione di sicurezza.

Per accedere e personalizzare la blocklist, vai alla scheda `Blocklist locale` nell'interfaccia Threat Shield IP. Usa il pulsante **Aggiungi indirizzo** per includere nuove voci. Ogni voce è composta da un indirizzo e una descrizione. La sintassi valida per l'indirizzo è la stessa dell'[Allowlist locale](#local_allowlist-section).

Quando aggiungi indirizzi alla blocklist locale, assicurati di inserirli correttamente per evitare di bloccare accidentalmente il traffico legittimo. È anche una buona pratica includere un commento descrittivo per ogni voce per aiutare nella futura gestione e auditing della tua blocklist.

## Blocca gli attacchi brute force {#brute_force-section}

Quando Threat Shield IP è abilitato, il sistema inizia automaticamente a controllare i tentativi di attacco brute force ai servizi del firewall. Per impostazione predefinita, i servizi monitorati includono l'accesso SSH e l'accesso all'interfaccia utente di NethSecurity. Il sistema rileva i tentativi di accesso e blocca automaticamente gli IP che non hanno inserito le credenziali corrette.

Per abilitare o disabilitare la protezione brute force, vai alla sezione `Blocca gli attacchi brute force` nell'interfaccia Threat Shield IP, nella scheda `Impostazioni` e usa l'interruttore per attivare o disattivare la funzione.

La funzione può essere personalizzata regolando le seguenti impostazioni:

- `Blocca dopo N accessi non riusciti`: questa impostazione determina il numero di tentativi di accesso non riusciti consentiti prima che un indirizzo IP venga bloccato. Il valore predefinito è generalmente 3, ma può essere regolato secondo necessità. Un valore più basso aumenta la sicurezza ma può anche aumentare il rischio di falsi positivi, come bloccare utenti legittimi che digitano male le loro credenziali.

- `Schemi per rilevare gli attacchi`: questo campo consente di specificare gli schemi che il sistema utilizza per identificare potenziali attacchi brute force. Gli schemi comuni includono:

  - *Esci prima dell'autenticazione da*: rileva i tentativi di autenticazione non riusciti al servizio SSH
  - *autenticazione non riuscita per l'utente*: identifica i tentativi di autenticazione non riusciti all'interfaccia web di NethSecurity
  - *TLS Auth Error*, *TLS handshake failed*, *AUTH_FAILED*: rileva i tentativi di autenticazione non riusciti al servizio OpenVPN

  Puoi aggiungere schemi aggiuntivi utilizzando il pulsante **Aggiungi schema** per personalizzare il meccanismo di rilevamento. Ogni schema può essere un'espressione regolare *grep* valida.

- `Tempo di blocco`: questa impostazione determina la durata per la quale un indirizzo IP rimane bloccato dopo aver superato il numero di tentativi non riusciti consentiti. L'impostazione predefinita è spesso 30 minuti, ma può essere regolata in base ai tuoi requisiti di sicurezza.

Puoi eseguire ulteriori azioni utilizzando la riga di comando; questi sono i comandi supportati:

- Visualizza tutti gli indirizzi IP attualmente nel blocklist: `/etc/init.d/banip survey blocklistv4`
- Cerca un IP specifico nel blocklist: `/etc/init.d/banip search IP_ADDRESS`
- Sblocca un indirizzo IP: `nft delete element inet banIP blocklistv4 { IP_ADDRESS }`

Tieni presente che devi specificare il blocklist corretto nei comandi quando richiesto (`blocklistv4` per IPv4, `blocklistv6` per IPv6).

### Blocca DoS

Threat Shield IP include anche la protezione contro vari tipi di attacchi Denial of Service (DoS). La protezione DoS limita il traffico eccessivo di protocolli specifici, bloccando quel tipo di traffico finché la situazione non si normalizza. Monitora tutto il traffico in entrata WAN per rilevare e bloccare gli attacchi DoS basati su WAN.

- `Blocca DoS ICMP`: quando abilitato, questa opzione protegge dagli attacchi DoS utilizzando il protocollo ICMP (Internet Control Message Protocol). Il limite è impostato a 100 pacchetti al secondo.
- `Blocca DoS TCP SYN`: questa opzione, quando attivata, protegge dagli attacchi DoS basati su TCP limitando il numero di nuove connessioni al secondo. Un pacchetto potrebbe essere considerato non valido se non fa parte di una connessione stabilita o se fa parte di una connessione che è stata chiusa. Il limite è impostato a 10 connessioni al secondo.
- `Blocca DoS UDP`: abilitare questo protegge dagli attacchi DoS basati su User Datagram Protocol (UDP). Il limite è impostato a 100 pacchetti al secondo.
