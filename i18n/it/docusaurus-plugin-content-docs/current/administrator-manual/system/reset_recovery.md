---
title: "Ripristino di fabbrica"
sidebar_position: 6
---

# Ripristino di fabbrica

NethSecurity fornisce più opzioni per ripristinare il firewall e ripristinare la sua funzionalità:

- [Ripristino di fabbrica](#factory_reset-section): scegliendo questo metodo si cancellano tutti i pacchetti installati e le impostazioni personalizzate, riportando il firewall al suo stato originale come era dopo l'installazione di NethSecurity.
- [Modalità failsafe](#failsafe-section): questa opzione è utile se hai perso il controllo del tuo dispositivo, rendendolo inaccessibile a causa di un errore di configurazione. La modalità failsafe consente di riavviare il firewall in uno stato operativo di base mantenendo la maggior parte dei tuoi pacchetti e impostazioni.
- [Modalità di ripristino](#recovery-section): se il firmware del firewall si corrompe, la modalità di ripristino viene in tuo aiuto. Consente di installare nuovo firmware e di ripristinare un dispositivo difettoso.

## Ripristino di fabbrica {#factory_reset-section}

In NethSecurity, un ripristino di fabbrica si riferisce al processo di ripristino del dispositivo firewall alle sue impostazioni e configurazione originali come era quando è stato installato per la prima volta. Questa procedura cancella tutte le impostazioni personalizzate, le configurazioni, i pacchetti installati e i dati utente sul dispositivo, ripristinandolo in uno stato pulito.

Questa procedura si basa sul completamento del processo di avvio. Se il ripristino di fabbrica non funziona, considera l'utilizzo della modalità failsafe.

Per ricominciare da zero senza reinstallare il firmware, accedi alla pagina `Ripristino di fabbrica` nella sezione `Sistema`. Fai clic sul pulsante **Esegui ripristino di fabbrica** per ripristinare il firewall al suo stato originale. Il processo di ripristino di fabbrica impiegherà alcuni secondi. Una volta completato il processo, il firewall si riavvierà automaticamente.

Il ripristino di fabbrica ripristina la versione attualmente installata. Ad esempio, se il firewall è stato installato inizialmente con la versione 23.05.0 e poi aggiornato a 23.05.1, dopo il ripristino di fabbrica, avrai un'installazione pulita della versione 23.05.1.

Se l'archiviazione su cui è in esecuzione NethSecurity è stata configurata con una partizione per salvare i log, il "Ripristino di fabbrica" eseguito dall'interfaccia Web rimuoverà anche la partizione dei log e tutti i suoi dati.

:::note

Se NethSecurity è stato installato tramite una migrazione in-place da NethServer 7, il ripristino di fabbrica non ripristinerà la configurazione predefinita. Invece, il sistema si riavvierà con tutte le configurazioni migrate da NethServer 7.

:::

Se preferisci un inizio pulito, puoi procedere con una nuova [installazione](../installation/install.mdx) invece di utilizzare il ripristino di fabbrica.

In alternativa, puoi seguire questi passaggi:

- Aggiorna NethSecurity con un'immagine più recente (se disponibile) o utilizzando un'immagine standard scaricata da [download](../installation/download.mdx). Questo riscriverà la ROM del tuo NethSecurity con una standard, rimuovendo eventuali file di migrazione.
- Ora puoi eseguire il Ripristino di fabbrica, che ti porterà a un inizio pulito.

Se desideri eseguire il ripristino di fabbrica dalla riga di comando, basta eseguire il seguente comando:

    /usr/libexec/rpcd/ns.factoryreset call reset

## Modalità failsafe {#failsafe-section}

NethSecurity fornisce una modalità failsafe che può sovrascrivere la configurazione corrente del tuo dispositivo. Se il tuo dispositivo diventa inaccessibile a causa di un errore di configurazione, la modalità failsafe viene in tuo aiuto. Quando avvii in modalità failsafe, il dispositivo si inizializza in uno stato operativo di base, utilizzando un set di impostazioni predefinite, consentendoti di affrontare il problema manualmente.

Tuttavia, è importante notare che la modalità failsafe non può risolvere problemi più complessi come hardware difettoso o un kernel danneggiato. Sebbene assomigli a un ripristino, la modalità failsafe ti consente di accedere al tuo dispositivo e ripristinare le impostazioni se necessario, mentre un ripristino cancellerebbe semplicemente tutte le configurazioni.

Il modo più semplice per attivare la modalità failsafe è collegare direttamente il firewall utilizzando un monitor VGA/HDMI o un cavo seriale. Per fare questo, avvia il computer, attendi che appaia il menu di avvio Grub e seleziona `NethSecurity (failsafe)`.

Puoi accedere al firewall direttamente attraverso la porta seriale utilizzando un cavo null-modem e un programma terminale comune. Per Windows, puoi utilizzare `PuTTY` versione 0.60 o superiore. Per Linux, le opzioni includono `minicom` e `picocom`. Imposta la velocità in baud a 115200, i bit di dati a 8, la parità a Nessuno e i bit di stop a 1 (abbreviato come 8N1).

Dopo aver inserito la modalità failsafe, il firewall si avvierà con un indirizzo di rete di 192.168.1.1/24, solitamente sull'interfaccia di rete eth0, e solo i servizi essenziali saranno operativi. È importante notare che il server DHCP sarà inattivo in modalità failsafe. Segui le istruzioni visualizzate sullo schermo per montare il filesystem root e accedere ad altri strumenti secondo le necessità.

Se desideri eseguire il ripristino di fabbrica in modalità failsafe, basta eseguire i seguenti comandi:

    firstboot -y && reboot

:::note

Questi comandi non cancelleranno la partizione dei log dal disco se esiste. Se è necessario eliminare la vecchia partizione, fai riferimento a [Storage](./storage.md) per ulteriori dettagli.

:::

## Ripristino di emergenza {#recovery-section}

Il ripristino di emergenza in NethSecurity, noto anche come unbricking, è una funzione che consente agli utenti di ripristinare il loro dispositivo firewall in caso di malfunzionamenti gravi. L'unbricking garantisce che anche i problemi più critici possano essere risolti, ripristinando il dispositivo alla piena funzionalità, a meno che non vi siano guasti hardware.

Se hai ancora accesso al sistema, puoi utilizzare i seguenti comandi per scaricare e scrivere l'immagine:

    ns-download -l

Questo comando visualizzerà il percorso dell'immagine scaricata. Utilizza questo percorso nel seguente comando:

    sysupgrade -n <download_image_path>

Se non riesci ad accedere al sistema, [scarica l'immagine più recente](../installation/download.mdx), quindi segui le [istruzioni di installazione](../installation/install.mdx#install_bare_metal-section) per scrivere l'immagine direttamente nei supporti di archiviazione.
