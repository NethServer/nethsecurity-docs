---
title: "Hotspot"
sidebar_position: 5
---

# Hotspot

L'obiettivo principale di Hotspot è fornire connettività Internet tramite wi-fi agli utenti occasionali. Gli utenti vengono indirizzati a un portale cattivo da cui possono accedere alla rete autenticandosi tramite accesso social, SMS, email o codice voucher. Il servizio hotspot consente la regolamentazione, la responsabilità e la determinazione dei prezzi dell'accesso a Internet in luoghi pubblici, come piazze, hotel, stazioni e molti altri.

## Caratteristiche principali

- Isolamento di rete tra area aziendale e ospiti
- Pagina del portale cattivo personalizzabile
- Molte modalità di autenticazione supportate (Accesso social, SMS, Email o codice voucher)
- Supporto AutoLogin
- Gestore hotspot con diversi tipi di accesso (admin, cliente, desk)
- Esportazione di account e report di connessioni

## Come funziona?

L'implementazione si basa su 2 componenti:

Una sezione gestore hotspot in esecuzione su un server cloud, una WebUI dedicata consente di eseguire attività come:

- creare un'istanza hotspot: solitamente ogni istanza si riferisce a una posizione specifica (ad es. Art Cafè, Ritz Hotel e così via)
- modificare la pagina del portale cattivo
- scegliere il tipo di accesso da utilizzare
- visualizzare la sessione e gli utenti connessi

Una parte client in esecuzione su NethSecurity (nella terminologia nethspot questo client è chiamato "unit").

- Deve essere fisicamente collegato alla rete dei Punti di accesso
- Assegna indirizzi IP ai dispositivi
- Reindirizza i dispositivi al portale cattivo

:::note

Questo manuale copre solo la parte client. Se sei interessato alla sezione gestore hotspot, fai riferimento al [progetto Icaro](https://nethesis.github.io/icaro) se desideri creare la tua istanza di Icaro o contatta <info@nethesis.it> se desideri utilizzare il servizio SaaS fornito da Nethesis e situato su [my.nethspot.com](https://my.nethspot.com).

:::

## Stato

Questa sezione mostra tutti gli utenti connessi al sistema, distinguendo coloro che si sono autenticati da coloro che hanno semplicemente ricevuto un indirizzo IP, fornisce ulteriori informazioni come indirizzo MAC, traffico eseguito e così via. Informazioni più dettagliate sono disponibili nel gestore hotspot.

## Impostazioni

Questa sezione consente di associare un'unità a un'istanza hotspot specifica creata nel gestore hotspot.

:::note

Prima di associare l'unità, è necessario creare un'istanza nel gestore hotspot.

:::

Più unità geograficamente separate (NethSecurity) possono essere connesse alla stessa istanza hotspot centralizzata, creando una conferenza in cui tutti gli utenti accedono allo stesso portale cattivo e in cui possono riutilizzare lo stesso accesso in tutte le unità connesse.

### Accedi al tuo gestore hotspot

Questa operazione è obbligatoria per associare la tua unità all'istanza hotspot creata, utilizza lo stesso nome utente e password del tuo gestore hotspot, il campo `Hostname` per impostazione predefinita punta a my.nethspot.com.

Una volta effettuato l'accesso, puoi continuare a compilare i campi seguenti. Questo accesso al login rimarrà attivo per 24 ore senza alcuna necessità di accesso.

### Registra la tua unità

`Parent Hotspot` : scegli a quale istanza desideri connettere la tua unità

`Unit name` : il nome del tuo NethSecurity

`Unit description` : inserisci una breve descrizione in modo da identificare più facilmente la tua unità

`Network device` : specifica un dispositivo di rete da utilizzare dal servizio hotspot. Il dispositivo può essere fisico o una VLAN; tuttavia, è fondamentale che il dispositivo non sia già configurato. L'interfaccia utente visualizzerà tutte le opzioni attualmente disponibili e l'hotspot intercetterà tutte le connessioni su questa interfaccia di rete, applicando l'autenticazione per i client connessi.

`Network address` : i client riceveranno un indirizzo IP appartenente a questa rete (utilizza il formato CIDR). Il primo indirizzo della classe di rete viene sempre assegnato all'interfaccia hotspot NethSecurity. Il numero totale di client che possono essere gestiti contemporaneamente dipende dall'intervallo DHCP specificato. Se devi fornire il servizio hotspot per più di 253 dispositivi, considera l'utilizzo di una maschera più ampia (/23 o /22 o ancora più grande) e assicurati di avere un intervallo appropriato.

`DHCP limit` : per impostazione predefinita, il sistema utilizza l'intero intervallo di rete. Tuttavia, puoi definire un intervallo più specifico regolando il numero massimo di lease. Il primo indirizzo dell'intervallo DHCP viene calcolato automaticamente

Dopo aver compilato il modulo, fai clic sul pulsante **Salva** per registrare l'unità.

:::note

Verifica nel gestore hotspot-> Unità che la tua unità sia stata registrata correttamente. Ogni unità registrata correttamente deve mostrare il suo indirizzo MAC nel gestore hotspot. Se l'indirizzo MAC manca, si prega di annullare la registrazione dell'unità e provare a eseguire nuovamente la registrazione.

:::

### Annulla la registrazione della tua unità

Se hai commesso un errore nella registrazione della tua unità (es. l'unità è stata associata a un'istanza hotspot sbagliata) o desideri rimuovere questo servizio, accedi alla sezione hotspot di NethSecurity e fai clic su **Annulla registrazione unità**. La tua unità verrà rimossa sia da NethSecurity che dal gestore hotspot remoto, l'interfaccia utilizzata in Nethsecurity verrà liberata e potrai utilizzarla per altri scopi.

### Modifica le impostazioni DNS

Per impostazione predefinita, il server DNS utilizzato dall'hotspot è di OpenDNS, per modificare le impostazioni DNS è richiesta la configurazione manuale. Si prega di seguire i passaggi seguenti dal terminale:

1.  Modifica il file di configurazione UCI con i seguenti comandi:

``` bash
uci set dedalo.config.dns1='<insert dns 1>'
uci set dedalo.config.dns2='<insert dns 2>'
```

2.  Salva le modifiche con il seguente comando:

``` bash
uci commit dedalo
```

3.  Riavvia il servizio dedalo con:

``` bash
service dedalo restart
```

### Ripristina le impostazioni DNS predefinite

Per ripristinare le impostazioni DNS predefinite, utilizzare i seguenti comandi:

``` bash
uci delete dedalo.config.dns1
uci delete dedalo.config.dns2
```

Quindi ripeti i passaggi 2 e 3 della sezione precedente per applicare le modifiche.

## Conservazione dei dati per il servizio Hotspot con il portale cloud NethSpot

:::note

Solo per gli utenti del portale cloud NethSpot

Questa sezione si applica esclusivamente ai firewall NethSecurity con un abbonamento valido che utilizzano specificamente il portale cloud NethSpot, disponibile all'indirizzo <https://my.nethspot.com/>. Se il servizio Hotspot viene utilizzato senza il portale cloud NethSpot, le informazioni contenute in questa sezione non si applicano.

:::

NethSpot memorizza i dati relativi all'hotspot su un'infrastruttura cloud situata in un data center europeo nei Paesi Bassi. I dati conservati includono i log delle connessioni, i dati di accesso degli ospiti, le informazioni sui voucher e i dati relativi agli accessi tramite email e SMS.

### Log delle connessioni

I log delle connessioni vengono conservati per **6 mesi**.

Questi log includono informazioni relative alle sessioni degli ospiti, come:

- data e ora di connessione e disconnessione
- utente ospite
- dispositivo dell'ospite
- indirizzo MAC del dispositivo
- indirizzo MAC dell'unità NethSecurity

I log delle connessioni sono i primi dati a essere eliminati. Alla scadenza del periodo di conservazione, vengono eliminate le relative sessioni degli ospiti, inclusi il `device_mac` del dispositivo dell'ospite e lo `unit_mac` dell'appliance NethSecurity a cui si è connesso.

:::note

NethSpot non raccoglie né memorizza l'attività di navigazione degli utenti Hotspot. I siti web visitati, gli URL, le query DNS e gli altri dettagli di navigazione non vengono raccolti né conservati dal portale cloud NethSpot. Le informazioni conservate sono limitate ai dati di sessione necessari per identificare la sessione di accesso dell'ospite.

:::

### Dati di accesso degli ospiti e voucher

I dati di accesso degli ospiti vengono conservati per l'intero periodo di validità dell'account dell'ospite e per i successivi **24 mesi**. Questo periodo di conservazione aggiuntivo consente di riattivare gli account degli ospiti scaduti, ad esempio estendendone la validità dal portale, senza doverli ricreare. Consente inoltre di mantenere l'associazione tra l'identità dell'ospite e il voucher precedentemente emesso, in modo che gli operatori possano verificare o estendere una registrazione di accesso esistente quando necessario.

Sono inclusi i dati relativi agli utenti della piattaforma, ai voucher e agli accessi tramite email e SMS. Quando vengono utilizzati i voucher, vengono conservate tutte le informazioni inserite nel voucher, inclusi i dati utilizzati per identificare l'ospite.

Per gli accessi basati su voucher, i dati conservati possono includere:

- nome e cognome dell'ospite, se inseriti nel voucher
- indirizzo email dell'ospite, se inserito nel voucher
- dati del voucher
- indirizzo MAC del dispositivo utilizzato dall'ospite

Il nome dell'ospite è obbligatorio durante la creazione di un voucher, poiché viene utilizzato per identificare l'associazione tra l'ospite e il voucher.

### Validità del voucher e scadenza dell'account

I voucher possono essere creati in due modi:

- con una data di scadenza fissa
- con una durata calcolata a partire dalla prima attivazione

Prima del primo utilizzo, un voucher è inattivo. Quando il voucher viene utilizzato per la prima volta, viene associato all'ospite che lo utilizza. Da quel momento, il voucher e l'account dell'ospite fanno riferimento alla stessa identità di accesso.

Gli utenti amministrativi dell'hotspot non sono associati ai voucher degli ospiti.

Il periodo di conservazione aggiuntivo di 24 mesi inizia dalla data di scadenza del voucher.

Ad esempio, se un voucher scade il **30 giugno 2026** e l'ospite inizia a utilizzarlo prima di tale data, l'account dell'ospite associato al voucher scade il **30 giugno 2026**. Il periodo di conservazione di 24 mesi inizia da tale data.

Questo periodo di conservazione consente di riattivare successivamente l'account, ad esempio estendendone la validità dal portale, senza eliminare prematuramente i dati dell'ospite.

### Cessazione del contratto o del servizio

In caso di cessazione del contratto o del servizio, i dati degli ospiti vengono eliminati in base agli stessi periodi di conservazione descritti sopra.

### Consenso per finalità di marketing

NethSpot può essere configurato per richiedere agli ospiti WiFi il consenso per finalità di marketing tramite il captive portal. Il consenso viene raccolto esclusivamente per conto dell'organizzazione che utilizza l'hotspot e **non viene utilizzato da Nethesis** per proprie finalità di marketing.

Il pannello degli ospiti mostra chiaramente quali utenti hanno fornito il consenso per finalità di marketing: in questo modo è possibile esportare esclusivamente i contatti che hanno espresso esplicitamente il proprio consenso.

Nethesis non utilizza i contatti raccolti degli ospiti per attività di marketing e non vende né trasferisce tali dati a terze parti.
:::
