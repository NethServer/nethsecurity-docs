.. _openvpn_tunnels-section:

===============
OpenVPN tunnels
===============

OpenVPN net-to-net tunnels establish secure connections between two separate networks, such as branch offices of a company, over the internet.
These connections use SSL/TLS protocols for encryption and authentication, ensuring data confidentiality and integrity.

The connection is handled by 2 NethSecurity firewalls, each one has a specific role.
When creating an OpenVPN net2net connection a firewall will have the server role whereas the other NethSecurity will connect to it as a client.
One NethSecurity can be the same time server and client for different tunnels, all tunnels use OpenVPN routed mode.


The OpenVPN tunnels interface has been crafted for straightforward connection between two NethSecuirty devices. For this reason, it is deliberately limited and does not expose all the parameters that can be configured with OpenVPN to connect to any third-party device.
To connect to a third-party device, it's recommended to use the IPsec protocol.

Configuration
-------------
To connect two firewalls via an OpenVPN tunnel, first configure the server firewall, then configure the client one.
The server needs at least one public IP address to be reachable by the client, while the client may not even have public IPs.
The configuration of the firewall server requires only a very few parameters, where possible all the parameters are already filled in automatically to avoid errors and speed up the process.
Once the server firewall has been configured, it will be possible to download the client configuration to import onto the other firewall.

Proceed as follows:
^^^^^^^^^^^^^^^^^^^
Access the OpenVPN tunnels page, move to ``Server tunnel`` tab and click on :guilabel:`Add server tunnel`.

Insert all required fields, but please note:

* ``Public endpoints`` it's a list of IP addresses or hostnames that clients can use to reach the OpenVPN tunnel server
* ``Local networks`` it's a list of local networks that will be accessible from the remote server. If topology is set to p2p, the same list will be reported inside the client ``Remote networks`` field
* ``Remote networks``, it’s a list of networks behind the remote server which will be accessible from hosts in the local network
* After the configuration is saved, click on the :guilabel:`Download` action and select ``Client configuration``
* Access the client firewall, OpenVPN tunnel,  move to ``Client tunnel`` tab, click on :guilabel:`Import configuration`

Topology
--------
Tunnels can have two kinds of topologies: ``subnet`` and ``p2p`` (Point to Point).

Subnet
^^^^^^
``Subnet`` is the default topology and the recommended one: in ``subnet`` topology, the server will accept connections and will act as a DHCP server for every connected clients.

In this scenario the server will authenticate clients using TLS certificates and will push local routes to remote client.

P2P
^^^

In a ``p2p`` topology, the administrator must configure one server for each client, in this scenario the only supported authentication method is the PSK (Pre-Shared Key). 

* make sure to exchange the PSK using a secure channel (like SSH or HTTPS) 
* the administrator must select an IP for both end points 
* routes to remote networks must be configured on each end point


Advanced features
-----------------
The web interface allows the configuration of advanced features like:

* ``Multiple remote host``: multiple remote server addresses can be specified for redundancy; the OpenVPN client will try to connect to each host in the given order

* ``Protocol``: OpenVPN is designed to operate optimally over UDP, but TCP capability is provided for situations where UDP cannot be used

* ``Compression``: if enabled, data to be sent through the VPN tunnel will be compressed. This option is disabled by default both for security reasons. Compression is rarely essential nowadays, as internet traffic is typically already highly compressed and optimized.

* ``Digest``: the digest algorithm used to transform an arbitrarily large block of data into a fixed-size output. If not explicitly selected, the server and client will try to negotiate the best digest available on both sides

* ``Cipher``: the cryptographic algorithm used to encrypt all the traffic. If not explicitly selected, the server and client will try to negotiate the best cipher available on both sides

* ``Enforce a minimum TLS version``: Allows you to choose a minimum version of TLS, in which case connections will only be allowed from devices that use a version greater than or equal to the one selected
