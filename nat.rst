.. _nat-section:

===
NAT
===

Network Address Translation (NAT) is used to modify network address information in packet headers while in transit.
NAT primarily enables the translation of private IP addresses used within a local network to a public IP address, allowing multiple devices within
the local network to share a single public IP when accessing the internet.
As default, all hosts within the local network access the WAN using the firewall are using masquerade.
Masquerade is a form of NAT that automatically assigns the source IP address of outgoing packets to the public IP address of the firewall.
This ensures that internal hosts accessing the internet appear to external servers as if they are originating from the firewall's public IP address.

Access the ``NAT`` page under the ``Firewall`` section to configure the following types of NAT rules:

- :ref:`Source NAT <snat-section>`
- :ref:`Masquerade <masquerde-section>`
- :ref:`Disable NAT (no-NAT) <disable_nat-section>`
- :ref:`Netmap <netmap-section>`

Please note that these NAT rules are applied to all network protocols.

You can configure also destination NAT rules (DNAT), usually namedport forward or port rediects, from the :ref:`port forward <port_forward-section>` page.

.. _snat-section:

Source NAT
==========

Source NAT, often referred to as SNAT, modifies the source IP address of outgoing packets. It is commonly used in networks where private IP addresses
are translated into a single public IP address when communicating with external networks. SNAT ensures that responses from external servers are
routed back to the correct internal device by modifying the source IP address of outgoing packets to the public IP address.
This allows multiple internal devices to access the internet using a shared public IP address, enhancing security and scalability.

**Example** You have a small business with two public IP addresses provided by your internet service provider (ISP). 
You want to use one of these IPs (1.2.3.4) specifically for your internal mail server (192.168.1.33) to improve its reputation and sender authentication.
The other IP address will be used for general internet access.

**Problem** By default, all outgoing traffic from your network uses the same public IP, including your mail server
This can negatively impact the reputation of your mail server, as spammers often use shared IPs. Additionally, you might require specific configurations
for the mail server that differ from other internet traffic.

**Solution** Create a SNAT (Static Network Address Translation) rule in your firewall to direct all outgoing traffic from your mail server to the dedicated public IP address.
The rule should contain the internal IP address of your mail server (192.168.1.33) as the source and the dedicated public IP (1.2.3.4) address as the translation address, outbound zone must be set to WAN;
select SNAT as action.

**Result** All outbound traffic originating from your mail server will now be translated to the dedicated public IP address.
This improves the reputation of your mail server and allows for specific configurations tailored to its needs. General internet traffic will continue to use the other public IP address.

.. _masquerde-section:

Masquerade
==========

The masquerade rule masks all outgoing traffic with the IP address of the firewall's outbound interface.
Traffic from internal hosts to the Internet are automatically masqueraded by the firewall.
Masquerade can also be used to mask traffic originating from a remote network (e.g., VPN) with the firewall's IP to avoid any routing issues.

**Example** You need to reach a host on the local network (routed) from the VPN network (192.168.7.0/24), but the host doesn't have a configured gateway or has a different gateway than the firewall.

**Problem** The host cannot reach the local device due to the lack of a gateway.

**Solution** Create a NAT rule with masquerade on the VPN interface. This masks the outgoing traffic from the VPN (192.168.7.0/24) with the firewall's IP (192.168.1.1).
The rule should contain the VPN network (192.168.7.0/24) as the source and the internal host network (10.0.0/24) as the destination address, outbound zone can be left empty;
select NASQUERADE as action.

**Result** The host can reach the local device (10.0.0.1) as if it originated from the firewall.

.. _disable_nat-section:

Disable NAT (no-NAT)
====================

Disabling NAT (no-NAT) allows you to bypass the NAT process for specific traffic. This is useful when you want to route traffic between two private networks.
For example, if you have two private networks and want to route traffic between them without modifying the source or destination IP addresses, you can use no-NAT rules to bypass the NAT process.

**Example** You have a local network (192.168.1.0./24)  with devices connected to a router behind your firewall.
This router acts as a gateway for both internet access and a Content Delivery Network (CDN).
However, traffic heading towards the CDN network (192.168.50.0/24) isn't masked with your firewall's main IP address.

**Problem** This unmasked traffic exposes the IP addresses of your local devices to the internet, creating a potential security risk.
Additionally, the CDN might not function correctly if it doesn't receive traffic with the "official" firewall IP.

**Solution**: Create a NAT (Network Address Translation) rule with ACCEPT in your firewall.
This rule masks the source IP address of all traffic directed towards the CDN network, replacing it with your firewall's public IP address.
The rule should contain the internal network (192.168.1.0./24) as the source and the CDN network (192.168.50.0/24) as the destination address,
outbound zone must be set to LAN; select ACCEPT as action.

.. _netmap-section:

Netmap
======

Netmap os a NAT technique that offers 1:1 network-wide translation without changing the individual host addresses.
This means it could map an entire private network (e.g., 192.168.1.0/24) to a another network (e.g., 10.5.6.0/24) at once,
eliminating the need to manually configure individual NAT rules for each device.

**Example** In some cases, the remote and local networks of a Net to Net VPN may overlap. This makes it impossible to route traffic between the two networks.
Networks A and B are overlapping (192.168.0.0/24). They will be translated to networks 10.1.1.0/24 and 10.2.2.0/24 in order to be able to communicate:

* Network A: 192.168.0.0/24 -> is translated to -> Network C: 10.1.1.0/24
* Network B: 192.168.0.0/24 -> is translated to -> Network D: 10.2.2.0/24

If from host 192.168.0.1 on LAN A I want to reach host 192.168.0.1 on LAN B, I will need to contact the translated IP 10.2.2.1.

**Solution** The problem can be solved by using netmap to translate the traffic to a different private network. This allows the traffic to be routed correctly.
FIXME: add the netmap rule

**Result** The traffic between networks A and B will be routed correctly.

Source Netmap
-------------

FIXME

Destination Netmap
------------------

FIXME