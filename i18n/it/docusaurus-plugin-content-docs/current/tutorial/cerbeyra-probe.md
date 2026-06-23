---
title: "Sonda Cerbeyra"
sidebar_position: 14
---
# Sonda Cerbeyra

## Cos'è Cerbeyra

[Cerbeyra](https://www.cerbeyra.com/) è una piattaforma di sicurezza che offre due servizi principali per aiutare le organizzazioni a mantenere il controllo sulla propria postura di sicurezza:

- **Vulnerability Assessment**: scansione e analisi automatizzata dei sistemi per individuare vulnerabilità di sicurezza, configurazioni errate e vulnerabilità note. Il servizio classifica e assegna priorità ai risultati, permettendo di correggere prima i problemi più critici.
- **Asset Management**: scoperta e monitoraggio continuo di tutti i dispositivi e software presenti nella rete. Disporre di un inventario accurato degli asset è la base di qualsiasi programma di sicurezza efficace — non puoi proteggere ciò che non sai che esiste.

Per eseguire scansioni di vulnerabilità sulla tua rete, Cerbeyra necessita di un tunnel VPN verso la rete da analizzare.

## Script sonda

Lo script configura NethSecurity 8 come **sonda VPN (server OpenVPN)** per i vulnerability assessment di Cerbeyra. Automatizza la creazione di un server OpenVPN, la generazione della configurazione client e le regole firewall associate.

Di default, viene scansionata la prima LAN configurata. Per modificare o aggiungere LAN, utilizza il campo **Local Networks** del Server tunnel OpenVPN `cerbeyra`.

## Requisiti

- NethSecurity 8
- Eseguire lo script come **root**
- Porta UDP libera (di default **1201**). Lo script verifica la disponibilità della porta prima di procedere.
- Eseguire in una finestra di manutenzione; lo script riavvia OpenVPN.

## Variabili principali (valori fissi nello script)

- `VPN_CIDR` = `10.244.162.0/24` — range assegnato al server/tunnel
- `VPN_PORT` = `1201` — porta usata dal server OpenVPN
- `SERVICE_NAME` = `cerbeyra` — nome servizio usato per identificatori
- `REMOTE_NETWORK` = `172.30.29.0/24` — rete fittizia di Cerbeyra (non usata nel routing)
- `ALLOWED_SOURCE` = `91.143.200.128/25` — rete remota di Cerbeyra da cui può avviarsi la VPN

Lo script può auto-determinare l'IP pubblico del gateway, oppure puoi passarlo con l'opzione `-p <public_ip>`.

## Opzioni della riga di comando

- `-i` : **Interactive mode** — conferme prima delle azioni.
- `-r` : **Remove mode** — rimuove la configurazione Cerbeyra precedentemente applicata (chiede conferma se `-i` è attivo).
- `-p <public_ip>` : fornisce l'IP pubblico da usare per il tunnel (altrimenti lo script prova ad auto-detect).

Esempio per esecuzione non-interattiva con IP pubblico:

```bash
./cerbeyra-config.sh -p 1.2.3.4
```

## Installazione

1. Scarica lo script:

```bash
curl "https://docs.nethsecurity.org/_static/tutorial/cerbeyra-probe/cerbeyra-config.sh" -o cerbeyra-config.sh
```

2. Imposta proprietario e permessi:

```bash
chown root:root cerbeyra-config.sh
chmod 700 cerbeyra-config.sh
```

3. Esegui lo script:

```bash
# Modalità interattiva (consigliata alla prima esecuzione):
./cerbeyra-config.sh -i

# Non-interattiva con IP pubblico esplicito:
./cerbeyra-config.sh -p 1.2.3.4
```

## Procedura consigliata

1. **Backup**: esegui un backup per sicurezza.
2. Verifica che la porta `1201` sia libera (lo script controlla comunque):

```bash
netstat -uln | grep 1201
```

3. Pianifica una finestra di manutenzione: avvisa gli utenti che le connessioni OpenVPN esistenti potrebbero cadere.
4. Esegui lo script come root (con `-i` se desideri conferme):

```bash
./cerbeyra-config.sh -i
```

5. **Test di connettività**: prova la VPN con l'apposito test della dashboard di Cerbeyra, oppure importa il `.json` del tunnel OpenVPN in un altro NethSecurity 8.

## Rimozione della configurazione

Usa l'opzione `-r` per rimuovere automaticamente le entry create (chiede conferma se `-i` è attivo):

```bash
./cerbeyra-config.sh -r
```

In alternativa, ripristina i file di backup creati in fase di pre-check e riavvia i servizi.

## Troubleshooting

- **Nessun traffico dopo la connessione**: controlla le regole firewall e i log di OpenVPN.
- **Testare la VPN con un altro NethSecurity**: aggiungi l'IP alla regola firewall **Input → Allow-ovpncerbeyra**.

## Raccomandazioni operative

- Esegui sempre il **backup** delle configurazioni prima di usare lo script.
- Esegui in una finestra di manutenzione (impatti su VPN esistenti).
- Dopo l'esecuzione, eventuali riconfigurazioni o gestione avanzata delle VPN possono essere fatte tramite la **UI** di NethSecurity.
