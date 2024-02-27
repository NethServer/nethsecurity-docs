==============================
Certificates and reverse proxy
==============================

.. highlight:: bash

Reverse proxy
=============

NethSecurity provides a reverse proxy using `nginx <https://nginx.org>`_.
A reverse proxy, sometimes called also proxy pass, is a server that sits in front of one or more web servers and forwards requests to them.
It can be used to improve performance, security, and reliability.

In simpler terms, a reverse proxy is like a traffic cop for web servers. It directs incoming requests to the appropriate server and sends back the responses.

Reverse proxies are often used to improve performance by caching static content and distributing traffic across multiple servers. They can also be used to increase security by implementing the TLS endpoint.

.. note::

  The reverse proxy is only available on port 443 (HTTPS) and *not* on port 80 (HTTP).

This page allows users to configure proxy pass settings, specifying whether the rule applies to a domain or a path.
For domain configurations, users can select a certificate.
The destination URL determines where incoming requests are forwarded, and the allowed network field provides the option
to restrict access to specific CIDR-formatted networks. A description can be added for clarity.

To configure a new proxy pass, click on the :guilabel:`Add reverse proxy` and customize the following options:

- ``Type``: choose between Domain or Path.
  If type is ``Path``, enter the resource path starting with a '/' for matching rules (e.g., ``/resource-path``).
  If type is ``Domain``, enter the fully qualified domain name for website matching rules. Select also an associated :ref:`certificate <certificates-section>`.
- ``Destination URL``: specify the forwarding location for incoming requests (e.g., ``http://destination-server:port/path``).
- ``Allowed networks``: define allowed IPv4/IPv6 networks in CIDR format. By default, accessible from anywhere.
- ``Description``: optionally, add a description for clarity.

Additional information:

- Headers sent to destination server: X-Forwarded-Proto, X-Forwarded-For, X-Real-IP are always sent.
- Certificate validation: if the destination uses HTTPS, the certificate is not validated to avoid errors on misconfigured servers.
- WebSocket support: all reverse proxies automatically support WebSockets.

.. _certificates-section:

Certificates
============

The ``Certificates`` page centralizes certificate management functionalities, facilitating the handling of certificates on the firewall.
At the firewall's initial startup, a self-signed certificate is automatically generated. This certificate serves as a default secure option.

The certificate management page allows users to upload custom certificates, request certificates from Let's Encrypt, and manage existing certificates.

The page lists all certificates, highlighting the default certificate. The default certificate is the one automatically served when accessing the
firewall through its FQDN or IP address.

Let's Encrypt
-------------

Let's Encrypt is a free, automated, and open Certificate Authority (CA) that provides SSL/TLS certificates for securing websites.
These certificates ensure encrypted communication between web servers and users' browsers, enhancing security and privacy on the internet. 
Unlike traditional CAs, Let's Encrypt offers SSL certificates through an automated system, making it accessible to website owners
and administrators without significant costs or technical expertise.

The certificate page allows users to request certificates from Let's Encrypt. The process is straightforward and requires minimal configuration.
Users can specify a meaningful name for the certificate and one or more domains. The certificate is automatically renewed every 60 days.

The Let's Encrypt certificate request process involves the following steps:

- click on the :guilabel:`Add Let's Encrypt certificate` button;
- specify a meaningful name for the certificate;
- specify one or more domains for the certificate;
- click on the :guilabel:`Save` button.

The validation process can be performed in two ways: 

- Standalone mode (HTTP validation): the Standalone mode involves temporarily stopping the web server to allow the ACME client tool to bind to the required ports directly.
  It serves the authentication challenges to prove domain ownership, obtaining and installing the certificate.

- DNS validation: DNS validation requires adding a specific DNS TXT record to the domain's DNS configuration.
  ACME client checks for this record to verify domain ownership. This method is useful in situations where modifying web server configurations is challenging or not desired.

When standalone mode is selected, make sure the following requirements are met:

1. The firewall must be reachable from outside on port 80. The acme client will:

   - temporarily bind to port 80 to serve the authentication challenges
   - temporarily open port 80 to the public Internet to perform the validation.

   Once the validation is complete, port 80 is automatically closed.
   Please note that if port 80 is forwarded to another server, the validation will fail.

2. The domains that you want the certificate for must be public domain names
   associated to server own public IP. Make sure you have public DNS name
   pointing to your server (you can check with sites like `VDNS <http://viewdns.info/>`_).

Select DNS validation if your DNS provider supports API access.
Choose the DNS provider from the drop-down menu and enter the API key and secret. Follow the `acme.sh DNS providers documentation <https://github.com/acmesh-official/acme.sh/wiki/dnsapi>`_)
to know which API key and secret are required for your DNS provider.
The DNS validation is the only one supported for wildcard certificates.

The certificate generation process can take a few minutes. During this time, the certificate status is ``Pending``.

Debug Let's Encrypt
^^^^^^^^^^^^^^^^^^^

If the Let's Encrypt certificate request fails, the user can debug the process by entering the following commands in the terminal: ::

  uci set acme.@acme[0].debug=1
  /etc/init.d/acme start

The debug messages will be printed on the standard output.
After the problem is solved, the user can disable debug by entering the following command in the terminal: ::

  uci revert acme

Custom certificate
------------------

The user can upload a custom certificate to the firewall.

The process involves the following steps:

- click on the :guilabel:`Import certificate` button
- specify a meaningful name for the certificate
- drag and drop the certificate, private key, and optionally, the chain certificate; ensure that all uploaded files adhere to the
  `PEM format <https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail>`_ standards
- click on the :guilabel:`Save` button