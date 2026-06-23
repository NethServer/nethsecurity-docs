---
title: "NAT"
sidebar_position: 2
---

# NAT {#nat-section}

La traduzione degli indirizzi di rete (NAT) viene utilizzata per modificare le informazioni degli indirizzi di rete nell'intestazione dei pacchetti durante il transito. Il NAT consente principalmente la traduzione degli indirizzi IP privati utilizzati all'interno di una rete locale in un indirizzo IP pubblico, permettendo a più dispositivi all'interno della rete locale di condividere un singolo IP pubblico quando accedono a internet. Per impostazione predefinita, tutti gli host all'interno della rete locale che accedono a WAN utilizzando il firewall utilizzano il mascheramento. Il mascheramento è una forma di NAT che assegna automaticamente l'indirizzo IP di origine dei pacchetti in uscita all'indirizzo IP WAN del firewall. Ciò garantisce che gli host interni che accedono a internet appaiano ai server esterni come se originassero dall'indirizzo IP pubblico del firewall.

Accedi alla pagina `NAT` nella sezione `Firewall`, questa pagina è organizzata in due schede: `Rules and NETMAP` e `NAT helpers`.

La scheda `Rules and NETMAP` consente di configurare i seguenti tipi di regole NAT:

- [Source NAT](#snat-section)
- [Masquerade](#masquerade-section)
- [Accept (disabilita NAT)](#disable_nat-section)
- [Netmap](#netmap-section)

Nota che queste regole NAT vengono applicate a tutti i protocolli di rete.

Puoi configurare anche regole NAT di destinazione (DNAT), comunemente denominate port forward o redirect di porta, dalla pagina [port forward](./port_forward.md).

La scheda `NAT helpers` consente di abilitare o disabilitare i NAT helper:

- [NAT helpers](#helpers-section)

## SNAT {#snat-section}

Source NAT, spesso denominato SNAT, modifica l'indirizzo IP di origine dei pacchetti in uscita. È comunemente utilizzato in reti in cui gli indirizzi IP privati vengono tradotti in un singolo indirizzo IP pubblico quando comunicano con reti esterne. SNAT garantisce che le risposte dai server esterni vengano instradate di nuovo al dispositivo interno corretto modificando l'indirizzo IP di origine dei pacchetti in uscita all'indirizzo IP pubblico. Ciò consente a più dispositivi interni di accedere a internet utilizzando un indirizzo IP pubblico condiviso, migliorando la sicurezza e la scalabilità.

**Esempio** Hai una piccola azienda con due indirizzi IP pubblici forniti dal tuo provider di servizi Internet (ISP). Desideri utilizzare uno di questi IP (1.2.3.4) specificamente per il tuo server di posta interno (192.168.1.33) per migliorare la sua reputazione e l'autenticazione del mittente. L'altro indirizzo IP verrà utilizzato per l'accesso generale a internet.

**Problema** Per impostazione predefinita, tutto il traffico in uscita dalla tua rete utilizza lo stesso IP WAN, incluso il tuo server di posta. Ciò può influire negativamente sulla reputazione del tuo server di posta, poiché i spammer spesso utilizzano IP condivisi. Inoltre, potresti richiedere configurazioni specifiche per il server di posta diverse dal resto del traffico internet.

**Soluzione** Configura l'IP alias (1.2.3.4) sulla tua interfaccia WAN, quindi crea una regola SNAT (Static Network Address Translation) nel tuo firewall per indirizzare tutto il traffico in uscita dal tuo server di posta all'indirizzo IP pubblico dedicato. La regola dovrebbe contenere l'indirizzo IP interno del tuo server di posta (192.168.1.33) come origine e l'IP pubblico dedicato (1.2.3.4) come indirizzo di traduzione, la zona di uscita deve essere impostata su WAN; seleziona SNAT come azione.

**Risultato** Tutto il traffico in uscita originario dal tuo server di posta verrà ora tradotto all'indirizzo IP pubblico dedicato. Questo migliora la reputazione del tuo server di posta e consente configurazioni specifiche adatte alle sue esigenze. Il traffico internet generale continuerà a utilizzare l'altro indirizzo IP pubblico.

### Source NAT in uno scenario MultiWAN

Se hai più WAN e la tua regola SNAT riscrive uno degli IP pubblici WAN, devi creare una regola MultiWAN in aggiunta alla regola SNAT. Questa regola instraderà il traffico dall'indirizzo IP di origine attraverso il WAN corretto con l'indirizzo IP pubblico.

Se non l'hai ancora configurato, aggiungi un criterio personalizzato che include solo il WAN rilevante. Quindi, crea una regola per applicare questo criterio personalizzato per il traffico originario dall'indirizzo IP interno (indirizzo di origine) a qualsiasi destinazione e protocollo.

## MASQUERADE {#masquerade-section}

La regola di mascheramento maschera tutto il traffico in uscita con l'indirizzo IP dell'interfaccia di uscita del firewall. Il traffico dagli host interni a Internet viene automaticamente mascherato dal firewall. Il mascheramento può essere utilizzato anche per mascherare il traffico proveniente da una rete remota (ad es. VPN) con l'IP del firewall per evitare problemi di routing.

**Esempio** Devi raggiungere un host sulla rete locale (instradato) dalla rete VPN (ad es. 192.168.7.0/24), ma l'host non ha un gateway configurato o ha un gateway diverso dal firewall.

**Problema** L'host non può raggiungere il dispositivo locale a causa della mancanza di un gateway.

**Soluzione** Crea una regola NAT con azione di mascheramento per il traffico proveniente dalla rete VPN. Questo maschera il traffico dalla rete VPN (192.168.7.0/24) alla rete locale con l'IP del firewall dell'interfaccia di destinazione. La regola dovrebbe contenere la rete VPN (192.168.7.0/24) come origine e la rete host interno (192.168.1.0/24) come indirizzo di destinazione, la zona di uscita può essere lasciata vuota; seleziona MASQUERADE come azione.

**Risultato** L'host può raggiungere il dispositivo locale (ad es. 192.168.1.78) come se originasse dal firewall.

## ACCEPT (disabilita NAT) {#disable_nat-section}

Una regola ACCEPT disabilita il NAT (no-NAT) e ti consente di bypassare il processo NAT per traffico specifico. Questo è particolarmente utile per evitare il mascheramento WAN per destinazioni specifiche.

**Esempio** Il tuo firewall è collegato a un router che, oltre a consentire l'accesso a internet, consente anche di raggiungere reti private attraverso connessioni CDN o tunnel IPsec. Per raggiungere le reti remote private, il traffico dalla rete locale deve uscire con il suo indirizzo IP originale (senza riscrittura di mascheramento).

**Problema** Le politiche di tunnel del router consentono solo il traffico tra la rete locale di NethSecurity e le reti di destinazione, ma tutto il traffico esce dal firewall con l'IP mascherato (IP WAN di NethSecurity). A causa del mascheramento, la comunicazione diretta tra la LAN di NethSecurity e la rete remota non è possibile.

**Soluzione**: Crea una regola NAT (Network Address Translation) con ACCEPT nel tuo firewall. Questa regola evita il mascheramento per tutto il traffico verso la rete CDN, mantenendo invariato l'indirizzo IP di origine locale. La regola dovrebbe contenere la rete interna (192.168.1.0./24) come origine e la rete CDN (192.168.50.0/24) come indirizzo di destinazione.

## Netmap {#netmap-section}

Netmap è una tecnica NAT che offre traduzione 1:1 a livello di rete senza modificare i singoli indirizzi host. Ciò significa che potrebbe mappare un'intera rete privata (ad es. 192.168.1.0/24) a un'altra rete (ad es. 10.5.6.0/24) contemporaneamente, eliminando la necessità di configurare manualmente singole regole NAT per ogni dispositivo.

**Esempio** 2 firewall, FW-A e FW-B che holding un tunnel VPN tra le reti A e B, le reti locali e remote si sovrappongono (192.168.1.0/24), il che rende impossibile instradare il traffico tra loro. Tradurre le reti A e B su due reti alternative può risolvere il problema in modo che non vi siano reti sovrapposte.

Usiamo questo schema di traduzione.

- Network A: 192.168.1.0/24 -> è tradotto a -> Network ALT_A: 10.1.1.0/24
- Network B: 192.168.1.0/24 -> è tradotto a -> Network ALT_B: 10.2.2.0/24

Un host nella rete A che cerca di raggiungere un host nella rete B non deve contattare l'IP reale ma la sua rete tradotta (solo l'ultimo ottetto rimane lo stesso). Ad esempio, l'host 192.168.1.10 dalla rete A che vuole raggiungere 192.168.0.20 nella rete B deve contattare l'IP 10.2.2.20 invece. Prima che la richiesta esca dal firewall FW-A, l'origine del pacchetto verrà riscritta da FW-A all'ALT_IP 10.1.1.10 per eliminare ogni problema di routing sulla rete B. Il processo inverso si verificherà per i pacchetti di ritorno.

**Soluzione** Il problema può essere risolto utilizzando netmap per tradurre il traffico a una rete privata diversa. Ciò consente al traffico di essere instradato correttamente.

**Come farlo**

Per consentire alla rete A di accedere a una risorsa nella rete B, sono necessarie due regole: una per il netmap di origine e una per il netmap di destinazione.

- La prima regola, agendo come netmap di origine, specifica che tutto il traffico diretto verso la rete 10.2.2.0/24 (rete di destinazione) e originario dalla rete 192.168.1.0/24 (rete di origine) sarà mappato sulla rete 10.1.1.0/24 (rete di origine mappata).
- La seconda regola funziona come netmap di destinazione, svolgendo un ruolo cruciale nel ricevere correttamente le risposte. Richiede che il traffico originario dalla rete 10.2.2.0/24 (rete di origine) e destinato alla rete 10.1.1.0/24 (rete di destinazione) sarà mappato sulla rete 192.168.1.0/24 (rete di destinazione mappata).

**Risultato** Tutte le richieste di traffico (e le loro risposte) dalla rete A alla rete B verranno instradate correttamente.

:::note

Se hai bisogno di consentire richieste a partire dalla rete B verso la rete A devi fare lo stesso nel firewall B.

:::

### Source netmap

Il "source netmap" ci consente di determinare come l'origine dovrebbe cambiare quando il traffico è diretto verso una destinazione specifica. Ad es., rete di destinazione 10.2.2.0/24, rete di origine: 192.168.0.0/24, rete di origine natted: 10.1.1.0/24.

Puoi creare una regola di source netmap dall'interfaccia web all'interno della pagina `NAT`. Nella parte inferiore della pagina, fai clic sul pulsante **Add source NETMAP** per creare una nuova regola. All'interno del drawer, compila i campi come segue:

- **Name**: un nome per la regola
- **Destination network**: la rete di destinazione in notazione CIDR, ad es. 10.2.2.0/24 per l'esempio precedente
- **Source network**: la rete di origine, ad es. 192.168.1.0/24
- **Mapped network**: la rete di origine tradotta, ad es. 10.1.1.0/24

Nella sezione `Advanced settings`, puoi specificare i dispositivi di ingresso e uscita per la regola. Se il dispositivo non è specificato, la regola verrà applicata a tutti i dispositivi.

### Destination Netmap

Il "destination netmap" ci consente di determinare come l'indirizzo IP di destinazione dovrebbe cambiare quando il traffico proviene da una rete specifica. Ad es., rete di origine 10.2.2.0/24, rete di destinazione: 10.1.1.0/24, rete di destinazione natted: 192.168.0.0/24.

Puoi creare una regola di destination netmap dall'interfaccia web all'interno della pagina `NAT`. Nella parte inferiore della pagina, fai clic sul pulsante **Add destination NETMAP** per creare una nuova regola. All'interno del drawer, compila i campi come segue:

- **Name**: un nome per la regola
- **Source network**: la rete di origine in notazione CIDR, ad es. 10.2.2.0/24
- **Destination network**: la rete di destinazione, ad es. 10.1.1.0/24
- **Mapped network**: la rete di destinazione tradotta, ad es. 192.168.1.0/24

Nella sezione `Advanced settings`, puoi specificare i dispositivi di ingresso e uscita per la regola. Se il dispositivo non è specificato, la regola verrà applicata a tutti i dispositivi.

### CLI commands

Per creare una regola SOURCE netmap da CLI:

    uci set netmap.r1=rule
    uci set netmap.r1.name=source_nat
    uci set netmap.r1.dest=10.2.2.0/24
    uci set netmap.r1.map_from=192.168.1.0/24
    uci set netmap.r1.map_to=10.1.1.0/24

Puoi anche specificare i dispositivi in/out opzionali in questo modo:

    uci  add_list netmap.r1.device_in='eth0'
    uci  add_list netmap.r1.device_out='tunrw1'

Poi esegui il commit e applica:

    uci commit netmap
    ns-netmap

Per creare una regola DESTINATION netmap da CLI:

    uci set netmap.r2=rule
    uci set netmap.r2.name=dest_nat
    uci set netmap.r2.src=10.2.2.0/24
    uci set netmap.r2.map_from=10.1.1.0/24
    uci set netmap.r2.map_to=192.168.1.0/24

Puoi anche specificare i dispositivi in/out opzionali in questo modo:

    uci  add_list netmap.r2.device_in='tunrw1'
    uci  add_list netmap.r2.device_out='eth01'

Poi esegui il commit e applica:

    uci commit netmap
    ns-netmap
    /etc/init.d/firewall reload

## NAT helpers {#helpers-section}

I NAT helper sono meccanismi progettati per facilitare la comunicazione di determinati protocolli che potrebbero incontrare problemi quando utilizzati con NAT di base. Alcuni protocolli comuni, come FTP, SIP o H.323, incorporano indirizzi IP o numeri di porta nel payload dei dati, il che può creare problemi con NAT standard.

I NAT helper, noti anche come Application Layer Gateway (ALG), operano a livello di applicazione. Il loro ruolo principale è modificare i dati specifici del protocollo, come indirizzi IP incorporati o porte all'interno dei pacchetti, garantendo che questi protocolli funzionino correttamente quando passano attraverso NAT.

Ad esempio, in FTP, i NAT helper modificano gli indirizzi IP e le porte all'interno dei pacchetti di controllo e dati FTP, consentendo il corretto attraversamento NAT per le connessioni FTP. Allo stesso modo, i NAT helper per SIP e altri protocolli garantiscono che i dispositivi che utilizzano questi protocolli possano stabilire connessioni oltre i confini NAT senza problemi.

NethSecurity fornisce vari tipi di NAT helper, tutti disabilitati per impostazione predefinita. Se necessario, i helper specifici possono essere abilitati tramite l'interfaccia web.

Durante la configurazione dell'helper, l'interfaccia potrebbe visualizzare determinati parametri tipici del protocollo coinvolto. Questi parametri sono precompilati con i valori predefiniti più comunemente utilizzati. Poiché i parametri dipendono dal tipo di protocollo, variano sia in numero che in tipo a seconda dell'helper (alcuni helper non visualizzano alcun parametro).

Dopo qualsiasi modifica, il firewall ti notificherà se è necessario un riavvio. Questo accade solitamente quando un helper viene disabilitato o modificato (se è già attivo).

Quando determinati helper sono abilitati, gli helper correlati vengono caricati automaticamente nel kernel come dipendenze. Ad esempio, se `nf_nat_ftp` è abilitato, l'helper correlato `nf_conntrack_ftp` verrà caricato automaticamente nel kernel. Per quell'helper l'interfaccia web visualizzerà `Loaded` con un'icona informativa per notificare all'utente.
