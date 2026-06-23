---
title: "Archiviazione"
sidebar_position: 5
---

# Archiviazione {#storage-section}

A partire dalla versione 8.6, NethSecurity salva automaticamente i log di sistema in una partizione di archiviazione persistente sulle installazioni bare metal (*fare riferimento alla sezione dedicata qui sotto per le macchine virtuali*).

Questo garantisce che i log rimangono disponibili dopo riavvii o arresti inaspettati, anche se l'archiviazione non è stata configurata manualmente. Il periodo predefinito di conservazione dei log è di 52 settimane.

Per **le nuove installazioni** il sistema crea automaticamente una partizione dedicata nel disco principale per archiviare i log.

Per **gli aggiornamenti**:

- se nessuna archiviazione era stata precedentemente configurata, il sistema la configura automaticamente utilizzando lo spazio non allocato nel disco principale
- se l'archiviazione era già configurata, rimane invariata

:::note

Questo comportamento migliora l'affidabilità e non richiede interventi manuali. Tuttavia, gli utenti possono ancora gestire le impostazioni di archiviazione dall'interfaccia web.

:::

L'archiviazione persistente dei log può essere disabilitata (non consigliato) o spostata su un disco diverso se necessario. Se disabilitata, il sistema la riconfigurerà automaticamente durante un futuro aggiornamento.

## Configurazione manuale

La configurazione manuale di archiviazione aggiuntiva è ancora disponibile e funziona come segue:

- Se si utilizza un dispositivo aggiuntivo, collegarlo al sistema.
- Accedere alla pagina `Archiviazione` nella sezione `Sistema` nel menu a destra.
- Selezionare il dispositivo di archiviazione in cui salvare i log.
- Fare clic sul pulsante **Formatta e configura archiviazione**.
- Se il dispositivo selezionato è il **disco principale**, il sistema genererà una nuova partizione utilizzando lo spazio non allocato.
- Se è selezionato un **disco aggiuntivo**, il sistema cancellerà tutte le partizioni e i dati esistenti e creerà una singola nuova partizione.

L'archiviazione viene quindi:

- Formattata con il filesystem `ext4`
- Montata in `/mnt/data`
- Utilizzata da `rsyslog` per scrivere i log in `/mnt/data/log/messages`. Per ulteriori dettagli, vedere [Rotazione dei log di archiviazione](../advanced-cli/logs.md#storage-log-rotation-section).
- Sincronizzata quotidianamente (durante la notte) per dati aggiuntivi come metriche

Per rimuovere l'archiviazione persistente e tornare alla registrazione in memoria, fare clic sul pulsante **Rimuovi archiviazione**.

### Macchine virtuali

Quando si installa NethSecurity su una macchina virtuale, il metodo consigliato è generare il disco virtuale dall'immagine ufficiale. In questa modalità, i log non vengono archiviati in modo persistente per impostazione predefinita. Per abilitare l'archiviazione persistente dei log, è necessario collegare un secondo disco virtuale alla macchina virtuale. In alternativa, è possibile estendere il disco virtuale e utilizzare lo spazio libero del disco per creare una nuova partizione come su un hardware fisico.

### Comportamento nelle versioni precedenti a 8.6 {#behavior-in-versions-prior-to-8.6}

Nelle versioni precedenti di NethSecurity, i log venivano scritti per impostazione predefinita in una **directory volatile in memoria**. Per persistere i log, l'archiviazione doveva essere configurata **manualmente**, utilizzando lo spazio non allocato nel disco di sistema o collegando un disco secondario.

#### Risoluzione dei problemi

In alcuni casi, è possibile riscontrare difficoltà nell'utilizzo del disco principale per l'archiviazione dei log, in quanto l'interfaccia utente potrebbe non presentare alcuna opzione. In tali casi, il problema in genere deriva da una partizione preesistente sul disco, che deve essere rimossa in anticipo per garantire il corretto utilizzo da parte del sistema.

Questo si verifica solitamente anche dopo aver eseguito un ripristino predefinito utilizzando la modalità failsafe (che non rimuove la partizione dei log). Per consentire al sistema di utilizzare nuovamente l'archiviazione per salvare nuovi log, è necessario rimuovere la partizione precedente.

Questo può essere facilmente fatto in questo modo.

- Verificare se la partizione dei log è presente con il comando:

`parted /dev/sda print`:

    root@NethSec:~# parted /dev/sda print
    Model: ATA Hoodisk SSD (scsi)
    Disk /dev/sda: 32.0GB
    Sector size (logical/physical): 512B/512B
    Partition Table: gpt
    Disk Flags: 

    Number  Start   End     Size    File system  Name  Flags
    128     17.4kB  262kB   245kB                      bios_grub
     1      262kB   17.0MB  16.8MB  fat16              legacy_boot
     2      17.0MB  332MB   315MB
     3      512MB   32.0GB  31.5GB  ext2

La partizione 3 è quella utilizzata per i log.

- Per rimuovere la partizione 3, eseguire il comando:

`parted /dev/sda rm 3`

- Ora verificare di nuovo la tabella delle partizioni con il comando:

`parted /dev/sda print`

La partizione 3 non dovrebbe essere visibile.

Ora l'archiviazione è pronta per essere configurata per i log dall'interfaccia web.
