---
title: "Migrazione da NethServer 7"
sidebar_position: 10.5
---
# Migrazione da NethServer 7

La migrazione è il processo di conversione di una macchina NethServer 7 (*sorgente*) in NethSecurity (*destinazione*).

La migrazione della configurazione firewall da NethServer 7 a NethSecurity è un processo cruciale per garantire la continuità e la sicurezza dei tuoi servizi di rete.

**Requisiti per la migrazione:**

- Assicura l'accesso a Cockpit su NethServer 7
- Installa l'applicazione `Firewall Migration` su NethServer 7. Dopo l'installazione, l'applicazione sarà disponibile nell'elenco delle applicazioni Cockpit

## Scenari di migrazione

| Sistema sorgente | Metodo supportato | Note |
|---|---|---|
| NethServer 7 con solo il ruolo firewall | In-place o export/import | Puoi riutilizzare l'hardware esistente se NethSecurity 8 rileva tutti i dischi e le schede di rete necessari. |
| NethServer 7 con ruoli aggiuntivi come NethService, NethVoice o mail | Solo export/import | La migrazione in-place non è supportata. Installa NethSecurity 8 su una macchina dedicata e importa solo la configurazione firewall. |
| NethServer 6.x | Non supportato | Aggiorna prima a NethServer 7. |

:::note
Se stai utilizzando High Availability (HA) con NethServer 7, consulta anche la guida [Manutenzione e troubleshooting HA](./high-availability/ha_maintenance_troubleshooting.md) per le istruzioni dettagliate sulla migrazione mantenendo la funzionalità HA.
:::

## Compatibilità hardware

Prima di riutilizzare l'hardware esistente, avvia l'immagine USB live o una nuova installazione di NethSecurity 8 e verifica che tutti i dischi e le schede di rete siano rilevati. Non sono necessari passaggi speciali per gli adattatori SFP/SFP+ 10 Gb supportati: se la scheda viene rilevata, procedi normalmente con la migrazione. Se non viene rilevata, utilizza hardware diverso o una scheda di rete già supportata da NethSecurity 8.

Gli adattatori USB-to-Ethernet non sono supportati in produzione su NethSecurity 8. Vedi la sezione [Adattatori USB-to-Ethernet](#adattatori-usb-to-ethernet) per i dettagli.

## Test della migrazione

Questo metodo consente di testare la migrazione senza influenzare l'installazione esistente. Il sistema di test si avvia da un'unità USB lasciando intatta l'installazione esistente.

Per eseguire un test di migrazione:

1. Accedi alla pagina **Firewall Migration** su NethServer 7 Cockpit — la pagina elenca tutte le configurazioni migrate.
2. Clicca **Download** nella sezione **Download live USB image**.
3. Scrivi l'immagine scaricata su un'unità USB. Vedi [Installazione](./installation/system_requirements.md) per le istruzioni.
4. Spegni il firewall, inserisci l'unità USB e avvia da essa (di solito tramite le impostazioni BIOS/UEFI).
5. Il sistema si carica dall'unità USB. Eventuali modifiche o test avvengono in questo ambiente isolato.

Dopo i test, rimuovi l'unità USB e riavvia normalmente — l'installazione originale viene ripristinata completamente.

## Migrazione in-place

Se NethServer 7 ha solo il modulo firewall, puoi migrare e riutilizzare l'hardware corrente. Questo approccio elimina la necessità di hardware aggiuntivo.

:::warning
La migrazione in-place è un processo distruttivo. Crea un backup completo prima di procedere.
:::

Per eseguire la migrazione in-place:

1. Accedi alla pagina **Firewall Migration** su NethServer 7 Cockpit.
2. Scarica l'archivio di configurazione come precauzione: clicca **Download** nella sezione **Download exported archive** e conservalo in un luogo sicuro.
3. Clicca **Migrate** per avviare il processo.
4. **Seleziona il disco di destinazione**: scegli il disco dove verrà installato NethSecurity. NethSecurity non supporta il RAID. Se il server ha più di un disco, gli altri dischi rimangono invariati.
5. Clicca nuovamente **Migrate** per confermare. Il sistema scarica l'immagine NethSecurity, la scrive sul disco selezionato e riavvia automaticamente.
6. Al primo avvio, la configurazione di NethServer 7 viene applicata automaticamente. Verifica tutte le impostazioni e i servizi.

Dopo la migrazione, segui i [passi post-migrazione](#passi-post-migrazione).

## Migrazione con altri moduli installati

Questo scenario prevede l'esportazione di un archivio di configurazione da NethServer 7 e la sua importazione in una nuova installazione NethSecurity. Usa questo metodo quando NethServer 7 esegue anche moduli aggiuntivi come il mail server, WebTop groupware o NethVoice PBX.

Per eseguire la migrazione:

1. Installa NethSecurity su una nuova macchina seguendo le [istruzioni di installazione](./installation/system_requirements.md).
2. Accedi alla pagina **Firewall Migration** su NethServer 7 Cockpit.
3. Clicca **Download** nella sezione **Download export archive**.
4. Su NethSecurity, apri **Backup & Restore** → scheda **Migration**, clicca **Upload migration file** e seleziona l'archivio scaricato.
5. **Rimappa le interfacce di rete**: poiché gli indirizzi MAC cambiano sul nuovo hardware, mappa le interfacce sorgente (sinistra) alle interfacce destinazione (destra). Se la sorgente aveva VLAN, rimappa l'interfaccia fisica — il sistema ricrea automaticamente le VLAN.
6. Clicca **Migrate** per avviare il processo.

Dopo la migrazione, segui i [passi post-migrazione](#passi-post-migrazione).

## Passi post-migrazione

La migrazione in-place viene eseguita mentre il sistema è offline, quindi la sottoscrizione non viene trasferita. Se hai eseguito una migrazione in-place, [registra nuovamente il sistema](./system/subscription.md). Questo passaggio non è necessario quando si usa il metodo con archivio esportato.

Quando si usa un server LDAP o Active Directory remoto per autenticare i client OpenVPN Road Warrior, verifica che il server remoto sia raggiungibile dalla nuova macchina (inclusa la risoluzione DNS). Consulta la pagina [database utenti remoti](./users-objects/users_databases.md) per confermare che tutti gli utenti siano stati importati correttamente.

NethSecurity ascolta solo su HTTPS (porta 443) per le regole reverse proxy. Se avevi regole reverse proxy su HTTP (porta 80) in NethServer 7, aggiornale a HTTPS. Vedi [Reverse proxy](./network/reverse_proxy.md) per i dettagli.

Verifica che tutti i servizi funzionino correttamente. In caso di problemi, consulta la [guida al troubleshooting](../tutorial/troubleshooting.md).

Il processo di migrazione è registrato in `/root/migration.log`. Questo file viene eliminato dopo un aggiornamento dell'immagine.

### Correzione dei nomi bond e VLAN per High Availability

Dopo la migrazione da NethServer 7, i dispositivi di rete bonded possono avere nomi lunghi come `bond-bond0` invece del formato più corto `bond0` usato nelle nuove installazioni NethSecurity 8. Questo non influisce sulla funzionalità di base, ma questi nomi più lunghi possono impedire la configurazione della [High Availability](./high-availability/ha_overview_features_limitations.md).

Se prevedi di usare High Availability o preferisci nomi più puliti, rinomina i dispositivi con i seguenti passaggi.

Crea un backup della configurazione di rete:

```bash
cp /etc/config/network /root/network.ori
```

Esegui il comando di rinomina:

```bash
sed -i \
  -e "/option[[:space:]]\+ifname/s/'bond-bond\([0-9]\+\)'/'bond-b\1'/" \
  -e "/option[[:space:]]\+device/s/'bond-bond\([0-9]\+\)'/'bond-b\1'/" \
  -e "/option[[:space:]]\+name/s/'bond-bond\([0-9]\+\)\(\.[0-9]\+\)'/'b\1\2'/" \
  -e "/option[[:space:]]\+name/s/'bond-bond\([0-9]\+\)'/'bond-b\1'/" \
  -e "s/^\([[:space:]]*option[[:space:]]\+name[[:space:]]\+\)'b\([0-9]\+\)'\([[:space:]]*\)$/\1'bond-b\2'\3/" \
  /etc/config/network
```

Riavvia la rete o riavvia il sistema:

```bash
/etc/init.d/network restart
```

Una volta verificato il corretto funzionamento, elimina il backup:

```bash
rm -f /root/network.ori
```

Dopo le modifiche, i dispositivi usano nomi più corti (es. `b0`, `b0.20`), compatibili con High Availability e coerenti con le nuove installazioni.

## Matrice di copertura della migrazione

| Area | Risultato | Note |
|---|---|---|
| Password root | Migrata | La stessa password può essere usata per SSH e l'interfaccia web. |
| Interfacce di rete e VLAN | Migrata con limitazioni | I bridge su bond non sono supportati. Sul nuovo hardware, le VLAN vengono ricreate automaticamente sull'interfaccia fisica scelta durante la rimappatura. Vedi [Correzione nomi bond e VLAN](#correzione-dei-nomi-bond-e-vlan-per-high-availability). |
| Etichette interfacce di rete | Migrata | Le etichette sorgente vengono mantenute come nomi di interfaccia, eccetto sulle interfacce WAN che mantengono i loro nomi originali. |
| Data e fuso orario | Migrata | |
| Server DHCP e prenotazioni | Migrata con limitazioni | I server DHCP su interfacce bond non sono supportati. |
| Configurazione DNS e host locali | Migrata con limitazioni | Le opzioni TFTP sono migrate, ma il contenuto TFTP no. Per riabilitarlo, configura `tftp_root` manualmente. |
| Rotte IPv4 statiche | Migrata | |
| Port forward | Migrata | Se utilizzi il port forwarding per un server FTP, devi abilitare esplicitamente l’helper conntrack FTP sulla zona WAN. Consulta la sezione [Port Forward](./firewall/port_forward.md) per i dettagli.|
| Zone firewall | Migrata | Green → `lan`, red → `wan`, orange → `dmz`, blue → `guest`. Se esisteva una zona blue, le regole di accettazione DNS e DHCP vengono aggiunte automaticamente. |
| Regole firewall | Migrata con conversione | Le regole che usano servizi NDPI non sono supportate. Gli oggetti sorgente/destinazione vengono convertiti in valori IP/CIDR. |
| Oggetti firewall | Non ricreati | Gli oggetti non possono essere reimportati automaticamente. Le regole che usavano oggetti vengono convertite nei corrispondenti valori IP/CIDR. |
| MultiWAN | Parziale | I provider vengono mantenuti. Le regole divert (policy routing) non vengono migrate. |
| QoS | Parziale | Le classi con larghezza di banda riservata e le regole correlate non sono supportate. |
| OpenVPN Road Warrior | Parziale | Le impostazioni vengono migrate. Il database di accounting e le notifiche email non vengono migrati. Per l'autenticazione tramite Active Directory remoto, vedi [Database remoti](./users-objects/users_databases.md). |
| Tunnel OpenVPN | Migrata | |
| Tunnel IPSec | Migrata | |
| Threat Shield IP | Parziale | Vengono migrate solo le liste enterprise. Le liste community devono essere riconfigurate manualmente. |
| Sottoscrizione | Condizionale | Viene migrata solo con il metodo dell'archivio esportato. |
| Hotspot | Condizionale | Sul nuovo hardware l'indirizzo MAC cambia — l'hotspot deve essere registrato nuovamente sul manager remoto. |
| Certificati Let's Encrypt e reverse proxy | Rigenerati | La configurazione viene migrata, ma i certificati vengono rigenerati dopo la migrazione. |
| FlashStart Cloud DNS filter | Migrata | |

### Esempi di rimappatura

- **Rimappatura VLAN**: se la VLAN 20 era su `eth1` sulla sorgente e `eth1` viene mappato a `eth2` sulla destinazione, la VLAN 20 viene ricreata automaticamente su `eth2`.
- **Conversione oggetti firewall**: se una regola usava un host set `BranchOffice` con valore `10.20.30.0/24`, la regola migrata mantiene direttamente `10.20.30.0/24` invece di ricreare l'oggetto.

### Funzionalità non migrate

Le seguenti funzionalità non vengono migrate in NethSecurity:

- **Web proxy** (Squid) e filtro (ufdbGuard): sostituiti da [Filtro contenuti](./security/content_filter.md) e [Deep Packet Inspection (DPI)](./security/dpi_filter.md)
- **IPS** (Suricata) e alert IPS (EveBox): sostituiti da [Intrusion Prevention System (Snort)](./security/ips.md)
- **Monitoraggio UPS** (NUT): disponibile da riga di comando tramite [UPS (NUT)](./advanced-cli/ups.md)
- **Statistiche di sistema** (Collectd): sostituito da Netdata nel [Monitoraggio in tempo reale](./monitoring/monitoring.md)
- **Report** (Dante): sostituito dalle metriche del controller in [Metriche](./system/controller.md)
- **Monitor banda** (ntopng): disponibile nel [Monitoraggio in tempo reale](./monitoring/monitoring.md) e in [Metriche](./system/controller.md)
- **Fail2ban**: sostituito da Threat Shield [protezione attacchi brute force](./security/threat_shield_ip.md)
- **Threat Shield DNS**: deve essere riconfigurato manualmente — vedi [Threat Shield DNS](./security/threat_shield_dns.md)

## Zone personalizzate

Le zone personalizzate sono raramente usate in NethServer 7 e tipicamente per compiti molto specifici: definire un segmento di rete con regole firewall diverse dall'interfaccia primaria, o gestire correttamente il traffico proveniente da una rete diversa da quella a cui è connessa l'interfaccia.

In NethSecurity, le zone funzionano diversamente da NethServer 7, offrendo una gestione molto più semplice. Tipicamente, tutte le configurazioni precedenti realizzate con zone personalizzate possono essere gestite **senza necessità di ricreare alcuna zona personalizzata**, grazie ai seguenti comportamenti predefiniti.

### Ereditarietà delle policy per il traffico in entrata

Tutto il traffico in arrivo su un'interfaccia NethSecurity eredita automaticamente le stesse policy dell'interfaccia connessa, indipendentemente dalla rete di origine — incluso il masquerading automatico quando il traffico è destinato a internet.

**Esempio:** un'interfaccia locale "office" opera sulla rete `192.168.1.0/24` (zona: `lan`). Un gateway a `192.168.1.220` è connesso allo stesso switch e fornisce accesso alla rete remota `10.10.10.0/24`. Il traffico da `10.10.10.0/24` deve raggiungere internet tramite NethSecurity. Non è necessaria alcuna configurazione aggiuntiva — tutti i pacchetti in arrivo sull'interfaccia "office" vengono instradati e mascherati correttamente.

### Nessuna necessità di creare nuove zone per segmenti diversi

Le regole firewall standard possono essere applicate a questo traffico senza creare una nuova zona. Per applicare policy diverse a un segmento specifico, crea regole firewall standard e usa un host set con la rete CIDR negli oggetti firewall.

### Il routing funziona senza regole aggiuntive

Il routing per il segmento di rete specifico funziona correttamente senza regole o zone aggiuntive. In NethServer 7, era obbligatorio creare una zona per garantire il corretto routing dei pacchetti in entrata.

## Adattatori USB-to-Ethernet

Gli adattatori USB-to-Ethernet **non sono supportati su NethSecurity 8** in produzione. È possibile installare driver specifici per uso sperimentale/temporaneo in attesa di hardware con le schede di rete necessarie. Ulteriori informazioni sono disponibili nella [sezione rete](./network/network.md).

:::warning
Gli adattatori USB-to-Ethernet non funzioneranno finché non viene installato il driver corretto. NethSecurity 8 potrebbe non avere il driver corretto per l'adattatore usato su NethServer 7. In tal caso, utilizza un adattatore diverso.
:::

:::note
Se un adattatore USB-to-Ethernet viene usato per un'interfaccia RED/WAN, non sarà possibile scaricare i moduli driver necessari a meno che non siano presenti altre interfacce RED/WAN su schede di rete direttamente connesse alla scheda madre.
:::
