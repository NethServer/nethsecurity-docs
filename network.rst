==================
Network interfaces
==================

The ``Interfaces and devices`` page configures how the server is connected to the
local network (LAN) and/or other networks (i.e. Internet).

NethSecurity supports an unlimited number of network interfaces.
Any network managed by the system must follow these rules:

* networks must be logically separated: each network must have different addresses
* private networks, like LANs, must follow address's convention from :ref:`RFC1918 <RFC1918-section>` document
* networks should be physically separated using different switches or logically separated using VLAN (Virtual Local Area Network)

Every network interface has a specific zone which determines its behavior.
A basic network setup for a router typically includes a minimum of two interfaces, namely LAN (Local Area Network) and WAN (Wide Area Network):

* *lan*: local network, hosts on this network can access any other configured network
* *wan*: public network, hosts on this network can access only the server itself

All configured network interfaces are listed at the top of the page.
Each interface is displayed with its name and the assigned firewall zone.
This section offers an immediate overview of the current configurations, allowing users to quickly see which networks are already
set up and associated with specific security zones.

In the bottom section of the page, available but unconfigured network devices are listed. To configure a device, the user clicks 
on the :guilabel:`Configure` button corresponding to the desired device.
The newly created :ref:`VLAN devices <vlan-section>` are visible in this section. 

.. _RFC1918-section:

.. rubric:: Addresses for private networks (RFC1918)

TCP/IP private networks not directly connected to Internet should use special addresses selected by
Internet Assigned Numbers Authority (IANA).

===============   ===========   =============================
Private network   Subnet mask   IP addresses interval
===============   ===========   =============================
10.0.0.0          255.0.0.0     10.0.0.1 - 10.255.255.254
172.16.0.0        255.240.0.0   172.16.0.1 - 172.31.255.254
192.168.0.0       255.255.0.0   192.168.0.1 - 192.168.255.254
===============   ===========   =============================

.. _logical_interfaces-section:

Logical interfaces
------------------

Logical network interfaces are virtual network interfaces that allow for additional flexibility and functionality in networking setups.
Unlike physical network interfaces, which correspond to actual hardware ports, logical network interfaces are software-based and can be
configured and managed to suit specific networking requirements.

Click on the :guilabel:`Add logical interface` button to create a new virtual network device.
The device can be a

* *bridge*: it is a logical network interface that connects two or more different network segments, allowing communication between devices in these segments.
  A bridge effectively extends the local network, enabling devices to communicate as if they were on the same physical network.
* *bond*: also known as network bonding or NIC bonding, is a method of combining two or more physical network interfaces into a single logical interface.
  It provides two primary benefits: increased bandwidth and fault tolerance.

Bonds can be configured in multiple mode.:
Modes providing load balancing and fault tolerance:

* Balance Round Robin (recommended)
* Balance XOR
* 802.3ad (LACP): it requires support at driver level and a switch with IEEE 802.3ad Dynamic link aggregation mode enabled
* Balance TLB: it requires support at driver level
* Balance ALB

Modes providing fault tolerance only:

* Active backup (recommended)
* Broadcast policy


.. _vlan-section:

VLAN
----

A VLAN, or Virtual Local Area Network, is a network technology that allows network administrators to create logically segmented networks within a physical network infrastructure. VLANs enable the creation of multiple broadcast domains in a network, even though they are physically connected to the same network switch.

You can create a new VLAN device by clicking the :guilabel:`Create VLAN device` button.
Select the VLAN device type:

* VLAN 802.1q is primarily used for standard VLAN implementations within organizations
* 802.1ad (QinQ) is used in service provider networks where multiple customers require VLAN segmentation,
  and these segmented VLANs need to be transported across the provider's network

Make sure also to chose correct VLAN ID. Please bear in mind that you must setup the same VLAN ID inside the network switch.

.. _IP_aliasing-section:

IP aliasing
-----------

Use IP aliasing to assign more IP addresses to the same network interface.

The most common use is with a wan interface: when the ISP provides a pool of public IP addresses (within the same subnet) you can add some (or all) of them to the same wan interface and manage them individually (e.g. in the port forward configuration).

To add an alias, click the tree-dots menu :guilabel:`⋮` on right corner of the existing network interface, then select :guilabel:`Create alias interface` item.

PPPoE
-----

PPPoE (Point-to-Point Protocol over Ethernet) connects the server to Internet through a DSL modem.
Users can setup a new PPPoE connection using an unassigned Ethernet network interface or creating a new logical interface.

Inside the network interface window, choose the wan zone then, select the ``PPPoE`` protocol.
Then fill all required fields like ``Username`` and ``Password``.
