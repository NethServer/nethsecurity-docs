---
title: "Filtro Deep Packet Inspection (DPI)"
sidebar_position: 4
---

# Filtro Deep Packet Inspection (DPI) {#dpi_filter-section}

NethSecurity utilizza [Netify Agent](https://www.netify.ai/resources) per impiegare tecniche di Deep Packet Inspection (DPI) per il filtraggio del traffico di rete.

Netify Agent funziona come server di deep-packet inspection, sfruttando nDPI (precedentemente OpenDPI) per identificare protocolli e applicazioni di rete. Le informazioni rilevate possono essere archiviate localmente, accedute tramite socket UNIX o TCP, oppure inviate tramite richieste HTTP POST a un server remoto di terze parti. Dettagli quali metadati di flusso, statistiche di rete e classificazioni di rilevamento possono essere utilizzati per prendere decisioni sul flusso.

Ecco come funziona:

- Netify Agent valuta ogni flusso rispetto alle regole DPI e assegna un'etichetta alle connessioni che corrispondono a una regola
- le regole nft bloccano quindi le connessioni etichettate da una regola con azione **Blocca**

Il motore DPI è sempre in esecuzione: il traffico viene filtrato non appena almeno una regola è abilitata.

La pagina **Filtro DPI** è suddivisa in due schede:

- **Regole**: l'elenco ordinato delle regole che consentono o bloccano il traffico
- **Gruppi di applicazioni**: insiemi riutilizzabili di applicazioni, protocolli e categorie utilizzati dalle regole

## Gruppi di applicazioni {#application-groups}

Un gruppo di applicazioni è un insieme con nome di applicazioni, protocolli, categorie di applicazioni e categorie di protocolli. I gruppi vengono creati una sola volta e possono essere utilizzati da un numero qualsiasi di regole.

Per creare un nuovo gruppo, aprire la scheda **Gruppi di applicazioni** e fare clic su **Crea gruppo di applicazioni**:

- **Nome del gruppo**: un nome univoco per il gruppo, fino a 64 caratteri
- schede **Applicazioni** e **Protocolli**: permettono di selezionare il contenuto del gruppo. Gli elementi sono organizzati per categoria:
  - selezionando una categoria si includono tutti gli elementi di quella categoria, compresi quelli che verranno aggiunti in futuro dagli aggiornamenti delle firme
  - facendo clic su una categoria, si visualizzerà il contenuto e si potranno selezionare i singoli elementi
  - utilizzando il campo di filtro e l'opzione **Mostra solo i selezionati** sarà possibile ricercare più rapidamente gli elementi

Gli elementi selezionati sono elencati nel pannello **Selezionati**, dal quale possono anche essere rimossi. Un gruppo deve contenere almeno un'applicazione, un protocollo o una categoria.

Dall'elenco dei gruppi, ogni gruppo può essere modificato, duplicato o eliminato. La colonna **Usato da regole** mostra quali regole fanno riferimento al gruppo: un gruppo utilizzato da una o più regole non può essere eliminato.

## Regole {#rules}

Le regole DPI decidono se il traffico corrispondente viene consentito o bloccato. Le regole vengono valutate **dall'alto verso il basso e prevale la prima regola corrispondente**: una regola non si applica mai al traffico già corrispondente a una regola posta più in alto. Il traffico che non corrisponde ad alcuna regola viene consentito.

Questo permette di combinare regole **Consenti** e **Blocca**. Ad esempio, per bloccare i servizi di streaming per l'intera LAN tranne che per un singolo host:

1. una regola **Consenti** che corrisponde a tutto il traffico da `192.168.1.10`
2. una regola **Blocca** che corrisponde al gruppo di applicazioni di streaming da `192.168.1.0/24`

Per creare una nuova regola, aprire la scheda **Regole** e fare clic su **Aggiungi regola**. Se la regola deve corrispondere ad applicazioni specifiche, i gruppi di applicazioni devono essere creati prima. La procedura guidata di creazione della regola prevede quattro passaggi:

1. **Generale**: il **Nome** della regola e il suo **Stato** (abilitata o disabilitata)
2. **Sorgente**: scegliere **Qualsiasi indirizzo sorgente** per applicare la regola a tutti gli host, oppure **Inserisci uno o più indirizzi** per restringerla. Ogni voce può essere un indirizzo IP, una rete CIDR (ad es. `10.10.10.0/24`) o un intervallo di IP (ad es. `10.10.10.1-10.10.10.5`)
3. **Corrispondenza e azione**:
   - **Tipo di corrispondenza**: **Gruppi di applicazioni** corrisponde al traffico dei gruppi selezionati, mentre **Tutto il traffico** corrisponde a ogni flusso proveniente dalla sorgente
   - **Azione**: **Blocca il traffico corrispondente** oppure **Consenti il traffico corrispondente**
   - **Posizione della regola**: aggiungere la nuova regola all'**Inizio dell'elenco** oppure alla **Fine dell'elenco**
4. **Riepilogo**: verificare le impostazioni della regola prima di salvarla

Dall'elenco delle regole, ogni regola può essere:

- modificata
- abilitata o disabilitata
- duplicata
- eliminata
- spostata con il trascinamento (drag and drop) per modificare l'ordine di valutazione; il riordino è disponibile solo quando all'elenco non è applicato alcun filtro

L'elenco può essere filtrato per nome, sorgente, tipo di corrispondenza e azione.

### Traffico del firewall e WAN {#firewall-and-wan-traffic}

Le regole DPI non possono mai bloccare il firewall stesso: gli indirizzi IP di tutte le interfacce del firewall sono sempre esclusi dalle regole, quindi una regola non può impedire l'accesso all'amministratore. Anche i flussi rilevati sulle interfacce WAN sono esclusi dalle regole.

### Regole personalizzate {#custom-rules}

Le regole non create dall'interfaccia web, come quelle scritte manualmente o migrate da una versione precedente, sono contrassegnate come **Personalizzata**. Le regole personalizzate possono essere abilitate, disabilitate, spostate, rinominate o eliminate, ma i loro criteri di corrispondenza non possono essere modificati dall'interfaccia web.

### Aggiornamento dalle versioni precedenti {#upgrade-from-previous-versions}

Le versioni precedenti configuravano le regole DPI per singola interfaccia di rete, con un elenco separato di eccezioni. La configurazione viene convertita automaticamente durante l'aggiornamento e anche durante il ripristino di un vecchio backup:

- ogni regola che blocca applicazioni o protocolli diventa una regola **Blocca** **Personalizzata** che mantiene il comportamento originale
- ogni eccezione diventa una regola **Consenti** posizionata all'inizio dell'elenco, con il nome ricavato dalla descrizione dell'eccezione
- le regole con un'azione QoS (bulk, best effort, video, voice) e le regole che non corrispondono a nulla vengono rimosse, poiché queste azioni non sono più supportate

Le regole rimosse vengono registrate in `/var/log/messages`. Per sfruttare appieno le nuove funzionalità, valutare la sostituzione delle regole **Personalizzata** migrate con nuove regole basate sui gruppi di applicazioni.

## Firme di applicazioni Premium {#premium-application-signatures}

:::note

Abbonamento richiesto

Questa funzione è disponibile solo se il firewall ha un [abbonamento Community o Enterprise](../system/subscription.md) valido.

:::

In assenza di un abbonamento, il sistema riconosce intrinsecamente una baseline di circa 200 applicazioni e 300 protocolli. Con un abbonamento attivo, questa capacità si espande significativamente fino a circa 2500 applicazioni, e l'elenco delle applicazioni riconosciute viene aggiornato quotidianamente, assicurando che il sistema sia al passo con il panorama delle applicazioni e dei servizi digitali in continua evoluzione.

Per maggiori dettagli sulle licenze di applicazioni e protocolli, consultare la [pagina sulle licenze di Netify DPI](https://www.netify.ai/products/netify-dpi/licensing).

Senza abbonamento, l'editor dei gruppi di applicazioni mostra il catalogo completo, ma gli elementi non riconosciuti dalle firme community sono contrassegnati come **Disponibile solo con sottoscrizione enterprise** e non possono essere selezionati. Utilizzare le opzioni **Mostra solo le app community** e **Mostra solo i protocolli community** per nasconderli.

### Elenco di applicazioni e protocolli

L'elenco completo di tutte le applicazioni e i protocolli supportati dalla versione Enterprise è disponibile qui:

- [Applicazioni](https://www.netify.ai/resources/applications_reference)
- [Protocolli](https://www.netify.ai/resources/protocols)

## Registrazione delle connessioni bloccate {#logging-blocked-connections}

Le connessioni bloccate possono essere registrate in `/var/log/messages` con il prefisso `DPI block: `. Per abilitare la registrazione:

    uci set dpi.config.log_blocked=1
    uci commit dpi
    /etc/init.d/dpi reload

## Bypass del traffico Netify

Per impostazione predefinita, Netifyd elabora tutto il traffico che passa da, verso e attraverso il firewall. In alcuni casi può essere utile escludere completamente dall'analisi del traffico determinati host o sottoreti. I bypass si configurano usando le opzioni `bypassv4` e `bypassv6`, che accettano un elenco di indirizzi IP o sottoreti CIDR. È possibile aggiungere una descrizione dopo il carattere `|` pipe.

Per aggiungere una nuova voce di bypass:

    uci add_list netifyd.config.bypassv4='10.45.23.0/24|Rete remota'
    uci add_list netifyd.config.bypassv4='192.168.5.164|Host critico'
    uci commit netifyd
    reload_config

Per modificare e gestire le voci di lista UCI, fare riferimento alla sezione [gestione delle liste UCI](../../tutorial/uci.md#uci-lists).

Per visualizzare le voci di bypass applicate e la configurazione di acquisizione di netifyd:

    nft list table inet netifyd
