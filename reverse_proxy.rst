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

Let's Encrypt certificates
==========================

.. warning::

   This feature is still under development and can be configured only from LuCI web interface.

Let's Encrypt is a free, automated, and open Certificate Authority (CA) that provides SSL/TLS certificates for securing websites.
These certificates ensure encrypted communication between web servers and users' browsers, enhancing security and privacy on the internet. 
Unlike traditional CAs, Let's Encrypt offers SSL certificates through an automated system, making it accessible to website owners
and administrators without significant costs or technical expertise.

To obtain a valid Let's Encrpt certificate, make sure the following requirements are met:

1. The server must be reachable from outside at port 80. Make sure your port 80
   is open to the public Internet (you can check with sites like `CSM <http://www.canyouseeme.org/>`_);

2. The domains that you want the certificate for must be public domain names
   associated to server own public IP. Make sure you have public DNS name
   pointing to your server (you can check with sites like `VDNS <http://viewdns.info/>`_).

Let's Encrypt certificates can be configured from the ``ACME certs`` page inside LuCI web interface, under the ``Services`` section.
