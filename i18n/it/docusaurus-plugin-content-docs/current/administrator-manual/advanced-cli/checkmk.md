---
title: "Checkmk"
sidebar_position: 11
---

# Checkmk {#checkmk-section}

Checkmk è una piattaforma di monitoraggio utilizzata per supervisionare server, dispositivi di rete e appliance. Il firewall può essere monitorato con [Checkmk](https://checkmk.com/) installando i pacchetti extra NethSecurity descritti in questo capitolo.

## Pacchetti NethSecurity

L'integrazione Checkmk per NethSecurity è divisa in due pacchetti:

- `checkmk-agent` è il pacchetto agent Checkmk standard.
- `ns-checkmk-utils` aggiunge script di monitoraggio specifici di NethSecurity ed è facoltativo.

L'installazione di `ns-checkmk-utils` include anche `checkmk-agent` come dipendenza. Se hai solo bisogno dell'agent upstream, installa solo `checkmk-agent`.

## Installare i pacchetti

Installa l'agent e i controlli NethSecurity facoltativi dalla riga di comando.

Se stai eseguendo NethSecurity 8.8, usa:

    apk update
    apk add ns-checkmk-utils

Se stai eseguendo NethSecurity 8.7.2 o versioni precedenti, usa:

    opkg update
    opkg install ns-checkmk-utils

Dopo l'installazione, il servizio agent è gestito da `/etc/init.d/check_mk_agent` ed è avviato e abilitato al boot per impostazione predefinita.

Usa il seguente comando per controllare lo stato:

    /etc/init.d/check_mk_agent status

Verifica l'output localmente con:

    check_mk_agent

## Limitare l'accesso all'agente

:::warning

L'agente Checkmk espone dati di sistema e di monitoraggio sulla rete. Assicurarsi di proteggere l'accesso alla porta dell'agente, consentendo l'accesso solo a host fidati; in caso contrario, informazioni sensibili potrebbero essere esposte.

:::

L'agente ascolta sulla porta TCP `6556`. Per impostazione predefinita, il traffico dalla LAN è consentito, quindi si raccomanda di limitare l'accesso a questa porta solo agli host fidati.

È possibile gestire le regole del firewall direttamente dall'interfaccia web, vedere [Regole](../firewall/firewall_rules.md), oppure utilizzare l'interfaccia a riga di comando come mostrato di seguito.

Ad esempio, per bloccare l'accesso alla porta dell'agente da qualsiasi origine:

    uci add firewall rule
    uci set firewall.@rule[-1].name='Block-Checkmk'
    uci set firewall.@rule[-1].src='*'
    uci add_list firewall.@rule[-1].proto='tcp'
    uci set firewall.@rule[-1].dest_port='6556'
    uci set firewall.@rule[-1].target='DROP'
    uci commit firewall
    reload_config

Se è necessario il monitoraggio remoto, aggiungere una regola specifica di autorizzazione limitata al server di monitoraggio Checkmk fidato e alla zona, e assicurarsi che sia ordinata prima della regola di blocco sopra, poiché le regole del firewall vengono valutate in ordine e la prima corrispondenza prevale.