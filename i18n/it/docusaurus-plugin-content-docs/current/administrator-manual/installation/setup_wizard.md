---
title: "Configurazione guidata"
sidebar_position: 5
---

# Configurazione guidata {#setup_wizard-section}

La prima volta che si accede all'interfaccia web, viene avviata una configurazione guidata. Questo processo guidato può aiutarti a stabilire una configurazione iniziale sicura per il firewall e assicura che l'unità sia pronta per la distribuzione in un ambiente di produzione.

:::note

Per garantire la sicurezza ottimale e un ambiente di configurazione controllato, è fortemente consigliato di completare la configurazione guidata prima di connettere il dispositivo a Internet.

:::

## Benvenuto nella configurazione guidata {#welcome-section}

Nella prima pagina della configurazione guidata, puoi fare clic su **Avvia configurazione** per avviare il processo guidato. In alternativa, puoi fare clic su **Salta configurazione** per bypassare la procedura guidata e accedere direttamente all'interfaccia web. Tuttavia, è altamente consigliato completare la configurazione guidata per garantire una configurazione sicura e funzionale.

## Passaggio 1: Modifica password root {#change_password-section}

È necessario definire una nuova password sicura per l'account root. Questa misura riduce significativamente il rischio di compromissione eliminando la dipendenza da credenziali predefinite pubblicamente note.

:::note

- La password root aggiornata verrà applicata immediatamente al momento della conferma.
- Assicurati che le nuove credenziali siano archiviate in modo sicuro (ad esempio, utilizzando un gestore di password) prima di procedere al passaggio di configurazione successivo.
- Se riavvii la configurazione guidata dopo aver modificato la password root (ad esempio, chiudendo e riaprendo la scheda del browser), dovrai utilizzare la nuova password per accedere all'interfaccia web.

:::

## Passaggio 2: Accesso SSH {#ssh-section}

Puoi personalizzare l'accesso SSH in base ai tuoi requisiti di sicurezza e operativi.

### Configurazione accesso predefinita

- L'accesso LAN è abilitato per impostazione predefinita per consentire l'accesso amministrativo dalla rete locale affidabile.
- L'accesso WAN è disabilitato per impostazione predefinita per prevenire l'esposizione a minacce esterne da reti non fidate.

### Impostazioni

- **Porta TCP**: la porta di ascolto per SSH può essere modificata se necessario. Il valore predefinito è 22.
- **Accesso root con password**: è consigliato disabilitare l'accesso root basato su password per SSH. La disabilitazione di questa opzione riduce significativamente il rischio di accesso non autorizzato limitando il potenziale di attacchi di forza bruta alla password.

:::note

Se l'accesso basato su password per l'utente root è disabilitato, è essenziale caricare la chiave pubblica SSH dell'utente root sul dispositivo per garantire l'accesso remoto continuo.

:::

## Passaggio 3: Accesso all'interfaccia web sulla porta TCP 9090 {#port_9090-section}

Configura i parametri di accesso per l'interfaccia web, che funziona sulla porta 9090.

### Configurazione predefinita

Per impostazione predefinita, l'accesso all'interfaccia web è abilitato dalla LAN, consentendo la gestione amministrativa dalla rete locale affidabile.

### Impostazioni

Puoi scegliere tra le seguenti opzioni di accesso per la connettività WAN:

- **Disabilitato** (consigliato): questa opzione disabilita l'accesso all'interfaccia web dalla WAN, prevenendo l'esposizione a minacce esterne.
- **Abilitato**: l'accesso completo all'interfaccia web è consentito da qualsiasi origine WAN. Questa modalità deve essere utilizzata solo in ambienti sicuri o quando necessario per la gestione remota, e deve essere protetta con credenziali forti.
- **Limitato**: l'accesso all'interfaccia web da WAN è limitato a indirizzi IP o reti specifiche. Devi definire uno o più dei seguenti:
  - Indirizzo IP
  - Reti in formato CIDR (ad es. 192.168.1.0/24)
  - Intervalli di indirizzi IP (ad es. 203.0.113.10-203.0.113.20)

Se scegli l'opzione **Limitato**, gli indirizzi IP che hai configurato appariranno alla fine della procedura guidata in **Firewall \> Regole \> Regole input**.

## Passaggio 4: Interfaccia web e accesso WAN sulla porta TCP 443 {#port_443-section}

Configura i controlli di accesso per l'interfaccia web e le connessioni WAN sulla porta 443.

- **Servizio interfaccia web sulla porta TCP 443**: per impostazione predefinita, l'interfaccia web è disponibile sulla porta TCP 9090. L'abilitazione di questa opzione la rende accessibile anche sulla porta TCP 443. È consigliato mantenere questo accesso aggiuntivo disabilitato e utilizzare sempre la porta TCP 9090 per accedere all'interfaccia web.
- **Accesso WAN sulla porta TCP 443**: questa opzione controlla se l'accesso WAN sulla porta 443 è disabilitato (consigliato) o abilitato. Attenzione, lasciando questa opzione disabilitata, i reverse proxy non funzioneranno.

## Passaggio 5: Riepilogo {#summary-section}

La pagina di riepilogo offre l'opportunità di rivedere la configurazione dell'unità prima di applicare le modifiche.

:::note

L'accesso WAN all'interfaccia web potrebbe essere limitato dalle impostazioni correnti. L'applicazione delle modifiche durante la connessione tramite la porta 443 potrebbe causare la perdita di accesso. Verifica che la tua configurazione soddisfi le tue esigenze di accesso remoto, in particolare quando utilizzi reverse proxy.

:::

Utilizza il pulsante "Precedente" per tornare indietro e apportare modifiche se necessario. Fai clic su "Termina configurazione" per applicare le modifiche e completare la configurazione guidata.
