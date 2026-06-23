---
title: "Tunnel IPsec"
sidebar_position: 3
---

# Tunnel IPsec {#ipsec_tunnels-section}

I tunnel IPsec sono un componente cruciale della sicurezza di rete moderna. Questi tunnel forniscono un percorso di comunicazione sicuro e crittografato su Internet o su qualsiasi rete non attendibile, garantendo la riservatezza e l'integrità dei dati in transito.

Il protocollo IPsec (IP Security) è lo standard 'de facto' nei tunnel VPN, viene tipicamente utilizzato per creare tunnel da rete a rete ed è supportato da tutti i produttori. È possibile utilizzare questo protocollo per creare tunnel VPN tra un NethSecurity e un dispositivo di un altro produttore, nonché tunnel VPN tra 2 NethSecurity.

NethSecurity utilizza per impostazione predefinita VPN basate su route, quindi ogni tunnel si basa su un dispositivo tun specifico.

## Configurazione

La configurazione di un tunnel IPsec include 2 peer che chiameremo A e B, che possono essere:

- 1 Nethsecurity e 1 firewall di terze parti
- 2 Nethsecurity

I dispositivi A e B devono essere configurati con parametri che, a seconda della sezione specifica, saranno identici o speculari.

I parametri che devono essere configurati in modo speculare tra i 2 dispositivi sono tipicamente quelli collegati alla rete:

- l'interfaccia WAN utilizzata dal tunnel
- le 2 (o più) reti che vogliamo connettere (rete locale, rete remota)
- gli identificatori locali e remoti (tipicamente gli indirizzi IP pubblici delle WAN dei 2 firewall, ma possono essere utilizzati anche altri)

Pertanto:

- L'indirizzo IP WAN del firewall A deve coincidere con l'indirizzo IP remoto del firewall B
- la rete locale del firewall A deve coincidere con la rete remota del firewall B
- l'ID locale del firewall A deve coincidere con l'ID remoto del firewall B

Tutti gli altri parametri, tuttavia, devono essere identici su entrambi i firewall per consentire una comunicazione corretta (chiave di crittografia, configurazione IKE e ESP, ecc.). NethSecurity utilizza una chiave condivisa come unico metodo per crittografare i dati.

### Come creare un nuovo tunnel IPsec

Fare clic sul pulsante **Aggiungi tunnel IPsec** per configurare un nuovo tunnel. Assegnare un nome a questo tunnel e quindi configurarlo; la configurazione è suddivisa in 3 passaggi. Il primo passaggio contiene solo parametri correlati alla rete, mentre gli altri contengono tutti i parametri rimanenti che devono essere identici su entrambi i firewall per consentire una comunicazione corretta.

Una volta completata la configurazione, un nuovo tunnel verrà visualizzato nella pagina IPsec.

:::note

Se un endpoint è dietro un NAT, consigliamo di impostare i valori per i campi Identificatore locale e Identificatore remoto con nomi univoci personalizzati con sintassi "simile a un'email", ad es. <nsec@site-a> e <otherdevice@site-b>.

:::

#### Gestione di più reti

Un singolo tunnel IPsec può gestire più reti locali e remote. In questo caso, NethSecurity crea sempre più SA figlie per garantire un'ampia compatibilità con i dispositivi remoti. Il comportamento rimane lo stesso per IKEv1 o IKEv2.

Facendo clic sull'icona della lente di ingrandimento nell'elenco dei tunnel IPsec, è possibile visualizzare i dettagli del tunnel, incluso lo stato delle SA figlie e le reti associate a ciascuna SA. Dopo l'aggiunta o la rimozione di una rete, se i tunnel figlio non si aggiornano automaticamente, potrebbe essere necessario riavviare il servizio. Per riavviare il servizio, fare clic sul pulsante `Riavvia` nell'angolo in alto a destra della pagina dei tunnel IPsec.

## Tunnel IPsec in uno scenario MultiWAN

In uno scenario multi-WAN, è fondamentale garantire che l'endpoint remoto di ogni tunnel sia raggiungibile attraverso la stessa interfaccia WAN configurata per il tunnel IPsec.

Per applicare questo comportamento, deve essere creata una route statica in modo che il traffico verso l'IP remoto sia indirizzato attraverso il gateway dell'interfaccia WAN specifica assegnata al tunnel.

Ad esempio, se il tunnel è su WAN1 e l'endpoint remoto è `11.22.33.44`, la route statica specificherebbe che il traffico verso `11.22.33.44` utilizza il gateway WAN1.
