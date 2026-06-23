---
title: "Avahi (riflettore mDNS)"
sidebar_position: 1
---

# Avahi (riflettore mDNS) {#avahi-section}

Il DNS Multicast (mDNS) consente ai dispositivi di scoprire servizi su una rete locale senza un server DNS centralizzato, utilizzando il traffico multicast nel dominio `.local`. Un caso d'uso tipico è la segmentazione della rete IoT: quando i dispositivi IoT si trovano in una rete dedicata, i dispositivi di controllo come smartphone e PC si affidano a mDNS per la scoperta. Tuttavia, il traffico mDNS non attraversa i confini della rete, quindi è necessario un riflettore mDNS come Avahi per colmare il divario e consentire la scoperta dei servizi tra i segmenti di rete.

Su NethSecurity, il pacchetto `avahi-nodbus-daemon` è disponibile nei repository ufficiali ma non è installato per impostazione predefinita.

:::note

A partire dalla versione 8.7.2, i pacchetti aggiuntivi vengono reinstallati automaticamente dopo l'aggiornamento del sistema. Per le versioni precedenti e per ulteriori informazioni, consultare questa documentazione: [Ripristinare pacchetti aggiuntivi](../system/updates.md#restore_extra_packages-section).

:::

## Installazione

Installare il pacchetto con:

    apk update
    apk add avahi-nodbus-daemon

## Configurazione

Per impostazione predefinita, la funzionalità del riflettore mDNS è disabilitata. Per abilitarla:

1.  Modificare il file di configurazione del daemon Avahi: :

        sed -i 's/^enable\-reflector\=no$/enable\-reflector\=yes/g' /etc/avahi/avahi-daemon.conf

2.  Riavviare il daemon Avahi per applicare le modifiche: :

        /etc/init.d/avahi-daemon restart

Dopo aver abilitato il riflettore, il traffico mDNS verrà riflesso tra le interfacce di rete, consentendo alla scoperta dei servizi di funzionare tra diversi segmenti di rete.
