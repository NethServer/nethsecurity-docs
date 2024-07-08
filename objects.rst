================
Firewall objects
================

Firewall objects are predefined sets of network addresses that can be used to streamline and simplify your firewall configuration.
These objects allow you to group related IP addresses, networks, or domain names into reusable units,
making it easier to create and maintain firewall rules, port forwards, and other network policies.

Advantages of using firewall objects include:

Improved organization and readability of your firewall configuration

- reduced chance of errors when entering IP addresses or networks manually
- easier maintenance - updating an object automatically updates all associated rules
- more efficient rule management, especially for complex networks

Firewall objects are particularly useful when you have multiple rules that reference the same set of addresses or when you frequently
need to modify groups of addresses. However, for simple configurations with only a few static rules, using objects may not be necessary
and could add unnecessary complexity.

The system provides several types of firewall objects:

- static Leases (DHCP Reservations): static IP assignments for specific devices
- DNS Records: domain names associated with specific IP addresses
- VPN Users: users with reserved IP addresses from OpenVPN Road Warrior
- Host Sets: groups of IP addresses, networks, or ranges
- Domain Sets: collections of domain names that resolve to IP addresses

Static Leases
=============

:ref:`Static leases <static_leases-section>`, also known as DHCP reservations, allow you to assign fixed IP addresses to specific devices on your network.
This feature combines the convenience of DHCP with the stability of static IP addressing.

Key benefits:

- ensures devices always receive the same IP address
- allows you to associate easy-to-remember hostnames with devices
- simplifies network management and troubleshooting

A static lease consists of:

- hostname: A recognizable name for the device
- IP address: The fixed IP you want to assign (must be within the DHCP range)
- MAC address: The unique hardware identifier of the device

DNS Records
===========

:ref:`DNS records <dns_records-section>` allow you to create local hostname-to-IP address mappings. 
These local records take precedence over external DNS queries, giving you more control over name resolution on your network.

A DNS record includes:

- hostname: The domain name you want to resolve locally
- IP address: The corresponding IP address for the hostname

Use cases for local DNS records:

- create shortcuts to internal resources (e.g., "intranet.mycompany.local")
- override external DNS for testing or security purposes
- set up custom domain names for local services

By utilizing static leases and local DNS records, you can create a more organized and easily manageable network environment. 
These features work seamlessly with other firewall objects like host sets, providing you with powerful tools for network administration.

For detailed instructions on how to create and manage static leases and DNS records, please refer to the :ref:`DHCP and DNS configuration chapters <dns_dhcp-section>`.

VPN Users
=========

:ref:`OpenVPN users <openvpn_roadwarrior-section>` with IP reservations can be used as firewall objects, enabling user-specific network access control.
This feature applies to both local and remote (LDAP) users configured for OpenVPN access.

Key points:

- each user can be assigned a specific OpenVPN IP address
- these users can be referenced in firewall rules as source or destination
- applies to both local and remote (LDAP) users
- allows for creation of user-specific access policies

Use cases:

- restrict OpenVPN users to specific network resources
- create user-based allow/deny lists
- implement time-based access policies for remote users
- monitor and control per-user bandwidth usage

Requirements:

- user has OpenVPN access enabled
- a specific IP address is reserved for the user

By using OpenVPN users as firewall objects, you can create a more secure network environment with access policies tied directly to user identities.

Host Sets
=========

Host sets are versatile firewall objects that allow you to group multiple IP addresses, networks, or ranges into a single, easily manageable unit. These sets can be used in various firewall rules, simplifying the process of controlling traffic for multiple destinations or sources.

Key features of host sets:

1. IP version support:

   - available for both IPv4 and IPv6 addresses
   - each host set is specific to one IP version

2. Flexible content, Host sets can include:

   - individual IP addresses
   - network ranges in CIDR notation
   - IP ranges
   - DHCP reservations
   - DNS record names
   - VPN users (for IPv4 only)

3. Easy management:

   - create, modify, or delete host sets without directly editing firewall rules
   - changes to a host set automatically apply to all rules using that set

4. Use cases:

   - group company servers for access control
   - create allow or deny lists for specific network segments
   - manage remote access for multiple VPN users

.. note::

  Host sets are fully supported in their expressive completeness (IP, CIDR, range, groupings) within firewall rules.
  Other pages might only support a reduced subset, for example, MultiWAN only supports single IP addresses and CIDR.
  In such cases, only compatible host sets will be displayed in the dropdowns when using the object inside the rule.
  
Manage Host Sets
----------------

Access the ``Objects`` page under the ``User and objects`` section from the left sidebar menu, then navigate to the ``Host sets`` tab.

The page will display a list of existing host sets, including their names, IP versions, and the number of records in each set.

Inside the list, you can also find hosts objects coming from other sections like:

- Static leases
- DNS records
- VPN users

These objects can be used in host sets to create more complex rules, but they cannot be edited directly from the host sets page.

When an object is not used in any host set nor in any firewall rule, it will be marked as ``unused`` in the list.

To see where an object is used, click on the ``Show usages`` link next to the object.

Please note that used objects cannot be deleted until they are removed from all host sets and firewall rules.

Add an Host Set
~~~~~~~~~~~~~~~

1. Access the ``Objects`` page under the ``User and objects`` section from the left sidebar menu.

   - Navigate to the ``Host sets`` tab
   - Click on :guilabel:`Add host set` button

2. Enter the Host Set name

   - In the ``Name`` field, enter a descriptive name for your host set
   - Use only letters and numbers; spaces and special characters are not allowed
   - Choose a name that clearly identifies the purpose or group of hosts

3. Select IP version

   - Under ``IP version``, choose between IPv4 and IPv6
   - Select IPv4 for standard internet protocol addresses
   - Choose IPv6 if you're using the newer, expanded address format

4. Add Records

   - In the ``Records`` field, you can add the hosts for this set
   - Click the dropdown menu to choose from predefined options, or enter a custom value
   - You can add the following types of records:

     - Individual IP addresses (e.g., ``192.168.1.10``)
     - CIDR notation for networks (e.g., ``10.10.0.0/24``)
     - IP ranges (e.g., ``10.10.1.1-10.10.1.5``)
     - Previously created objects

   - After entering each record, click :guilabel:`Add record` to include it in the set
   - Repeat this process to add multiple records as needed

5. Finalize the Host Set

   - Review all entered information for accuracy
   - If you need to remove a record, use the delete (trash can) icon next to it
   - Once you're satisfied with your host set configuration, click :guilabel:`Add host set` to create it
   - If you need to start over or cancel the process, click :guilabel:`Cancel`

Domain Sets
===========

Domain sets are firewall objects that allow you to group multiple domain names into a single, manageable unit. 
These sets are particularly useful for creating rules based on web addresses rather than IP addresses, which can change frequently for many websites.

Key features of domain sets:

1. DNS resolution:

   - domain names in the set are automatically resolved to IP addresses
   - resolution is periodically updated to ensure accuracy

2. IP version support:

   - can be configured for either IPv4 or IPv6
   - each domain set is specific to one IP version

3. Flexible content, domain sets can include:

   - fully qualified domain names (e.g., ``www.example.com``)
   - wildcard domains (e.g., ``example.com``, will match all subdomains)

4. Automatic timeout:

   - DNS records in the set are cached for a specified duration
   - an automatic refresh process updates the resolution periodically
   
5. Easy management:

   - create, modify, or delete domain sets without directly editing firewall rules
   - changes to a domain set automatically apply to all rules using that set

Use cases for domain sets:

- application control: manage access to cloud services or social media platforms
- security: create allow rules for trusted domains
- malware prevention: create deny rules for known malicious domains

Benefits of using domain sets:

- simplifies management of rules based on web addresses
- automatically handles IP address changes of websites
- reduces the need for manual updates to firewall rules
- provides a more intuitive way to control access to web-based services

When to use domain sets:

- when you need to control access to websites that may change IP addresses
- for implementing content filtering policies
- when managing access to cloud services or web applications
- for creating security policies based on domain reputation


Manage Domain Sets
------------------

Access the ``Objects`` page under the ``User and objects`` section from the left sidebar menu, then navigate to the ``Domain sets`` tab.

The page will display a list of existing domain sets, including their names, IP versions, and the number of domains in each set.

If a domain set is not used in any firewall rule, it will be marked as ``unused`` in the list.
To see where a domain set is used, click on the ``Show usages`` link next to the set.

Add a Domain Set
~~~~~~~~~~~~~~~~

1. Access the Add Domain Set Interface

   - Access the ``Objects`` page under the ``User and objects`` section from the left sidebar menu
   - Navigate to the ``Domain sets`` tab
   - Click on :guilabel:`Add somain set` button

2. Enter the Domain Set name:

   - In the ``Name`` field, enter a descriptive name for your domain set
   - Use only letters and numbers; spaces and special characters are not allowed
   - Choose a name that clearly identifies the purpose or group of domains

3. Select IP version: 

   - Under ``IP version``, choose between IPv4 and IPv6
   - Entered domains will be resolved to IPv4 or IPv6 accordingly to the selected IP version
   - If you need to create a domain set for both IP versions, you will need to create separate sets for each

4. Add domains:

   - In the ``Domains`` field, you can add the domains for this set
   - Enter domain names in the provided field
   - After entering each domain, click :guilabel:`Add domain`` to include it in the set
   - Repeat this process to add multiple domains as needed

5. Finalize the Domain Set:

   - Review all entered information for accuracy
   - If you need to remove a domain, use the delete (trash can) icon next to it
   - Once you're satisfied with your domain set configuration, click :guilabel:`Add domain set` to create it
   - If you need to start over or cancel the process, click :guilabel:`Cancel`