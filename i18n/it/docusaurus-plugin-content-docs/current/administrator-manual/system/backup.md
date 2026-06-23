---
title: "Backup e ripristino"
sidebar_position: 3
---

# Backup e ripristino

NethSecurity fornisce un sistema di backup flessibile e potente per salvare e ripristinare le impostazioni di configurazione del firewall.

Accedi alla pagina `Backup & Ripristino` nella sezione `Sistema`, quindi fai clic sul pulsante **Scarica backup**. Se il dispositivo dispone di un abbonamento Enterprise valido, il backup è [automatico](#automatic_backup-section).

Il backup include tutti i file di configurazione rilevanti e anche l'elenco dei pacchetti extra installati dall'utente. L'elenco viene salvato nel file `/etc/backup/installed_packages.txt`.

## Backup

NethSecurity consente la creazione di backup crittografati e non crittografati. Lo scaricamento di un backup non crittografato è sempre possibile facendo clic sul pulsante **Scarica non crittografato**.

Per consentire lo scaricamento di un backup crittografato, prima fai clic sul pulsante **Configura passphrase** e imposta una password complessa. Dopo di ciò, il pulsante **Scarica crittografato** diventerà attivo.

:::note

Se il backup è crittografato e la password viene persa, non sarà più possibile ripristinare la configurazione.

:::

Per disabilitare i backup crittografati, fai clic sul pulsante **Rimuovi passphrase** e il pulsante **Scarica crittografato** diventerà inattivo.

## Ripristino {#automatic_backup-section}

Il backup può essere ripristinato dalla scheda `Ripristino` all'interno della pagina `Backup & Ripristino`. L'utente può avviare il processo di ripristino facendo clic sul pulsante **Ripristina backup** e caricando il file di backup. Se il dispositivo dispone di un abbonamento Enterprise valido, l'interfaccia web presenterà inoltre un elenco di backup disponibili dal server remoto. Se il backup è crittografato, immetti la passphrase e infine fai clic sul pulsante **Ripristina** per completare il processo.

Dopo il ripristino il sistema verrà riavviato.

:::note

A partire dalla versione 8.7.2, i pacchetti extra vengono reinstallati automaticamente dopo l'aggiornamento del sistema. Per le versioni precedenti e per informazioni aggiuntive, consulta questa documentazione: [Ripristina pacchetti extra](./updates.md#restore_extra_packages-section).

:::

## Dispositivi con abbonamento

:::note

Abbonamento richiesto

Questa funzione è disponibile solo se il firewall dispone di un abbonamento valido.

:::

I backup si comportano diversamente nei dispositivi con un [abbonamento](./subscription.md) attivo.

I backup non crittografati possono ancora essere scaricati direttamente dall'interfaccia utente di NethSecurity facendo clic sul pulsante **Scarica non crittografato**.

I backup crittografati vengono archiviati nel cloud e integrati con il Nethesis Operation Center: questo approccio semplifica la gestione del backup e il processo di ripristino per i dispositivi basati su abbonamento, che possono interagire direttamente con l'Operation Center e scaricare automaticamente il backup durante il ripristino.

Per abilitare i backup cloud crittografati, una passphrase deve essere prima configurata facendo clic sul pulsante **Configura passphrase** e impostando una password complessa. Una volta impostata la passphrase, puoi:

- Fare clic sul pulsante **Esegui backup cloud** per creare un backup immediatamente
- Lasciare che il sistema crei automaticamente un backup ogni notte

Ogni backup crittografato verrà inviato direttamente al Nethesis Operation Center su un canale sicuro. Tieni presente che la data del backup è la data del server. Le date visualizzate nell'elenco dei backup si basano sull'ora del server che archivia i backup, non sull'ora del firewall che li ha creati. Ciò significa che le date potrebbero differire a seconda delle differenze di fuso orario.

:::warning

I backup cloud senza crittografia sono stati deprecati. Per un periodo limitato, i backup continueranno a essere inviati al cloud anche se non crittografati. Nel prossimo futuro, solo i backup crittografati verranno inviati al server remoto. Se disponi di un abbonamento valido, abilita la crittografia per garantire la sicurezza del tuo backup. Vedi anche [Avviso crittografia backup](#backup_encryption-alert) per ulteriori informazioni.

:::

### Avviso crittografia backup {#backup_encryption-alert}

Non crittografare il backup è un rischio di sicurezza. Se il backup non è crittografato, chiunque abbia accesso al file di backup può leggere le impostazioni di configurazione archiviate al suo interno.

Ogni notte uno script verificherà se il backup è crittografato. Se il backup non è crittografato, lo script creerà un avviso nel portale remoto my.nethesis.it o my.nethserver.com. Per risolvere l'avviso, l'utente deve abilitare la crittografia facendo clic sul pulsante **Configura passphrase** e impostando una password complessa. L'avviso verrà risolto automaticamente durante il cron job notturno.

Per disabilitare l'avviso, accedi alla shell ed esegui: :

    uci set ns-plug.config.backup_alert_disabled=1
    uci commit ns-plug

La disabilitazione dell'avviso comporterà errori silenziosi quando l'invio di backup non crittografati verrà bloccato in futuro. L'amministratore non sarà notificato di questi errori, il che potrebbe portare a problemi di backup non notati.

## Personalizzazione del backup

Il backup include tutti i file di configurazione rilevanti. Per elencare i file inclusi nel backup, esegui il seguente comando: :

    sysupgrade -l

Il backup può essere personalizzato aggiungendo file all'elenco dei backup. Aggiungi semplicemente una nuova riga al file `/etc/sysupgrade.conf` con il percorso del file da includere nel backup.

Esempio: :

    echo /etc/myfile >> /etc/sysupgrade.conf

## Come decrittografare un backup

Normalmente, i backup crittografati vengono gestiti direttamente da NethSecurity sia durante la creazione che durante le fasi di ripristino. Una volta fornita la passphrase, il sistema crittografa o decrittografa automaticamente il file.

In alcuni casi, tuttavia, può essere utile decrittografare il backup esternamente (al di fuori del firewall) per eseguire controlli prima di ripristinarlo. Per questo motivo, è possibile utilizzare il seguente comando `gpg` per decrittografare il contenuto del backup: :

    gpg --decrypt --passphrase $YOUR_PASSPHRASE --output unencrypted-file.tar.gz --yes $YOUR_ENCRYPTED_BACKUP_FILE
