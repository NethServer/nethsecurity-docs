.. _storage-section:
=======
Storage
=======

As default, logs are written in a volatile in-memory directory to prevent errors on the root file system in case of failure.
The memory storage capacity is limited and the oldest logs are automatically removed as time passes to limit memory occupancy. However, if you reboot the system or your system fails, you may lose all of your logs.

NethSecurity allows you to save a copy of system logs to a storage device other than the one it's currently on, like a USB stick or an additional hard drive. This can be useful for troubleshooting or keeping a system activity log.

* Attach your storage device (external or internal)
* Go to the Storage page
* Select the desired storage where logs will be written to
* Click on button :guilabel:`Format and configure storage`

The command will prepare the device by erasing all partitions and existing data, creating a single partition using the ext4 filesystem, and mounting the storage at ``/mnt/data``.

The system will then be reconfigured as follows:

- rsyslog will write logs also inside ``/mnt/data/logs/messages`` file
- logrotate will rotate ``/mnt/data/logs/messages`` once a week

Extra generated data like metrics, will be synced from in-memory filesystem to persistent storage once a day during the night.
To remove the data storage and restore in-memory log retention only, click on button :guilabel:`remove-storage`.
