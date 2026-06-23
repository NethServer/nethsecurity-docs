---
title: "UPS (NUT)"
sidebar_position: 9
---

# UPS (NUT)

Un'alimentazione ininterrotta (UPS) è un dispositivo che fornisce alimentazione di backup quando l'alimentazione principale si interrompe. Viene utilizzato per proteggere hardware come computer, apparecchiature di telecomunicazione o altri apparecchi elettrici dove un'interruzione di corrente inaspettata potrebbe causare interruzioni dell'attività o perdita di dati.

[Network UPS Tools (NUT)](https://networkupstools.org/) è una raccolta di programmi che fornisce un'interfaccia comune per il monitoraggio e l'amministrazione dell'hardware UPS.

Questa guida spiega come configurare un UPS collegato via USB con NUT su NethSecurity. Al termine della guida, l'UPS dovrebbe essere monitorato e il sistema dovrebbe spegnersi quando la batteria è scarica.

NUT non è installato per impostazione predefinita. Fa parte dei pacchetti extra di NethSecurity e può essere installato dalla riga di comando. La suite NUT è composta da diversi pacchetti, ma i più importanti sono:

- `nut-server`: Il daemon del server NUT si connette direttamente all'UPS, fornendo dati al client.
- `nut-upsc`: Uno strumento da riga di comando per interrogare lo stato dell'UPS.
- `nut-upsmon`: Il daemon del monitor UPS di NUT comunica con nut-server e avvia lo spegnimento del sistema quando la batteria dell'UPS è scarica.
- `nut-upscmd`: Uno strumento da riga di comando per inviare comandi all'UPS (supportato solo da alcuni modelli di UPS).

:::note

La configurazione di NUT non è supportata su macchine con un abbonamento NethSecurity. La funzione è destinata a utenti avanzati e non è coperta dal servizio di supporto.

:::

## Configurare un UPS locale

Prima di configurare l'UPS, assicurati che l'UPS sia collegato al firewall (di solito viene fornito un cavo con l'UPS). Quindi, segui questi passaggi:

1.  Installa i pacchetti NUT.
2.  Trova il modello dell'UPS, quindi installa e configura il driver appropriato.
3.  Configura i daemon del server UPS.
4.  Abilita il monitor UPS.

### Step 1: installa i pacchetti richiesti

Installa i pacchetti richiesti.

Se stai eseguendo NethSecurity 8.8, usa:

    apk update
    apk add nut-server nut-upsc nut-upsmon nut-upscmd

Se stai eseguendo NethSecurity 8.7.2 o versioni precedenti, usa:

    opkg update
    opkg install nut-server nut-upsc nut-upsmon nut-upscmd

:::note

A partire dalla versione 8.7.2, i pacchetti extra vengono reinstallati automaticamente dopo l'aggiornamento del sistema. Per le versioni precedenti e per ulteriori informazioni, fai riferimento a questa documentazione: [Ripristina pacchetti extra](../system/updates.md#restore_extra_packages-section).

:::

### Step 2: configura il driver appropriato

1.  Usa `lsusb` per elencare i dispositivi USB:

        Bus 002 Device 002: ID 0463:ffff EATON 5E
        Bus 002 Device 001: ID 1d6b:0002 Linux 5.15.150 xhci-hcd xHCI Host Controller
        Bus 001 Device 002: ID 8087:8001

    In questo esempio, l'UPS è un modello EATON 5E collegato alla seconda porta USB del secondo bus USB.

2.  Seleziona il driver dalla [pagina del driver NUT](https://networkupstools.org/stable-hcl.html).

3.  Tutti i pacchetti driver iniziano con il prefisso `nut-driver-`. Alcuni modelli di UPS potrebbero richiedere un driver specifico, ma la maggior parte funziona con il driver `usbhid-ups`. Installa il pacchetto driver selezionato, in questo caso il driver `usbhid-ups`.

    Se stai eseguendo NethSecurity 8.8, usa:

        apk add nut-driver-usbhid-ups

    Se stai eseguendo NethSecurity 8.7.2 o versioni precedenti, usa:

        opkg install nut-driver-usbhid-ups

4.  Configura il driver all'interno di `upsd` (nut-server) server. Il nut-server si connetterà all'UPS utilizzando il driver e la porta specificata. Monitorerà l'UPS a intervalli regolari e fornirà le informazioni ai client come `upsmon`. Esegui:

        uci set nut_server.eaton5e=driver
        uci set nut_server.eaton5e.driver=usbhid-ups
        uci set nut_server.eaton5e.port=auto
        uci set nut_server.upsd=upsd
        uci commit nut_server

    Ricorda il nome dell'UPS, in questo caso `eaton5e`, poiché verrà utilizzato nei prossimi passaggi.

### Step 3: configura il monitoraggio

Il monitor UPS (upsmon) è un daemon che monitora l'UPS e avvia lo spegnimento del sistema quando la batteria dell'UPS è scarica. Si connette al server UPS (upsd) e interroga lo stato dell'UPS.

In questo scenario il monitor UPS è in esecuzione sulla stessa macchina del server UPS, quindi si connetterà a localhost.

1.  Configura l'utente per il monitoraggio all'interno di `upsd`. Tieni presente che la password è semplice perché non viene inviata sulla rete:

        uci set nut_server.upsuser=user
        uci set nut_server.upsuser.username=upsuser
        uci set nut_server.upsuser.password=password
        uci set nut_server.upsuser.upsmon=master

2.  Configura il monitor:

        uci set nut_monitor.upsmon=upsmon
        uci set nut_monitor.master=master
        uci set nut_monitor.master.upsname=eaton5e
        uci set nut_monitor.master.hostname=localhost
        uci set nut_monitor.master.username=upsuser
        uci set nut_monitor.master.password=password

3.  Applica le modifiche e riavvia i servizi:

        uci commit nut_server
        uci commit nut_monitor
        /etc/init.d/nut-server restart
        /etc/init.d/nut-monitor restart

### Step 4: verifica lo stato dell'UPS

Controlla lo stato dell'UPS:

    upsc eaton5e

L'output dovrebbe assomigliare a questo:

    battery.charge: 100
    battery.runtime: 2637
    battery.type: PbAc
    device.mfr: EATON
    device.model: 5E 850i
    ...

Se l'output è vuoto o viene visualizzato un errore, rivedi il contenuto di `/var/log/messages`.

Un buon log del server per l'UPS collegato:

    Nov 29 09:23:08 NethSec upsd[7111]: Connected to UPS [eaton5e]: usbhid-ups-eaton5e

Un buon log per upsmon:

    Nov 29 09:23:11 NethSec upsmon[7189]: Communications with UPS eaton5e@localhost established

Se viene visualizzato un errore, consulta [Risoluzione dei problemi](#troubleshooting_ups-section).

Se tutto funziona correttamente, l'UPS dovrebbe essere monitorato e il sistema dovrebbe spegnersi quando la batteria è in uno stato critico, di solito al di sotto del 20%.

## Consenti il monitoraggio remoto

Più dispositivi hardware possono essere collegati a un UPS e il server NUT può condividere lo stato dell'UPS con più client. Ad esempio, un altro sistema alimentato dallo stesso UPS può ispezionare lo stato dell'UPS connettendosi al server NUT e spegnendosi quando la batteria è scarica.

Per impostazione predefinita, il server NUT è configurato per ascoltare solo su localhost. Per consentire il monitoraggio remoto, il server deve essere configurato per ascoltare su un indirizzo IP specifico o su tutte le interfacce.

1.  Ascolta su tutte le interfacce:

        uci set nut_server.listen=listen_address
        uci set nut_server.listen.address=0.0.0.0

2.  Aggiungi un utente per il monitoraggio remoto. Assicurati di selezionare una password complessa:

        uci set nut_server.remoteuser=user
        uci set nut_server.remoteuser.username=remoteuser
        uci set nut_server.remoteuser.password=password
        uci commit nut_server
        /etc/init.d/nut-server restart

3.  Controlla lo stato del server:

        netstat -tuln | grep 3493

4.  Crea una regola firewall per consentire il monitoraggio remoto dalla LAN, il servizio ascolta sulla porta TCP 3493:

        uci set firewall.ns_allow_https.name='Allow-NUT-from-LAN'
        uci set firewall.ns_allow_https.proto='tcp'
        uci set firewall.ns_allow_https.src='lan'
        uci set firewall.ns_allow_https.dest_port='3493'
        uci set firewall.ns_allow_https.target='ACCEPT'
        uci commit firewall
        /etc/init.d/firewall restart

Ora puoi connetterti al server NUT da un client upsmon remoto. Quando il client è configurato, si connetterà al server NUT e monitorerà lo stato dell'UPS. Se la batteria è scarica, il client avvierà lo spegnimento del sistema.

## Connettersi al server NUT remoto

Questo è il caso in cui un firewall secondario è collegato allo stesso UPS e il server NUT è in esecuzione sul firewall primario. Il firewall secondario si connetterà al firewall primario e monitorerà lo stato dell'UPS.

1.  Innanzitutto, installa i servizi NUT sulla macchina client.

    Se stai eseguendo NethSecurity 8.8, usa:

        apk update
        apk add nut-upsc nut-upsmon

    Se stai eseguendo NethSecurity 8.7.2 o versioni precedenti, usa:

        opkg update
        opkg install nut-upsc nut-upsmon

    Questi pacchetti non vengono preservati durante un aggiornamento del sistema. Per ulteriori informazioni, consulta [Ripristina pacchetti extra](../system/updates.md#restore_extra_packages-section).

2.  Quindi, configura il client per connettersi al server remoto:

        uci set nut_monitor.upsmon=upsmon
        uci set nut_monitor.slave=slave
        uci set nut_monitor.slave.upsname=eaton5e
        uci set nut_monitor.slave.hostname=192.168.1.8
        uci set nut_monitor.slave.username=remoteuser
        uci set nut_monitor.slave.password=password
        uci commit nut_monitor
        /etc/init.d/nut-monitor restart

3.  Controlla se il client è collegato al server remoto:

        upsc eaton5e@192.168.1.8

    L'output dovrebbe essere lo stesso del server locale.

Ora il client è collegato al server remoto e monitorerà lo stato dell'UPS. Se la batteria è scarica, il client avvierà lo spegnimento del sistema.

## Impostazioni UPS aggiuntive

Alcuni modelli di UPS hanno impostazioni aggiuntive che possono essere configurate utilizzando il comando `upscmd`. Per eseguire il comando, l'utente deve avere i permessi appropriati.

1.  Concedi i permessi all'utente:

        uci add_list nut_server.upsuser.instcmd=all
        uci add_list nut_server.upsuser.actions=set
        uci commit nut_server
        /etc/init.d/nut-server restart

2.  Controlla i comandi disponibili:

        upscmd -l eaton5e

3.  Esempio per disabilitare il segnale acustico:

        upscmd -u upsuser -p password eaton5e beeper.disable

## Risoluzione dei problemi {#troubleshooting_ups-section}

Un errore comune è il permesso negato durante l'accesso al dispositivo UPS, ad esempio potresti vedere questo errore all'interno di `/var/log/messages`:

    Can't open /etc/nut/ups.conf: Can't open /etc/nut/ups.conf: Permission denied openwrt

Un altro errore comune è quando upsd non riesce a connettersi all'UPS, ad esempio potresti vedere questo errore all'interno di `/var/log/messages`:

    Nov 29 10:34:51 NethSec upsd[7055]: [D1] mainloop: UPS [eaton5e] is not currently connected
    Nov 29 10:34:51 NethSec upsd[7055]: [D1] mainloop: UPS [eaton5e] is now connected as FD -1

Solitamente, questo accade quando nut-server si connette al dispositivo UPS prima che il dispositivo sia pronto. Per risolvere questo problema, la soluzione più semplice è riavviare il firewall:

    reboot

Se non puoi riavviare il firewall, puoi provare a interrompere il nut-server:

    /etc/init.d/nut-server stop

Quindi controlla se il driver può connettersi al dispositivo UPS:

    /lib/nut/usbhid-ups -a eaton5e

Output atteso:

    Network UPS Tools - Generic HID driver 0.47 (2.8.0)
    USB communication driver (libusb 1.0) 0.43
    Using subdriver: MGE HID 1.46

In caso di errore, potresti vedere qualcosa di simile:

    Can't claim USB device [0463:ffff]@0/0: Entity not found

Potresti quindi provare a reimpostare il dispositivo USB:

    usbreset 002/003

Dove `002/003` è l'ID del dispositivo USB trovato con `lsusb`, `002` è il numero del bus e `003` è il numero del dispositivo.
