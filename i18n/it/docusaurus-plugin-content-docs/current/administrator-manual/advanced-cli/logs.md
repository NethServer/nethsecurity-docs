---
title: "Registri"
sidebar_position: 7
---

# Registri {#logs-section}

I registri vengono utilizzati per la risoluzione dei problemi, il monitoraggio operativo, l'analisi degli incidenti e la ricostruzione dell'audit.
A seconda del tipo di installazione e dei servizi disponibili, i log possono essere **archiviati su storage locale persistente** e/o **inoltrati a sistemi esterni** per raccolta centralizzata, conservazione e analisi, come:

- server syslog remoto
- NethSecurity Controller
- Nethesis Cloud Log Manager

Per audit, risoluzione dei problemi e conservazione a lungo termine, si raccomanda lo storage persistente o l'inoltro remoto dei log.

## Archiviazione dei log

NethSecurity può archiviare i log in modi diversi a seconda del tipo di installazione e dello storage disponibile.

### Appliance fisiche

Sulle appliance fisiche NethSecurity, **lo storage persistente è configurato automaticamente** e utilizzato per archiviare i log.
Quando lo storage persistente è disponibile, i log vengono salvati su disco e gestiti dalla rotazione dei log.

### Macchine virtuali

Sulle macchine virtuali, lo storage persistente deve essere configurato esplicitamente.
Per audit, risoluzione dei problemi e conservazione a lungo termine, si raccomanda di collegare e configurare un disco virtuale dedicato per i log.

Per i dettagli su come impostare e verificare la configurazione dello storage, vedere [Archiviazione](../system/storage.md).

### Log in memoria

Se lo storage persistente non è configurato, i log vengono scritti in una directory temporanea in memoria.
Questo evita potenziali errori nel file system root in caso di guasto, ma non è adatto alla conservazione a lungo termine.
I log in memoria sono utili solo per la risoluzione di problemi a breve termine. Per le distribuzioni orientate all'audit, configurare lo storage persistente o l'inoltro remoto dei log.

## Cronologia delle connessioni OpenVPN

La cronologia delle connessioni OpenVPN viene salvata permanentemente su tutti i sistemi dotati di storage persistente.
Ciò consente agli amministratori di esaminare la cronologia delle connessioni VPN, supportare la risoluzione dei problemi e fornire prove durante audit o analisi di incidenti.

## Inoltro a un server remoto

È sufficiente configurare il database UCI con le opzioni desiderate, quindi eseguire il commit delle modifiche e infine riavviare il servizio. I registri temporanei continueranno a essere visibili in `/var/log/messages` e verranno anche inviati al server remoto.

La maggior parte dei server syslog è configurata per stare in ascolto sulla porta UDP 514 per impostazione predefinita.

Configurazione di esempio per l'invio di registri al server syslog con IP 192.168.1.88 sulla porta UDP 514. La configurazione è denominata `clm` (gestore registri personalizzato):

    uci set rsyslog.clm=forwarder
    uci set rsyslog.clm.source=*.* 
    uci set rsyslog.clm.protocol=udp
    uci set rsyslog.clm.port=514
    uci set rsyslog.clm.target=192.168.1.88

Una volta configurato, è sufficiente eseguire il commit delle modifiche con il comando: :

    uci commit rsyslog

E infine, riavviare il servizio: :

    /etc/init.d/rsyslog restart

Per impostazione predefinita, il forwarder utilizza TraditionalFileFormat (RFC 3164) per i registri. È anche possibile configurare RFC 5424 utilizzando la stessa sintassi: :

    uci set rsyslog.clm.rfc=5424

È possibile configurare più forwarder ripetendo l'operazione utilizzando un nome di configurazione diverso come `clm2`.

## Inoltro a Nethesis Cloud Log Manager

:::note

Diritto di servizio richiesto

È necessario acquistare un abbonamento per il servizio CLM da Nethesis e ottenere l'identificatore del tenant. Il servizio è attualmente riservato ai clienti Enterprise. Per ulteriori informazioni, contattare il team di vendita di Nethesis.

:::

Il pacchetto `ns-clm` inoltra i messaggi syslog al servizio Nethesis Cloud Log Manager (CLM). Fornisce il daemon `ns-clm-forwarder`, che legge `/var/log/messages` e traccia la sua posizione di lettura in `/var/run/ns-clm/last_offset`. Le nuove righe syslog vengono analizzate, raggruppate e inviate in formato JSON tramite HTTP POST all'endpoint CLM. Il daemon esegue il polling delle nuove righe ogni 10 secondi, rileva automaticamente la rotazione dei registri e persiste l'offset all'arresto in modo da poter riprendere dopo un riavvio.

Il pacchetto non è incluso per impostazione predefinita su NethSecurity 8.7.2 o versioni precedenti, ma è disponibile nel repository dei pacchetti e può essere installato manualmente.

Se stai eseguendo NethSecurity 8.8, usa:

    apk update
    apk add ns-clm

Se stai eseguendo NethSecurity 8.7.2 o versioni precedenti, usa:

    opkg update
    opkg install ns-clm

La configurazione UCI è memorizzata in `/etc/config/ns-clm`:

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 30%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr>
<th>Opzione</th>
<th>Predefinito</th>
<th>Descrizione</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>enabled</code></td>
<td><code>0</code></td>
<td>Abilita (<code>1</code>) o disabilita (<code>0</code>) il forwarder</td>
</tr>
<tr>
<td><p><code>uuid</code></p></td>
<td><p>(vuoto)</p></td>
<td><p>Identificatore univoco del dispositivo, generato con <code>uuidgen</code> e preceduto da "L" per garantire che inizi con una lettera.</p>
<p>Questo è richiesto dal servizio CLM per identificare l'origine dei registri.</p>
<p>Esempio: <code>L3d50ca11-4415-4e46-9ee9-b1da0f62c337</code></p></td>
</tr>
<tr>
<td><code>address</code></td>
<td><code>https://nar.nethesis.it</code></td>
<td>Indirizzo del server CLM</td>
</tr>
<tr>
<td><code>tenant</code></td>
<td>(vuoto)</td>
<td>Identificatore del tenant CLM, disponibile all'interno del portale CLM, sotto <code>Users and Companies</code> -&gt; <code>Companies</code></td>
</tr>
<tr>
<td><code>debug</code></td>
<td><code>0</code></td>
<td>Abilita output di debug su stderr (<code>1</code>)</td>
</tr>
</tbody>
</table>

Per abilitare il forwarder e impostare l'identificatore del tenant, esegui: :

    uci set ns-clm.config.uuid="L$(uuidgen)"
    uci set ns-clm.config.enabled=1
    uci set ns-clm.config.tenant=<tenant_id>
    uci commit ns-clm
    reload_config

Puoi trovare l'identificatore del tenant nel portale CLM, sotto `Users and Companies` -\> `Companies`.

Per abilitare anche il servizio all'avvio: :

    /etc/init.d/ns-clm enable && /etc/init.d/ns-clm start

Per interrompere e disabilitare il forwarder: :

    /etc/init.d/ns-clm stop && /etc/init.d/ns-clm disable

## Rotazione dei registri {#log-rotation-section}

I registri vengono ruotati per gestire lo spazio su disco e garantire che i file di registro non crescano indefinitamente.

### Rotazione dei registri di archiviazione {#storage-log-rotation-section}

Quando si utilizza l'archiviazione persistente, la rotazione dei registri viene gestita dall'utilità `logrotate`, configurata per ruotare i registri settimanalmente e mantenere un massimo di 52 settimane (1 anno) di registri.
Dopo la rotazione, i registri vengono compressi con gzip e archiviati nella stessa directory con una convenzione di denominazione che include la data di rotazione (ad es. `/mnt/data/log/messages-20260315.gz`).

Il file di configurazione per logrotate si trova in `/etc/logrotate.d/data.conf` e può essere modificato per cambiare la frequenza di rotazione e il periodo di conservazione. Il file di configurazione viene aggiunto automaticamente al backup e preservato durante gli aggiornamenti, quindi le impostazioni personalizzate persistono.

### Rotazione dei registri in memoria

Se non è presente uno storage persistente, il file di registro `/var/log/messages` viene memorizzato nella RAM e ruotato in base alle dimensioni. Una volta raggiunto un limite predefinito, il registro viene ruotato e compresso per conservare spazio. Il registro ruotato viene salvato come `/var/log/messages.1.gz` in formato gzip. Il sistema conserva solo due versioni del registro: il file attivo e l'ultimo file ruotato e compresso. Dalla versione 1.4.0, per impostazione predefinita, la soglia di rotazione è impostata al 10% del file system tmpfs montato in `/tmp`.

Lo script `ns-log-size` gestisce le dimensioni di rotazione dei registri per il servizio Rsyslog. Consente di **ottenere** e **impostare** le dimensioni di rotazione definite in byte per il file `/var/log/messages`.

- **Ottenere la dimensione corrente**: recupera la dimensione di rotazione corrente in byte.
- **Impostare una nuova dimensione**: modifica la dimensione di rotazione su un valore specificato (minimo 52428800 byte, ossia 50 MB).
- **Sicurezza della configurazione**: se la dimensione specificata è inferiore alla soglia minima, lo script avverte l'utente e non apporta modifiche.

#### Utilizzo

Per utilizzare lo script:

    ns-log-size {get|set <size>}

- **get**: restituisce la dimensione di rotazione corrente in byte.
- **set \<size\>**: imposta la dimensione di rotazione al valore specificato (in byte).

##### Esempio

Per ottenere la dimensione di rotazione corrente:

    ns-log-size get

Per impostare una nuova dimensione a 104857600 byte (100 MB):

    ns-log-size set 104857600

Il servizio rsyslog viene riavviato automaticamente dopo l'impostazione della dimensione.

Tutte le modifiche vengono scritte direttamente nel file di configurazione Rsyslog `/etc/rsyslog.conf`.

## Raccomandazioni per audit e conformità

Per le distribuzioni orientate all'audit e alla conformità, usare lo storage persistente o l'inoltro remoto dei log.

Configurazione raccomandata:

- sulle appliance fisiche, usare lo storage configurato automaticamente;
- sulle macchine virtuali, configurare un disco virtuale dedicato per i log;
- configurare l'inoltro remoto via syslog, Controller o Cloud Log Manager quando è richiesta la conservazione centralizzata;
- verificare che l'ora di sistema sia sincronizzata con NTP;
- definire una policy di retention allineata ai requisiti di sicurezza dell'organizzazione;
- proteggere i log remoti da accessi non autorizzati o eliminazioni;
- verificare periodicamente che i log siano raccolti e inoltrati correttamente;
- revisionare periodicamente gli accessi amministrativi, le modifiche di configurazione, gli accessi VPN e gli eventi di sicurezza rilevanti.

Lo storage locale persistente fornisce informazioni storiche utili, ma per requisiti di audit più stringenti si raccomanda di inoltrare i log a un sistema esterno come un server syslog, SIEM, Controller o Cloud Log Manager.

## Informazioni correlate

Le azioni amministrative eseguite tramite l'interfaccia NethSecurity vengono registrate in `/var/log/messages`.
Per i dettagli sugli utenti amministrativi, i log di audit e come ricostruire l'attività degli amministratori, vedere [Utenti amministrativi](../users-objects/administrative_users.md).
