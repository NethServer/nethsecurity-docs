.. _controller-section:

==========
Controller
==========

The NethSecurity controller is an application that can run on `NethServer 8 <https://docs.nethserver.org/projects/ns8/en/latest/nethsecurity_controller.html>`_ (NS8).
The controller allows remote control of multiple NethSecurity installations, called units.

The firewall can operate independently without the need for the controller.
The controller is an optional component that provides additional management and monitoring capabilities for the firewall.

The controller creates a secure connection between the central server and the units.
Each firewall registers with the server using a client called ns-plug.
Once registered, the server generates a VPN configuration that is sent back to the firewall.
The VPN enables secure communication between the controller and the unit.

Key features:

- **Centralized Management**: Manage multiple firewalls from a single server.
- **Secure Communication**: Establish a secure `OpenVPN <https://openvpn.net/>`_ connection between the server and the firewalls.
- **Easy Configuration**: Configure firewalls directly from the controller's user interface.
- **Monitoring and Logging**: Collect and analyze logs from the firewalls inside `Loki <https://grafana.com/oss/loki/>`_ for troubleshooting and monitoring purposes.
- **Metrics Visualization**: Visualize metrics from the firewalls using the built-in `Grafana <https://grafana.com/>`_ dashboard.
  Metrics are collected using `Prometheus <https://prometheus.io/>`_ and `TimescaleDB <https://www.timescale.com/>`_.
- **Web-based SSH**: Access the firewall command-line interface using a web-based SSH client.

Installation and configuration
===============================

The controller can be installed on a NethServer 8 system from the Software Center. The module is named `NethSecurity Controller`.

After the installation, the controller must be configured. The configuration can be done using the NethServer 8 web interface.
The following parameters need to be set:

- `Controller hostname`: The fully qualified domain name for the controller, like: ``mycontroller.nethsecurity.org``. 
  Ensure the hostname is resolvable and reachable from the units.
- `Let's Encrypt certificate`: Enable or disable Let's Encrypt certificate for the controller web interface. It's recommended to enable it.
- `VPN network` and `VPN netmask`: The OpenVPN network and netmask. When choosing the network, make sure it does not overlap with the existing networks inside all
  the units that will be connected to the controller. Use only class C networks like ``192.168.7.0`` with netmask ``255.255.255.0``.
- `Administrator user`: The controller administrator user name. The administrator user is the only user that can create
  and manage other users inside the controller. The same user name is used to access the Grafana interface.
- `Administrator password`: Choose a strong password for the administrator user.
  Note that the default password is displayed only once, please store it in a safe place. The same password is used to access the Grafana interface.
  For security reasons, you should change the password after the first login both for the controller and the Grafana interface.

The following parameters are optional:

- `Controller name`: The name of the controller, used to create the VPN certification authority. You can leave it unchanged unless you have a specific requirement.
- `Log retention`: The log retention period in days, default is 180 days. It applies to the logs stored in Loki.
- `Metrics retention`: The metrics retention period in days, default 15 days. It applies to the metrics stored in Prometheus and Timescale.
- `MaxMind license key`: The controller can geolocate the IP addresses of the connected VPN clients and attackers. A map with the location of the clients and attackers 
  will be displayed inside Grafana. The license key is required to enable the feature and download the MaxMind GeoIP2 database. 
  To obtain a free license key, signup on the  `MaxMind website <https://www.maxmind.com/en/geolite2/signup>`_, then access the `Manage License Keys` page inside the account section.
  Generate a new license, copy the license key and paste it in the field.

After completing the configuration, the controller is ready to be used and can be accessed using a web browser at the configured hostname, like ``https://mycontroller.nethsecurity.org``.

.. note::
   The controller must be reachable on :

   * ``Port TCP/443 (HTTPS)`` to access WebUI and allow units communication.
   * ``Randomly generated UDP port`` dynamically allocated by NethServer 8, used for units VPN connection.
   
   The actual ``UDP port`` number can be found in the Controller module status page under the ``OpenVPN UDP Port`` section. Make sure those ports are open on any firewall protecting the node running the controller.

Users
=====

The controller has two types of users:

- **Administrator**: The administrator user is the only one who can create and manage users inside the controller.
- **User**: The user can manage the units and the firewall configurations.

The administrator is created during the controller configuration. 

It is recommended to create a user for each person who needs access to the controller.
When creating a new user, the administrator must specify the username, the user display name, and the user password.
The username is used to log in to the controller, while the display name is used to identify the user in the controller.

The administrator can also reset the user password and delete users.

After logging in, each user can change their password and generate an SSH key pair for accessing the unit.

Two Factor Authentication (2FA)
-------------------------------

Each controller user can enable Two Factor Authentication (2FA) to increase the security of the account.
To enable 2FA, follow the same steps documented inside the firewall web interface: :ref:`2fa-section`.

The administrator can see the 2FA status of each user inside the user list.

Units
=====

All users can manage units. A unit is a firewall that is managed by the controller.

To connect a new unit to the controller, the user must click on the :guilabel:`Add unit` button from the controller web interface.
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

When the unit is connected, the user can access the unit web interface by clicking on the :guilabel:`Open unit` link without needing to enter the unit credentials.

.. note:: 

  The unit user interface :ref:`must listen on port 9090 <change_ui_port-section>` to allow the controller to access it.

.. rubric:: Remove a unit

Units can be disconnected from the controller by clicking on the :guilabel:`Remove unit` button from the controller web interface.
When a unit is disconnected, the controller will remove the unit configuration and the VPN connection will be terminated.

After removing the unit from the controller web interface, access the unit web interface and click :guilabel:`Disconnect unit` on the ``Controller`` page:
the unit will destroy the VPN configuration.

.. _controller_logs-section:

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

.. _controller_metrics-section:

Metrics
=======

Each unit exports two types of metrics:

- system operating metrics (CPU, memory, disk, network): these metrics are collected using `Netdata <https://www.netdata.cloud/>`_
  and stored in `Prometheus <https://prometheus.io/>`_. As soon as a unit is connected, the controller starts scraping the metrics.
  These metrics are available to everyone regardless of the subscription status.
- firewall metrics (traffic, security, VPN): these metrics are sent from the unit to controller at fixed intervals.
  The controller stores them inside a `Timescale <https://www.timescale.com/>`_ database.
  These metrics are available only to users with a valid subscription.

All data collected and stored inside the controller is timestamped using Coordinated Universal Time (UTC).
This ensures consistency and accuracy across different time zones, making it easier to correlate events and analyze trends.

Users have the flexibility to view data in their local time zone by adjusting the time settings in Grafana.
To change the local time zone, navigate to the Grafana preferences menu and select the desired time zone.
This adjustment can be applied to each dashboard individually, allowing users to customize the time zone display based on their preferences.

The metrics can be viewed within the Grafana dashboard.
Users can access the dashboard by clicking on the :guilabel:`Open metrics` link for each unit.

By default, only the admin user can access the metrics dashboard. If you want to allow other users to access the metrics dashboard,
you can create a new role and assign it to the user directly from the Grafana web interface.

.. _grafana-section:

Grafana
-------

Grafana is an open-source platform used for monitoring and visualizing time-series data.
It helps users create customizable dashboards with graphs, charts, and tables to analyze system metrics, logs, and other data from various sources.

The controller includes a pre-configured Grafana instance that is used to visualize metrics and logs from the connected units.
The Grafana instance is accessible from the URL ``https://<controller-fqdn>/grafana``.

By default, you can access it by using the default credentials set during the controller configuration.
Remember to change the default password after the first login.
Grafana also provides features for managing users, teams, and permissions.
It supports authentication via various methods including username/password, OAuth, LDAP, and more.

You can also create custom dashboards and alerts to monitor the metrics and logs from the connected units.
See the `official documentation <https://grafana.com/docs/grafana/latest/>`_ for more information on how to use Grafana.

Prometheus metrics
^^^^^^^^^^^^^^^^^^

Prometheus metrics are collected using Netdata and stored in a Prometheus database.

Metrics exported for each unit includes the following labels:

- ``instance`` the VPN IP of the connected machine with the Netdata port (eg. ``172.19.64.3:19999``)
- ``job`` fixed to `node`
- ``node`` the VPN IP of the connected machine
- ``unit`` the unit unique name of the connected machine

Such metrics are visible inside the ``Operating system`` dashboard.

Timescale metrics
^^^^^^^^^^^^^^^^^

.. admonition:: Subscription required

   This feature is available only if the firewall and the controller have a valid subscription.

The Timescale database stores the same metrics of the :ref:`real_time_monitoring-section` but as a timeseries saved in a PostgreSQL database.
Each unit sends data to the controller every 15 minutes. The controller aggregates the data every 15 minutes, this means that data are
available inside dashboards at best with a 15 minutes delay and at worst with a 30 minutes delay.

The controller can do extra processing on the data to provide more insights. For example, the controller can geolocate the IP addresses
of the connected clients and of the attackers.

These metrics are visible inside the following dashboards:

- ``Network traffic``: aggregated network traffic as seen by the unit
- ``Network traffic by client``: network traffic for each client (local host) connected to the unit
- ``Network traffic by host``: network traffic for each remote host
- ``Security``: security events detected by the unit
- ``VPN``: VPN statistics for OpenVPN Road Warrior, OpenVPN tunnels and IPsec tunnels

.. note::

  Metrics retention period must be configured from the NS8 web interface and is applied to both to Prometheus and Timescale databases.




.. _controller_updating-section:

Unit updates
============

The controller allows you to update the units directly from the interface, similar to the process in :ref:`the unit web interface<updates-section>`. Two types of updates are available:

- **Package updates**: Update the packages installed on the unit. List and install available updates by clicking on :guilabel:`Check packages updates` in the unit menu.
  A modal will display the list of available updates. If updates are available, apply them by clicking on the :guilabel:`Update` button in the modal. This is the first thing to try if
  :ref:`version awareness<version-awareness-section>` blocks you from accessing the unit.
- **System update**: Update the unit's system. If an image update is available, a badge will appear in the unit list.
  Schedule an update by clicking on the :guilabel:`System update` button in the unit menu. You can schedule the update or update the unit immediately.
  This operation is also available as a mass operation for multiple units under :guilabel:`Actions` -> :guilabel:`Update systems`.
  Units with a scheduled image update will have a dedicated badge in the unit list. You can abort the scheduled update by clicking on the :guilabel:`Cancel scheduled image update` button in the unit menu.

.. note::

  Please be aware that units might not send updated information when undergoing upgrading process prior to unit version 1.3.0. To refresh manually the information use the `guilabel`:`Sync unit info` button in the unit menu.

.. _controller_ssh-section:

SSH access
==========

SSH, or Secure Shell, is a cryptographic network protocol for operating network services securely over an unsecured network.
SSH provides a secure channel over an unsecured network in a client-server architecture, connecting an SSH client application to an SSH server.

It is possible to connect to the unit by clicking on the :guilabel:`Open SSH terminal` link.
The connection is made through a web-based SSH client that allows access to the unit's shell.

You can connect to units using a username and password pair or an SSH key.

Once connected, the SSH session will be started inside a new browser tab. Some browsers require permission to open popups for the SSH session to work properly.
To close the session, simply close the browser window or log out from the shell using CTRL + D.

Username and password
---------------------

The user can connect using a username and password pair of the unit in the following scenarios:

- The logged-in user has not generated an SSH key
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

  Some restrictions can only be overcame if the firewall has a valid subscription.

The behavior of the controller running on a NS8 depends on its subscription status.

Controller without subscription:

- Allows the registration of up to 3 units.
- Only community firewalls can register with the controller.
- Historical metrics are not accesible.

Controller with a valid subscription:

- The number of units is unlimited.
- Only firewalls with a valid subscription can register with the controller.
- Units with a valid subscription send metrics to the controller.

.. _version-awareness-section:

Version awareness
=================

Version awareness is a mechanism that prevents the user from performing operations not supported by the unit version. To do so, when connecting to the UI
of a unit the controller will check the API version during the connection process. There are three possible scenarios:

a. If the versions are compatible, the connection proceeds as normal.
b. If the firewall (unit) is significantly older than the controller, you'll see a popup that prevents the connection. This is to protect against potential errors.
c. If the controller is slightly older than the firewall, you'll see a warning about the mismatch. However, you'll still be able to connect if you choose to proceed.

As an administrator, you don't need to take any specific actions to enable Version awareness. It works automatically in the background. However, you should:

1. Pay attention to warnings: if you see a version mismatch warning, consider updating your system when convenient.
2. Keep your system updated: regularly check for and apply updates to both your controller and firewall units to ensure the best compatibility and access to new features.
3. Report issues: if you encounter any unusual behavior or errors, especially after seeing a version warning, follow the :ref:`troubleshooting <troubleshooting-section>` procedure.

Version awareness is a behind-the-scenes feature that helps keep your NethSecurity system running smoothly. By automatically checking compatibility between the controller
and units, it prevents many potential issues before they can affect your network. While it doesn't require any action from you, being aware of this feature can help you better understand and manage your system.

.. rubric:: Bypass version awareness

While version awareness is a useful feature, knowing the risks and potential issues, you may want to bypass it in some cases.
To do so, the procedure is as follows:

1. On the controller, go to the unit manager page and click on :guilabel:`More Info` of the unit you want to connect to.
2. Copy the `Unit ID` value.
3. Click on :guilabel:`Open SSH terminal`
4. When the modal opens, you can safely close it. This was only needed to exchange some credentials with the unit.
5. Open a new tab, and go to this URL: `https://<controller-fqdn>/#/controller/manage/<unit-id>/dashboard`. Example: `https://controller.nethsecurity.org/#/controller/manage/000000000-0000-0000-0000-000000000000/dashboard`.
6. You will be able to access the unit's UI without the version check.

.. rubric:: Update unit with SSH

You can update the unit without connecting to it using the SSH terminal.
Follow the steps to connect to the unit using :ref:`SSH Access <controller_ssh-section>`.

Once connected, you can check for updates depending on what you want to update.

a. Install package updates on the unit:

   1. To check for updates for packages use the following command:
 
      .. code-block:: bash
 
        /usr/libexec/rpcd/ns.update call check-package-updates
   
   2. If you're ok with the installation of the packages you can run the following command:
 
      .. code-block:: bash
 
        /usr/libexec/rpcd/ns.update call install-package-updates

b. To update the image, you can simply schedule the installation, remember this is an operation that restarts the firewall (causing a downtime)

   1. Check if there is an updated image available:
 
      .. code-block:: bash
 
        /usr/libexec/rpcd/ns.update call check-system-update

   2. If you want to proceed with the update, this can be done through this command:

      .. code-block:: bash

        /usr/libexec/rpcd/ns.update call update-system
