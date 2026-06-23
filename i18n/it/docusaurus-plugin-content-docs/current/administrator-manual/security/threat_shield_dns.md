---
title: "Threat shield DNS"
sidebar_position: 3
---

# Threat shield DNS {#threat_shield_dns-section}

Threat shield DNS utilizza Adblock che blocca qualsiasi richiesta verso domini considerati malintenzionati. Il servizio può caricare liste di blocco gestite dalla comunità o utilizzare feed Enterprise forniti da [Nethesis](https://www.nethesis.it) e [Yoroi](https://yoroi.company), un'azienda leader nel settore della sicurezza informatica e membro dell'alleanza [Cyber Threat Alliance](https://www.cyberthreatalliance.org).

Si noti che per accedere alle liste di blocco di Nethesis e Yoroi, l'unità deve disporre di un'autorizzazione extra valida per questo servizio.

## Configurazione {#configuration-section}

:::note

Utilizza Threat shield DNS solo se non stai già utilizzando il servizio FlashStart. Entrambi i servizi operano a livello DNS e non possono essere utilizzati insieme. L'interfaccia utente impedisce di abilitarli contemporaneamente per evitare conflitti.

:::

Il servizio è disabilitato per impostazione predefinita; per abilitarlo, vai alla pagina `Threat shield DNS` nella sezione `Security`. Accedi alla scheda `Settings` e attiva l'interruttore `Status`.

Quando il servizio è abilitato, la scheda `Blocklist sources` visualizzerà tutte le liste di blocco disponibili. Puoi abilitare o disabilitare ogni lista di blocco utilizzando l'interruttore sul lato destro dell'elenco. Le liste di blocco abilitate verranno aggiornate automaticamente a intervalli regolari.

Per specificare in quali zone il servizio deve essere attivo, selezionale nella casella combinata `Force DNS redirection on these zones`.

`Redirected ports` consente di specificare quali porte devono essere reindirizzate al servizio Threat shield DNS.

### Community blocklists {#community_blocklists-section}

Le liste di blocco della comunità provengono da contributori della comunità e bloccano vari domini relativi a: annunci pubblicitari, malware, spam, tracker, contenuti sessuali espliciti, pirateria e così via. NethSecurity le mette a disposizione così come sono.

Le liste della comunità non forniscono una metrica standardizzata di "Confidence", pertanto l'interfaccia utente mostra la loro confidenza come "Sconosciuta". Come euristica pratica, quando il nome dell'elenco contiene un indicatore di severità o di fiducia (ad esempio "lvl 1", "level 1"), generalmente indica il tasso di falsi positivi più basso e la massima confidenza; al contrario, livelli più elevati indicati (ad esempio "lvl 2", "lvl 3", "lvl 4") in genere implicano una minore confidenza e un rischio maggiore di voci aggressive o scorrette. Le convenzioni di denominazione variano e non tutti i fornitori della comunità includono tali indicatori, quindi esamina sempre il contenuto e lo scopo di una lista della comunità prima di abilitarla in produzione. Il tipo di licenza di utilizzo può variare a seconda del fornitore, quindi se l'utilizzo non è personale, potrebbe essere necessario informarsi presso il fornitore.

**Manutenzione delle liste della comunità**

Ogni lista di blocco è gestita dal suo specifico fornitore. NethSecurity include già gli URL per scaricare i feed, che sono validi al momento del rilascio. Tuttavia, poiché questi URL sono hardcoded, se il fornitore li modifica, alcune liste di blocco potrebbero non essere più scaricabili.

### Enterprise blocklists {#enterprise_blocklists-section}

:::note

Abbonamento richiesto

Questa funzione è disponibile solo se l'unità dispone di un [abbonamento Community o Enterprise](../system/subscription.md) valido.

:::

Le liste di blocco Enterprise sono specificamente focalizzate sulla sicurezza e offrono diversi vantaggi rispetto alle liste di blocco gestite dalla comunità:

1.  **Qualità e precisione**: Le liste di blocco Enterprise, come quelle fornite da Nethesis e Yoroi, sono curate e gestite da rinomati esperti di sicurezza informatica. Queste aziende hanno team dedicati che monitorano e aggiornano continuamente le liste di blocco per garantire che siano accurate ed efficaci nel bloccare il traffico malintenzionato. Ciò si traduce in un livello più elevato di qualità e precisione rispetto alle liste di blocco gestite dalla comunità, che potrebbero non ricevere lo stesso livello di attenzione e aggiornamenti.
2.  **Tempestività**: Le liste di blocco Enterprise vengono frequentemente aggiornate per includere le minacce più recenti e gli indirizzi IP malintenzionati. Esperti di sicurezza informatica come Nethesis e Yoroi monitorano attivamente le minacce emergenti e le aggiungono prontamente alle loro liste di blocco. Questo garantisce che il tuo sistema sia protetto dalle minacce più recenti ed in evoluzione.
3.  **Riduzione dei falsi positivi**: I falsi positivi si verificano quando il traffico legittimo viene bloccato per errore. Le liste di blocco Enterprise sono progettate per ridurre al minimo i falsi positivi curando e verificando attentamente gli indirizzi IP e i nomi host elencati. Le aziende dietro alle liste di blocco Enterprise hanno processi robusti in atto per garantire che solo le entità malintenzionate siano incluse nelle liste di blocco. Ciò riduce le possibilità che il traffico legittimo venga bloccato, minimizzando i disservizi alla rete o ai servizi.
4.  **Supporto Enterprise**: Le liste di blocco Enterprise spesso vengono fornite con supporto e servizi aggiuntivi personalizzati per ambienti enterprise. Questo include l'accesso al supporto tecnico, alla documentazione e all'assistenza per l'integrazione. Se si verificano problemi o domande durante l'utilizzo delle liste di blocco Enterprise, puoi contare sul supporto fornito dai esperti di sicurezza informatica per affrontarli efficacemente.

### Confidence

Le liste di blocco Enterprise includono un punteggio "Confidence" che viene visualizzato nell'interfaccia utente. Il punteggio è espresso come un valore da 1 a 10 e rappresenta la valutazione del fornitore sulla qualità dell'elenco: valori più elevati indicano una maggiore confidenza e una probabilità inferiore di falsi positivi. Questa metrica "Confidence" è disponibile solo per le liste Enterprise; le liste della comunità vengono presentate "così come sono" e visualizzano "Sconosciuta" per la confidenza.

Le liste di Yoroi e Nethesis sono liste di blocco Enterprise. Questi elenchi verranno visualizzati solo se l'unità dispone di un [abbonamento Enterprise o Community](../system/subscription.md) valido e di un'autorizzazione valida per il servizio Threat Shield.

## Filter bypass {#filter_bypass-section}

Alcuni host o subnet potrebbero aver bisogno di aggirare il filtro Threat shield DNS. Per configurare l'aggiramento dei filtri, vai alla scheda `Filter bypass` di Threat shield DNS. Utilizza il pulsante **Add bypass** per aggiungere un nuovo indirizzo all'elenco. L'indirizzo può essere un indirizzo IPv4/IPv6 valido con notazione CIDR opzionale.

## Local allowlist {#local_allowlist_dns-section}

Per consentire domini specifici che potrebbero essere inclusi nelle liste di blocco, puoi navigare alla scheda `Local allowlist` di Threat shield DNS. Utilizza il pulsante **Add domain** per aggiungere un dominio all'elenco; puoi aggiungere una descrizione al dominio per aiutarti a ricordare perché è stato aggiunto.

I domini nell'allowlist hanno priorità rispetto alle `Blocklists` e alla `Local blocklist`

## Local blocklist {#local_blocklist_dns-section}

Per bloccare domini specifici non inclusi nelle liste di blocco, puoi navigare alla scheda `Local blocklist` di Threat shield DNS. Utilizza il pulsante **Add domain** per aggiungere un dominio all'elenco; puoi aggiungere una descrizione al dominio per aiutarti a ricordare perché è stato aggiunto.

:::warning

La risoluzione DNS per i nomi elencati nella lista di blocco influenzerà anche l'unità stessa

:::

## Check if a domain is blocked {#check_domain_blocklist-section}

Se riscontri problemi con la risoluzione del dominio e desideri verificare se un dominio specifico è bloccato, puoi eseguire una query direttamente dal terminale locale.

Utilizza il seguente comando per verificare un dominio:

`/etc/init.d/adblock query \<domain\>`

Ad esempio:

`root@nethsecurity8:\~# /etc/init.d/adblock query baddomain.com`

L'output potrebbe assomigliare a questo:

    :::
    ::: domain 'baddomain.com' in active blocklist
    :::
      + baddomain.com

    :::
    ::: domain 'baddomain.com' in backups and black-/whitelist
    :::
      + adb_list.adult.gz             baddomain.com

Questo output mostra se il dominio è attualmente bloccato da una qualsiasi lista di blocco attiva. In questo esempio specifico, il dominio `baddomain.com` fa parte della categoria **adult**, come indicato da `adb_list.adult.gz`. Questo ti aiuta a identificare quale categoria o lista ha causato il blocco del dominio.

## Troubleshooting {#adblock_troubleshooting-section}

Dopo aver abilitato Adblock o modificato la sua configurazione, attendi fino a 30 secondi affinché le modifiche vengano applicate. Durante l'avvio, Adblock attende anche circa 30 secondi affinché la rete si attivi prima di caricare i feed.

Utilizza il seguente comando per verificare se Adblock è in esecuzione:

    /etc/init.d/adblock status

Se l'output mostra zero domini bloccati e nessun feed attivo, Adblock non ha ancora caricato nulla. In questo caso, lo stato potrebbe assomigliare a questo:

    ::: adblock runtime information
      + adblock_status  : enabled
      + frontend_ver    : 4.5.5-r2
      + backend_ver     : 4.5.5-r3
      + blocked_domains : 0
      + active_feeds    : -
      + dns_backend     : dnsmasq (2.91-r3), /tmp/dnsmasq.d, 3.39 MB
      + run_ifaces      : trigger: -, report: br-lan
      + run_information : base: /tmp, dns: /tmp/dnsmasq.d, backup: /tmp/adblock-backup, report: /tmp/adblock-report, error: /tmp/adb_error.log
      + run_flags       : shift: ✘, custom feed: ✔, ext. DNS (std/prot/remote/bridge): ✘/✘/✘/✘, force: ✔, flush: ✘, tld: ✔, search: ✘, report: ✔, mail: ✘, jail: ✘, debug: ✔
      + last_run        : mode: reload, date / time: 28/05/2026 13:44:31, duration: 0m 5s, memory: 3450.30 MB available
      + system_info     : cores: 2, fetch: wget, Nethesis NethBox Z1+, x86/64, NethSecurity 8.8.0-nethsecurity-8.8.20260528105131.094c098 (r32933-4ccb782af7)

Un sistema correttamente caricato dovrebbe assomigliare a questo:

    ::: adblock runtime information
      + adblock_status  : enabled
      + frontend_ver    : 4.5.5-r2
      + backend_ver     : 4.5.5-r3
      + blocked_domains : 237 974
      + active_feeds    : doh_vpn_tor_proxy gambling,
      + dns_backend     : dnsmasq (2.91-r3), /tmp/dnsmasq.ns_dnsmasq.d, 19.74 MB
      + run_ifaces      : trigger: -, report: -
      + run_information : base: /tmp, dns: /tmp/dnsmasq.ns_dnsmasq.d, backup: /tmp/adblock-backup, report: /tmp/adblock-report, error: /dev/null
      + run_flags       : shift: ✘, custom feed: ✔, ext. DNS (std/prot/remote/bridge): ✘/✘/✘/✘, force: ✔, flush: ✘, tld: ✔, search: ✘, report: ✘, mail: ✘, jail: ✘, debug: ✘
      + last_run        : mode: reload, date / time: 28/05/2026 14:30:37, duration: 0m 2s, memory: 708.93 MB available
      + system_info     : cores: 2, fetch: curl, QEMU Standard PC (Q35 + ICH9, 2009), x86/64, NethSecurity 8.8.0-nethsecurity-8.8.20260527151745.8ae1ddcc9 (r32933-4ccb782af7)

Se ci fossero stati problemi di rete e Adblock non potesse scaricare alcun feed, riavvialo:

    /etc/init.d/adblock restart

## Advanced configuration {#advanced_configuration-section}

Quando Threat shield DNS è abilitato:

- Un nuovo file di origine della categoria viene generato in base alla registrazione dell'unità e all'autorizzazione.
- Tutte le query DNS vengono reindirizzate alla macchina locale.
- Adblock è configurato per utilizzare il nuovo file di origine della categoria e verrà avviato automaticamente.

Anche se non è consigliato, è possibile utilizzare Adblock senza Threat shield DNS. Per opzioni di configurazione più dettagliate, consulta il [manuale dello sviluppatore](https://dev.nethsecurity.org/packages/ns-threat_shield/#ts-dns).
