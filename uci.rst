.. _uci:

=====================================
UCI (Unified Configuration Interface)
=====================================

UCI (Unified Configuration Interface) is a centralized configuration management system used in NethSecurity. It provides a unified approach to system configuration through a command-line interface and standardized configuration files.

Key Characteristics
===================

- **Centralized Configuration**: All system configurations are stored in a single location (``/etc/config/``)
- **Database-driven**: Configurations are stored in structured database files
- **No Built-in Validation**: UCI executes commands without safety checks - requires system knowledge
- **Three-phase Workflow**: Modify → Commit → Restart/Reload
- **Multi-event Capable**: User interfaces can trigger multiple configuration events simultaneously

Configuration Storage
======================

All UCI configurations are stored as database files in ``/etc/config/``. Each file represents a different system component or service.

Configuration Files Structure
------------------------------

::

    /etc/config/
    ├── acme          # SSL certificate management
    ├── adblock       # Advertisement blocking
    ├── banip         # IP banning service
    ├── chilli        # Captive portal
    ├── dedalo        # Network access control
    ├── dhcp          # DHCP server configuration
    ├── dnsdist       # DNS load balancer
    ├── don           # Deep packet inspection
    ├── dpi           # Deep packet inspection
    ├── dropbear      # SSH server
    ├── firewall      # Firewall rules and zones
    ├── flashstart    # Web filtering
    ├── fstab         # Filesystem table
    ├── ipsec         # IPsec VPN
    ├── luci          # Web interface
    ├── mwan3         # Multi-WAN configuration
    ├── netifyd       # Network interface daemon
    ├── network       # Network interfaces and routing
    ├── nginx         # Web server
    ├── ns-api        # NethSec API
    ├── ns-plug       # NethSec plugins
    ├── ns-ui         # NethSec user interface
    ├── objects       # Object definitions
    ├── openssl       # SSL/TLS configuration
    ├── openvpn       # OpenVPN configuration
    ├── phonehome     # Remote management
    ├── qosify        # Quality of Service
    ├── rpcd          # RPC daemon
    ├── rsyslog       # System logging
    ├── socat         # Socket utilities
    ├── system        # System-wide settings
    ├── templates     # Configuration templates
    ├── ucitrack      # UCI change tracking
    ├── uhttpd        # HTTP server
    └── users         # User management

Viewing Configuration
=====================

Show all configuration for a specific service
----------------------------------------------

.. code-block:: bash

    uci show <service>

**Example:**

.. code-block:: bash

    uci show network

**Output:**

.. code-block:: text

    network.loopback=interface
    network.loopback.device='lo'
    network.loopback.proto='static'
    network.loopback.ipaddr='127.0.0.1'
    network.loopback.netmask='255.0.0.0'
    network.@device[0]=device
    network.@device[0].name='br-lan'
    network.@device[0].type='bridge'
    network.@device[0].ports='eth0'
    network.lan=interface
    network.lan.device='br-lan'
    network.lan.proto='static'
    network.lan.ipaddr='192.168.100.101'
    network.lan.netmask='255.255.255.0'
    network.wan=interface
    network.wan.device='eth1'
    network.wan.proto='dhcp'

Show specific configuration option
----------------------------------

.. code-block:: bash

    uci show <service>.<section>.<option>

**Example:**

.. code-block:: bash

    uci show network.lan.ipaddr

Complete Configuration Workflow
================================

Standard Three-Phase Process
-----------------------------

1. **MODIFY** - Make configuration changes
2. **COMMIT** - Save changes to the configuration database
3. **RESTART/RELOAD** - Apply changes to the running system

Practical Example: Changing LAN IP Address
-------------------------------------------

.. code-block:: bash

    # Step 1: Modify the configuration
    uci set network.lan.ipaddr='192.168.100.151'

    # Step 2: Commit the changes
    uci commit network

    # Step 3: Restart the network service
    /etc/init.d/network restart

SET - Modifying Configuration
=============================

The ``uci set`` command is used to modify configuration values. Changes are stored temporarily and must be committed to become persistent.

Set a configuration value
-------------------------

.. code-block:: bash

    uci set <service>.<section>.<option>='<value>'

**Examples:**

.. code-block:: bash

    # Change IP address
    uci set network.lan.ipaddr='192.168.100.151'
    
    # Change netmask
    uci set network.lan.netmask='255.255.255.0'
    
    # Change DHCP protocol to static
    uci set network.wan.proto='static'

Add a new section
-----------------

.. code-block:: bash

    uci add <service> <section_type>

Delete operations
-----------------

.. code-block:: bash

    # Delete a configuration option
    uci delete <service>.<section>.<option>
    
    # Delete an entire section
    uci delete <service>.<section>

COMMIT - Saving Changes
=======================

Changes made with ``uci set`` are not immediately applied to the system. They must be committed first to make them persistent.

Commit specific service
-----------------------

.. code-block:: bash

    uci commit <service>

**Example:**

.. code-block:: bash

    uci commit network

Commit all pending changes
--------------------------

.. code-block:: bash

    uci commit

Check pending changes
---------------------

Before committing, you can review what changes will be applied:

.. code-block:: bash

    uci changes

Revert uncommitted changes
--------------------------

If you want to discard uncommitted changes:

.. code-block:: bash

    uci revert <service>

RESTART - Applying Changes
==========================

After committing, services need to be restarted or reloaded to apply the new configuration to the running system.

Restart a service
-----------------

.. code-block:: bash

    /etc/init.d/<service> restart

**Examples:**

.. code-block:: bash

    # Restart network service
    /etc/init.d/network restart
    
    # Restart firewall service
    /etc/init.d/firewall restart
    
    # Restart DHCP service
    /etc/init.d/dnsmasq restart

Reload a service (if supported)
-------------------------------

Some services support reload instead of restart, which is faster and less disruptive:

.. code-block:: bash

    /etc/init.d/<service> reload

Configuration File Format
==========================

UCI configuration files use a structured format with sections and options:

.. code-block:: text

    config <section_type> '<section_name>'
        option <option_name> '<value>'
        list <list_name> '<value1>'
        list <list_name> '<value2>'

Example: Network Configuration File
-----------------------------------

Network Configuration File (``/etc/config/network``):

.. code-block:: text

    config interface 'loopback'
        option device 'lo'
        option proto 'static'
        option ipaddr '127.0.0.1'
        option netmask '255.0.0.0'

    config device
        option name 'br-lan'
        option type 'bridge'
        list ports 'eth0'

    config interface 'lan'
        option device 'br-lan'
        option proto 'static'
        option ipaddr '192.168.100.101'
        option netmask '255.255.255.0'

    config interface 'wan'
        option device 'eth1'
        option proto 'dhcp'

Best Practices
==============

Safety Considerations
---------------------

1. **Always backup configurations** before making changes
2. **Test changes incrementally** rather than making multiple changes at once
3. **Understand service dependencies** before restarting services
4. **Use** ``uci changes`` **to review** pending modifications
5. **Have console access** available when making network changes

Common Pitfalls
---------------

- **Forgetting to commit**: Changes are not persistent until committed
- **Not restarting services**: Committed changes may not be active until service restart
- **Breaking network connectivity**: Always ensure alternative access methods
- **Syntax errors**: Invalid UCI syntax can cause configuration corruption

Troubleshooting
===============

Common Commands for Debugging
------------------------------

View pending changes
~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

    uci changes

Revert to last committed state
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

    uci revert <service>

Check UCI syntax
~~~~~~~~~~~~~~~~

.. code-block:: bash

    uci show | head -1

.. note::
   Always ensure you have alternative access to the system when making critical configuration changes, especially network-related modifications.

.. warning::
   UCI commands execute without validation. Incorrect configurations can render the system inaccessible.
