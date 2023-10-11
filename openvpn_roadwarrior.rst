===================
OpenVPN Roadwarrior
===================

.. warning::

   This feature is still under development and does not have a user interface yet. It can currently only be configured through the command line.

Roadwarrior refers to a specific configuration of the OpenVPN VPN tailored for remote users, allowing them secure access to a
private network from anywhere on the internet.
This setup is particularly useful for businesses and organizations with employees or collaborators spread across different locations,
ensuring encrypted communication and data privacy.
OpenVPN Roadwarrior configuration support various authentication methods:

1. local user authentication with certificate only
2. local user authentication with password
3. local user Authentication with password and certificate
4. remote OpenLDAP/Active Directory user authentication with password
5. remote OpenLDAP/Active Directory user authentication with password and certificate

Clients connected to the roadwarrior are assigned to the ``rwopenvpn`` zone, which is inherently trusted.
This zone has privileged access to both LAN and WAN zones within the network infrastructure.

This is a detailed list of currently implemented authentication methods:

See the `developer manual <https://dev.nethsecurity.org/packages/ns-openvpn/#openvpn-road-warrior>`_ for more info on manual configuration.
