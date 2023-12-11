.. _ipsec_tunnels-section:

==============
IPsec tunnels
==============

IPsec tunnels, are a crucial component of modern network security. 
These tunnels provide a secure and encrypted communication pathway over the internet or any untrusted network, ensuring the confidentiality and integrity of data in transit. 

IPsec (IP Security) protocol is the ‘de facto’ standard in VPN tunnels, it’s typically used to create net to net tunnels and it’s supported from all manufacturers. 
You can use this protocol to create VPN tunnels between a NethSecurity and a device from another manufacturer as well as VPN tunnels between 2 NethSecurity.

NethSecurity by default uses Route-Based VPNs, so each tunnel rely on a specific tun type device. 

Configuration
-------------
The configuration of an IPsec tunnel includes 2 peers which we will call A and B which can be:

* 1 Nethsecurity and 1 third-party firewall
* 2 Nethsecurity

Devices A and B must be configured with parameters which, depending on the specific section, will be identical or mirrored.

The parameters that must be configured in a mirrored way between the 2 devices are typically those linked to the network:

* the WAN interface used by the tunnel
* the 2 (or more) networks we want to connect (local network, remote network)
* the local and remote identifiers (typically the public IPs of the WANs of the 2 firewalls, but others can also be used)

Therefore:

* The WAN IP address of firewall A must coincide with the Remote IP address of firewall B
* the local network of firewall A must coincide with the remote network of firewall B
* the local ID of firewall A must coincide with the remote ID of firewall B

All other parameters, however, must be identical in both firewalls to allow correct communication (encryption key, IKE and ESP configuration, etc.).
NethSecurity uses a shared key as the only method to encrypt data.

How to create a new IPsec tunnel
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Click :guilabel:`Add IPsec tunnel` button to configure a new tunnel.
Assign a name to this tunnel then configure it, the drawer is splitted in 3 steps, the step 1/3 contains only network-related parameters, while the others contain all the remaining parameters that must be identical in both firewalls to allow correct communication.

Once you completed the configuration a new tunnel will be shown in the IPSec page.


.. note:: If an endpoint is behind a NAT, we suggest to set the values for Local and Remote identifier fields to custom unique names with an "email like" syntax, e.g. nsec@site-a and otherdevice@site-b.



