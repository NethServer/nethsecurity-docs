---
title: "Speedtest"
sidebar_position: 8
---

# Speedtest

Lo strumento Speedtest è un'applicazione ampiamente utilizzata per misurare la velocità e le prestazioni di una connessione Internet. Fornisce agli utenti informazioni dettagliate sulle loro velocità di download e upload, nonché il ping e il jitter. Questo strumento è essenziale per diagnosticare problemi di rete, verificare le affermazioni del provider di servizi e garantire prestazioni ottimali per varie attività online.

In NethSecurity lo strumento Speedtest è disponibile come funzionalità integrata accessibile solo dalla riga di comando.

## Utilizzo

Poiché il test può essere influenzato dalle impostazioni QoS, è meglio disabilitarlo prima di eseguire il test: :

    /etc/init.d/qosify stop

Speedtest seleziona automaticamente il miglior server in base alla posizione dell'utente. Per eseguire un test di velocità, digitare semplicemente il seguente comando nel terminale: :

    speedtest

Questo comando eseguirà un test completo, inclusi test di latenza, velocità di download e upload. La selezione del server è basata sulla posizione dell'utente e sulla disponibilità del server. A volte, la selezione del server potrebbe non essere ottimale, risultando in risultati del test di velocità imprecisi.

Per superare questo problema, gli utenti possono forzare la selezione del server utilizzando l'opzione `--force-by-latency-test`: :

    speedtest --force-by-latency-test

Ricordarsi di riabilitare QoS dopo aver eseguito il test: :

    /etc/init.d/qosify start

## MultiWAN

Lo strumento speedtest seleziona casualmente un server per eseguire il test. In un ambiente MultiWAN, la selezione del server può essere influenzata dall'interfaccia WAN utilizzata per raggiungere il server.

È possibile forzare la selezione dell'interfaccia WAN utilizzando il wrapper mwan3.

Dato un dispositivo WAN denominato `wan1`, il seguente comando eseguirà lo speedtest utilizzando l'interfaccia selezionata: :

    mwan3 use wan1 speedtest --force-by-latency-test
