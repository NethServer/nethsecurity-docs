---
title: "Aggiornamenti"
sidebar_position: 4
---

# Aggiornamenti {#updates-section}

NethSecurity consente due tipi di aggiornamenti, entrambi disponibili dalla sezione `Aggiornamenti` nel menu `Sistema`:

- aggiornamenti normali per correzioni di bug e patch di sicurezza
- aggiornamenti del sistema per passare a una versione diversa

## Correzioni di bug e sicurezza {#bug-security-fixes}

Questi aggiornamenti sono destinati a aggiornamenti minori e correzioni di bug.

Tipicamente potrebbero essere eseguiti automaticamente, ma in qualsiasi momento è possibile verificare se sono disponibili nuovi aggiornamenti facendo clic sul pulsante **Controlla correzioni**. Questi aggiornamenti non richiedono il riavvio di NethSecurity, sono legati a una versione specifica e distribuiti tramite pacchetti.

Quando si utilizza questo metodo, la versione dell'immagine visualizzata nel dashboard non cambia, ma il sistema viene aggiornato con le ultime correzioni.

## Aggiornamenti del sistema {#system_upgrades-section}

Questi tipi di aggiornamenti comportano la transizione a una nuova versione del firmware che introduce nuove funzionalità, miglioramenti e un supporto hardware più ampio.

Questo tipo di aggiornamento riavvierà il dispositivo (che quindi non sarà raggiungibile per alcuni decine di secondi) e quindi riscriverà completamente il firmware, preservando tutte le configurazioni. Tuttavia, è consigliato salvare un backup della configurazione prima di procedere con l'aggiornamento.

Se è disponibile una nuova versione, l'interfaccia utente visualizzerà un banner informativo e un pulsante dedicato **Aggiorna Sistema** che ti permetterà di eseguire l'aggiornamento.

In alternativa, è sempre possibile caricare manualmente un'immagine compatibile utilizzando il pulsante **Aggiorna con file immagine** e procedere con l'aggiornamento.

**Aggiornamento da riga di comando**

È possibile eseguire un `Aggiornamento del sistema` anche dalla riga di comando. Per farlo, è sufficiente scaricare il nuovo file immagine, è consigliato salvarlo nella directory `/tmp`. Quindi eseguire il seguente comando:

    sysupgrade -k -v nethsecurity-<version>-x86-64-generic-squashfs-combined.img.gz

Il comando `sysupgrade` carica il nuovo file immagine nel dispositivo.

### Ripristino pacchetti extra {#restore_extra_packages-section}

A partire dalla versione 8.7.2, i pacchetti extra vengono reinstallati automaticamente dopo l'aggiornamento del sistema. Si noti che la procedura di reinstallazione richiede l'accesso a Internet. Se uno o più pacchetti non possono essere installati perché la rete non è ancora pronta o si verifica un errore temporaneo, il servizio di ripristino rimane abilitato e ritenta automaticamente al prossimo avvio fino a quando tutti i pacchetti non vengono ripristinati. I pacchetti ripristinati sono riportati nel log. Ad esempio, un ripristino misto potrebbe registrare:

    Restored package: etherwake
    Failed to restore package: qemu-ga
    Some packages failed to restore, will retry later

In caso di errore, procedere con il ripristino manuale documentato di seguito. Vedere la sezione successiva per le versioni precedenti.

Dopo l'aggiornamento, è possibile eseguire il seguente comando per elencare tutti i pacchetti extra:

    grep overlay /etc/backup/installed_packages.txt

Questo comando restituisce tutti i pacchetti extra, permettendoti di verificare quali sono installati e presenti nel sistema.

#### Ripristino manuale di pacchetti extra

Questa procedura manuale è richiesta solo per le versioni precedenti a 8.7.2 o se la procedura di reinstallazione automatica non riesce.

Durante l'aggiornamento, il sistema viene completamente riscritto e tutti i pacchetti extra installati dall'utente andranno persi. Tuttavia, l'elenco dei pacchetti installati viene salvato nel backup della configurazione, permettendone il ripristino dopo l'aggiornamento.

Dopo l'aggiornamento, assicurati che il sistema abbia accesso a Internet, quindi ripristina i pacchetti precedentemente installati utilizzando i seguenti comandi:

    opkg update
    grep -E '\w+\s+overlay$' /etc/backup/installed_packages.txt | awk '{print $1}' | xargs opkg install

## Aggiornamenti automatici dei pacchetti

:::note

Nessun abbonamento richiesto

A partire da NethSecurity 8.8, questa funzione è disponibile anche senza abbonamento.

:::

Gli aggiornamenti automatici per i pacchetti possono essere abilitati dalla sezione `Aggiornamenti` nel menu `Sistema`, abilitando l'opzione `Aggiornamenti automatici`. Gli aggiornamenti vengono controllati quotidianamente e, se disponibili, vengono scaricati e installati automaticamente.

## Comandi di gestione pacchetti

NethSecurity 8.8 utilizza `apk`. NethSecurity 8.7.2 e versioni precedenti utilizzano `opkg`. Utilizzare il seguente riferimento rapido quando si traducono esempi di comandi più vecchi:

| Comando OPKG          | Equivalente APK      | Descrizione             |
|-----------------------|---------------------|-------------------------|
| `opkg install <pkg>`  | `apk add <pkg>`     | Installare un pacchetto       |
| `opkg remove <pkg>`   | `apk del <pkg>`     | Rimuovere un pacchetto        |
| `opkg upgrade`        | `apk upgrade`       | Aggiornare tutti i pacchetti    |
| `opkg files <pkg>`    | `apk info -L <pkg>` | Elencare il contenuto del pacchetto   |
| `opkg list-installed` | `apk info`          | Elencare i pacchetti installati |
| `opkg update`         | `apk update`        | Aggiornare gli elenchi dei pacchetti    |
| `opkg search <pkg>`   | `apk search <pkg>`  | Cercare pacchetti     |

Il comando `opkg find` utilizzato in pochi esempi precedenti è mappato su `apk search` in NethSecurity 8.8.
