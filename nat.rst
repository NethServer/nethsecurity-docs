===
NAT
===

.. warning::

   This feature is still under development and can be configured only from LuCI web interface.

Network Address Translation (NAT) is used to modify network address information in packet headers while in transit.
NAT primarily enables the translation of private IP addresses used within a local network to a public IP address, allowing multiple devices within
the local network to share a single public IP when accessing the internet.
As default, all hosts within the local network access the WAN using the firewall are using masquerade.
Masquerade is a form of NAT that automatically assigns the source IP address of outgoing packets to the public IP address of the firewall.
This ensures that internal hosts accessing the internet appear to external servers as if they are originating from the firewall's public IP address.

There are two other common types of NAT configuration:

- Source NAT (SNAT)
- Destination (DNAT or port forward, see the :ref:`port forward chapter <port_forward-section>`

Source NAT
==========

Source NAT, often referred to as SNAT, modifies the source IP address of outgoing packets. It is commonly used in networks where private IP addresses
are translated into a single public IP address when communicating with external networks. SNAT ensures that responses from external servers are
routed back to the correct internal device by modifying the source IP address of outgoing packets to the public IP address.
This allows multiple internal devices to access the internet using a shared public IP address, enhancing security and scalability.

Access the legacy LuCI web interface to configure source NAT rules.
