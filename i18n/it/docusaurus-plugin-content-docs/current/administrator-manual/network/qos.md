---
title: "Qualità del servizio (QoS)"
sidebar_position: 7
---

# Qualità del servizio (QoS)

NethSecurity QoS fornisce funzionalità di Active Queue Management (AQM) e Flow Queuing (FQ) per garantire che le risorse di rete vengano utilizzate in modo efficiente ed equo.

## Principi operativi

NethSecurity QoS è progettato per fare il miglior uso della larghezza di banda disponibile, senza imporre limiti rigorosi o modellazione del traffico per impostazione predefinita. Opera secondo i seguenti principi:

- *Utilizzo della larghezza di banda*: QoS si impegna a utilizzare la larghezza di banda disponibile al massimo delle sue potenzialità. Per impostazione predefinita, non impone limitazioni rigorose della larghezza di banda sulla rete. Invece, si adatta dinamicamente alle condizioni di rete, assicurando che la larghezza di banda inutilizzata sia utilizzata in modo efficiente.
- *Gestione dei flussi*: QoS gestisce attivamente i flussi di rete per impedire che un singolo client o applicazione monopolizzi la larghezza di banda disponibile. Ciò assicura un accesso equo ed imparziale alle risorse di rete per tutti gli utenti.

## Configurazione

La gestione della larghezza di banda è gestita dinamicamente e automaticamente dal sistema. La configurazione è semplice e prevede la specifica di valori di larghezza di banda di caricamento e scaricamento per ogni interfaccia in QoS.

Sebbene QoS possa essere configurato su qualsiasi interfaccia, in genere funziona in modo ottimale su interfacce di tipo WAN, impostando le velocità di caricamento e scaricamento alle velocità dati della connessione Internet.

Per garantire resilienza contro le fluttuazioni del servizio, è consigliabile mantenere un margine di sicurezza configurando questi parametri al 10% inferiore ai valori misurati

## Configurazione avanzata

QoS si basa su un classificatore basato su eBPF (Extended Berkeley Packet Filter) per impostare i campi DSCP (Differentiated Services Code Point) nei pacchetti. Questa classificazione aiuta a dare priorità e gestire il traffico di rete in modo efficiente. Per massimizzare l'efficienza, QoS opera nello spazio del kernel utilizzando la tecnologia eBPF. Ciò assicura un sovraccarico minimo e un impatto minimo sulle prestazioni del sistema. Oltre alle regole basate su IP e porta, QoS consente di definire regole di traffico in base ai nomi DNS, fornendo un controllo granulare su come il traffico viene classificato e trattato.

Sebbene Qosify funzioni efficacemente senza una configurazione estesa, può essere ulteriormente ottimizzato impostando limiti di larghezza di banda e regole. L'ottimizzazione fine dei parametri QoS può portare a prestazioni di rete ancora migliori.

Le modifiche al comportamento standard, tuttavia, possono essere utili in scenari molto limitati, per i quali, attualmente, è possibile agire solo direttamente tramite la riga di comando.

### Classi di priorità

QoS utilizza quattro classi di priorità, ogni classe può utilizzare una percentuale massima di larghezza di banda definita dalla sua soglia.

- **Bulk (CS1, LE in kernel v5.9+):** Questa classe è progettata per il traffico a bassa priorità, con una soglia del 6,25%.
- **Best Effort (Generale):** Questa classe ha una soglia del 100% ed è utilizzata per il traffico tipico, non prioritario.
- **Video (AF4x, AF3x, CS3, AF2x, CS2, TOS4, TOS1):** Il traffico video rientra in questa classe, con una soglia del 50%.
- **Voice (CS7, CS6, EF, VA, CS5, CS4):** Il traffico vocale riceve la priorità più alta, con una soglia del 25%.

QoS può ridurre temporaneamente la priorità di un flusso se genera una quantità significativa di traffico, che è configurabile. Ad esempio, un flusso potrebbe essere temporaneamente spostato alla priorità "Bulk" se invia un numero elevato di pacchetti in un breve lasso di tempo. QoS può anche dare priorità ai pacchetti piccoli per garantire la trasmissione a bassa latenza dei dati sensibili al tempo.

Oltre alle regole basate su IP e porta, QoS consente di definire regole di traffico in base ai nomi DNS, fornendo un controllo granulare su come il traffico viene classificato e trattato.

Per eseguire l'override della classificazione DSCP, creare un file `/etc/qosify/10-custom.conf` con i mapping: ogni riga ha due campi separati da spazi bianchi, match e dscp.

Match è uno dei seguenti:

- 

  `tcp:<port>[-<endport>]`

  :   Singola porta TCP o intervallo da \<port\> a \<endport\>

- 

  `udp:<port>[-<endport>]`

  :   Singola porta UDP o intervallo da \<port\> a \<endport\>

- 

  `<ipaddr>`

  :   Indirizzo IPv4, ad esempio 1.1.1.1

- 

  `<ipv6addr>`

  :   Indirizzo IPv6, ad esempio ff01::1

- 

  `dns:<pattern>`

  :   Pattern fnmatch() che supporta \* e ? come caratteri jolly

- 

  `dns:/<regex>`

  :   Espressione regolare estesa POSIX.2 per l'abbinamento dei nomi host Funziona solo se le ricerche DNS vengono passate a qosify tramite la chiamata ubus add_dns_host.

- 

  `dns_c:...`

  :   Come dns, ma corrisponde solo alle voci cname

Il dscp può essere un valore grezzo o un codepoint come CS0. Aggiungere un `+` davanti al valore indica a qosify di eseguire l'override del valore DSCP solo se è zero.

Esempio: :

    tcp:80        +voice
    216.58.204.238    video
    dns:nethesis.it   +CS7

## Risoluzione dei problemi

Ispezionare lo stato di qosify con `qosify-status`, cercare pkts nelle 4 classi.
