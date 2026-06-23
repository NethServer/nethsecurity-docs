---
title: "Filtraggio dei contenuti"
sidebar_position: 1
---

# Filtraggio dei contenuti

Il filtraggio dei contenuti è un aspetto cruciale della sicurezza di rete, con due scopi primari:

1.  Bloccare il malware e prevenire attacchi dannosi
2.  Filtrare siti indesiderati, come quelli contenenti contenuti per adulti

NethSecurity offre quattro distinti meccanismi di filtraggio per affrontare queste esigenze:

- **Threat Shield IP**: Sistema di blocco basato su IP per contrastare minacce malware
- **Threat Shield DNS**: Sistema di blocco basato su DNS per malware e filtraggio contenuti di base
- **Filtro Deep Packet Inspection (DPI)**: Filtraggio specifico per applicazioni e protocolli mediante netifyd
- **Filtro DNS FlashStart**: Soluzione commerciale di filtraggio basata su DNS con funzionalità complete di controllo dei contenuti

## Threat Shield IP

Threat Shield IP è un sistema di blocco basato su IP progettato specificamente per combattere le minacce malware. Funziona bloccando le connessioni verso o da indirizzi IP noti come dannosi.

**Ambito**: Targets malware e fornisce funzionalità limitate di privacy e rimozione della pubblicità (ads)

**Liste**:

- Liste della comunità, gratuite, che mirano al malware generale, ads e tracker
- Liste aziendali, a pagamento, focalizzate sulla protezione malware di alto valore

Vantaggi:

- Elaborazione veloce poiché opera a livello di IP
- Efficace contro intere reti dannose

Limitazioni:

- Non è possibile filtrare in base al tipo di contenuto
- Potrebbe occasionalmente bloccare servizi legittimi che condividono un IP con quelli dannosi

Per configurare Threat Shield IP, vedere [Threat shield IP](./threat_shield_ip.md).

## Threat Shield DNS

Threat Shield DNS fornisce il blocco basato su DNS, offrendo protezione contro malware e capacità di filtraggio dei contenuti di base.

**Ambito**: Copre malware e categorie di contenuti limitate (ad es. contenuti per adulti, gioco d'azzardo)

**Liste**:

- Liste della comunità, gratuite, focalizzate sul malware generale e sul filtraggio dei contenuti semplice
- Liste aziendali, a pagamento, focalizzate sulla protezione malware di alto valore

Vantaggi:

- Può bloccare domini specifici indipendentemente dall'indirizzo IP
- Offre categorizzazione dei contenuti di base (ad es. adulti, gioco d'azzardo)

Limitazioni:

- Potrebbe essere bypassato utilizzando server DNS alternativi, ma può essere mitigato con filtraggio DPI e abilitando categorie di blocco speciali
- Meno granulare del filtraggio completo degli URL

Per configurare Threat Shield DNS, vedere [Threat shield DNS](./threat_shield_dns.md).

## Filtro DNS FlashStart

FlashStart è una soluzione commerciale di filtraggio basata su DNS che offre funzionalità complete di controllo dei contenuti e reporting.

**Ambito**: Filtraggio completo dei contenuti oltre a malware e contenuti per adulti

**Liste**: Liste commerciali gestite da FlashStart

Vantaggi:

- Elenchi di blocco di alta qualità
- Rapporti personalizzabili
- Configurazione basata su cloud, non è richiesto l'accesso diretto al firewall
- Categorie di contenuti estese
- Facile da gestire
- Scalabile per organizzazioni di varie dimensioni

Per configurare il filtraggio DNS FlashStart, vedere [Filtro DNS FlashStart](./flashstart.md).

## Filtro Deep Packet Inspection (DPI)

NethSecurity impiega tecniche DPI (Deep Packet Inspection) per filtrare il traffico di rete utilizzando l'Agente Netify.

**Ambito**: Filtraggio specifico per applicazioni e protocolli

**Liste**:

- Firme della comunità, gratuite ma limitate in numero e frequenza di aggiornamento
- Firme aziendali, incluse in qualsiasi abbonamento, offrendo una copertura più completa

Vantaggi:

- Fornisce controllo granulare sul traffico di rete
- Può identificare e filtrare in base ad applicazioni o protocolli specifici
- Consente la gestione del traffico dinamica in base all'analisi in tempo reale

Considerazioni:

- Potrebbe richiedere più potenza di elaborazione rispetto al filtraggio basato su IP o DNS
- Richiede una configurazione attenta per bilanciare sicurezza e prestazioni
- L'amministratore deve creare regole DPI per ogni interfaccia

Per configurare il filtraggio DPI, vedere [Filtro Deep Packet Inspection (DPI)](./dpi_filter.md).

## Confronto delle opzioni di filtraggio

| Funzionalità | Threat Shield IP | Threat Shield DNS | Filtraggio DNS Flashstart | Filtro DPI |
|----|----|----|----|----|
| Metodo di blocco | Basato su IP | Basato su DNS | Basato su DNS | Ispezione dei pacchetti |
| Enfasi principale | Malware | Malware + contenuti di base | Contenuti completi | Specifico per applicazione/protocollo |
| Tipi di liste | Comunità, Aziendali | Comunità, Aziendali | Commerciale | N/A (analisi in tempo reale) |
| Configurazione | Firewall | Firewall | Cloud | Firewall (per interfaccia) |
| Reporting | Nessuno | Nessuno | Avanzato, personalizzabile | Limitato |

**Strategie di implementazione**

Per una sicurezza ottimale, considera un approccio a strati:

1.  Utilizza Threat Shield IP come prima linea di difesa contro reti dannose note.
2.  Implementa un filtro DNS, utilizza una delle seguenti opzioni:
    - Threat Shield DNS per catturare minacce basate su dominio e fornire filtraggio dei contenuti di base, oppure
    - Filtraggio DNS Flashstart per un controllo completo dei contenuti, soprattutto in ambienti che richiedono una gestione delle policy dettagliata e reporting.
3.  Utilizza il filtraggio DPI per un controllo granulare su applicazioni e protocolli specifici, e per gestire il traffico in base all'analisi in tempo reale.

Questa combinazione fornisce una difesa a più strati, affrontando vari vettori di minaccia e esigenze di filtraggio dei contenuti.
