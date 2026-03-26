.. _remote_support-section:

==============
Remote support
==============

.. admonition:: Enterprise subscription required

   This feature is available only if the firewall has a valid Enterprise subscription.

The :ref:`Enterprise subscription <subscription-section>` allows you to access the Nethesis remote support.

The remote support session will connect the firewall to a `WindMill instance <https://github.com/nethesis/windmill>`_ hosted
by Nethesis at ``sos.nethesis.it``.
The firewall must be able to connect to the above host on port ``1194`` UDP. If port ``1194`` is closed,
the system will try to fallback on port ``443`` TCP.

Session Management
==================

The remote support must be started and stopped by the firewall administrator.

Starting a Session
------------------

To start a session:

- access the ``Subscription`` page and go to the ``Remote support`` section
- click the :guilabel:`Start session` button
- copy the ``Session ID`` and share it with the support team
- the session will be active for 24 hours by default

The system will display:

- The current session status (active/inactive)
- The session expiration time
- The remaining time until expiration

Session Expiration
------------------

Remote support sessions have the following expiration behavior:

- **Default session**: expires after 24 hours
- **Extended session**: expires after 7 days from the extension time
- **Automatic cleanup**: expired sessions are automatically stopped by the system

The system continuously monitors session expiration:

- A cron job runs every hour to check for expired sessions
- When a session expires, it is automatically stopped
- Session expiration events are logged to the system log

.. note::
   The session expiration check ensures that remote access is automatically
   terminated when the support window expires, maintaining security best practices.

Session Status Information
--------------------------

The user interface displays the following session information:

- **Session status**: Active or Not running
- **Session ID**: Unique identifier to share with support team
- **Expiration time**: When the session will automatically end

You can view this information at any time in the ``Remote support`` section of the ``Subscription`` page.

Terminating a Session
---------------------

To manually terminate an active session before it expires:

- access the ``Subscription`` page and go to the ``Remote support`` section
- click the :guilabel:`End session` button
- the remote support connection will be immediately closed

Command Line Interface
======================

Advanced users can manage remote support sessions using the ``don`` command from the firewall's command line.

Start a session::

    don start

This will start a new remote support session with a 24-hour expiration.

Check session status::

    don status

This displays the current session information including:

- Server ID
- Session ID
- Time remaining until expiration

Extend an active session::

    don extend

.. important::
   Session extension is only available via command line. This feature extends the session 
   from the default 24 hours to 7 days from the current time.

Stop a session::

    don stop

This immediately terminates the remote support session and cleans up all resources.

Check for expired sessions::

    don expire

This command is automatically run by cron every hour to check if the session has expired.
If the session has expired, it will be automatically stopped.

.. note::
   The ``don`` command requires root privileges and logs all operations to the system log.
