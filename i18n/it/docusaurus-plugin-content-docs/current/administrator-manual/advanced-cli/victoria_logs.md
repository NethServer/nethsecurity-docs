---
title: "Victoria Logs"
sidebar_position: 12
---

# Victoria Logs

NethSecurity 8.8 include anche il pacchetto opzionale `victoria-logs` per l'archiviazione e l'aggregazione centralizzata dei log.

La sua interfaccia Web mantiene la navigazione dei log in un unico posto, consentendo di sfogliare, interrogare e visualizzare il flusso rsyslog senza dover passare da un file all'altro o da un servizio all'altro.

Installarlo con:

    apk update
    apk add victoria-logs

Il pacchetto si avvia automaticamente e espone l'interfaccia Web di Victoria Logs sulla porta 9428 (`/select/vmui`), accessibile solo da localhost. Dipende da rsyslog, che inoltra i messaggi syslog a Victoria Logs sulla porta 5514 di localhost.

L'archiviazione e la conservazione sono configurate automaticamente:

- quando è disponibile un'archiviazione persistente, i log vengono archiviati sotto `/mnt/data/victoria-logs-data` e la conservazione è impostata a 1 anno
- altrimenti i log utilizzano `/var/lib/victoria-logs-data`, la conservazione è limitata a 7 giorni e l'utilizzo del disco è limitato a 50 MB per proteggere tmpfs

Per accedere all'interfaccia senza esporre il servizio, utilizzare il port forwarding SSH:

    ssh -L 9428:127.0.0.1:9428 root@<firewall-ip>

Quindi aprire `http://127.0.0.1:9428/select/vmui` nel browser.
