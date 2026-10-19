---
title: "Notifiche degli avvisi"
sidebar_position: 2
---

# Notifiche degli avvisi {#alert-notifications}

Il firewall controlla il proprio stato con una serie di [avvisi](./monitoring.md#alert-section),
ad esempio una WAN non raggiungibile o un disco pieno. Gli avvisi attivi sono
sempre mostrati nella pagina `Metrics` e nel pannello delle notifiche
dell'interfaccia web.

La destinazione degli avvisi, e chi riceve una mail, dipende
dall'[abbonamento](../system/subscription.md):

- **Abbonamento Enterprise**: tutti gli avvisi vengono inoltrati a
  [my.nethesis.it](https://my.nethesis.it), che invia le notifiche via mail,
  webhook o Telegram. Consultare il [manuale di
  my.nethesis.it](https://nethserver.github.io/my/it/docs/features/alerting) per scegliere i destinatari.
- **Abbonamento Community** o **nessun abbonamento**: gli avvisi non vengono
  inviati da nessuna parte e non viene inviata alcuna mail.

:::note

Con il passaggio al nuovo my.nethesis.it, i firewall con abbonamento Community
non ricevono più le notifiche via mail degli avvisi. Gli abbonamenti Enterprise
non cambiano.

:::

Questa pagina descrive due modi per ricevere le notifiche degli avvisi senza un
abbonamento Enterprise:

- [Avvisi via mail dal firewall](#mail-alerts-from-the-firewall): un piccolo
  script sul firewall invia una mail quando un avviso inizia o termina. Adatto a
  un singolo firewall.
- [Stack Prometheus esterno](#external-prometheus-stack): un server Prometheus,
  Alertmanager e Grafana già esistente raccoglie le metriche del firewall e invia
  gli avvisi. Adatto quando è già presente un server di monitoraggio, o per molti
  firewall. Anche un cluster [NethServer 8](#nethserver-8-metrics) può svolgere
  questo ruolo.

Entrambi i metodi possono essere usati anche insieme a un abbonamento Enterprise.

## Avvisi via mail dal firewall {#mail-alerts-from-the-firewall}

:::warning

Questa è una configurazione avanzata da riga di comando. Non è gestita
dall'interfaccia web.

:::

Il firewall valuta i propri avvisi con vmalert, che pubblica gli avvisi attivi su
un indirizzo locale (`http://127.0.0.1:8082/api/v1/alerts`). Uno script, eseguito
da cron ogni 5 minuti, legge gli avvisi attivi e li confronta con l'esecuzione
precedente. Quando un avviso inizia o viene risolto, lo script invia una mail
usando il [client SMTP](../advanced-cli/smtp.md) del firewall.

### Configurare il client SMTP {#alert-mail-smtp}

Il firewall ha bisogno di un server di posta esterno per inviare la mail. Aprire
un terminale sul firewall e impostare il server, ad esempio:

``` bash
echo '{"host": "smtp.example.com", "port": 587, "auth": "on", "user": "myuser", "password": "mypassword", "tls": "on", "tls_starttls": "on", "from": "firewall@example.com", "syslog": "LOG_MAIL"}' | api-cli ns.smtp set --data -
```

Questo comando sovrascrive `/etc/msmtprc`. Inviare poi una mail di prova:

``` bash
echo '{"to": "admin@example.com"}' | api-cli ns.smtp test --data -
```

Non proseguire finché la mail di prova non arriva. Consultare il [manuale dello
sviluppatore](https://dev.nethsecurity.org/packages/ns-api/#nssmtp) per tutte le
opzioni.

### Creare lo script {#alert-mail-script}

Creare il file `/usr/local/sbin/alert-mail`:

``` bash
mkdir -p /usr/local/sbin
vi /usr/local/sbin/alert-mail
```

Incollare il contenuto seguente e cambiare `MAIL_TO` con l'indirizzo che deve
ricevere gli avvisi:

``` bash
#!/bin/sh
#
# Send a mail when a firewall alert starts or stops firing
#

# Recipients, separated by a comma
MAIL_TO="admin@example.com"
# Alert severities to notify: info, warning, critical
SEVERITIES="warning critical"

VMALERT_URL="http://127.0.0.1:8082/api/v1/alerts"
STATE_FILE="/var/run/alert-mail.state"

# Keep the previous state if vmalert does not answer
json=$(curl -sf "$VMALERT_URL") || exit 1

current=$(mktemp)
trap 'rm -f "$current"' EXIT

echo "$json" | jq -r --arg sev "$SEVERITIES" '
  .data.alerts[]
  | select(.state == "firing")
  | select(.labels.severity as $s | $sev | split(" ") | any(. == $s))
  | (.labels | del(.alertname, .alertgroup, .severity, .service)
      | to_entries | map("\(.key)=\(.value)") | join(", ")) as $labels
  | "[\(.labels.severity)] \(.name)\(if $labels != "" then " (\($labels))" else "" end): \(.annotations.summary_en // "")"
' | sort > "$current"

touch "$STATE_FILE"
firing=$(grep -Fxv -f "$STATE_FILE" "$current")
resolved=$(grep -Fxv -f "$current" "$STATE_FILE")

if [ -n "$firing" ] || [ -n "$resolved" ]; then
    {
        echo "To: $MAIL_TO"
        echo "Subject: [$(cat /proc/sys/kernel/hostname)] Firewall alerts"
        echo
        if [ -n "$firing" ]; then
            printf 'New alerts:\n%s\n\n' "$firing"
        fi
        if [ -n "$resolved" ]; then
            printf 'Resolved alerts:\n%s\n\n' "$resolved"
        fi
        printf 'Alerts still firing: %s\n' "$(wc -l < "$current")"
    } | msmtp --read-recipients || exit 1
fi

# Save the state only after the mail has been sent, to retry on failure
mv "$current" "$STATE_FILE"
```

Rendere lo script eseguibile:

``` bash
chmod +x /usr/local/sbin/alert-mail
```

La variabile `SEVERITIES` sceglie quali avvisi inviare via mail. Per
impostazione predefinita gli avvisi `info` (`HighCpuUsage` e `HighMemoryUsage`)
vengono ignorati perché possono essere frequenti. La gravità di ogni avviso è
indicata nei file delle regole in `/etc/vmalert/rules/`.

Una mail ha questo aspetto:

```text
Subject: [fw1] Firewall alerts

New alerts:
[critical] WanDown (interface=wan): WAN interface wan is offline

Alerts still firing: 1
```

### Pianificare lo script {#alert-mail-schedule}

Eseguire lo script ogni 5 minuti:

``` bash
crontab -l | grep -q alert-mail || echo '*/5 * * * * /usr/local/sbin/alert-mail' >> /etc/crontabs/root
/etc/init.d/cron restart
```

Aggiungere lo script ai file conservati durante gli aggiornamenti e inclusi nel
[backup](../system/backup.md). Il crontab è già conservato dal sistema.

``` bash
echo /usr/local/sbin/alert-mail >> /etc/sysupgrade.conf
```

Tenere presente che:

- La maggior parte degli avvisi diventa attiva solo dopo che il problema dura da
  alcuni minuti (5 o 10, a seconda della regola). La mail arriva fino a 5 minuti
  dopo.
- Lo stato dell'ultima esecuzione è conservato in RAM. Dopo un riavvio, gli
  avvisi ancora attivi vengono inviati di nuovo.
- Se la mail non può essere inviata, lo script riprova all'esecuzione successiva.
- In un cluster in [alta
  affidabilità](../high-availability/ha_overview_features_limitations.md),
  configurare lo script su entrambi i nodi. Le impostazioni SMTP sono già
  sincronizzate.

### Provare lo script {#alert-mail-test}

Eseguire lo script a mano. Se funziona, non stampa nulla e restituisce `0`:

``` bash
/usr/local/sbin/alert-mail; echo $?
```

Per verificare l'intera catena, aggiungere un avviso di prova sempre attivo:

``` bash
cat > /etc/vmalert/rules/zz-test.yaml <<'EOF'
groups:
- name: test
  rules:
  - alert: TestAlert
    expr: vector(1)
    labels:
      severity: warning
    annotations:
      summary_en: Test alert, remove /etc/vmalert/rules/zz-test.yaml
EOF
/etc/init.d/vmalert reload
```

Dopo circa un minuto, eseguire di nuovo lo script: viene inviata una mail con
`TestAlert`. Rimuovere poi l'avviso di prova, ricaricare vmalert ed eseguire lo
script ancora una volta: una mail segnala l'avviso come risolto.

``` bash
rm /etc/vmalert/rules/zz-test.yaml
/etc/init.d/vmalert reload
```

:::warning

Su un firewall con abbonamento Enterprise, l'avviso di prova viene inoltrato
anche a my.nethesis.it. Rimuoverlo appena terminata la prova.

:::

### Rimuovere la configurazione {#alert-mail-remove}

``` bash
sed -i '/alert-mail/d' /etc/crontabs/root /etc/sysupgrade.conf
/etc/init.d/cron restart
rm -f /usr/local/sbin/alert-mail /var/run/alert-mail.state
```

## Stack Prometheus esterno {#external-prometheus-stack}

Se nella rete è già attivo uno stack Prometheus, Alertmanager e Grafana, può
raccogliere le metriche del firewall e inviare gli avvisi:

- **Prometheus** legge (scrape) le metriche dal firewall e valuta le regole di
  avviso.
- **Alertmanager** invia le notifiche, via mail o con qualsiasi altro canale
  supportato.
- **Grafana** mostra le metriche nelle dashboard.

Gli avvisi del firewall non vengono inviati a Prometheus: Prometheus raccoglie le
stesse metriche usate dal firewall e valuta una propria copia delle regole.

### Preparare il firewall {#prometheus-prepare-firewall}

Abilitare l'esportatore Prometheus di Telegraf come descritto in [Esportatore
Prometheus di Telegraf](../advanced-cli/telegraf_prometheus.md). La
configurazione consigliata prevede:

- il [percorso su reverse proxy](../advanced-cli/telegraf_prometheus.md#reverse-proxy-path),
  così le metriche viaggiano in HTTPS e l'esportatore ascolta solo su
  `127.0.0.1`;
- una [password](../advanced-cli/telegraf_prometheus.md#protecting-the-exporter-with-a-password);
- l'indirizzo del server Prometheus nel campo `Allowed networks`.

Verificare dal server Prometheus che le metriche siano leggibili:

``` bash
curl -sk -u prometheus:'<password>' https://fw1.example.com/telegraf-metrics | head
```

### Configurare Prometheus {#prometheus-scrape-config}

Aggiungere un job di scrape a `prometheus.yml`, con un target per ogni firewall:

``` yaml
scrape_configs:
  - job_name: nethsecurity
    scheme: https
    metrics_path: /telegraf-metrics
    basic_auth:
      username: prometheus
      password: <password>
    tls_config:
      # Only needed if the firewall uses a self-signed certificate
      insecure_skip_verify: true
    static_configs:
      - targets:
          - fw1.example.com
          - fw2.example.com

rule_files:
  - nethsecurity-rules.yml
```

I nomi delle metriche sono gli stessi usati sul firewall, ad esempio
`cpu_usage_idle`, `mem_used_percent`, `disk_used_percent`,
`mwan_interface_online` e `procd_service_running`. Per elencare tutte le
metriche, eseguire sul firewall:

``` bash
curl -s http://127.0.0.1:9274/metrics | grep -v '^#' | cut -d '{' -f 1 | cut -d ' ' -f 1 | sort -u
```

### Regole di avviso {#prometheus-alert-rules}

Creare `nethsecurity-rules.yml` accanto a `prometheus.yml`. Le regole seguenti
riproducono gli avvisi più importanti del firewall:

``` yaml
groups:
  - name: nethsecurity
    rules:
      - alert: FirewallDown
        expr: up{job="nethsecurity"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Firewall {{ $labels.instance }} cannot be reached"
      - alert: WanDown
        expr: mwan_interface_online{job="nethsecurity"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "WAN {{ $labels.interface }} is down on {{ $labels.instance }}"
      - alert: DiskSpaceCritical
        expr: disk_used_percent{job="nethsecurity"} > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Disk {{ $labels.path }} is above 90% on {{ $labels.instance }}"
      - alert: ServiceDown
        expr: procd_service_running{job="nethsecurity"} == 0 and procd_service_exit_code{job="nethsecurity"} != 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.service }} is not running on {{ $labels.instance }}"
      - alert: StorageStatus
        expr: storage_status_error{job="nethsecurity"} == 1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Data storage error on {{ $labels.instance }}"
      - alert: CriticalCpuUsage
        expr: 100 - cpu_usage_idle{job="nethsecurity", cpu="cpu-total"} > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "CPU usage is above 85% on {{ $labels.instance }}"
      - alert: CriticalMemoryUsage
        expr: mem_used_percent{job="nethsecurity"} > 90
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Memory usage is above 90% on {{ $labels.instance }}"
```

Le regole usate dal firewall si trovano in `/etc/vmalert/rules/` e possono
servire da riferimento per altri avvisi. Ricaricare Prometheus dopo aver
modificato la configurazione.

### Configurare Alertmanager {#prometheus-alertmanager}

Per inviare gli avvisi via mail, configurare un destinatario mail in
`alertmanager.yml`:

``` yaml
global:
  smtp_smarthost: smtp.example.com:587
  smtp_from: alertmanager@example.com
  smtp_auth_username: myuser
  smtp_auth_password: mypassword

route:
  receiver: mail
  group_by: ['alertname', 'instance']

receivers:
  - name: mail
    email_configs:
      - to: admin@example.com
        send_resolved: true
```

Consultare la [documentazione di
Alertmanager](https://prometheus.io/docs/alerting/latest/configuration/) per gli
altri canali, come applicazioni di chat o webhook.

### Dashboard Grafana {#prometheus-grafana}

Aggiungere Prometheus come sorgente dati in Grafana, quindi creare le dashboard
usando i nomi delle metriche elencati sopra. Filtrare i firewall con l'etichetta
`job="nethsecurity"`.

## Metriche di NethServer 8 {#nethserver-8-metrics}

Ogni cluster [NethServer 8](https://docs.nethserver.org/projects/ns8/) include un
modulo metrics, installato sul nodo leader. Contiene Prometheus, Alertmanager e
Grafana, e può raccogliere anche le metriche di un firewall NethSecurity e
inviarne gli avvisi via mail.

:::warning

Questa è una configurazione avanzata. Usa impostazioni interne del modulo metrics
di NethServer 8, che non sono mostrate nell'interfaccia web e potrebbero cambiare
nelle versioni future.

:::

La configurazione ha questi limiti:

- **Nessuna opzione per password e HTTPS.** Il modulo metrics non può inviare
  una password e verifica sempre il certificato HTTPS. Usare una di queste due
  opzioni:
  - HTTP in chiaro all'interno di una rete fidata, con la porta del firewall
    aperta solo al nodo leader di NethServer 8 (consigliata);
  - HTTPS tramite il percorso su reverse proxy, ma solo con un certificato valido
    (ad esempio Let's Encrypt) e senza la password dell'esportatore.
- **Solo gli avvisi critici vengono inviati via mail.** Gli avvisi con una
  gravità diversa sono mostrati solo in Grafana e Prometheus.
- **La configurazione si perde quando cambia il nodo leader.** Ripeterla sul
  nuovo nodo leader.
- **I cluster Enterprise inoltrano gli avvisi.** Se il cluster NethServer 8 ha
  un abbonamento Enterprise, gli avvisi del firewall vengono inoltrati anche a
  my.nethesis.it come avvisi del cluster.

Un firewall collegato a un [controller](../system/controller.md) invia già le sue
metriche al controller, ma il controller non invia avvisi. Il modulo metrics è un
servizio separato.

### Preparare il firewall per NethServer 8 {#ns8-prepare-firewall}

Con l'opzione consigliata in HTTP in chiaro:

1. Abilitare l'[esportatore Prometheus di
   Telegraf](../advanced-cli/telegraf_prometheus.md#enabling-the-exporter) sulla
   porta `9274`. Non impostare una password.
2. Consentire il nodo leader di NethServer 8 con una [regola di firewall in
   ingresso](../advanced-cli/telegraf_prometheus.md#firewall-input-rule) e
   bloccare tutti gli altri host, come descritto in [Limitare l'accesso alle
   metriche](../advanced-cli/telegraf_prometheus.md#restricting-access-to-the-metrics).

Verificare dal nodo leader che le metriche siano leggibili:

``` bash
curl -s http://192.168.1.1:9274/metrics | head
```

### Abilitare le notifiche via mail su NethServer 8 {#ns8-mail}

1. Configurare il server di posta del cluster dall'interfaccia web di
   NethServer 8: pagina `Settings`, sezione `Email notifications`.
2. Aprire un terminale sul nodo leader come `root` e trovare l'ID del modulo
   metrics, di solito `metrics1`:

   ``` bash
   api-cli run cluster/get-metrics-id
   ```

3. Leggere la configurazione attuale del modulo:

   ``` bash
   api-cli run module/metrics1/get-configuration
   ```

4. Impostare i destinatari delle mail. Mantenere gli altri valori restituiti dal
   comando precedente, altrimenti vengono azzerati:

   ``` bash
   api-cli run module/metrics1/configure-module --data '{"prometheus_path": "", "grafana_path": "grafana", "mail_to": ["admin@example.com"], "mail_from": "", "mail_template": ""}'
   ```

5. Inviare un avviso di prova e verificare che la mail arrivi:

   ``` bash
   runagent -m metrics1 test-alert
   ```

### Aggiungere il firewall come target {#ns8-add-target}

Sul nodo leader, creare il file `nethsecurity.yml` con una voce per ogni
firewall. L'etichetta `firewall` è un nome libero mostrato negli avvisi:

``` yaml
- targets:
    - 192.168.1.1:9274
  labels:
    firewall: fw1
```

Con l'opzione HTTPS, usare il nome del firewall e aggiungere percorso e schema:

``` yaml
- targets:
    - fw1.example.com:443
  labels:
    firewall: fw1
    __scheme__: https
    __metrics_path__: /telegraf-metrics
```

Caricare il file e notificare il modulo metrics:

``` bash
redis-cli -x hset module/metrics1/metrics_targets nethsecurity < nethsecurity.yml
redis-cli publish module/metrics1/event/metrics-target-changed '{}'
```

Prometheus legge i nuovi target da solo, senza riavvio. Tutte le metriche del
firewall ricevono l'etichetta `target_type="nethsecurity"`.

Per modificare l'elenco dei firewall, modificare il file ed eseguire di nuovo gli
stessi due comandi.

### Aggiungere le regole di avviso su NethServer 8 {#ns8-alert-rules}

Il modulo metrics non include regole di avviso per il firewall. Ogni regola
personalizzata è salvata in un file separato. Ad esempio, per ricevere una mail
quando il firewall non è raggiungibile, creare `fwdown.yml`:

``` yaml
alert: FirewallDown
expr: up{target_type="nethsecurity"} == 0
for: 5m
labels:
  severity: critical
annotations:
  summary: "Firewall {{ $labels.firewall }} cannot be reached"
```

E una regola per lo stato della WAN, `fwwan.yml`:

``` yaml
alert: FirewallWanDown
expr: mwan_interface_online{target_type="nethsecurity"} == 0
for: 5m
labels:
  severity: critical
annotations:
  summary: "WAN {{ $labels.interface }} is down on firewall {{ $labels.firewall }}"
```

Caricare le regole e riavviare Prometheus:

``` bash
redis-cli -x hset module/metrics1/custom_alerts fwdown < fwdown.yml
redis-cli -x hset module/metrics1/custom_alerts fwwan < fwwan.yml
runagent -m metrics1 systemctl --user restart prometheus
```

Le altre regole elencate in [Regole di avviso](#prometheus-alert-rules) possono
essere aggiunte allo stesso modo: usare `target_type="nethsecurity"` al posto di
`job="nethsecurity"` e impostare `severity: critical` sulle regole che devono
inviare una mail. Ogni file deve contenere una sola regola, senza le chiavi
`groups` e `rules`.

### Grafana su NethServer 8 {#ns8-grafana}

Grafana è disabilitato per impostazione predefinita. Per abilitarlo, impostare il
valore `grafana_path` del modulo metrics, come mostrato in [Abilitare le notifiche
via mail su NethServer 8](#ns8-mail). Grafana è poi disponibile su
`https://<leader-node>/grafana`, con le stesse credenziali dell'amministratore del
cluster NethServer 8. Le metriche del firewall si trovano nella sorgente dati
`Local Promethus`, filtrate con `target_type="nethsecurity"`.

### Rimuovere il firewall da NethServer 8 {#ns8-remove}

``` bash
redis-cli hdel module/metrics1/metrics_targets nethsecurity
redis-cli publish module/metrics1/event/metrics-target-changed '{}'
redis-cli hdel module/metrics1/custom_alerts fwdown fwwan
runagent -m metrics1 systemctl --user restart prometheus
```
