.. _ipsec_tunnels-section:

==============
IPSec tunnels
==============

IPsec tunnels, are a crucial component of modern network security. 
These tunnels provide a secure and encrypted communication pathway over the internet or any untrusted network, ensuring the confidentiality and integrity of data in transit. 

IPsec (IP Security) protocol is the ‘de facto’ standard in VPN tunnels, it’s typically used to create net to net tunnels and it’s supported from all manufacturers. 
You can use this protocol to create VPN tunnels between a NethSecurity and a device from another manufacturer as well as VPN tunnels between 2 NethSecurity.

NethSecurity by default uses Route-Based VPNs, so each tunnel rely on a specific tun type device. 

Configuration
-------------
The configuration of an IPsec tunnel involves 2 peers which we will call A and B, data will be encrypted using same shared key in both firewalls.

The IPsec tunnel configuration of each firewall consists of 2 main blocks:
* network parameters
* all other parameters (data encryption, IKE configuration, ESP...)

The network parameters concern:
* the WAN interface used
* the 2 (or more) networks we want to connect (local network, remote network)
* identifiers (typically the public IP addresses of the WANs of the 2 firewalls, but others can also be used)

The network parameters must be configured in a mirrored way in firewalls A and B, therefore:
* The WAN IP address of firewall A must coincide with the Remote IP address of firewall B
* the local network of firewall A must coincide with the remote network of firewall B
* the local ID of firewall A must coincide with the remote ID of firewall B

Click Add IPsec tunnel on NethSecurity to configure the new tunnel.
All network parameters are configurable in step 1/3 of the NethSecurity drawer.

All the other parameters (step 2/3 and 3/3 on NethSecurity) must be identical in both firewalls A and B to allow correct communication.

Note:
If an endpoint is behind a NAT, we suggest to set the values for Local and Remote identifier fields to custom unique names with an "email like" syntax, e.g. nsec@site-a and otherdevice@site-b.



