---
title: "Sistema di prevenzione delle intrusioni (Snort)"
sidebar_position: 6
---

# Sistema di prevenzione delle intrusioni (Snort) {#intrusion_prevention_system-section}

Snort 3 è un Sistema di Prevenzione delle Intrusioni (IPS) di rete open-source in grado di eseguire analisi del traffico in tempo reale e registrazione dei pacchetti sulle reti IP. È in grado di eseguire analisi dei protocolli, ricerca/corrispondenza dei contenuti e può essere utilizzato per rilevare una varietà di attacchi e sonde, come buffer overflow, port scan furtivi, attacchi CGI, sonde SMB, tentativi di identificazione del sistema operativo e molto altro ancora.

## Abilita IPS

IPS è disabilitato per impostazione predefinita. Per abilitarlo, vai alla pagina `IPS` nella sezione `Security`. L'interfaccia indicherà che il servizio è disabilitato e fornirà un collegamento rapido per accedere direttamente alla scheda `Settings`.

Una volta attivato l'interruttore **Status**, potrai configurare il servizio.

### Politica delle regole

Le regole sono raggruppate in politiche, ogni politica è un insieme di regole ottimizzate per un caso d'uso specifico. Le politiche sono:

- **connectivity**: prioritaria le prestazioni sulla sicurezza, minimizzando i falsi positivi e garantendo alte prestazioni del dispositivo mentre rileva le minacce comuni.
- **balanced**: consigliata per distribuzioni iniziali, bilanciando sicurezza e prestazioni con un tasso di prestazioni relativamente elevato insieme a strumenti di valutazione e test.
- **security**: per ambienti ad alta sicurezza con larghezza di banda inferiore e tolleranza ai falsi positivi più elevata. Fornisce la massima protezione riducendo al minimo il rischio di interrompere la rete.

### Reti domestiche

Le reti domestiche definiscono le reti interne protette e specificano gli indirizzi IP o le subnet che IPS dovrebbe considerare come reti locali, consentendogli di distinguere il traffico interno da quello esterno e riducendo i falsi positivi nel rilevamento delle minacce.

Seleziona una politica, definisci le tue reti domestiche e quindi fai clic sul pulsante **Save** per salvare le modifiche.

:::note

I valori di Home Networks non vengono aggiornati automaticamente. Se l'indirizzo IP di un'interfaccia locale cambia e ciò determina una rete diversa, la configurazione Home network di IPS deve essere aggiornata manualmente per riflettere la nuova rete.

:::

### Abilita Hyperscan

Hyperscan è un motore di pattern matching avanzato che può migliorare le prestazioni di Snort3 su hardware supportato. Richiede che flag del processore specifici siano supportati dalla tua CPU.

Prima di abilitare Hyperscan, verifica che il tuo processore supporti i flag della CPU richiesti:

``` bash
grep --color=auto -E 'sse3|ssse3|sse4_1|sse4_2|avx|avx2' /proc/cpuinfo
```

Se il comando restituisce risultati, il tuo processore è compatibile con Hyperscan.

Per abilitare Hyperscan, innanzitutto crea il file di configurazione in `/etc/snort/hyperscan.config`:

``` bash
cat > /etc/snort/hyperscan.config << 'EOF'
search_engine = { search_method = hyperscan }
detection = { hyperscan_literals = true, pcre_to_regex = true }
EOF
```

Quindi abilitalo con i seguenti comandi:

``` bash
uci set snort.snort.include=/etc/snort/hyperscan.config
uci commit snort
reload_config
```

Per disabilitare Hyperscan:

``` bash
uci del snort.snort.include
uci commit snort
reload_config
```

:::note

Hyperscan è una funzione opzionale di miglioramento delle prestazioni. Abilitalo solo se la tua CPU supporta i flag del processore richiesti e desideri migliorare le prestazioni di IPS al costo di requisiti di funzionalità CPU più elevati.

:::

## Accesso alle regole Snort tramite Oinkcode {#oinkcode-section}

NethSecurity supporta l'utilizzo di un abbonamento Snort per ottenere le regole `Registered` e `Subscriber` tramite Oinkcode. L'`Oinkcode` è un codice univoco assegnato agli utenti registrati su Snort.org, questo codice è necessario per autenticare il download delle regole Snort.

### Categorie di regole disponibili

- **Community Rules (Regole gratuite)**: Disponibili per tutti gli utenti registrati senza restrizioni. Gestite dalla comunità Snort. Forniscono protezione di base ma ricevono aggiornamenti meno frequenti rispetto alle regole ufficiali. Non è richiesto alcun Oinkcode per accedere a queste regole.
- **Registered Rules (Regole gratuite con ritardo)**: Regole ufficiali aggiornate dal team di Snort. Disponibili gratuitamente per gli utenti registrati, ma con un ritardo di 30 giorni rispetto all'ultima versione. Oinkcode è richiesto per accedere a queste regole.
- **Subscriber Rules (Regole a pagamento, aggiornamenti in tempo reale)**: Accesso immediato alle regole più aggiornate senza alcun ritardo. Disponibili solo per gli utenti con un abbonamento Snort Subscriber Rule Set. Oinkcode è richiesto per accedere a queste regole.

### Come ottenere e utilizzare l'Oinkcode

- Registrati su Snort.org
- Recupera il tuo Oinkcode dalla sezione del profilo dell'account
- Su NethSecurity, incolla il tuo codice personale nel campo `Oinkcode`. Puoi verificare se il codice è valido facendo clic sul pulsante **Test code**

## Elenco degli eventi di oggi

IPS controlla automaticamente il traffico all'interno della rete e genera avvisi o blocca il traffico in base al ruleset. Un elenco consultabile può essere trovato nella scheda `Today event list`. Durante la navigazione nell'elenco, puoi visualizzare le regole che hanno attivato l'avviso, gli indirizzi IP di origine e destinazione, il protocollo e l'azione intrapresa dal sistema.

Questo elenco può essere filtrato utilizzando la casella di filtro nella parte superiore della pagina. Inoltre, per ogni record visualizzato, è possibile saltare direttamente alla documentazione della regola facendo clic sull'ID della regola.

Facendo clic sull'icona del menu sul lato destro del record, è possibile aprire un modulo precompilato per sopprimere o disabilitare la regola che ha generato l'avviso.

## Bypass del filtro

Tutto il traffico che passa attraverso il firewall viene analizzato da IPS. Il sistema supporta regole di bypass per indirizzi IPv4 e IPv6 specifici. Qualsiasi indirizzo IP aggiunto a una regola di bypass verrà valutato sia per il traffico in ingresso che in uscita.

A tal fine, passa alla scheda `Filter bypass` e premi il pulsante **Add bypass**. Un modulo è fornito per aggiungere una regola di bypass per un indirizzo IP specifico, la regola si applica al traffico in entrambe le direzioni e include i seguenti campi:

- `Address type`: se l'indirizzo IP fornito è IPv4 o IPv6
- `IP address`: l'indirizzo IP o CIDR da bypassare
- `Description`: una descrizione della regola di bypass, è opzionale e può essere omessa

## Disabilita regole

In alcuni ambienti, le regole possono essere troppo restrittive o generare troppi falsi positivi. Per evitare ciò, è possibile disabilitare alcune regole. Una regola disabilitata è una regola che non è inclusa nel ruleset di Snort.

Passa alla scheda `Disabled Rules` e premi il pulsante **Disable rule**. Il sistema richiederà i seguenti campi:

- `GID`: il GID della regola, è un numero ed è solitamente sempre `1`
- `SID`: il SID della regola, è un numero
- `Description`: una descrizione della regola disabilitata, è opzionale e può essere omessa

## Avvisi soppressi

Una regola di soppressione è una regola che viene ignorata da Snort per un indirizzo IP o CIDR specifico. La regola è ancora valutata per tutti gli altri indirizzi IP.

Per aggiungere una regola di soppressione, passa alla scheda `Suppressed alerts` e premi il pulsante **Suppress alert**. Compila i campi con le seguenti informazioni:

- `GID`: il GID della regola, è un numero ed è solitamente sempre `1`
- `SID`: il SID della regola, è un numero
- `Direction`: se la soppressione è per l'indirizzo IP di origine o destinazione
- `IP address`: l'indirizzo IP per cui sopprimere l'avviso, può essere un intervallo CIDR
- `Description`: una descrizione della regola di soppressione, è opzionale e può essere omessa
