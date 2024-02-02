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

Such credentials can be used to login into the web interface or using SSH.

.. note::

  The default password for the root user is ``Nethesis,1234``. It is recommended to change the password immediately after logging in for the first time.

Web user interface
==================

NethSecurity has two different web user interfaces:

* NethSecurity UI (``ns-ui``): A custom user interface focused on usage simplicity.
* LuCI: The original OpenWrt web interface. Please bear in mind that some pages may cause unpredictable configuration changes.

Both user interfaces listen on port 443 (HTTPS):

* NethSecurity is accessible at ``https://server_ip``
* LuCI is accessible at ``https://server_ip/cgi-bin/luci``

Change web user interface port
------------------------------

Web user interfaces commonly operate on port 443, a convention established for its ease of accessibility through modern web browsers.
However, specific scenarios necessitate the redirection of port 443 to an internal web server.

Users have the capability to selectively disable or enable both default interfaces: the ns-ui and LuCI. Moreover, NethSecurity allows the
addition of extra ``ns-ui`` instances on different ports, granting users the freedom to customize their network configurations according to their needs.

To disable both UIs on port 443, and enable enable ``ns-ui`` only port 9090, execute: ::

  uci set ns-ui.config.nsui_extra_enable=1
  uci set ns-ui.config.nsui_extra_port=9090
  uci set ns-ui.config.nsui_enable=0
  uci set ns-ui.config.luci_enable=0
  uci commit ns-ui
  ns-ui

For more info, see the `ns-ui page <https://dev.nethsecurity.org/packages/ns-ui/>`_ inside the the developer manual.

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
