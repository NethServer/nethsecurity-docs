.. _install-section:

============
Installation
============

.. highlight:: bash

To begin the installation process, start by :ref:`downloading <download-section>` the latest image.
Once the download is complete, you have two methods to install NethSecurity:

- Direct disk installation: write the downloaded image directly to your computer's disk.
  This method allows for a straightforward installation process directly onto your system's storage.

- USB boot installation: alternatively, you can create a bootable USB stick using the downloaded image.
  Boot the system from the USB stick and type a command to initiate the installation process.

Choose the method that best suits your needs and proceed with the installation process for NethSecurity.

.. _install_bare_metal-section:

Install on bare metal
=====================

NethSecurity can be run from a USB stick or installed directly to any bootable device like
hard disks or SD cards.

1. attach the target disk/stick/card to a desktop Linux machine
2. find the disk/stick/card device name, in this example the device is named ``/dev/sdd``
3. as ``root`` user, write the downloaded image to the device:
   
   .. parsed-literal::

     zcat |image| | dd of=/dev/sdd bs=1M iflag=fullblock status=progress oflag=direct
   
4. unplug the disk/stick/card from the desktop and plug it into the server
5. boot the server, select the correct device (USB, SD card or hard disk) from boot menu
6. the server is installed and ready to be used

.. rubric:: Writing the image on Windows

.. note::
  Writing the image on a Windows machine is not recommended because it may mess up the disk partitioning.

If you're running a desktop Windows machine, you will need extra software for point 2.
First, make sure to format the USB drive then unmount it.
Use one of the following tools to write the USB stick:

* `Etcher <https://etcher.io/>`_ 
* `Win32 Disk Imager <http://sourceforge.net/projects/win32diskimager/>`_
* `Rawrite32 <http://www.netbsd.org/~martin/rawrite32/>`_

Install from USB to disk
------------------------

Since running from the USB stick does not guarantee best performances, you can also install
NethSecurity to the hard disk while running it from the USB stick itself:

1. connect to the server using VGA, serial console or SSH
2. login with :ref:`default credentials <default_credentials-section>`
3. execute ``ns-install`` and follow the instructions

The firewall will be halted at the end of the installation.
Once the firewall has been shutdown, you can safely remove the USB stick and
boot the server again.

Install on virtual machines
===========================

You can use the downloaded image as a virtual machine disk:

1. extract the downloaded image:

   .. parsed-literal::
   
     gunzip |image|
   
2. create a new virtual machine and select the uncompressed image as disk
3. boot the virtual machine

Install on Proxmox
------------------

The image can be imported inside `Proxmox <https://www.proxmox.com/>`_.

First, make sure to have 2 different network bridges. In this example we are going to use ``vmbr0`` and ``vmbr1``.
The described procedure can be also done using the Proxmox UI.

Create the virtual machine, in this example the machine will have id ``401``::

  qm create 401 --name "NethSecurity" --ostype l26 --cores 1 --memory 1024 --net0 virtio,bridge=vmbr0,firewall=0 --net1 virtio,bridge=vmbr1,firewall=0 --scsihw virtio-scsi-pci


Download the image:

.. parsed-literal::

  wget '|download_url|'


Extract the image:

.. parsed-literal::

  gunzip |image|

Import the extracted images a virtual machine disk:

.. parsed-literal::

  qm importdisk 401 |image_no_gz| local-lvm

Attach the disk to the virtual machine: ::

  qm set 401 --scsi0 "local-lvm:vm-401-disk-0"

Setup the boot order: ::

  qm set 401 --boot order=scsi0

Finally, start the virtual machine.


Install on VMWare
-----------------

`VMWare <https://www.vmware.com>`_ may encounter issues when importing raw disk images directly.
To ensure a smooth import, first decompress the image file, then convert the raw image to the VMWare native ``.vmdk`` format before proceeding.

On Windows, you can use a software like `V2V Converted <https://www.starwindsoftware.com/starwind-v2v-converter>`_.

On Linux you can use the ``qemu-img`` command. Example: ::

  qemu-img convert -f raw -O vmdk <source_image.raw> <destination_image.vmdk>

Replace:

- ``<source_image.raw>`` with the actual path to your raw disk image
- ``<destination_image.vmdk>`` with your desired .vmdk filename

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
