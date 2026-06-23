---
title: "OpenVPN Road Warrior"
sidebar_position: 1
---

# OpenVPN Road Warrior {#openvpn_roadwarrior-section}

Road Warrior si riferisce a una specifica configurazione della VPN OpenVPN pensata per gli utenti remoti, consentendo loro un accesso sicuro a una rete privata da qualsiasi parte di Internet. Questa configurazione è particolarmente utile per aziende e organizzazioni con dipendenti o collaboratori distribuiti in diverse ubicazioni, garantendo comunicazioni cifrate e privacy dei dati.

OpenVPN è un protocollo supportato dalla maggior parte delle piattaforme più utilizzate, con [client gratuiti](#client_software-section) disponibili per i sistemi Windows, MacOS, Linux, Android e iOS.

:::note

Prima di configurare OpenVPN Road Warrior, assicurati di aver letto il capitolo relativo al [database utenti](../users-objects/users_databases.md).

:::

## Configurazione del server

Un server OpenVPN è in esecuzione su NethSecurity in attesa che i client remoti lo contattino e stabiliscono una connessione. Deve essere raggiungibile da Internet sulla sua porta specifica (impostazione predefinita: `1194/UDP`). Più client possono connettersi al server, autenticarsi e ottenere accesso alla rete privata; tuttavia, i client non devono essere raggiungibili su Internet. Ogni client che si connette, dopo l'autenticazione, riceve un indirizzo IP con cui si presenterà alla rete remota.

Un server OpenVPN su NethSecurity è strettamente legato a un database utenti, che può essere locale o remoto. L'associazione con il database è definita durante la creazione del server e non può essere modificata in seguito.

La configurazione del server è semplice perché NethSecurity imposta automaticamente la maggior parte dei campi su valori predefiniti ragionevoli, che di solito richiedono solo una verifica.

Per configurare un nuovo server OpenVPN, fai clic sul pulsante **Create Server** e configura i campi proposti:

- `Server name`: assegna un nome a questo server OpenVPN
- `User database`: scegli il database utenti da utilizzare per l'autenticazione, può essere un database locale o uno remoto (ad es. LDAP o Active Directory)
- `Create an account for each user`: questo è un campo speciale che non verrà più visualizzato in futuro, consente di creare automaticamente un account VPN per ogni utente presente nel database. Tutti gli account creati avranno un certificato valido per 3650 giorni.
- `Mode`: in ponte o indirizzato; la modalità indirizzata è quella predefinita e la più comune, consente di creare una rete virtuale in cui i client sono connessi al server e possono comunicare tra loro. La modalità in ponte è meno comune e consente di connettere i client al server come se fossero collegati alla stessa LAN, questa modalità è utile quando i client devono accedere a risorse non direttamente accessibili dal server. In caso di dubbio, seleziona la modalità indirizzata.
- `Authentication mode`: sono supportate diverse modalità di autenticazione:
  - `Username and password`: il client che si connette deve fornire un nome utente e una password validi; solo gli utenti con una password impostata possono utilizzare questa modalità
  - `Certificate`: il client che si connette deve avere il proprio certificato per autenticarsi; questa è la modalità consigliata per la maggior parte dei casi
  - `Username password and certificate`: il client che si connette deve fornire un nome utente, una password e un certificato validi
  - `Username, certificate and OTP`: il client che si connette deve fornire un nome utente, un certificato e anche un codice OTP utilizzato come password. Questa modalità richiede una configurazione aggiuntiva nel client per ricevere il codice OTP
- `VPN Network`: la rete virtuale utilizzata dai client; ogni client riceverà un indirizzo IP dalla rete. NethSecurity suggerisce già una rete inusuale per evitare sovrapposizioni con altre reti utilizzate dal firewall
- `Dynamic range IP start`: il primo indirizzo IP che sarà assegnato ai client che si connettono al server; l'indirizzo deve far parte della rete VPN. Quando si aggiunge una prenotazione IP a un client, assicurati che l'indirizzo IP sia al di fuori dell'intervallo dinamico.
- `Dynamic range IP end`: l'ultimo indirizzo IP che sarà assegnato ai client che si connettono al server
- `Public IP/hostname of this unit`: NethSecurity compila automaticamente questo campo con l'indirizzo IP pubblico di ogni interfaccia WAN configurata. Questi IP/nomi host andranno nella configurazione del client. L'ordine degli elementi è cruciale perché il client che si connette inizierà a contattare gli IP/nomi host a partire dal primo dell'elenco e poi proseguirà verso il basso in caso di indisponibilità.

Fai clic sul pulsante **Create** per creare il server. Successivamente, i dettagli principali del server verranno visualizzati nell'interfaccia Web.

### Impostazioni avanzate

Se necessario, puoi anche personalizzare alcune opzioni avanzate:

- `Protocol`: UDP (impostazione predefinita), TCP
- `Port`: 1194 (impostazione predefinita)
- `Route all client traffic through VPN`: se abilitato, tutto il traffico dal client verrà instradato nel tunnel VPN, anche il traffico Internet standard. Può essere utilizzato per scopi di monitoraggio e controllo, ma è tipicamente disabilitato perché introduce una latenza aumentata e consuma larghezza di banda.
- `Push network routes`: un elenco di reti che il client dovrebbe instradare nel tunnel VPN; le reti LAN vengono aggiunte automaticamente, ma possono anche essere rimosse e altre reti possono essere aggiunte allo stesso modo
- `Allow client-to-client network traffic`: consente a tutti i client connessi di scambiarsi traffico tra loro; è consigliabile lasciarla disabilitata.
- `Compression`: comprimi il traffico del tunnel OpenVPN per risparmiare larghezza di banda. Tuttavia, ora è un'opzione meno utile e, in alcuni casi, può essere dannosa. È altamente consigliabile lasciarla disabilitata. Quando questa opzione viene modificata, è necessario scaricare di nuovo la configurazione del client.
- `Digest`: il digest autentica i pacchetti del canale dati (SHA 256 predefinito)
- `Cipher`: cifra di crittografia utilizzata (AES-256-GCM predefinito)
- `Enforce a minimum TLS version`: consente la connessione solo per i client che utilizzano una versione TLS uguale o superiore a quella specificata.
- `Custom DHCP options`: passa opzioni DHCP specifiche al client (ad es. DOMAIN, DNS, WINS e così via)

#### Opzioni DHCP

Le opzioni DHCP vengono utilizzate per passare parametri di configurazione specifici al client. Le opzioni DHCP disponibili sono:

1.  `DNS [addr]`: imposta gli indirizzi del server DNS primario e secondario (IPv4 o IPv6). Ripeti l'opzione per impostare più indirizzi.
2.  `WINS [addr]`: imposta gli indirizzi del server Windows Internet Name Service (NetBIOS su TCP/IP Name Server) primario e secondario. Ripeti l'opzione per impostare più indirizzi.
3.  `NBDD [addr]`: imposta gli indirizzi del server NetBIOS Datagram Distribution Server (NetBIOS su TCP/IP Datagram Distribution Server) primario e secondario. Ripeti l'opzione per impostare più indirizzi.
4.  `NTP [addr]`: imposta gli indirizzi del server Network Time Protocol primario e secondario. Ripeti l'opzione per impostare più indirizzi.
5.  `NBT [type]`: imposta il tipo di codice NetBIOS su TCP/IP:
    - `1`: Broadcast
    - `2`: Point-to-point (utilizza WINS)
    - `4`: Misto (broadcast, quindi query al server dei nomi)
    - `8`: Ibrido (query al server dei nomi, quindi broadcast)
6.  `NBS [scope-id]`: imposta l'ID ambito NetBIOS per isolare il traffico NetBIOS e consentire nomi di computer univoci in diversi ambiti.
7.  `DISABLE-NBT [1]`: Disattiva NetBIOS su TCP/IP. Il parametro è semplicemente `1` per abilitare l'opzione.

## Account VPN

Ora che il server è stato configurato, è necessario creare gli account per i client che si connettono. Per fare ciò, fai clic su **Add VPN Account** e compila il modulo:

- `User`: ogni account è associato a un solo utente dal database scelto, seleziona l'utente per questo account
- `Reserved IP`: specifica un indirizzo IP che fa parte della rete VPN definita ma al di fuori dell'intervallo dinamico. L'indirizzo IP inserito sarà sempre assegnato a questo account specifico, questo può essere molto utile per creare regole del firewall. Lascialo vuoto per assegnare un indirizzo IP casuale ad ogni connessione.
- `Certificate expiration (days)`: specifica una durata del certificato (3650 giorni per impostazione predefinita)

Una volta creato l'account, è necessario esportare la configurazione e caricarla nel client che deve connettersi. Per fare ciò, fai semplicemente clic sul menu dell'account specifico e scegli `Download configuration`. Questa azione scarica il file pronto per l'uso, semplicemente da caricare nel client. Questo file viene generato dinamicamente in base alla configurazione attuale del server OpenVPN e contiene già tutte le informazioni necessarie, inclusi i dettagli di configurazione (indirizzi del server, porta, ecc.) e i certificati richiesti. Nel caso in cui la modalità operativa del server venga modificata (ad es., se la modalità di autenticazione viene alterata), è necessario scaricare di nuovo il file.

Le altre azioni disponibili sono:

- `Disable`: disabilita l'account; l'account può essere riabilitato in qualsiasi momento.

:::note

Se un client è già connesso al server roadwarrior, l'azione `Disable` sull'account rispettivo causa una disconnessione immediata dal server, interrompendo la comunicazione.

:::

- `Regenerate certificate`: ricrea il certificato personale per l'account; se il certificato attuale non è scaduto, verrà revocato e sarà necessario utilizzare quello nuovo. Dopo aver ricreato il certificato, è necessario aggiornarlo sul client scaricando di nuovo l'intera configurazione o solo il certificato.
- `Delete`: elimina l'account e il suo certificato, questa operazione è irreversibile e il certificato non è recuperabile.

### Comportamento del client

Alcune informazioni sul comportamento dei client:

- I client connessi alla VPN Road Warrior sono assegnati alla zona `rwopenvpn`, che è intrinsecamente attendibile. Per impostazione predefinita, questa zona ha accesso privilegiato sia alle zone LAN che WAN all'interno dell'infrastruttura di rete.
- Backup della connessione: in caso di più WAN, i client si connetteranno utilizzando il primo IP/nome host della configurazione del server, se non disponibile utilizzeranno il secondo IP/nome host e così via.
- Per motivi di sicurezza, non è possibile connettere più client con lo stesso account. Ogni account può essere utilizzato da un solo client alla volta. Se un nuovo client tenta di connettersi con un account che è già connesso al sistema, il primo account verrà disconnesso.

### Software client {#client_software-section}

Tutte le principali piattaforme sono supportate. Ecco alcuni riferimenti per scaricare il software necessario:

- Sistemi Windows: [OpenVPN WebSite](https://openvpn.net/community-downloads/)
- Sistemi MacOS: [TunnelBlick](https://tunnelblick.net/) o il [Client ufficiale](https://openvpn.net/client-connect-vpn-for-mac-os/)
- Sistemi Linux: di solito già disponibile nella sezione software della maggior parte delle distribuzioni, le fonti sono disponibili presso [OpenVPN WebSite](https://openvpn.net/community-downloads/)
- Sistemi Android: [OpenVPN Connect su Play Store](https://play.google.com/store/apps/details?id=net.openvpn.openvpn)
- Sistemi iOS: [OpenVPN Connect su App Store](https://apps.apple.com/it/app/openvpn-connect-openvpn-app/id590379981)

## Gestione della scadenza dei certificati {#managing-openvpn-certificate-expiration}

Un'istanza di OpenVPN Road Warrior utilizza certificati TLS per l'autenticazione. Per evitare problemi di connettività, è fondamentale monitorare le date di scadenza dei certificati utilizzati in tutta l'infrastruttura.

Quando viene creato un nuovo server OpenVPN Road Warrior, il sistema genera una nuova `PKI (Public Key Infrastructure)`, composta da:

- un certificato **CA** (**Autorità di certificazione**)
- un certificato **server**

I certificati client vengono generati per ogni utente nel database selezionato durante la configurazione del server o quando un utente viene aggiunto in seguito.

Ognuno di questi elementi (client, server e CA) ha il suo certificato con una data di scadenza specifica, e tutti loro devono essere validi per consentire la connessione.

Puoi controllare le date di scadenza direttamente nell'interfaccia utente. Le date di CA e server (che appartengono all'istanza OpenVPN) sono mostrate nella sezione dettagli del server, quelle dei client (che appartengono agli account utente creati per quell'istanza) sono mostrate nella tabella dei client.

Vicino a ogni data è possibile visualizzare due icone diverse:

- un'icona gialla di esclamazione triangolare, che significa che il certificato scadrà in meno di 30 giorni
- un'icona rossa di esclamazione circolare, che significa che il certificato è già scaduto.

Per impostazione predefinita, tutti i certificati vengono generati con una validità di 3650 giorni (10 anni).

Una connessione tra il server OpenVPN Road Warrior e i suoi client verrà interrotta quando almeno un certificato scade, quindi è importante monitorare le date di scadenza e rinnovare i certificati prima che scadano. In particolare, questi sono i possibili scenari:

- il certificato CA è scaduto
- il certificato del server è scaduto
- il certificato del client è scaduto

Di seguito sono riportati i passaggi per rinnovare i certificati in ogni scenario e ripristinare la connessione.

### Certificato client scaduto

In questo scenario, il certificato del client deve essere rigenerato utilizzando l'opzione **Regenerate certificate** sul lato server (come menzionato sopra). Quindi, la nuova configurazione/certificato del client deve essere scaricata e importata sul lato client.

### Certificato server scaduto

In questo scenario, il certificato del server deve essere rinnovato sul lato server.

Il certificato del server può essere rinnovato utilizzando l'opzione dedicata **Renew server certificate**, disponibile nel menu **︙** a destra della sezione dettagli del server.

Questa operazione revocherà il certificato del server esistente, ne creerà uno nuovo senza influenzare il certificato CA, e quindi riavvierà il servizio *openvpn* per applicare le modifiche. In questo scenario, se i certificati client sono ancora validi, puoi continuare a utilizzare la configurazione del client esistente.

:::warning

Quando si rigenera il certificato del server, i certificati dei client rimangono validi (se non scaduti). Se il rinnovo del certificato viene eseguito mentre i client sono connessi, è necessario che il client si disconnetta e si ricollega al server per ripristinare la connessione. Se il rinnovo del certificato viene eseguito mentre **i client sono disconnessi (modo consigliato)**, la connessione verrà ripristinata automaticamente quando tenteranno di connettersi di nuovo.

:::

### Certificato CA scaduto

In questo scenario, la rigenerazione del certificato non è possibile perché il certificato CA è quello che firma sia i certificati del server che dei client. Pertanto, un nuovo PKI completamente nuovo deve essere generato.

Per generare un nuovo PKI, è disponibile l'opzione **Regenerate all certificates** nel menu **︙** a destra della sezione dettagli del server. L'utente deve quindi digitare il nome del server per confermare l'operazione.

Questa operazione genererà un nuovo certificato CA, così come nuovi certificati server e client firmati dal nuovo CA. In questo scenario, è **obbligatorio** scaricare e importare la nuova configurazione del client sul lato client per ripristinare la connessione, quindi assicurati di farlo il prima possibile per ridurre al minimo i tempi di inattività.

:::warning

Quando il certificato CA è scaduto, l'unico modo per ripristinare la connessione è generare un nuovo PKI e importare la nuova configurazione del client sul lato client. Se i certificati client e server sono ancora validi (ad esempio, hai rigenerato il certificato client utilizzando l'opzione **Regenerate certificate** e rinnovato il certificato del server utilizzando l'opzione **Renew server certificate** sopra) ma il certificato CA è scaduto, la connessione non verrà ripristinata finché non verrà generato un nuovo certificato CA e non verrà importata la nuova configurazione del client sul lato client. Pertanto, se il tuo client non riesce più a connettersi al server a causa della scadenza del certificato, assicurati di controllare quale certificato è scaduto e seguire la procedura corretta per ripristinare la connessione.

:::

## Problema MTU e frammentazione dei pacchetti

Per impostazione predefinita, le istanze del server OpenVPN Road Warrior create su NethSecurity vengono inizializzate con i seguenti valori:

- Maximum Transmission Unit - `tun_mtu` = `1500`
- Maximum Segment Size - `mssfix` = `1450`.

Questi sono valori predefiniti di OpenVPN che sono generalmente adatti per la maggior parte degli ambienti di rete e dovrebbero essere modificati solo se si riscontrano problemi di connettività dovuti alla frammentazione dei pacchetti.

Gli utenti VPN possono riscontrare problemi di connettività dovuti alla frammentazione dei pacchetti. L'interfaccia LAN ha un MTU di 1500 per impostazione predefinita, ma quando i pacchetti vengono crittografati per la trasmissione VPN, le dimensioni aumentano, portando al drop dei pacchetti. Per risolvere questo problema, l'MTU e il MSS sul server OpenVPN RW devono essere abbassati. Non sono necessarie modifiche sul lato client.

I valori di MTU e MSS possono essere regolati direttamente nell'interfaccia utente, quando si crea il server OpenVPN RW per la prima volta o successivamente quando lo si modifica utilizzando il pulsante `Edit`, nella sezione `Advanced options` nel drawer. Oppure, puoi regolare i due valori di configurazione utilizzando l'interfaccia della riga di comando sul firewall:

    uci set openvpn.ns_<name>.tun_mtu='1300'
    uci set openvpn.ns_<name>.mssfix='1250'
    uci commit openvpn.ns_<name>
    /etc/init.d/openvpn restart ns_<name>

I valori di `tun_mtu` e `mssfix` potrebbero dover essere regolati in base al tuo specifico ambiente di rete. Un MTU più basso assicura che i pacchetti si adattino ai limiti del tunnel OpenVPN senza frammentazione. A seconda di fattori come la latenza di rete o il sovraccarico, potresti scoprire che valori leggermente diversi funzionano meglio per la tua configurazione.

Per informazioni più specifiche, consulta la [documentazione ufficiale di OpenVPN](https://openvpn.net/community-docs/community-articles/openvpn-2-6-manual.html).

## Cronologia delle connessioni

Ogni volta che un client si connette o si disconnette dal server, l'evento viene salvato in un database SQLite. Questa cronologia degli eventi può essere visualizzata facendo clic sulla scheda `Connection History` disponibile nella parte superiore della pagina.

Per impostazione predefinita, la pagina visualizzerà tutte le connessioni del giorno corrente, ma è possibile filtrare i risultati per data e ora e nome dell'account.

Per scaricare tutta la cronologia in formato CSV, fai clic sul pulsante **Download server history**. L'intestazione del file CSV spiega il significato di ogni colonna, incluse le unità di misura.

La cronologia viene letta da un database SQLite che può essere archiviato in:

- **RAM**: archiviato in RAM (non persistente); verrà perso quando il firewall si riavvia.
- **Storage**: archiviato nell'archivio persistente; sopravvive a un riavvio.

Per impostazione predefinita, se l'archivio persistente è disponibile e configurato, gli eventi di connessione vengono archiviati nel database di archiviazione, altrimenti vengono archiviati nel database RAM.

Se un server RoadWarrior è già configurato e viene collegato un nuovo dispositivo di archiviazione, la cronologia viene automaticamente spostata da RAM ad archiviazione, rendendola persistente e in grado di sopravvivere ai riavvii. Al contrario, se l'archiviazione viene rimossa, i nuovi eventi di connessione verranno archiviati nel database RAM e saranno visibili nella sezione Cronologia delle connessioni. Se l'archiviazione viene quindi ricollegata, le cronologie da RAM e archiviazione vengono unite senza perdita di dati.

Se il server è connesso a un [Controller](../system/controller.md), la cronologia viene inviata al controller e può essere visualizzata all'interno di [Historical monitoring](../monitoring/monitoring.md#historical_monitoring-section).
