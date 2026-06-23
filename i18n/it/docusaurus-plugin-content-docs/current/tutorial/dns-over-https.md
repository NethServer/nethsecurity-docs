---
title: "DNS su HTTPS con filtraggio"
sidebar_position: 6
---

# DNS su HTTPS con filtraggio {#dns_over_http-section}

DNS su HTTPS (DoH) è un protocollo per cifrare le query DNS su HTTPS, migliorando la privacy prevenendo l'intercettazione del traffico DNS. Questa funzionalità ti consente di configurare server DNS upstream che supportano il protocollo DoH. Il pacchetto `https-dns-proxy` fornisce un proxy locale da DNS a HTTPS che inoltra le query DNS a un provider DoH remoto.

Questo documento fornisce istruzioni per configurare server DoH upstream che forniscono filtraggio e sono ubicati nell'UE, ma puoi utilizzare qualsiasi provider DoH che soddisfi le tue esigenze. Questa configurazione si applica solo ai server upstream del firewall: i client continueranno a inviare richieste DNS al firewall in chiaro sulla porta 53.

Un elenco di provider DoH che supportano ubicazioni europee e filtraggio è disponibile sul sito [European Alternatives](https://european-alternatives.eu/category/public-dns).

Alcune alternative popolari includono:

- [DNS4EU](https://joindns4.eu/), servizio DNS basato in Europa con risoluzione protettiva e funzionalità di blocco della pubblicità
- [Quad9](https://dns.quad9.net/dns-query), orientato alla privacy con blocco del malware
- [Mullvad](https://doh.mullvad.net/dns-query), include blocco del malware, blocco della pubblicità e filtraggio di base (Porno, Giochi d'azzardo, ecc.)
- [Cloudflare](https://developers.cloudflare.com/1.1.1.1/setup/), provider DoH veloce e ampiamente utilizzato con blocco del malware (1.1.1.1 for families)

## Installazione

A partire da NethSecurity 8.8, il pacchetto `https-dns-proxy` è incluso nell'immagine NethSecurity, quindi non è richiesto alcun passaggio di installazione separato.

Su NethSecurity 8.7, il pacchetto non è incluso nell'immagine NethSecurity predefinita, quindi dovrai installarlo manualmente:

``` bash
opkg update
opkg install https-dns-proxy
```

## Configurazione

Per impostazione predefinita, il pacchetto include due provider (Cloudflare e Google), ascolta su `127.0.0.1:5053` e `127.0.0.1:5054`, e mantiene `dnsmasq_config_update` impostato su `-` in modo che non modifichi automaticamente la configurazione DNS del firewall.

Per iniziare a utilizzare il proxy, devi:

1.  Rimuovere i provider predefiniti (facoltativo)
2.  Aggiungere la configurazione del provider DoH preferito
3.  Scegliere il valore `dnsmasq_config_update` da utilizzare
4.  Eseguire il commit della configurazione e abilitare il servizio

### Passaggi di configurazione

In questo esempio, configureremo il provider DoH DNS4EU (joindns4.eu).

1.  Rimuovere i provider predefiniti (se desideri utilizzare solo DNS4EU):

    ``` bash
    uci del https-dns-proxy.@https-dns-proxy[1]
    uci del https-dns-proxy.@https-dns-proxy[0]
    ```

2.  Aggiungere il provider DoH DNS4EU:

    ``` bash
    uci set https-dns-proxy.joindns4=https-dns-proxy
    uci set https-dns-proxy.joindns4.resolver_url='https://noads.joindns4.eu/dns-query'
    uci set https-dns-proxy.joindns4.bootstrap_dns='86.54.11.13,86.54.11.213,2a13:1001::86:54:11:13,2a13:1001::86:54:11:213'
    uci set https-dns-proxy.joindns4.listen_addr='127.0.0.1'
    uci set https-dns-proxy.joindns4.listen_port='5053'
    uci commit https-dns-proxy  
    ```

Il parametro `bootstrap_dns` è facoltativo; se non fornito, il sistema utilizzerà i DNS di Google e Cloudflare per il bootstrap.

3.  Abilitare l'integrazione con `dnsmasq` e avviare il servizio:

    ``` bash
    uci set https-dns-proxy.config.dnsmasq_config_update='*'
    uci commit https-dns-proxy
    /etc/init.d/https-dns-proxy enable
    /etc/init.d/https-dns-proxy start
    ```

    Il valore `*` aggiorna tutte le istanze di `dnsmasq`. Se hai bisogno di un'integrazione più specifica, imposta `dnsmasq_config_update` al nome dell'istanza o all'indice che desideri gestire.

#### Verifica

Per verificare che il proxy DoH funzioni correttamente, controlla lo stato del servizio:

``` bash
/etc/init.d/https-dns-proxy status
```

Puoi anche testare la risoluzione DNS:

``` bash
dig google.com @127.0.0.1 -p 5053
```

## Risoluzione dei problemi

### Reindirizzamento DNS

Per impostazione predefinita, tutte le query DNS a qualsiasi server vengono forzate attraverso il proxy DoH locale per garantire che tutto il traffico DNS sia cifrato, ma questo potrebbe causare problemi con alcuni dispositivi o applicazioni.

Se riscontri un errore "Private DNS server cannot be accessed" sul tuo dispositivo Android, puoi risolverlo disabilitando il forzamento DNS nella configurazione di `https-dns-proxy`.

Esegui i seguenti comandi tramite SSH o terminale:

``` bash
uci set https-dns-proxy.config.force_dns='0'
uci commit https-dns-proxy
service https-dns-proxy restart
```

### Aggiornamento immagine

Il pacchetto è incluso nell'immagine, quindi non è necessario reinstallarlo dopo un aggiornamento.

Tuttavia, NethSecurity tratta `dnsmasq_config_update='-'` come lo stato disabilitato. Se quel valore è ancora impostato durante un aggiornamento dell'immagine, lo script predefinito del primo avvio potrebbe disabilitare nuovamente `https-dns-proxy`.

### Blocco di altri provider DoH

Per bloccare le richieste DoH dai client a qualsiasi altro server mentre consenti le richieste provenienti dal firewall, hai 2 opzioni:

1.  Abilitare la categoria "public DoH-Providers" all'interno di Threat Shield IP e mettere in whitelist il server upstream che scegli come provider DoH
2.  Utilizzare DPI (Deep Packet Inspection) per bloccare DoH, che opera solo sul traffico inoltrato, consentendo al firewall di utilizzare DoH mentre blocca i client dall'utilizzarlo direttamente
