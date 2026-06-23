---
title: "Configurazione e gestione"
sidebar_position: 2
---

# Configurazione e gestione {#ha_setup_and_management-section}

## Requisiti

Prima di configurare HA, assicurati che i seguenti requisiti siano soddisfatti:

- Due firewall con dispositivi di rete identici. Ogni dispositivo deve avere esattamente lo stesso nome e numerazione (ad es., eth0, eth1, eth2, eth3)
- Entrambi i nodi devono essere connessi alla stessa LAN; connetti le interfacce LAN allo stesso dominio di broadcast (solitamente lo stesso switch).
- Indirizzi IP statici per tutte le interfacce LAN che ospiteranno un IP virtuale.

## Configurazione e impostazione

Il processo di configurazione HA prevede diversi passaggi. Se desideri solo visualizzare i comandi, puoi saltare alla sezione [Esempio di configurazione](#configuration-example), ma è consigliato leggere l'intera sezione per comprendere il processo e i requisiti.

Il processo di configurazione è il seguente:

1.  **Installa la stessa versione di NethSecurity** su due macchine identiche (fisiche o virtuali). Vedi [Installazione](../installation/install.mdx) per istruzioni dettagliate sull'installazione.
2.  **Connetti i cavi di rete correttamente** per garantire la ridondanza. Vedi la sezione [Cablaggio di rete](#network-cabling) di seguito per le linee guida sul cablaggio corretto.
3.  **Configura l'interfaccia HA** su entrambi i nodi con indirizzi IP statici. Crea una LAN su nodo primario e secondario che sarà necessaria per il cluster prima di procedere con la configurazione HA. Vedi la sezione [Interfaccia HA](#ha-interface) di seguito per le istruzioni dettagliate.
4.  **Inizializza il cluster** utilizzando i comandi `ns-ha-config` per stabilire la base del cluster HA. Il processo di inizializzazione configura i servizi necessari e prepara entrambi i nodi per la sincronizzazione. Durante la prima configurazione, tutte le interfacce di rete che verranno utilizzate nel cluster HA devono avere il cavo connesso su entrambi i nodi, altrimenti il nodo potrebbe entrare in uno stato di errore e il cluster HA non funzionerà correttamente. Vedi la sezione [Inizializzazione del cluster](#cluster-initialization) di seguito per le istruzioni dettagliate.
5.  **Configura l'interfaccia WAN nel nodo primario** utilizzando la pagina `Interfacce e dispositivi` nell'interfaccia web. Le interfacce WAN verranno configurate automaticamente all'interno del cluster e sincronizzate al nodo secondario. Vedi la sezione [Interfacce WAN](#wan-interfaces) di seguito per ulteriori informazioni.
6.  **Verifica la configurazione** per assicurarti che tutto sia configurato correttamente. Utilizza i comandi `ns-ha-config` per controllare lo stato e la configurazione del cluster HA. Vedi la sezione [Verifica della configurazione](#verify-the-configuration) di seguito per le istruzioni dettagliate.
7.  **Configura interfacce LAN aggiuntive (facoltativo)** per il cluster. Questo passaggio è facoltativo e dipende dalla configurazione di rete. Puoi aggiungere qualsiasi interfaccia LAN aggiuntiva che richieda supporto HA. Vedi la sezione [Interfacce LAN aggiuntive](#additional-lan-interfaces) di seguito per le istruzioni dettagliate. Se devi configurare un hotspot, vedi la sezione [Supporto hotspot](#hotspot-support) di seguito per i requisiti specifici.
8.  **Aggiungi IP virtuali extra (facoltativo)** al nodo primario su interfacce LAN rilevanti. Questo passaggio è facoltativo e consente di aggiungere indirizzi IP aggiuntivi al nodo primario per i servizi che richiedono più IP. Vedi la sezione [IP virtuali extra](#extra-virtual-ips) di seguito per le istruzioni dettagliate.

I passaggi dettagliati per ognuno di questi punti sono trattati nelle sezioni di seguito.

A volte, potrebbe essere necessario rimuovere interfacce o alias dalla configurazione HA. Questo può essere fatto utilizzando il comando `ns-ha-config`. Vedi la sezione [Rimuovi interfacce e IP virtuali](#remove-interfaces-and-virtual-ips) di seguito per le istruzioni dettagliate.

### Cablaggio di rete {#network-cabling}

Il corretto cablaggio di rete è essenziale per garantire l'alta disponibilità e il failover senza interruzioni tra i firewall primario e secondario.

1.  **Raccomandazioni generali**:
    - Per ogni zona di rete (LAN, WAN, DMZ, ecc.), utilizza uno switch dedicato o una VLAN per connettere le interfacce di entrambi i firewall.
    - Evita di connettere i firewall direttamente l'uno all'altro; utilizza sempre uno switch o un segmento di rete intermedio.
    - Etichetta tutti i cavi e gli switch per chiarezza e risoluzione dei problemi più facile.
2.  **Connessioni LAN**:
    - Connetti le interfacce LAN del nodo primario e secondario allo stesso segmento di rete.
    - Idealmente, utilizza **due switch separati** per la ridondanza. Connetti la porta LAN di ogni firewall a entrambi gli switch (se supportato), o almeno assicurati che ogni firewall sia connesso a uno switch diverso. Questo evita un singolo punto di errore se uno switch si guasta.
    - Se utilizzi due switch separati per la ridondanza, devono essere correttamente interconnessi e supportare Spanning Tree Protocol (STP) per prevenire i cicli di rete. Gli switch non gestiti senza supporto STP potrebbero causare broadcast storm quando interconnessi.
    - Se è disponibile un solo switch, utilizza la segmentazione VLAN per separare logicamente ogni zona di rete e ridurre al minimo i domini di broadcast.
    - Ripeti questo processo per **ogni interfaccia di rete** configurata per HA (ad es., LAN, GUEST, DMZ). Ogni interfaccia deve essere connessa al suo segmento di rete corrispondente, preferibilmente tramite switch ridondanti.
3.  **Connessioni WAN**:
    - Connetti le interfacce WAN di entrambi i nodi all'ISP o al router upstream.
    - Per la migliore ridondanza, utilizza lo stesso approccio delle connessioni LAN.
    - Se è disponibile un solo switch/router WAN, entrambi i firewall dovrebbero connettersi ad esso, ma questo introduce un singolo punto di errore.
    - Se il tuo ISP fornisce un router con capacità HA (ad es., VRRP o HSRP), puoi connettere le porte WAN di entrambi i firewall direttamente ai router ridondanti dell'ISP.
    - In alternativa, puoi configurare MultiWAN direttamente in NethSecurity per gestire più uplink WAN e failover.

Questa configurazione assicura che se si guasta un singolo firewall o switch, la connettività di rete viene mantenuta attraverso il nodo secondario e lo switch rimanente.

Il diagramma sottostante illustra la configurazione di rete ridondante consigliata, gli switch sono omessi per chiarezza.

![High Availability network diagram showing proper cabling](/_static/high_availability.png)

### Gestione delle interfacce

Le interfacce possono essere categorizzate come segue:

1.  **Interfaccia HA**:

Questa è l'interfaccia utilizzata per la comunicazione VRRP. Deve essere configurata sul nodo primario e secondario, quindi deve essere aggiunta alla configurazione HA durante l'inizializzazione. Questa interfaccia richiede tre indirizzi IP distinti: uno sul nodo primario, uno sul nodo secondario e un VIP (IP virtuale) che si sposta tra le unità quando i loro ruoli cambiano (Master/Backup). [Interfaccia HA](#ha-interface)

:::note

Questa interfaccia può avere qualsiasi nome, tuttavia, la pratica consigliata è denominare l'interfaccia HA come `lan`. In un ambiente HA, solo l'interfaccia HA può essere denominata `lan`, tutte le altre interfacce devono utilizzare un nome diverso.

:::

2.  **Interfacce LAN aggiuntive**:

Qualsiasi interfaccia che non sia una WAN, come un'altra LAN, una rete guest o una DMZ. Queste sono anche gestite utilizzando la logica a tre indirizzi (IP primario, IP secondario e VIP), devono essere configurate sul nodo primario e secondario, quindi devono essere aggiunte alla configurazione HA dopo l'inizializzazione. Un errore su qualsiasi di queste interfacce attiva un failover tra unità. Sono configurate aggiungendole come interfacce LAN. [Interfacce LAN aggiuntive](#additional-lan-interfaces).

Ricorda che tutte le interfacce aggiuntive devono utilizzare un nome diverso da `lan`.

3.  **Interfacce WAN**:

Queste interfacce sono gestite come casi speciali. I problemi di connettività WAN sono generalmente più probabili rispetto a un guasto fisico di uno switch, cavo o scheda di rete. Attivare un failover HA quando una singola WAN si guasta di solito non fornisce alcun beneficio reale: il firewall secondario sarebbe interessato dallo stesso problema di connettività upstream, mentre il failover stesso potrebbe introdurre interruzioni non necessarie.

Per questo motivo, i guasti WAN non attivano un passaggio dal firewall primario al secondario. La disponibilità WAN dovrebbe essere gestita da MultiWAN, che è progettato per gestire la perdita di connettività, il failover del collegamento e il routing del traffico su più uplink. Questo previene anche i conflitti tra i meccanismi HA e la gestione MultiWAN, specialmente nelle installazioni complesse o di alto valore. Le interfacce WAN devono essere configurate solo sul nodo primario; vengono replicate automaticamente al nodo secondario, ulteriori dettagli sono forniti nella sezione dedicata di seguito.

### Interfaccia HA {#ha-interface}

Il cluster HA richiede indirizzi IP statici per tutte le interfacce LAN che ospiteranno un IP virtuale. Segui questi passaggi:

- Accendi il nodo secondario, accedi all'interfaccia web e imposta un'interfaccia fisica con un indirizzo LAN IP statico (ad es., `192.168.100.239`).
- Accendi il nodo primario, accedi all'interfaccia web e imposta un'interfaccia fisica con un indirizzo LAN IP statico (ad es., `192.168.100.238`).

Questi indirizzi IP statici vengono utilizzati per accedere ai nodi direttamente, anche se il cluster HA è disabilitato. Considerali *indirizzi IP di gestione*.

### Inizializzazione del cluster {#cluster-initialization}

Il processo di configurazione configura `keepalived` per il failover, `rsync` su SSH per la sincronizzazione della configurazione e `conntrackd` per sincronizzare la tabella di tracciamento della connessione. Tutti questi dati passano attraverso l'interfaccia HA, che è quella configurata durante la fase di inizializzazione. Utilizza lo script `ns-ha-config` per semplificare il processo.

Prima di procedere con la configurazione effettiva, è importante assicurarsi che entrambi i nodi siano correttamente configurati e soddisfino i requisiti necessari.

Accedi alla console o SSH nel nodo primario ed esegui i comandi seguenti.

#### Controlla i requisiti

Per il nodo primario:

    ns-ha-config check-primary-node <lan_interface>

Questo controlla:

- L'interfaccia HA esiste e ha un IP statico.
- Se il server DHCP è in esecuzione:
  - L'opzione DHCP `3: router` è impostata (dovrebbe essere l'IP virtuale).
  - L'opzione DHCP `6: DNS server` è impostata.

Per il nodo secondario:

    ns-ha-config check-backup-node <backup_node_ip> <lan_interface>

Questo controlla:

- L'interfaccia HA esiste e ha un IP statico.
- Il nodo secondario è raggiungibile tramite SSH sulla porta 22 con l'utente root.

Lo script richiederà la password di root per il nodo secondario. Puoi anche passare la password: :

    echo "password" | ns-ha-config check-backup-node <backup_node_ip> <lan_interface>

Assicurati che il nodo secondario sia raggiungibile tramite SSH dal nodo primario sulla porta standard 22.

#### Inizializza i nodi

Inizializza il nodo primario:

    ns-ha-config init-primary-node <primary_node_ip> <backup_node_ip> <virtual_ip_cidr> <lan_interface>

Dove `primary_node_ip` è l'IP statico del nodo primario già impostato per l'interfaccia HA, e `backup_node_ip` è l'IP LAN statico del nodo secondario. `virtual_ip` è l'indirizzo IP virtuale per l'interfaccia HA dove tutti gli host LAN dovrebbero puntare, deve essere specificato in notazione CIDR.

Questo script:

- Inizializza `keepalived` con l'IP virtuale per l'interfaccia LAN.
- Configura `conntrackd`.
- Genera una password casuale e una chiave pubblica per la sincronizzazione.
- Configura `dropbear` (server SSH) per ascoltare sulla porta `65022` e consentire solo l'autenticazione basata su chiave per la sincronizzazione.

Inizializza il nodo secondario, esegui sempre il comando nel nodo primario:

    ns-ha-config init-backup-node <lan_interface>

Lo script chiederà la password di root del nodo secondario. Puoi anche passare la password: :

    echo '<password>' | ns-ha-config init-backup-node <lan_interface>

A questo punto, i nodi sono configurati per comunicare tramite LAN e l'IP virtuale LAN avrà il failover.

### Interfacce WAN {#wan-interfaces}

Il sistema non richiede alcuna configurazione speciale per le interfacce WAN. Configura semplicemente le interfacce nella pagina `Interfacce e dispositivi` nel nodo primario e verranno gestite automaticamente dagli script HA.

Gli alias WAN possono essere aggiunti dalla stessa pagina di configurazione di rete e verranno sincronizzati automaticamente al nodo secondario.

Le interfacce WAN sono portate in alto sul nodo primario e mantenute spente sul nodo secondario. Tieni presente che l'interfaccia web nel secondario potrebbe non essere coerente: potrebbe mostrare l'interfaccia come "attiva" anche se è spenta. Questa è una limitazione nota e sarà affrontata in una versione futura.

### Verifica della configurazione {#verify-the-configuration}

Il cluster è ora pronto per essere utilizzato. Puoi controllare lo stato del cluster e verificare che la configurazione sia corretta.

Verifica la configurazione corrente: :

    ns-ha-config show-config

Controlla lo stato del cluster HA. La prima sincronizzazione potrebbe richiedere fino a 5 minuti. :

    ns-ha-config status

Lo stato iniziale potrebbe mostrare `Last Sync Status: SSH Connection Failed`. Dopo la sincronizzazione, dovrebbe mostrare `Last Sync Status: Up to Date`.

### Interfacce LAN aggiuntive {#additional-lan-interfaces}

È possibile aggiungere interfacce LAN aggiuntive al cluster HA dopo la configurazione iniziale. Prima di aggiungere un'interfaccia, assicurati che l'interfaccia sia configurata con un indirizzo IP statico sul nodo primario e sul nodo secondario, molto come l'interfaccia HA configurata durante la configurazione iniziale. Le interfacce possono essere ethernet, bridge, VLAN o bond, ma assicurati che il nodo secondario abbia la stessa interfaccia con lo stesso nome e con la stessa gerarchia di dispositivi (ad es., se l'interfaccia è una VLAN, l'interfaccia padre deve esistere anche sul nodo secondario).

Puoi usare questo comando per aggiungere qualsiasi interfaccia non WAN, come una seconda LAN, DMZ o interfaccia GUEST al cluster HA.

Aggiungi interfacce aggiuntive come necessario:

    ns-ha-config add-lan-interface <primary_node_ip> <backup_node_ip> <virtual_ip_address>

I seguenti controlli vengono eseguiti:

- L'indirizzo IP virtuale deve essere in notazione CIDR (ad es., `192.168.100.1/24`)
- Assicurati che esista un dispositivo con l'indirizzo IP statico specificato sul nodo
- Se il server DHCP è in esecuzione, i seguenti
  - L'opzione DHCP `3: router` è impostata (dovrebbe essere l'IP virtuale).
  - L'opzione DHCP `6: DNS server` è impostata.

Esempio: :

    ns-ha-config add-lan-interface 192.168.200.1 192.168.200.2 192.168.200.253/24

### Supporto hotspot {#hotspot-support}

La funzione hotspot è supportata nei cluster HA, ma ci sono requisiti importanti:

- Deve essere configurata solo su interfacce di rete fisica, le interfacce VLAN non sono supportate.
- Il nodo secondario deve avere esattamente gli stessi dispositivi di rete del nodo primario.
- Per mantenere la funzionalità hotspot durante il failover, l'indirizzo MAC dell'interfaccia che esegue l'hotspot nel nodo primario viene copiato automaticamente all'interfaccia corrispondente nel nodo secondario quando si verifica un cambio. Questo comportamento impedisce l'uso di interfacce VLAN per l'hotspot.

Tieni presente che le sessioni attive sono archiviate nella RAM e verranno perse durante un cambio; i client devono autenticarsi di nuovo a meno che l'accesso automatico non sia abilitato.

### IP virtuali extra {#extra-virtual-ips}

Un IP virtuale (VIP) è un indirizzo IP aggiuntivo assegnato a un'interfaccia di rete che verrà migrato al nodo secondario in caso di failover. Puoi aggiungere IP virtuali al nodo primario su interfacce rilevanti.

Questo è utile per i servizi che richiedono più indirizzi IP sulla stessa interfaccia, come server virtuali o bilanciamento del carico.

Utilizza il comando `ns-ha-config` per registrare l'IP virtuale nella configurazione del cluster HA.

Gli IP virtuali devono essere impostati esplicitamente nel nodo primario. :

    ns-ha-config add-vip <interface> <vip_ip_cidr>

**Nota:** l'IP virtuale apparirà come indirizzo IP extra sull'interfaccia di rete all'interno della pagina `Interfacce e dispositivi` dell'interfaccia web, ma non sarà elencato nella sezione alias.

### Rimuovi interfacce e IP virtuali {#remove-interfaces-and-virtual-ips}

Rimuovi un'interfaccia dalla configurazione HA: :

    ns-ha-config remove-interface <interface>

Esempio: :

    ns-ha-config remove-interface guest

Questo rimuove l'interfaccia da `keepalived`, quindi verrà esclusa dalla configurazione HA. Inoltre, l'indirizzo IP virtuale associato all'interfaccia verrà spostato all'interfaccia di rete del nodo primario.

Rimuovi un IP virtuale dalla configurazione HA: :

    ns-ha-config remove-vip <interface> <vip_ip_cidr>

Esempio: :

    ns-ha-config remove-vip lan2 192.168.122.66/24

### Esempio di configurazione {#configuration-example}

Assumendo:

- IP LAN nodo primario: `192.168.100.238`
- IP LAN nodo secondario: `192.168.100.239`
- IP virtuale LAN: `192.168.100.240/24`
- Nome interfaccia LAN: `lan`
- Password root nodo secondario: `backup_root_password`

Esegui i comandi seguenti sul **nodo primario**:

1.  Controlla i requisiti: :

        # Check requirements first
        ns-ha-config check-primary-node lan
        echo "backup_root_password" | ns-ha-config check-backup-node 192.168.100.239 lan

2.  Configura il cluster: :

        # Initialize primary
        ns-ha-config init-primary-node 192.168.100.238 192.168.100.239 192.168.100.240/24 lan

        # Initialize secondary (run from primary node)
        echo "backup_root_password" | ns-ha-config init-backup-node lan
