---
title: "Controller RAID hardware"
sidebar_position: 7
---
# Controller RAID hardware

E' possibile installare NethSecurity 8 su hardware di classe enterprise ma è importante tenere conto di alcuni limiti legati alla compatibilità dei driver, in particolare per i controller RAID hardware.

NethSecurity 8 è basato su una distribuzione minimalista che non include tutti i driver proprietari presenti nei sistemi operativi general purpose.

### NethSecurity 8 si avvia da USB, ma `ns-install` non rileva lo storage

Questo comportamento è tipico quando il controller RAID del server non è riconosciuto dal sistema.
In genere, ciò accade perché il controller:
- non è supportato out-of-the-box
- oppure richiede driver specifici non inclusi nell’immagine di installazione.

### Possibili soluzioni

#### **Impostare il controller RAID in modalità HBA (Host Bus Adapter)**
Se il controller lo consente, impostarlo in modalità HBA permette di esporre i dischi direttamente al sistema, evitando l’utilizzo di driver specifici.

#### **Verificare la presenza di un controller integrato SATA**
Alcuni server includono un controller SATA di base (non-RAID). Se disponibile, è consigliabile collegare il disco direttamente a questo controller.

#### **Utilizzare un virtualizzatore**
Come ultima alternativa, è possibile installare NethSecurity come macchina virtuale (ad esempio con Proxmox o VMware ESXi) e assegnare un disco virtuale, bypassando la gestione diretta dell’hardware RAID.
