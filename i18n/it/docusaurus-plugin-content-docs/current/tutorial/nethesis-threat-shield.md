---
title: "Nethesis Threat Shield"
sidebar_position: 13
---
# Nethesis Threat Shield

Questo modulo consente di gestire blacklist (open o commerciali) **bloccando tutto il traffico da/verso specifiche destinazioni malevole**, contribuendo a migliorare sensibilmente la sicurezza della rete.
**Threat Shield**è attivabile su NethSecurity 8 o su qualsiasi NethServer Enterprise 7.9, sia esso NethService, NethVoice o NethSecurity.

- Se attivato su **NethService/NethVoice**, Threat Shield proteggerà lo specifico server (quindi è usabile anche in ambiti cloud in assenza di firewall perimetrale)
- Se attivato su **NethSecurity** (7.9 o 8), proteggerà tutta la rete

Threat shield lavora tramite delle blacklist che possono essere di 2 tipi (abilitabili singolarmente):

- Blacklist IP
- Blacklist DNS

**Blacklist IP**
Threat Shield blocca tutte le connessioni originate o destinate a specifici indirizzi IP contenuti nelle blacklist.
Questo tipo di blacklist è di gran lunga la più efficace nel contrastare il traffico da e verso host malevoli.

**Blacklist DNS**
Tutte le richieste DNS che fanno i client vengono intercettate da NethSecurity e valutate tramite le blacklist, vengono bloccate tutte le connessioni destinate ai domini presenti in blacklist.

## **Sorgenti blacklist YOROI**
L’efficacia del modulo Threat Shield è direttamente legata alla qualità delle blacklist, per questo Nethesis ne consiglia l’uso con le blacklist fornite da YOROI, tipicamente disponibili**solo**in ambiti enterprise e a disposizione dei partner Nethesis in abbonamento.

Le blacklist YOROI sono caratterizzate da:
- Elevata qualità delle liste ricavate da fonti eterogenee e soggette a continue analisi di specialisti
- Efficacia massima su campagne malware indirizzate verso la zona geografica Italia/Europa
- Livello di confidenza molto elevato -> bassissima percentuale di falsi positivi

I livelli di confidenza di queste liste vanno da 1 a 3 ed esprimono la probabilità di falsi positivi (blocchi indesiderati)
- Livello 1 (10/10): probabilità di falsi positivi estremamente bassa
- Livello 2 (8/10): probabilità di falsi positivi bassa
- Livello 3 (6/10): probabilità di falsi positivi normale

N.B. Nel pacchetto di Blacklist YOROI sono comprese anche le Blacklist Nethesis Level 3, che si sono dimostrate molto efficaci.

## **Blacklist YOROI e numero di device da proteggere**
Per utilizzare le Blacklist YOROI è necessario acquistare una licenza nel sito[NethShop](https://nethshop.nethesis.it/), una per ogni server che utilizza le blacklist Yoroi.
Il costo della licenza è rapportato al numero di device protetti e la durata della licenza è annuale.

Una volta acquistata la licenza sarà necessario comunicare il System ID del server in cui attivare le blacklist, questa operazione può essere svolta in una di queste 3 modalità:
- aggiungendo il SystemID nelle note dell'ordine
- rispondendo all'email che si riceverà dopo aver completato l'acquisto
- inviando direttamente una email a sales@nethesis.it

A quel punto il server sarà abilitato al download delle blacklist YOROI.

Il numero di device è valutato sul numero effettivo di device connessi alla rete, dato che questo tipo di protezione viene applicato su tutti, a prescindere dal loro utilizzo più o meno intensivo.
Se una rete (ad esempio una rete di laboratorio BLUE) viene bypassata dal filtraggio di threat shield con apposite eccezioni, allora può essere ignorata dal conteggio.

## Come abilitare le blacklist YOROI su **NethSecurity**
Una volta acquistata la licenza, le blacklist di Yoroi appariranno tra quelle disponibili su **NethSecurity** e potranno essere abilitate, questo vale sia per la sezione IP che per quella DNS.

Configurare Threat Shield per scaricare le blacklist da questo URL:

```
https://bl.nethesis.it/git/nethesis-blacklists
```
