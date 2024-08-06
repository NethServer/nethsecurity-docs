.. _port_forward-section:

============
Port forward
============

The firewall prevents requests from public networks to access private ones.
For instance, if there's a web server operating within the LAN, only computers within the local network can access this service.
Any attempts made by external users from outside the local network are denied.

A port forward is a networking technique used in firewalls to redirect specific network traffic from one IP address
and port number combination to another. It is typically employed to enable external users to access services or applications 
hosted on devices within a private local network.

For web servers, common listening ports include port 80 (HTTP) and port 443 (HTTPS).
When creating a port forward, certain parameters must be specified:

- ``Name``: assigning a name to a port forward rule is beneficial for future reference and management.
  By providing a descriptive and meaningful name, network administrators can easily identify the purpose and context of each port forward.
- ``Source port``: the port from which the request originates.
- ``Destination port``: the port to which the traffic is directed; this can differ from the source port.
- ``Protocol``: specifies the protocol such as ``TCP``, ``UDP``, ``UDPLITE``, ``ICMP``, ``ESP``, ``AH`` ``SCTP`` or the special value ``ALL`` for all supported protocols.
- ``Destination address``: specifies the internal host to which the traffic should be redirected. This can be:
  - a specific IP address
  - a firewall object: a host defined by a host set, a DHCP reservation, a DNS record or an OpenVPN account

By default, all port forwards are accessible only for hosts inside the WAN. Refer to the :ref:`hairpin-section` for instructions on changing this default behavior.

For each port forward the user can configure also the following aspects:

- Enabling logging: port forwards can be configured to log incoming traffic for each rule. By enabling the ``Log`` option,
  the network administrator can keep track of the traffic passing through the port forward, allowing for monitoring and analysis
- Access restriction: port forwards can be restricted to specific IP addresses, CIDR blocks or a domain set object. By entering a list of allowed IP addresses and CIDR notations, or selecting a domain set object
  inside the ``Restrict access to`` field, the user can limit access to the port forward. This enhances security by controlling which external
  devices are allowed to connect to the internal service.
- Binding to specific public IP: port forwards can be bound to a specific public IP address using the ``WAN IP`` field.
  This means that if your router/firewall has multiple public IP addresses,
  you can assign a port forward to a particular IP. This feature is valuable when dealing with complex network setups, ensuring that traffic directed to
  a specific public IP is forwarded correctly to the internal server.

.. _hairpin-section:

Hairpin NAT
===========

Hairpin NAT, also known as NAT loopback or NAT reflection, is a technique used in networking where internal hosts access a server
located within the same local network using the external IP address of the router or firewall. In other words, when internal devices
attempt to connect to a server using the public IP address, hairpin NAT ensures that the traffic is routed internally without going
out to the internet and then back into the local network.

To enable the hairpin, enable the ``Hairpin NAT`` option and select one or more zones where the NAT loopback should be enabled.
