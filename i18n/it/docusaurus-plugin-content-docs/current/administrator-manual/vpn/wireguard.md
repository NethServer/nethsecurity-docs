---
title: "WireGuard VPN"
sidebar_position: 4
---

# WireGuard VPN

WireGuard è una moderna tecnologia VPN (Virtual Private Network) che utilizza la crittografia all'avanguardia. È progettato per essere più veloce, più semplice e più funzionale di IPsec e OpenVPN. WireGuard è una soluzione VPN sicura, veloce e facile da configurare che utilizza la crittografia di ultima generazione. È progettato per essere più semplice da configurare rispetto a OpenVPN e per offrire una minore superficie di attacco.

NethSecurity fornisce un server e un client WireGuard che possono essere configurati dall'interfaccia web.

Caratteristiche:

- Più istanze server WireGuard possono funzionare simultaneamente
- Ogni istanza opera nella propria zona di rete isolata
- Allocazione di indirizzi IP statici per ciascun peer (account client)
- Configurazione client disponibile come file di testo o codice QR
- Connessioni site-to-site (net2net) supportate
- Sicurezza migliorata con chiavi pre-condivise opzionali
- Capacità di importazione di file di configurazione standard WireGuard

## Configurazione del Server

È possibile creare più istanze server WireGuard, ognuna con la propria zona di rete isolata. NethSecurity aprirà automaticamente le porte firewall necessarie per consentire le connessioni in ingresso al server WireGuard e creerà una zona VPN per consentire la gestione del routing del traffico tra le zone.

Diversamente dal server OpenVPN, non ci sono legami con il database degli utenti, gli account (peer) vengono creati e gestiti direttamente all'interno dell'interfaccia WireGuard.

Per creare un server WireGuard, fare clic su **Aggiungi server**, quindi compilare il modulo con la configurazione desiderata. I campi sono i seguenti:

- `Stato`: abilitare o disabilitare l'istanza server WireGuard
- `Nome`: il nome dell'istanza server WireGuard, questo non è il nome dell'interfaccia di rete, verrà creato automaticamente come `wgX`, dove `X` è un numero
- `Rete VPN`: la rete CIDR che verrà utilizzata dal server WireGuard, il server otterrà automaticamente il primo IP della rete. Assicurarsi che questa rete non si sovrapponga con nessun'altra
- `Porta UDP`: la porta su cui il server WireGuard rimane in ascolto per le connessioni in ingresso
- `Endpoint pubblico`: l'indirizzo IP pubblico o l'FQDN del server

Nelle impostazioni avanzate, è possibile configurare opzioni aggiuntive:

- `MTU`: per impostare manualmente l'MTU dell'interfaccia WireGuard
- `Server DNS`: per impostare server DNS personalizzati che verranno inviati ai client, utile per evitare le fughe di DNS

Dopo aver creato il server, è possibile aggiungere nuovi client (peer) direttamente dall'interfaccia WireGuard, fare clic su **Aggiungi peer** e compilare il modulo come segue:

- `Stato`: abilitare o disabilitare il peer
- `Nome`: il nome del peer
- `IP riservato`: l'indirizzo IP statico che verrà assegnato al peer, deve essere all'interno della rete VPN, verrà pre-compilato con il successivo IP disponibile
- `Chiave pre-condivisa`: se abilitata, una chiave pre-condivisa verrà creata automaticamente per migliorare la sicurezza
- `Instrada tutto il traffico`: se abilitato, quando il client si connette, invierà tutto il traffico al server
- `Reti server`: quali reti il peer può accedere, tutte le reti LAN verranno aggiunte automaticamente
- `Reti peer`: reti raggiungibili dal lato peer. Compilare sempre questo campo quando si desidera creare un tunnel net2net

:::note

È possibile creare una connessione client-to-site (Road Warrior) lasciando vuote le voci `Reti peer`. Ciò consentiranno al client di accedere alle reti server.

:::

Una volta salvato il peer, è possibile scaricare il file di configurazione in formato testo o come codice QR utilizzando il menu sul lato destro della voce peer.

La configurazione del server e dei peer può essere modificata dal menu di contesto sul lato destro di ogni voce.

:::warning

Dopo aver modificato il server WireGuard o i peer, ricordarsi che tali modifiche devono essere applicate al peer scaricando nuovamente il file di configurazione.

:::

## Configurazione del Tunnel

Nethsecurity può essere configurato come client WireGuard (peer) per connettersi a un altro server WireGuard. Nella scheda **Tunnel peer**, è possibile aggiungere manualmente un nuovo tunnel facendo clic su **Aggiungi tunnel peer** o importare un file di configurazione wireguard generico utilizzando **Importa tunnel peer**.

Quando si aggiunge manualmente un nuovo tunnel, sono disponibili i seguenti campi:

- `Stato`: abilitare o disabilitare il tunnel
- `Nome`: il nome del tunnel, questo non è il nome dell'interfaccia di rete, verrà creato automaticamente come `wgX`, dove `X` è un numero
- `IP riservato`: l'indirizzo IP statico che il tunnel utilizzerà
- `Chiave pubblica del server`: la chiave pubblica del server WireGuard
- `Chiave privata peer`: la chiave privata del tunnel
- `Chiave pre-condivisa`: la chiave pre-condivisa, se utilizzata, il campo è facoltativo
- `Instrada tutto il traffico`: se abilitato, tutto il traffico verrà instradato attraverso il tunnel
- `Percorsi di rete`: reti rese disponibili attraverso il tunnel
- `Endpoint`: l'indirizzo IP pubblico o l'FQDN del server WireGuard
- `Porta UDP`: la porta a cui il tunnel WireGuard si connetterà
- `Server DNS`: server DNS personalizzati da utilizzare quando il tunnel è attivo

## Debug

Per impostazione predefinita, WireGuard non registra nulla. Per abilitare la registrazione su `/var/log/messages`, utilizzare i seguenti comandi:

``` bash
echo module wireguard +p > /sys/kernel/debug/dynamic_debug/control
```

Per disabilitare la registrazione, utilizzare:

``` bash
echo module wireguard -p > /sys/kernel/debug/dynamic_debug/control
```
