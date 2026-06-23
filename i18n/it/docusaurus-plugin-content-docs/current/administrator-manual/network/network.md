---
title: "Interfacce di rete"
sidebar_position: 1
---

# Interfacce di rete {#network-section}

La pagina `Interfacce e dispositivi` configura il modo in cui il server è collegato alla rete locale (LAN) e/o ad altre reti (ad es. Internet).

NethSecurity supporta un numero illimitato di interfacce di rete. Qualsiasi rete gestita dal sistema deve seguire queste regole:

- le reti devono essere logicamente separate: ogni rete deve avere indirizzi diversi
- le reti private, come le LAN, devono seguire le convenzioni degli indirizzi dal documento [RFC1918](#RFC1918-section)
- le reti dovrebbero essere fisicamente separate utilizzando switch diversi o logicamente separate utilizzando VLAN (Virtual Local Area Network)

Ogni interfaccia di rete ha una zona specifica che determina il suo comportamento. Una configurazione di rete di base per un router include tipicamente un minimo di due interfacce, ovvero LAN (Local Area Network) e WAN (Wide Area Network):

- *lan*: rete locale, gli host su questa rete possono accedere a qualsiasi altra rete configurata
- *wan*: rete pubblica, gli host su questa rete possono accedere solo al server stesso

Tutte le interfacce di rete configurate sono elencate nella parte superiore della pagina. Ogni interfaccia viene visualizzata con il suo nome e la zona firewall assegnata. Questa sezione offre una panoramica immediata delle configurazioni attuali, consentendo agli utenti di vedere rapidamente quali reti sono già configurate e associate a zone di sicurezza specifiche.

Nella sezione inferiore della pagina sono elencati i dispositivi di rete disponibili ma non configurati. Per configurare un dispositivo, l'utente fa clic sul pulsante **Configura** corrispondente al dispositivo desiderato. I nuovi [dispositivi VLAN](#vlan-section) creati sono visibili in questa sezione.

<a id="RFC1918-section"></a>

**Indirizzi IPv4 per reti private (RFC1918)**

Le reti private TCP/IP non direttamente connesse a Internet devono utilizzare indirizzi speciali selezionati dall'Internet Assigned Numbers Authority (IANA).

| Rete privata | Maschera di rete | Intervallo indirizzi IP                |
|--------------|------------------|----------------------------------------|
| 10.0.0.0     | 255.0.0.0        | 10.0.0.1 - 10.255.255.254              |
| 172.16.0.0   | 255.240.0.0      | 172.16.0.1 - 172.31.255.254            |
| 192.168.0.0  | 255.255.0.0      | 192.168.0.1 - 192.168.255.254          |

## Interfacce logiche {#logical_interfaces-section}

Le interfacce di rete logiche sono interfacce di rete virtuali che consentono una maggiore flessibilità e funzionalità nelle configurazioni di rete. A differenza delle interfacce di rete fisiche, che corrispondono a porte hardware effettive, le interfacce di rete logiche sono basate su software e possono essere configurate e gestite per soddisfare requisiti di rete specifici.

Fai clic sul pulsante **Aggiungi interfaccia logica** per creare un nuovo dispositivo di rete virtuale. Il dispositivo può essere un

- *bridge*: è un'interfaccia di rete logica che collega due o più segmenti di rete diversi, consentendo la comunicazione tra i dispositivi in questi segmenti. Un bridge estende efficacemente la rete locale, consentendo ai dispositivi di comunicare come se fossero sulla stessa rete fisica.
- *bond*: anche noto come network bonding o NIC bonding, è un metodo per combinare due o più interfacce di rete fisica in un'unica interfaccia logica. Fornisce due vantaggi principali: maggiore larghezza di banda e tolleranza ai guasti.

I bond possono essere configurati in più modalità.

Modalità che forniscono bilanciamento del carico e tolleranza ai guasti:

- Balance Round Robin (consigliato)
- Balance XOR
- 802.3ad (LACP): richiede supporto a livello di driver e uno switch con modalità IEEE 802.3ad Dynamic link aggregation abilitata
- Balance TLB: richiede supporto a livello di driver
- Balance ALB

Modalità che forniscono solo tolleranza ai guasti:

- Active backup (consigliato)
- Broadcast policy

Durante la creazione di un bond, l'interfaccia utente visualizzerà un indirizzo IP di gestione nella rete privata 127.x.x.1/32. Questo indirizzo IP viene utilizzato esclusivamente per la gestione del bond e non è coinvolto nell'inoltro del traffico. Una volta creato il dispositivo bond, è possibile assegnargli un indirizzo IP e una zona firewall. Tieni presente che la configurazione del bond non è modificabile dopo la creazione. Se è necessario modificare l'indirizzo IP o la zona del bond, dovrai rimuovere la sua configurazione e riconfigurarlo di nuovo. Se è necessario modificare i dispositivi bond, la modalità bond o l'IP di gestione, dovrai rimuovere la configurazione del bond e il dispositivo bond e ricrearlo da zero

## VLAN {#vlan-section}

Una VLAN, o Virtual Local Area Network, è una tecnologia di rete che consente agli amministratori di rete di creare reti logicamente segmentate all'interno di un'infrastruttura di rete fisica. Le VLAN consentono la creazione di più domini di broadcast in una rete, anche se sono fisicamente connessi allo stesso switch di rete.

È possibile creare un nuovo dispositivo VLAN facendo clic sul pulsante **Crea dispositivo VLAN**. Selezionare il tipo di dispositivo VLAN:

- VLAN 802.1q viene utilizzato principalmente per implementazioni VLAN standard all'interno delle organizzazioni
- 802.1ad (QinQ) viene utilizzato nelle reti dei provider di servizi in cui più clienti richiedono segmentazione VLAN e queste VLAN segmentate devono essere trasportate attraverso la rete del provider

Assicurati di scegliere anche l'ID VLAN corretto. Tieni presente che devi configurare lo stesso ID VLAN all'interno dello switch di rete.

## IP aliasing {#IP_aliasing-section}

Utilizza IP aliasing per assegnare più indirizzi IP alla stessa interfaccia di rete.

L'uso più comune è con un'interfaccia wan: quando l'ISP fornisce un pool di indirizzi IP pubblici (all'interno della stessa subnet), è possibile aggiungere alcuni (o tutti) di essi alla stessa interfaccia wan e gestirli individualmente (ad es. nella configurazione del port forward).

Per aggiungere un alias, fai clic sul menu a tre punti **⋮** nell'angolo destro dell'interfaccia di rete esistente, quindi seleziona l'elemento **Crea interfaccia alias**.

## PPPoE

PPPoE (Point-to-Point Protocol over Ethernet) connette il server a Internet attraverso un modem DSL. Gli utenti possono configurare una nuova connessione PPPoE utilizzando un'interfaccia di rete Ethernet non assegnata o creando una nuova interfaccia logica.

Nella finestra dell'interfaccia di rete, scegli la zona wan, quindi seleziona il protocollo `PPPoE`. Quindi compila tutti i campi obbligatori come `Username` e `Password`.

### PPPoE con DHCPv6-PD

DHCPv6 Prefix Delegation (DHCPv6-DP) automatizza l'assegnazione dei prefissi IPv6 dal tuo provider di servizi Internet (ISP). Elimina la necessità di configurazione manuale o Network Address Translation (NAT), semplificando la distribuzione di IPv6.

Prima, assicurati che il tuo ISP supporti DHCPv6-PD, quindi segui questi passaggi:

- Configura interfaccia WAN: imposta la modalità dell'interfaccia WAN su PPPoE e abilita l'opzione `Abilita IPv6`
- Configura interfaccia LAN: abilita l'opzione \"Abilita IPv6\" e lascia il campo dell'indirizzo IPv6 vuoto

Abilitando IPv6 per entrambe le interfacce WAN e LAN senza specificare un indirizzo per la LAN, il tuo router richiederà e riceverà automaticamente un prefisso IPv6 (solitamente un /64) dal tuo ISP tramite DHCPv6-PD. Questo prefisso verrà quindi utilizzato per assegnare indirizzi IPv6 individuali ai dispositivi sulla tua rete.

## Adattatori USB-to-Ethernet

Gli adattatori USB-to-Ethernet non sono considerati idonei per l'uso in un dispositivo firewall critico per la comunicazione di rete, per questo motivo i driver non sono inclusi nell'immagine NethSecurity. Solo per scopi sperimentali, i driver specifici possono essere installati tramite il gestore dei pacchetti per l'uso in un ambiente di test.

È fortemente consigliato **non utilizzare questi adattatori in ambienti di produzione**. Se l'unità dispone di una sottoscrizione Enterprise o Community, tieni presente che gli adattatori USB-to-Ethernet **non sono coperti dal supporto Nethesis**.

:::warning

I pacchetti extra, inclusi i moduli del kernel, non vengono preservati tra gli aggiornamenti dell'immagine, quindi in caso di aggiornamento, sarà necessario scaricarli e installarli di nuovo se necessario.

:::

### Come installare i moduli USB-to-Ethernet

Questi pacchetti possono essere installati dalla console della riga di comando, basta trovare il modulo corretto e installarlo.

- Verifica che l'adattatore ethernet sia collegato a USB usando `lsusb`. Esempio di output:

      # lsusb
      Bus 002 Device 002: ID 0bda:8153 Realtek USB 10/100/1000 LAN
      Bus 002 Device 001: ID 1d6b:0003 Linux 5.15.162 xhci-hcd xHCI Host Controller
      Bus 001 Device 002: ID 0627:0001 QEMU QEMU USB Tablet
      Bus 001 Device 001: ID 1d6b:0002 Linux 5.15.162 xhci-hcd xHCI Host Controller

- Cerca il modulo del kernel:

  Se stai eseguendo NethSecurity 8.8, utilizza:

      apk update
      apk search kmod-usb-net-*

  Se stai eseguendo NethSecurity 8.7.2 o versioni precedenti, utilizza:

      opkg update
      opkg find kmod-usb-net-*

- Esempio di output:

      kmod-usb-net-aqc111 - 5.15.162-1 - Support for USB-to-Ethernet Aquantia AQtion 5/2.5GbE
      kmod-usb-net-asix-ax88179 - 5.15.162-1 - Kernel module for USB-to-Ethernet ASIX AX88179 based USB 3.0/2.0 to Gigabit Ethernet adapters.
      kmod-usb-net-cdc-ether - 5.15.162-1 - Kernel support for USB CDC Ethernet devices
      kmod-usb-net-cdc-ncm - 5.15.162-1 - Kernel support for CDC NCM connections
      kmod-usb-net-dm9601-ether - 5.15.162-1 - Kernel support for USB DM9601 devices
      kmod-usb-net-lan78xx - 5.15.162-1 - Kernel module for Microchip LAN78XX based USB 2 & USB 3 10/100/1000 Ethernet adapters.
      kmod-usb-net-mcs7830 - 5.15.162-1 - Kernel module for USB-to-Ethernet MCS7830 convertors
      kmod-usb-net-pegasus - 5.15.162-1 - Kernel module for USB-to-Ethernet Pegasus convertors
      kmod-usb-net-rtl8150 - 5.15.162-1 - Kernel module for USB-to-Ethernet Realtek 8150 convertors  
      kmod-usb-net-rtl8152 - 5.15.162-1 - Kernel module for USB-to-Ethernet Realtek 8152 USB2.0/3.0 convertors
      kmod-usb-net-smsc95xx - 5.15.162-1 - Kernel module for SMSC LAN95XX based devices
      kmod-usb-net-sr9700 - 5.15.162-1 - Kernel module for CoreChip-sz SR9700 based USB 1.1 10/100 ethernet devices

- Installa il driver corretto:

  Se stai eseguendo NethSecurity 8.8, utilizza:

      apk add kmod-usb-net-rtl8150

  Se stai eseguendo NethSecurity 8.7.2 o versioni precedenti, utilizza:

      opkg install kmod-usb-net-rtl8150

- Verifica che appaia una nuova interfaccia ethX usando `ifconfig -a`

- Configura ethernet dall'interfaccia utente
