.. _storage-section:

=======
Storage
=======

Starting from version 8.6, NethSecurity automatically saves system logs to a persistent storage partition on bare metal installations (*refer to the dedicated section below for virtual machines*).

This guarantees that logs remain available across reboots or unexpected shutdowns, even if the storage has not been manually configured.
The default log retention period is 52 weeks.

For **new installations** the system automatically creates a dedicated partition on the main disk to store logs.  

For **upgrades**:

* if no storage had previously been configured, the system automatically sets it up using unallocated space on the primary disk
* if storage was already configured, it remains unchanged

.. note::

   This behavior improves reliability and does not require manual intervention. However, users can still manage storage settings from the web interface.  

Persistent log storage can be disabled (not recommended), or moved to a different disk if needed.  
If disabled, the system will automatically reconfigure it during a future upgrade.

Manual configuration
^^^^^^^^^^^^^^^^^^^^

Manual configuration of additional storage is still available and works as follows:

* If using an additional device, connect it to the system.
* Access the ``Storage`` page under the ``System`` section in the right-hand menu.
* Select the storage device where logs should be saved.
* Click on the button :guilabel:`Format and configure storage`.
* If the selected device is the **primary disk**, the system will generate a new partition using any unallocated space.
* If an **additional disk** is selected, the system will erase all existing partitions and data and create a single new partition.

The storage is then:

* Formatted with the ``ext4`` filesystem
* Mounted at ``/mnt/data``
* Used by ``rsyslog`` to write logs to ``/mnt/data/log/messages``
* Rotated weekly by ``logrotate``
* Synchronized daily (at night) for additional data like metrics

To remove persistent storage and return to in-memory logging, click on the button :guilabel:`Remove storage`.

Virtual Machines
----------------
When installing NethSecurity on a virtual machine, the recommended method is to generate the virtual disk from the official image.
In this mode, logs are not stored persistently by default.
To enable persistent log storage, you must attach a second virtual disk to the virtual machine.
As an alternative, you can extend the virtual disk and use the free disk space to create a new partition like on a physical hardware.

Behavior in versions prior to 8.6
---------------------------------

In earlier versions of NethSecurity, logs were written by default to a **volatile in-memory directory**.
To persist logs, storage had to be configured **manually**, either by using unallocated space on the system disk or by attaching a secondary disk.  

Log Partition Management
========================

In certain instances, you may encounter challenges utilizing the primary disk for log storage, as the user interface may not present any options. 
In such cases, the issue typically stems from a pre-existing partition on the disk, which must be removed beforehand to ensure proper utilization by the system.

This typically occurs even after performing a default reset using failsafe mode (which does not remove the log partition), in order to allow the system to use again the storage to save new logs you need to remove the old partition.

This can be easily done this way.

* Verify if the log partition is present with the command:

``parted /dev/sda print``::

  root@NethSec:~# parted /dev/sda print
  Model: ATA Hoodisk SSD (scsi)
  Disk /dev/sda: 32.0GB
  Sector size (logical/physical): 512B/512B
  Partition Table: gpt
  Disk Flags: 
  
  Number  Start   End     Size    File system  Name  Flags
  128     17.4kB  262kB   245kB                      bios_grub
   1      262kB   17.0MB  16.8MB  fat16              legacy_boot
   2      17.0MB  332MB   315MB
   3      512MB   32.0GB  31.5GB  ext2

Partition 3 is the one used for logs.

* to remove partition 3 execute the command:

``parted /dev/sda rm 3``

* Now verify again the partition table with the command:

``parted /dev/sda print``

Partition 3 should not be visible.

Now the storage is ready to be configured for logs from the Web UI.
