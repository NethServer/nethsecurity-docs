=============
Factory reset
=============

NethSecurity provides multiple options to reset your firewall and restore its functionality:

* :ref:`Factory reset <factory_reset-section>`: choosing this method erases all your installed packages and customized settings, 
  reverting the firewall back to its original state as it was after NethSecurity installation.
* :ref:`Failsafe mode <failsafe-section>`: this option is useful if you have lost control of your device, making it inaccessible due to a configuration error.
  Failsafe mode allows you to reboot the firewall into a basic operating state while retaining most of your packages and settings.
* :ref:`Recovery mode <recovery-section>`: if your firewall's firmware becomes corrupted, recovery mode comes to the rescue.
  It enables you to install new firmware and unbrick a faulty machine.

.. _factory_reset-section:

Factory reset
=============

In NethSecurity, a factory reset refers to the process of reverting the firewall device back to its original settings and configuration as it 
was when it was first installed. This procedure erases all the customized settings, configurations, installed packages,
and user data on the device, effectively restoring it to a pristine state.

This procedure relies on the completion of the boot process. If the factory reset doesn't work, consider using failsafe mode instead.

To start fresh without reinstalling the firmware, access the ``Factory reset`` page under the ``System`` section.
Click the :guilabel:`Perform factory reset` button to reset the firewall to its original state.
The factory reset process will take a few seconds to complete. Once the process is complete, the firewall will reboot automatically.

The factory reset restores the currently installed version. 
For instance, if the firewall was initially installed with version 23.05.0 and then updated to 23.05.1, after the factory reset,
you will have a clean installation of version 23.05.1.

If the storage on which NethSecurity is running has been configured with a partition to save logs, the 'Factory reset' done from the Web UI will also remove the log partition and all its data.

.. note:: If NethSecurity was installed through an in-place migration from NethServer 7, the factory reset will not restore the default configuration. Instead, the system will restart with all configurations migrated from NethServer 7.

If you prefer a clean start, you can proceed with a new :ref:`installation <install-section>` rather than using the factory reset.

Alternatively, you can follow these steps:

* Update your NethSecurity with a newer image (if present) or using a standard image downloaded from :ref:`downloading <download-section>`.This will rewrite the ROM of your NethSecurity with a standard one, removing any migration files.
* Now you can perform the Factory Reset, which will lead you to a clean start.


If you want to execute the factory reset from command line, just execute the following command. ::

  /usr/libexec/rpcd/ns.factoryreset call reset

.. _failsafe-section:

Failsafe mode
=============

NethSecurity provides a failsafe mode that can override the current configuration of your device. If your device becomes inaccessible due
to a configuration error, failsafe mode comes to your rescue. When you boot into failsafe mode, the device initializes in a basic operating state,
using a set of predefined defaults, allowing you to address the issue manually.

However, it's important to note that failsafe mode cannot resolve more complex issues such as faulty hardware or a damaged kernel.
While it resembles a reset, failsafe mode enables you to access your device and restore settings if necessary, whereas a reset would simply erase all configurations.

The simplest way to activate failsafe mode is to connect directly to the firewall using a VGA/HDMI monitor or a serial cable. To do this,
boot the machine, wait for the Grub boot menu to appear, and select ``NethSecurity (failsafe)``.

You can access the firewall directly through the serial port using a null-modem cable and a common terminal program.
For Windows, you can use ``PuTTY`` version 0.60 or higher. For Linux, options include ``minicom`` and ``picocom``. Set the baud rate
to 115200, data bits to 8, parity to None, and stop bits to 1 (abbreviated as 8N1).

After entering failsafe mode, the firewall will start with a network address of 192.168.1.1/24, usually on the eth0 network interface,
and only essential services will be operational. It's important to note that the DHCP server will be inactive in failsafe mode.
Follow the instructions displayed on the screen to mount the root filesystem and access other utilities as needed.

If you want to execute the factory reset in failsafe mode, just execute the following commands. ::

  firstboot -y && reboot

.. note:: This commands will not delete the log partition from disk if it exists. If you need to delete the old partition please refer to the :ref:`storage-section` for more details.

.. _recovery-section:

Emergency recovery
==================

Emergency recovery in NethSecurity, also known as unbricking, is a feature enabling users to restore their firewall device in cases of severe malfunctions.
Unbricking ensures that even the most critical issues can be resolved, restoring the device to full functionality, unless there are hardware failures.

If you still have access to the system, you can use the following commands to download and write the image: ::

  ns-download -l

This command will display the path of the downloaded image. Use this path in the following command: ::

  sysupgrade -n <download_image_path>

If you can't access the system, :ref:`download the latest image <download-section>`, then follow :ref:`installation instructions <install_bare_metal-section>`
to write the image directly into the storage media.
