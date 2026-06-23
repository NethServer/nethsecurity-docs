---
title: "Connessioni"
sidebar_position: 4
---

# Connessioni {#connections-section}

Il connection tracking (Conntrack) è una funzionalità di rete utilizzata nei firewall e nei router per monitorare e gestire lo stato delle connessioni di rete attive. Traccia lo stato di ogni connessione, come nuovo, stabilito, correlato o scaduto, e mantiene queste informazioni in una tabella di tracciamento delle connessioni. Ciò consente un'ispezione dei pacchetti con stato, in cui i pacchetti vengono ispezionati in base al loro contesto di connessione, consentendo regole di filtraggio più precise e sicure. Conntrack supporta anche Network Address Translation (NAT) tracciando i mapping degli indirizzi IP da interni a esterni e ottimizza le prestazioni eliminando rapidamente i pacchetti da connessioni non valide o scadute.

Le connessioni possono essere filtrate da:

- `Protocollo`
- `Stato`
- `IP`
- `Porta`

L'elenco delle connessioni non viene aggiornato in tempo reale. Per elencare le nuove connessioni, fare clic sul pulsante **Aggiorna pagina**.

L'amministratore può eliminare una singola connessione o svuotare l'intera tabella di tracciamento delle connessioni utilizzando il pulsante **Elimina tutte le connessioni**.

## Buone pratiche per terminare le sessioni

Quando terminare una connessione:

- la connessione è scaduta o è stata inattiva per un periodo prolungato
- vi sono prove di attività dannosa associata alla sessione
- la connessione sembra obsoleta o bloccata, impedendo nuove connessioni
- la terminazione è necessaria per la risoluzione dei problemi di rete o la diagnostica

Quando evitare di terminare una sessione:

- la connessione è attiva e sembra funzionare normalmente
- la connessione è critica per le operazioni dell'applicazione in corso
- eventuali problemi con la connessione sembrano essere temporanei e potrebbero risolversi da soli

In una configurazione MultiWAN, il traffico specifico come i trunk VoIP viene instradato e NATato attraverso interfacce designate a provider distinti. Quando un'interfaccia o una route diventa non disponibile, è essenziale eliminare tutte le connessioni che utilizzano tale interfaccia e reindirizzare il traffico successivo attraverso la connessione funzionante, altrimenti il trunk non sarà in grado di registrarsi al provider.

Per risolvere questo problema, puoi rimuovere le voci conntrack specifiche associate all'indirizzo esterno precedente tramite l'interfaccia utente.
