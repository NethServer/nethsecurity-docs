---
title: "Port forward"
sidebar_position: 1
---

# Port forward {#port_forward-section}

Il firewall impedisce ai richiedenti provenienti da reti pubbliche di accedere a quelle private. Ad esempio, se c'è un server web in funzione all'interno della LAN, solo i computer della rete locale possono accedere a questo servizio. Qualsiasi tentativo effettuato da utenti esterni al di fuori della rete locale viene negato.

Un port forward, noto anche come port redirect o port forwarding, è una tecnica di rete utilizzata nei firewall per reindirizzare il traffico di rete specifico da una combinazione di indirizzo IP e numero di porta a un'altra. Viene generalmente utilizzato per consentire agli utenti esterni di accedere ai servizi o alle applicazioni ospitate su dispositivi all'interno di una rete locale privata.

Per i server web, le porte di ascolto comuni includono la porta 80 (HTTP) e la porta 443 (HTTPS). Quando si crea un port forward, è necessario specificare determinati parametri:

- `Name`: assegnare un nome a una regola di port forward è utile per future consultazioni e gestione. Fornendo un nome descrittivo e significativo, gli amministratori di rete possono facilmente identificare lo scopo e il contesto di ogni port forward.
- `Traffic type`: specifica quale traffico si applica la regola.
  - `Select protocols`: la regola si applica solo ai protocolli selezionati. I protocolli devono essere selezionati nel campo seguente.
  - `All traffic`: la regola si applica a tutto il traffico in ingresso indipendentemente dal protocollo, che viene inoltrato all'indirizzo IP di destinazione configurato senza ulteriori filtri. Quando questa opzione è selezionata, il modulo viene ridotto e deve essere configurato solo l'indirizzo IP di destinazione. Utilizzare questa impostazione con cautela, poiché potrebbe esporre il sistema a traffico indesiderato o potenzialmente dannoso.
- `Protocols`: specifica il protocollo come `TCP`, `UDP`, `UDPLITE`, `ICMP`, `ESP`, `AH`, `SCTP`, `GRE`. È necessario specificare almeno un protocollo.
- `Source port`: la porta da cui proviene la richiesta. Si noti che non tutti i protocolli richiedono una porta. Ad esempio, protocolli come `GRE` non utilizzano porte.
- `Destination address`: specifica l'host interno a cui il traffico deve essere reindirizzato. Questo può essere:
  - un indirizzo IP specifico
  - un oggetto firewall: un host definito da un set di host (ad eccezione di set di host contenenti intervalli di IP o oggetti annidati), una prenotazione DHCP, un record DNS o un account OpenVPN con prenotazione IP
  - il firewall stesso
- `Destination port`: la porta verso cui il traffico è diretto; questo può differire dalla porta di origine.

Per impostazione predefinita, tutti i port forward sono accessibili solo per gli host all'interno della WAN. Fare riferimento a [Hairpin NAT](#hairpin-section) per le istruzioni su come modificare questo comportamento predefinito.

Per ogni port forward l'utente può anche configurare i seguenti aspetti:

- **Binding a un IP pubblico specifico**: i port forward possono essere legati a uno specifico indirizzo IP pubblico utilizzando il campo `WAN IP`. Ciò significa che se il tuo router/firewall ha più indirizzi IP pubblici, puoi assegnare un port forward a un IP particolare. Questa funzione è preziosa quando si tratta di configurazioni di rete complesse, garantendo che il traffico diretto a un IP pubblico specifico sia inoltrato correttamente al server interno.
- **Restrizione dell'accesso**: i port forward possono essere limitati a fonti specifiche per migliorare la sicurezza. Questo può essere fatto utilizzando il campo `Restrict access to`. Il campo accetta indirizzi IP, blocchi CIDR o un oggetto. Tutti gli oggetti sono supportati, ad eccezione dei set di host contenenti intervalli di IP o oggetti annidati.
- **Abilitazione della registrazione**: i port forward possono essere configurati per registrare il traffico in ingresso per ogni regola. Abilitando l'opzione `Log`, l'amministratore di rete può tenere traccia del traffico che passa attraverso il port forward, consentendo il monitoraggio e l'analisi. Per impostazione predefinita, la registrazione è limitata a 1 voce al secondo. Per modificare questo limite, fare riferimento alla sezione [Logging limits](./firewall_rules.md#logging-limits).

## Hairpin NAT {#hairpin-section}

Hairpin NAT, noto anche come NAT loopback o NAT reflection, è una tecnica utilizzata in rete in cui gli host interni accedono a un server situato all'interno della stessa rete locale utilizzando l'indirizzo IP esterno del router o del firewall. In altre parole, quando i dispositivi interni tentano di connettersi a un server utilizzando l'indirizzo IP pubblico, hairpin NAT garantisce che il traffico sia instradato internamente senza uscire da internet e poi rientrare nella rete locale.

Per abilitare hairpin, abilitare l'opzione `Hairpin NAT` e selezionare una o più zone dove il NAT loopback deve essere abilitato.

### Hairpin NAT per zone VPN

Per utilizzare Hairpin NAT con zone VPN come `ipsec`, `openvpn` e `rwopenvpn`, è necessaria una configurazione aggiuntiva. È necessario dichiarare esplicitamente la subnet utilizzata dalla VPN; in caso contrario, Hairpin NAT non funzionerà per i client connessi VPN.

Questa configurazione può essere eseguita tramite la riga di comando. Innanzitutto, identificare il riferimento interno della zona, quindi aggiungere la rete desiderata, eseguire il commit delle modifiche e riavviare il servizio.

Assicurarsi che le subnet siano assegnate alle zone corrette:

- `ipsec`: tunnel IPsec
- `openvpn`: tunnel OpenVPN
- `rwopenvpn`: OpenVPN Road Warrior

Se sono presenti più tunnel o reti, tutti devono essere inclusi nelle rispettive zone.

#### Come dichiarare una subnet per una zona VPN

Per dichiarare la rete OpenVPN Road Warrior, è possibile utilizzare la seguente sequenza di comandi di esempio:

1.  Identificare il riferimento interno per la zona **rwopenvpn**: :

        uci show firewall | grep ".name='rwopenvpn'"

    Output di esempio: :

        firewall.ns_49d9f400.name='rwopenvpn'

2.  Impostare la rete desiderata (in questo caso, **10.88.88.0/24**) per la zona **rwopenvpn**: :

        uci add_list firewall.ns_49d9f400.subnet=10.88.88.0/24

3.  Eseguire il commit delle modifiche e riavviare il servizio firewall: :

        uci commit firewall
        /etc/init.d/firewall restart

Assicurarsi di sostituire la rete **subnet** con quella corretta per la propria configurazione VPN specifica.

4.  Verificare la rete aggiunta: :

        uci show firewall | grep subnet

    Output di esempio: :

        firewall.ns_49d9f400.subnet='10.88.88.0/24'

#### Aggiungere o rimuovere più subnet dalla zona VPN

Se hai già impostato una subnet per una zona VPN e vuoi **aggiungere** un'altra subnet (ad es. 10.33.33.0/24) utilizza il seguente comando (stesso riferimento interno dell'esempio precedente): :

    uci add_list firewall.ns_49d9f400.subnet=10.33.33.0/24

Se hai già impostato più subnet per una zona VPN e vuoi **rimuovere** una subnet (ad es. 10.33.33/24) utilizza il seguente comando (stesso riferimento interno dell'esempio precedente): :

    uci del_list firewall.ns_49d9f400.subnet=10.33.33.0/24

Assicurarsi di eseguire il commit e riavviare il servizio firewall dopo le modifiche.
