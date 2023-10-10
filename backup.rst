==================
Backup and restore
==================

.. warning::

   This feature is still under development and can be configured only from LuCI web interface.

.. highlight:: bash

NethSecurity provides a flexible and powerful backup system to save and restore your firewall's configuration settings.

To manually generate and download a backup, access the ``Backup / Flash firmware`` page inside LuCI web interface, under the ``System`` section.

Automatic backup
================

If the machine has a valid :ref:`Enterprise subscription <subscription-section>`, a scheduled cron job will run every night to perform a backup.
This backup is then sent to a remote server over a secure channel.

Backup encryption
-----------------

Encryption of the backup file occurs if the file ``/etc/backup.pass`` exists.
Choose a good passphrase and write it to the file. Example: ::

  echo 'my$ver98StrongPass-' > /etc/backup.pass

The presence of this file triggers the backup to be encrypted using the specified passphrase. Only the encrypted backup is transmitted to the remote server.

To disable encryption, simply remove the file ``/etc/backup.pass``.

Restore
=======

The backup can be restored from the the ``Backup / Flash firmware`` page inside LuCI web interface.

Machines with a valid Enterprise subscription can download and restore the backups stored inside the remote server.
To download the latest backup and restore it, use this command: ::

  remote-backup download $(remote-backup list | jq -r .[0].file) - | sysupgrade -r -

If the backup has been encrypted, use the following command: ::

  echo 'my$ver98StrongPass-' > /etc/backup.pass
  remote-backup download $(remote-backup list | jq -r .[0].file) - | gpg --batch --passphrase-file /etc/backup.pass -d | sysupgrade -r -
