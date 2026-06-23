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
