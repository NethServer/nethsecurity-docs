.. _install-section:

============
Installation
============

.. highlight:: bash

First, make sure to download the latest x86_64 image from the `official download link <https://updates.nethsecurity.nethserver.org/23.05.0/targets/x86/64/nethsecurity-22.03.5-x86-64-generic-ext4-combined-efi.img.gz>`_.

To install NethSecurity, you can either write the downloaded image directly to the disk or boot from a USB stick.

Install on bare metal
=====================

NethSecurity can be run from a USB stick or installed directly to any bootable device like
hard disks or SD cards.

1. attach the target disk/stick/card to a desktop Linux machine
2. find the disk/stick/card device name, in this example the device is named ``/dev/sdd``
3. as ``root`` user, write the downloaded image to the device: ::
   
     zcat nethsecurity-<version>-x86-64-generic-squashfs-combined.img.gz | dd of=/dev/sdd bs=1M iflag=fullblock status=progress oflag=direct
   
4. unplug the disk/stick/card from the desktop and plug it into the server
5. boot the server, select the correct device (USB, SD card or hard disk) from boot menu
6. the server is installed and ready to be used

If you're running a desktop Windows machine, you will need extra software for point 2.
First, make sure to format the USB drive then unmount it.
Use one of the following tools to write the USB stick:

* `Etcher <https://etcher.io/>`_ 
* `Win32 Disk Imager <http://sourceforge.net/projects/win32diskimager/>`_
* `Rawrite32 <http://www.netbsd.org/~martin/rawrite32/>`_
* `dd for Windows <http://www.chrysocome.net/dd>`_

Install from USB to disk
------------------------

Since running from the USB stick does not guarantee best performances, you can also install
NethSecurity to the hard disk while running it from the USB stick itself:

1. make sure the server has Internet access
2. connect to the server using VGA, serial console or SSH
3. login with default credentials
4. execute ``ns-install`` and follow the instructions


Install on virtual machines
===========================

You can use the downloaded image as a virtual machine disk:

1. extract the downloaded image: ::
   
     gunzip nethsecurity-<version>-x86-64-generic-squashfs-combined.img.gz
   
2. create a new virtual machine and select the uncompressed image as disk
3. boot the virtual machine

Install on Proxmox
------------------

The image can be imported inside `Proxmox <https://www.proxmox.com/>`_.

First, make sure to have 2 different network bridges. In this example we are going to use ``vmbr0`` and ``vmbr1``.
The described procedure can be also done using the Proxmox UI.

Create the virtual machine, in this example the machine will have id ``401``::

  qm create 401 --name "NethSecurity" --ostype l26 --cores 1 --memory 1024 --net0 virtio,bridge=vmbr0,firewall=0 --net1 virtio,bridge=vmbr1,firewall=0 --scsihw virtio-scsi-pci


Download the image: ::

  wget "https://updates.nethsecurity.nethserver.org/22.03.5/targets/x86/64/nethsecurity-22.03.5-x86-64-generic-ext4-combined-efi.img.gz"


Extract the image: ::

  gunzip nethsecurity-<version>-x86-64-generic-ext4-combined-efi.img.gz

Import the extracted images a virtual machine disk: ::

  qm importdisk 401 nethsecurity-<version>-x86-64-generic-ext4-combined-efi.img local-lvm

Attach the disk to the virtual machine: ::

  qm set 401 --scsi0 "local-lvm:vm-401-disk-0"

Setup the boot order: ::

  qm set 401 --boot order=scsi0

Finally, start the virtual machine.


Default network configuration
=============================

When you first boot NethSecurity, the system will try to configure the network interfaces.

By default, the network configuration will be as follows:

* The LAN interface will be configured with a static IP address of 192.168.1.1.
* The WAN interface will be configured to use DHCP to obtain an IP address from your ISP.

An exception to this default network configuration is virtual machines running on KVM and on Digital Ocean cloud provider (droplet). In this case, the network configuration will be as follows:

* The LAN interface will be configured to use DHCP to obtain an IP address from the virtualization platform.
* The WAN interface will be configured to use DHCP to obtain an IP address from your ISP.

**Note:** If you are using NethSecurity in a production environment, you may need to modify the default network configuration to meet your specific needs. For example, you may need to configure the LAN interface with a different IP address or configure the WAN interface to use a static IP address.
