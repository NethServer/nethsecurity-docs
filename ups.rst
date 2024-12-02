=========
UPS (NUT)
=========

An Uninterruptible Power Supply (UPS) is a device that provides backup power when the main power source fails.
It is used to protect hardware such as computers, telecommunication equipment, or other electrical equipment where an unexpected power outage could cause
business disruption or data loss.

The `Network UPS Tools (NUT)  <https://networkupstools.org/>`_ is a collection of programs that provide a common interface for monitoring and administering UPS hardware.

This guide explains how to configure a USB-connected UPS with NUT on NethSecurity.
At the end of the guide, the UPS should be monitored and the system should shut down when the battery is low.

NUT is not installed by default. It is part of NethSecurity extra packages and can be installed from the command line.
The NUT suite is composed of several packages, but the most important are:

- ``nut-server``: The NUT server daemon connects directly to the UPS, serving data to the client.
- ``nut-upsc``: A command-line tool to query the UPS status.
- ``nut-upsmon``: The NUT UPS monitor daemon talks to nut-server and initiates a system shutdown when the UPS battery is low.
- ``nut-upscmd``: A command-line tool to send commands to the UPS (supported only by some UPS models).

Configure a local UPS
=====================

Before configuring the UPS, make sure the UPS is connected to the firewall (a cable usually comes with the UPS).
Then, follow these steps:

1. Install NUT packages.
2. Find the UPS model, then install and configure the appropriate driver.
3. Configure the UPS server daemons.
4. Enable the UPS monitor.

Step 1: install the required packages
--------------------------------------

Install the required packages::

    opkg update
    opkg install nut-server nut-upsc nut-upsmon nut-upscmd

These packages are not preserved during a system upgrade. For more info see :ref:`restore_extra_packages-section`.

Step 2: setup the appropriate driver
------------------------------------

1. Use ``lsusb`` to list USB devices::

    Bus 002 Device 002: ID 0463:ffff EATON 5E
    Bus 002 Device 001: ID 1d6b:0002 Linux 5.15.150 xhci-hcd xHCI Host Controller
    Bus 001 Device 002: ID 8087:8001

   In this example, the UPS is an EATON 5E model connected to the second USB port of the second USB bus.

2. Select the driver from the `NUT driver page <https://networkupstools.org/stable-hcl.html>`_.

3. All driver packages start with ``nut-driver-`` prefix. Some UPS models may require a specific driver, but most of them work with the ``usbhid-ups`` driver.
   Install the selected driver package, in this case the ``usbhid-ups`` driver: ::

    opkg install nut-driver-usbhid-ups

4. Set up the driver inside the ``upsd`` (nut-server) server. The nut-server will connect to the UPS using the driver and the port specified.
   It will monitor the UPS at regular intervals and provide the information to the clients like ``upsmon``. Execute: ::

    uci set nut_server.eaton5e=driver
    uci set nut_server.eaton5e.driver=usbhid-ups
    uci set nut_server.eaton5e.port=auto
    uci set nut_server.upsd=upsd
    uci commit nut_server

   Remember the name of the UPS, in this case ``eaton5e``, as it will be used in the next steps.

Step 3: configure monitoring
----------------------------

The UPS monitor (upsmon) is a daemon that monitors the UPS and initiates a system shutdown when the UPS battery is low.
It connects to the UPS server (upsd) and queries the UPS status.

In this scenario the UPS monitor is running on the same machine as the UPS server, so it will connect to localhost.

1. Set up the user for monitoring inside ``upsd``. Please note the password is simple because it is not sent over the network::

    uci set nut_server.upsuser=user
    uci set nut_server.upsuser.username=upsuser
    uci set nut_server.upsuser.password=password
    uci set nut_server.upsuser.upsmon=master

2. Set up the monitor::

    uci set nut_monitor.upsmon=upsmon
    uci set nut_monitor.master=master
    uci set nut_monitor.master.upsname=eaton5e
    uci set nut_monitor.master.hostname=localhost
    uci set nut_monitor.master.username=upsuser
    uci set nut_monitor.master.password=password

3. Commit and restart the services::

    uci commit nut_server
    uci commit nut_monitor
    /etc/init.d/nut-server restart
    /etc/init.d/nut-monitor restart

Step 4: verify the UPS status
------------------------------

Check the UPS status::

  upsc eaton5e

The output should look like this: ::

  battery.charge: 100
  battery.runtime: 2637
  battery.type: PbAc
  device.mfr: EATON
  device.model: 5E 850i
  ...

If the output is empty or an error is displayed, review the content of ``/var/log/messages``.

A good server log for connected UPS::

    Nov 29 09:23:08 NethSec upsd[7111]: Connected to UPS [eaton5e]: usbhid-ups-eaton5e

A good log for upsmon::

    Nov 29 09:23:11 NethSec upsmon[7189]: Communications with UPS eaton5e@localhost established

If an error is displayed, please see :ref:`troubleshooting_ups-section`.

If everything is working, the UPS should be monitored and the system should shut down when the battery is in a critical state, usually below 20%.

Allow remote monitoring
=======================

Multiple hardware devices can be connected to an UPS and the NUT server can share the UPS status with multiple clients.
So, for example, another system powered by the same UPS can inspect the UPS status by connecting to the NUT server and
shutting down when the battery is low.

By default, the NUT server is configured to listen only on localhost.
To allow remote monitoring, the server must be configured to listen on a specific IP address or on all interfaces.

1. Listen on all interfaces: ::

    uci set nut_server.listen=listen_address
    uci set nut_server.listen.address=0.0.0.0

2. Add a user for remote monitoring. Please make sure to select a strong password:  ::

    uci set nut_server.remoteuser=user
    uci set nut_server.remoteuser.username=remoteuser
    uci set nut_server.remoteuser.password=password
    uci commit nut_server
    /etc/init.d/nut-server restart

2. Check the status of the server::
    
    netstat -tuln | grep 3493

3. Create a firewall rule to allow remote monitoring from LAN, the service listen on TCP port 3493: ::

    uci set firewall.ns_allow_https.name='Allow-NUT-from-LAN'
    uci set firewall.ns_allow_https.proto='tcp'
    uci set firewall.ns_allow_https.src='lan'
    uci set firewall.ns_allow_https.dest_port='3493'
    uci set firewall.ns_allow_https.target='ACCEPT'
    uci commit firewall
    /etc/init.d/firewall restart

You can now connect to the NUT server from a remote upsmon client.
When the client is configured, it will connect to the NUT server and monitor the UPS status.
If the battery is low, the client will initiate a system shutdown.

Connect to remote NUT server
============================

This is the case where a secondary firewall is connected to the same UPS and the NUT server is running on the primary firewall.
The secondary firewall will connect to the primary firewall and monitor the UPS status.

1. First, install the NUT services on the client machine::

    opkg update
    opkg install nut-upsc nut-upsmon

   These packages are not preserved during a system upgrade. For more info see :ref:`restore_extra_packages-section`.

2. Then, configure the client to connect to the remote server::

    uci set nut_monitor.upsmon=upsmon
    uci set nut_monitor.slave=slave
    uci set nut_monitor.slave.upsname=eaton5e
    uci set nut_monitor.slave.hostname=192.168.1.8
    uci set nut_monitor.slave.username=remoteuser
    uci set nut_monitor.slave.password=password
    uci commit nut_monitor
    /etc/init.d/nut-monitor restart

3. Check if the client is connected to the remote server::

    upsc eaton5e@192.168.1.8

   The output should be the same as the local server.

Now the client is connected to the remote server and will monitor the UPS status.
If the battery is low, the client will initiate a system shutdown.

Extra UPS settings
==================

Some UPS models have additional settings that can be configured using the ``upscmd`` command.
To execute the command, the user must have the appropriate permissions.

1. Grant permissions to the user::

    uci add_list nut_server.upsuser.instcmd=all
    uci add_list nut_server.upsuser.actions=set
    uci commit nut_server
    /etc/init.d/nut-server restart

2. Check available commands::

    upscmd -l eaton5e

3. Example to disable the beep::

    upscmd -u upsuser -p password eaton5e beeper.disable

.. _troubleshooting_ups-section:

Troubleshooting
===============

A common error is the permission denied when accessing the UPS device, for example you may see this error inside ``/var/log/messages``::

    Can't open /etc/nut/ups.conf: Can't open /etc/nut/ups.conf: Permission denied openwrt

Another common error is upsd not being able to connect to the UPS, for example you may see this error inside ``/var/log/messages``::

    Nov 29 10:34:51 NethSec upsd[7055]: [D1] mainloop: UPS [eaton5e] is not currently connected
    Nov 29 10:34:51 NethSec upsd[7055]: [D1] mainloop: UPS [eaton5e] is now connected as FD -1


Usually, this happens when nut-server connects to the UPS device before the device is ready.
To fix this, the simplest solution is to reboot the firewall::

    reboot

If you can't reboot the firewall, you can try to stop the nut-server: ::

    /etc/init.d/nut-server stop

Then check if the driver can connect to the UPS device: ::

    /lib/nut/usbhid-ups -a eaton5e

Expected output: ::

    Network UPS Tools - Generic HID driver 0.47 (2.8.0)
    USB communication driver (libusb 1.0) 0.43
    Using subdriver: MGE HID 1.46

In case of error, you may see something like this: ::

    Can't claim USB device [0463:ffff]@0/0: Entity not found

You could then try to reset the USB device: ::

    usbreset 002/003

Where ``002/003`` is the USB device ID found with ``lsusb``, ``002`` is the bus number and ``003`` is the device number.
