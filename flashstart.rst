.. _flashstart-section:

=====================
FlashStart DNS filter
=====================

DNS filtering integrates with third-party DNS-based content filtering software, default supported content filter is the one provided from `FlashStart <https://www.flashstart.com>`_.

It basically links 2 components : filter configuration and network configuration.

1. Content filter configuration takes place entirely on the third-party platform, typically it is possible to block individual websites, as well as categories of sites (e.g. adult), manage exceptions, view reports and so on.

2. Network configuration is completely automated and is done on NethSecurity which takes care of:

* connect the firewall to the specific third party instance
* redirect all DNS requests to the external service
* automatically update IP addresses of all connectivities

.. admonition:: Subscription required

   This feature is available only if the firewall has a valid subscription.

.. note::

  Before configuring NethSecurity you need to create an account on FlashStart and configure the service.
  FlashStart is a payed service that allows you to use trial licenses.
  Please refer to the supplier's documentation `doc <https://cloud.flashstart.com/customerarea/support/docs>`_.

.. warning::

  If you are using the DHCP service on NethSecurity, please note that FlashStart integration requires explicitly
  specifying the DNS server through DHCP options.Go to the DHCP section, under Advanced Settings, and add the following
  option: 6:dns-server,<YOUR-USUAL-DNS-SERVER>. This ensures that clients receive the correct DNS server via DHCP. In
  this field, enter the DNS server typically used in your network, usually the IP address of the NethSecurity interface.
  Do not manually specify the IP addresses of the FlashStart DNS servers, as they are automatically managed by the
  integration.

Once the account has been created and the service configured, NethSecurity can be configured.

Recommendations Before Configuring FlashStart DNS Filter
=========================================================

Before enabling the FlashStart DNS filter, please consider the following important recommendations:

1. **DNS Redirection Behavior**  
   When content filtering is enabled, all DNS traffic from the clients will be automatically redirected to the external FlashStart filtering service, regardless of their configuration.  
   **Do not make changes to the DNS servers configured in NethSecurity or in network clients.**

2. **Block Alternative DNS Protocols**  
   To preserve the effectiveness of the content filter, it is highly recommended to block alternative DNS protocols (such as DoT and DoH) using the :ref:`dpi_filter-section`.

3. **Avoid Conflicts with Threat Shield DNS**  
   Use FlashStart only if you are **not already using the Threat Shield DNS service**, as using both simultaneously may lead to conflicts.


Configuration
=============

FlashStart platform configuration
---------------------------------

Before configuring FlashStart on your firewall, you must first purchase and configure the **Pro** or **Pro Plus** service on the FlashStart platform.
Once the service has been purchased, you’ll need to configure the networks on the FlashStart portal.

During the configuration process, the system will guide you through the setup, follow the prompts and select the following options:

Connect the router of your network → I have a dynamic IP → Nethesis Dynamic DNS → NethSecurity → Choose PRO or PRO PLUS.

.. note::
  Starting from July 2nd, 2025, the FlashStart platform requires you to create a new username and password during this setup step.
  Please note that it is no longer possible to use the email-based login previously associated with your account.  
  Once the new credentials are created, they must be used for authentication on the firewall side.

Networks previously configured using the email-based login will continue to function normally as long as they are not removed.
If a network is removed, the system will require a new username and password pair, and the corresponding credentials must also be updated on the NethSecurity side.

NethSecurity configuration
--------------------------

* ``Status`` : You can enable or disable the DNS filter by using the ``Status`` toggle switch
* ``Service type`` : Select the type of service you have purchased: **Pro** or **Pro Plus**
* ``Username`` :  Enter the same username used for your FlashStart account
* ``Password`` :  Enter the same password used for your FlashStart account 
* ``Zones to Filter`` :  Select the network zones you want to protect with DNS filtering. Only the selected zones will be affected by the FlashStart DNS filter.
* ``Bypass Source IPs or Networks`` : You can specify a list of IP addresses or networks (CIDR format) that should bypass DNS filtering. Traffic from these sources will not be subject to any filtering rules.
* ``Custom DNS Servers`` : If you need to define **custom DNS resolvers for specific domains**, you can configure them here. The syntax is the same used in the DNS section of NethSecurity.For reference, see the official documentation:`Domain-specific DNS servers <https://docs.nethsecurity.org/en/latest/dns_dhcp.html#domain-specific-dns-servers>`_

Once the FlashStart service has been configured on the firewall, all further configuration and management must be performed exclusively via the FlashStart web portal. No additional changes are required on the firewall itself.

DNS Server Configuration
------------------------

The DNS servers used by FlashStart are automatically configured by NethSecurity when the service is enabled.
It's possible to customize a few options:

- **Query logging**: You can enable query logging by running the following command:

  .. code-block::

     uci set flashstart.global.logqueries='1'
     uci commit flashstart
     reload_config

  This will log DNS queries to the firewall's system log, which can be useful for tracking and troubleshooting purposes.

- **DNS Rebind protection**

DNS Rebind protection is disabled by default for FlashStart clients in order to prevent unwanted blocks when internal DNS servers resolve private or internal domains that could otherwise be flagged by the firewall’s DNS Rebind protection mechanism.
If required, this protection can be manually enabled using the following configuration:

.. code-block::

     uci set flashstart.global.rebind_protection='1'
     uci commit flashstart
     reload_config


Presence of an Active Directory (AD) Controller
===============================================

If an AD controller is present, user-based profiling can be enabled. To do this, it is necessary to first install the specific FlashStart connector (please refer to the official FlashStart `documentation <https://cloud.flashstart.com/customerarea/support/docs>`_ for installation instructions), **this is currently available only for Microsoft Windows Server**.

DNS Management in the Network
-----------------------------
All clients on the network must route their DNS requests through NethSecurity instead of directly querying the AD controller, this prevents the clients from inheriting the AD controller’s profiling policy.

Configuration Details
^^^^^^^^^^^^^^^^^^^^^

* The AD controller uses an external DNS resolver.
* In the FlashStart DNS UI on NethSecurity, add the local domain of the AD controller for resolution, specifying the IP address of the AD controller for resolving these local names (e.g., `/ad.mydomain.local/192.168.55.1`).
* Configure clients to use either an external DNS server or the firewall itself as their DNS resolver.

Important Notes
^^^^^^^^^^^^^^^

It is necessary to prevent clients from querying the AD controller for non-local domain resolution, this can be achieved by:

* Blocking inbound UDP/TCP port 53 on the AD controller
* disabling DNS recursion for clients on the AD server, so that the server only responds to queries for its local zone.


FlashStart Pro vs FlashStart Pro Plus
=====================================

FlashStart provides cloud-based content filtering solutions integrated with NethSecurity. The two main service types, FlashStart Pro and FlashStart Pro Plus, offer different capabilities in terms of filtering granularity and profile management. Below is a brief comparison highlighting the key differences.

FlashStart Pro
--------------

FlashStart Pro enables content filtering using a single filter profile, applied across the network or to selected network zones.

- **Single profile filtering:**  
  All filtered IPs follow the same rules and category blocks defined on the FlashStart platform.

- **Zone-based application:**  
  Administrators can choose which network zones are subject to filtering.

- **IP-based profile management:**  
  FlashStart Pro on NethSecurity implicitly supports three traffic profiles, based on IP:

  - Filtered IPs : Subject to the single filter profile defined in FlashStart.
  - Unfiltered IPs : No filtering applied (see Exclusions below)
  - Blocked IPs : Access denied at the firewall level using firewall rules.

- **Exclusions:**  
  Exceptions can be configured using IP addresses or CIDR blocks.

FlashStart Pro Plus (Beta)
--------------------------

FlashStart Pro Plus extends functionality with support for multiple independent filtering profiles, allowing greater flexibility and user-level policy enforcement.


- **Multi-profile support:**  
  Up to 5 independent profiles can be defined, each with its own filtering configuration.

- **Independent profile configuration:**  
  Each profile can be customized individually (categories, safe search, YouTube restrictions, etc.).

- **Filtering criteria options:**  
  Profiles can be assigned using:

  - **Firewall objects (host sets):**  
    From the FlashStart configuration panel, administrators can associate specific host sets (defined in the firewall) with a profile.

  - **Active Directory users:**  
    If the FlashStart AD connector is installed, profiles can be assigned to AD users directly, eliminating the need to rely on IP addresses.

- **Combined assignment (objects + users):**  
  It is possible to use both methods in parallel.In case of conflicts, firewall object assignments take precedence over user-based assignments.

.. note::

  Although no known bugs have been reported at this time, the Pro Plus feature is currently released as a **Beta**. We recommend testing it in a non-critical environment before deploying it in production.

Common Features (Pro and Pro Plus)
----------------------------------

- **Same filtering capabilities:**

  - URL category-based filtering (blacklists)
  - Search engine filtering (Safe Search)
  - YouTube restricted mode
  - Threat protection

- **Cloud-managed configuration:**  
  All filtering rules and profiles are managed through the FlashStart web interface.

.. list-table::
   :widths: 30 35 35
   :header-rows: 1

   * - Feature
     - FlashStart Pro
     - FlashStart Pro Plus
   * - Zone-based filtering
     - Yes
     - Yes
   * - Profile exclusions (IP/CIDR)
     - Yes
     - Yes
   * - Number of filter profiles
     - 1
     - Up to 5
   * - IP Blocking
     - No
     - Yes
   * - App blocker
     - No
     - Yes
   * - Remote Agent for Win/Mac/Android/iOS
     - No
     - Yes
   * - Filtering per AD user
     - No
     - Yes
   * - Firewall object integration
     - No
     - Yes
   * - Conflict handling (user vs object)
     - N/A
     - Firewall object takes priority


Troubleshooting
===============


1. My public IP is not listed in the FlashStart networks
--------------------------------------------------------

If your public IP address does not appear in the FlashStart dashboard under registered networks, please allow up to 15 minutes. This delay may be caused by protection mechanisms on the FlashStart platform designed to mitigate repeated or automated registration attempts.

2. DNS filtering does not seem to be working
--------------------------------------------

If the filtering is not effective immediately after configuration:

- Be aware that FlashStart may require a few minutes to propagate the applied settings across its infrastructure.
- Also consider the impact of browser DNS cache, which may delay visible effects.

To verify whether filtering is actually in place and working, you can perform a manual DNS query **in your local client** using the `dig` command:

.. code-block:: bash

   dig @8.8.8.8 www.mydomain.com

Replace `www.mydomain.com` with the actual domain you're testing.

If the domain is still being resolved and should be blocked, double-check the active profile and block settings on the FlashStart dashboard.

.. note::

   This ``dig`` test must always be performed from the **client** and **never from the firewall**.  
   The firewall is **never** filtered by FlashStart's DNS servers, as this could potentially conflict with some of the services it provides.

3. Testing DNS Filtering with dig directly from the firewall
------------------------------------------------------------

If you want to perform tests using ``dig`` directly from the firewall, you can do so by specifying the port. Each port corresponds to a different filtering profile.

FlashStart Pro
^^^^^^^^^^^^^^

If you are using **FlashStart Pro**, the port is always **5300**. You can check if the request is correctly filtered with the following command:

.. code-block:: bash

   dig @127.0.0.1 -p 5300 mydomain.com

FlashStart Pro Plus
^^^^^^^^^^^^^^^^^^^

If you are using **FlashStart Pro Plus**, each profile is associated with a different port. You can send a request per profile to verify that the filtering behaves as expected.

First, you need to identify the correct port for each profile. Use the following command to view the configuration:

.. code-block:: bash

   uci show dhcp

You will see multiple entries like this:

.. code-block:: bash

   dhcp.ns_56e6071cbd=dnsmasq
   dhcp.ns_56e6071cbd.ns_flashstart='1'
   dhcp.ns_56e6071cbd.ns_tag='automated'
   dhcp.ns_56e6071cbd.ns_flashstart_profile='Guests'
   dhcp.ns_56e6071cbd.ns_flashstart_dns_code='143'
   dhcp.ns_56e6071cbd.port='5301'
   dhcp.ns_56e6071cbd.noresolv='1'
   dhcp.ns_56e6071cbd.max_ttl='60'
   dhcp.ns_56e6071cbd.max_cache_ttl='60'
   dhcp.ns_56e6071cbd.server='185.236.104.124' '185.236.105.125'

In this example, the profile **"Guests"** is associated with port **5301**, so you would run:

.. code-block:: bash

   dig @127.0.0.1 -p 5301 mydomain.com


