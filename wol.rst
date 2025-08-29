=======================
Wake-On-Lan (Etherwake)
=======================

Wake-on-LAN (WoL) is a technology that allows a powered-off or suspended device to be remotely turned on by sending a special network message called a Magic Packet to its network interface.
The EtherWake package provides a simple command-line utility to send these Magic Packets and wake up devices in the local network.
On NethSecurity, EtherWake is available in the official repositories but it is not installed by default.

.. note::
    The target device must support Wake on LAN (WoL) and have the feature enabled in its BIOS/UEFI and network card settings. Otherwise, it will not respond to Magic Packets.

Install the required package
----------------------------

Install the required packages::

    opkg update
    opkg install etherwake

These packages are not preserved during a system upgrade. For more info see :ref:`restore_extra_packages-section`.

Usage
-----

To wake up a device on the LAN, you need to know:

- the ``MAC address`` of the device to be powered on
- the NethSecurity interface where the device is connected (e.g. ``eth0``)::

etherwake -i <interface> <MAC>

Example::

    etherwake -i eth0 00:11:22:33:44:55

