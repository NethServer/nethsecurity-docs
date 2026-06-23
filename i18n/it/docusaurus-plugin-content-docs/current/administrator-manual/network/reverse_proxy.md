---
title: "Certificati e reverse proxy"
sidebar_position: 6
---

# Certificati e reverse proxy

## Reverse proxy

NethSecurity fornisce un reverse proxy utilizzando [nginx](https://nginx.org). Un reverse proxy, talvolta chiamato anche proxy pass, è un server che si posiziona di fronte a uno o più server web e inoltra le richieste ad essi. Può essere utilizzato per migliorare le prestazioni, la sicurezza e l'affidabilità.

In termini più semplici, un reverse proxy è come un vigile urbano per i server web. Indirizza le richieste in arrivo al server appropriato e rimanda le risposte.

I reverse proxy sono spesso utilizzati per migliorare le prestazioni memorizzando in cache il contenuto statico e distribuendo il traffico su più server. Possono anche essere utilizzati per aumentare la sicurezza implementando l'endpoint TLS.

:::note

Il reverse proxy è disponibile solo sulla porta 443 (HTTPS) e *non* sulla porta 80 (HTTP).

:::

Questa pagina consente agli utenti di configurare le impostazioni del proxy pass, specificando se la regola si applica a un dominio o a un percorso. Per le configurazioni di dominio, gli utenti possono selezionare un certificato. L'URL di destinazione determina dove vengono inoltrate le richieste in arrivo, e il campo della rete consentita fornisce l'opzione di limitare l'accesso a reti in formato CIDR specifiche. Una descrizione può essere aggiunta per chiarire.

Per configurare un nuovo proxy pass, fare clic su **Aggiungi reverse proxy** e personalizzare le seguenti opzioni:

- `Type`: scegliere tra Dominio o Percorso. Se il tipo è `Path`, immettere il percorso della risorsa iniziando con un \'/\' per le regole di corrispondenza (ad esempio, `/resource-path`). Se il tipo è `Domain`, immettere il nome di dominio completo per le regole di corrispondenza del sito web. Selezionare anche un [certificato](#certificates-section) associato.
- `Destination URL`: specificare la posizione di inoltro per le richieste in arrivo (ad esempio, `http://destination-server:port/path`).
- `Allowed networks`: definire le reti IPv4/IPv6 consentite in formato CIDR. Per impostazione predefinita, accessibile da qualsiasi luogo.
- `Description`: facoltativamente, aggiungere una descrizione per chiarire.

Informazioni aggiuntive:

- Intestazioni inviate al server di destinazione: X-Forwarded-Proto, X-Forwarded-For, X-Real-IP vengono sempre inviate.
- Convalida del certificato: se la destinazione utilizza HTTPS, il certificato non viene convalidato per evitare errori su server mal configurati.
- Supporto WebSocket: tutti i reverse proxy supportano automaticamente WebSocket.

### Interazione con le regole di port forward

Il proxy inverso usa solo la porta 443. Se è configurata anche una regola di port forward sulla porta 443, la regola di port forward ha sempre la precedenza.
In quel caso, il traffico HTTPS viene instradato secondo la regola di port forward e la regola del proxy inverso non viene applicata, perché nessun traffico raggiunge il server web in esecuzione sul firewall stesso.
Per utilizzare il proxy inverso, assicurarsi che non sia configurata alcuna regola di port forward sulla porta 443 per lo stesso indirizzo WAN.

### Proxy sulla porta 80 (HTTP) {#reverse_proxy-http-section}

NethSecurity 8 ascolta solo su HTTPS (porta 443) per le regole del reverse proxy. Questo differisce da NethSecurity 7, dove il reverse proxy ascoltava su HTTP (porta 80).

Durante la migrazione da NethSecurity 7, alcuni servizi o segnalibri degli utenti potrebbero ancora utilizzare HTTP. Poiché NethSecurity 8 non ascolta sulla porta 80 per impostazione predefinita, questi collegamenti HTTP non raggiungeranno più il reverse proxy e potrebbero apparire non funzionanti agli utenti.

L'abilitazione della porta 80 potrebbe esporre servizi, inclusa l'interfaccia web, su canali non crittografati. Per questo motivo, l'approccio consigliato è mantenere il reverse proxy in ascolto solo su canali sicuri e fornire un reindirizzamento permanente (301) da HTTP a HTTPS.

Per creare un reindirizzamento globale da HTTP a HTTPS, accedere al terminale e immettere i seguenti comandi:

``` bash
uci set nginx._cleartext=server
uci add_list nginx._cleartext.listen='80 default_server'
uci add_list nginx._cleartext.listen='[::]:80 default_server'
uci set nginx._cleartext.return='301 https://$host$request_uri'
uci set nginx._cleartext.server_name='_'
uci commit nginx
/etc/init.d/nginx reload
```

Dopo aver abilitato il reindirizzamento, accedere alla pagina delle regole del firewall e assicurarsi che la porta 80 sia aperta sul lato WAN per consentire le connessioni in arrivo.

### Nascondere la versione del server web {#reverse_proxy-hide-version-section}

Per impostazione predefinita, il reverse proxy nginx include il numero di versione nelle intestazioni di risposta HTTP. Molte valutazioni delle vulnerabilità si basano sull'identificazione della versione del software, il che può produrre falsi positivi quando le correzioni vengono sottoposte a backport senza modificare la versione segnalata. Anche se nascondere le informazioni sulla versione non migliora la sicurezza di per sé, può aiutare a limitare l'esposizione delle vulnerabilità specifiche della versione nota agli strumenti di scansione automatizzati.

Per disabilitare la visualizzazione della versione di nginx nelle intestazioni HTTP del reverse proxy, è necessario configurare la direttiva `server_tokens` per le configurazioni del server nginx.

Innanzitutto, identificare le configurazioni del server nginx:

``` bash
uci show nginx | grep "=server"
```

Questo mostrerà i blocchi del server configurati nel sistema (ad esempio, `nginx._lan=server`, `nginx.ns_88e3b6fd=server`).

Quindi, per ogni blocco del server che si desidera configurare, impostare `server_tokens` su `off`. Ad esempio, per configurare il server `_lan`:

``` bash
uci set nginx._lan.server_tokens='off'
uci commit nginx
reload_config
```

Se hai blocchi server personalizzati aggiuntivi (come `ns_88e3b6fd` nell'esempio), applica la stessa configurazione:

``` bash
uci set nginx.ns_88e3b6fd.server_tokens='off'
uci commit nginx
reload_config
```

Per applicare questa impostazione globalmente a tutti i server del reverse proxy contemporaneamente, è possibile utilizzare uno script:

``` bash
for server in $(uci show nginx | grep "=server$" | cut -d. -f2 | cut -d= -f1); do
  uci set nginx.$server.server_tokens='off'
done
uci commit nginx
reload_config
```

## Certificati {#certificates-section}

La pagina `Certificates` centralizza le funzionalità di gestione dei certificati, facilitando la gestione dei certificati sul firewall. All'avvio iniziale del firewall, un certificato autofirmato viene generato automaticamente. Questo certificato serve come opzione sicura predefinita.

La pagina di gestione dei certificati consente agli utenti di caricare certificati personalizzati, richiedere certificati da Let's Encrypt e gestire i certificati esistenti.

La pagina elenca tutti i certificati, evidenziando il certificato predefinito. Per impostare un certificato come certificato predefinito, fare clic sul pulsante **Set as default**. Il certificato predefinito è quello automaticamente fornito durante l'accesso all'[interfaccia utente web](../installation/remote_access.md#web_user_interface-section), sia sulla porta 443, [9090 o su una porta personalizzata](../installation/remote_access.md#change_ui_port-section).

### Let's Encrypt

Let's Encrypt è un'Autorità di certificazione (CA) libera, automatizzata e aperta che fornisce certificati SSL/TLS per proteggere i siti web. Questi certificati garantiscono la comunicazione crittografata tra i server web e i browser degli utenti, migliorando la sicurezza e la privacy su Internet. A differenza delle CA tradizionali, Let's Encrypt offre certificati SSL attraverso un sistema automatizzato, rendendolo accessibile ai proprietari di siti web e agli amministratori senza costi significativi o competenze tecniche.

La pagina dei certificati consente agli utenti di richiedere certificati da Let's Encrypt. Il processo è semplice e richiede una configurazione minima. Gli utenti possono specificare un nome significativo per il certificato e uno o più domini. Il certificato viene rinnovato automaticamente ogni 60 giorni.

Il processo di richiesta del certificato Let's Encrypt prevede i seguenti passaggi:

- fare clic sul pulsante **Add Let's Encrypt certificate**;
- specificare un nome significativo per il certificato;
- specificare uno o più domini per il certificato;
- fare clic sul pulsante **Save**.

Il processo di convalida può essere eseguito in due modi:

- Modalità autonoma (convalida HTTP): la modalità autonoma prevede l'interruzione temporanea del server web per consentire al tool client ACME di collegarsi direttamente alle porte richieste. Serve le sfide di autenticazione per provare la proprietà del dominio, ottenendo e installando il certificato.
- Convalida DNS: la convalida DNS richiede l'aggiunta di un record DNS TXT specifico alla configurazione DNS del dominio. Il client ACME controlla questo record per verificare la proprietà del dominio. Questo metodo è utile in situazioni in cui la modifica delle configurazioni del server web è difficile o non desiderata.

Quando è selezionata la modalità autonoma, assicurarsi che siano soddisfatti i seguenti requisiti:

1.  Il firewall deve essere raggiungibile dall'esterno sulla porta 80. Il client ACME:

    - si collegherà temporaneamente alla porta 80 per servire le sfide di autenticazione
    - aprirà temporaneamente la porta 80 a Internet pubblico per eseguire la convalida.

    Una volta completata la convalida, la porta 80 viene automaticamente chiusa. Si noti che se la porta 80 viene inoltrata a un altro server, la convalida avrà esito negativo.

2.  I domini per cui si desidera il certificato devono essere nomi di dominio pubblici associati all'indirizzo IP pubblico del server. Assicurarsi di avere nomi DNS pubblici che puntino al server (è possibile verificare con siti come [VDNS](http://viewdns.info/)).

Selezionare la convalida DNS se il provider DNS supporta l'accesso tramite API. Scegliere il provider DNS dal menu a discesa e immettere la chiave API e il segreto. Seguire la [documentazione dei provider DNS di acme.sh](https://github.com/acmesh-official/acme.sh/wiki/dnsapi)) per conoscere quale chiave API e quale segreto sono necessari per il provider DNS. La convalida DNS è l'unica supportata per i certificati wildcard.

Il processo di generazione del certificato può richiedere alcuni minuti. Durante questo periodo, lo stato del certificato è `Pending`.

#### Debug Let's Encrypt

Se la richiesta del certificato Let's Encrypt ha esito negativo, l'utente può eseguire il debug del processo immettendo i seguenti comandi nel terminale: :

``` bash
uci set acme.@acme[0].debug=1
/etc/init.d/acme start
```

I messaggi di debug verranno stampati sull'output standard. Dopo che il problema è stato risolto, l'utente può disabilitare il debug immettendo il seguente comando nel terminale: :

``` bash
uci revert acme
```

### Certificato personalizzato

L'utente può caricare un certificato personalizzato nel firewall.

Il processo prevede i seguenti passaggi:

- fare clic sul pulsante **Import certificate**
- specificare un nome significativo per il certificato
- trascinare e rilasciare il certificato, la chiave privata e, facoltativamente, il certificato della catena; assicurarsi che tutti i file caricati rispettino gli standard del [formato PEM](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail)
- fare clic sul pulsante **Save**
