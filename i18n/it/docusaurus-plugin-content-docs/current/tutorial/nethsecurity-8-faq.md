---
title: "FAQ"
sidebar_position: 1
---

# FAQ

## 1. Dove trovo informazioni su NethSecurity 8?

Consulta le [note di rilascio](../administrator-manual/about/release_notes.md) per le ultime informazioni su NethSecurity 8.

## 2. Posso usare NethSecurity 8 in produzione?

Certamente! NethSecurity 8 è ormai un prodotto maturo e utilizzabile in produzione.

Se non l'hai usato in precedenza, per evitare problemi o difficoltà segui questo percorso:

- Prima di usare NethSecurity dai tuoi clienti, testalo bene in casa.
- Inizia con un'installazione pulita e solo successivamente prova la migrazione.
- Una volta presa confidenza, usalo dai clienti — parti da nuove installazioni semplici e solo successivamente passa al tool di migrazione.

:::note
La **migrazione** del firewall è **l'ultima** cosa da provare, non la prima.
:::

## 3. Dove posso scaricare NethSecurity 8?

Scaricalo dalla [pagina di download](../administrator-manual/installation/download.mdx).

## 4. Come si installa NethSecurity 8?

Consulta la [guida all'installazione](../administrator-manual/installation/install.mdx) per tutti i dettagli. In breve:

### Installazione su sistemi bare metal (box Nethesis, server)

**a. Scrittura diretta sullo storage da usare in produzione**

- Scrivi l'immagine scaricata **direttamente** sullo storage del tuo box/server (usare solo `dd` da sistemi Linux).
- Lo storage appena scritto sarà immediatamente avviabile e utilizzabile.

**b. Scrittura mediante USB stick**

È possibile scrivere lo storage senza rimuoverlo dall'apparato utilizzando una chiavetta USB, con una procedura simile al factory default dei box con NethSecurity 7:

- Scrivi la chiavetta USB con l'immagine usando `dd` da Linux (i tool per Windows potrebbero modificare la tabella delle partizioni e **non sono supportati**).
- Esegui il boot da USB.
- Esegui il login con le credenziali predefinite: `root` / `Nethesis,1234`.
- Scrivi lo storage dell'apparato con: `ns-install`.
- Al termine della procedura, l'apparato si spegne automaticamente.
- Rimuovi la chiavetta — l'apparato è pronto.

:::note
La chiavetta USB serve solo per la prima installazione, non serve successivamente e nemmeno per il factory reset. Vedi la [domanda 7](#7-come-eseguo-il-factory-reset-su-nethsecurity-8) per le istruzioni sul factory reset.
:::

### Installazione su hypervisor

- Converti l'immagine in un disco virtuale adeguato al tuo hypervisor (va prima decompressa).
- Avvia il sistema.
- Se vuoi salvare i log su un volume dedicato, crea un disco virtuale separato da quello principale e configuralo nella sezione **Storage**.

## 5. Su quali box posso installare NethSecurity 8?

Tutti i box presenti nello [shop Nethesis](https://nethshop.nethesis.it/product-category/nethsecurity/) escono di fabbrica con NethSecurity 8 già installato.

È possibile installare NethSecurity 8 su tutti i box della serie Z e su quelli a 64 bit delle serie precedenti fino al 2018 circa (S20, S30, S40, S60+, S120, S150, S200).

## 6. Le schede di rete a 2.5 Gbps sono supportate?

Sì, le schede di rete a 2.5 Gbps sono supportate su NethSecurity 8.

## 7. Come eseguo il factory reset su NethSecurity 8?

Il factory reset è **sempre possibile senza supporti esterni** — è già gestito nativamente dal sistema (non si fa con la chiavetta USB come in passato).

Il factory reset è disponibile dall'interfaccia (**Sistema** → sezione **Factory reset**) e dal terminale, anche in modalità Failsafe.

Consulta la [guida al factory reset](../administrator-manual/system/reset_recovery.md) per tutti i dettagli.

## 8. Dove configuro la zona Blue e la zona Orange?

Su NethSecurity 8 le zone Blue e Orange non sono presenti di default. Nella sezione **Firewall** è possibile creare zone liberamente e definirne il comportamento. Per facilitare il passaggio dalla versione precedente, sono disponibili due template già pronti per le zone Blue e DMZ.

Consulta [Zone e politiche](../administrator-manual/firewall/zones_and_policies.md) per i dettagli.

## 9. Dove configuro l'hairpin NAT?

Su NethSecurity 8, l'hairpin NAT non è più un'impostazione globale. È ora molto più granulare e si configura sul singolo port forward nelle proprietà avanzate. Al momento della configurazione, bisogna specificare per quali zone dovrà essere abilitato.

Consulta [Port forward](../administrator-manual/firewall/port_forward.md) per i dettagli.

## 10. Come faccio le regole nel QoS?

Su NethSecurity 8 il QoS funziona diversamente da NethSecurity 7. Il sistema individua automaticamente il tipo di traffico (voce, video, altro) e lo assegna alla classe di priorità corretta, assicurando sempre la banda sufficiente per tutti gli utilizzi.

Al momento non sono previste regole personalizzate — lo strumento funziona ottimamente out-of-the-box. Se le regole custom si renderanno necessarie, verranno introdotte in una versione futura.

Consulta [Qualità del servizio (QoS)](../administrator-manual/network/qos.md) per i dettagli.
