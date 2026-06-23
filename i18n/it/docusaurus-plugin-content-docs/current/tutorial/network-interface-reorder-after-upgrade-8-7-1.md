---
title: "Spostamento schede di rete dopo aggiornamento a versione 8.7.1 e successive"
sidebar_position: 10
---
# Spostamento schede di rete dopo aggiornamento a versione 8.7.1 e successive

## Problema

In rari casi, dopo l'aggiornamento, **l'ordine di alcune schede di rete può risultare modificato**, compromettendo così il funzionamento del firewall e l'accessibilità al sistema.

## Quando si verifica il problema

- Aggiornamento alla versione **8.7.1 o successiva** da una qualsiasi versione precedente di NethSecurity 8 (compresa la 8-24.10.0-ns.1.6.0)
- Presenza di più **tipi di schede di rete** con **marche o driver differenti**

:::note
La presenza di schede diverse **non implica automaticamente** che il problema si presenti. Nella maggior parte dei casi l'aggiornamento procede senza impatti.
:::

## Quando NON si verifica il problema

- Box Nethesis
- Apparati con **tutte le schede dello stesso tipo**
- Migrazioni da **NethSecurity 7.9** che non sono affette nemmeno con hardware eterogeneo

## Quali verifiche fare

Se sospetti che un server possa rientrare nei casi a rischio, controlla l'output di **`lspci`** per verificare la presenza di schede eterogenee. Esempio di macchina potenzialmente a rischio (schede Intel e Realtek):

```
root@nethesis:~# lspci -nn | grep 0200
00:1f.6 Ethernet controller [0200]: Intel Corporation Ethernet Connection (2) I219-V [8086:15b8] (rev 31
01:00.0 Ethernet controller [0200]: Realtek Semiconductor Co., Ltd. RTL8111/8168/8211/8411 PCI Express Gigabit Ethernet Controller [10ec:8168] (rev 06)
02:00.0 Ethernet controller [0200]: Realtek Semiconductor Co., Ltd. RTL8111/8168/8211/8411 PCI Express Gigabit Ethernet Controller [10ec:8168] (rev 06)
```

- Pianifica l'aggiornamento con attenzione se la macchina risulta potenzialmente problematica
- Se utilizzi spesso gli stessi modelli di hardware, tieni presente che i comportamenti tendono a ripetersi:
  - se una macchina presenta il problema, è probabile che anche le altre simili lo presentino
  - se una non lo presenta, è probabile che anche le altre funzionino correttamente

## Fix

Per chi non ha ancora aggiornato i sistemi assemblati con schede ethernet di produttori diversi, è disponibile uno strumento per eseguire l'upgrade che preserva la configurazione di rete.

Istruzioni rapide:

```bash
# Scaricare lo script
curl -fsSL https://docs.nethsecurity.org/_static/tutorial/network-interface-reorder-after-upgrade-8-7-1/ns-upgrade-fix-eth -o /root/ns-upgrade-fix-eth
# Renderlo eseguibile
chmod a+x /root/ns-upgrade-fix-eth
# Eseguirlo
/root/ns-upgrade-fix-eth
```

### Cosa fa

1. **Prima dell'aggiornamento**: salva gli indirizzi MAC ethernet in `/root/eth-mac-mapping` e configura l'auto-correzione al prossimo avvio.
2. Chiede se installare subito l'update, lo scarica e riavvia. Se non puoi riavviare subito, usa la UI di NethSecurity per eseguire l'update nel momento più opportuno oppure per schedularlo. **L'importante è non riavviare NethSecurity prima di aver aggiornato.**
3. **Dopo l'aggiornamento**: rileva eventuali cambiamenti dei nomi ethernet tramite MAC, aggiorna `/etc/config/network` per utilizzare i nuovi nomi di dispositivo, riavvia se i nomi sono cambiati.
4. Se non è cambiato nulla, logga senza fare altro. Il riavvio addizionale in caso di cambiamenti aumenta di circa un minuto i tempi di aggiornamento (dipende dal BIOS).

Logga tutte le attività in `/var/log/messages` e in `/root/ns-upgrade-fix-eth.log`.

---

Riferimento: [Partner Forum](https://partner.nethesis.it/t/spostamento-schede-di-rete-dopo-aggiornamento-a-versione-8-7-1/9678/15)
