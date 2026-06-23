---
title: "Tunnel OpenVPN personalizzato"
sidebar_position: 5
---

# Tunnel OpenVPN personalizzato {#custom_openvpn_tunnel-section}

Questa guida spiega come configurare un client OpenVPN su NethSecurity utilizzando un file di configurazione (`myvpn.ovpn`) fornito da un provider di servizi VPN. La configurazione garantisce che la VPN si avvii automaticamente all'avvio del firewall.

## Prerequisiti

- Un file di configurazione OpenVPN valido (`myvpn.ovpn`) dal tuo provider VPN.
- Accesso al terminale di NethSecurity tramite SSH.
- Familiarità di base con il sistema UCI (Unified Configuration Interface) in OpenWrt/NethSecurity.

### Note aggiuntive sulla configurazione CLI

- Questa procedura non include alcuna validazione dei dati inseriti. Pertanto, è pensata per essere eseguita da utenti avanzati familiari con l'ambiente NethSecurity e le configurazioni OpenVPN.
- La VPN creata utilizzando questo metodo non apparirà nell'interfaccia web di NethSecurity e può essere gestita solo tramite l'interfaccia a riga di comando (CLI).
- È fondamentale evitare di utilizzare lo stesso nome per una VPN creata tramite CLI e una configurata attraverso l'interfaccia web di NethSecurity. Poiché non ci sono misure di sicurezza per prevenire conflitti di denominazione, tale sovrapposizione potrebbe causare problemi di configurazione.

Per questi motivi, si consiglia cautela e attenzione ai dettagli quando si esegue questa procedura.

## Configurare la VPN

### 1. Posizionare il file di configurazione nella directory corretta {#place-the-configuration-file-in-the-correct-directory}

1.  Copia il file `myvpn.ovpn` nella directory `/etc/openvpn/`. Usa SCP o uno strumento simile per trasferire il file: :

        scp myvpn.ovpn root@<NethSecurity_IP>:/etc/openvpn/

2.  Assicurati di impostare i permessi file corretti: :

        chmod 644 /etc/openvpn/myvpn.ovpn
        chown root:root /etc/openvpn/myvpn.ovpn

### 2. Creare una nuova configurazione client OpenVPN in UCI {#create-a-new-openvpn-client-configuration-in-uci}

1.  Aggiungi una nuova sezione OpenVPN nel database UCI chiamata `myvpn`, collega il file di configurazione a questa sezione e abilita la VPN: :

        uci add openvpn openvpn
        uci rename openvpn.@openvpn[-1]='myvpn'
        uci set openvpn.myvpn.enabled='1'
        uci set openvpn.myvpn.config='/etc/openvpn/myvpn.ovpn'

2.  Esegui il commit delle modifiche per salvare la configurazione: :

        uci commit openvpn

### 3. Avviare il client VPN immediatamente {#start-the-vpn-client-immediately}

Per avviare il client VPN senza riavviare il sistema, esegui: :

    /etc/init.d/openvpn restart

Questo riavvierà tutti i tunnel OpenVPN configurati.

### 4. Verificare che la VPN sia in esecuzione {#verify-the-vpn-is-running}

Per assicurarti che OpenVPN stia utilizzando il file di configurazione corretto e sia in esecuzione come previsto, controlla i processi attivi: :

    ps -ef | grep myvpn

L'output dovrebbe assomigliare al seguente (esempio di nome di configurazione `myvpn`): :

    4913 ?        S      0:00 /usr/sbin/openvpn --syslog openvpn(myvpn) --status /var/run/openvpn.myvpn.status --cd /etc/openvpn --config myvpn.ovpn --up /usr/libexec/openvpn-hotplug up myvpn --down /usr/libexec/openvpn-hotplug down myvpn --route-up /usr/libexec/openvpn-hotplug route-up myvpn --route-pre-down /usr/libexec/openvpn-hotplug route-pre-down myvpn --script-security 2

Conferma che il parametro `--config` punti al file di configurazione corretto (ad es., `myvpn.ovpn`). Assicurati che tutti i riferimenti (ad es., `myvpn`) corrispondino alla tua configurazione VPN desiderata.

Controlla i log di OpenVPN per confermare la connessione: :

    tail -f /var/log/messages | grep openvpn

Dovresti vedere voci di log che indicano una connessione riuscita.

:::note

- **Coerenza del nome del file:** Il nome di configurazione `myvpn` deve corrispondere al nome della sezione OpenVPN in UCI e alla posizione del file di configurazione. Se modifichi il nome, assicurati che tutti i riferimenti a `myvpn` nei comandi e nei nomi dei file siano aggiornati.
- **Avvio automatico:** Impostando `enabled='1'`, il client VPN si avvierà automaticamente ogni volta che il firewall si avvia.

:::

## Configurare le credenziali di autenticazione (opzionale)

Se la VPN richiede un nome utente e una password, crea un file di autenticazione.

1.  Crea un file denominato `/etc/openvpn/myvpn.auth` (sostituisci `myvpn` con il nome della VPN se diverso): :

        vi /etc/openvpn/myvpn.auth

2.  Aggiungi il seguente contenuto, sostituendo `frank` e `frank_password` con il tuo nome utente e la tua password: :

        frank
        frank_password

3.  Salva e imposta i permessi corretti: :

        chmod 600 /etc/openvpn/myvpn.auth
        chown root:root /etc/openvpn/myvpn.auth

4.  Aggiorna il file di configurazione OpenVPN (`myvpn.ovpn`) per fare riferimento al file di autenticazione. :

        echo "auth-user-pass /etc/openvpn/myvpn.auth" >>  /etc/openvpn/myvpn.ovpn

:::note

File di autenticazione: quando si utilizza un file di autenticazione, assicurati che abbia autorizzazioni ristrette (`600`) per proteggere le informazioni sensibili.

:::

## Configurare il firewall per consentire il traffico per la VPN

Per abilitare il traffico attraverso la VPN, è necessario configurare il firewall su NethSecurity. La best practice è assegnare un nome di dispositivo fisso alla VPN, creare una zona dedicata per la VPN personalizzata e associare il dispositivo VPN a quella zona.

### 1. Fissare il nome del dispositivo VPN {#fix-the-vpn-device-name}

Per garantire che il nome del dispositivo VPN rimanga coerente e eviti l'assegnazione automatica, è fondamentale fissare il nome nel file di configurazione OpenVPN. Modifica il file (`/etc/openvpn/myvpn.ovpn`) per cambiare `dev tun` in `dev tunmyvpn` e aggiungi la seguente riga (questo esempio è realizzato con una vpn *routed*): :

    dev-type tun

:::warning

Ricorda che il nome dell'interfaccia (indicato come `tunmyvpn` nell'esempio) non deve superare i 13 caratteri.

:::

### 2. Creare una zona firewall {#create-a-firewall-zone}

Dall'interfaccia web di NethSecurity, crea una nuova zona firewall denominata `myzone`. Configura questa zona per consentire l'accesso alle risorse richieste.

### 3. Associare il dispositivo VPN alla zona {#associate-the-vpn-device-with-the-zone}

Per associare il dispositivo VPN alla zona firewall `myzone`, esegui i seguenti passaggi nella riga di comando:

1.  Aggiungi il dispositivo VPN (`tunmyvpn`) alla zona firewall: :

        uci add_list firewall.ns_myzone.device=tunmyvpn
        uci commit firewall

2.  Riavvia il firewall per applicare le modifiche: :

        /etc/init.d/firewall restart

Questi cambiamenti assicurano che il dispositivo VPN avrà sempre il nome `tunmyvpn`, prevenendo potenziali problemi con l'associazione della zona firewall.

## Disabilitare il tunnel

Se desideri impedire che la VPN si avvii automaticamente all'avvio del firewall, puoi disabilitarla usando i seguenti comandi.

1.  Disabilita la VPN in UCI: :

        uci set openvpn.myvpn.enabled='0'
        uci commit openvpn

2.  Riavvia tutti i tunnel VPN attivi. Questo comando interromperà tutti i tunnel e riavvierà completamente solo quelli con il valore enabled impostato a 1: :

        /etc/init.d/openvpn restart
