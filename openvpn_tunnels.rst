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
* Access the client firewall, OpenVPN tunnel, move to ``Client tunnel`` tab, click on :guilabel:`Import configuration`

Topology
--------
Tunnels can have two kinds of topologies: ``subnet`` and ``p2p`` (Point to Point).

Subnet
^^^^^^
``Subnet`` is the default topology and the recommended one: in ``subnet`` topology, the server will accept connections and will act as a DHCP server for every connected client.

In this scenario the server will authenticate clients using TLS certificates and will push local routes to remote client.

P2P
^^^

In a ``p2p`` topology, the administrator must configure one server for each client, in this scenario the only supported authentication method is the PSK (Pre-Shared Key). 

* make sure to exchange the PSK using a secure channel (like SSH or HTTPS) 
* the administrator must select an IP for both endpoints 
* routes to remote networks must be configured on each endpoint


Advanced features
-----------------
The web interface allows the configuration of advanced features like:

* ``Multiple remote host``: multiple remote server addresses can be specified for redundancy; the OpenVPN client will try to connect to each host in the given order

* ``Protocol``: OpenVPN is designed to operate optimally over UDP, but TCP capability is provided for situations where UDP cannot be used

* ``Compression``: if enabled, data to be sent through the VPN tunnel will be compressed. This option is disabled by default both for security reasons. Compression is rarely essential nowadays, as internet traffic is typically already highly compressed and optimized

* ``Digest``: the digest algorithm used to transform an arbitrarily large block of data into a fixed-size output. If not explicitly selected, the server and client will try to negotiate the best digest available on both sides

* ``Cipher``: the cryptographic algorithm used to encrypt all the traffic. If not explicitly selected, the server and client will try to negotiate the best cipher available on both sides

* ``Enforce a minimum TLS version``: Allows you to choose a minimum version of TLS, in which case connections will only be allowed from devices that use a version greater than or equal to the one selected

MTU Issue and Packet Fragmentation
----------------------------------

VPN users may experience connectivity issues due to packet fragmentation. The LAN interface has an MTU of 1500, but when packets are encrypted for VPN transmission, the size increases, leading to packet drops. To resolve this, the MTU on the OpenVPN tunnel must be lowered. No changes are required on the client side.

Add the following option to the Roadwarrior server configuration::

    uci set openvpn.ns_<name>.tun_mtu='1300'
    uci commit openvpn.ns_<name>
    /etc/init.d/openvpn restart ns_<name>

The `tun_mtu` value may need to be adjusted based on your specific network environment. A lower MTU ensures that packets fit within the limits of the OpenVPN tunnel without fragmentation. Depending on factors like network latency or overhead, you might find that slightly different values work better for your setup.


Managing certificate expiration
--------------------------------

As mentioned in the :ref:`managing-openvpn-certificate-expiration` section, OpenVPN tunnels are also based on certificates, and it is crucial to monitor their expiration dates to avoid connectivity issues. 

When a new OpenVPN tunnel is created, the system generates a new ``PKI (Public Key Infrastructure)``, which is composed of the **CA**, **server**, and a **single client certificate** (unlike Road Warrior connections, which have one certificate per user).

All information about certificate expiration dates can be found in the **OpenVPN Tunnels** table, where a magnifying-glass icon is shown for each tunnel. Clicking it opens a modal with all the details about the tunnel configuration, including the certificates and their expiration dates.

On the **server side**, the modal shows certificate information for the CA, server, and client certificates. 
On the **client side**, it shows only the CA and client certificates.

In the tunnel table, an alert icon is shown when at least one of these certificates will expire in less than 30 days or has already expired. By opening the tunnel details modal, you can see which certificate is expiring and its expiration date.

By default, all certificates are generated with a validity of 3650 days (10 years).

A connection between the two firewalls will be interrupted when at least one certificate expires, according to the three possible scenarios described in the OpenVPN Road Warrior section.

To check whether your OpenVPN tunnel is disconnected due to certificate expiration, you can inspect the **firewall logs** and search for OpenVPN-related messages, located in the ``/var/log/messages`` file.

Example:

.. code-block:: bash

    grep 'VERIFY ERROR:' /var/log/messages

The search returns messages like the following:

.. code-block:: bash

    Feb  9 13:02:07 NethSec openvpn(ns_roadwarrior1)[8031]: VERIFY ERROR: depth=1, error=certificate has expired
    Feb  9 13:02:07 NethSec openvpn(ns_roadwarrior1)[8031]: VERIFY ERROR: depth=0, error=certificate has expired

Those lines mean that the connection is not working due to certificate expiration. The issue may be related to the CA certificate (``depth=1``), the server certificate (``depth=0``), or both.

To check the validity of the certificates, you can use the following ``openssl`` commands.

.. code-block:: bash

    # client
    openssl x509 -in /etc/openvpn/{vpn-instance}/pki/issued/client.crt -text -noout | grep 'Not After'
    # server
    openssl x509 -in /etc/openvpn/{vpn-instance}/pki/issued/server.crt -text -noout | grep 'Not After'
    # CA
    openssl x509 -in /etc/openvpn/{vpn-instance}/pki/ca.crt -noout -dates -subject -issuer -serial

The ``{vpn-instance}`` placeholder must be replaced with the name of your OpenVPN instance (e.g. ``ns_roadwarrior1``).

Below are the steps to renew certificates in each scenario and restore the connection.

Client certificate expired
^^^^^^^^^^^^^^^^^^^^^^^^^^
In this scenario, the client certificate must be renewed on the server side and then downloaded and imported again on the client side.

1. Access the server firewall and navigate to the **OpenVPN tunnels** section.
2. Click the :guilabel:`︙` menu on the right of the tunnel and select :guilabel:`Regenerate certificates`.
3. Download the new client certificate and import it on the client side.

These operations will create new server and client certificates without affecting the CA certificate (which is assumed to be still valid in this case).
In this scenario, using the new client certificate on the client firewall is **mandatory** to restore the connection, so make sure to download and import it on the client side as soon as possible to minimize downtime.


Server certificate expired
^^^^^^^^^^^^^^^^^^^^^^^^^^
In this scenario, the server certificate must be renewed on the server side. 
Use the same :guilabel:`Regenerate certificates` action described in the previous scenario. You can continue using the existing client certificate (if it's still valid) and download/import the newly generated one later. The new client certificate will expire on the same day as the new server certificate.

As for the Road Warrior server certificate renewal, the consideration about the client behavior is the same: if the certificate renewal is done while clients are connected, it's necessary for the client to disconnect and then reconnect to the server to restore the connection, while if the certificate renewal is done while **clients are disconnected (recommended way)**, the connection will be automatically restored when they will try to connect again.

CA certificate expired
^^^^^^^^^^^^^^^^^^^^^^
In this scenario, you've to proceed with the generation of a completely new PKI.

1. Access the server firewall terminal.
2. Execute the following commands:

.. code-block:: bash

    ns-openvpn-renew-ca {vpn-instance}
    service openvpn restart

These commands will generate a new CA certificate, as well as new server and client certificates signed by the new CA.
In this scenario, it is **mandatory** to download and import the new client configuration on the client side to restore the connection, so make sure to do it as soon as possible to minimize downtime.

All considerations remain the same as for Road Warrior connections. If the expired certificate is the CA certificate, you have to generate a completely new PKI, while if the expired certificate is the server or client one, you can regenerate it using the dedicated action.