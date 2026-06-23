---
title: "Supporto remoto"
sidebar_position: 2
---

# Supporto remoto {#remote_support-section}

:::note

È richiesto l'abbonamento Enterprise

Questa funzione è disponibile solo se il firewall dispone di un abbonamento Enterprise valido.

:::

L'[abbonamento Enterprise](./subscription.md) ti permette di accedere al supporto remoto di Nethesis.

La sessione di supporto remoto connette il firewall a un'[istanza WindMill](https://github.com/nethesis/windmill) ospitata da Nethesis su `sos.nethesis.it`. Il firewall deve essere in grado di connettersi all'host suddetto sulla porta `1194` UDP. Se la porta `1194` è chiusa, il sistema tenterà un fallback sulla porta `443` TCP.

## Gestione della sessione

Il supporto remoto deve essere avviato e interrotto dall'amministratore del firewall.

### Avvio di una sessione

Per avviare una sessione:

- accedi alla pagina `Subscription` e vai alla sezione `Remote support`
- fai clic sul pulsante **Start session**
- copia l'`ID sessione` e condividilo con il team di supporto
- la sessione sarà attiva per 24 ore per impostazione predefinita

Il sistema visualizzerà:

- Lo stato corrente della sessione (attiva/inattiva)
- L'ora di scadenza della sessione
- Il tempo rimanente fino alla scadenza

Puoi visualizzare queste informazioni in qualsiasi momento nella sezione `Remote support` della pagina `Subscription`.

### Scadenza della sessione

Le sessioni di supporto remoto hanno il seguente comportamento di scadenza:

- **Sessione predefinita**: scade dopo 24 ore
- **Sessione estesa**: scade dopo 7 giorni dal momento dell'estensione

Il sistema monitora continuamente la scadenza della sessione:

- un cron job viene eseguito ogni 10 minuti per verificare le sessioni scadute
- quando una sessione scade, viene automaticamente interrotta
- gli eventi di scadenza della sessione vengono registrati nel log di sistema

### Interruzione di una sessione

Per interrompere manualmente una sessione attiva prima della scadenza:

- accedi alla pagina `Subscription` e vai alla sezione `Remote support`
- fai clic sul pulsante **End session**
- la connessione di supporto remoto verrà immediatamente chiusa

## Interfaccia della riga di comando

Il comando `don` richiede i privilegi di root e registra tutte le operazioni nel log di sistema.

Avvia una sessione:

    don start

Questo avvierà una nuova sessione di supporto remoto con una scadenza di 24 ore.

Controlla lo stato della sessione:

    don status

Questo visualizza le informazioni sulla sessione corrente incluse:

- ID Server
- ID Sessione
- Tempo rimanente fino alla scadenza

Estendi una sessione attiva:

    don extend

:::info

L'estensione della sessione è disponibile solo tramite riga di comando. Questa funzione estende la sessione dalle 24 ore predefinite a 7 giorni a partire dall'ora corrente.

:::

Interrompi una sessione:

    don stop

Questo interrompe immediatamente la sessione di supporto remoto e pulisce tutte le risorse.

Controlla le sessioni scadute:

    don expire

Questo comando viene eseguito automaticamente da cron ogni ora per verificare se la sessione è scaduta. Se la sessione è scaduta, verrà automaticamente interrotta.

Esempi di log:

    Mar 27 09:24:37 NethSec don: Remote support session started
    Mar 27 09:24:54 NethSec don: Remote support session extended by 7 days
    Mar 27 09:25:04 NethSec don: Remote support session stopped
