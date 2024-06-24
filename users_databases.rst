.. _users_database-section:

===============
Users databases
===============

NethSecurity introduces support for two types of users databases: a local database and a remote LDAP database, enhancing user management capabilities.
Users inside the databases can be used for VPN connections, including the :ref:`openvpn_roadwarrior-section`.

Only users with a password can connect to VPN by authenticating with a username and password.
Users without a password can connect to VPN by authenticating with a certificate or other authentication methods.

Local database
==============

The local user database is an inherent component of the firewall,
ensuring seamless user authentication for VPN services. It is present by default, offering a foundation for user management.

To create a new user, click on the :guilabel:`Add user` button to initiate the process.
When configuring a local user, you should fill all the following fields:

* ``Username``: specifies the desired username.
* ``Display Name``: specifies the display name of the user. This field is optional.
* ``User password``: specifies the password of the user. This is required only if the VPN is configured to use password authentication.
* ``Confirm password``: specifies the password of the user, make sure to match the password with the one specified in the previous field.

The local user database is implemented as UCI configuration file.
Passwords of local users are stored in the Unix passwd format, ensuring compatibility and security in the local user database.

Users inside the local database can be granted :ref:`administrative privileges <admin_users-section>` on the web user interface by enabling the ``Administrator user`` option.
The user must have a password set.

Remote databases
================

.. admonition:: Subscription required

   This feature is available only if the firewall has a valid subscription.

The administrator can extend the capabilities of the firewall by adding new remote databases.
Users in remote databases must be added directly at the source.
User modifications should be made on the underlying LDAP server to accurately reflect changes in the firewall configuration page.

If the remote database is offline, VPN authentication will fail.
It is crucial to ensure that the remote database is online and accessible to ensure proper user authentication through the VPN service.

When configuring a remote database, click on the :guilabel:`Add remote database` button  and fill all the following fields:

* ``LDAP URI``: specifies the LDAP Uniform Resource Identifier (URI), including the server address and port (e.g., ``ldap://example.com:389``).

* ``Type``: specifies the type of LDAP server. The available options are ``Active Directory`` and ``OpenLDAP``. If OpenLDAP is selected,
  the remote server should respect the RFC 2307 schema.

* ``Base DN``: specifies the LDAP Base Distinguished Name (DN), representing the starting point for searches in the LDAP directory (eg. ``dc=example,dc=com``).

* ``User DN``: specifies the LDAP User Distinguished Name (DN). If not present, the default value is equal to base_dn (eg. ``cn=users,dc=example,dc=com``).

* ``User attribute field``: specifies the user attribute used to identify the user, this option is used by the OpenVPN road warrior server to compose the user bind DN.
  It should be ``cn`` for Active Directory or ``uid`` for OpenLDAP.

* ``User CN field``: specifies the user attribute containing the user's complete name. For example, ``cn`` for both Active Directory and OpenLDAP.

* ``Bind DN``: specifies the LDAP Bind Distinguished Name (DN), representing the user used to bind to the LDAP server (eg. ``cn=admin,dc=example,dc=com``).

* ``Bind password``: specifies the password of the user used to bind to the LDAP server.
 
* ``StartTLS``: enables StartTLS for secure communication with the LDAP server

* ``Verify TLS certificate``: determines whether to enable or disable certificate validation
