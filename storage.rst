=======
Storage
=======

.. warning::

   This feature is still under development and does not have a user interface yet. It can currently only be configured through the command line.

.. highlight:: bash

As default, logs are written inside a volatile in-memory directory to prevent errors on the root file system in case of failure. However, if your system fails, you may lose all of your logs.

NethSecurity allows you to save a copy of your system logs on an external storage device, such as a USB stick. This can be useful for troubleshooting problems or for keeping a record of your system activity.

To use the an external disk, attach the disk device to your machine and run the following command: ::

  add-storage <device>

Where ``device`` is the name of the external device like ``/dev/sdb``.

The command will prepare the device by erasing all partitions and existing data, creating a single partition using the ext4 filesystem,
and mounting the storage at ``/mnt/data``.

The system will then be reconfigured as follows:

- rsyslog will write logs also inside ``/mnt/data/logs/messages`` file
- logrotate will rotate ``/mnt/data/logs/messages`` once a week

Extra generated data like metrics, will be synced from in-memory filesystems to persistent storage once a day during the night.

To remove the data storage and restore in-memory log retention only, run the following command: ::

  remove-storage
