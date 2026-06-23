---
title: "Database utenti"
sidebar_position: 1
---

# Database utenti {#users_database-section}

NethSecurity introduce il supporto per due tipi di database utenti: un database locale e un database LDAP remoto, migliorando le capacità di gestione utenti. Gli utenti all'interno dei database possono essere utilizzati per le connessioni VPN, incluso il [OpenVPN Road Warrior](../vpn/openvpn_roadwarrior.md).

Solo gli utenti con una password possono connettersi alla VPN autenticandosi con un nome utente e una password. Gli utenti senza password possono connettersi alla VPN autenticandosi con un certificato o altri metodi di autenticazione.

## Database locale

Il database utenti locale è un componente intrinseco del firewall, è disponibile per impostazione predefinita e non richiede alcuna configurazione aggiuntiva. Funge da sistema di gestione utenti integrato, consentendo agli amministratori di creare e gestire utenti direttamente sul firewall. Si integra inoltre perfettamente con i servizi VPN, in particolare il server OpenVPN Road Warrior.

Per creare un nuovo utente, fare clic sul pulsante **Aggiungi utente** per avviare il processo. Durante la configurazione di un utente locale, è necessario compilare tutti i seguenti campi:

- `Nome utente`: specifica il nome utente desiderato.
- `Nome visualizzato`: specifica il nome visualizzato dell'utente. Questo campo è facoltativo.
- `Password utente`: specifica la password dell'utente. Questo è obbligatorio solo se la VPN è configurata per utilizzare l'autenticazione tramite password.
- `Conferma password`: specifica la password dell'utente, assicurarsi che corrisponda alla password specificata nel campo precedente.

Il database utenti locale viene implementato come file di configurazione UCI. Le password degli utenti locali sono archiviate nel formato Unix passwd, garantendo compatibilità e sicurezza nel database utenti locale.

Gli utenti all'interno del database locale possono ottenere privilegi amministrativi sull'interfaccia utente web abilitando l'opzione `Utente amministratore`; l'utente deve avere una password impostata. Vedere [Utenti amministrativi](./administrative_users.md) per i dettagli.

## Database remoti {#remote_user_databases-section}

:::note

Nessun abbonamento richiesto

A partire da NethSecurity 8.8, questa funzione è disponibile anche senza un abbonamento.

:::

:::tip

Se ci si collega a un Active Directory Windows Server 2025 (o più recente), il bind LDAP potrebbe fallire a causa di requisiti di sicurezza più stringenti. Consulta [Problemi di bind LDAP con Active Directory](../../tutorial/active-directory-ldap-bind-issues.md) per la correzione e la configurazione consigliata su NethSecurity.

:::

L'amministratore può estendere le capacità del firewall aggiungendo nuovi database remoti. I database remoti consentono al firewall di autenticare gli utenti rispetto a un server LDAP esterno, come Active Directory o OpenLDAP.

A differenza degli utenti locali, gli utenti nei database remoti devono essere gestiti direttamente sul server LDAP di origine. Eventuali aggiunte, eliminazioni o modifiche agli account utente devono essere eseguite sul server LDAP stesso, poiché queste modifiche verranno riflesse nella pagina di configurazione del firewall ma non possono essere apportate dall'interfaccia del firewall.

Tenere inoltre presente che se il database remoto è offline, l'autenticazione VPN avrà esito negativo. È fondamentale garantire che il database remoto sia online e accessibile per garantire la corretta autenticazione dell'utente attraverso il servizio VPN.

Durante la configurazione di un database remoto, fare clic sul pulsante **Aggiungi database remoto** e compilare tutti i seguenti campi:

- `URI LDAP`: specifica l'Uniform Resource Identifier (URI) LDAP, inclusi l'indirizzo del server e la porta (ad es., `ldap://example.com:389`).

- `Tipo`: specifica il tipo di server LDAP. Le opzioni disponibili sono `Active Directory` e `OpenLDAP`. Se OpenLDAP è selezionato, il server remoto deve rispettare lo schema RFC 2307.

- `Base DN`: specifica il Distinguished Name (DN) di base LDAP, che rappresenta il punto di partenza per le ricerche nella directory LDAP (es. `dc=example,dc=com`).

- `User DN`: specifica il Distinguished Name (DN) dell'utente LDAP. Se non presente, il valore predefinito è uguale a base_dn (es. `cn=users,dc=example,dc=com`).

- `Campo attributo utente`: specifica l'attributo utente utilizzato per identificare l'utente, questa opzione viene utilizzata dal server OpenVPN road warrior per comporre il DN di binding dell'utente. Dovrebbe essere `cn` per Active Directory o `uid` per OpenLDAP.

  Questo campo viene utilizzato per autenticare gli utenti nel server OpenVPN road warrior. Il processo di autenticazione è basato su un'operazione di binding LDAP che utilizza il campo attributo utente per comporre il DN di binding dell'utente con l'User DN. Esempio: dato un utente denominato `jdoe` nella directory OpenLDAP, il DN di binding dell'utente è composto come `uid=jdoe,ou=People,dc=directory,dc=nh`.

- `Campo nome visualizzato utente`: specifica l'attributo utente contenente il nome completo dell'utente come `John Doe`. Di solito è `cn` per OpenLDAP e `displayName` per Active Directory.

- `DN di binding utente personalizzato`: se questo campo è impostato, sostituisce il DN di binding dell'utente calcolato utilizzato per autenticare gli utenti nel server OpenVPN road warrior. Il campo può contenere un segnaposto `%u` che viene sostituito con il nome utente durante il processo di autenticazione. Utilizzare questa impostazione se non si conosce se il campo CN dell'utente contiene il nome completo dell'utente, come `John Doe`, o il nome utente, come `jdoe`. Se il server remoto è un server Active Directory, è possibile utilizzare uno dei seguenti valori:

  - `%u@domain.local`: dove `domain.local` è il nome di dominio del server Active Directory; all'interno del client OpenVPN, per autenticare l'utente utilizzare solo il nome utente come `jdoe`
  - `DOMAIN\%u`: dove `DOMAIN` è il realm del server Active Directory; all'interno del client OpenVPN, per autenticare l'utente utilizzare solo il nome utente come `jdoe`

  Se il server remoto è un OpenLDAP, è possibile lasciare questo campo vuoto o specificarlo come `uid=%u,dc=directory,dc=nh`.

- `Bind DN`: specifica il Distinguished Name (DN) di binding LDAP, che rappresenta l'utente utilizzato per eseguire il binding al server LDAP. Per un server OpenLDAP, è solitamente qualcosa come `uid=ldapservice,dc=directory,dc=nh`, mentre per un server Active Directory, è solitamente qualcosa come `ldapservice@example.com` o `cn=ldapservice,cn=Users,dc=example,dc=com`.

- `Password Bind`: specifica la password dell'utente utilizzata per eseguire il binding al server LDAP.

- `StartTLS`: abilita StartTLS per la comunicazione sicura con il server LDAP, dovrebbe essere disabilitato se l'URI LDAP sta già utilizzando lo schema `ldaps://`.

- `Verifica certificato TLS`: determina se abilitare o disabilitare la convalida del certificato, deve essere disabilitato se il server LDAP utilizza un certificato autofirmato.

## Configurazioni consigliate

Le seguenti configurazioni sono consigliate per i server LDAP più comuni. Durante la configurazione del database remoto:

- assicurarsi che il server LDAP sia raggiungibile dal firewall. Se l'URI LDAP contiene un nome host, assicurarsi che il nome host sia risolvibile
- sostituire i valori di esempio con i valori effettivi del server LDAP
- per Active Directory, si consiglia di utilizzare `DN di binding utente personalizzato` per specificare come il server OpenVPN dovrebbe autenticare l'utente

### OpenLDAP (RFC 2307)

È possibile accedere a OpenLDAP di NethServer 7 senza autenticazione:

- URI LDAP: `ldap://ns7ldap.nethserver.org`
- Tipo: `OpenLDAP`
- Base DN: `dc=directory,dc=nh`
- User DN: `ou=People,dc=directory,dc=nh`
- Campo attributo utente: `uid`
- Campo nome visualizzato utente: `cn`

Se si desidera utilizzare l'autenticazione inserendo Bind DN e Bind Password, ricordare di abilitare StartTLS.

### Active Directory

Per accedere a NethServer 7 Samba Active Directory o Windows Server 2012 Active Directory, utilizzare la seguente configurazione:

- URI LDAP: `ldap://dcserver.ad.example.com`
- Tipo: `Active Directory`
- Base DN: `dc=example,dc=com`
- User DN: `cn=Users,dc=example,dc=com`
- Campo attributo utente: `sAMAccountName`
- Campo nome visualizzato utente: `displayName`
- DN di binding utente personalizzato: `%u@example.com`
- Bind DN: `<user>@exampl.com` o `cn=<user>,cn=Users,dc=example,dc=com`, dove `<user>` è il nome utente dell'utente utilizzato per eseguire il binding al server LDAP
- Bind Password: `<password>`, dove `<password>` è la password dell'utente inserita nel campo Bind DN

L'opzione `StartTLS` dovrebbe essere abilitata per NethServer 7 Samba Active Directory, mentre dovrebbe essere solitamente disabilitata per Windows Server 2012 Active Directory.
