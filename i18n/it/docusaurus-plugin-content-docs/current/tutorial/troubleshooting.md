---
title: "Risoluzione dei problemi"
sidebar_position: 2
---

# Risoluzione dei problemi {#troubleshooting-section}

NethSecurity è un sofisticato sistema firewall con numerosi componenti interconnessi. Sebbene il sistema automatizzi molte configurazioni senza problemi, occasionalmente possono verificarsi malfunzionamenti.

È possibile creare una richiesta di supporto e segnalare problemi al team di supporto Nethesis o al forum della comunità NethServer.

Per le versioni stabili, è possibile aprire un ticket sul [portale helpdesk Nethesis](https://helpdesk.nethesis.it) se la tua macchina ha un abbonamento.

Per le versioni instabili, puoi aprire una nuova discussione sul [forum della comunità NethServer solo in inglese](https://community.nethserver.org) nella categoria NethSecurity. Se sei un partner Nethesis, puoi aprire una nuova discussione in italiano sulla [comunità partner Nethesis](https://partner.nethesis.it) nella categoria NethSecurity.

Quando apri una richiesta di supporto o segnali un problema, dovresti seguire queste linee guida per assicurare una risoluzione rapida ed efficace:

- Assegna titoli chiari e descrittivi a ogni ticket o discussione.
- Fornisci informazioni complete e dettagliate in ogni richiesta.
- Includi screenshot, log e qualsiasi altra informazione rilevante per aiutare la risoluzione dei problemi.
- Collabora con il team di supporto fornendo feedback e rispondendo alle loro domande.

**1. Raccogliere informazioni**

Prima di creare una richiesta di supporto, è fondamentale raccogliere il maggior numero possibile di informazioni sul problema che stai affrontando. Questo aiuta il team di supporto a identificare e risolvere il problema rapidamente.

La tua richiesta di supporto dovrebbe includere quanto segue:

- **La configurazione del tuo sistema:** Include la versione di NethSecurity che stai utilizzando; puoi trovare le informazioni nella pagina Dashboard. Si prega di segnalare la versione completa come `8 23.05.2-ns.0.0.1-beta1-96-ga759afb`
- **Il problema che stai riscontrando:** Descrivi il problema in dettaglio, inclusi i passaggi che hai eseguito per riprodurlo.
- **Eventuali messaggi di errore:** Se ricevi messaggi di errore, includili nella tua richiesta. Puoi utilizzare l'[interfaccia utente](#troubleshooting_ui-section) per raccogliere queste informazioni, oppure accedi alla riga di comando e utilizza `less /var/log/messages` per trovare i log rilevanti.
- **Eventuali modifiche apportate:** Se hai apportato modifiche alla configurazione del tuo sistema, elencale nella tua richiesta.
- **Il risultato desiderato:** Cosa speri di ottenere contattando il supporto?

**2. Descrivi il problema oggettivamente**

Quando descrivi il problema, concentrati sui sintomi oggettivi. Evita affermazioni soggettive come "non funziona" o "è lento". Invece, descrivi cosa accade quando esegui azioni specifiche.

Esempio: invece di dire "Il firewall non funziona", potresti dire "Quando cerco di accedere a un sito web, ricevo questo messaggio di errore".

**3. Rispondi alle richieste di informazioni**

Se il team di supporto ti chiede di eseguire test o fornire dettagli aggiuntivi, fallo prontamente e accuratamente. Più informazioni fornisci, più facile è per loro risolvere il problema.

**4. Comunica il risultato della soluzione**

Dopo che il team di supporto offre una soluzione, testala e comunica il risultato. Se ha risolto il problema, fallo sapere. In caso contrario, fornisci informazioni aggiuntive in modo che possano continuare a indagare.

**5. Non riavviare se il problema è bloccante**

Evita di riavviare il sistema se il problema è bloccante. Il riavvio può talvolta peggiorare il problema. Invece, contatta il supporto e lavora con loro per risolverlo.

**6. Più ticket o discussioni per lo stesso problema**

Si consiglia di aprire "n" ticket o discussioni per "n" richieste diverse, anche se correlate allo stesso problema sottostante. Sebbene possa sembrare rigido e sconveniente, questo approccio offre vantaggi significativi:

- **Migliore parallelizzazione del carico di lavoro:** Consente al team di supporto di lavorare su molteplici aspetti del problema contemporaneamente.
- **Risoluzione più veloce da parte di specialisti:** Diverse richieste possono essere assegnate a diversi specialisti con competenze rilevanti, accelerando la risoluzione.
- **Risoluzione dei problemi più efficace:** Focalizza l'attenzione su ciascuna richiesta individuale, evitando confusione e disorientamento.
- **Gestione migliorata delle priorità:** Consente di assegnare diverse priorità a ogni richiesta in base all'urgenza e all'impatto.
- **Comunicazione migliore:** Facilita una comunicazione chiara tra il team di supporto e te, garantendo una discussione dedicata per ogni problema.

## Raccogliere informazioni dall'interfaccia utente {#troubleshooting_ui-section}

Quando sorgono problemi, l'interfaccia utente (UI) visualizza un messaggio di errore che cattura la natura del problema.

Il messaggio di errore fornisce informazioni preziose, presentando i dettagli della richiesta e l'errore riscontrato in formato JSON. Per assistere nella diagnosi e nella risoluzione del problema, gli utenti possono utilizzare il pulsante `Copy command` (Copia comando). Facendo clic su questo pulsante è possibile recuperare il comando che ha causato l'errore. Basta incollare questo comando copiato in una shell per ottenere informazioni più dettagliate.

Quando segnali un errore al team di supporto, è fondamentale fornire le seguenti informazioni essenziali:

1.  **Comando copiato:** Incolla il comando copiato utilizzando il pulsante `Copy command` (Copia comando).
2.  **Output dell'esecuzione:** Per ulteriore assistenza, esegui il comando copiato e segnala l'output.

Se le informazioni fornite non sono sufficienti, in casi estremi, potrebbe essere necessario condividere il contenuto della console JavaScript se l'errore è presente. Segui le istruzioni del tuo browser (solitamente accessibile premendo `F12`), copia l'intero contenuto della console e incollalo per un'analisi più approfondita. La tua collaborazione nel fornire informazioni accurate e dettagliate assicura una risoluzione più efficace e tempestiva di eventuali problemi riscontrati con NethSecurity.
