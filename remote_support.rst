.. _remote_support-section:

==============
Remote support
==============

.. admonition:: Enterprise subscription required

   This feature is available only if the firewall has a valid enterprise subscription.

The :ref:`Enterprise subscription <subscription-section>` allows you to access the Nethesis remote support.

The remote support session will connect the firewall to a `WindMill instance <https://github.com/nethesis/windmill>`_ hosted
by Nethesis at ``sos.nethesis.it``.
The firewall must be able to connect to the above host on port ``1194`` UDP. If port ``1194`` is closed,
the system will try to fallback on port ``443`` TCP.

The remote support must be started and stopped by the firewall administrator.
To start a session:

- access the ``Subscription`` page and go to the ``Remote support`` section
- click the :guilabel:`Start session` button
- copy the ``Session ID`` and share it with the support team

To terminate the session, click the :guilabel:`End session` button.
