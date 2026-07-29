---
title: "Softflowd"
sidebar_position: 6
---

# Softflowd {#softflowd-section}

[softflowd](https://github.com/irino/softflowd) è un'implementazione software di un monitor di traffico di rete basato su flussi. Ascolta in modalità promiscua su un'interfaccia di rete, traccia i flussi di traffico attivi (comunicazione tra due tuple indirizzo IP/porta) ed esporta i dati come datagrammi NetFlow o IPFIX verso un collettore remoto.

I casi d'uso comuni includono:

- **Analisi del traffico di rete**: identificare i principali utilizzatori, i protocolli e i consumatori di larghezza di banda.
- **Monitoraggio della larghezza di banda**: inviare i dati di flusso a collettori come ntopng, nfsen o Grafana.
- **Audit di sicurezza**: rilevare modelli di traffico anomali e potenziali intrusioni.
- **Pianificazione della capacità**: comprendere le tendenze del traffico a lungo termine nella rete.

softflowd supporta le versioni NetFlow 1, 5 e 9, nonché IPFIX (versione 10), ed è completamente compatibile con IPv6 quando si utilizza NetFlow v9 o IPFIX.

:::note

softflowd **non è installato di default** su NethSecurity. È necessario installarlo manualmente prima di configurarlo.

:::

## Installazione

Connettiti al firewall tramite SSH e installa il pacchetto. softflowd è disponibile a partire da NethSecurity 8.8.0:

    apk update
    apk add softflowd

## Configurazione

La configurazione è memorizzata in `/etc/config/softflowd`. Tutte le impostazioni sono gestite tramite UCI.

1. **Abilita softflowd** e imposta l'**interfaccia** di rete da monitorare (sostituisci `br-lan` con l'interfaccia rilevante per la tua configurazione — usa `ip link show` per elencare le interfacce disponibili):

       uci set softflowd.@softflowd[0].enabled='1'
       uci set softflowd.@softflowd[0].interface='br-lan'

2. **Imposta la destinazione del collettore** utilizzando il formato `host:port`. Questo è l'indirizzo e la porta UDP del tuo collettore NetFlow/IPFIX:

       uci set softflowd.@softflowd[0].host_port='192.168.1.100:2055'

3. **Scegli la versione del protocollo di esportazione**. Il valore predefinito è `5` (NetFlow v5). Usa `9` (NetFlow v9) o `10` (IPFIX) se hai bisogno di esportare flussi IPv6 o della modalità bidirezionale:

       uci set softflowd.@softflowd[0].export_version='9'

4. **Imposta il livello di tracciamento** per controllare la granularità dei record di flusso:

       uci set softflowd.@softflowd[0].tracking_level='full'

5. **Opzionale**: abilita il tracciamento dei flussi IPv6 (efficace solo con NetFlow v9 o IPFIX):

       uci set softflowd.@softflowd[0].track_ipv6='1'

6. **Conferma e avvia il servizio**:

       uci commit softflowd
       reload_config
       /etc/init.d/softflowd enable
       /etc/init.d/softflowd start

**Esempio completo** — esportazione di dati NetFlow v9 a un collettore su `192.168.1.100:2055`, monitorando l'interfaccia bridge LAN con dettagli completi sui flussi e supporto IPv6:

    uci set softflowd.@softflowd[0].enabled='1'
    uci set softflowd.@softflowd[0].interface='br-lan'
    uci set softflowd.@softflowd[0].host_port='192.168.1.100:2055'
    uci set softflowd.@softflowd[0].export_version='9'
    uci set softflowd.@softflowd[0].tracking_level='full'
    uci set softflowd.@softflowd[0].track_ipv6='1'
    uci set softflowd.@softflowd[0].max_flows='8192'
    uci set softflowd.@softflowd[0].sampling_rate='100'
    uci commit softflowd
    reload_config
    /etc/init.d/softflowd enable
    /etc/init.d/softflowd start

## Opzioni di configurazione

La tabella seguente descrive tutte le opzioni UCI disponibili per softflowd.

| Opzione | Tipo | Predefinito | Descrizione |
|---|---|---|---|
| `enabled` | boolean | `0` | Abilita (`1`) o disabilita (`0`) il servizio softflowd. |
| `interface` | string | `br-lan` | Interfaccia di rete su cui ascoltare (es. `br-lan`, `eth0`, `pppoe-wan`). |
| `host_port` | string | *(vuoto)* | Destinazione per l'esportazione dei flussi in formato `host:port` (es. `192.168.1.100:2055`). È possibile specificare più destinazioni utilizzando le virgole. Se vuoto, softflowd funziona in modalità solo statistiche senza esportare dati. |
| `export_version` | integer | `5` | Versione del protocollo di esportazione NetFlow. Valori supportati: `1`, `5`, `9`, `10` (IPFIX). Usa `9` o `10` per il supporto IPv6 e record più dettagliati. |
| `tracking_level` | string | `full` | Granularità degli elementi del flusso. Opzioni: `full` (indirizzo sorgente/destinazione, porta e protocollo), `proto` (indirizzo sorgente/destinazione e protocollo), `ip` (solo indirizzo sorgente/destinazione), `vlan` (full + ID VLAN), `ether` (full + ID VLAN e indirizzi MAC). |
| `max_flows` | integer | `8192` | Numero massimo di flussi da tracciare contemporaneamente. Quando superato, i flussi inattivi più vecchi vengono scaduti ed esportati forzatamente. |
| `sampling_rate` | integer | `100` | Denominatore del tasso di campionamento periodico. Un valore di `100` significa che 1 pacchetto su 100 viene campionato. Imposta a `1` per nessun campionamento (cattura ogni pacchetto). |
| `track_ipv6` | boolean | `0` | Forza il tracciamento dei flussi IPv6. Significativo solo con `export_version` impostato a `9` o `10`. |
| `bidirectional` | boolean | `0` | Abilita la modalità di flusso bidirezionale. Funziona solo con IPFIX (`export_version='10'`). |
| `timeout` | string | *(vuoto)* | Sovrascrive i timeout di scadenza dei flussi. Formato: `name=time` (es. `udp=1m30s`). Nomi di timeout validi: `general`, `tcp`, `tcp.rst`, `tcp.fin`, `udp`, `maxlife`, `expint`. |
| `filter` | string | *(vuoto)* | Espressione BPF per escludere traffico specifico dal tracciamento (es. `not port 22` per ignorare il traffico SSH). |
| `hoplimit` | integer | *(vuoto)* | TTL IPv4 o hop limit IPv6 per i datagrammi esportati. Utile quando si esporta a gruppi multicast. |
| `pid_file` | string | `/var/run/softflowd.pid` | Percorso del file PID utilizzato quando si esegue in modalità demone. |
| `control_socket` | string | `/var/run/softflowd.ctl` | Percorso del socket di controllo utilizzato da `softflowctl`. |
| `pcap_file` | string | *(vuoto)* | Percorso di un file pcap da cui leggere il traffico invece di un'interfaccia live. Utile per analisi offline. |

## Controllo a runtime

`softflowctl` è lo strumento complementare per interagire con un'istanza softflowd in esecuzione. Comunica tramite il socket di controllo (`/var/run/softflowd.ctl` per impostazione predefinita).

Visualizza le statistiche correnti sui flussi e le informazioni di scadenza:

    softflowctl statistics

Esegui il dump completo della tabella dei flussi correnti:

    softflowctl dump-flows

Forza la scadenza immediata e l'esportazione di tutti i flussi tracciati:

    softflowctl expire-all