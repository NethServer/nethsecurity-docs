---
title: "Problema registrazione"
sidebar_position: 11
---
# Problema registrazione

In caso di problemi in fase di registrazione di NethSecurity 8 è possibile che venga restituito un errore simile a questo :

![Cannot register unit invalid token or server not found](/_static/tutorial/registration-troubleshooting-nethsecurity-8/registration-error.png)

Il fatto che NethSecurity 8 non riesca a registrarsi può dipendere da una serie di cause.

### Mancata connettività

Verificare sulla Dashboard lo stato del modulo Internet connection, se il risultato è "Unknown" è possibile che la macchina non riesca ad uscire su internet o non riesca a risolvere i nomi

![Image](/_static/tutorial/registration-troubleshooting-nethsecurity-8/internet-connection.png)

Verificare la configurazione di rete dell'interfaccia WAN e verificare che le impostazioni siano corrette.

### Problema risoluzione nomi

Per impostazione predefinita NethSecurity 8 non include server DNS di inoltro preconfigurati.
In presenza di WAN configurata in DHCP o PPPoE vengono usati automaticamente i server DNS forniti dal provider, in tutti gli altri casi o se in presenza di Multiwan è necessario configurare manualmente i server DNS di inoltro.

Portarsi alla sezione**DNS e DHCP > DNS**ed impostare dei server di inoltro pubblici (ad esempio 8.8.8.8)

![Image](/_static/tutorial/registration-troubleshooting-nethsecurity-8/dns-config.png)

### Data / Ora non corretti

Affinchè la registrazione vada a buon fine è fondamentale che data e ora del sistema siano corrette.
È possibile verificarle accedendo alla sezione**System Settings > General Settings**, a fondo alla pagina, vengono visualizzate data e ora locali.
Per garantire l’accuratezza nel tempo, è inoltre possibile abilitare la sincronizzazione automatica tramite server NTP dalla sezione**Time Synchronization**.

![Image](/_static/tutorial/registration-troubleshooting-nethsecurity-8/time-settings.png)

### Verifica da terminale

Collegati al terminale del firewall o via SSH è possibile verificare se la connettività internet e la risoluzione DNS stiano funzionando correttamente.

#### Ping IP pubblico

Effettuare un ping verso un IP pubblico (es 8.8.8.8)

```
ping -c 1 8.8.8.8
```

L'output sarà simile al seguente, in questo caso ci conferma che la macchina riesce a raggiungere correttamente l'indirizzo IP 8.8.8.8:

```
root@nsec8-vm:~# ping -c 1 8.8.8.8 PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data. 64 bytes from 8.8.8.8: icmp_seq=1 ttl=115 time=10.3 ms --- 8.8.8.8 ping statistics --- 1 packets transmitted, 1 received, 0% packet loss, time 0ms rtt min/avg/max/mdev = 10.292/10.292/10.292/0.000 ms
```

Se non si ha risposta, verificare la configurazione di rete della WAN

#### Ping a un FQDN

Effettuare un ping verso il nome my.nethesis.it

```
ping -c 1 my.nethesis.it
```

L'output ci conferma che la risoluzione DNS avviene correttamente, traducendo il nome nel suo rispettivo IP e il pacchetto di risposta ICMP è arrivato correttamente:

```
root@nsec8-vm:~# ping -c 1 my.nethesis.it PING my.nethesis.it (188.166.58.97) 56(84) bytes of data. 64 bytes from my.nethesis.it (188.166.58.97): icmp_seq=1 ttl=53 time=73.4 ms --- my.nethesis.it ping statistics --- 1 packets transmitted, 1 received, 0% packet loss, time 0ms rtt min/avg/max/mdev = 73.420/73.420/73.420/0.000 ms
```

Se non si riceve risposta ed il nome non viene tradotto nel suo IP, verificare la configurazione DNS.
