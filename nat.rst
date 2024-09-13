.. _nat-section:

===
NAT
===

Network Address Translation (NAT) is used to modify network address information in packet headers while in transit.
NAT primarily enables the translation of private IP addresses used within a local network to a public IP address, allowing multiple devices within
the local network to share a single public IP when accessing the internet.
As default, all hosts within the local network access the WAN using the firewall are using masquerade.
Masquerade is a form of NAT that automatically assigns the source IP address of outgoing packets to the WAN IP address of the firewall.
This ensures that internal hosts accessing the internet appear to external servers as if they are originating from the firewall's public IP address.

Access the ``NAT`` page under the ``Firewall`` section, this page is organized in two tabs: ``Rules and NETMAP`` and ``NAT helpers``.

``Rules and NETMAP`` tab allows to configure the following types of NAT rules:

- :ref:`Source NAT <snat-section>`
- :ref:`Masquerade <masquerade-section>`
- :ref:`Accept (disable NAT) <disable_nat-section>`
- :ref:`Netmap <netmap-section>`

Please note that these NAT rules are applied to all network protocols.

You can configure also destination NAT rules (DNAT), usually namedport forward or port redirects, from the :ref:`port forward <port_forward-section>` page.

``NAT helpers`` tab allows to enable or disable NAT helpers:

- :ref:`NAT helpers <helpers-section>`

.. _snat-section:

SNAT
====

Source NAT, often referred to as SNAT, modifies the source IP address of outgoing packets. It is commonly used in networks where private IP addresses
are translated into a single public IP address when communicating with external networks. SNAT ensures that responses from external servers are
routed back to the correct internal device by modifying the source IP address of outgoing packets to the public IP address.
This allows multiple internal devices to access the internet using a shared public IP address, enhancing security and scalability.

**Example** You have a small business with two public IP addresses provided by your internet service provider (ISP). 
You want to use one of these IPs (1.2.3.4) specifically for your internal mail server (192.168.1.33) to improve its reputation and sender authentication.
The other IP address will be used for general internet access.

**Problem** By default, all outgoing traffic from your network uses the same WAN IP, including your mail server
This can negatively impact the reputation of your mail server, as spammers often use shared IPs. Additionally, you might require specific configurations
for the mail server that differ from other internet traffic.

**Solution** Configure the alias IP (1.2.3.4) on your WAN interface, then create a SNAT (Static Network Address Translation) rule in your firewall to direct all outgoing traffic from your mail server to the dedicated public IP address.
The rule should contain the internal IP address of your mail server (192.168.1.33) as the source and the dedicated public IP (1.2.3.4) address as the translation address, outbound zone must be set to WAN;
select SNAT as action.

**Result** All outbound traffic originating from your mail server will now be translated to the dedicated public IP address.
This improves the reputation of your mail server and allows for specific configurations tailored to its needs. General internet traffic will continue to use the other public IP address.

Source NAT in a MultiWAN scenario
---------------------------------

If you have multiple WANs and your SNAT rule rewrites to one of the public WAN IPs, you need to create a MultiWAN rule in addition to the SNAT rule. This rule will route traffic from the source IP address through the right WAN with the public IP address.

If you haven't set this up yet, add a custom policy that includes only the relevant WAN.
Then, create a rule to apply this custom policy for traffic originating from the internal IP address (source address) to any destination and protocol.

.. _masquerade-section:

MASQUERADE
==========

The masquerade rule masks all outgoing traffic with the IP address of the firewall's outbound interface.
Traffic from internal hosts to the Internet are automatically masqueraded by the firewall.
Masquerade can also be used to mask traffic originating from a remote network (e.g., VPN) with the firewall's IP to avoid any routing issues.

**Example** You need to reach a host on the local network (routed) from the VPN network (e.g. 192.168.7.0/24), but the host doesn't have a configured gateway or has a different gateway than the firewall.

**Problem** The host cannot reach the local device due to the lack of a gateway.

**Solution** Create a NAT rule with masquerade action for the traffic coming from the VPN Network. This masks the traffic from the VPN network (192.168.7.0/24) to the local network with the firewall's IP of the destination interface.
The rule should contain the VPN network (192.168.7.0/24) as the source and the internal host network (192.168.1.0/24) as the destination address, outbound zone can be left empty;
select MASQUERADE as action.

**Result** The host can reach the local device (e.g. 192.168.1.78) as if it originated from the firewall.

.. _disable_nat-section:

ACCEPT (disable NAT)
====================

An ACCEPT rule disables the NAT (no-NAT) and allows you to bypass the NAT process for specific traffic.
This is particularly useful when it comes to avoiding WAN masquerading for specific destinations.

**Example** Your firewall is connected to a router that, in addition to allowing internet access, also enables reaching private networks through CDN connections or IPsec tunnels. 
In order to reach private remote networks, traffic from local network must come out with its original IP address (no masquerade rewriting).

**Problem** The router tunnel policies only allow traffic between the NethSecurity local network and the destination networks, but all traffic comes out of the firewall with the masked IP (NethSecurity WAN IP).
Due to masquerading, direct communication between the NethSecurity LAN and the remote network is not possible.

**Solution**: Create a NAT (Network Address Translation) rule with ACCEPT in your firewall.
This rule avoid masquerading for all the traffic towards the CDN network, keeping the local source IP address unchanged.
The rule should contain the internal network (192.168.1.0./24) as the source and the CDN network (192.168.50.0/24) as the destination address.

.. _netmap-section:

Netmap
======

Netmap is a NAT technique that offers 1:1 network-wide translation without changing the individual host addresses.
This means it could map an entire private network (e.g., 192.168.1.0/24) to a another network (e.g., 10.5.6.0/24) at once,
eliminating the need to manually configure individual NAT rules for each device.

**Example** 2 firewalls, FW-A and FW-B holding a VPN tunnel between networks A and B, local and remote networks are overlapping (192.168.1.0/24), so this makes it impossible to route traffic between them. 
Translate A and B networks onto two alternative networks can solve the problem so that there are no overlapping networks.

Let's use this translation scheme.

* Network A: 192.168.1.0/24 -> is translated to -> Network ALT_A: 10.1.1.0/24
* Network B: 192.168.1.0/24 -> is translated to -> Network ALT_B: 10.2.2.0/24

A host in network A trying to reach a host in network B must not contact the real IP but its translated network (only the last octet remains the same). 
For example, the host 192.168.1.10 from the network A wanting to reach 192.168.0.20 in network B must contact the IP 10.2.2.20 instead.
Before the request exits firewall  FW-A, the source of the packet will be rewritten by FW-A to the ALT_IP 10.1.1.10 to eliminate every routing issue on network B. The inverse process will occur for the returning packets.


**Solution** The problem can be solved by using netmap to translate the traffic to a different private network. This allows the traffic to be routed correctly.

**How to do it**

To allow network A to access a resource in network B, two rules are necessary: one for source netmap and one for destination netmap.

* The first rule, acting as a source netmap, specifies that all traffic directed towards the network 10.2.2.0/24 (destination network) and originating from the network 192.168.1.0/24 (source network) will be mapped onto the network 10.1.1.0/24 (mapped source network).

* The second rule functions as a destination netmap, playing a crucial role in correctly receiving responses. It necessitates that traffic originating from the network 10.2.2.0/24 (source network) and destined for the network 10.1.1.0/24 (destination network) will be mapped onto the network 192.168.1.0/24 (mapped destination network).


**Result** All traffic requests (and their responses) from network A to network B will be routed correctly.

.. note:: If you need to allow requests starting from network B toward network A you must do the same in the firewall B.

Source netmap
-------------

The "source netmap" allows us to determine how the source should change when traffic is directed towards a specific destination. 
E.g., destination network 10.2.2.0/24, source network: 192.168.0.0/24, natted source network: 10.1.1.0/24.

You can create a source netmap rule from the web interface inside the ``NAT`` page.
On the lower part of the page, click on the :guilabel:`Add source NETMAP` button to create a new rule.
Inside the drawer, fill the fields as follows:

- **Name**: a name for the rule
- **Destination network**: the destination network in CIDR notation, e.g., 10.2.2.0/24 for the example above
- **Source network**: the source network, e.g., 192.168.1.0/24
- **Mapped network**: the translated source network, e.g., 10.1.1.0/24

Under the ``Advanced settings`` section, you can specify the input and output devices for the rule.
If the device is not specified, the rule will be applied to all devices.

Destination Netmap
------------------

The "destination netmap" allows us to determine how the destination IP should change when traffic comes from a specific network.
E.g., source network 10.2.2.0/24, destination network: 10.1.1.0/24, natted destination network: 192.168.0.0/24.

You can create a destination netmap rule from the web interface inside the ``NAT`` page.
On the lower part of the page, click on the :guilabel:`Add destination NETMAP` button to create a new rule.
Inside the drawer, fill the fields as follows:

- **Name**: a name for the rule
- **Source network**: the source network in CIDR notation, e.g., 10.2.2.0/24
- **Destination network**: the destination network, e.g., 10.1.1.0/24
- **Mapped network**: the translated destination network, e.g., 192.168.1.0/24

Under the ``Advanced settings`` section, you can specify the input and output devices for the rule.
If the device is not specified, the rule will be applied to all devices.

CLI commands
------------

To create a SOURCE netmap rule from CLI ::

 uci set netmap.r1=rule
 uci set netmap.r1.name=source_nat
 uci set netmap.r1.dest=10.2.2.0/24
 uci set netmap.r1.map_from=192.168.1.0/24
 uci set netmap.r1.map_to=10.1.1.0/24

you can also specify optional in/out devices this way::

 uci  add_list netmap.r1.device_in='eth0'
 uci  add_list netmap.r1.device_out='tunrw1'

Then commit and apply::

 uci commit netmap
 ns-netmap

To create a DESTINATION netmap rule from CLI ::

 uci set netmap.r2=rule
 uci set netmap.r2.name=dest_nat
 uci set netmap.r2.src=10.2.2.0/24
 uci set netmap.r2.map_from=10.1.1.0/24
 uci set netmap.r2.map_to=192.168.1.0/24

you can also specify optional in/out devices this way::

 uci  add_list netmap.r2.device_in='tunrw1'
 uci  add_list netmap.r2.device_out='eth01'

Then commit and apply::

 uci commit netmap
 ns-netmap
 /etc/init.d/firewall reload

.. _helpers-section:

NAT helpers 
===========

NAT helpers are mechanisms designed to facilitate communication for certain protocols that may encounter issues when used with basic NAT. 
Some common protocols, such as FTP, SIP, or H.323, embed IP addresses or port numbers within the data payload, which can create problems with standard NAT.

NAT helpers, also known as Application Layer Gateways (ALG), operate at the application layer. Their main role is to modify protocol-specific data, such as embedded IP addresses or ports within packets, ensuring that these protocols (like FTP, SIP, or H.323) function properly when passing through NAT.

NethSecurity provides various types of NAT helpers, all of which are disabled by default. If needed, specific helpers can be enabled via the web UI, and a reboot is required after any modification to activate or deactivate the selected helper.

.. note:: When certain helpers are enabled, related helpers are automatically activated as dependencies. In these cases, the interface shows an informational icon to notify the user.
