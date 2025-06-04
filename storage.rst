.. _storage-section:

=======
Storage
=======

As default, logs are written in a volatile in-memory directory to prevent errors on the root file system in case of failure.
The memory storage capacity is limited and the oldest logs are automatically removed as time passes to limit memory occupancy. However, if you reboot the system or your system fails, you may lose all of your logs.

NethSecurity allows you to save a copy of system logs to a storage device other than the one it's currently on, like a USB stick or an additional hard drive.
Additionally, if the disk containing the operating system has unallocated space,
NethSecurity allows you to leverage this space as data storage.
This provides a convenient and efficient way to utilize existing resources for expanding storage capacity without the need for additional external devices.

This configuration can be useful for troubleshooting or keeping a system activity log.

To configure the additional storage, follow these steps:

* If you're willing to use an external device, attach your storage device
* Access the ``Storage`` page under the ``System`` section on the right menu
* Select the desired storage where logs will be written to
* Click on button :guilabel:`Format and configure storage`

If the chosen device is the primary disk, the system will generate a new partition utilizing any unallocated space. In the case of an additional disk selection,
the system will undertake the preparation process, 
which involves erasing all existing partitions and data on the selected device, resulting in the creation of a one single partition.

In both cases, the partition will be formatted using the ext4 filesystem and mounted as storage at ``/mnt/data``.

The system will then be reconfigured as follows:

- rsyslog will write logs also inside ``/mnt/data/logs/messages`` file
- logrotate will rotate ``/mnt/data/logs/messages`` once a week

Extra generated data like metrics, will be synced from in-memory filesystem to persistent storage once a day during the night.
To remove the data storage and restore in-memory log retention only, click on button :guilabel:`Remove storage`.

Troubleshooting
===============

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
