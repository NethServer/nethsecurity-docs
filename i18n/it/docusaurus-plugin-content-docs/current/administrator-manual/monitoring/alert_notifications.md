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

Questa pagina descrive due modi per ricevere le notifiche degli avvisi senza un
abbonamento Enterprise:

- [Avvisi via mail dal firewall](#mail-alerts-from-the-firewall): un piccolo
  script sul firewall invia una mail quando un avviso inizia o termina. Adatto a
  un singolo firewall.
- [Stack Prometheus esterno](#external-prometheus-stack): un server Prometheus,
  Alertmanager e Grafana già esistente raccoglie le metriche del firewall e invia
  gli avvisi. Adatto quando è già presente un server di monitoraggio, o per molti
  firewall.

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
echo '{"host": "smtp.example.com", "port": 587, "auth": "on", "user": "myuser", "password": "mypassword", "tls": "on", "tls_starttls": "on", "from": "firewall@example.com", "syslog": "LOG_MAIL"}' | /usr/libexec/rpcd/ns.smtp call set
```

Questo comando sovrascrive `/etc/msmtprc`. Inviare poi una mail di prova:

``` bash
echo '{"to": "admin@example.com"}' | /usr/libexec/rpcd/ns.smtp call test
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

Creare `nethsecurity-rules.yml` accanto a `prometheus.yml`. L'esempio seguente
invia un avviso quando il firewall non è raggiungibile o una WAN non è attiva:

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
