=============
WireGuard VPN
=============

WireGuard is a modern VPN (Virtual Private Network) technology that utilizes state-of-the-art cryptography.
It is designed to be faster, simpler, and more functional than IPsec and OpenVPN. WireGuard is a secure, fast,
and easy-to-configure VPN solution that uses cutting-edge cryptography. 
It is designed to be simpler to configure than OpenVPN and to offer a lower attack surface.

NethSecurity provides a WireGuard server and client that can be configured from the web interface.

Features:

- Multiple WireGuard server instances can run simultaneously
- Each instance operates in its own isolated network zone
- Static IP address allocation for each peer (client account)
- Client configuration available as text file or QR code
- Site-to-site (net2net) connections supported
- Enhanced security with optional pre-shared keys
- Standard WireGuard configuration file import capability

Server Configuration
====================

It's possible to create multiple WireGuard server instances, each with its own isolated network zone. NethSecurity will automatically open the necessary firewall ports
to allow incoming connections to the WireGuard server and create a VPN zone to allow management of how the traffic is routed between zones.

On the contrary of the OpenVPN server, there's no ties to the users database, accounts (peers) are created and managed directly inside the WireGuard interface.

To create a WireGuard server, click on :guilabel:`Add server`, then fill the form with the desired configuration. The fields are the following:

- `Status`: enable or disable the WireGuard server instance
- `Name`: the name of the WireGuard server instance, this is not the name of the network interface, it will be automatically created as `wgX`, where `X` is a number
- `VPN network`: the network CIDR that will be used by the WireGuard server, the server will automatically get the first IP of the network
- `UDP port`: the port on which the WireGuard server listens for incoming connections
- `Public endpoint`: the public IP address or FQDN of the server

Under advanced settings, it's possible to configure additional options:

- `MTU`: to manually set the MTU of the WireGuard interface
- `DNS servers`: to set custom DNS servers that will be pushed to the clients, useful to avoid DNS leaks

After creating the server, it's possible to add new clients (peers) directly from the WireGuard interface, click :guilabel:`Add peer` and fill the form as the following:

- `Status`: enable or disable the peer
- `Name`: the name of the peer
- `Reserved IP`: the static IP address that will be assigned to the peer, must be inside the VPN network, it will be pre-filled with the next available IP
- `Pre-shared key`: if enabled, a pre-shared key will be automatically created to enhance security
- `Route all traffic`: if enabled, when the client connects, it will send all the traffic to the server
- `Server networks`: which networks the peer can access, all LAN networks will be automatically added
- `Peer networks`: networks reachable on the peer side

.. note::

  It's possible to create a client-to-site connection by leaving empty the `Peer networks` entries. This will allow the client to access the server networks.

Once the peer is saved, it's possible to download the configuration file in text format or as a QR code using the menu on the right side of the peer entry.

The server and peers configuration can be edited by the context menu on the right side of each entry.

.. warning::

  After modifying the WireGuard server or peers, remember that such changes needs to be applied to the peer by re-downloading the configuration file.

Tunnel Configuration
====================

Nethsecurity can be configured as a WireGuard client (peer) to connect to another WireGuard server. On the :guilabel:`Peer tunnels` tab, it's possible to add manually a new tunnel by clicking on :guilabel:`Add peer tunnel` or import a generic wireguard configuration file using :guilabel:`Import peer tunnel`.

When manually adding a new tunnel, the following fields are available:

- `Status`: enable or disable the tunnel
- `Name`: the name of the tunnel, this is not the name of the network interface, it will be automatically created as `wgX`, where `X` is a number
- `Reserved IP`: the static IP address that the tunnel will use
- `Server public key`: the public key of the WireGuard server
- `Peer private key`: the private key of the tunnel
- `Pre-shared key`: the pre-shared key, if used, field is optional
- `Route all traffic`: if enabled, all the traffic will be routed through the tunnel
- `Network routes`: networks made available through the tunnel
- `Endpoint`: the public IP address or FQDN of the WireGuard server
- `UDP port`: the port on which the WireGuard tunnel will connect to
- `DNS servers`: custom DNS servers to be used when the tunnel is active

Debug
=====

By default, WireGuard does not log anything.
To enable logging on `/var/log/messages`, use the following commands:

.. code-block:: bash

    echo module wireguard +p > /sys/kernel/debug/dynamic_debug/control

To disable logging, use:

.. code-block:: bash

    echo module wireguard -p > /sys/kernel/debug/dynamic_debug/control
