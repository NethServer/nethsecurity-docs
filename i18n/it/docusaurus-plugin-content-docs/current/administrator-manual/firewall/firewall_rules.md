---
title: "Regole"
sidebar_position: 3
---

# Regole {#firewall_rules-section}

Le regole firewall definiscono come il traffico di rete viene segmentato e controllato tra diverse zone. Il firewall agisce come una barriera tra reti interne affidabili e reti esterne non affidabili, come ad esempio Internet. Queste regole specificano quale traffico è consentito, negato o monitorato in base alle politiche di sicurezza predefinite.

L'ordine delle regole è importante; la prima regola corrispondente viene applicata, determinando il destino del pacchetto di rete.

La pagina è organizzata in tre schede, ciascuna con uno scopo specifico:

- Scheda `Regole di inoltro`: questa scheda è dedicata alla configurazione delle regole per i pacchetti di dati che si muovono tra diverse zone della rete.
- Scheda `Regole di ingresso`: questa scheda è dedicata alla configurazione delle regole per i pacchetti in ingresso destinati al firewall stesso.
- Scheda `Regole di uscita`: questa scheda è dedicata alla configurazione delle regole per i pacchetti emessi dal firewall.

Individuare il pulsante per aggiungere una nuova regola, fare clic su di esso per avviare il processo di creazione della regola. Compilare i seguenti campi per la nuova regola:

- `Stato`: abilitare o disabilitare la regola in base alle vostre esigenze. Per impostazione predefinita, la regola è abilitata durante la creazione.

- `Nome regola`: assegnare un nome descrittivo per identificare la regola.

- `Indirizzo sorgente`: selezionare l'indirizzo sorgente da tre diverse opzioni:

  - inserire uno o più indirizzi/reti IPv4/IPv6 o intervalli di IP
  - selezionare un oggetto firewall da quelli disponibili
  - qualsiasi indirizzo sorgente

  Questo campo non è presente per le `Regole di uscita`, poiché l'indirizzo sorgente è sempre il firewall stesso.

- `Zona sorgente`: specificare la zona sorgente del traffico. Scegliere una zona specifica o selezionare "Qualsiasi" per includere il traffico da qualsiasi zona.

- `Indirizzo destinazione`: selezionare l'indirizzo di destinazione da tre diverse opzioni:

  - inserire uno o più indirizzi/reti IPv4/IPv6 o intervalli di IP
  - selezionare un oggetto firewall da quelli disponibili
  - qualsiasi indirizzo di destinazione

  Questo campo non è presente per le `Regole di ingresso`, poiché l'indirizzo di destinazione è sempre il firewall stesso.

- `Zona destinazione`: specificare la zona di destinazione del traffico. Scegliere una zona specifica. Tenere presente che le zone sorgente e di destinazione non possono essere uguali.

- `Servizio destinazione`: selezionare dall'elenco o scegliere "Personalizzato" per inserire porte specifiche e selezionare protocolli.

- `Azione`: definire l'azione quando vengono soddisfatte le condizioni della regola:

  - `Accetta`: accettare il traffico di rete.
  - `Rifiuta`: bloccare il traffico e notificare l'host mittente.
  - `Scarta`: bloccare il traffico, i pacchetti vengono scartati e nessuna notifica viene inviata all'host mittente.
  - `Non tracciare`: bypassare il tracciamento della connessione per il traffico corrispondente. Questa azione è disponibile solo nelle `Regole di inoltro` e `Regole di ingresso`, richiede una zona sorgente e non è disponibile nelle `Regole di uscita`.

- `Posizione regola`: decidere se aggiungere la regola in fondo o in cima all'elenco delle regole.

- `Registrazione`: indicare se il traffico corrispondente a questa regola deve essere registrato. La voce di log includerà il nome della regola come prefisso. Per impostazione predefinita, la registrazione è limitata a 1 voce al secondo. Consultare la sezione [Limiti di registrazione](#logging-limits) per le istruzioni su come modificare questo limite.

- `Tag`: facoltativamente, aggiungere tag per scopi organizzativi. Nota che il tag "automatico" è riservato all'uso del sistema.

## Limiti di registrazione {#logging-limits}

La registrazione può essere abilitata sui seguenti oggetti:

- zone
- regole firewall
- regole di reindirizzamento (port-forwarding)

Quando la registrazione è abilitata, il firewall aggiungerà limiti di registrazione a varie regole. Ciò garantisce che la registrazione non sovraccarichi il sistema impostando un limite alla velocità di registrazione.

Per impostazione predefinita, vengono applicati i seguenti limiti di registrazione:

- 1 voce di log al secondo per le regole firewall
- 5 voci di log al secondo per le zone
- 1 voce di log al secondo per le regole di reindirizzamento

### Modifica dei limiti di registrazione predefiniti

:::warning

La modifica dei limiti di registrazione predefiniti può influire sulle prestazioni del sistema. Prestare attenzione durante la modifica di questi limiti.

:::

I limiti predefiniti vengono salvati nella sezione `ns_defaults` della configurazione del firewall:

- `zone_log_limit`: il limite predefinito per le zone
- `rule_log_limit`: il limite predefinito per le regole firewall
- `redirect_log_limit`: il limite predefinito per le regole di reindirizzamento

1.  Impostare il limite di log desiderato per le regole firewall utilizzando il comando `uci`:

        uci set firewall.ns_defaults.zone_log_limit="10/s"
        uci commit firewall

2.  Eseguire lo script `firewall-apply-default-logging` per applicare il nuovo limite di log:

        firewall-apply-default-logging
