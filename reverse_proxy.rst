=============
Reverse proxy
=============

.. warning::

   This feature is still under development and does not have a user interface yet. It can currently only be configured through the command line.

NethSecurity provides a reverse proxy using nginx.
A reverse proxy is a server that sits in front of one or more web servers and forwards requests to them. It can be used to improve performance, security, and reliability.

In simpler terms, a reverse proxy is like a traffic cop for web servers. It directs incoming requests to the appropriate server and sends back the responses.

Reverse proxies are often used to improve performance by caching static content and distributing traffic across multiple servers. They can also be used to increase security by implementing the TLS endpoint.

See the `developer manual <https://dev.nethsecurity.org/packages/ns-reverse-proxy/>`_ for a guide on how to configure it from the command line.
