==============
Remote access
==============

.. highlight:: bash

.. _default_credentials-section:

Default credentials
===================

Default credentials are:

* User: ``root``
* Password: ``Nethesis,1234``

Such credentials can be used to log in to the web interface or using SSH:

- Web user interface: **https://<server_ip>:9090**
- SSH default port: **22**


NethSecurity's default hostname is: ``NethSec``

If your client has received an IP address from NethSecurity's DHCP, it will use NethSecurity as both gateway and DNS server. 
Under these conditions you can contact NethSecurity using its hostame **nethsec** instead of the **server_ip** e.g.

https://nethsec:9090

This hostname can be modified in the System Settings section.

.. note::

  The default password for the root user is ``Nethesis,1234``. It is recommended to change the password immediately after logging in for the first time.

Reset root password
-------------------

The ``root password`` can be reset by entering in :ref:`Failsafe mode <failsafe-section>`.
Once in this mode, you can change the password by executing the following commands. ::

  mount_root
  passwd

Restart the firewall with the command ::

  reboot

.. _web_user_interface-section:

Web user interface
==================

NethSecurity UI (User Interface), the NethSecurity official web interface, is available on port ``9090`` at the following URL: **https://<server_ip>:9090**.

To ease the access, NethSecurity UI is also available on standard HTTP port ``443`` at the following URL: **https://<server_ip>** or **http://<server_fqdn>**.

Both URLs are accessible from LAN and WAN by default.

Restricting access to NethSecurity UI
-------------------------------------

By default, this interface is accessible on port 9090 from both your internal network (LAN) and the wider internet (WAN).
While convenient, this can potentially introduce a security risk.

To mitigate this risk, you have two options (remove or restrict access):

- remove the ``Allow-UI-from-WAN`` rule: go to the Firewall rules page, navigate to the ``Input rules`` tab,
  and locate the "Allow-UI-from-WAN" rule. Click the :guilabel:`Delete` button to remove it
- restrict access from specific IPs or networks: in the Firewall rules page, locate the "Allow-UI-from-WAN"
  rule and click the :guilabel:`Edit` button. In the ``Source address`` field, enter the IP addresses or network CIDRs
  from which you want to allow access to the NethSecurity UI.

  For example, to allow access only from your home network, you could enter the 192.168.1.0/24 network.
  Only allow access from trusted IP addresses or networks. Leaving this field blank will allow anyone on the internet to access the NethSecurity UI.

Additional security measures:

- use a strong password for the admin user
- enable :ref:`two-factor authentication (2FA) <2fa-section>` for the admin user
- keep your firewall up to date with the latest security patches

.. _change_ui_port-section:

Change web user interface port
------------------------------

Users can change the NethSecurity UI port.

To change the NethSecurity UI port from 9090 to 8181, execute: ::

  uci set ns-ui.config.nsui_extra_port=8181
  uci commit ns-ui && ns-ui

.. warning::

  The controller uses port 9090 to communicate with the unit. Changing the port will prevent the controller from managing the NethSecurity.

Disable web user interface on port 443
--------------------------------------

While exposing port 443 (HTTPS) can be necessary for certain services, directly accessing the NethSecurity UI through this port
may introduce a potential security risk. Here's how to safely maintain port 443 functionality while protecting your NethSecurity UI.

If you don't require accessing the NethSecurity UI through port 443, disable it to minimize attack opportunities.
Execute the following commands on your NethServer system: ::

  uci set ns-ui.config.nsui_enable=0
  uci commit ns-ui && ns-ui

This option disables access to the NethSecurity UI through both the server IP address and FQDN on port 443.

If you need port 443 for other services, configure your firewall to redirect traffic destined for port 443 to a separate web server hosting those services.
Ensure this separate server has strong security measures in place.

.. _privacy_policy-section:

Privacy policy
--------------

In some cases, it is necessary to display the privacy policy of a product before login.
NethSecurity does not display any privacy policy by default, but it is possible to add a link to an external website that contains the privacy policy.

To add a link to the privacy policy, access the command line and execute: ::

  URL=https://mysite.org/privacy_policy; sed -i "s|PRIVACY_POLICY_URL\: ''|PRIVACY_POLICY_URL: '$URL'|" /www-ns/branding.js

Substitute ``https://mysite.org/privacy_policy`` with the URL of your privacy policy.

The link to the privacy policy will be displayed inside the login page after next page refresh.

.. _luci-section:

Legacy web user interface
-------------------------

.. warning::

  Changes done via LuCI web interface may break the official NethSecurity UI.
  Use at your own risk!


NethSecurity offers also LuCI, the original OpenWrt web interface, which provides a wide range of configuration options but is not officially supported.
Luci is disabled by default. To enable it, execute: ::

  uci set ns-ui.config.luci_enable=1
  uci commit ns-ui
  ns-ui

Once enabled, Luci will be available only on port 443 at this URL: **https://<server_ip>/cgi-bin/luci**

Changes to the following LuCI pages are known to cause unpredictable behavior:

- HTTP access tab: it configures uhttpd which is not present inside NethSecurity
- Logging tab: it configures logd which is not present inside NethSecurity
- Networking: configuration created with this page is not compatible with NethSecurity UI

.. _2fa-section:

NethSecurity UI 2FA
===================

Protecting your NethSecurity administrator account is crucial, and Two-Factor Authentication (2FA) adds an extra layer of security beyond just a password.
2FA requires two verification steps when logging in. Instead of just a password, you'll also need a temporary code generated by a separate app on
your smartphone or tablet. This significantly reduces the risk of unauthorized access even if your password is compromised.

Enabling 2FA on NethSecurity UI:

- Log in to your NethSecurity web interface
- Click on the user icon in the top right corner and select ``Account settings``
- Find the Two-factor authentication option and click :guilabel:`Configure 2FA`

Setting up your authenticator app:

- Download an authenticator app on your smartphone or tablet. Popular options include FreeOTP, Google Authenticator, and Microsoft Authenticator.
- Open the app and scan the QR code displayed on the NethSecurity web interface. This will add your NethSecurity account to the authenticator app.
- Enter the 6-digit code displayed by your authenticator app in the One-Time Password (OTP) field on the NethSecurity web interface.

The system will also provide you with a set of backup codes. These codes can be used to log in if you lose your smartphone or authenticator app.
Store these codes securely, preferably offline.

You can disable 2FA from the same page.

.. _admin_users-section:

NethSecurity UI administrators
==============================

The default user for accessing the user web interface is root, but it is possible to create other administrator users with access only to the web interface.

To create a user in the local database, enter the `Username` and `Display name`.
Ensure to set a password for the user; this is mandatory for administrator users.
If the user needs administrative access to the web interface, enable the `Administrator user` option.

It is possible to grant or remove administrative access only to users residing in the local database.

Auditing user actions
---------------------

Every time an administrator logs in to the NethSecurity UI, the system logs the event, inside the `/var/log/messages` file.
Example of login event for user `goofy`: ::

  Jun 21 09:43:19 NethSec nethsecurity-api[5376]: nethsecurity_api 2024/06/21 09:43:19 middleware.go:78: [INFO][AUTH] authentication success for user goofy
  Jun 21 09:43:19 NethSec nethsecurity-api[5376]: nethsecurity_api 2024/06/21 09:43:19 middleware.go:186: [INFO][AUTH] login response success for user o

Example of logout event for user `goofy`: ::

  Jun 21 09:46:13 NethSec nethsecurity-api[5376]: nethsecurity_api 2024/06/21 09:46:13 middleware.go:214: [INFO][AUTH] logout response success for user goofy


Also every action performed by an administrator inside the NethSecurity UI is logged inside the `/var/log/messages` file.
Example of action performed by user `goofy`: ::

  Jun 21 09:43:19 NethSec nethsecurity-api[5376]: nethsecurity_api 2024/06/21 09:43:19 middleware.go:170: [INFO][AUTH] authorization success for user goofy. POST /api/ubus/call {"path":"ns.dashboard","method":"service-status","payload":{"service":"internet"}}

SSH
===

By default, the system accepts SSH connections on the standard port 22. Access with the root user and the default password.

From a Linux machine, use the following command: ::

   ssh root@192.168.1.1

VGA console and keyboard layout
===============================

If the machine has a VGA/DVI/HDMI video port, connect a monitor to it. Then, you will be able to log in to the console using the default credentials above.

Please note that the system is configured with the US keyboard layout.

To temporarily change the current keyboard layout to Italian, log in to the system and then execute the following command: ::

  loadkmap < /usr/share/keymaps/it.map.bin

The keyboard layout configuration can be saved by writing the keymap code inside ``/etc/keymap``. Example for ``it`` (Italian) keymap: ::

  echo 'it' > /etc/keymap
  grep -q /etc/keymap /etc/sysupgrade.conf || echo /etc/keymap >> /etc/sysupgrade.conf

To obtain the list of available keymaps, execute the following command: ::

  ls -1 /usr/share/keymaps/ | cut -d'.' -f1

Serial console 
==============

If the machine has a serial port (RS-232, tipically available with DE-9 connector or RJ45/8P8C connector) it's possible to access the firewall directly through it using a null-modem cable and a terminal program.
``PuTTY`` (version 0.60 or higher) is a common choice if you are using Microsoft Windows, while Linux distros offer tools as ``minicom``, ``picocom``, or ``screen``. 

Default acces parameters for NethSecurity 8 are:

- Baud rate: 115200,
- Data bits:8
- Parity :None
- Stop bits to 1 

These last three parameters are often abbreviated as 8N1

USB-to-Serial Adapters
----------------------

In case of need, NethSecurity can be used to access another server via the serial console. If the hardware does not have an RS-232 port, USB-to-serial adapters can be used. 
For this reason, it is possible to download and install drivers for the most common adapters on NethSecurity. These drivers are provided as-is and are **not supported by Nethesis** (if using an Enterprise or Subscription version).

.. warning::

 Extra packages, including kernel modules, are not preserved across image upgrades, so in the event of an upgrade, you will need to download and install them again if needed.

Two packages are provided for installation, covering the vast majority of adapters available on the market.
::

  kmod-usb-serial-cp210x - 5.15.162-1 - Kernel support for Silicon Labs cp210x USB-to-Serial converters
  kmod-usb-serial-pl2303 - 5.15.162-1 - Kernel support for Prolific PL2303 USB-to-Serial converters

* To install Prolific PL2303 driver:

  ::

    opkg install kmod-usb-serial-pl2303

* The logs will show an output similar to this:

  ::

    Aug  6 08:08:17 nsec8 kernel: [ 2346.359247] usb 1-6: new full-speed USB device number 3 using xhci_hcd
    Aug  6 08:08:17 nsec8 kernel: [ 2346.543052] pl2303 1-6:1.0: pl2303 converter detected
    Aug  6 08:08:17 nsec8 kernel: [ 2346.550401] usb 1-6: pl2303 converter now attached to ttyUSB0
