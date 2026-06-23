---
title: "UCI (Unified Configuration Interface)"
sidebar_position: 12
---

# UCI (Unified Configuration Interface) {#uci-section}

UCI (Unified Configuration Interface) è un sistema centralizzato di gestione della configurazione utilizzato in NethSecurity. Fornisce un approccio unificato alla configurazione del sistema attraverso un'interfaccia da riga di comando e file di configurazione standardizzati.

## Caratteristiche Principali

- **Configurazione Centralizzata**: Tutte le configurazioni di sistema sono archiviate in un'unica posizione (`/etc/config/`)
- **Basato su Database**: Le configurazioni sono archiviate in file di database strutturati
- **Nessuna Validazione Integrata**: UCI esegue i comandi senza controlli di sicurezza - richiede conoscenze di sistema
- **Flusso di Lavoro a Tre Fasi**: Modifica → Commit → Riavvio/Ricaricamento
- **Capace di Multi-Evento**: Le interfacce utente possono attivare simultaneamente più eventi di configurazione

## Archiviazione della Configurazione

Tutte le configurazioni UCI sono archiviate come file di database in `/etc/config/`. Ogni file rappresenta un diverso componente di sistema o servizio, di seguito è fornito un elenco di esempi non esaustivi.

### Struttura dei File di Configurazione

    /etc/config/
    ├── acme          # SSL certificate management
    ├── adblock       # Advertisement blocking
    ├── banip         # IP banning service
    ├── chilli        # Captive portal
    ├── dedalo        # Network access control
    ├── dhcp          # DHCP server configuration
    ├── dpi           # Deep packet inspection
    ├── dropbear      # SSH server
    ├── firewall      # Firewall rules and zones
    ├── flashstart    # Web filtering
    ├── fstab         # Filesystem table
    ├── ipsec         # IPsec VPN
    ├── luci          # luci Web interface
    ├── mwan3         # Multi-WAN configuration
    ├── network       # Network interfaces and routing
    ├── nginx         # Web server
    ├── ns-ui         # NethSecurity user interface
    ├── objects       # Object definitions
    ├── openssl       # SSL/TLS configuration
    ├── openvpn       # OpenVPN configuration
    ├── qosify        # Quality of Service
    ├── rpcd          # RPC daemon
    ├── rsyslog       # System logging
    ├── socat         # Socket utilities
    ├── system        # System-wide settings
    ├── templates     # Configuration templates
    ├── ucitrack      # UCI change tracking
    ├── uhttpd        # HTTP server
    └── users         # User management

## Visualizzazione della Configurazione

### Mostra tutta la configurazione per un servizio specifico

``` bash
uci show <service>
```

**Esempio:**

``` bash
uci show network
```

**Output:**

``` text
network.loopback=interface
network.loopback.device='lo'
network.loopback.proto='static'
network.loopback.ipaddr='127.0.0.1'
network.loopback.netmask='255.0.0.0'
network.@device[0]=device
network.@device[0].name='br-lan'
network.@device[0].type='bridge'
network.@device[0].ports='eth0'
network.lan=interface
network.lan.device='br-lan'
network.lan.proto='static'
network.lan.ipaddr='192.168.100.101'
network.lan.netmask='255.255.255.0'
network.wan=interface
network.wan.device='eth1'
network.wan.proto='dhcp'
```

### Mostra un'opzione di configurazione specifica

``` bash
uci show <service>.<section>.<option>
```

**Esempio:**

``` bash
uci show network.lan.ipaddr
```

## Flusso di Lavoro Completo della Configurazione

### Processo standard a tre fasi

1.  **MODIFICA** - Apportare modifiche alla configurazione
2.  **COMMIT** - Salvare le modifiche nel database di configurazione
3.  **RICARICA** - Applicare le modifiche al sistema in esecuzione

### Esempio pratico: modifica dell'indirizzo IP della LAN

``` bash
# Step 1: Modify the configuration
uci set network.lan.ipaddr='192.168.100.151'

# Step 2: Commit the changes
uci commit network

# Step 3: Restart the network service
/etc/init.d/network restart
```

## SET - Modifica della configurazione

Il comando `uci set` è utilizzato per modificare i valori di configurazione. Le modifiche sono archiviate temporaneamente e devono essere committate per diventare permanenti.

### Imposta un valore di configurazione

``` bash
uci set <service>.<section>.<option>='<value>'
```

**Esempi:**

``` bash
# Change IP address
uci set network.lan.ipaddr='192.168.100.151'

# Change netmask
uci set network.lan.netmask='255.255.255.0'

# Change DHCP protocol to static
uci set network.wan.proto='static'
```

### Aggiungere una nuova sezione

``` bash
uci add <service> <section_type>
```

### Operazioni di cancellazione

``` bash
# Delete a configuration option
uci delete <service>.<section>.<option>

# Delete an entire section
uci delete <service>.<section>
```

## LISTE - Modifica delle opzioni lista {#uci-lists}

Le liste sono un tipo speciale di opzione che possono contenere più valori.

### Aggiungere un valore a una lista

Usa il comando `uci add_list` per aggiungere valori a una lista; il comando crea la lista se non esiste già.

```bash
uci add_list <service>.<section>.<list_option>='<value>'
```

### Rimuovere un valore da una lista

Per rimuovere un valore specifico da una lista, usa `uci del_list` specificando il valore da rimuovere.

```bash
uci del_list <service>.<section>.<list_option>='<value>'
```

Per rimuovere tutti i valori da una lista, usa il comando `uci delete` come descritto nella sezione precedente.

## COMMIT - Salvataggio delle modifiche

Le modifiche apportate con `uci set` non vengono applicate immediatamente al sistema. Devono essere committate prima per renderle permanenti.

### Commit di un servizio specifico

``` bash
uci commit <service>
```

**Esempio:**

``` bash
uci commit network
```

### Commit di tutte le modifiche in sospeso

``` bash
uci commit
```

### Controlla le modifiche in sospeso

Prima di committare, puoi rivedere quali modifiche verranno applicate:

``` bash
uci changes
```

### Ripristina le modifiche non committate

Se desideri scartare le modifiche non committate:

``` bash
uci revert <service>
```

## RELOAD - Applicazione delle modifiche

Dopo il commit, puoi applicare la nuova configurazione al sistema in esecuzione con un singolo comando. Questo ricaricherà automaticamente i servizi interessati senza la necessità di riavviare manualmente ognuno.

### Ricarica la configurazione

``` bash
reload_config  
```

## Formato del File di Configurazione

I file di configurazione UCI utilizzano un formato strutturato con sezioni e opzioni:

``` text
config <section_type> '<section_name>'
    option <option_name> '<value>'
    list <list_name> '<value1>'
    list <list_name> '<value2>'
```

### Esempio: File di Configurazione di Rete

File di Configurazione di Rete (`/etc/config/network`):

``` text
config interface 'loopback'
    option device 'lo'
    option proto 'static'
    option ipaddr '127.0.0.1'
    option netmask '255.0.0.0'

config device
    option name 'br-lan'
    option type 'bridge'
    list ports 'eth0'

config interface 'lan'
    option device 'br-lan'
    option proto 'static'
    option ipaddr '192.168.100.101'
    option netmask '255.255.255.0'

config interface 'wan'
    option device 'eth1'
    option proto 'dhcp'
```

## Best Practice

### Considerazioni di Sicurezza

1.  **Esegui sempre il backup delle configurazioni** prima di apportare modifiche
2.  **Testa le modifiche in modo incrementale** piuttosto che apportare più modifiche contemporaneamente
3.  **Comprendi le dipendenze del servizio** prima di riavviare i servizi
4.  **Usa** `uci changes` **per rivedere** le modifiche in sospeso
5.  **Disponi dell'accesso alla console** quando apporti modifiche di rete

### Errori Comuni

- **Dimenticare di committare**: Le modifiche non sono permanenti fino al commit
- **Non riavviare i servizi**: Le modifiche committate potrebbero non essere attive fino al riavvio del servizio
- **Interrompere la connettività di rete**: Assicurati sempre di avere metodi di accesso alternativi
- **Errori di sintassi**: La sintassi UCI non valida può causare corruzione della configurazione

## Risoluzione dei Problemi

### Comandi comuni per il debug

#### Visualizza le modifiche in sospeso

``` bash
uci changes
```

#### Ripristina lo stato dell'ultimo commit

``` bash
uci revert <service>
```

#### Verifica la sintassi UCI

``` bash
uci show | head -1
```

:::note

Assicurati sempre di avere accesso alternativo al sistema quando apporti modifiche critiche alla configurazione, specialmente per le modifiche relative alla rete.

:::

:::warning

I comandi UCI vengono eseguiti senza validazione. Le configurazioni non corrette possono rendere il sistema inaccessibile.

:::
