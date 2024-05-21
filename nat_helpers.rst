===========
NAT helpers
===========

.. warning::

   This feature is still under development and does not have a user interface yet. It can currently only be configured through the command line.

NAT (Network Address Translation) helpers, also known as NAT ALGs (Application Layer Gateways), are components in the firewall that assist in
translating IP addresses and port numbers embedded within application-layer data packets.
NAT helpers are essential in scenarios where network protocols include IP addresses and port information inside the packet payload,
making it necessary to modify these details for proper NAT traversal.

For example, in FTP, NAT helpers modify the IP addresses and ports inside the FTP control and data packets, enabling proper NAT traversal for FTP connections. 
Similarly, NAT helpers for SIP and other protocols ensure that devices using these protocols can establish connections across NAT boundaries without issues.

On a fresh installation, NAT helpers are disabled by default.
But when migrating from NethServer 7 to NethSecurity 8, the NAT helpers are enabled by the migration procedure.

To configure NAT helpers, follow the instruction inside the `developer manual <https://dev.nethsecurity.org/design/nat_helpers/>`_.
