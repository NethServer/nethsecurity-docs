=============
WireGuard VPN
=============

WireGuard is a modern VPN (Virtual Private Network) technology that utilizes state-of-the-art cryptography.
It is designed to be faster, simpler, and more functional than IPsec and OpenVPN. WireGuard is a secure, fast,
and easy-to-configure VPN solution that uses cutting-edge cryptography. 
It is designed to be simpler to configure than OpenVPN and to offer a lower attack surface.

NethSecurity provides a WireGuard server and client that can be configured from the command line interface.

Features:

- Multiple WireGuard server instances can run simultaneously
- Each instance operates in its own isolated network zone
- Static IP address allocation for each peer (client account)
- Client configuration available as text file or QR code
- Site-to-site (net2net) connections supported
- Enhanced security with optional pre-shared keys
- Standard WireGuard configuration file import capability

Current limitations:

- Supported networks are restricted to /24 subnet masks
- Peer IP addresses are fixed and cannot be modified after creation
- WireGuard interfaces appear as "unknown interface" in the Network page

Quickstart
==========

The configuration is composed by the following steps:

1. Get good defaults to avoid conflicts with existing configurations
2. Create the server instance
3. Add a new account (peer)

The following examples use the ``ns.wireguard`` API to configure the WireGuard server and peers.

Get good defaults
-----------------

Before creating an instance, retrieve some valid defaults. Use the calculated defaults to create the instance:

.. code-block:: bash

  /usr/libexec/rpcd/ns.wireguard call get-instance-defaults

Response example:

.. code-block:: json

  {
    "listen_port": 51820,
    "instance": "wg1",
    "network": "10.98.95.0/24",
    "routes": ["192.168.100.0/24"],
    "public_endpoint": "1.2.3.4"
  }

The response contains the following fields:

- ``listen_port``: the port on which the WireGuard server listens for incoming connections, a firewall rule will be automatically created
  to accept the traffic on this port
- ``instance``: the name of the WireGuard server instance, this is also the name of the network interface
- ``network``: the network CIDR that will be used by the WireGuard server, the server will automatically get the first IP of the network
- ``routes``: a list of network CIDR that will be pushed to the clients
- ``public_endpoint``: the public IP address of the server, this is used to create the firewall rule to accept the traffic on the WireGuard port;
  the command will try to automatically detect the public IP address
  
Before creating the instance, verify that the calculated defaults are correct:

- verify the public IP address, use a custom value if the automatic detection fails; a FQDN is supported too
- verify the network field does not overlap with existing networks

Create an instance
------------------

Create the WireGuard server instance using the calculated defaults:

.. code-block:: bash

    echo '{"listen_port": 51820, "name": "wg1", "instance": "wg1", "enabled": true, "network": "10.98.95.0/24", "routes": ["192.168.100.0/24"], "public_endpoint": "1.2.3.4", "dns": [], "user_db": ""}' |  /usr/libexec/rpcd/ns.wireguard call set-instance

The server will automatically get the first IP of the `network`, in this case `10.98.95.1`.

Response example:

.. code-block:: json

    {"public_key": "dTQ5v0lJU1mwR3uRMXL+b6lEx7tZxmoIUcDdoTYzClE="}

This is the public key of the server, it is used to create the client configuration.

Save and apply:

.. code-block:: bash

  uci commit network && uci commit firewall
  reload_config
  ifdown wg1; ifup wg1

You can use the same API to change the configuration of the server instance.

Add a new account (peer)
------------------------

Create a new account, ensuring the ``account`` field is unique within the same instance:

.. code-block:: bash

  echo '{"enabled": true, "instance": "wg1", "account": "user1", "route_all_traffic": false, "client_to_client": false, "ns_routes": [], "preshared_key": true}' | /usr/libexec/rpcd/ns.wireguard call set-peer
  
Options:

- ``route_all_traffic``: if set to ``true``, when the client connects, it will send all the traffic to the server.
  This is useful for ensuring all client traffic is encrypted and routed through the VPN. This flag should be set only if the client
  must access the internet through the VPN.
- ``client_to_client``: if set to ``true``, the client will be able to communicate with all other peers and not only with the server.
  This is useful for enabling communication between clients in a mesh network configuration.
- ``preshared_key``: if set to ``true``, automatically create a pre-shared key that will be used in the peer downloaded configuration.
  This adds an additional layer of security by requiring a shared secret for communication.
- ``ns_routes``: a list of network CIDR, automatically routes the networks to this peer;
  this is used for site-to-site (net2net) connections, allowing the server to access multiple remote networks through the VPN.

Save and apply:

.. code-block:: bash

  uci commit network
  reload_config
  ifdown wg1; ifup wg1


Download the account configuration
----------------------------------

The account configuration can be downloaded both in text format or a QR code and is suitable to be imported in a WireGuard client.

Download the text format if you want to configure a Linux machine or another NethSecurity:

.. code-block:: bash

  echo '{"instance": "wg1", "account": "user1"}' |  /usr/libexec/rpcd/ns.wireguard call download-peer-config | jq -r .config

Output example: ::

  # Account: user1 for wg1
  [Interface]
  PrivateKey = iGn1xg3pENbVCJpJWf4EqOYtNu7HZj1dg5iIX9AU0FY=
  Address = 10.98.95.2
  # Custom DNS disabled

  [Peer]
  PublicKey = dTQ5v0lJU1mwR3uRMXL+b6lEx7tZxmoIUcDdoTYzClE=
  PreSharedKey = N37bSeSO1Erzow9wVHqtkyY03TJ5D8uOrewg9iFB9MU=
  AllowedIPs = 192.168.100.0/24,10.98.95.1
  Endpoint = 1.2.3.4:51820
  PersistentKeepalive = 25


Configure a mobile device
~~~~~~~~~~~~~~~~~~~~~~~~~

Many mobile WireGuard clients allows to import the configuration using a QR code:

- `iOS <https://apps.apple.com/it/app/wireguard/id1441195209>`_
- `Android <https://play.google.com/store/apps/details?id=com.wireguard.android&hl=it&pli=1>`_

Once the app is installed, open it and import the configuration using the QR code: 

.. code-block:: bash

  echo '{"instance": "wg1", "account": "user1"}' |  /usr/libexec/rpcd/ns.wireguard call download-peer-config | jq -r .qrcode | base64 -d

Import the configuration to another NethSecurity
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When importing the configuration to another NethSecurity, the file must be base64 encoded.
Print the configuration file in base64 to the console:

.. code-block:: bash

  echo '{"instance": "wg1", "account": "user1"}' |  /usr/libexec/rpcd/ns.wireguard call download-peer-config | jq -r .config | base64 -w0; echo

Copy the base64 string, than go the the other NethSecurity and execute:

.. code-block:: bash

  echo '{"config": "IyBBY2NvdW50Oi..."}' | /usr/libexec/rpcd/ns.wireguard call import-configuration

Save and apply:

.. code-block:: bash

  uci commit network && uci commit firewall
  reload_config
  ifdown wg1; ifup wg1

Remove an instance
==================

To remove an instance, use the following command:

.. code-block:: bash

    echo '{"instance": "wg1"}' | /usr/libexec/rpcd/ns.wireguard call remove-instance

This command will remove:

- The WireGuard server instance
- The firewall rules that allow traffic from the WAN
- The VPN zone
- All associated accounts

Save and apply the changes:

.. code-block:: bash

    uci commit network && uci commit firewall
    reload_config

Remove a peer
=============

To remove a peer use:

.. code-block:: bash

    echo '{"instance": "wg1", "account": "user1"}' | /usr/libexec/rpcd/ns.wireguard call remove-peer

The command will remove the peer and its configuration inside the users database, if present.

Save and apply:

.. code-block:: bash

    uci commit network && uci commit users
    reload_config

Debug
=====

By default, WireGuard does not log anything.
To enable logging on `/var/log/messages`, use the following:

.. code-block:: bash

    echo module wireguard +p > /sys/kernel/debug/dynamic_debug/control
