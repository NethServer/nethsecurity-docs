==========
DNS & DHCP
==========

NethSecurity can provide DNS and DHCP services to every local network.
This section is divided in 5 tabs:

* DHCP
* Static leases
* Dynamic leases
* DNS
* DNS records

DHCP
----
This section allows you to enable and manage a DHCP server for every local network configured in your NethSecurity.
Every local interface is provided with a card where you can enable the service clicking on button :guilabel:`Edit`


``Enable DHCP`` : enable/disable the service

``Range IP start`` : first IP address of DHCP range

``Range IP end`` : last IP address of DHCP range

``Lease time`` :  lease time (default 1 hour)

**Advanced settings**
It is possible to declare very specific DHCP options, searching for the field to configure (e.g. DNS passed to clients, tftp IP address and so on) and then specifying the value.

Static Leases
-------------
Static leases assigns stable IP addresses and symbolic hostnames to DHCP clients. The host is identified by its MAC address, assigned a fixed IP address, and provided with a symbolic hostname for easy recognition.

Click the button :guilabel:`Add reservation` to add a new device's reservation.

``Hostname`` : Hostname asssociated to the IP address

``IP address`` : IP adddress to assign to the specified MAC Address.The IP address must be within the DHCP range

``MAC address`` : MAC address of the device where you want to make the reservation

``Reservation name`` : Optional, freely configurable filed

Dynamic leases
--------------
Dynamic leases represents IP addresses that are currently in use and have been allocated to devices on the network.
This tab shows all currently active leases.

DNS
---
The system will resolve host and domain names using DNS queries to external DNS servers. 
``DNS forwarding servers``: Click the button :guilabel:`Add DNS Server` to specify the desired DNS, you can add more servers, each one is individually managed.

```DNS Domain`` : Insert the the local DNS domain, ensuring that queries for this domain are always resolved locally.

``Log DNS queries``: enable it if you want all the DNS queries to be logged by the system.

DNS records
----------
The system can handle local DNS records. When the server performs a DNS lookup, first it will search inside local DNS records. If no local record is found, an external DNS query will be done.

.. note:: Local DNS record will always override records from external DNS servers.

Click the button :guilabel:`Add DNS record` to add a new DNS hostname.

``Hostname`` : DNS hostname

``IP address`` : IP address associated to hostname

``Name`` : optional field

``Wildcard DNS record``: enable it if you want this answer for any subdomain you haven't already defined


