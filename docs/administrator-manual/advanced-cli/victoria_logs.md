---
title: "Victoria Logs"
sidebar_position: 12
---

# Victoria Logs

NethSecurity 8.8 also ships the optional `victoria-logs` package for centralized log storage and aggregation.

Its Web UI keeps log navigation in one place, so you can browse, query, and visualize the rsyslog stream without jumping between files or services.

Install it with:

    apk update
    apk add victoria-logs

The package starts automatically and exposes the Victoria Logs Web UI on port 9428 (`/select/vmui`), accessible only from localhost. It depends on rsyslog, which forwards syslog messages to Victoria Logs on localhost port 5514.

Storage and retention are configured automatically:

- when persistent storage is available, logs are stored under `/mnt/data/victoria-logs-data` and retention is set to 1 year
- otherwise logs use `/var/lib/victoria-logs-data`, retention is limited to 7 days, and disk usage is capped at 50 MB to protect tmpfs

To access the UI without exposing the service, use SSH port forwarding:

    ssh -L 9428:127.0.0.1:9428 root@<firewall-ip>

Then open `http://127.0.0.1:9428/select/vmui` in your browser.
