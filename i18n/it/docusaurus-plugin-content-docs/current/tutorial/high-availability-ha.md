---
title: "Alta affidabilità (HA)"
sidebar_position: 8
---
# Alta affidabilità (HA)

NethSecurity 8 include nativamente la funzionalità di **High Availability (HA)** in modalità **attiva/passiva**, progettata per garantire la continuità operativa del firewall tramite due nodi, uno primario e uno secondario.

La soluzione consente di ottenere un'infrastruttura ridondata e affidabile, assicurando che il traffico continui a essere gestito anche in caso di guasti o manutenzioni del nodo principale.

A differenza della versione precedente presente in NethSecurity 7.9, l'installazione e la configurazione possono essere eseguite in autonomia, senza la necessità di inviare le macchine ai laboratori Nethesis.

La documentazione completa è consultabile nel manuale ufficiale: [Alta Affidabilità](../administrator-manual/high-availability/ha_overview_features_limitations.md)

## Limitazioni supporto

Il servizio di alta affidabilità può essere installato, configurato e gestito utilizzando esclusivamente la documentazione disponibile, senza alcun coinvolgimento di Nethesis.

È importante però precisare che **l'alta affidabilità non rientra nel supporto standard dei prodotti Nethesis**.

Per ricevere assistenza su questa funzionalità è necessario acquistare un pacchetto dedicato, che deve essere associato alla propria licenza.

**In assenza di tale pacchetto non è possibile fornire supporto di nessun tipo per richieste legate alla funzionalità di HA.**

Nei prossimi mesi l'HA sarà arricchita con una interfaccia utente per il monitoraggio dello stato e, successivamente, per la configurazione. Anche queste funzionalità saranno accessibili solo a chi avrà acquistato il pacchetto dedicato.

## Acquisto pacchetto HA

Il servizio può essere acquistato tramite lo shop online: [Alta affidabilità – HA](https://nethshop.nethesis.it/product/alta-affidabilita-ha-ns8-2/)

Per informazioni commerciali o chiarimenti è possibile contattare il backoffice all'indirizzo sales@nethesis.it oppure telefonicamente al numero 0721 1791157 (selezione 1 commerciale).

**N.B.** Ricordiamo che **l'acquisto del pacchetto deve essere effettuato prima dell'attivazione e non solo al momento dell'apertura di un ticket**. Questo è necessario per garantire un supporto adeguato nella fase di attivazione e il corretto funzionamento del servizio.

In caso contrario, l'assistenza si riserva di richiedere il pagamento dell'attività di supporto, oltre all'acquisto del servizio.

## Aggiornamento da NethSecurity 7 con HA a NethSecurity 8 con HA

Su NethSecurity 8 il servizio HA è gestito commercialmente in modo differente rispetto a NethSecurity 7: non c'è un canone annuale, ma un costo di attivazione "una tantum".

Nel caso in cui si esegua l'upgrade da NethSecurity 7 con HA a NethSecurity 8 con HA, questi sono i passi da seguire:

- Disdire il servizio HA su NethSecurity 7 in modo da evitare la richiesta di canone l'anno successivo
- Acquistare il pacchetto HA per NethSecurity 8 comunicando la chiave del server Master per registrare l'attivazione

| Caratteristica | NethSecurity 7 | NethSecurity 8 |
|---|---|---|
| **Hardware** | Solo box Nethesis, a partire da S60+ (discontinued) | Solo box Nethesis serie Z attuale (Z1+, Z3+, Z7, Z7S, Z11) — Z5, Z9 e Z9+ supportati anche se non più in catalogo |
| **Installazione** | Gestita da Nethesis in max 15gg dalla consegna delle configurazioni | Configurabile direttamente dal Partner |
| **Possibilità di aggiungere HA successivamente** | ✖ No | ✔ Sì |
| **Canone ricorrente** | ✔ Sì | ✖ No |
| **Costo attivazione** | ✖ No | ✔ Sì, ma minore del canone precedente |

## Box supportati

Nel caso di aggiornamento da NethSecurity 7 con HA a NethSecurity 8 con HA, è previsto il supporto anche per alcuni modelli delle serie precedenti, **limitamente agli apparati già impiegati nella configurazione HA esistente**, in particolare:

- S60+
- S120
- S150
- S200

Per quanto riguarda il costo del canone, l'equivalenza è la seguente:

- il modello S60+ ha un canone equivalente a quello dello Z3+
- i modelli S120, S150 e S200 hanno un canone equivalente a quello degli Z7 e Z11

L'acquisto può essere completato nello shop di Nethesis utilizzando i modelli equivalenti indicati.
