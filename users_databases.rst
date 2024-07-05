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

.. _remote_user_databases-section:

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

  This field is used to authenticate users in the OpenVPN road warrior server.
  The authentication process is based on a LDAP bind operation which
  uses the user attribute field to compose the user bind DN with the user DN.
  Example: given a user named `jdoe` in the OpenLDAP directory, the user bind DN is composed as `uid=jdoe,ou=People,dc=directory,dc=nh`.

* ``User display name field``: specifies the user attribute containing the user's complete name like `John Doe`.
  Usually is ``cn`` for OpenLDAP and ``displayName`` for Active Directory.

* ``Custom user bind DN``: if this field is set, it overrides the calculated user bind DN used to authenticate users in the
  OpenVPN road warrior server. The field can contain a ``%u`` placeholder which is replaced with the username during the authentication process.
  Use this setting if you do not know if the user CN field contains the user full name, like ``John Doe``, or the username, like ``jdoe``.
  If the remote server is an Active Directory server, you can use one of the following values:

  - ``%u@domain.local``: where `domain.local` is the domain name of the Active Directory server; inside the OpenVPN client, to authenticate the
    user use only the username like ``jdoe``
  - ``DOMAIN\%u``: where `DOMAIN` is the realm of the Active Directory server; inside the OpenVPN client, to authenticate the user use only the
    username like ``jdoe``

  If the remote server is an OpenLDAP you can leave this field empty or specify it like ``uid=%u,dc=directory,dc=nh``.
  
* ``Bind DN``: specifies the LDAP Bind Distinguished Name (DN), representing the user used to bind to the LDAP server.
  For an OpenLDAP server, it's usually something like ``uid=ldapservice,dc=directory,dc=nh``, where for an Active Directory server,
  it's usually something like ``ldapservice@example.com`` or ``cn=ldapservice,cn=Users,dc=example,dc=com``.

* ``Bind password``: specifies the password of the user used to bind to the LDAP server.
 
* ``StartTLS``: enables StartTLS for secure communication with the LDAP server, it should be disabled if the LDAP URI is already using the ``ldaps://`` scheme.

* ``Verify TLS certificate``: determines whether to enable or disable certificate validation, it must be disabled if the LDAP server is using a self-signed certificate.


Suggested configurations
========================

The following configurations are suggested for the most common LDAP servers.
When configuring the remote database:

- ensure the LDAP server is reachable from the firewall. If the LDAP URI contains a hostname, make sure the hostname is resolvable
- replace the example values with the actual values of the LDAP server
- for Active Directory, it's recommended to use ``Custom user bind DN`` to specify how the OpenVPN server should authenticate the user

OpenLDAP (RFC 2307)
-------------------

You can access the NethServer 7 OpenLDAP without authentication:

* LDAP URI: ``ldap://ns7ldap.nethserver.org``
* Type: ``OpenLDAP``
* Base DN: ``dc=directory,dc=nh``
* User DN: ``ou=People,dc=directory,dc=nh``
* User attribute field: ``uid``
* User display name field: ``cn``

If you want to use authentication by entering Bind DN and Bind Password, remember to enable StartTLS.

Active Directory
----------------

To access NethServer 7 Samba Active Directory or Windows Server 2012 Active Directory, use the following configuration:

* LDAP URI: ``ldap://dcserver.ad.example.com``
* Type: ``Active Directory``
* Base DN: ``dc=example,dc=com``
* User DN: ``cn=Users,dc=example,dc=com``
* User attribute field: ``sAMAccountName``
* User display name field: ``displayName``
* Custom user bind DN: ``%u@example.com``
* Bind DN: ``<user>@exampl.com`` or ``cn=<user>,cn=Users,dc=example,dc=com``, where ``<user>`` is the username of the user used to bind to the LDAP server
* Bind Password: ``<password>``, where ``<password>`` is the password of the user inserted in the Bind DN field

The ``StartTLS`` option should be enabled for NethServer 7 Samba Active Directory, while it should be usually disabled for Windows Server 2012 Active Directory.
