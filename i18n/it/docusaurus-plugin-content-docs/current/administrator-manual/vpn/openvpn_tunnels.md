---
title: "Tunnel OpenVPN"
sidebar_position: 2
---

# Tunnel OpenVPN {#openvpn_tunnels-section}

I tunnel OpenVPN da rete a rete stabiliscono connessioni sicure tra due reti separate, come le filiali di un'azienda, su Internet. Queste connessioni utilizzano protocolli SSL/TLS per la crittografia e l'autenticazione, garantendo la riservatezza e l'integrità dei dati.

La connessione è gestita da 2 firewall NethSecurity, ognuno con un ruolo specifico. Durante la creazione di una connessione OpenVPN net2net, un firewall avrà il ruolo di server mentre l'altro NethSecurity si collegherà ad esso come client. Un NethSecurity può essere contemporaneamente server e client per diversi tunnel; tutti i tunnel utilizzano la modalità instradamento di OpenVPN.

L'interfaccia dei tunnel OpenVPN è stata progettata per una connessione semplice tra due dispositivi NethSecuirty. Per questo motivo, è deliberatamente limitata e non espone tutti i parametri che possono essere configurati con OpenVPN per connettersi a qualsiasi dispositivo di terze parti. Per connettersi a un dispositivo di terze parti, è consigliato utilizzare il protocollo IPsec.

## Configurazione

Per collegare due firewall tramite un tunnel OpenVPN, configurare prima il firewall server, quindi quello client. Il server necessita di almeno un indirizzo IP pubblico per essere raggiungibile dal client, mentre il client potrebbe non avere nemmeno indirizzi IP pubblici. La configurazione del firewall server richiede solo pochi parametri; dove possibile, tutti i parametri sono già compilati automaticamente per evitare errori e accelerare il processo. Una volta configurato il firewall server, sarà possibile scaricare la configurazione client da importare sull'altro firewall.

### Procedere come segue:

Accedere alla pagina dei tunnel OpenVPN, spostarsi sulla scheda `Server tunnel` e fare clic su **Aggiungi tunnel server**.

Inserire tutti i campi obbligatori, ma notare che:

- `Public endpoints` è un elenco di indirizzi IP o nomi host che i client possono utilizzare per raggiungere il server tunnel OpenVPN
- `Local networks` è un elenco di reti locali che saranno accessibili dal server remoto. Se la topologia è impostata su p2p, lo stesso elenco verrà riportato nel campo `Remote networks` del client
- `Remote networks`, è un elenco di reti dietro il server remoto che saranno accessibili dagli host della rete locale
- Dopo aver salvato la configurazione, fare clic su **Download** e selezionare `Client configuration`
- Accedere al firewall client, tunnel OpenVPN, spostarsi sulla scheda `Client tunnel`, fare clic su **Importa configurazione**

## Topologia

I tunnel possono avere due tipi di topologie: `subnet` e `p2p` (Point to Point).

### Subnet

`Subnet` è la topologia predefinita e consigliata: in topologia `subnet`, il server accetterà le connessioni e funzionerà come server DHCP per ogni client connesso.

In questo scenario il server autenticherà i client utilizzando certificati TLS e invierà le route locali al client remoto.

### P2P

In una topologia `p2p`, l'amministratore deve configurare un server per ogni client; in questo scenario l'unico metodo di autenticazione supportato è PSK (Pre-Shared Key).

- assicurarsi di scambiare la PSK utilizzando un canale sicuro (come SSH o HTTPS)
- l'amministratore deve selezionare un IP per entrambi gli endpoint
- le route alle reti remote devono essere configurate su ogni endpoint

## Funzionalità avanzate

L'interfaccia web consente la configurazione di funzionalità avanzate come:

- `Multiple remote host`: è possibile specificare più indirizzi server remoti per la ridondanza; il client OpenVPN tenterà di connettersi a ogni host nell'ordine specificato
- `Protocol`: OpenVPN è progettato per funzionare in modo ottimale su UDP, ma è fornita la funzionalità TCP per situazioni in cui UDP non può essere utilizzato
- `Compression`: se abilitata, i dati da inviare tramite il tunnel VPN verranno compressi. Questa opzione è disabilitata per impostazione predefinita per motivi di sicurezza. La compressione è raramente essenziale al giorno d'oggi, poiché il traffico Internet è tipicamente già altamente compresso e ottimizzato
- `Digest`: l'algoritmo di digest utilizzato per trasformare un blocco di dati arbitrariamente grande in un output di dimensione fissa. Se non esplicitamente selezionato, il server e il client tenteranno di negoziare il miglior digest disponibile su entrambi i lati
- `Cipher`: l'algoritmo crittografico utilizzato per crittografare tutto il traffico. Se non esplicitamente selezionato, il server e il client tenteranno di negoziare il miglior cipher disponibile su entrambi i lati
- `Enforce a minimum TLS version`: consente di scegliere una versione minima di TLS; in questo caso, le connessioni saranno consentite solo dai dispositivi che utilizzano una versione maggiore o uguale a quella selezionata

## Tunnel OpenVPN multipli

Se NethSecurity deve agire come server VPN per più firewall remoti, è necessario creare un tunnel OpenVPN dedicato per ogni peer remoto.
Il modello supportato dall'interfaccia e raccomandato è una coppia server/client per ogni connessione site-to-site: ad esempio, un firewall centrale collegato a tre firewall remoti deve avere tre tunnel OpenVPN server separati, ciascuno con la propria configurazione client importata sul firewall remoto corrispondente.

Questo approccio consente di gestire ogni tunnel in modo indipendente, con configurazione, certificati, route, stato, monitoraggio e risoluzione dei problemi separati.
Evita inoltre che i problemi su una connessione remota influenzino la gestione operativa delle altre.

Non utilizzare un unico tunnel OpenVPN server condiviso da più client remoti per configurazioni site-to-site gestite dall'interfaccia.

## Problema MTU e frammentazione dei pacchetti

Per impostazione predefinita, le istanze di tunnel OpenVPN create su NethSecurity vengono inizializzate con i seguenti valori:

- Maximum Transmission Unit - `tun_mtu` = `1500`
- Maximum Segment Size - `mssfix` = `1450`.

Questi sono valori predefiniti di OpenVPN che sono generalmente adatti alla maggior parte degli ambienti di rete e dovrebbero essere modificati solo se si riscontrano problemi di connettività dovuti alla frammentazione dei pacchetti.

Gli utenti VPN potrebbero riscontrare problemi di connettività dovuti alla frammentazione dei pacchetti. L'interfaccia LAN ha un MTU di 1500 per impostazione predefinita, ma quando i pacchetti vengono crittografati per la trasmissione VPN, la dimensione aumenta, portando al perdimento di pacchetti. Per risolvere questo problema, l'MTU e il MSS sul tunnel OpenVPN devono essere ridotti. Non sono necessarie modifiche sul lato client.

I valori di MTU e MSS possono essere regolati direttamente nell'interfaccia utente, durante la creazione del tunnel per la prima volta o successivamente durante la modifica utilizzando il pulsante `Edit`, nella sezione `Advanced options` nel drawer. In alternativa, è possibile regolare i due valori di configurazione utilizzando l'interfaccia della riga di comando sul firewall:

    uci set openvpn.ns_<name>.tun_mtu='1300'
    uci set openvpn.ns_<name>.mssfix='1250'
    uci commit openvpn.ns_<name>
    /etc/init.d/openvpn restart ns_<name>

I valori di `tun_mtu` e `mssfix` potrebbe essere necessario regolarli in base all'ambiente di rete specifico. Un MTU inferiore assicura che i pacchetti si adattino ai limiti del tunnel OpenVPN senza frammentazione. A seconda di fattori come la latenza di rete o l'overhead, potresti scoprire che valori leggermente diversi funzionano meglio per la tua configurazione.

Per ulteriori informazioni specifiche, consultare la [documentazione ufficiale di OpenVPN](https://openvpn.net/community-docs/community-articles/openvpn-2-6-manual.html).

## Gestione della scadenza dei certificati

Come descritto nella sezione [Gestione della scadenza dei certificati](./openvpn_roadwarrior.md#managing-openvpn-certificate-expiration), i tunnel OpenVPN si basano anche su certificati ed è fondamentale monitorare le loro date di scadenza per evitare problemi di connettività.

Quando viene creato un nuovo tunnel OpenVPN, il sistema genera una nuova `PKI (Public Key Infrastructure)`, composta da **CA**, **server** e un **singolo certificato client** (a differenza delle connessioni Road Warrior, che hanno un certificato per utente).

Tutte le informazioni sulle date di scadenza dei certificati si trovano nella tabella **OpenVPN Tunnels**, dove è mostrata un'icona di lente di ingrandimento per ogni tunnel. Facendo clic su di essa si apre una modale con tutti i dettagli sulla configurazione del tunnel, compresi i certificati e le loro date di scadenza.

Sul **lato server**, la modale mostra le informazioni del certificato per i certificati CA, server e client. Sul **lato client**, mostra solo i certificati CA e client.

Nella tabella del tunnel, un'icona di avviso viene mostrata quando almeno uno di questi certificati scadrà in meno di 30 giorni o è già scaduto. Aprendo la modale dei dettagli del tunnel, puoi vedere quale certificato sta per scadere e la sua data di scadenza.

Per impostazione predefinita, tutti i certificati vengono generati con una validità di 3650 giorni (10 anni).

Una connessione tra i due firewall verrà interrotta quando almeno un certificato scade, secondo i tre scenari possibili descritti nella sezione OpenVPN Road Warrior.

Per verificare se il tunnel OpenVPN è disconnesso a causa della scadenza del certificato, è possibile ispezionare i **log del firewall** e cercare i messaggi relativi a OpenVPN, ubicati nel file `/var/log/messages`.

Esempio:

``` bash
grep 'VERIFY ERROR:' /var/log/messages
```

La ricerca restituisce messaggi come i seguenti:

``` bash
Feb  9 13:02:07 NethSec openvpn(ns_roadwarrior1)[8031]: VERIFY ERROR: depth=1, error=certificate has expired
Feb  9 13:02:07 NethSec openvpn(ns_roadwarrior1)[8031]: VERIFY ERROR: depth=0, error=certificate has expired
```

Queste righe significano che la connessione non funziona a causa della scadenza del certificato. Il problema potrebbe essere correlato al certificato CA (`depth=1`), al certificato server (`depth=0`) o a entrambi.

Per verificare la validità dei certificati, è possibile utilizzare i seguenti comandi `openssl`.

``` bash
# client
openssl x509 -in /etc/openvpn/{vpn-instance}/pki/issued/client.crt -text -noout | grep 'Not After'
# server
openssl x509 -in /etc/openvpn/{vpn-instance}/pki/issued/server.crt -text -noout | grep 'Not After'
# CA
openssl x509 -in /etc/openvpn/{vpn-instance}/pki/ca.crt -noout -dates -subject -issuer -serial
```

Il segnaposto `{vpn-instance}` deve essere sostituito con il nome dell'istanza di OpenVPN (ad esempio `ns_roadwarrior1`).

Di seguito sono riportati i passaggi per rinnovare i certificati in ogni scenario e ripristinare la connessione.

### Certificato client scaduto

In questo scenario, il certificato client deve essere rinnovato sul lato server e quindi scaricato e importato nuovamente sul lato client.

1.  Accedere al firewall server e navigare alla sezione **OpenVPN tunnels**.
2.  Fare clic sul menu **︙** a destra del tunnel e selezionare **Regenerate certificates**.
3.  Scaricare il nuovo certificato client e importarlo sul lato client.

Queste operazioni creeranno nuovi certificati server e client senza influire sul certificato CA (che si presume sia ancora valido in questo caso). In questo scenario, l'utilizzo del nuovo certificato client sul firewall client è **obbligatorio** per ripristinare la connessione, quindi assicurarsi di scaricarlo e importarlo sul lato client il prima possibile per ridurre al minimo i tempi di inattività.

### Certificato server scaduto

In questo scenario, il certificato server deve essere rinnovato sul lato server. Utilizzare la stessa azione **Regenerate certificates** descritta nello scenario precedente. È possibile continuare a utilizzare il certificato client esistente (se ancora valido) e scaricare/importare quello appena generato in seguito. Il nuovo certificato client scadrà nello stesso giorno del nuovo certificato server.

Come per il rinnovo del certificato server Road Warrior, la considerazione sul comportamento del client è la stessa: se il rinnovo del certificato viene eseguito mentre i client sono connessi, è necessario che il client si disconnetta e quindi si riconnetta al server per ripristinare la connessione, mentre se il rinnovo del certificato viene eseguito mentre **i client sono disconnessi (modalità consigliata)**, la connessione verrà automaticamente ripristinata quando tenteranno di connettersi di nuovo.

### Certificato CA scaduto

In questo scenario, devi procedere con la generazione di una PKI completamente nuova.

1.  Accedere al terminale del firewall server.
2.  Eseguire i seguenti comandi:

``` bash
ns-openvpn-renew-ca {vpn-instance}
service openvpn restart
```

Questi comandi genereranno un nuovo certificato CA, nonché nuovi certificati server e client firmati dalla nuova CA. In questo scenario, è **obbligatorio** scaricare e importare la nuova configurazione client sul lato client per ripristinare la connessione, quindi assicurarsi di farlo il prima possibile per ridurre al minimo i tempi di inattività.

Tutte le considerazioni rimangono le stesse per le connessioni Road Warrior. Se il certificato scaduto è il certificato CA, è necessario generare una PKI completamente nuova, mentre se il certificato scaduto è quello del server o del client, è possibile rigenerarlo utilizzando l'azione dedicata.
