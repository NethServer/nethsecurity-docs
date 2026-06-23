---
title: "Server SNMP"
sidebar_position: 5
---

# Server SNMP {#snmp-server-configuration}

Simple Network Management Protocol (SNMP) fornisce un modo standardizzato per monitorare e gestire i dispositivi di rete come il tuo firewall da remoto. Consente agli utenti autorizzati di recuperare informazioni essenziali come lo stato del dispositivo, le metriche di prestazione e le impostazioni di configurazione.

Il server SNMP è **disabilitato per impostazione predefinita** sul tuo firewall, consentendo l'accesso da dentro la tua rete locale (LAN) su tutti gli indirizzi IPv4 e IPv6.

:::note

Se il sistema è stato aggiornato dalla versione 1.4.1 o precedente, il server SNMP sarà **abilitato per impostazione predefinita**. Per disabilitarlo, segui i passaggi nella sezione [Disabilitazione del server SNMP](#snmp-server-disabling).

:::

## Configurazione del server SNMP

È fondamentale configurare le informazioni essenziali che identificano il tuo dispositivo. Ecco come farlo tramite la riga di comando:

1.  Apri una finestra di terminale sul tuo firewall.
2.  Utilizza i seguenti comandi per impostare i valori desiderati per `sysLocation`, `sysContact` e `sysName`:

``` bash
uci set snmpd.general.enabled=1
uci set snmpd.@system[0].sysLocation='<string>'
uci set snmpd.@system[0].sysContact='<string>'
uci set snmpd.@system[0].sysName='<string>'
```

Sostituisci `<string>` con le informazioni rilevanti. Ad esempio:

``` bash
uci set snmpd.general.enabled=1
uci set snmpd.@system[0].sysLocation='MyOffice'
uci set snmpd.@system[0].sysContact='admin@nethsecurity.org'
uci set snmpd.@system[0].sysName='firewall.nethsecurity.org'
```

3.  Dopo aver apportato le modifiche, applicale utilizzando:

``` bash
uci commit snmpd
reload_config
```

La configurazione del server SNMP è memorizzata nel file `/etc/config/snmpd`.

Puoi testare la configurazione utilizzando un client SNMP come `snmpwalk` o `snmpget` da una macchina remota. Ad esempio:

    snmpwalk -v 2c -c public 127.0.0.1

## Disabilitazione del server SNMP {#snmp-server-disabling}

Se non hai bisogno di accesso remoto al server SNMP, puoi disabilitarlo per una maggiore sicurezza. Segui questi passaggi:

1.  Apri una finestra di terminale sul tuo firewall.
2.  Utilizza i seguenti comandi per disabilitare il server:

``` bash
uci set snmpd.general.enabled=0
uci commit snmpd
reload_config
```

**Ricorda:** La disabilitazione del server SNMP potrebbe avere un impatto sui tool di monitoraggio o sulle applicazioni che dipendono da esso.

## Abilitazione dell'accesso remoto

Se hai bisogno di accedere al server SNMP da fuori la tua LAN, crea una regola firewall che consenta il traffico UDP in ingresso sulla porta `161` verso il firewall stesso. Ricorda che l'apertura di questa porta aumenta il rischio, quindi procedi con cautela e assicurati di restringere l'accesso solo da indirizzi IP selezionati.

## Considerazioni di sicurezza

Dai priorità alla sicurezza prima di abilitare l'accesso remoto:

- **Strong Community String:** Sostituisci la stringa di comunità predefinita "public" con una complessa e univoca.
- **Controllo degli accessi:** Implementa liste di controllo degli accessi (ACL) per limitare l'accesso solo agli indirizzi IP autorizzati.
