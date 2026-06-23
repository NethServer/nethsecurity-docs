---
title: "Note di rilascio"
sidebar_position: 2
---

# Note di rilascio

Changelog dei rilasci di NethSecurity.

- Elenco dei [bug noti](https://github.com/NethServer/nethsecurity/issues?q=is%3Aissue%20is%3Aopen%20type%3ABug%20)
- Discussioni sui [possibili bug](http://community.nethserver.org/c/bug)

## Principali modifiche il 2026-06-25

Versione immagine: `8.8.0-beta1` (basata su OpenWrt 25.12.4)

**Nuove funzionalità**

- NethSecurity è stato ribasato su OpenWrt 25.12.4 e il sistema di gestione dei pacchetti è stato cambiato da `opkg` a `apk`.
- Il monitoraggio ora archivia le metriche in VictoriaMetrics e utilizza automaticamente l'archiviazione persistente quando disponibile.
- Gli avvisi sono ora accessibili dall'interfaccia web.
- La cronologia di Bash è stata preservata tra i riavvii e `/var` persistente è stata abilitata quando l'archiviazione è disponibile.
- Il pacchetto Avahi (mDNS) è stato aggiunto al repository di NethSecurity.
- È stata aggiunta l'azione del firewall `DON\'T TRACK`.
- Diverse funzionalità precedentemente limitate alle versioni basate su sottoscrizione sono ora disponibili nell'edizione Community.

**Miglioramenti**

- Snort è stato aggiornato con vectorscan per migliorare le prestazioni.
- OpenVPN è stato aggiornato alla versione 2.7.4.
- strongSwan è stato aggiornato alla versione 6.0.3.
- È stata migliorata la gestione del repository dei pacchetti e la firma per la nuova immagine di base.
- Netdata non è più installato per impostazione predefinita; i dashboard del controller legacy possono ancora ripristinarlo manualmente.
- I leasing DHCP sono ora persistenti se l'archiviazione locale è disponibile, prevenendo la perdita di leasing al riavvio.
- Le modifiche all'elenco locale DNS di Threat Shield vengono ora applicate utilizzando il pulsante commit, come tutte le altre opzioni di Threat Shield.

**Correzioni di bug**

- Gli errori DNS/DHCP ora mostrano informazioni di risoluzione dei problemi più chiare: se dnamsq non riesce ad avviarsi, l'interfaccia web visualizzerà un avviso.
- Adblock non si riavvia più con elenchi vuoti dopo ripetute modifiche alla blocklist o allowlist.
- Le opzioni di registrazione del traffico sono mostrate in modo coerente nell'interfaccia del firewall.
- Il tunnel IPSec può ora utilizzare l'azione dpd_action di riavvio.

## Principali modifiche il 2026-03-25

Versione immagine: `8.7.2` (basata su OpenWrt 24.10.5)

:::warning

Se stai ripristinando un backup dalla versione 8-24.10.0-ns.1.6.0 o precedente, consulta la sezione [Ripristino del backup da versioni precedenti](#restore_old_backup_bug-section) alla fine di questa sezione.

:::

**Nuove funzionalità**

- Monitoraggio del flusso di rete in tempo reale: visualizza i flussi attivi con metriche dettagliate (sorgente, destinazione, protocollo, applicazione, larghezza di banda) attraverso l'integrazione del motore netifyd ridisegnata.
- Miglioramenti della scansione di rete: aggiunte funzionalità di ordinamento e filtro per i risultati della scansione di rete, simili ai leasing statici e dinamici.
- Configurazione MTU del peer WireGuard: consente la modifica dell'MTU per i peer di WireGuard per ottimizzare le connessioni su reti con vincoli specifici.

**Miglioramenti**

- Nginx è stato aggiornato alla versione upstream per migliorare il profilo di sicurezza e ridurre i rilevamenti di vulnerabilità falsi positivi.
- DNS di Threat Shield: rimosso l'indicatore di confidenza dalle blocklist basate sulla comunità per ridurre la confusione; l'indicatore di confidenza viene ora visualizzato solo per gli elenchi Yoroi aziendali.
- Scansione di rete: migliorata la visibilità delle prenotazioni IP e risolto il problema di risoluzione del nome host per tutti i dispositivi scansionati.

**Correzioni di bug**

- Proxy inverso: corretto il comportamento incoerente del certificato predefinito; ora applica correttamente il certificato predefinito sia all'interfaccia di amministrazione che ai servizi di proxy inverso.
- WireGuard: corretti i problemi di risposta DNS non raggiunti dai client a causa del formato dell'indirizzo errato (notazione CIDR mancante).
- WireGuard: rimossi i duplicati di voci vuote nella configurazione dell'elenco allowed_ips.
- WireGuard: risolto il problema in cui la zona WireGuard era erroneamente disponibile per altri tipi di interfaccia.
- Port Forwarding: corretto il controllo della convalida dell'interfaccia utente per la selezione del protocollo "ALL"; ora disabilita correttamente i campi della porta e previene la miscelazione con altri protocolli.
- Snort/IPS: risolto l'errore di configurazione su sistemi con più di 16 core CPU logici; ora limita correttamente il conteggio dei thread e della coda al massimo di 16.
- Flashstart: corretto il problema dei dati IP ignorati che venivano ancora reindirizzati alla regola DNS catch-all; i bypass ora eludono correttamente il filtro catch-all.
- Flashstart: modificato dal riavvio forzato del firewall al ricaricamento graduale durante l'aggiornamento della configurazione ProPlus, prevenendo le perdite di connessione durante gli aggiornamenti.
- OpenVPN Roadwarrior: aggiunta la funzionalità di rinnovo del certificato e la visibilità della data di scadenza (certificati CA e server); gli avvisi vengono visualizzati per i certificati entro un mese dalla scadenza.
- MultiWAN: risolto il problema di modifica della regola per conservare le opzioni di origine e destinazione precedentemente configurate invece di tornare ai valori predefiniti.
- QoS: corretti i valori invertiti della larghezza di banda di caricamento/download per le interfacce non WAN (LAN).
- Bonding di rete: aggiunte impostazioni predefinite di monitoraggio dei link (monitoraggio MII ogni 100 ms) per garantire che la modalità active-backup commuti correttamente all'interfaccia di backup.
- Migrazione: risolto il problema per cui le regole del firewall erano erroneamente etichettate come "automatiche" dopo la migrazione; le regole sono ora correttamente modificabili.
- Interfacce di rete: risolto il problema di corrispondenza della regex VLAN dopo la migrazione in cui le VLAN sui bridge (ad es. br111.112) venivano erroneamente analizzate come bridge.
- DPI: corretto il controllo del limite di registrazione; impostata la sintassi di nftables appropriata codificata in modo da prevenire gli errori di ricaricamento del firewall.
- PPPoE: risolti gli arresti anomali di pppd con SIGILL durante la negoziazione LCP su ISP specifici; disabilitato FORTIFY_SOURCE per risolvere i problemi di memcpy.
- Gateway predefinito WireGuard: risolto il problema del gateway predefinito mancante dopo la disconnessione del tunnel su sistemi single-WAN; assegnato la metrica predefinita appropriata per le interfacce WAN.
- Configurazione WireGuard: risolti gli errori invisibili quando l'indirizzo IP pubblico non può essere risolto; ora gestisce gli errori di risoluzione DNS senza bloccare l'installazione.

### Ripristino del backup da versioni precedenti {#restore_old_backup_bug-section}

Quando si ripristina un backup dalla versione 8-24.10.0-ns.1.6.0 o precedente, l'interfaccia utente e il proxy inverso potrebbero non essere disponibili perché nginx non riesce ad avviarsi. In questo caso, è possibile verificare eventuali problemi eseguendo:

> /usr/sbin/nginx -c /etc/nginx/uci.conf -T

Potrebbe verificarsi un errore di configurazione nginx: :

    "module \"ngx_http_ubus_module\" is already loaded"

Ciò accade perché il vecchio backup contiene il file `/etc/nginx/module.d/luci.module`, che entra in conflitto con la nuova versione upstream di nginx. Per risolvere, eseguire: :

    rm -f /etc/nginx/module.d/luci.module && /etc/init.d/nginx restart 

## Principali modifiche il 2025-10-30

Versione immagine: `8.7.1` (basata su OpenWrt 24.10.3)

**Correzioni di bug**

- Risolto il problema in cui dnsmasq poteva essere fermato da keepalived anche quando non in modalità HA.

## Principali modifiche il 2025-10-29

Versione immagine: `8.7.0` (basata su OpenWrt 24.10.3)

**Nuove funzionalità**

- L'alta disponibilità è ora pronta per la produzione dopo test estesi e ridisegno; il design è cambiato dalla versione beta e richiede una riconfigurazione.
- Nuova interfaccia utente del tunnel WireGuard per creare e gestire VPN direttamente dall'interfaccia, con supporto per più server e condivisione tramite file o codice QR. I tunnel WireGuard configurati dalla riga di comando esistenti vengono migrati automaticamente nella nuova interfaccia utente.
- Gestione migliorata della protezione DDoS e flood; configurazione centralizzata in IP di Threat Shield.
- Aggiunto elenco di URL locale consentiti a DNS di Threat Shield per un controllo più granulare.
- Modelli di configurazione automatica introdotti per le zone GUEST e DMZ.
- Aggiunta l'opzione per scaricare i backup non crittografati localmente utilizzando un pulsante dedicato.
- I server DNS configurati manualmente ora hanno sempre la precedenza su quelli forniti dall'ISP tramite DHCP o PPPoE.
- Comportamento DHCP migliorato con FlashStart: non è necessario definire DNS nelle opzioni DHCP quando FlashStart è attivo.
- Le regole di port forwarding generate dal sistema sono ora visibili ma di sola lettura, chiaramente contrassegnate come automatiche.
- Threat Shield IP automaticamente aggiunge alla whitelist gli IP dei servizi aziendali Nethesis per prevenire i falsi positivi.
- Aggiunto supporto per i gruppi DH IPSec 19, 20 e 21.
- Aggiunto il controllo di accesso del gruppo di unità, le restrizioni basate su IP, le ottimizzazioni delle prestazioni e i miglioramenti dell'interfaccia utente nel controller.
- I dati e i log del controller vengono ora trasmessi attraverso il tunnel VPN per una migliore sicurezza.
- Aggiunto il campo di descrizione dell'unità sincronizzato tra le unità e il controller.
- Aggiunta la configurazione MTU per risolvere i problemi di connettività su reti di bassa qualità.
- Introdotto l'accesso di supporto remoto (nethsupport) tramite codice temporaneo; nessuna credenziale o 2FA richiesta, con revoca automatica dopo la fine della sessione.

**Correzioni di bug**

- Risolto il problema di abilitazione/disabilitazione delle regole di port forward tramite il menu kebab quando sono configurati oggetti di set di dominio.
- Migliore convalida del port forward per rifiutare gli indirizzi IP non validi quando è definita una porta di destinazione.
- Corretti i tunnel OpenVPN con compressione LZO che non riuscivano ad avviarsi.
- Le configurazioni QoS e MultiWAN vengono ora aggiornate correttamente quando un'interfaccia WAN viene rimossa.
- Le regole DPI ora bloccano correttamente il traffico ICMP; risolto il segfault all'avvio e migliorato le prestazioni sotto carico.
- Risolto il problema della funzionalità del menu kebab nel port forwarding quando vengono utilizzati i set di dominio nella sezione "limita accesso a".
- Gli indicatori di utilizzo del certificato del proxy inverso ora mostrano lo stato corretto.
- Risolto il problema del controller in cui 2FA poteva attivarsi dopo l'annullamento della configurazione; ora si attiva solo dopo la corretta conferma dell'OTP.
- Il server DHCP ora risponde con un singolo messaggio per richiesta quando sono configurate più istanze di dnsmasq.

## Principali modifiche il 2025-06-30

Versione immagine: `8-24.10.0-ns.1.6.0`

**Nuove funzionalità**

- Alta disponibilità: aggiunto il supporto per cluster a due nodi in modalità backup. failover automatico entro pochi secondi. configurato tramite riga di comando.
- Flashstart ProPlus: aggiunto il supporto per configurazioni multi-profilo, blocklist dinamiche e gestione migliorata del client dns.
- Procedura guidata di sicurezza: assiste con la configurazione di sicurezza iniziale (password, ssh e interfaccia utente). appare dopo l'accesso se non ancora completata e può essere saltata.
- Archiviazione persistente automatica dei log: lo spazio su disco libero viene assegnato automaticamente ai log per impostazione predefinita, prevenendo la perdita di log durante il riavvio. gli amministratori possono modificare la destinazione.
- Threat Shield: gestione IP bloccati dall'interfaccia utente: aggiunta l'interfaccia per visualizzare, cercare e sbloccare gli IP. le blocklist IPv4 e IPv6 sono gestibili dall'interfaccia utente.
- Stato di sincronizzazione del centro servizi: la pagina dell'abbonamento ora mostra lo stato della connessione, l'ora dell'ultima sincronizzazione e un pulsante "sincronizza ora".
- SNAT limitato per interfaccia: consente le regole SNAT su interfacce di rete specifiche. semplifica il routing avanzato e le configurazioni di failover. gestibile tramite interfaccia utente.
- Filtro dei leasing statici: aggiunto il filtro per i leasing DHCP statici per interfaccia per una gestione più semplice delle configurazioni complesse.
- Versione nei log di migrazione: i log di migrazione e le esportazioni ora includono la versione dello strumento di migrazione e del sistema di destinazione.

**Correzioni di bug**

- OpenVPN: risolto il problema in cui gli utenti Active Directory rinominati/eliminati potevano comunque accedere con le vecchie credenziali. il tracciamento dell'accesso viene ora aggiornato correttamente.
- Firewall: impedito ai nomi delle zone del firewall di iniziare con numeri: evita i problemi di applicazione della regola.
- Port forward: consente il port forwarding senza specificare un indirizzo di destinazione.
- Certificati: possibilità di eliminare le richieste Let's Encrypt anche se ancora in sospeso.
- OpenVPN: i tunnel OpenVPN net-to-net con trattini nel nome possono ora essere modificati dopo la migrazione.
- Log: risolto il problema in cui i log potevano occupare il filesystem root dopo un ripristino.
- OpenVPN RW: rinegoziazione regolata per prevenire disconnessioni inaspettate per determinati metodi di autenticazione.

## Principali modifiche il 2025-04-10

Versione immagine: `8-24.10.0-ns.1.5.1`

**Correzioni di bug**

- Bond: risolto il problema con le interfacce di bonding che non avevano il modulo del kernel caricato correttamente
- Traffico in tempo reale: i valori del traffico sono stati regolati per essere più accurati nelle tabelle
- Threat Shield DNS/IP: rimosso il problema grafico in cui più elenchi apparivano abilitati di quelli effettivi
- Monitoraggio: rimosso il display dell'IP WAN se l'interfaccia è offline
- Interfaccia utente: raddoppiata la velocità dell'interfaccia utente comprimendo i dati inviati al browser

------------------------------------------------------------------------

## Principali modifiche il 2025-04-08

Versione immagine: `8-24.10.0-ns.1.5.0`

Questo rilascio affronta un bug riscontrato nel rilascio precedente a causa dell'irrigidimento del backend API.

Nessun cambiamento aggiuntivo è stato effettuato dalla versione 1.5.0-rc1 a questo rilascio.

------------------------------------------------------------------------

## Principali modifiche il 2025-03-28

Versione immagine: `8-24.10.0-ns.1.5.0-rc1`

Questo rilascio contiene nuove interfacce utente per servizi precedentemente accessibili solo tramite riga di comando, insieme a miglioramenti della sicurezza e correzioni di bug.

**Nuove funzionalità e miglioramenti**

- IPS: l'interfaccia utente è stata rilasciata
- DNS di Threat Shield: l'interfaccia utente è stata rilasciata
- Binding IP/MAC: l'interfaccia utente è stata rilasciata
- Informatica Netify: l'interfaccia utente è stata rilasciata per la registrazione del servizio
- DNS FlashStart: Miglioramenti dell'implementazione. La gestione DNS di NethSecurity è ora indipendente dal DNS utilizzato per FlashStart per evitare qualsiasi interazione con i servizi del firewall. I server DNS esterni non sono più necessari per le reti non filtrate.
- Varie modifiche sono state apportate per rafforzare il sistema, incluse: indurimento dell'API, il servizio SNMP è ora disabilitato per impostazione predefinita, modifiche alla gestione del backup (solo con sottoscrizione)

**Correzioni di bug (questo è un elenco limitato dei più segnalati)**

- Migrazione: problema del nome dispositivo OpenVPN quando si superano i 16 caratteri
- Migrazione: perdita di configurazione per i tunnel OpenVPN con nomi simili
- Migrazione: interruzione della migrazione del client Road Warrior se manca un certificato utente
- MultiWAN non consente al firewall di inviare traffico all'esterno se la rotta di metrica più bassa non è disponibile
- L'esportazione JSON del tunnel OpenVPN include solo il primo endpoint remoto, omettendo gli altri
- L'abilitazione della registrazione nelle regole del firewall può sovraccaricare la CPU
- Le regole Netmap non caricate dopo un aggiornamento della versione
- L'interfaccia web del server OpenVPN si arresta in modo anomalo se il database utente viene rimosso
- Firewall: zona "any" visualizzata come inattiva
- Port forward: errore quando si assegna un oggetto con un intervallo IP

------------------------------------------------------------------------

## Principali modifiche il 2024-12-18

Versione immagine: `8-23.05.6-ns.1.4.1`

Questo rilascio si concentra sul monitoraggio locale migliorato e aggiunge alcune funzionalità sperimentali.

**Nuove funzionalità e miglioramenti**

- La funzionalità di monitoraggio in tempo reale ora consente agli utenti di filtrare i dati del traffico selezionando un host e una delle seguenti opzioni: applicazione, host remoto o protocollo
- Monitoraggio in tempo reale: aggiunti grafici di latenza e velocità di perdita
- Migliorare la configurazione della rete Netifyd: la configurazione è stata aggiornata per migliorare le prestazioni di rete limitando il numero di interfacce controllate
- Assicurare un comportamento coerente della registrazione del nome host nei log nginx: i log nginx includevano precedentemente il nome host due volte, causando incoerenze all'interno di Grafana
- MultiWAN: aggiungere regole di routing per il traffico avviato dal router
- La configurazione di FlashStart viene ora disabilitata automaticamente se non è disponibile una sottoscrizione attiva
- Phonehome: raccogliere statistiche sull'utilizzo del DNS di Threat Shield

**Funzionalità sperimentali**

Le seguenti funzionalità sono sperimentali e devono essere configurate da CLI:

- Binding MAC: introdotto il binding MAC tramite prenotazione DHCP per migliorare la sicurezza di rete associando indirizzi MAC specifici agli indirizzi IP designati
- Supporto NUT: configurare i dispositivi UPS con NUT. Questo non è ufficialmente supportato su macchine con una sottoscrizione
- Configurazione WireGuard: configurare WireGuard tramite CLI, abilitando la gestione di più istanze di server e peer
- Intrusion Prevention System (IPS): introdotta la configurazione di Snort tramite CLI, consentendo agli utenti di gestire regole e criteri

**Correzioni di bug**

- Regole firewall: riferimento ipset non rimosso durante la modifica della regola di input
- Port forward: riferimento ipset non rimosso durante la modifica della regola di input
- Oggetti firewall: modifiche all'host set non riflesse nelle regole nft
- OpenVPN Road Warrior: correggere il problema del percorso con la gestione del bonding
- Archiviazione: il disco non viene visualizzato nell'interfaccia utente dopo l'aggiornamento del sistema
- Flashstart: corretto un problema che impediva l'invio dell'heartbeat
- Migrazione: gli account VPN non visibili se il nome utente contiene lettere maiuscole
- Dashboard: messaggio di errore errato nonostante la risposta API corretta
- Monitoraggio: errore quando OpenVPN RoadWarrior ha una configurazione incompleta
- Migrazione: l'importazione dell'alias PPPoE non riuscita con errore di argomento non valido

## Principali modifiche il 2024-10-17

Versione immagine: `8-23.05.5-ns.1.3.0`

Questo rilascio si concentra sul monitoraggio, sui miglioramenti della migrazione e su una migliore integrazione del controller NethSecurity.

Il changelog dettagliato può essere trovato [qui](https://github.com/NethServer/nethsecurity/milestone/5?closed=1)

**Nuove funzionalità e miglioramenti**

- Aggiornamento a OpenWrt 23.05.5: consultare il changelog upstream [changelog](https://openwrt.org/releases/23.05/notes-23.05.5)
- Gestione centralizzata dell'aggiornamento dell'unità: dal controller dovrebbe essere possibile aggiornare l'unità senza problemi (pacchetti e/o immagine)
- Pagina di monitoraggio in tempo reale: creare una dashboard completa per il monitoraggio di NethSecurity
- Monitoraggio storico: il monitoraggio storico consente all'utente di vedere come si comporta il firewall dal controller NethSecurity
- Supporto degli strumenti per le macchine virtuali per KVM e VMware: rimuovere tutti gli strumenti dall'immagine e fornirli come pacchetti opzionali
- Port forward: supportare tutti gli oggetti all'interno del campo restrict: implementare il supporto per più tipi di oggetto nel campo "limita accesso da"
- Inventario, statistiche di utilizzo avanzate: raccogliere statistiche anonime sull'utilizzo del sistema
- Migliorare l'interfaccia utente di Threat Shield: esporre le impostazioni di registrazione e protezione dalla forza bruta nella pagina di Threat Shield
- Interfaccia utente degli helper NAT: nuova pagina di configurazione dell'helper NAT
- Supporto remoto (ns-don): aprire la porta netdata (19999): aggiungere l'accesso alla porta 19999 da tunDON per consentire la visualizzazione dell'interfaccia utente di netdata dalle sessioni di supporto remoto
- Regole NAT: aggiungi "0.0.0.0/0 qualsiasi indirizzo": aggiungi l'opzione "0.0.0.0/0 qualsiasi indirizzo" tra i suggerimenti degli indirizzi di destinazione
- Zone e criteri: consenti di impostare il criterio di registrazione per ogni zona
- Pagina DNS e DHCP: la ricerca non distingue più tra maiuscole e minuscole
- OpenVPN Road Warrior: aggiungere un pulsante per scaricare tutti i certificati OpenVPN associati a una specifica istanza di Road Warrior
- Interfaccia utente: migliora l'usabilità, la navigazione, il layout e gli elementi visivi su più pagine
- Migrazione: alla fine della migrazione, viene creato un file di log con tutte le azioni eseguite, il log è disponibile in `/root/migration.log`
- MultiWAN: migliorare la configurazione predefinita per ripristinare l'uplink dopo che tutti i WAN hanno perso la connettività

**Correzioni di bug**

- Migrazione: correggere le regole del firewall che utilizzavano la zona blu
- Migrazione: configurazione di rete non migrata se l'alias non ha gateway
- Migrazione: correggere le regole del firewall con il servizio "any" che migrano in modo errato
- Migrazione: correggere il flag di autenticazione della password root visualizzato in modo errato
- Migrazione: rinominare le interfacce VPN che hanno causato un errore firewall se il nome era troppo lungo
- Migrazione: correggere l'account_email mancante in ACME che ha causato un errore di rinnovo del certificato
- Migrazione: correggere la zona errata per le regole personalizzate OpenVPN e IPsec
- Migrazione: correggere la riflessione della zona errata sul port forward per le VPN
- Migrazione: rimuovere le zone personalizzate sulla migrazione, le zone vengono convertite in reti CIDR
- Migrazione: correggere FlashStart non abilitato sull'interfaccia guest/blue
- Migrazione: correggere il certificato OpenVPN Road Warrior non esportato se CN contiene il carattere punto
- Migrazione: importare correttamente gli utenti di OpenVPN Road Warrior senza proprietà "status"
- OpenVPN Road Warrior: aggiungere l'impostazione di compressione client mancante nel file .ovpn
- OpenVPN Road Warrior: correggere la gestione del pool IP
- OpenVPN Road Warrior: correggere il CRL scaduto che causava un errore di connessione dopo 6 mesi
- Tunnel OpenVPN tra NS7 e NS8 cipher: la connessione non riusciva nonostante mostrasse "connesso"
- Client del tunnel OpenVPN: modalità di visualizzazione corretta
- Client del tunnel OpenVPN: modalità "bridged" visualizzata erroneamente come nuova impostazione predefinita, la nuova impostazione predefinita è ora "routed"
- Il client del tunnel OpenVPN reimposta il cipher su `AES-128-CBC`: impostare il cipher correttamente senza reimpostarlo
- Client del tunnel OpenVPN: impostare correttamente la modalità "tap" e "tun" sulla creazione del tunnel client
- Impossibile disabilitare l'interfaccia utente legacy LuCI dopo l'aggiornamento del sistema: correggere l'opzione di disabilitazione dell'interfaccia utente LuCI
- Connessione del controller (ns-plug): forzare la pulizia della cache dei pacchetti e sincronizzare lo stato dell'unità
- Migrazione: migliorare la migrazione in loco, aggiungere un ritardo prima della scrittura dell'immagine per ridurre i problemi durante la scrittura del kernel
- Conntrack: assicurarsi che i contatori siano impostati: evitare l'errore dai contatori mancanti.
- Proxy inverso: impostare correttamente il certificato predefinito
- Proxy inverso: correggere la configurazione per consentire l'accesso solo dalla rete specificata
- Netdata: attenuato il problema con il processo fping orfano che continua a effettuare il ping degli IP rimossi
- Impossibile disconnettersi mentre viene visualizzata una notifica di tosto: impedire alle notifiche di tosto di bloccare il menu dell'account
- Server API: correggere il riavvio all'aggiornamento del pacchetto
- La pagina dell'interfaccia non riesce con QoS abilitato su PPPoE: migliorare il validatore nella pagina di configurazione della rete
- Impossibile duplicare un port forward: correggere la duplicazione della regola di port forwarding
- Report: disabilitare il pulsante "apri report" quando l'interfaccia utente viene visualizzata dal controller
- Report DPI: correggere l'arresto anomalo al riavvio di netifyd

## Principali modifiche il 2024-08-08

Versione immagine: `8-23.05.4-ns.1.2.0`

Questo rilascio si concentra su nuove funzionalità per gli abbonamenti e l'esperienza utente migliorata.

Il changelog dettagliato può essere trovato [qui](https://github.com/NethServer/nethsecurity/milestone/4?closed=1)

**Nuove funzionalità e miglioramenti**

- Aggiornamento a OpenWrt 23.05.4: aggiornare OpenWrt alla versione 23.05.4 con pacchetti e modifiche di base rilevanti
- Elenchi liberi di Threat Shield per la comunità: implementare elenchi liberi di Threat Shield per gli utenti della comunità, migliorando la protezione generale dalle minacce
- Backup remoto per tutte le sottoscrizioni: estendere l'accesso al backup remoto a sottoscrizioni sia Enterprise che Community con informazioni di backup aggiuntive
- Nuovo script per aggiornare i pacchetti con registrazione e accesso al canale stabile: implementare un nuovo script update-packages con registrazione migliorata e flag force-stable
- Oggetti firewall: implementare oggetti host set e domain set per la gestione migliorata del firewall
- Aggiungere il supporto degli oggetti nelle regole MultiWAN: implementare il supporto degli oggetti nell'interfaccia utente MultiWAN per gli indirizzi di origine e destinazione
- Aggiungere il supporto degli oggetti nelle regole Port Forward: aggiungere il supporto degli oggetti per l'indirizzo di destinazione e l'accesso limitato nelle regole Port Forward
- Aggiungere il supporto degli oggetti nelle regole Firewall: includere il supporto degli oggetti per gli indirizzi di origine e destinazione nelle regole Firewall
- Prenotazione IP di OpenVPN Road Warrior: migliorare la gestione degli IP riservati nella configurazione di OpenVPN per prevenire conflitti
- Backup: includere l'elenco dei pacchetti installati nel backup per un ripristino più semplice dopo l'aggiornamento dell'immagine
- Certificato Let's Encrypt sulla porta aggiuntiva dell'interfaccia web: estendere l'utilizzo del certificato Let's Encrypt alla porta aggiuntiva ns-ui
- Server tunnel OpenVPN: aggiungere l'opzione "remote-cert-tls" nel file di configurazione del client esportato
- DNS personalizzato per hotspot: aggiungere il supporto per modificare il DNS predefinito per l'hotspot
- Supporto limitato per adattatori USB-to-Ethernet: fornire il supporto sperimentale per adattatori USB-to-Ethernet con installazione manuale del driver
- Supporto limitato per adattatori USB-to-Serial: aggiungere il supporto sperimentale per adattatori USB-to-Serial con installazione manuale del driver

**Correzioni di bug**

- Negare la creazione di certificati con domini già richiesti: prevenire la creazione di certificati duplicati con lo stesso dominio
- Problema visivo con oggetti DHCP in OpenVPN Road Warrior: correggere i campi mancanti e gli errori di visualizzazione nelle opzioni DHCP
- Impossibile creare proxy inversi: correggere l'errore di convalida della configurazione nginx durante la creazione di proxy inversi
- Limitare i nomi delle interfacce a 13 caratteri: prevenire l'errore mwan a causa di nomi di interfaccia lunghi
- OpenVPN, impossibile rimuovere l'IP riservato per il client Road Warrior: correggere il problema in cui l'IP riservato non può essere rimosso per i client Roadwarrior
- Arresto anomalo dell'interfaccia utente con oltre 3000 voci di conntrack: correggere l'arresto anomalo dell'interfaccia utente e l'interruzione del servizio rpcd con un gran numero di voci di conntrack
- MultiWAN, mancanti avvisi di disconnessione/riconnessione WAN: nuova implementazione degli avvisi WAN per gestire correttamente gli eventi di connessione e riconnessione
- Controller, visualizzare il nome degli utenti disconnessi: mostrare il nome delle unità disconnesse invece del solo UUID
- Controller, visualizzare la porta VPN: aggiungere la visualizzazione della porta VPN nell'interfaccia utente NS8 per una configurazione del firewall più semplice
- Controller, convalidare CN: aggiungere la regola di convalida al campo del nome del controller per consentire solo lettere e numeri
- Controller, non rimuovere il file .info al momento della disconnessione: preservare il file di informazioni dell'unità per le unità disconnesse
- Controller, le unità passano continuamente da connesse a disconnesse: affrontare il problema con la visualizzazione dello stato di connessione irregolare per più unità
- Migrazione, servizi DHCP e DNS per zona blu/guest: abilitare i servizi DHCP e DNS per le zone blu/guest migrate
- Migrazione, IP riservato OpenVPN non assegnato: risolvere il problema con l'assegnazione dell'IP riservato per i certificati migrati
- Migrazione, nome utente FlashStart mancante: correggere il problema in cui il campo del nome utente non viene visualizzato nell'interfaccia di FlashStart dopo la migrazione
- FlashStart, ridurre il numero di query: modificare la configurazione di dnsdist per ottimizzare la gestione delle query e ridurre le richieste non necessarie

## Principali modifiche il 2024-07-05

Versione immagine: `8-23.05.3-ns.1.1.0`

Questo rilascio si concentra sulla correzione di bug e sulla fornitura di nuove funzionalità.

Il changelog dettagliato può essere trovato [qui](https://github.com/NethServer/nethsecurity/milestone/3?closed=1).

**Nuove funzionalità e miglioramenti**

- Gestione delle connessioni: interfaccia implementata per il monitoraggio e il controllo in tempo reale delle connessioni tracciate da conntrack
- Opzione sticky MultiWAN: configurazione sticky aggiunta nelle regole MultiWAN per mantenere la persistenza della connessione tra le sessioni
- Aggiornamenti della firma DPI: abilitati gli aggiornamenti delle firme di Deep Packet Inspection per i tipi di sottoscrizione sia community che enterprise
- Gestione degli utenti amministratore: funzioni API implementate per elevare gli utenti locali allo stato di amministratore e revocare i privilegi di amministratore
- Miglioramento dell'autenticazione LDAP: flessibilità migliorata per configurazioni di Active Directory e Distinguished Name LDAP non standard
- Autenticazione del repository di sottoscrizione: sistema implementato di verifica della system_key per l'accesso ai repository di pacchetti basati su sottoscrizione

**Correzioni di bug**

- Utilizzo dell'archiviazione NVME: risolto il problema che impedisce l'utilizzo dello spazio dell'unità NVME non allocato per la registrazione del sistema
- Convalida del ripristino del backup: messaggi di errore specifici aggiunti per l'input della passphrase errata durante il processo di ripristino del backup
- Regolazione delle metriche MWAN: allocazione della metrica dell'interfaccia modificata per iniziare da 20 e incrementare di 10 per un miglior bilanciamento del carico
- Coerenza dell'interfaccia utente dell'aggiornamento pianificato: visualizzazione persistente corretta degli aggiornamenti pianificati completati nell'interfaccia utente
- Etichettatura della politica MultiWAN: visualizzazione dell'etichetta "balance" non corretta corretta per le politiche personalizzate a gateway singolo
- Convalida del modulo MultiWAN e gestione dell'input: gestione dello stato del campo di input appropriato e convalida del modulo implementate nell'editor dei criteri
- Raffinamento dell'interfaccia utente/UX MultiWAN: flessibilità della porta di input migliorata e logica di invio del modulo per regole e criteri
- Funzionalità DHCP post-migrazione: errore di assegnazione dell'indirizzo DHCP affrontato dopo la migrazione dalla versione 7.9 alla 8
- Effetto collaterale della creazione dell'account VPN: rimozione involontaria impedita dei nomi visualizzati degli utenti alla creazione dell'account VPN
- Configurazione della rete di migrazione: implementato il rimuovimento di voci gateway estranee dalle interfacce non rosse
- Logica di migrazione MultiWAN: disabilitazione automatica aggiunta delle configurazioni MultiWAN con provider singolo durante la migrazione
- Visualizzazione della configurazione IPsec: interfaccia utente corretta per riflettere accuratamente i valori dei parametri del tunnel IPsec personalizzato
- Funzionalità del proxy inverso: risolti i problemi di passaggio del proxy per l'accesso a WebTop post-migrazione
- Integrità del database utente locale: correzione della scomparsa dei dati dell'utente locale dopo gli aggiornamenti del sistema
- Robustezza del sistema di inventario: gestione migliorata dei dispositivi VLAN sulle interfacce del bridge e recupero della configurazione DNS
- Persistenza della configurazione del controller: correzione del problema di corruzione del file di configurazione dopo il salvataggio delle impostazioni dell'interfaccia del cluster
- Flusso di lavoro di configurazione del controller: modulo di configurazione migliorato con opzioni avanzate e guida utente più chiara

## Principali modifiche il 2024-06-05

**Questo è un rilascio di sicurezza**

Versione immagine: `8-23.05.3-ns.1.0.1`

Affrontata la vulnerabilità di sicurezza: [GHSA-74xv-ww67-jjpx](https://github.com/NethServer/nethsecurity/security/advisories/GHSA-74xv-ww67-jjpx) (la divulgazione sarà pubblicata il 2024-06-20)

**Correzioni di bug**

- Correzione della sicurezza per GHSA-74xv-ww67-jjpx
- Ipsec: correggere il tunnel non funzionante se il WAN selezionato è un PPPoE su vlan
- MultiWAN: forza la lunghezza massima per i nomi delle regole e dei criteri
- OpenVPN Road Warrior: prevenire la creazione di utenti con spazi finali
- Inventario: migliorare la raccolta di dati per sottoscrizioni e rete
- Migrazione: utenti di OpenVPN Road Warrior non visibili nell'interfaccia utente dopo la migrazione
- Server API: stabilità e prestazioni migliorate mediante l'ottimizzazione dell'ordine di avvio per il corretto avvio al boot

## Principali modifiche il 2024-05-22

**Stabile**

Versione immagine: `8-23.05.3-ns.1.0.0`

Il rilascio stabile si concentra sulla correzione di bug e sul miglioramento dell'esperienza utente complessiva.

Il changelog dettagliato può essere trovato [qui](https://github.com/NethServer/nethsecurity/milestone/2?closed=1).

**Nuove funzionalità e miglioramenti**

- Route: le regole IPsec sono ora non modificabili
- IPsec: aggiunto un validatore per le reti remote e locali
- Ricaricamento automatico delle pagine VPN: le pagine VPN vengono ora ricaricate automaticamente
- DHCP: funzionalità di scansione della rete aggiunta
- IPsec: gestione migliorata di più reti all'interno di un singolo tunnel
- DHCP: l'opzione di forzatura per DHCP è ora disponibile nell'interfaccia utente
- Minaccia shield: rimuovere l'elenco enterprise al momento della rimozione della sottoscrizione
- DPI: rimuovere le firme premium alla revoca dell'iscrizione
- Sottoscrizione: migliorare la modalità di annullamento della registrazione
- Inventario: raccogliere statistiche di utilizzo di base
- IPsec: esporre meglio l'opzione PFS
- Dashboard: aggiungere una notifica della nuova versione disponibile
- Regole firewall: migliorare la leggibilità complessiva della pagina
- Zone e criteri: cassetto migliorato per la zona WAN
- Dashboard: mostrare un avviso se DNS non è configurato
- Helper NAT: tutti gli helper NAT sono ora inclusi nell'immagine ma disabilitati per impostazione predefinita

**Correzioni di bug**

- FlashStart: la risoluzione DNS non riesce dopo la disabilitazione del servizio
- FlashStart: correggere la prima configurazione
- Let's Encrypt: i certificati non vengono creati
- FlashStart: la regola di reindirizzamento è inefficace
- Firewall: ipset non viene aggiornato dopo la rimozione di un indirizzo
- Migrazione: i gruppi di host non vengono importati correttamente nelle regole del firewall
- Regole firewall: impossibile inserire un indirizzo IP personalizzato
- Minaccia shield: le modifiche all'allowlist non vengono applicate immediatamente
- Migrazione: impossibile modificare il tunnel IPsec importato
- OpenVPN road warrior: impossibile ricreare un utente precedentemente creato dal database LDAP
- OpenVPN RW: gli host non sono raggiungibili con configurazione bridged
- MultiWAN: l'indirizzo IP di traccia non viene aggiornato
- Proxy inverso: l'elenco degli IP consentiti non deve essere obbligatorio
- Controller: impossibile connettersi all'unità se l'interfaccia utente è disabilitata sulla porta 443
- Sottoscrizione: impossibile registrare una sottoscrizione della comunità
- Installa da USB: tabella di partizione errata
- Migrazione: impossibile avviare l'interfaccia PPPoE
- Minaccia shield: feed di sottoscrizione vuoto
- Aggiornamenti automatici: il lavoro cron non viene avviato durante la notte
- Minaccia shield non avviato dall'interfaccia utente
- Migrazione: l'IP di minaccia shield non viene migrato
- EFI: impossibile utilizzare lo spazio libero come archiviazione aggiuntiva
- Zona: forza la creazione in minuscolo
- OpenVPN Road Warrior: autenticazione OTP, VPN si disconnette dopo un'ora
- ns-api: threatshield, impostare ban_nftexpiry e ban_logcount
- Helper NAT: le sessioni FTP attive non trasferiscono file

## Principali modifiche il 2024-04-29

**Candidato al rilascio 2**

Versione immagine: `8-23.05.3-ns.0.0.5-rc2`

Il rilascio del candidato al rilascio 2 si concentra sulla correzione di bug e sul miglioramento dell'esperienza utente complessiva. Il changelog dettagliato può essere trovato [qui](https://github.com/NethServer/nethsecurity/milestone/1?closed=1).

**Nuove funzionalità e miglioramenti**

- Regole firewall: visualizzazione migliorata della sezione delle regole.
- FlashStart: aggiunta la funzionalità di risoluzione DNS dopo la disabilitazione del servizio.
- Dashboard: organizzazione delle schede migliorata e link aggiuntivi.
- Route: abilitazione della creazione di route senza gateway.
- Ricaricamento automatico delle pagine VPN: implementato il ricaricamento automatico dei dati ogni 10 secondi.
- Migrazione a libreria vue-components: componenti e utility migrati a vue-components.
- Interfaccia utente: imposta il timeout rpcd a 300 secondi per supportare attività a lunga esecuzione.
- DHCP: funzionalità di scansione della rete introdotta.
- Database utente: ordinamento degli utenti in base al nome utente e esecuzione coerente di query LDAP.
- DHCP: opzione di forzatura abilitata per impostazione predefinita per i server DHCP, opzione esposta nell'interfaccia utente.
- OpenVPN road warrior: ordinamento implementato degli utenti di OpenVPN road warrior per nome utente.

**Correzioni di bug**

- Regole firewall: glitch risolto visualizzando contenuto errato.
- FlashStart: errore di risoluzione DNS risolto post disabilitazione del servizio.
- Route: modifica della modifica impedita delle regole IPsec.
- IPsec: reti remote/locali validate per evitare duplicati.
- Port forward: etichetta dell'opzione di riflessione corretta.
- Migrazione: importazione corretta dei gruppi di host nelle regole del firewall.
- Regole firewall: consentire l'inserimento di indirizzi IP personalizzati.
- Minaccia shield: applicare le modifiche all'allowlist immediatamente.
- Migrazione: migliorare la migrazione dell'opzione IPSec e consentire la modifica del tunnel IPsec importato.
- OpenVPN road warrior: problema risolto con la ricreazione dell'utente da LDAP.
- Errore axios fisso durante il commit delle modifiche.
- OpenVPN road warrior: problema risolto con la configurazione bridged.
- IPsec: gestione migliorata di più reti con un singolo tunnel.
- Zone: ID dei pulsanti radio fissi nella pagina delle zone.
- FlashStart: regola di reindirizzamento inefficace risolta.
- Controller: comportamento perfezionato in base alla presenza della sottoscrizione.
- Firewall: ipset aggiornato dopo la rimozione dell'indirizzo IP.

## Principali modifiche il 2024-04-10

**Candidato al rilascio 1**

Versione immagine: `8-23.05.3-ns.0.0.3-rc1`

Il rilascio del candidato al rilascio 1 si concentra sulla correzione di bug, l'aggiunta del controller centralizzato e il miglioramento del processo di migrazione da NethServer 7.

Il tracker dei problemi è stato spostato su GitHub. Il nuovo URL è: <https://github.com/NethServer/nethsecurity/issues>.

**Nuove funzionalità e miglioramenti**

- NethSecurity è stato ribasato su [OpenWrt 23.05.3](https://forum.openwrt.org/t/openwrt-23-05-3-service-release/192587).
- Aggiunto il [controller centralizzato](../system/controller.md) per gestire più istanze di NethSecurity da una singola interfaccia.
- Port forward: supporto per intervalli di porte nel campo della porta di origine.
- Regole firewall: supporto per intervalli IP come regole di destinazione.
- Backup: consenti il download del file di backup dall'interfaccia utente anche se la macchina ha una sottoscrizione enterprise e il server di backup remoto non è disponibile.
- Minaccia shield: migliorare la visualizzazione della pagina shield minaccia se il firewall non ha accesso a Internet.
- Sottoscrizione: mostrare la sottoscrizione anche se la macchina non ha accesso a Internet.
- MultiWAN: gestione migliorata della configurazione della politica di equilibrio.
- Pagina di rete: lo stato di attivo/non attivo delle interfacce di rete ora riflette accuratamente lo stato del cavo invece dello stato del kernel.
- Regole firewall: migliorare la visualizzazione delle regole del firewall disabilitate.
- Aggiunta un'opzione per abilitare il collegamento alla politica sulla privacy durante l'accesso.
- Supporto remoto (don): consenti l'accesso all'interfaccia utente e conserva la sessione dopo il riavvio del firewall.
- Utenti: supporto di binding su database utente LDAP remoto.

**Correzioni di bug**

- 2FA: abilitare 2FA per l'utente solo dopo la verifica dell'OTP.
- Tunnel IPsec: associare correttamente l'interfaccia ipsecX al WAN selezionato.
- IPsec: assicurarsi di iniziare dopo una migrazione anche se il WAN associato non è disponibile.
- Migrazione: rielaborare il processo di migrazione della rete per evitare problemi con la configurazione di bonding, bridge e alias.
- Migrazione: visualizzare bonding e bridge nella pagina di rimappatura durante la migrazione.
- Migrazione, aggiornamento e backup: implementare nuovi metodi di caricamento e download per evitare problemi con file di grandi dimensioni.
- Migrazione: corretto un problema che impediva l'avvio del server DHCP quando le opzioni DHCP erano presenti nella configurazione.
- DPI: prevenire la perdita di firme Enterprise dopo un aggiornamento.
- Archiviazione: aggiunta la possibilità di ricreare una partizione di archiviazione eliminata.
- Rete: correggere la creazione di VLAN su bridge.
- Port forward e tunnel IPsec: correggere la visualizzazione degli IP WAN, la pagina ora visualizza tutti gli alias ed evita duplicati anche se il WAN non è disponibile.
- Port forward: elencare la zona LAN all'interno delle destinazioni NAT hairpin.
- Tunnel OpenVPN: corretto un problema che impediva la modifica di un tunnel P2P.
- Pagina MultiWAN: ordinamento corretto delle interfacce WAN per priorità.
- Pagina MultiWAN: non mostrare gli alias WAN nella pagina della politica.
- DHCP: nascondi i leasing statici nella scheda dei leasing dinamici.
- Proxy pass: correggere un problema che impediva la modifica di una regola di proxy pass.
- Tunnel OpenVPN: selezione corretta della cifra predefinita per i tunnel P2P.
- DPI: riavviare netifyd dopo una modifica della configurazione di rete.
- FlashStart: correggere la registrazione del firewall al servizio FlashStart.
- FlashStart: indirizzo DNS secondario corretto.
- Regole firewall: host duplicato fisso in indirizzo di origine e destinazione.
- OpenVPN Road Warrior: creazione utente in massa per elenchi di utenti di grandi dimensioni.

**Bug noti**

I bond di rete soffrono ancora di alcuni problemi. Se stai eseguendo la migrazione da NethServer 7, tieni presente quanto segue:

- VLAN su un'interfaccia di bonding non viene creata se il bonding non ha un ruolo
- Durante la creazione del bonding, a volte, l'interfaccia web non mostra i dispositivi da aggiungere al bonding
- Il bonding appena creato mostra un pulsante che dice "Configura bonding", ma poi non configura il bonding stesso ma l'interfaccia membro del bonding

**Note di aggiornamento**

Se stai eseguendo l'aggiornamento da una versione beta precedente e hai tunnel IPsec configurati, devi eseguire i seguenti comandi dopo l'aggiornamento:

``` shell
uci delete ipsec.ns_ipsec_global.interface
uci commit ipsec
/etc/init.d/swanctl restart
```

## Principali modifiche il 2024-02-29

**Beta 2**

Versione immagine: `8-23.05.2-ns.0.0.2-beta2`

Il rilascio di Beta2 si concentra sul miglioramento della nuova interfaccia utente e sul miglioramento dell'esperienza utente complessiva.

**Nuove funzionalità**

Nuovi pacchetti inclusi nell'immagine:

- Aggiunto il pacchetto SNMPD per il monitoraggio e la gestione della rete.
- Pacchetto Dyndns incluso per i servizi di DNS dinamico.
- Supporto driver espanso per interfacce di rete meno recenti e ambienti vmnet.

Interfaccia utente (UI):

- La porta dell'interfaccia utente predefinita è stata modificata in 9090, accessibile da WAN. L'interfaccia utente è anche accessibile da LAN e WAN sulla porta 443.
- Interfaccia LuCI disabilitata per impostazione predefinita per un'esperienza semplificata.
- Nuova pagina per configurare SNAT di origine, mascheramento, regole No-NAT e netmap.
- Leggibilità migliorata dei conteggi dei pacchetti di rete sulla pagina di rete.

Rete:

- Supporto PPPoE con DHCPv6-PD implementato.
- È ora possibile configurare interfacce di rete di bonding dall'interfaccia utente.

DPI:

- Riconfigurazione automatica della modifica di rete abilitata.

- Tutte le interfacce non WAN visualizzate nella pagina DPI. Per aggiornare la configurazione DPI nelle installazioni esistenti, eseguire:

  ``` bash
  echo '{"changes": {"network": []}}' | /usr/libexec/rpcd/ns.commit call commit
  ```

Funzionalità aggiuntive:

- Script migliorato `ns-install`: l'installazione è ora più veloce e si ferma al termine del processo di installazione.
- Interfaccia utente di migrazione migliorata per un'esperienza di aggiornamento più fluida.
- Creazione del leasing statico DHCP da leasing dinamici esistenti.
- Autenticazione a due fattori (2FA) per gli account amministratore.
- Esperienza di accesso ridisegnata con un aspetto più integrato e orientato all'amministratore.
- Ganci di pre e post commit aggiunti per il controllo API migliorato.
- Funzionalità opt-in basata su sottoscrizione per gli aggiornamenti automatici, accessibile solo agli utenti con sottoscrizioni attive.

**Correzioni di bug**

MultiWAN:

- Flessibilità della regola migliorata: ora consente di specificare singoli indirizzi IP (non solo il formato CIDR) nei campi di origine/destinazione per le regole.
- Protezione della politica: impedisce l'eliminazione accidentale di politiche già utilizzate nelle regole.
- Visualizzazione del grafico mwan risolta: il grafico mwan all'interno di Netdata viene ora visualizzato correttamente dopo la configurazione multi-WAN.

Firewall:

- Gestione migliorata del protocollo: crea regole per tutti i protocolli (non solo TCP/UDP) quando è selezionato "any".
- Leggibilità della regola migliorata: nelle regole con 2 o più indirizzi di origine/destinazione, solo il secondo indirizzo era facilmente visibile nel tooltip.

Port Forwarding:

- Configurazione semplificata: le porte di origine e destinazione sono richieste solo per i protocolli TCP/UDP.
- Selezione del protocollo ALL semplificata: quando viene scelto il protocollo "ALL", le altre opzioni di protocollo vengono disabilitate poiché sono ridondanti.

Certificati:

- Problema risolto: il certificato personalizzato viene sovrascritto con un certificato autogenerato quando impostato come certificato predefinito per il FQDN del firewall.
- Visualizza correttamente il dominio del certificato: nell'elenco dei certificati, il soggetto visualizzato ora corrisponde al certificato client invece del primo certificato nella catena.
- Correzione dell'eliminazione del certificato Let's Encrypt: forzato acme.sh a generare una nuova configurazione quando si ricrea un certificato Let's Encrypt per lo stesso dominio, invece di riutilizzare quello esistente.
- Richiesta del certificato Let's Encrypt: reindirizzamento automatico disabilitato dalla porta 80 alla 443 per evitare conflitti con acme.sh.

DPI:

- Perdita di configurazione risolta: risolto il problema in cui le configurazioni del filtro DPI salvate sono state eliminate durante l'aggiornamento dalle versioni precedenti

Rete:

- Gestione dell'interfaccia migliorata: abilitazione della modifica delle interfacce anche dopo l'eliminazione della zona associata.

API:

- Coerenza del log: log del server API standardizzato per il server API di NethSecurity per abbinare gli oggetti passati agli script.

OpenVPN:

- Problema di aggiornamento della porta risolto: la modifica della porta del servizio OpenVPN Road Warrior tramite l'interfaccia utente ora riflette correttamente l'aggiornamento nella configurazione del servizio e nella regola del firewall associata.
- Protezione della configurazione: problema risolto in cui la configurazione di RoadWarrior è stata persa durante la modifica della password di un utente.
- Autenticazione migliorata: problemi di autenticazione risolti di OpenVPN Roadwarrior utilizzando utenti locali in NethSecurity beta1.
- Stato del server tunnel risolto: problema risolto in cui lo stato del server tunnel non veniva visualizzato correttamente nell'interfaccia utente.

Hotspot:

- Inclusione dell'indirizzo MAC: problema risolto in cui gli indirizzi MAC mancavano nella sezione "unit" di Hotspot Manager quando l'hotspot si affidava a una VLAN.
- Eliminazione VLAN: problema risolto che impediva l'eliminazione delle VLAN precedentemente utilizzate da hotspot non registrati, anche dopo la liberazione della VLAN.
- Visibilità dello stato migliorata: stato abilitato/disabilitato aggiunto alla scheda principale per un rapido riferimento.

DHCP:

- Valore chiave fisso mancante per un'opzione avanzata preconfigurata, garantendo la corretta funzionalità.
- Visualizzazione migliorata di più opzioni rimuovendo l'etichetta ridondante.

IPsec:

- Porta NAT della regola IPsec: porta corretta per la regola Allow-IPsec-NAT, modificata da 500 a 4500 (UDP)
- Regole duplicate: creazione della regola del firewall duplicata impedita alla creazione del tunnel
- Correzione dell'ortografia dei nomi delle regole IPsec

**Bug noti**

IPsec:

- Solo la prima subnet nel tunnel IPSec è funzionante: quando si definisce più di una rete in un tunnel IPSec tra diversi dispositivi, solo la prima rete funziona; il traffico destinato ad altre subnet nel tunnel non viene instradato correttamente. Una soluzione alternativa è creare più tunnel con singole subnet. Questo problema non si verifica tra due dispositivi NethSecurity 8 (poiché utilizzano lo stesso daemon), ma può verificarsi tra, ad esempio, un NethSecurity 8 e un NethServer 7.9.

## Principali modifiche il 2024-02-01

**Beta 1**

Versione immagine: `8-23.05.2-ns.0.0.1-beta1`

Il rilascio di Beta1 segna la transizione alla nuova interfaccia utente come interfaccia di configurazione primaria. Luci rimane attivo per impostazione predefinita per le configurazioni non ancora disponibili nella nuova interfaccia utente e per scopi di verifica. I bug noti nella nuova interfaccia possono essere trovati [qui](https://trello.com/b/FndRrgIp/nethsecurity-project?filter=label:BUG).

Modifiche principali:

- Aggiunta una pagina dedicata per la gestione dei certificati e delle impostazioni del proxy inverso. Processo di importazione migliorato per entrambe le configurazioni.
- Introdotta una nuova pagina per la configurazione delle regole del firewall. Gli utenti sono consigliati di utilizzare questa pagina al posto della pagina di Luci, poiché l'utilizzo di entrambe potrebbe portare a incompatibilità.
- Aggiunta una pagina per la configurazione della qualità del servizio (QoS) per migliorare la gestione del traffico di rete.
- Aggiunta una pagina per la configurazione di OpenVPN Roadwarrior. Processo di migrazione aggiornato per la nuova implementazione.
- Introdotta l'opzione di utilizzare una partizione del disco principale come archiviazione per i log.
- Processo di migrazione migliorato per multiwan e tunnel OpenVPN, migliorando la compatibilità complessiva del sistema.
- Gestione semplificata degli aggiornamenti e delle migrazioni, con focus su una transizione più fluida.
- Implementato un nuovo sistema di versioning per identificare in modo univoco ogni immagine, migliorando la chiarezza nel tracciamento dei rilasci.
- Incorporati numerosi miglioramenti di usabilità e correzione di problemi nelle pagine esistenti, garantendo un'esperienza più user-friendly.

## Principali modifiche il 2023-12-11

**Alpha 2**

Questo rilascio alpha è specificamente realizzato a fini di valutazione, con focus sul test delle funzionalità della nuova interfaccia utente del sistema. Agli utenti viene fornita l'opzione di sperimentare lo sviluppo in corso della nuova interfaccia o attenersi all'interfaccia LuCI stabilita. I bug noti nella nuova interfaccia possono essere trovati [qui](https://trello.com/b/FndRrgIp/nethsecurity-project?filter=label:BUG).

**Miglioramenti dell'interfaccia utente**

- Risolti numerosi bug in varie pagine, incluso il filtro DHCP e DPI, migliorando la stabilità complessiva delle pagine.
- Introdotta la pagina di configurazione del tunnel OpenVPN.
- Aggiunta la pagina di configurazione del tunnel IPsec.
- Incorporata la pagina di configurazione Hotspot (Dedalo).
- Implementata la pagina di backup e ripristino.
- Introdotta la funzionalità di esclusione nella pagina del filtro DPI.
- Esposti i report netdata nell'interfaccia utente, con un monitor di latenza ping configurabile.
- Affrontato il problema della lingua predefinita per le lingue non tradotte.
- Pagina di rete refactorizzata e migliorata.
- Aggiunta una pagina per gestire gli aggiornamenti del sistema.
- Inclusa una pagina di migrazione da NethServer 7.
- Abilitata la funzionalità di ripristino delle impostazioni di fabbrica direttamente dall'interfaccia utente.
- Implementata una pagina Utenti VPN in preparazione del prossimo server OpenVPN Road Warrior.

**Miglioramenti generali**

- OpenWrt di base aggiornato alla versione 23.05.2.
- Stabilito un meccanismo per inviare avvisi ai portali remoti, inclusi my.nethesis.it e my.nethserver.com.
- Aggiunto il supporto per le password monouso (OTP) nelle future configurazioni del server OpenVPN Road Warrior.

**Nota**: la configurazione del bonding è ancora in corso e, di conseguenza, le interfacce di rete di tipo bonding attualmente non sono funzionali in questo rilascio.

## Principali modifiche il 2023-10-31

**Alpha 1**

Questo è un rilascio alpha, progettato a fini di valutazione per esplorare le funzionalità del nuovo sistema. Gli utenti hanno la possibilità di utilizzare la nuova interfaccia, che è attualmente in fase di sviluppo o l'interfaccia LuCI legacy. Tieni presente che alcune funzioni disponibili sulla vecchia interfaccia LuCI verranno rimosse una volta completata la pagina corrispondente sulla nuova interfaccia.

Mentre l'intera funzionalità backend è già operativa e completamente testata, la nuova interfaccia non è ancora completa. Alcuni bug nella nuova interfaccia sono già noti e possono essere trovati [qui](https://trello.com/b/FndRrgIp/nethsecurity-project?filter=label:BUG).

La nuova interfaccia include le seguenti funzionalità:

- Dashboard
- Gestione della sottoscrizione
- Configurazione del nome host e del fuso orario
- Configurazione dell'archiviazione aggiuntiva
- Configurazione dell'interfaccia di rete
- Impostazioni DNS e DHCP
- Configurazione del routing
- Supporto multi-WAN
- Opzioni di port forwarding
- Gestione delle zone e dei criteri
- Filtro DNS FlashStart
- Filtro DPI (Deep Packet Inspection)
- Modifica della password dell'utente root
- Accesso ai log di sistema

## Glossario dei rilasci {#release_glossary-section}

Il ciclo di rilascio del software include quattro fasi: Alpha, Beta, Candidato al rilascio (RC) e Stabile.

Durante la fase **Alpha**, il software non è completamente testato e potrebbe non includere tutte le funzionalità pianificate. Questo rilascio non è adatto per ambienti di produzione. Tuttavia, può essere utilizzato per visualizzare in anteprima cosa arriverà nella versione prossima. Tieni presente che gli aggiornamenti da un rilascio Alpha ad altri rilasci non sono supportati.

La fase **Beta** indica che il software è principalmente completo dal punto di vista delle funzionalità, ma potrebbe comunque contenere molti bug noti e sconosciuti. Questo rilascio non dovrebbe essere utilizzato in ambienti di produzione. Tuttavia, può essere utilizzato per testare il software prima di distribuirlo in produzione. Gli aggiornamenti da un rilascio Beta a un rilascio RC o Stabile sono supportati ma potrebbero richiedere una procedura manuale.

Durante la fase del **Candidato al rilascio (RC)**, il software è completo dal punto di vista delle funzionalità e non contiene bug noti. Se non emergono problemi importanti, può essere promosso a Stabile. Gli aggiornamenti da un rilascio RC a un rilascio Stabile sono supportati e dovrebbero essere quasi automatici. Tuttavia, se sei nuovo al software, è meglio utilizzarlo in produzione solo se hai già esperienza con esso.

Il rilascio **Stabile** è il più affidabile e sicuro da utilizzare negli ambienti di produzione. È stato completamente testato ed è considerato privo di bug principali.
