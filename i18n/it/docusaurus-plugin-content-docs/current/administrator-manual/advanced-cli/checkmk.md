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

## Consentire il monitoraggio remoto

L'agent è in ascolto sulla porta TCP `6556`. Per impostazione predefinita, il traffico dalla LAN è consentito, ma se hai una configurazione del firewall più restrittiva, potrebbe essere necessario consentire l'accesso a questa porta dal server di monitoraggio Checkmk.

Puoi aggiungere una regola del firewall per consentire l'accesso direttamente dall'interfaccia utente web, vedi [Rules](../firewall/firewall_rules.md), oppure utilizzare l'interfaccia della riga di comando per aggiungere una regola.

Ad esempio, per consentire l'accesso da un host di monitoraggio nella LAN:

    uci add firewall rule
    uci set firewall.@rule[-1].name='Allow-Checkmk'
    uci set firewall.@rule[-1].src='lan'
    uci set firewall.@rule[-1].proto='tcp'
    uci set firewall.@rule[-1].dest_port='6556'
    uci set firewall.@rule[-1].target='ACCEPT'
    uci commit firewall
    /etc/init.d/firewall restart

Tieni presente che se il server di monitoraggio si trova in una zona diversa, dovrai modificare la zona di origine e l'indirizzo di conseguenza.

Quando la regola è in vigore, il server di monitoraggio può connettersi al firewall e leggere l'output dell'agent, inclusi i controlli NethSecurity facoltativi.
