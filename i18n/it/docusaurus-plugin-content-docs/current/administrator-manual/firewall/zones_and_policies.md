---
title: "Zone e politiche"
sidebar_position: 5
---

# Zone e politiche {#zones-section}

Le zone del firewall categorizzano le interfacce di rete, definendo i confini di fiducia, mentre le regole del firewall dettano come gestire il traffico tra le zone. Le zone organizzano i segmenti di rete e le regole applicano le politiche di sicurezza specificando le condizioni per le azioni consentite o negate. Insieme, consentono la definizione e l'applicazione di regole per il traffico di rete all'interno del firewall.

In un sistema firewall, le zone e le politiche sono concetti fondamentali che aiutano a gestire la sicurezza della rete controllando il flusso del traffico tra diversi segmenti di una rete. Una zona in un firewall rappresenta un segmento di rete specifico con il suo proprio livello di affidabilità. Ad esempio, una configurazione comune potrebbe includere zone come WAN (Wide Area Network) che rappresenta la rete esterna e non affidabile (solitamente Internet) e LAN (Local Area Network) che rappresenta la rete interna e affidabile (dispositivi all'interno di una casa privata o di un'organizzazione). Ogni zona ha il suo proprio set di regole di sicurezza e politiche che dettano come il traffico può fluire verso e da quella zona.

Le politiche in un firewall definiscono le regole e le azioni che determinano come il traffico viene gestito tra diverse zone. Queste regole specificano quale tipo di traffico è consentito, negato o monitorato in base a criteri di sicurezza predefiniti

Zone predefinite:

- **WAN (Wide Area Network):** rappresenta la rete esterna e non affidabile (ad es., Internet).
- **LAN (Local Area Network):** rappresenta la rete interna e affidabile (ad es., dispositivi all'interno di una casa privata o di un'organizzazione).

Traffico consentito:

- **da LAN a WAN:** il traffico dai dispositivi all'interno della zona LAN alla zona WAN è consentito, consentendo ai dispositivi interni di accedere a Internet.
- **da LAN al firewall stesso:** il traffico dai dispositivi LAN al firewall stesso è consentito, facilitando la comunicazione per vari scopi.
- **Da LAN a LAN stesso:** il traffico tra dispositivi all'interno della zona LAN è consentito, consentendo ai dispositivi interni di comunicare tra loro.

Traffico negato:

- **Da WAN al firewall stesso:** il traffico dalla zona WAN al firewall stesso è negato, prevenendo i tentativi di accesso esterno non autorizzato.
- **Da WAN a WAN stesso:** la comunicazione diretta tra reti esterne (WAN a WAN) è negata, isolando diverse entità esterne per una maggiore sicurezza.

In questa configurazione, il firewall regola il traffico tra le zone WAN e LAN, consentendo ai dispositivi interni di accedere a Internet e comunicare internamente mantenendo la sicurezza bloccando l'accesso esterno diretto al firewall e prevenendo la comunicazione tra reti esterne.

Le zone predefinite non possono essere eliminate, ma l'amministratore di rete può modificare le politiche esistenti o creare nuove zone.

La registrazione può essere abilitata per le zone utilizzando l'opzione **Logging** all'interno della pagina `Zones and policies`. Abilitando la registrazione, l'amministratore di rete può monitorare l'attività di rete, identificare potenziali minacce e analizzare i modelli di traffico. La registrazione è limitata a 5 voci al secondo per impostazione predefinita. Per modificare questo limite, fare riferimento alla sezione [Logging limits](./firewall_rules.md#logging-limits).

## Zone guest e DMZ

Oltre alle zone predefinite, il firewall può essere configurato con zone aggiuntive per soddisfare requisiti di rete specifici. Due esempi comuni sono le zone Guest e DMZ (Demilitarized Zone). A volte la zona Guest è anche conosciuta come zona blu mentre la DMZ è anche chiamata arancione.

### Zona Guest (blu)

La zona Guest rappresenta un segmento di rete per dispositivi guest, come visitatori o utenti temporanei. Questa zona è tipicamente isolata dalla zona LAN per prevenire l'accesso non autorizzato alle risorse interne. Ma è consentito accedere alla zona WAN.

Per creare una zona Guest, seguire questi passaggi:

- accedere alla sezione `Zones & policies`
- fare clic sul pulsante `Add zone`
- inserire **guest** nel campo `Name`, in questo caso la zona sarà evidenziata in blu
- lasciare vuoto il campo `Allow forwards to`
- selezionare `LAN` nel campo `Allow forwards from`
- abilitare l'opzione `Traffic to WAN`
- selezionare `Drop` per entrambi i campi `Traffic to firewall` e `Traffic for the same zone`
- fare clic sul pulsante `Save` e applicare le modifiche

:::note

Se il firewall è destinato a fornire servizi `DHCP` e `DNS`, creare una regola di input del firewall che consenta il traffico sulle porte `53 TCP/UDP (DNS)` e sulla porta `67 UDP (DHCP)` per la zona `Guest`. Se questi servizi non sono richiesti o forniti da un altro dispositivo in questa rete, le porte corrispondenti possono rimanere bloccate.

:::

### Zona DMZ (arancione)

La DMZ rappresenta un segmento di rete per server e servizi che devono essere accessibili da Internet ma isolati dalla rete interna.

Per creare una DMZ, seguire questi passaggi:

- accedere alla sezione `Zones & policies`
- fare clic sul pulsante `Add zone`
- inserire **dmz** nel campo `Name`, in questo caso la zona sarà evidenziata in arancione
- lasciare vuoti entrambi i campi `Allow forwards to` e `Allow forwards from`
- abilitare l'opzione `Traffic to WAN`
- selezionare `Drop` per entrambi i campi `Traffic to firewall` e `Traffic for the same zone`
- fare clic sul pulsante `Save` e applicare le modifiche
