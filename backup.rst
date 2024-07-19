==================
Backup and restore
==================

NethSecurity provides a flexible and powerful backup system to save and restore your firewall's configuration settings.

Access the ``Backup & Restore`` page under the ``System`` section, then click on the :guilabel:`Download backup` button.
If the machine has a valid Enterprise subscription, the backup is :ref:`automatic <automatic_backup-section>`.

Backup encryption
=================

The backup is not encrypted by default.
To enable encryption, click on the :guilabel:`Configure passphrase` button and set a strong password.
To disable encryption, click on the :guilabel:`Configure passphrase` button and leave the password field empty.

.. note:: If the backup is encrypted and the password is lost, it will no longer be possible to restore the configuration.

.. _automatic_backup-section:

Restore
=======

The backup can be restored from the the ``Restore`` tab inside the page inside the ``Backup & Restore`` page
The user can initiate the restore process by clicking the :guilabel:`Restore backup` button and uploading the backup file.
If the machine has a valid Enterprise subscription, the web interface will additionally present a list of backups available from the remote server.
If the backup is encrypted, enter the passphrase, and finally, click the :guilabel:`Restore` button to complete the process.

After the restore the system will be rebooted.

Automatic backup
================

.. admonition:: Subscription required

   This feature is available only if the firewall has a valid subscription.

If the machine has a valid :ref:`subscription <subscription-section>`, a scheduled cron job will run every night to perform a backup.
This backup is then sent to a remote server over a secure channel.
If the backup is encrypted, only the encrypted backup will be sent to the remote server.
It is recommended to encrypt the backup to ensure that no one can access the configuration settings stored inside it.

The user can click the :guilabel:`Run backup` button: the backup will be stored on a remote server and the user will be able
to download it by clicking the :guilabel:`Download` button.
Please note that the date of the backup is the server date.
The dates displayed in the backup list are based on the time of the server storing the backups, not the time of the firewall that created them.
This means the dates might differ depending on time zone differences.

Backup customization
====================

The backup includes all relevant configuration files.
To list the files included in the backup, execute the following command: ::

  sysupgrade -l

The backup can be customized by adding files to the backup list.
Just add a new line to the file ``/etc/sysupgrade.conf`` with the path of the file to be included in the backup.

Example: ::

   echo /etc/myfile >> /etc/sysupgrade.conf