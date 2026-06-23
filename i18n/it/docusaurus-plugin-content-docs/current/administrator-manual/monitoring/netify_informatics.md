---
title: "Netify Informatics"
sidebar_position: 2
---

# Netify Informatics {#netify_informatics-section}

[Netify Informatics](https://www.netify.ai/products/netify-informatics) è un servizio cloud di terze parti che utilizza analitiche e intelligenza artificiale per convertire i metadati locali di DPI ottenuti da NethSecurity in intelligence di rete di alto livello. La soluzione fornisce approfondimenti su vari aspetti dell'attività di rete, inclusi:

- [Device Discovery](https://www.netify.ai/products/netify-informatics/device-discovery)
- [Bandwidth Monitoring](https://www.netify.ai/products/netify-informatics/bandwidth-monitoring)
- [Risk and Reputation Analysis](https://www.netify.ai/products/netify-informatics/risk-and-reputation)
- [Regulatory Compliance](https://www.netify.ai/products/netify-informatics/regulatory-compliance)
- Geolocalizzazione
- Audit e Forensics

Il servizio riceve i dati da netifyd, il motore DPI di NethSecurity che è abilitato per impostazione predefinita sul firewall.

Puoi provare il servizio gratuitamente per 7 giorni. Dopo questo periodo, puoi scegliere il piano che meglio si adatta alle tue esigenze.

Consulta [Netify Informatics Pricing](https://www.netify.ai/products/netify-informatics/pricing) e [Netify Informatics FAQ](https://www.netify.ai/resources/faq) per ulteriori informazioni.

## Prima di iniziare

Assicurati di creare un account sul sito web di Netify Informatics, puoi provare il servizio gratuitamente per 7 giorni. Registrati qui: [Netify Registration](https://portal.netify.ai/register)

Puoi gestire in modo granulare diversi clienti, diverse ubicazioni dello stesso cliente e persino diversi firewall all'interno della stessa ubicazione. La piattaforma è organizzata con questi elementi.

- **Organizzazione**: un'organizzazione è essenzialmente un cliente in cui abbiamo almeno un firewall NethSecurity, sono supportate più organizzazioni.
- **Sito**: la stessa organizzazione (cliente) potrebbe avere un ufficio a Roma, Firenze e Parigi. Un sito è definito per ogni ubicazione fisica per isolare i dati, sono supportati più siti.
- **Agente**: l'agente rappresenta l'unità NethSecurity del tuo cliente. Netify supporta più agenti per sito. Se hai una rete semplice, un agente probabilmente vedrà tutti i flussi di traffico sulla rete di un sito.

## Connetti NethSecurity a Netify Informatics

Sono necessari due step per utilizzare il servizio:

1.  Abilita l'invio di metadati da NethSecurity
2.  Provisioning di un agente su Netify Informatics.

:::warning

È obbligatorio configurare l'invio di dati su NethSecurity **per primo** e quindi provisioning dell'agente sulla piattaforma.

:::

### 1. Abilitare l'invio dei metadati {#enable-metadata-sending}

Accedere alla pagina `Netify Informatics` nella sezione `Monitoring` dell'interfaccia web di NethSecurity.

Abilitare l'opzione `Send metadata to Netify Informatics` e fare clic su `Save`.

Ogni NethSecurity è associato a un Agent UUID univoco, qualcosa come `B3-GV-WQ-SD`. Il codice sarà visibile sulla stessa pagina dopo aver abilitato l'opzione di invio dei metadati.

### 2. Effettuare il provisioning dell'agente {#provision-the-agent}

Una volta che avete un account registrato e abilitato l'invio dei metadati su NethSecurity, potete effettuare il provisioning dell'agente sulla piattaforma Netify Informatics:

1.  Copiate il codice ottenuto nel passaggio precedente e accedete al sito web di Netify Informatics.
2.  Accedete al `Provision Agent Wizard` nella sezione `Deployment`.
3.  Seguire le istruzioni per creare l'organizzazione (il cliente) e incollare l'Agent UUID nel campo appropriato per abilitare l'agente utilizzando il codice ottenuto su NethSecurity.

Da questo momento, Netify Informatics inizierà a mostrare i dati. Potete quindi collegare altri firewall dello stesso cliente (stessa organizzazione, stesso sito o uno diverso) o creare una nuova organizzazione per un cliente diverso.

## Deployment Manager

La sezione `Deployment` all'interno di Netify Informatics consente di gestire Agenti, Siti e Organizzazioni. Mentre la gestione degli Agenti e dei Siti è relativamente semplice, la sezione `Organization Access` consente di aggiungere ulteriori membri alla vostra organizzazione. Questa funzionalità consente ad altri di accedere al pannello di Netify e visualizzare tutti i dati rilevanti.

Sono disponibili tre profili:

- Administrator
- Manager
- Viewer

Il profilo `Administrator`, generalmente riservato ai colleghi della vostra azienda, concede il massimo livello di autorizzazioni, consentendo loro di visualizzare, creare e modificare le configurazioni all'interno di Netify Informatics.

Il profilo `Manager` è dedicato a persone che appartengono alla stessa organizzazione (l'azienda cliente). Concede loro il permesso di visualizzare tutte le sezioni all'interno di Netify Informatics, vedere il dashboard di distribuzione e modificare la sezione Identity manager, ma non di aggiungere altre organizzazioni o effettuare il provisioning di nuovi agenti.

Il profilo `Viewer`, probabilmente il più comunemente utilizzato, è per qualcuno (ad esempio, un tecnico IT dell'organizzazione del vostro cliente) che può visualizzare tutti i dati all'interno della propria organizzazione ma non ha la possibilità di modificare alcuna configurazione di Netify.

Per invitare qualcuno, è sufficiente fare clic su `Manage Organization`, inserire il suo indirizzo email e scegliere il profilo desiderato. La persona riceverà un invito da Netify via email e sarà in grado di creare il proprio account.

:::note

Il tipo di profilo può essere modificato in qualsiasi momento da un amministratore, consentendovi di cambiare una persona da Manager a Viewer, ad esempio.

:::
