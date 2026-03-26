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

Session management
==================

The remote support must be started and stopped by the firewall administrator.

Starting a session
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

You can view this information at any time in the ``Remote support`` section of the ``Subscription`` page.

Session expiration
------------------

Remote support sessions have the following expiration behavior:

- **Default session**: expires after 24 hours
- **Extended session**: expires after 7 days from the extension time

The system continuously monitors session expiration:

- A cron job runs every hour to check for expired sessions
- When a session expires, it is automatically stopped
- Session expiration events are logged to the system log


Terminating a session
---------------------

To manually terminate an active session before it expires:

- access the ``Subscription`` page and go to the ``Remote support`` section
- click the :guilabel:`End session` button
- the remote support connection will be immediately closed

Command Line Interface
======================

The ``don`` command requires root privileges and logs all operations to the system log.

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
   from the default 24 hours to 7 days starting since the current time.

Stop a session::

    don stop

This immediately terminates the remote support session and cleans up all resources.

Check for expired sessions::

    don expire

This command is automatically run by cron every hour to check if the session has expired.
If the session has expired, it will be automatically stopped.

