==================
Backup and restore
==================

NethSecurity provides a flexible and powerful backup system to save and restore your firewall's configuration settings.

Access the ``Backup & Restore`` page under the ``System`` section, then click on the :guilabel:`Download backup` button.
If the machine has a valid Enterprise subscription, the backup is :ref:`automatic <automatic_backup-section>`.

The backup includes all relevant configuration files and also the list of extra packages installed by the user.
The list is saved in the file ``/etc/backup/installed_packages.txt``.

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

If you have installed extra packages, you can restore them by following the instructions in the :ref:`restore_extra_packages-section`.

Automatic backup
================

.. admonition:: Subscription required

   This feature is available only if the firewall has a valid subscription.

If the machine has a valid :ref:`subscription <subscription-section>`, a scheduled cron job will run every night to perform a backup.
This backup is then sent to a remote server over a secure channel.
If the backup is encrypted, only the encrypted backup will be sent to the remote server.
It is recommended to encrypt the backup to ensure that no one can access the configuration settings stored inside it.

.. warning::
   
   Backup without encryption has been deprecated.
   In the near future, non-encrypted backups will not be sent to the remote server.
   If you have a valid subscription, please enable encryption to ensure the security of your backup.
   See also :ref:`backup_encryption-alert` for more information.
   
The user can click the :guilabel:`Run backup` button: the backup will be stored on a remote server and the user will be able
to download it by clicking the :guilabel:`Download` button.
Please note that the date of the backup is the server date.
The dates displayed in the backup list are based on the time of the server storing the backups, not the time of the firewall that created them.
This means the dates might differ depending on time zone differences.

.. _backup_encryption-alert:

Backup encryption alert
-----------------------

Not encrypting the backup is a security risk.
If the backup is not encrypted, anyone with access to the backup file can read the configuration settings stored inside it.

Every night a script will check if the backup is encrypted.
If the backup is not encrypted, the script will create an alert inside the remote portal my.nethesis.it or my.nethserver.com.
To resolve the alert, the user must enable encryption by clicking on the :guilabel:`Configure passphrase` button and setting a strong password.
The alert will be resolved automatically during the nightly cron job.

To disable the alert, access the shell and execute: ::

   uci set ns-plug.config.backup_alert_disabled=1
   uci commit ns-plug


Disabling the alert will result in silent failures when the sending of non-encrypted backups is blocked in the future.
The administrator will not be notified of these failures, potentially leading to unnoticed backup issues.

Backup customization
====================

The backup includes all relevant configuration files.
To list the files included in the backup, execute the following command: ::

  sysupgrade -l

The backup can be customized by adding files to the backup list.
Just add a new line to the file ``/etc/sysupgrade.conf`` with the path of the file to be included in the backup.

Example: ::

   echo /etc/myfile >> /etc/sysupgrade.conf