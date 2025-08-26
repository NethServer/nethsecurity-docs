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

NethSecurity allows the creation of both encrypted and unencrypted backups. 
Downloading an unencrypted backup is always possible by clicking the :guilabel:`Download unencrypted` button.


To allow downloading an encrypted backup, first click on the :guilabel:`Configure passphrase` button and set a strong password. After that the :guilabel:`Download encrypted` button will become active.

.. note:: If the backup is encrypted and the password is lost, it will no longer be possible to restore the configuration.

To disallow encrypted backups, click on the :guilabel:`Remove passphrase` button and :guilabel:`Download encrypted` button will become inactive.


.. _automatic_backup-section:

Restore
=======

The backup can be restored from the the ``Restore`` tab inside the page inside the ``Backup & Restore`` page
The user can initiate the restore process by clicking the :guilabel:`Restore backup` button and uploading the backup file.
If the machine has a valid Enterprise subscription, the web interface will additionally present a list of backups available from the remote server.
If the backup is encrypted, enter the passphrase, and finally, click the :guilabel:`Restore` button to complete the process.

After the restore the system will be rebooted.

If you have installed extra packages, you can restore them by following the instructions in the :ref:`restore_extra_packages-section`.

Machines with a subscription
===========================

.. admonition:: Subscription required

   This feature is available only if the firewall has a valid subscription.


Backups behave differently on devices with an active subscription.

Unencrypted backups can still be downloaded directly from the NethSecurity UI by clicking the :guilabel:`Download unencrypted` button.

Encrypted backups are stored in the cloud and integrated with Nethesis Operation Center: this approach simplifies backup management and the restore process for subscription-based devices, which can interact directly with the Operation Center and automatically download the backup when restoring.

To enable encrypted cloud backups first, a passphrase must be configured by clicking the :guilabel:`Configure passphrase` button, as described in the above section `Backup encryption`. Once the passphrase is set you can either:

* Click the :guilabel:`Run cloud backup` button to create a backup immediately
* Let the system automatically create a backup every night 

Every encrypted backup will be sent directly to the Nethesis Operation Center over a secure channel.
Please note that the date of the backup is the server date.
The dates displayed in the backup list are based on the time of the server storing the backups, not the time of the firewall that created them.
This means the dates might differ depending on time zone differences.


.. warning::
   
   Cloud backups without encryption have been deprecated. For a limited time, backups will still be sent to the cloud even if they are not encrypted.
   In the near future, only encrypted backups will be sent to the remote server.
   If you have a valid subscription, please enable encryption to ensure the security of your backup.
   See also :ref:`backup_encryption-alert` for more information.
   


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
