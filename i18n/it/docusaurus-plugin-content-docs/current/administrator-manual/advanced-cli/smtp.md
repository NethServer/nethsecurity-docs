---
title: "Notifiche via posta (SMTP)"
sidebar_position: 4
---

# Notifiche via posta (SMTP)

:::warning

Questa funzionalità è ancora in fase di sviluppo e non dispone ancora di un'interfaccia utente. Attualmente può essere configurata solo tramite la riga di comando.

:::

Questa sezione fornisce istruzioni per configurare il client SMTP (msmpt) sul firewall NethSecurity per l'invio di notifiche via email. Il client SMTP viene utilizzato esclusivamente per l'invio di email di notifica e si affida a un server SMTP esterno per la consegna.

Il client SMTP [msmpt](https://marlam.de/msmtp/) offre funzionalità avanzate per migliorare la sicurezza e l'affidabilità:

- **Supporto TLS/SSL:** msmpt supporta la crittografia TLS/SSL per una comunicazione sicura tra il firewall e il server SMTP esterno
- **Autenticazione:** alcuni server SMTP richiedono l'autenticazione per identificare l'utente che invia l'email

Consultare il [manuale dello sviluppatore](https://dev.nethsecurity.org/packages/ns-api/#nssmtp) per i comandi su come configurarlo da riga di comando.
