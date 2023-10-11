.. _controller-section:

==========
Controller
==========

The NethSecurity controller is an application that can run on `NethServer 8 <https://ns.nethserver.org>`_.
The controller enables to manage multiple NethSecurity installations remotely.

Firewalls can connect to the controller. Upon successful registration, the server performs the following actions:

- generates a VPN configuration and transmits it to the firewall
- safely stores credentials required for accessing the remote firewall

Once a firewall is linked to a controller, it will autonomously transmit the following data to the controller:

- all logs, which will be stored within the `Loki <https://grafana.com/oss/loki/>`_ instance of NethServer 8
- metrics, collected every 5 minutes, and these metrics will be accessible through `Grafana <https://grafana.com/>`_ on NethServer 8

The firewall can operate independently, and the controller is entirely optional for its functionality.

Registration
============

.. warning::

   This feature is still under development and does not have a user interface yet. It can currently only be configured through the command line.

See the `developer manual <https://dev.nethsecurity.org/packages/ns-plug/#nethsecurity-controller-client>` for more info.
