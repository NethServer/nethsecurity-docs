---
title: "Utenti amministrativi"
sidebar_position: 2
---

# Utenti amministrativi {#administrative_users-section}

NethSecurity consente di assegnare agli utenti locali l'accesso amministrativo all'interfaccia web. Gli utenti amministrativi devono essere account personali assegnati a singoli operatori, in modo che le azioni possano essere attribuite a un utente specifico nei log.

## Tipi di account amministrativi

NethSecurity utilizza i seguenti tipi di account amministrativi:

- `root`: account di sistema locale. Deve essere riservato alle operazioni di emergenza o ripristino quando possibile.
- **Utenti amministrativi**: utenti locali con l'opzione **Utente amministratore** abilitata. Possono accedere all'interfaccia NethSecurity ed eseguire operazioni amministrative.
- **Utenti non amministrativi**: utenti locali o remoti utilizzati per servizi come VPN o autenticazione, senza accesso all'interfaccia NethSecurity.

:::note

L'accesso amministrativo deve essere concesso solo a operatori di fiducia.

:::

## Creazione degli utenti amministrativi

Gli utenti amministrativi vengono creati dal database utenti locale.

Per creare un utente amministrativo:

1. Crea un utente locale.
2. Imposta una password per l'utente.
3. Abilita l'opzione **Utente amministratore**.
4. Salva la configurazione.

Per informazioni generali sui database utenti locali e remoti, vedere [Database utenti](./users_databases.md).

## 2FA NethSecurity UI {#2fa-section}

Proteggere l'account amministratore di NethSecurity è fondamentale. L'autenticazione a due fattori (2FA) aggiunge un ulteriore livello di sicurezza oltre alla sola password: invece di inserire solo la password, è necessario anche un codice temporaneo generato da un'app separata sullo smartphone o tablet. Questo riduce significativamente il rischio di accesso non autorizzato anche in caso di compromissione della password.

Abilitazione della 2FA su NethSecurity UI:

- Accedi all'interfaccia web di NethSecurity.
- Fai clic sull'icona dell'utente nell'angolo in alto a destra e seleziona **Impostazioni account**.
- Trova l'opzione Autenticazione a due fattori e fai clic su **Configura 2FA**.

Configurazione dell'app di autenticazione:

- Scarica un'app di autenticazione sullo smartphone o tablet. Le opzioni più diffuse includono FreeOTP, Google Authenticator e Microsoft Authenticator.
- Apri l'app e scansiona il codice QR visualizzato nell'interfaccia web di NethSecurity.
- Inserisci il codice a 6 cifre visualizzato dall'app nel campo One-Time Password (OTP).

Il sistema fornisce anche una serie di codici di backup, utilizzabili per accedere in caso di perdita dello smartphone o dell'app di autenticazione. Conservali in modo sicuro, preferibilmente offline.

### Disabilita la 2FA tramite l'interfaccia web

Se l'amministratore può ancora accedere all'interfaccia web:

1. Fai clic sull'icona dell'utente nell'angolo in alto a destra e seleziona **Impostazioni account**.
2. Scorri fino alla sezione **Autenticazione a due fattori**.
3. Fai clic su **Revoca 2FA**.
4. Appare una finestra di dialogo di conferma che avverte della riduzione del livello di sicurezza. Fai clic su **Revoca 2FA** per confermare.
5. Se richiesto, inserisci la password attuale per autorizzare la modifica.

Dopo la conferma, il badge di stato cambia in disabilitato e l'accesso successivo non richiederà più un OTP.

### Disabilita la 2FA dalla riga di comando (recupero di emergenza)

Se un amministratore ha perso sia il dispositivo OTP che i codici di recupero e non può più accedere all'interfaccia web, la 2FA può essere ripristinata direttamente dalla shell come `root` via SSH.

Eseguire i seguenti comandi, sostituendo `<username>` con il nome dell'account amministratore (usare `root` per l'amministratore predefinito):

```bash
SECRETS_DIR=/etc/ns-api-server
USERNAME=root   # cambia con il nome utente interessato

rm -f  "${SECRETS_DIR}/${USERNAME}/secret"
rm -f  "${SECRETS_DIR}/${USERNAME}/codes"
printf '0' > "${SECRETS_DIR}/${USERNAME}/status"
```

Dopo questi comandi l'utente può accedere con sola password. La 2FA può essere riabilitata in qualsiasi momento dall'interfaccia web.

:::note

Solo l'account `root` ha accesso SSH per impostazione predefinita. Gli amministratori non-root non possono essere recuperati via SSH dall'utente interessato; è necessaria una sessione `root` esistente per eseguire i comandi sopra per loro conto.

:::

## Accesso root e di emergenza

L'account `root` è il principale account di sistema locale. Deve essere trattato come account di emergenza o ripristino e non usato per le attività amministrative ordinarie quando sono disponibili account personali. Usa account amministrativi personali per le operazioni quotidiane, così le azioni possono essere attribuite ai singoli utenti nei log.

## Registro delle attività amministrative

NethSecurity registra le attività amministrative eseguite tramite l'interfaccia web in `/var/log/messages`. I log amministrativi supportano la risoluzione dei problemi, l'analisi degli incidenti e la ricostruzione dell'audit.

### Dove trovare i log amministrativi

I log vengono scritti in `/var/log/messages` e ruotati settimanalmente. Sono visibili dall'interfaccia nella sezione dedicata. Per visualizzare gli eventi amministrativi dell'interfaccia, usare il filtro `nethsecurity-api`.

Per la conservazione a lungo termine e l'audit centralizzato, configura lo storage persistente per i log, l'inoltro remoto via syslog, l'inoltro tramite Controller o Cloud Log Manager. Per i dettagli vedere [Log](../advanced-cli/logs.md).

### Ricostruzione delle azioni degli amministratori

I log amministrativi consentono di rispondere a domande come:

- chi ha effettuato l'accesso;
- quando l'amministratore ha acceduto al firewall;
- quali pagine dell'interfaccia o funzioni API sono state utilizzate;
- quali aree di configurazione sono state modificate;
- quali valori sono stati inviati;
- se una modifica è stata committata;
- se l'azione è stata seguita da errori di servizio o eventi di sicurezza.

Esempio di evento di accesso per l'utente `goofy`:

```bash
Jun 21 09:43:19 NethSec nethsecurity-api[5376]: nethsecurity_api 2024/06/21 09:43:19 middleware.go:78: [INFO][AUTH] authentication success for user goofy
Jun 21 09:43:19 NethSec nethsecurity-api[5376]: nethsecurity_api 2024/06/21 09:43:19 middleware.go:186: [INFO][AUTH] login response success for user goofy
```

Esempio di evento di disconnessione per l'utente `goofy`:

```bash
Jun 21 09:46:13 NethSec nethsecurity-api[5376]: nethsecurity_api 2024/06/21 09:46:13 middleware.go:214: [INFO][AUTH] logout response success for user goofy
```

Esempio di azione eseguita dall'utente `goofy`:

```bash
Jun 21 09:43:19 NethSec nethsecurity-api[5376]: nethsecurity_api 2024/06/21 09:43:19 middleware.go:170: [INFO][AUTH] authorization success for user goofy. POST /api/ubus/call {"path":"ns.dashboard","method":"service-status","payload":{"service":"internet"}}
```

## Raccomandazioni per audit e conformità

Per le distribuzioni orientate all'audit:

- creare un account amministrativo personale per ogni operatore;
- evitare account amministrativi condivisi;
- abilitare la MFA per tutti gli utenti amministrativi;
- riservare `root` alle operazioni di emergenza o ripristino quando possibile;
- usare password robuste e proteggere i codici di recupero;
- configurare lo storage persistente per i log o l'inoltro remoto;
- inviare i log a un server syslog remoto, SIEM, Controller o Cloud Log Manager;
- verificare che l'inoltro dei log funzioni correttamente;
- assicurarsi che data, ora e fuso orario siano corretti, preferibilmente usando NTP;
- definire la retention dei log in base alla politica di sicurezza dell'organizzazione;
- proteggere i log remoti da accessi non autorizzati o eliminazioni;
- revisionare periodicamente i log di accesso amministrativo e le modifiche di configurazione.

I log di NethSecurity supportano la ricostruzione dell'audit e l'analisi degli incidenti. I processi organizzativi come l'approvazione delle modifiche, la revisione periodica, la classificazione degli incidenti e la conservazione delle prove rimangono responsabilità dell'organizzazione che gestisce il firewall.

## Limitazioni attuali

- NethSecurity non fornisce attualmente un modello RBAC locale completo per gli amministratori web.
- Un ruolo amministratore locale in sola lettura non è attualmente disponibile.
- Gli utenti amministrativi devono quindi essere assegnati solo a operatori di fiducia.
- Alcune voci di log potrebbero richiedere la correlazione con i log di commit della configurazione o i log di servizi correlati.
- Un evento di autorizzazione indica che la richiesta API è stata consentita, ma è necessario verificare i log correlati per confermare l'effetto finale dell'operazione.
- Non tutte le voci di log contengono necessariamente gli stessi campi.
- I log in memoria locale possono andare persi dopo un riavvio o una rotazione, a meno che non sia configurato lo storage persistente o l'inoltro remoto.

Per requisiti di audit a lungo termine, usare l'inoltro remoto dei log o Cloud Log Manager in aggiunta allo storage locale.
