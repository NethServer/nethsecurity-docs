.. _custom_openvpn_tunnel-section:

=====================
Custom OpenVPN tunnel
=====================

This guide explains how to configure an OpenVPN client on NethSecurity using a configuration file (``myvpn.ovpn``) provided by a VPN service provider. 
The configuration ensures the VPN starts automatically when the firewall boots.

Prerequisites
-------------

- A valid OpenVPN configuration file (`myvpn.ovpn`) from your VPN provider.
- Access to the NethSecurity terminal via SSH.
- Basic familiarity with the UCI (Unified Configuration Interface) system in OpenWrt/NethSecurity.

Additional notes on CLI configuration
-------------------------------------

- This procedure does not include any validation of the entered data. Therefore, it is intended to be performed by advanced users familiar with the NethSecurity environment and OpenVPN configurations.
- The VPN created using this method will not appear in the NethSecurity web interface and can only be managed through the command line interface (CLI).
- It is critical to avoid using the same name for a VPN created via the CLI and one configured through the NethSecurity web interface. Since there are no safeguards in place to prevent naming conflicts, such overlap may cause configuration issues.

For these reasons, caution and attention to detail are strongly advised when performing this procedure.

Configure the VPN
-----------------

1. Place the configuration file in the correct Directory
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. Copy the ``myvpn.ovpn`` file to the directory ``/etc/openvpn/``. Use SCP or a similar tool to transfer the file: ::

    scp myvpn.ovpn root@<NethSecurity_IP>:/etc/openvpn/


2. Make sure to set the correct file permissions: ::

    chmod 644 /etc/openvpn/myvpn.ovpn
    chown root:root /etc/openvpn/myvpn.ovpn

3. Create a new OpenVPN Client configuration in UCI
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. Add a new OpenVPN section in the UCI database called ``myvpn``, link the configuration file to this section and enable the VPN ::

    uci add openvpn openvpn
    uci rename openvpn.@openvpn[-1]='myvpn'
    uci set openvpn.myvpn.enabled='1'
    uci set openvpn.myvpn.config='/etc/openvpn/myvpn.ovpn'

2. Commit the changes to save the configuration: ::

    uci commit openvpn
   
4. Start the VPN client immediately
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
To start the VPN client without rebooting the system, run: ::

    /etc/init.d/openvpn restart

This will restart all configured OpenVPN tunnels.

5. Verify the VPN is running
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
1. To ensure OpenVPN is using the correct configuration file and is running as expected, check the active processes: ::

    ps xa | grep openvpn

The output should resemble the following (example configuration name ``myvpn``): ::

    4913 ?        S      0:00 /usr/sbin/openvpn --syslog openvpn(myvpn) --status /var/run/openvpn.myvpn.status --cd /etc/openvpn --config myvpn.ovpn --up /usr/libexec/openvpn-hotplug up myvpn --down /usr/libexec/openvpn-hotplug down myvpn --route-up /usr/libexec/openvpn-hotplug route-up myvpn --route-pre-down /usr/libexec/openvpn-hotplug route-pre-down myvpn --script-security 2

Confirm the ``--config`` parameter points to the correct configuration file (e.g., ``myvpn.ovpn``).
Ensure all references (e.g., ``myvpn``) match your intended VPN configuration.

2. Check the OpenVPN logs to confirm the connection: ::

    tail -f /var/log/messages | grep openvpn

You should see log entries indicating a successful connection.


.. note:: 

  - **File Name Consistency:** The configuration name ``myvpn`` must match the OpenVPN section name in UCI and the configuration file's location. If you change the name, ensure all references to ``myvpn`` in commands and filenames are updated.
  - **Automatic Startup:** By setting ``enabled='1'``, the VPN client will automatically start whenever the firewall boots.


Optional: Disable Automatic Startup
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you want to prevent the VPN from starting automatically when the firewall boots, you can disable it using the following commands: ::

1. Disable the VPN in UCI: ::

    uci set openvpn.myvpn.enabled='0'
    uci commit openvpn

2. Restart the running VPN tunnels (cause it's disabled now, it will stop, while other tunnels will do a full restart): ::

    /etc/init.d/openvpn restart


Configure authentication credentials (optional)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If the VPN requires a username and password, create an authentication file.


1. Create a file named ``/etc/openvpn/myvpn.auth`` (replace ``myvpn`` with the VPN name if different): ::

    vi /etc/openvpn/myvpn.auth

2. Add the following content, replacing ``frank`` and ``frank_password`` with your username and password: ::
                                    
    frank
    frank_password

3. Save and set the correct permissions: ::

    chmod 600 /etc/openvpn/myvpn.auth
    chown root:root /etc/openvpn/myvpn.auth
                                    
4. Update the OpenVPN configuration file (``myvpn.ovpn``) to reference the authentication file. ::
   
    echo "auth-user-pass /etc/openvpn/myvpn.auth" >>  /etc/openvpn/myvpn.ovpn

                                    
.. note:: 
                                    
  - **Authentication File:** When using an authentication file, ensure it has strict permissions (`600`) to protect sensitive information.




Configure the firewall to allow traffic for the VPN
-----------------------------------------------------

To enable traffic through the VPN, it is necessary to configure the firewall on NethSecurity. 
The best practice is to assign a fixed device name to the VPN, create a dedicated zone for the custom VPN, and associate the VPN device with that zone.


1. Fix the VPN device name
^^^^^^^^^^^^^^^^^^^^^^^^^^
To ensure the VPN device name remains consistent and avoids automatic assignment, it is crucial to fix the name in the OpenVPN configuration file. 
Edit the file (``/etc/openvpn/myvpn.ovpn``) and include the following lines or modify them if they already exist (this example is made with a *routed* vpn): ::

    -dev tun
    +dev tunmyvpn
    +dev-type tun


2. Create a firewall zone
^^^^^^^^^^^^^^^^^^^^^^^^^
From the NethSecurity UI, create a new firewall zone named ``myzone``. Configure this zone to allow access to the required resources. 


3. Associate the VPN device with the zone
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
To associate the VPN device with the ``myzone`` firewall zone, perform the following steps in the command line:

1. Add the VPN device (``tunmyvpn``) to the firewall zone: ::

    uci add_list firewall.ns_myzone.device=tunmyvpn
    uci commit firewall

2. Restart the firewall to apply the changes: ::
   
    /etc/init.d/firewall restart


These changes ensure the VPN device will always be named ``tunmyvpn``, preventing potential issues with the firewall zone association.



