---
title: "Esportatore Prometheus di Telegraf"
sidebar_position: 13
---

# Esportatore Prometheus di Telegraf {#telegraf-prometheus-exporter}

Telegraf raccoglie le metriche di sistema e dei servizi del firewall e le scrive
nell'istanza locale di VictoriaMetrics. A partire da NethSecurity 8.8, Telegraf
può esporre le stesse metriche anche in formato Prometheus, così un server
Prometheus esterno, Grafana Agent o qualsiasi altro collettore compatibile può
leggerle direttamente dal firewall.

L'esportatore è **disabilitato per impostazione predefinita**.

## Abilitare l'esportatore {#enabling-the-exporter}

Scegliere sempre una porta di ascolto diversa da quella predefinita `9273`:
quella porta è riservata al controller, che legge le metriche dell'unità
attraverso il tunnel VPN. La porta `9274` è una scelta sicura.

1. Aprire un terminale sul firewall.
2. Abilitare l'output Prometheus sulla porta `9274` e applicare la modifica:

``` bash
uci set telegraf.output_prometheus.enabled='1'
uci set telegraf.output_prometheus.listen_addr=':9274'
uci commit telegraf
reload_config
```

3. Verificare che le metriche vengano servite:

``` bash
curl -s http://127.0.0.1:9274/metrics | head
```

L'esportatore ora ascolta sulla porta `9274` e pubblica le metriche sul percorso
`/metrics`. Il firewall blocca comunque la porta per il traffico in ingresso,
quindi proseguire con [Accedere all'esportatore da
remoto](#accessing-the-exporter-remotely) per raggiungerlo dal collettore.

:::warning

Se l'esportatore viene lasciato sulla porta predefinita `9273` mentre il
firewall è collegato a un controller, due output Prometheus entrano in
competizione sulla stessa porta e uno dei due non riesce ad aprirla. Vedere
[Unità collegate a un controller](#telegraf-prometheus-controller).

:::

## Accedere all'esportatore da remoto {#accessing-the-exporter-remotely}

Sono disponibili due opzioni. Entrambe limitano chi può leggere le metriche,
quindi scegliere quella più adatta al collettore.

### Percorso su reverse proxy {#reverse-proxy-path}

Consigliata: le metriche transitano su HTTPS sulla porta 443 e non viene aperta
nessuna porta aggiuntiva sul firewall. Accedere alla pagina [Certificati e
reverse proxy](../network/reverse_proxy.md), fare clic su **Aggiungi reverse
proxy** e compilare:

- `Tipo`: **Percorso**, per esempio `/telegraf-metrics`
- `URL di destinazione`: `http://127.0.0.1:9274/metrics`
- `Reti consentite`: l'indirizzo del collettore in formato CIDR, per esempio
  `203.0.113.5/32`

Le metriche sono poi disponibili all'indirizzo
`https://<firewall-ip>/telegraf-metrics`.

### Regola di firewall in ingresso {#firewall-input-rule}

Usare questa opzione quando il collettore deve raggiungere direttamente la porta
`9274`. Accedere alla pagina [Regole](../firewall/firewall_rules.md), scheda
`Regole di ingresso`, e aggiungere una regola con:

- `Indirizzo sorgente`: l'indirizzo del collettore
- `Zona sorgente`: la zona a cui appartiene il collettore
- `Servizio di destinazione`: **Personalizzato**, protocollo `TCP`, porta `9274`
- `Azione`: **Accetta**

Le metriche sono poi disponibili all'indirizzo
`http://<firewall-ip>:9274/metrics`. Questa opzione espone l'esportatore in
chiaro, quindi proteggerlo anche con una password, come descritto qui sotto.

## Proteggere l'esportatore con una password {#protecting-the-exporter-with-a-password}

L'esportatore può richiedere l'autenticazione HTTP basic. Devono essere
impostati sia il nome utente sia la password, altrimenti l'autenticazione non
viene configurata:

``` bash
uci set telegraf.output_prometheus.basic_auth_username='prometheus'
uci set telegraf.output_prometheus.basic_auth_password='<password>'
uci commit telegraf
reload_config
```

Verificare le credenziali con:

``` bash
curl -s -u prometheus:'<password>' http://127.0.0.1:9274/metrics | head
```

:::warning

L'esportatore serve HTTP in chiaro e non richiede alcuna autenticazione fino a
quando le due opzioni sopra non vengono impostate. Non esporlo al di fuori di
una rete fidata senza una password.

:::

## Modificare l'indirizzo di ascolto {#changing-the-listening-address}

L'opzione `listen_addr` accetta la sintassi `indirizzo:porta`; se l'indirizzo
viene omesso, Telegraf si lega a tutti gli indirizzi IPv4 e IPv6 disponibili.

Per limitare l'esportatore a un solo indirizzo:

``` bash
# raggiungibile solo dal firewall stesso, sufficiente per il reverse proxy
uci set telegraf.output_prometheus.listen_addr='127.0.0.1:9274'

# raggiungibile solo su un indirizzo LAN specifico
uci set telegraf.output_prometheus.listen_addr='192.168.1.1:9274'

uci commit telegraf
reload_config
```

## Unità collegate a un controller {#telegraf-prometheus-controller}

Quando il firewall è collegato a un controller, il controller legge già le
metriche di Telegraf attraverso il tunnel VPN: a ogni connessione l'unità apre
la porta `9273` sul proprio indirizzo VPN.

Quell'endpoint è gestito dal sistema e non va modificato. Mantenendo il
`listen_addr` dell'esportatore su una porta differente, come descritto in
[Abilitare l'esportatore](#enabling-the-exporter), i due endpoint convivono
senza interferire tra loro.

## Disabilitare l'esportatore {#disabling-the-exporter}

``` bash
uci set telegraf.output_prometheus.enabled='0'
uci commit telegraf
reload_config
```

Il monitoraggio locale e le metriche salvate in VictoriaMetrics non vengono
influenzati: l'esportatore è un output aggiuntivo e disabilitarlo interrompe
solo l'endpoint Prometheus.
