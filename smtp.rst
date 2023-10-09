=========================
Mail notifications (SMTP)
=========================

.. warning::

   This feature is still under development and does not have a user interface yet. It can currently only be configured through the command line.

This section provides instructions for configuring the SMTP client (msmpt) on NethSecurity firewall for sending email notifications.
The SMTP client is used exclusively for sending notification emails and relies on an external SMTP server for delivery.

The `msmpt <https://marlam.de/msmtp/>`_ SMTP client offers advanced features to enhance security and reliability:

- **TLS/SSL Support:** msmpt supports TLS/SSL encryption for secure communication between the firewall and the external SMTP server
- **Authentication:** some SMTP servers require authentication to identify the user sending the email

See the `developer manual <https://dev.nethsecurity.org/packages/ns-api/#nssmtp>`_ for the commands on how to configure it from the command line.
