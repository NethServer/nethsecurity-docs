.. _openvpn_roadwarrior-section:

====================
OpenVPN Road Warrior
====================


Road Warrior refers to a specific configuration of the OpenVPN VPN tailored for remote users, allowing them secure access to a
private network from anywhere on the internet.
This setup is particularly useful for businesses and organizations with employees or collaborators spread across different locations,
ensuring encrypted communication and data privacy.

.. note::  Before configuring the OpenVPN Roadwarrior, make sure you have read the chapter related to the :ref:`user database <users_database-section>`.

How it works
------------

The OpenVPN server must be reachable from the internet on its specific port (by default 1194 UDP), it will be waiting for remote clients to contact it and establish a connection.
Multiple clients can connect to the server, authenticate themselves and gain access to the private network; however, the clients do not need to be reachable on the internet. Each connecting client, after authentication, receives an IP address with which it will present itself to the remote network.

Databases
^^^^^^^^^

An OpenVPN server on NethSecurity is closely tied to a user database, which can be local (already present by default, just needs to be populated with users) or remote to connect to an LDAP or Active Directory server. The association with the database is defined during server creation and cannot be modified later.

On the OpenVPN server, OpenVPN accounts linked to users from the specific database can be created.

Configuration
-------------

To configure a new OpenVPN server click :guilabel:`Create Server` button and configure/verify the proposed fileds:

``Server name`` : give a name to this OpenVPN server

``User database`` : choose the database where account will be created

``Create an account for each user`` : this is a special field and won't be showed again the future, it allows you to automatically create a VPN account for each user present in the database. All accounts created will have a certificate valid for 3650 days.

``Mode`` : Bridged or routed (default routed)

``VPN Network`` : the virtual network used by clients; every client will receive an IP address taken from this network. NethSecurity already suggests an uncommon network to avoid overlaps with other networks used by the firewall.

``Public IP/hostname of this unit`` : NethSecurity automatically fill this field with the public IP address of each WAN you are using

```` :
```` :
```` :
```` :
OpenVPN Road Warrior configuration support various authentication methods:

1. local user authentication with certificate only
2. local user authentication with password
3. local user Authentication with password and certificate
4. remote OpenLDAP/Active Directory user authentication with password
5. remote OpenLDAP/Active Directory user authentication with password and certificate

Clients connected to the Road Warrior are assigned to the ``rwopenvpn`` zone, which is inherently trusted.
This zone has privileged access to both LAN and WAN zones within the network infrastructure.

This is a detailed list of currently implemented authentication methods:

See the `developer manual <https://dev.nethsecurity.org/packages/ns-openvpn/#openvpn-road-warrior>`_ for more info on manual configuration.
