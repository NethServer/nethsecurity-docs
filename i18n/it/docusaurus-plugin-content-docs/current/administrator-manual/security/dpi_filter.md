---
title: "Filtro Deep Packet Inspection (DPI)"
sidebar_position: 4
---

# Filtro Deep Packet Inspection (DPI) {#dpi_filter-section}

NethSecurity utilizza [Netify Agent](https://www.netify.ai/resources) per impiegare tecniche di Deep Packet Inspection (DPI) per il filtraggio del traffico di rete.

Netify Agent funziona come server di deep-packet inspection, sfruttando nDPI (precedentemente OpenDPI) per identificare protocolli e applicazioni di rete. Le informazioni rilevate possono essere archiviate localmente, accedute tramite socket UNIX o TCP, oppure inviate tramite richieste HTTP POST a un server remoto di terze parti. Dettagli quali metadati di flusso, statistiche di rete e classificazioni di rilevamento possono essere utilizzati per prendere decisioni sul flusso.

Ecco come funziona:

- il plugin di azioni di flusso Netify assegna etichette alle connessioni corrispondenti
- le regole nft possono quindi bloccare o regolare la priorità (DSCP) per le connessioni in base a queste etichette

L'amministratore può creare regole di Deep Packet Inspection (DPI) per ogni interfaccia.

## Configurazione

Per configurare queste regole, l'amministratore avvia il processo selezionando la particolare interfaccia di rete su cui la regola è destinata a operare. Questo passaggio assicura che la regola sia applicata con precisione al segmento di rete designato, consentendo una gestione del traffico di rete mirata ed efficace.

Dopo la selezione dell'interfaccia, all'amministratore viene richiesto di specificare le applicazioni che devono essere bloccate o regolate. Questo passaggio essenziale comporta la scelta da un elenco completo di applicazioni accessibile tramite l'interfaccia del sistema.

L'interfaccia, come funzione predefinita, presenta un catalogo di applicazioni comunemente utilizzate. Tuttavia, fornisce una funzionalità di ricerca avanzata che consente all'amministratore di esplorare e individuare applicazioni specifiche e categorie di applicazioni che richiedono un'attenzione particolare.

### Firme di applicazioni Premium

:::note

Abbonamento richiesto

Questa funzione è disponibile solo se il firewall ha un [abbonamento Community o Enterprise](../system/subscription.md) valido.

:::

In assenza di un abbonamento, il sistema riconosce intrinsecamente una baseline di circa 400 applicazioni. Tuttavia, con un abbonamento attivo, questa capacità si espande significativamente, comprendendo più di 2300 applicazioni. In questo scenario, l'elenco delle applicazioni riconosciute subisce aggiornamenti quotidiani, assicurando che il sistema sia al passo con il panorama delle applicazioni e dei servizi digitali in continua evoluzione.

### Elenco di applicazioni e protocolli

L'elenco completo di tutte le applicazioni e i protocolli supportati dalla versione Enterprise è disponibile qui:

- [Applicazioni](https://www.netify.ai/resources/applications_reference)
- [Protocolli](https://www.netify.ai/resources/protocols)

### Eccezioni

L'esclusione DPI consente l'esclusione di indirizzi di rete specifici, quali il gateway o altre infrastrutture critiche, prevenendo che vengano bloccati.

Per aggiungere una nuova eccezione, fare clic sul pulsante `Aggiungi eccezione`. Immettere l'`indirizzo IP o CIDR` che deve essere esentato dal filtro. È possibile includere una descrizione che spieghi il motivo dell'esclusione.

Ogni eccezione può essere abilitata o disabilitata secondo le necessità.

### Bypass del traffico Netify

Per impostazione predefinita, Netifyd elabora tutto il traffico che passa da, verso e attraverso il firewall. In alcuni casi può essere utile escludere completamente dall'analisi del traffico determinati host o sottoreti. I bypass si configurano usando le opzioni `bypassv4` e `bypassv6`, che accettano un elenco di indirizzi IP o sottoreti CIDR. È possibile aggiungere una descrizione dopo il carattere `|` pipe.

Per aggiungere una nuova voce di bypass:

    uci add_list netifyd.config.bypassv4='10.45.23.0/24|Rete remota'
    uci add_list netifyd.config.bypassv4='192.168.5.164|Host critico'
    uci commit netifyd
    reload_config

Per modificare e gestire le voci di lista UCI, fare riferimento alla sezione [gestione delle liste UCI](../../tutorial/uci.md#uci-lists).

Per visualizzare le voci di bypass applicate e la configurazione di acquisizione di netifyd:

    nft list table inet netifyd
