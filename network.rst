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

.. rubric:: IPv4 addresses for private networks (RFC1918)

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

When creating a bond, the UI will display a management IP address in the private network 127.x.x.1/32.
This IP address is used solely for managing the bond and is not involved in traffic forwarding.
Once the bond device is created, you can assign an IP address and a firewall zone to it.
Please note that bond configuration is not editable after creation. If you need to modify the bond's IP address or zone,
you'll have to remove its configuration and reconfigure it again.
If you need to change bond devices, bond mode or management IP you'll have to remove bond configuration and bond device and recreate it from scratch

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

PPPoE with DHCPv6-PD
^^^^^^^^^^^^^^^^^^^^

DHCPv6 Prefix Delegation (DHCPv6-DP) automates the assignment of IPv6 prefixes from your internet service provider (ISP).
It eliminates the need for manual configuration or Network Address Translation (NAT), simplifying IPv6 deployment.

First, make sure your ISP supports DHCPv6-PD, than follow these steps:

- Configure WAN Interface: set the WAN interface mode to PPPoE and enable the ``Enable IPv6`` option
- Configure LAN interface: enable the "Enable IPv6" option and leave the IPv6 address field blank

By enabling IPv6 for both WAN and LAN interfaces without specifying an address for the LAN, your router will automatically request
and receive an IPv6 prefix (usually a /64) from your ISP through DHCPv6-PD.
This prefix will then be used to assign individual IPv6 addresses to devices on your network.

USB-to-Ethernet Adapters
------------------------

USB-to-Ethernet adapters are not considered suitable for use in a firewall device that is critical to network communication, for this reason the drivers are not included in the NethSecurity image.
Only for experimental purposes, specific drivers can be installed via the package manager for use in a test environment.

.. note::

 It is strongly recommended **not to use these adapters in production environments**.
 For Enterprise/Subscription versions: USB-to-Ethernet adapters **are not covered by Nethesis support**.

How to install USB-to-Ethernet modules
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

These packages can be installed from the command line console, just find the correct module and install it.

* Verify the ethernet adapter is connected to USB using ``lsusb``.Output example: 
::

  # lsusb
  Bus 002 Device 002: ID 0bda:8153 Realtek USB 10/100/1000 LAN
  Bus 002 Device 001: ID 1d6b:0003 Linux 5.15.162 xhci-hcd xHCI Host Controller
  Bus 001 Device 002: ID 0627:0001 QEMU QEMU USB Tablet
  Bus 001 Device 001: ID 1d6b:0002 Linux 5.15.162 xhci-hcd xHCI Host Controller

* Search for the the kernel module: 
::

  opkg update
  opkg find kmod-usb-net-\*

* Output example:
::

  kmod-usb-net-aqc111 - 5.15.162-1 - Support for USB-to-Ethernet Aquantia AQtion 5/2.5GbE
  kmod-usb-net-asix-ax88179 - 5.15.162-1 - Kernel module for USB-to-Ethernet ASIX AX88179 based USB 3.0/2.0 to Gigabit Ethernet adapters.
  kmod-usb-net-cdc-ether - 5.15.162-1 - Kernel support for USB CDC Ethernet devices
  kmod-usb-net-cdc-ncm - 5.15.162-1 - Kernel support for CDC NCM connections
  kmod-usb-net-dm9601-ether - 5.15.162-1 - Kernel support for USB DM9601 devices
  kmod-usb-net-lan78xx - 5.15.162-1 - Kernel module for Microchip LAN78XX based USB 2 & USB 3 10/100/1000 Ethernet adapters.
  kmod-usb-net-mcs7830 - 5.15.162-1 - Kernel module for USB-to-Ethernet MCS7830 convertors
  kmod-usb-net-pegasus - 5.15.162-1 - Kernel module for USB-to-Ethernet Pegasus convertors
  kmod-usb-net-rtl8150 - 5.15.162-1 - Kernel module for USB-to-Ethernet Realtek 8150 convertors  
  kmod-usb-net-rtl8152 - 5.15.162-1 - Kernel module for USB-to-Ethernet Realtek 8152 USB2.0/3.0 convertors
  kmod-usb-net-smsc95xx - 5.15.162-1 - Kernel module for SMSC LAN95XX based devices
  kmod-usb-net-sr9700 - 5.15.162-1 - Kernel module for CoreChip-sz SR9700 based USB 1.1 10/100 ethernet devices

* Install the right driver:
::

  opkg install kmod-usb-net-rtl8150

* Verify a new ethX interface appears using ifconfig -a
* Configure the ethernet from the UI

USB-to-Serial Adapters
----------------------
USB to serial adapters are managed in the same way as USB to Ethernet adapters. 
In this case, two packages are provided for installation, covering the vast majority of adapters available on the market.
::

  kmod-usb-serial-cp210x - 5.15.162-1 - Kernel support for Silicon Labs cp210x USB-to-Serial converters
  kmod-usb-serial-pl2303 - 5.15.162-1 - Kernel support for Prolific PL2303 USB-to-Serial converters

* To install Prolific PL2303 driver:
::

  opkg install kmod-usb-serial-pl2303

* The logs will show an output similar to this:
::

  Aug  6 08:08:17 nsec8 kernel: [ 2346.359247] usb 1-6: new full-speed USB device number 3 using xhci_hcd
  Aug  6 08:08:17 nsec8 kernel: [ 2346.543052] pl2303 1-6:1.0: pl2303 converter detected
  Aug  6 08:08:17 nsec8 kernel: [ 2346.550401] usb 1-6: pl2303 converter now attached to ttyUSB0
