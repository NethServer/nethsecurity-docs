---
title: "Telegraf Prometheus exporter"
sidebar_position: 13
---

# Telegraf Prometheus exporter {#telegraf-prometheus-exporter}

Telegraf collects the system and service metrics of the firewall and writes them
to the local VictoriaMetrics instance. Starting from NethSecurity 8.8, Telegraf
can also expose the very same metrics in Prometheus format, so an external
Prometheus server, Grafana Agent or any other compatible collector can scrape
them directly from the firewall.

The exporter is **disabled by default**.

## Enabling the exporter {#enabling-the-exporter}

Always pick a listening port other than the default `9273`: that port is
reserved for the controller, which scrapes the unit through the VPN tunnel.
Port `9274` is a safe choice.

1. Open a terminal window on the firewall.
2. Enable the Prometheus output on port `9274` and apply the change:

``` bash
uci set telegraf.output_prometheus.enabled='1'
uci set telegraf.output_prometheus.listen_addr=':9274'
uci commit telegraf
reload_config
```

3. Check that the metrics are served:

``` bash
curl -s http://127.0.0.1:9274/metrics | head
```

The exporter now listens on port `9274` and publishes the metrics on the
`/metrics` path. The firewall still blocks the port for any incoming traffic, so
continue with [Accessing the exporter
remotely](#accessing-the-exporter-remotely) to reach it from the collector.

:::warning

If the exporter is left on the default port `9273` while the firewall is
connected to a controller, two Prometheus outputs compete for the same port and
one of them fails to bind. See [Units connected to a
controller](#telegraf-prometheus-controller).

:::

## Accessing the exporter remotely {#accessing-the-exporter-remotely}

Two options are available. Both of them restrict who can read the metrics, so
pick the one that fits the collector.

### Reverse proxy path {#reverse-proxy-path}

Recommended: the metrics travel over HTTPS on port 443 and no extra port is
opened on the firewall. Go to the [Certificates and reverse
proxy](../network/reverse_proxy.md) page, click **Add reverse proxy** and fill
in:

- `Type`: **Path**, for example `/telegraf-metrics`
- `Destination URL`: `http://127.0.0.1:9274/metrics`
- `Allowed networks`: the address of the collector in CIDR format, for example
  `203.0.113.5/32`

The metrics are then available at `https://<firewall-ip>/telegraf-metrics`.

### Firewall input rule {#firewall-input-rule}

Use this option when the collector must reach port `9274` directly. Go to the
[Rules](../firewall/firewall_rules.md) page, `Input rules` tab, and add a rule
with:

- `Source address`: the address of the collector
- `Source zone`: the zone the collector belongs to
- `Destination service`: **Custom**, protocol `TCP`, port `9274`
- `Action`: **Accept**

The metrics are then available at `http://<firewall-ip>:9274/metrics`. This
option exposes the exporter in clear text, so also protect it with a password,
as described below.

## Protecting the exporter with a password {#protecting-the-exporter-with-a-password}

The exporter can require HTTP basic authentication. Both the user name and the
password must be set, otherwise authentication is not configured at all:

``` bash
uci set telegraf.output_prometheus.basic_auth_username='prometheus'
uci set telegraf.output_prometheus.basic_auth_password='<password>'
uci commit telegraf
reload_config
```

Verify the credentials with:

``` bash
curl -s -u prometheus:'<password>' http://127.0.0.1:9274/metrics | head
```

:::warning

The exporter serves plain HTTP and has no authentication until the two options
above are set. Do not expose it outside a trusted network without a password.

:::

## Changing the listening address {#changing-the-listening-address}

The `listen_addr` option accepts the `address:port` syntax; when the address is
omitted, Telegraf binds all the available IPv4 and IPv6 addresses.

To restrict the exporter to a single address:

``` bash
# only reachable from the firewall itself, enough for the reverse proxy path
uci set telegraf.output_prometheus.listen_addr='127.0.0.1:9274'

# only reachable on a specific LAN address
uci set telegraf.output_prometheus.listen_addr='192.168.1.1:9274'

uci commit telegraf
reload_config
```

## Units connected to a controller {#telegraf-prometheus-controller}

When the firewall is connected to a controller, the controller already scrapes
Telegraf through the VPN tunnel: at every connection the unit binds port `9273`
on its own VPN address.

That endpoint is managed by the system and must be left alone. Keep the
`listen_addr` of the exporter on a different port, as described in [Enabling the
exporter](#enabling-the-exporter), and both endpoints coexist without
interfering with each other.

## Disabling the exporter {#disabling-the-exporter}

``` bash
uci set telegraf.output_prometheus.enabled='0'
uci commit telegraf
reload_config
```

Local monitoring and the metrics stored in VictoriaMetrics are not affected: the
exporter is an additional output, and disabling it only stops the Prometheus
endpoint.
