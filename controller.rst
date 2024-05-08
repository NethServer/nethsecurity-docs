.. _controller-section:

==========
Controller
==========

The NethSecurity controller is an application that can run on `NethServer 8 <https://docs.nethserver.org/projects/ns8/en/latest/nethsecurity_controller.html>`_ (NS8).
The controller allows remote control of multiple NethSecurity installations, called units.

The firewall can operate independently without the need for the controller.
The controller is an optional component that provides additional management and monitoring capabilities for the firewall.

The controller works by creating a secure connection between the central server and the units.
Each firewall registers with the server using a client called ns-plug.
Once registered, the server generates a VPN configuration that is sent back to the firewall
The VPN enables secure communication between the controller and the unit.

Key features:

- **Centralized Management**: Manage multiple firewalls from a single server.
- **Secure Communication**: Establish a secure `OpenVPN <https://openvpn.net/>`_ connection between the server and the firewalls.
- **Easy Configuration**: Configure firewalls directly from the controller's user interface.
- **Monitoring and Logging**: Collect and analyze logs from the firewalls inside `Loki <https://grafana.com/oss/loki/>`_ for troubleshooting and monitoring purposes.
- **Metrics Visualization**: Visualize metrics from the firewalls using the built-in `Grafana <https://grafana.com/>`_ dashboard.
  Metrics are collected using `Prometheus <https://prometheus.io/>`_.
- **Web-based SSH**: Access the firewalls' command-line interface using a web-based SSH client.

Installation and configuration
===============================

The controller can be installed on a NethServer 8 system from the Software Center. The module is named `NethSecurity Controller`.

After the installation, the controller must be configured. The configuration can be done using the NethServer 8 web interface.
The following parameters need to be set:

- `Controller hostname`: The fully qualified domain name for the controller, like: ``mycontroller.nethsecurity.org``.
- `Let's Encrypt certificate`: Enable or disable Let's Encrypt certificate for the controller web interface.
- `VPN details`: The OpenVPN network and netmask. When choosing the network, make sure it does not overlap with the existing networks inside all
  the units that will be connected to the controller.
- `VPN common name`: The OpenVPN certificate name which is also the name of the controller.
- `Administrator user and password`: The default controller admin user and password. You should change the password after the first login both
  for the controller and the Grafana interface.
- `Log retention`: The log retention period in days, default is 180 days.
- `Metrics retention`: The metrics retention period in days, default 15 days.

After completing the configuration, the controller is ready to be used and can be accessed using a web browser at the configured hostname, like ``https://mycontroller.nethsecurity.org``.

Users
=====

The controller has two types of users:

- **Administrator**: The administrator user is the only one that can create and manage users inside the controller.
- **User**: The user can manage the units and the firewall configurations.

The administrator user is created during the controller configuration. 

It is recommended to create a user for each person who needs access to the controller.
When creating a new user, the administrator must specify the username, the user display name, and the user password.
The username is used to log in to the controller, while the display name is used to identify the user in the controller.

The administrator can also reset the user password and delete users.

After logging in, each user can change their own password and generate an SSH key pair for accessing the unit.

Units
=====

All users can manage units. A unit is a firewall that is managed by the controller.

To connect a new unit to the controller, the user must create click on the :guilabel:`Add unit` button from the controller web interface.
When a new unit is added, the controller performs the following actions:

- creates a unique identifier for the unit
- allocates an IP address inside the VPN network
- generates a VPN configuration including certificates
- safely stores credentials required for accessing the remote firewall

A join code will be generated and displayed on the screen. The join code must be entered on the unit to establish the connection with the controller.

Access the ``Controller`` page inside the unit web interface and enter the join code in the ``Join code`` field.
When joining the controller, the unit will download the VPN configuration and establish a secure connection with the controller.
If the connection is successful, the unit will be displayed in the controller web interface with the status ``Connected``.

Please note that if the controller does not have a valid Let's Encrypt certificate, you will need to disable the ``Verify TLS certificate`` option in the unit configuration.

When the unit is connected, the user can directly access the unit web interface by clicking on the :guilabel:`Open unit` link without the need to enter the unit credentials.

.. note:: 

  The unit user interface :ref:`must listen on port 9090 <change_ui_port-section>` to allow the controller to access it.

.. rubric:: Remove a unit

Units can be disconnected from the controller by clicking on the :guilabel:`Remove unit` button from the controller web interface.
When a unit is disconnected, the controller will remove the unit configuration and the VPN connection will be terminated.

After removing the unit from the controller web interface, access the unit web interface and click :guilabel:`Disconnect unit` on the ``Controller`` page:
the unit will destroy the VPN configuration.

Logs management
===============

When a unit is connected, rsyslog is reconfigured to send logs using the syslog protocol (RFC 5424).
It may take a few minutes before rsyslog starts sending the data.
The logs are labeled using the unit's hostname: to ensure that the user interface links work properly, make sure that:

- the unit FQDN is unique within the cluster
- the unit's name is the same as its hostname

Logs can be viewed by clicking on the :guilabel:`Open logs` link for each unit. The logs are displayed in a specific Grafana dashboard that also allows for searching and filtering.

.. note::

  Logs retention period must be configured from the NS8 web interface.


Metrics
=======

Each unit exports its own statistics using netdata in the Prometheus format.
As soon as a unit is connected, Prometheus starts scraping the metrics.

The metrics can be viewed within the Grafana dashboard.
Users can access the dashboard by clicking on the :guilabel:`Open metrics` link for each unit.

Each unit target has the following labels:

- `instance` the VPN IP of the connected machine with the netdata port (eg. `172.19.64.3:19999`)
- `job` fixed to `node`
- `node` the VPN IP of the connected machine
- `unit` the unit unique name of the connected machine

By default, only the admin user can access the metrics dashboard. If you want to allow other users to access the metrics dashboard,
you can create a new role and assign it to the user directly from the Grafana web interface.

.. note::

  Metrics retention period must be configured from the NS8 web interface.

Grafana
-------

Grafana is an open-source platform used for monitoring and visualizing time-series data.
It helps users create customizable dashboards with graphs, charts, and tables to analyze system metrics, logs, and other data from various sources.

The controller includes a pre-configured Grafana instance that is used to visualize metrics and logs from the connected units.
The Grafana instance is accessible from the URL ``https://<controller-fqdn>/grafana``.

By default, you can access it by using default credentials set during the controller configuration.
Remember to change the default password after the first login.
Grafana also provides features for managing users, teams, and permissions.
It supports authentication via various methods including username/password, OAuth, LDAP, and more.

You can also create custom dashboards and alerts to monitor the metrics and logs from the connected units.
See the `official documentation <https://grafana.com/docs/grafana/latest/>`_ for more information on how to use Grafana.

SSH access
==========

SSH, or Secure Shell, is a cryptographic network protocol for operating network services securely over an unsecured network.
SSH provides a secure channel over an unsecured network in a client-server architecture, connecting an SSH client application to an SSH server.

It is possible to connect to the unit by clicking on the :guilabel:`Open SSH terminal` link.
The connection is made through a web-based SSH client that allows access to the unit's shell.

You can connect to units using username and password or an SSH key pair.

Once connected, the SSH session will be started inside a new browser tab. Some browsers require the permission to open popups for the SSH session to work properly.
To close the session, simply close the browser window or logout from the shell using CTRL + D.

Username and password
---------------------

The user can connect using a username and password of the unit in the following scenarios:
- The logged-in user has not generated an SSH key pair
- The public SSH key of the logged-in user hasn't been copied inside the SSH authorized keys file of the unit

The user interface will display a form to enter the username and password.
After entering the credentials, the user can click on the :guilabel:`Open terminal` button to start the SSH session.

SSH key
-------

An SSH key pair is a set of two cryptographic keys that are used for authentication when establishing a secure connection using the SSH (Secure Shell) protocol.
The pair consists of a private key and a public key:

1. **Private Key**: This is kept secret and secure by the user. It should never be exposed to the outside world. It is used to decrypt data that has been encrypted with the public key.

2. **Public Key**: This can be freely shared and is used to encrypt data that can only be decrypted with the private key.

When you connect to a server using SSH with key pair authentication, you provide your public key to the server.
The server then encrypts a challenge message with your public key. Your client then decrypts the message with your private key and sends the result back to the server.
If the result is correct, the server knows that you must have the correct private key and allows you to connect.

This method of authentication is more secure than using a password, as it provides a form of two-factor authentication:
something you have (the private key file) and something you know (the passphrase to unlock the private key).

To use an SSH key, generate a new key pair by accessing the ``Account settings`` page and and clicking on the :guilabel:`Generate SSH key pair` button.
Enter a passphrase to protect the private key and click on the :guilabel:`Generate SSH key` button.
The user interface will display the public key, while the private key is preserved safely inside the controller.

Before connecting to the unit, you must copy the public key and paste it into the unit's SSH authorized keys file.
You can do it from the ``Unit manager`` page, by clicking on the :guilabel:`Actions` button and selecting :guilabel:`Send SSH public key`.
Choose the units you want to send the key to and click on the :guilabel:`Send SSH key` button.

From now on, you can connect to the unit using the SSH key pair.
The user interface will display a form to enter the passphrase when clicking on the :guilabel:`Open terminal` button.

You can also revoke the SSH key pair by clicking on the :guilabel:`Revoke SSH public key` button from the :guilabel:`Actions` button.

Accounting
==========

All operations performed on the controller are logged in the NS8 log. Here are some examples of logged operations:

- User login and logout
- User creation/modification/deletion/password change
- Unit list/creation/removal

Example of NS8 log: ::

  Mar 26 11:08:23 controller.nethserver.net api[64323]: nethsecurity_controller 2024/03/26 11:08:23 middleware.go:85: [INFO][AUTH] authentication success for user admin
  Mar 26 11:08:23 controller.nethserver.net api[64323]: nethsecurity_controller 2024/03/26 11:08:23 middleware.go:186: [INFO][AUTH] login response success for user admin

Each unit has an rpcd user specific to the controller, which is used for management operations.
When a user accesses the unit's web interface from the controller, all operations performed are logged in the unit's log, identified by the rpcd user. For example: ::

  Mar 26 11:28:52 NethSec nethsecurity-api[4535]: nethsecurity_api 2024/03/26 11:28:52 middleware.go:166: [INFO][AUTH] authorization success for user 0a891388811ff8dc0ec2fbed. POST /api/ubus/call {"path":"ns.dashboard","method":"interface-traffic","payload":{"interface":"eth1"}}
  Mar 26 11:28:52 NethSec (none) nginx: 172.19.64.1 - - [26/Mar/2024:11:28:52 +0000] "POST /api/ubus/call HTTP/1.1" 200 1490 "https://controller.gs.nethserver.net/" "Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0"

To determine who performed a specific operation, it is necessary to check the log of the unit identified by the rpcd user and correlate it
with the login action performed on the controller.

When a user connects to the unit via SSH, the login is logged in the unit's log, identified by the SSH user. Usually, the SSH user is root.
For example: ::

  Mar 26 11:55:03 NethSec dropbear[22798]: Password auth succeeded for 'root' from 172.19.64.1:46460

If the user uses an SSH key for authentication, the log will contain the fingerprint of the SSH key used for authentication.
This makes it easier to associate the SSH user with the operations performed. Example: ::

  Mar 26 11:09:33 NethSec dropbear[31090]: Child connection from 172.19.64.1:52012
  Mar 26 11:09:33 NethSec dropbear[31090]: Pubkey auth succeeded for 'root' with ssh-rsa key SHA256:FLecvNRKi0hxxxdjfP0urUZxxx6jxxxxNbZceOPFjyk from 172.19.64.1:52012

Subscription and limitations
============================

.. admonition:: Subscription required

  Some restrictions can only be overcomed if the firewall has a valid subscription.

The behavior of the controller running on a NS8 depends on its subscription status.

Controller without subscription:

- Allows the registration of up to 3 units.
- Only community firewalls can register with the controller.

Controller with a valid subscription:

- The number of units is unlimited.
- Only firewalls with a valid subscription can register with the controller.