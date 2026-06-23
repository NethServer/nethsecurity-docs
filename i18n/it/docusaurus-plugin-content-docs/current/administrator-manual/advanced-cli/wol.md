---
title: "Wake-on-LAN (EtherWake)"
sidebar_position: 10
---

# Wake-on-LAN (EtherWake)

Wake-on-LAN (WoL) è una tecnologia che consente a un dispositivo spento o sospeso di essere acceso da remoto inviando un messaggio di rete speciale chiamato *Magic Packet* alla sua interfaccia di rete. Il pacchetto EtherWake fornisce una semplice utility da riga di comando per inviare questi Magic Packet e riattivare i dispositivi nella rete locale. Su NethSecurity, EtherWake è disponibile nei repository ufficiali ma non è installato per impostazione predefinita.

:::note

Il dispositivo di destinazione deve supportare Wake-on-LAN (WoL) e avere la funzione abilitata nel BIOS/UEFI e nelle impostazioni della scheda di rete. In caso contrario, non risponderà ai Magic Packet.

:::

## Installazione

Installa il pacchetto con i comandi che corrispondono alla tua versione di NethSecurity.

Se stai utilizzando NethSecurity 8.8, usa:

    apk update
    apk add etherwake

Se stai utilizzando NethSecurity 8.7.2 o precedente, usa:

    opkg update
    opkg install etherwake

:::note

A partire dalla versione 8.7.2, i pacchetti extra vengono reinstallati automaticamente dopo l'aggiornamento del sistema. Per le versioni precedenti e per ulteriori informazioni, consulta questa documentazione: [Ripristina pacchetti extra](../system/updates.md#restore_extra_packages-section).

:::

## Utilizzo

Per riattivare un dispositivo nella LAN, devi conoscere:

- l'`indirizzo MAC` del dispositivo da accendere
- l'`interfaccia di rete NethSecurity` a cui è collegato il dispositivo (ad es. `eth0`)

Il comando di base è:

    etherwake -i <interface> <MAC>

Esempio:

    etherwake -i eth0 00:11:22:33:44:55
