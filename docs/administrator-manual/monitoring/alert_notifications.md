---
title: "Alert notifications"
sidebar_position: 2
---

# Alert notifications {#alert-notifications}

The firewall checks its own health with a set of [alerts](./monitoring.md#alert-section),
such as a WAN going down or a full disk. Active alerts are always shown in the
`Metrics` page and in the notification drawer of the web interface.

Where alerts are sent, and who gets a mail, depends on the
[subscription](../system/subscription.md):

- **Enterprise subscription**: all alerts are forwarded to
  [my.nethesis.it](https://my.nethesis.it), which sends the notifications by
  mail, webhook or Telegram. See the [my.nethesis.it
  manual](https://nethserver.github.io/my/docs/features/alerting) to choose the recipients.
- **Community subscription** or **no subscription**: alerts are not sent
  anywhere and no mail notification is sent.

This page describes two ways to receive alert notifications without an Enterprise
subscription:

- [Mail alerts from the firewall](#mail-alerts-from-the-firewall): a small
  script on the firewall sends a mail when an alert starts or stops. Best for a
  single firewall.
- [External Prometheus stack](#external-prometheus-stack): an existing
  Prometheus, Alertmanager and Grafana server collects the firewall metrics and
  sends the alerts. Best when a monitoring server is already in place, or for
  many firewalls.

Both methods can be used together with an Enterprise subscription, too.

## Mail alerts from the firewall {#mail-alerts-from-the-firewall}

:::warning

This is an advanced configuration done from the command line. It is not managed
by the web interface.

:::

The firewall evaluates its alerts with vmalert, which publishes the active alerts
on a local address (`http://127.0.0.1:8082/api/v1/alerts`). A script, run by
cron every 5 minutes, reads the active alerts and compares them with the last
run. When an alert starts or is resolved, the script sends a mail using the
[SMTP client](../advanced-cli/smtp.md) of the firewall.

### Configure the SMTP client {#alert-mail-smtp}

The firewall needs an external mail server to send the mail. Open a terminal on
the firewall and set the server, for example:

``` bash
echo '{"host": "smtp.example.com", "port": 587, "auth": "on", "user": "myuser", "password": "mypassword", "tls": "on", "tls_starttls": "on", "from": "firewall@example.com", "syslog": "LOG_MAIL"}' | /usr/libexec/rpcd/ns.smtp call set
```

This command overwrites `/etc/msmtprc`. Then send a test mail:

``` bash
echo '{"to": "admin@example.com"}' | /usr/libexec/rpcd/ns.smtp call test
```

Do not continue until the test mail arrives. See the [developer
manual](https://dev.nethsecurity.org/packages/ns-api/#nssmtp) for all the
options.

### Create the script {#alert-mail-script}

Create the file `/usr/local/sbin/alert-mail`:

``` bash
mkdir -p /usr/local/sbin
vi /usr/local/sbin/alert-mail
```

Paste the following content and change `MAIL_TO` to the address that must
receive the alerts:

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

Make the script executable:

``` bash
chmod +x /usr/local/sbin/alert-mail
```

The `SEVERITIES` variable selects which alerts are mailed. By default the
`info` alerts (`HighCpuUsage` and `HighMemoryUsage`) are skipped because they
can be noisy. The severity of each alert is listed in the rule files inside
`/etc/vmalert/rules/`.

A mail looks like this:

```text
Subject: [fw1] Firewall alerts

New alerts:
[critical] WanDown (interface=wan): WAN interface wan is offline

Alerts still firing: 1
```

### Schedule the script {#alert-mail-schedule}

Run the script every 5 minutes:

``` bash
crontab -l | grep -q alert-mail || echo '*/5 * * * * /usr/local/sbin/alert-mail' >> /etc/crontabs/root
/etc/init.d/cron restart
```

Add the script to the files kept during upgrades and included in the
[backup](../system/backup.md). The crontab is already kept by the system.

``` bash
echo /usr/local/sbin/alert-mail >> /etc/sysupgrade.conf
```

Keep in mind that:

- Most alerts become active only after the problem lasts for some minutes (5 or
  10, depending on the rule). The mail arrives up to 5 minutes later.
- The state of the last run is kept in RAM. After a reboot, the alerts that are
  still active are mailed again.
- If the mail cannot be sent, the script retries at the next run.
- On a [high availability](../high-availability/ha_overview_features_limitations.md)
  cluster, configure the script on both nodes. The SMTP settings are already
  synchronized.

### Test the script {#alert-mail-test}

Run the script by hand. It prints nothing and returns `0` when it works:

``` bash
/usr/local/sbin/alert-mail; echo $?
```

To check the whole chain, add a test alert that is always active:

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

After about one minute, run the script again: a mail with `TestAlert` is sent.
Then remove the test alert, reload vmalert and run the script once more: a mail
reports the alert as resolved.

``` bash
rm /etc/vmalert/rules/zz-test.yaml
/etc/init.d/vmalert reload
```

### Remove the configuration {#alert-mail-remove}

``` bash
sed -i '/alert-mail/d' /etc/crontabs/root /etc/sysupgrade.conf
/etc/init.d/cron restart
rm -f /usr/local/sbin/alert-mail /var/run/alert-mail.state
```

## External Prometheus stack {#external-prometheus-stack}

If a Prometheus, Alertmanager and Grafana stack is already running in the
network, it can collect the firewall metrics and send the alerts:

- **Prometheus** reads (scrapes) the metrics from the firewall and evaluates the
  alert rules.
- **Alertmanager** sends the notifications, by mail or any other supported
  channel.
- **Grafana** shows the metrics in dashboards.

The firewall alerts are not sent to Prometheus: Prometheus collects the same
metrics used by the firewall and evaluates its own copy of the rules.

### Prepare the firewall {#prometheus-prepare-firewall}

Enable the Telegraf Prometheus exporter as described in [Telegraf Prometheus
exporter](../advanced-cli/telegraf_prometheus.md). The recommended setup is:

- the [reverse proxy path](../advanced-cli/telegraf_prometheus.md#reverse-proxy-path),
  so the metrics travel over HTTPS and the exporter listens only on `127.0.0.1`;
- a [password](../advanced-cli/telegraf_prometheus.md#protecting-the-exporter-with-a-password);
- the Prometheus server address in the `Allowed networks` field.

Check from the Prometheus server that the metrics can be read:

``` bash
curl -sk -u prometheus:'<password>' https://fw1.example.com/telegraf-metrics | head
```

### Configure Prometheus {#prometheus-scrape-config}

Add a scrape job to `prometheus.yml`. Add one target for each firewall:

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

The metric names are the same used on the firewall, for example
`cpu_usage_idle`, `mem_used_percent`, `disk_used_percent`,
`mwan_interface_online` and `procd_service_running`. To list all the metrics,
run on the firewall:

``` bash
curl -s http://127.0.0.1:9274/metrics | grep -v '^#' | cut -d '{' -f 1 | cut -d ' ' -f 1 | sort -u
```

### Alert rules {#prometheus-alert-rules}

Create `nethsecurity-rules.yml` next to `prometheus.yml`. The following example
sends an alert when the firewall cannot be reached or a WAN is down:

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

The rules used by the firewall are in `/etc/vmalert/rules/` and can be used as a
reference for more alerts. Reload Prometheus after changing the configuration.

### Configure Alertmanager {#prometheus-alertmanager}

To send the alerts by mail, configure a mail receiver in `alertmanager.yml`:

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

See the [Alertmanager
documentation](https://prometheus.io/docs/alerting/latest/configuration/) for
the other channels, such as chat applications or webhooks.

### Grafana dashboards {#prometheus-grafana}

Add Prometheus as a data source in Grafana, then build the dashboards using the
metric names listed above. Filter the firewalls with the `job="nethsecurity"`
label.
