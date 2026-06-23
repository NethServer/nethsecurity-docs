---
title: "Accesso remoto"
sidebar_position: 4
---

# Accesso remoto

## Credenziali predefinite {#default_credentials-section}

Le credenziali predefinite sono:

- Utente: `root`
- Password: `Nethesis,1234`

Queste credenziali possono essere utilizzate per accedere all'interfaccia web o tramite SSH:

- Interfaccia web: **https://\<server_ip\>:9090**
- Porta SSH predefinita: **22**

Il nome host predefinito di NethSecurity è: `NethSec`

Se il client ha ricevuto un indirizzo IP dal DHCP di NethSecurity, utilizzerà NethSecurity sia come gateway che come server DNS. In queste condizioni è possibile contattare NethSecurity usando il suo nome host **nethsec** invece dell'**server_ip**, ad esempio

<https://nethsec:9090>

Questo nome host può essere modificato nella sezione Impostazioni di Sistema.

:::note

La password predefinita per l'utente root è `Nethesis,1234`. Si consiglia di modificare la password immediatamente dopo il primo accesso.

:::

### Ripristino della password root

La `password root` può essere ripristinata accedendo in [modalità Failsafe](../system/reset_recovery.md#failsafe-section). Una volta in questa modalità, è possibile modificare la password eseguendo i seguenti comandi:

``` bash
mount_root
passwd
```

Riavviare il firewall con il comando:

``` bash
reboot
```

## Interfaccia web {#web_user_interface-section}

NethSecurity UI (User Interface), l'interfaccia web ufficiale di NethSecurity, è disponibile sulla porta `9090` al seguente URL: **https://\<server_ip\>:9090**.

Per facilitare l'accesso, NethSecurity UI è disponibile anche sulla porta HTTPS standard `443` al seguente URL: **https://\<server_ip\>** o **http://\<server_fqdn\>**.

Entrambi gli URL sono accessibili da LAN e WAN per impostazione predefinita.

### Limitazione dell'accesso a NethSecurity UI

Per impostazione predefinita, questa interfaccia è accessibile sulla porta 9090 sia dalla rete interna (LAN) che da Internet (WAN). Sebbene conveniente, questo può potenzialmente introdurre un rischio di sicurezza.

Per mitigare questo rischio, hai due opzioni (rimuovere o limitare l'accesso):

- rimuovere la regola `Allow-UI-from-WAN`: vai alla pagina Regole firewall, naviga nella scheda `Regole in ingresso` e individua la regola "Allow-UI-from-WAN". Fai clic sul pulsante **Elimina** per rimuoverla

- limitare l'accesso da IP o reti specifiche: nella pagina Regole firewall, individua la regola "Allow-UI-from-WAN" e fai clic sul pulsante **Modifica**. Nel campo `Indirizzo sorgente`, inserisci gli indirizzi IP o i CIDR di rete da cui desideri consentire l'accesso a NethSecurity UI.

  Ad esempio, per consentire l'accesso solo dalla tua rete domestica, puoi inserire la rete 192.168.1.0/24. Consenti l'accesso solo da indirizzi IP o reti di cui ti fidi. Lasciare questo campo vuoto consentirà a chiunque su Internet di accedere a NethSecurity UI.

Misure di sicurezza aggiuntive:

- utilizza una password forte per l'utente admin
- abilita l'[autenticazione a due fattori (2FA)](../users-objects/administrative_users.md#2fa-section) per l'utente admin
- mantieni il firewall aggiornato con le ultime patch di sicurezza

### Modifica della porta dell'interfaccia web {#change_ui_port-section}

Gli utenti possono modificare la porta di NethSecurity UI.

Per modificare la porta di NethSecurity UI da 9090 a 8181, esegui:

``` bash
uci set ns-ui.config.nsui_extra_port=8181
uci commit ns-ui && ns-ui
```

:::warning

Il controller utilizza la porta 9090 per comunicare con l'unità. Modificare la porta impedirà al controller di gestire NethSecurity.

:::

Se hai ancora bisogno di inoltrare la porta 9090 a un'altra macchina all'interno della LAN, puoi mantenere il controller connesso lasciando `ns-ui_extra_port` invariato e inoltrando la porta alla nuova macchina. L'inoltro della porta a un'altra macchina sarà accettabile perché il controller raggiungerà la porta 9090 attraverso la VPN.

### Disabilita l'interfaccia web sulla porta 443

Sebbene l'esposizione della porta 443 (HTTPS) possa essere necessaria per alcuni servizi, l'accesso diretto a NethSecurity UI attraverso questa porta può introdurre un potenziale rischio di sicurezza. Ecco come mantenere in sicurezza la funzionalità della porta 443 proteggendo NethSecurity UI.

Se non hai bisogno di accedere a NethSecurity UI attraverso la porta 443, disabilitala per minimizzare le opportunità di attacco. Esegui i seguenti comandi sul tuo sistema NethServer:

``` bash
uci set ns-ui.config.nsui_enable=0
uci commit ns-ui && ns-ui
```

Questa opzione disabilita l'accesso a NethSecurity UI sia tramite l'indirizzo IP del server che FQDN sulla porta 443.

Se hai bisogno della porta 443 per altri servizi, configura il tuo firewall per reindirizzare il traffico destinato alla porta 443 a un server web separato che ospita quei servizi. Assicurati che questo server separato disponga di forti misure di sicurezza.

### Politica sulla privacy {#privacy_policy-section}

In alcuni casi, è necessario visualizzare la politica sulla privacy di un prodotto prima dell'accesso. NethSecurity non visualizza alcuna politica sulla privacy per impostazione predefinita, ma è possibile aggiungere un collegamento a un sito web esterno che contenga la politica sulla privacy.

Per aggiungere un collegamento alla politica sulla privacy, accedi alla riga di comando ed esegui:

``` bash
URL=https://mysite.org/privacy_policy; sed -i "s|PRIVACY_POLICY_URL\: ''|PRIVACY_POLICY_URL: '$URL'|" /www-ns/branding.js
```

Sostituisci `https://mysite.org/privacy_policy` con l'URL della tua politica sulla privacy.

Il collegamento alla politica sulla privacy sarà visualizzato nella pagina di accesso dopo il prossimo aggiornamento della pagina.

### Interfaccia web legacy {#luci-section}

:::warning

Le modifiche apportate tramite l'interfaccia web LuCI possono interrompere NethSecurity UI ufficiale. Usa a tuo rischio e pericolo!

:::

NethSecurity offre anche LuCI, l'interfaccia web originale di OpenWrt, che fornisce un'ampia gamma di opzioni di configurazione ma non è ufficialmente supportata. Luci è disabilitato per impostazione predefinita. Per abilitarlo, esegui:

``` bash
uci set ns-ui.config.luci_enable=1
uci commit ns-ui
ns-ui
```

Una volta abilitato, Luci sarà disponibile solo sulla porta 443 a questo URL: **https://\<server_ip\>/cgi-bin/luci**

Le modifiche alle seguenti pagine LuCI sono note per causare comportamenti impredittabili:

- Scheda accesso HTTP: configura uhttpd che non è presente in NethSecurity
- Scheda Logging: configura logd che non è presente in NethSecurity
- Networking: la configurazione creata con questa pagina non è compatibile con NethSecurity UI

Se precedentemente abilitato, l'interfaccia web LuCI può essere disabilitata eseguendo:

``` bash
uci set ns-ui.config.luci_enable=0
uci commit ns-ui
ns-ui
```

### Nascondi versione del server web

Per impostazione predefinita, il server web nginx che serve NethSecurity UI include il numero di versione nelle intestazioni delle risposte HTTP. Molte valutazioni di vulnerabilità si basano sull'identificazione della versione del software, che può produrre falsi positivi quando le correzioni vengono retrattate senza modificare la versione segnalata. Sebbene nascondere le informazioni sulla versione non migliori la sicurezza di per sé, può aiutare a limitare l'esposizione delle vulnerabilità specifiche della versione nota agli strumenti di scansione automatizzati.

Per disabilitare la visualizzazione della versione di nginx nelle intestazioni HTTP di NethSecurity UI, esegui i seguenti comandi:

``` bash
uci set ns-ui.config.server_tokens='off'
uci commit ns-ui
reload_config
```

Questa configurazione riguarda solo NethSecurity UI. Il proxy inverso ha la sua configurazione separata.

## Utenti amministrativi {#admin_users-section}

Per informazioni sugli account amministrativi, l'autenticazione a due fattori (2FA), il registro delle attività amministrative e le raccomandazioni per l'audit, vedere [Utenti amministrativi](../users-objects/administrative_users.md).

## SSH

Per impostazione predefinita, il sistema accetta connessioni SSH sulla porta standard 22 dalla rete interna (LAN). L'accesso root è abilitato usando la password predefinita. Per consentire l'accesso SSH da Internet (WAN), è necessario aggiungere una regola di ingresso firewall per la porta di ascolto del server.

Da una macchina Linux, usa il seguente comando:

``` bash
ssh root@192.168.1.1
```

## Console VGA e layout della tastiera

Se la macchina ha una porta video VGA/DVI/HDMI, collegati un monitor. Quindi sarai in grado di accedere alla console usando le credenziali predefinite sopra.

Tieni presente che il sistema è configurato con il layout della tastiera US.

Per modificare temporaneamente il layout della tastiera attuale in italiano, accedi al sistema e quindi esegui il seguente comando:

``` bash
loadkmap < /usr/share/keymaps/it.map.bin
```

La configurazione del layout della tastiera può essere salvata scrivendo il codice della mappa dei tasti all'interno di `/etc/keymap`. Esempio per la mappa dei tasti `it` (italiano):

``` bash
echo 'it' > /etc/keymap
grep -q /etc/keymap /etc/sysupgrade.conf || echo /etc/keymap >> /etc/sysupgrade.conf
```

Per ottenere l'elenco delle mappe dei tasti disponibili, esegui il seguente comando:

``` bash
ls -1 /usr/share/keymaps/ | cut -d'.' -f1
```

## Console seriale

Se la macchina ha una porta seriale (RS-232, tipicamente disponibile con connettore DE-9 o connettore RJ45/8P8C) è possibile accedere al firewall direttamente tramite essa usando un cavo null-modem e un programma di terminale. `PuTTY` (versione 0.60 o superiore) è una scelta comune se stai usando Microsoft Windows, mentre le distribuzioni Linux offrono strumenti come `minicom`, `picocom` o `screen`.

I parametri di accesso predefiniti per NethSecurity 8 sono:

- Velocità in baud: 115200,
- Bit di dati: 8
- Parità: Nessuna
- Bit di stop: 1

Questi ultimi tre parametri sono spesso abbreviati come 8N1

### Adattatori USB-to-Serial

Se necessario, NethSecurity può essere utilizzato per accedere a un altro server tramite la console seriale. Se l'hardware non dispone di una porta RS-232, è possibile utilizzare adattatori USB-to-serial. Per questo motivo, è possibile scaricare e installare driver per i più comuni adattatori su NethSecurity. Questi driver sono forniti così come sono e **non sono supportati da Nethesis** (se si utilizza una versione Enterprise o Subscription).

Due pacchetti sono forniti per l'installazione, coprendo la stragrande maggioranza degli adattatori disponibili sul mercato:

``` bash
kmod-usb-serial-cp210x - 5.15.162-1 - Kernel support for Silicon Labs cp210x USB-to-Serial converters
kmod-usb-serial-pl2303 - 5.15.162-1 - Kernel support for Prolific PL2303 USB-to-Serial converters
```

- Per installare il driver Prolific PL2303:

  Se stai eseguendo NethSecurity 8.8, usa:

  ``` bash
  apk update
  apk add kmod-usb-serial-pl2303
  ```

  Se stai eseguendo NethSecurity 8.7.2 o versioni precedenti, usa:

  ``` bash
  opkg update
  opkg install kmod-usb-serial-pl2303
  ```

- I log mostreranno un output simile a questo:

  ``` bash
  Aug  6 08:08:17 nsec8 kernel: [ 2346.359247] usb 1-6: new full-speed USB device number 3 using xhci_hcd
  Aug  6 08:08:17 nsec8 kernel: [ 2346.543052] pl2303 1-6:1.0: pl2303 converter detected
  Aug  6 08:08:17 nsec8 kernel: [ 2346.550401] usb 1-6: pl2303 converter now attached to ttyUSB0
  ```

:::note

A partire dalla versione 8.7.2, i pacchetti extra vengono reinstallati automaticamente dopo l'aggiornamento del sistema. Per le versioni precedenti e per ulteriori informazioni, fare riferimento a questa documentazione: [Ripristino pacchetti extra](../system/updates.md#restore_extra_packages-section).

:::
