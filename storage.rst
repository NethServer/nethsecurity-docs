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
