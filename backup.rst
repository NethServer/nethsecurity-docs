==================
Backup and restore
==================

NethSecurity provides a flexible and powerful backup system to save and restore your firewall's configuration settings.

If the machine does not have an :ref:`Enterprise subscription <subscription-section>`, the backup will be stored locally on the firewall.
To manually generate and download a backup, access the ``Backup & Restore`` page under the ``System`` section,
then click on the :guilabel:`Download backup` button.

If the machine has a valid Enterprise subscription, the page will show a list of backups available from the remote server.
The user can click the :guilabel:`Run backup` buttont: the backup will be stored on a remote server and the user will be able
to download it by clicking the :guilabel:`Download` button.

Backup encryption
=================

The backup is not encrypted by default.
To enable encryption, click on the :guilabel:`Configure passphrase` button and set a strong password.
To disable encryption, click on the :guilabel:`Configure passphrase` button and leave the password field empty.

.. note:: If the backup is encrypted and the password is lost, it will no longer be possible to restore the configuration.

Automatic backup
================

If the machine has a valid :ref:`Enterprise subscription <subscription-section>`, a scheduled cron job will run every night to perform a backup.
This backup is then sent to a remote server over a secure channel.
If the backup is encrypted, only the encrypted backup will be sent to the remote server.

Restore
=======

The backup can be restored from the the ``Restore`` tab inside the page inside the ``Backup & Restore`` page
The user can initiate the restore process by clicking the "Restore backup" button and uploading the backup file.
If the machine has a valid Enterprise subscription, the web interface will additionally present a list of backups available from the remote server.
If the backup is encrypted, enter the passphrase, and finally, click the "Restore" button to complete the process.

After the restore the system will be rebooted.