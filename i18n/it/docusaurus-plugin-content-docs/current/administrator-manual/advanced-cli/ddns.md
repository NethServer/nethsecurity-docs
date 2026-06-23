---
title: "DNS dinamico"
sidebar_position: 2
---

# DNS dinamico {#ddns-section}

DNS dinamico (DDNS) aggiorna automaticamente il record DNS del vostro nome di dominio con il vostro indirizzo IP attuale, anche se cambia dinamicamente. Questo consente di accedere al vostro firewall da remoto utilizzando un nome di dominio coerente anziché dover ricordare un indirizzo IP potenzialmente mutevole.

## Provider supportati

NethSecurity supporta i seguenti provider DDNS:

- [Cloudflare](https://www.cloudflare.com)
- [DigitalOcean](https://www.digitalocean.com)
- [DNSpod](https://www.dnspod.com)
- [Freedns](https://freedns.afraid.org)
- [Gandi](https://www.gandi.net)
- [GCP (Google Cloud Platform)](https://cloud.google.com)
- [GoDaddy](https://www.godaddy.com)
- [Luadns](https://luadns.com)
- [No-IP](https://www.noip.com)
- [NS1](https://ns1.com)
- [One.com](https://www.one.com)
- [Pdns](https://www.powerdns.com)
- [Route53](https://aws.amazon.com/route53)
- [TransIP](https://www.transip.nl)

Prerequisiti:

- Un firewall NethSecurity con accesso a internet.
- Un account con il vostro provider DDNS scelto.
- Un nome di dominio registrato presso il vostro provider DDNS.

## Passaggi generali di configurazione

1.  Aprire una finestra di terminale sul vostro firewall.

2.  Selezionare il vostro provider DDNS scelto dall'elenco dei provider supportati. Per ottenere l'elenco dei provider supportati, eseguire il seguente comando: :

        ddns service update
        ddns service list-available

3.  Inserire i dettagli di configurazione DDNS, incluse le credenziali del vostro provider nei campi designati. Questi possono includere:

    - Il nome del servizio del provider DDNS, dall'elenco precedente: utilizzare il campo `service_name`.
    - Nome utente o ID client: utilizzare il campo `username`.
    - Password o chiave API: utilizzare il campo `password`.
    - Nome di dominio da associare al vostro indirizzo IP dinamico: utilizzare il campo `domain`, oppure è possibile utilizzare il campo `lookup_host`.
    - Interfaccia da monitorare per i cambiamenti di indirizzo IP (ad es., "wan"): utilizzare il campo `interface`.

Mentre i passaggi generali rimangono coerenti, i dettagli di configurazione specifici possono variare leggermente a seconda del provider scelto. Si consiglia di consultare la documentazione del vostro provider per istruzioni dettagliate e eventuali impostazioni aggiuntive necessarie.

A causa della varietà di provider supportati, incluse le loro interfacce uniche e i metodi di autenticazione, non è possibile fornire passaggi di configurazione specifici per ciascun provider in questa guida.

Se il vostro provider non è elencato, è comunque possibile che riusciate a configurarlo utilizzando una [configurazione personalizzata](#custom-ddns-section).

## Utilizzo della riga di comando UCI

Utilizzare i comandi uci per impostare e commit delle opzioni di configurazione: :

    uci set ddns.myddns.service_name="ddnsprovider.com"
    uci set ddns.myddns.domain="host.yourdomain.net"
    uci set ddns.myddns.username="your_user_name"
    uci set ddns.myddns.password="p@ssw0rd"
    uci set ddns.myddns.interface="wan"
    uci set ddns.myddns.enabled="1"
    uci commit ddns

Ricordarsi di sostituire i segnaposti con i vostri valori.

Quindi, riavviare il servizio DDNS: :

    /etc/init.d/ddns restart

Consultare la [documentazione UCI](https://openwrt.org/docs/guide-user/base-system/ddns) per un elenco completo delle impostazioni supportate.

Note aggiuntive:

- Assicurarsi che il piano del vostro provider DDNS scelto supporti l'accesso API e gli aggiornamenti dinamici.
- Verificare attentamente tutte le credenziali inserite per evitare errori di aggiornamento.
- Considerare l'abilitazione della registrazione per il servizio DDNS per monitorare gli aggiornamenti e risolvere eventuali problemi.
- Alcuni provider possono offrire funzionalità avanzate come wildcard e aggiornamenti di sottodomini. Esplorare queste opzioni in base alle vostre esigenze specifiche.

### Esempio: DigitalOcean (DO)

L'esempio seguente usa il dominio fittizio `firewall.example.net` configurato su NethSecurity. Sostituire il token API DigitalOcean con il proprio.

    uci set ddns.do=service
    uci set ddns.do.service_name='digitalocean.com-v2'
    uci set ddns.do.lookup_host='firewall.example.net'
    uci set ddns.do.domain='example.net'
    uci set ddns.do.username='firewall'
    uci set ddns.do.password='REDACTED_DIGITALOCEAN_API_TOKEN'
    uci set ddns.do.param_opt='21694203'
    uci set ddns.do.enabled='1'
    uci set ddns.do.interface='wan'
    uci set ddns.do.ip_source='network'
    uci set ddns.do.ip_network='wan'
    uci commit ddns
    /etc/init.d/ddns restart

I campi rilevanti di DigitalOcean sono:

- `domain`: il dominio gestito in DigitalOcean
- `username`: l'etichetta hostname da aggiornare
- `password`: il personal access token
- `param_opt`: l'ID del record DNS per quell'hostname

Per elencare i record e trovare l'ID:

    curl -X GET -H 'Content-Type: application/json' \
          -H "Authorization: Bearer TOKEN" \
          "https://api.digitalocean.com/v2/domains/DOMAIN/records"

Sostituire `TOKEN` e `DOMAIN` con i propri valori.

### Esempio: afraid.org (FreeDNS) {#example-afraid.org-freedns}

Configurare un dominio con FreeDNS (afraid.org) utilizzando la riga di comando UCI. Il dominio è denominato "sanchio.crabdance.com" e il nome utente e la password sono "myuser" e "mypass", rispettivamente. :

    uci set ddns.afraid=service
    uci set ddns.afraid.service_name='afraid.org-v2-basic'
    uci set ddns.afraid.lookup_host='sanchio.crabdance.com'
    uci set ddns.afraid.enabled='1'
    uci set ddns.afraid.use_ipv6='0'
    uci set ddns.afraid.domain='sanchio.crabdance.com'
    uci set ddns.afraid.username='myuser'
    uci set ddns.afraid.password='mypass'
    uci set ddns.afraid.ip_source='network'
    uci set ddns.afraid.ip_network='wan'
    uci set ddns.afraid.interface='wan'
    uci set ddns.afraid.use_syslog='1'
    uci set ddns.afraid.check_unit='minutes'
    uci set ddns.afraid.force_unit='minutes'
    uci set ddns.afraid.retry_unit='seconds'
    uci commit ddns
    /etc/init.d/ddns restart

### Esempio personalizzato: dyndns.it (DynDNS) {#custom-ddns-section}

È anche possibile configurare alcuni provider DDNS personalizzati utilizzando la riga di comando UCI. Configurare un dominio con DynDNS utilizzando la riga di comando UCI. Il dominio è denominato "nstest1.freeddns.it" e il nome utente e la password sono "nstest1" e "nstest", rispettivamente. :

    uci set ddns.dyndns_it=service
    uci set ddns.dyndns_it.enabled='1'
    uci set ddns.dyndns_it.lookup_host='nstest1.freeddns.it'
    uci set ddns.dyndns_it.domain='nstest1.freeddns.it'
    uci set ddns.dyndns_it.username='nstest1'
    uci set ddns.dyndns_it.password='nstest'
    uci set ddns.dyndns_it.interface='wan'
    uci set ddns.dyndns_it.ip_source='network'
    uci set ddns.dyndns_it.ip_network='wan'
    uci set ddns.dyndns_it.force_interval='24'
    uci set ddns.dyndns_it.force_unit='hours'
    uci set ddns.dyndns_it.check_interval='10'
    uci set ddns.dyndns_it.check_unit='minutes'
    uci set ddns.dyndns_it.update_url='http://update.dyndns.it/nic/update?hostname=[DOMAIN]&user=[USERNAME]&password=[PASSWORD]'
    uci commit ddns
    /etc/init.d/ddns restart

## DNS diviso (Split DNS)

In alcune configurazioni lo stesso hostname viene pubblicato sia all'interno della LAN che su internet. Se `lookup_host` risolve a un indirizzo privato sul firewall stesso, il client DDNS può continuare a confrontare l'IP WAN pubblico con la risposta interna e riprovare anche quando l'aggiornamento sul provider è già avvenuto.

La soluzione consigliata è configurare DDNS affinché usi un resolver esterno per il lookup invece della risposta split-DNS locale. Ad esempio:

    uci set ddns.do.dns_server='1.1.1.1'
    uci commit ddns
    /etc/init.d/ddns restart

Questo mantiene il DNS diviso per i client LAN mentre il client DDNS valida il record pubblico.

## Utilizzo di Luci

L'interfaccia web [Luci](../installation/remote_access.md#luci-section) offre un modo semplificato per configurare DDNS su NethSecurity. Consultare la [documentazione ufficiale](https://openwrt.org/docs/guide-user/services/ddns/client#web_interface_instructions) per istruzioni dettagliate sull'utilizzo di Luci per configurare DDNS.
