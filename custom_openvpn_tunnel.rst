.. _custom_openvpn_tunnel-section:

========================================================
OpenVPN tunnel client with a provided configuration file
========================================================


This guide explains how to configure an OpenVPN client on NethSecurity using a configuration file (``myvpn.ovpn``) provided by a VPN service provider. 
The configuration ensures the VPN starts automatically when the firewall boots.

Prerequisites
-------------

- A valid OpenVPN configuration file (`myvpn.ovpn`) from your VPN provider.
- Access to the NethSecurity terminal via SSH.
- Basic familiarity with the UCI (Unified Configuration Interface) system in OpenWrt/NethSecurity.

Steps to Configure the VPN
--------------------------

1. Place the Configuration File in the Correct Directory
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. Copy the ``myvpn.ovpn`` file to the directory ``/etc/openvpn/``. Use SCP or a similar tool to transfer the file ::

    scp myvpn.ovpn root@<NethSecurity_IP>:/etc/openvpn/


2. Verify the permissions for the file, the output should look like this ::

    ls -l /etc/openvpn/myvpn.ovpn
    -rw-r--r--    1 root     root        <size> myvpn.ovpn

If it is not so then set the correct permissions ::

    chmod 644 /etc/openvpn/myvpn.ovpn
    chown root:root /etc/openvpn/myvpn.ovpn

3. Create a New OpenVPN Client Configuration in UCI
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. Add a new OpenVPN section in the UCI database called *myvpn*, link the configuration file to this section and enable the VPN ::

    uci add openvpn openvpn
    uci rename openvpn.@openvpn[-1]='myvpn'
    uci set openvpn.myvpn.enabled='1'
    uci set openvpn.myvpn.config='/etc/openvpn/myvpn.ovpn'

2. Commit the changes to save the configuration ::

    uci commit openvpn
   
4. Start the VPN Client Immediately
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
To start the VPN client without rebooting the system, run ::

    /etc/init.d/openvpn restart

This will restart all configured openvpn tunnels.

5. Verify the VPN is Running
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Check the OpenVPN logs to confirm the connection: ::

    tail -f /var/log/messages | grep openvpn

You should see log entries indicating a successful connection.

.. note:: 

  - **File Name Consistency:** The configuration name ``myvpn`` must match the OpenVPN section name in UCI and the configuration file's location. If you change the name, ensure all references to ``myvpn`` in commands and filenames are updated.
  - **Automatic Startup:** By setting ``enabled='1'``, the VPN client will automatically start whenever the firewall boots.


Optional (1): Disable Automatic Startup
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you want to prevent the VPN from starting automatically when the firewall boots, you can disable it using the following commands: ::

1. Disable the VPN in UCI: ::

    uci set openvpn.myvpn.enabled='0'
    uci commit openvpn

2. Restart the running VPN tunnels (cause it's disabled now, it will stop, while other tunnels will do a full restart): ::

    /etc/init.d/openvpn stop


Optional (2): Configure Authentication Credentials
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If the VPN requires a username and password, create an authentication file.


1. Create a file named ``/etc/openvpn/myvpn.auth`` (replace ``myvpn`` with the VPN name if different): ::

    vi /etc/openvpn/myvpn.auth

2. Add the following content, replacing ``frank`` and ``frank_password`` with your username and password: ::
                                    
    user frank
    password frank_password

3. Save and set the correct permissions: ::

    chmod 600 /etc/openvpn/myvpn.auth
    chown root:root /etc/openvpn/myvpn.auth
                                    
4. Update the OpenVPN configuration file (``myvpn.ovpn``) to reference the authentication file. Open the file for editing: ::
   
    vi /etc/openvpn/myvpn.ovpn

5. Add or modify the following line: ::
                                    
    auth-user-pass /etc/openvpn/myvpn.auth
                                    
.. note:: 
                                    
  - **Authentication File:** When using an authentication file, ensure it has strict permissions (`600`) to protect sensitive information.
