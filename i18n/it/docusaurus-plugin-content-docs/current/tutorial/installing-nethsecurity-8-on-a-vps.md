---
title: "Installazione su VPS"
sidebar_position: 9
---

# Installazione su VPS

Alcuni provider cloud non consentono di caricare direttamente un'immagine disco sui propri
server, il che può rendere complicata l'installazione di sistemi come NethSecurity 8.

Puoi aggirare questo limite installando una distribuzione Linux (CentOS, Rocky, Alma, Ubuntu,
Fedora, Debian) che disponga dei tool `dd`, `zcat` e `curl`.

Questi strumenti ti consentono di scaricare, decomprimere e scrivere l'immagine direttamente sul
disco della VPS.

## Passaggi principali

1. Scarica l'immagine: usa `curl` per scaricare l'[ultima immagine stable](../administrator-manual/installation/download.mdx).
2. Scrivi l'immagine su disco: decomprimi e scrivi l'immagine direttamente sul disco della VPS
   con `zcat` e `dd`.
3. Riavvia la VPS: dopo aver completato la scrittura dell'immagine, riavvia la macchina per
   avviare NethSecurity.

## Esempio di installazione su una VPS (Digital Ocean)

Di seguito trovi un esempio pratico di come installare NethSecurity 8 su un Droplet Digital
Ocean.

**Nota:** il nome del disco potrebbe cambiare in base al provider cloud utilizzato. In questo
esempio è `/dev/vda`.

Usa `lsblk` per visualizzare l'elenco dei dispositivi di blocco e identificare il nome del disco
della VPS.

1. Scarica l'immagine compressa di NethSecurity nella directory `/tmp` della VPS:

   ```bash
   curl -o /tmp/nsec.img.gz "https://updates.nethsecurity.nethserver.org/stable/8-24.10.0-ns.1.6.0/targets/x86/64/nethsecurity-8-24.10.0-ns.1.6.0-x86-64-generic-squashfs-combined-efi.img.gz"
   ```

2. Decomprimi l'immagine con `zcat` e scrivila direttamente sul disco con `dd`.

   È importante notare che in questo esempio il disco è `/dev/vda`. Se il disco ha un nome
   diverso, per esempio `/dev/sda` o `/dev/nvme0n1`, modifica il comando di conseguenza.

   ```bash
   zcat /tmp/nsec.img.gz 2>/dev/null | dd of=/dev/vda bs=1M iflag=fullblock conv=fsync status=progress
   ```

3. Riavvia la macchina

   ```bash
   reboot -f
   ```
