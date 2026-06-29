=======
Hotspot
=======

Hotspot main goal is to provide internet connectivity via wi-fi to casual users. Users are sent to a captive portal from which they can access the network by authenticating themselves via social login, sms, email or a voucher code. 
The hotspot service allows the regulation, accountability and pricing of Internet access in public places, like squares, hotels, stations and many others.

Main features
-------------

* Network isolation between corporate and guests

* Customizable captive portal page 

* Many authentication modes supported (Social Login, SMS, Email or Voucher code)

* AutoLogin support 

* Hotspot manager with different accesses type (admin, customer, desk)

* Export of accounts and connections report

How it works?
-------------

The implementation is based on 2 components:

A hotspot manager section running on a cloud server, a dedicated WebUI allows you to perform tasks as:

* create a hotspot instance: usually each instance is referred to a specific location (e.g. Art Cafè, Ritz Hotel and so on)

* edit the captive portal page

* choose what type of login to use

* see session and users logged

A client part running on NethSecurity (in nethspot terminology this client is called "unit") .

* It has to be physically connected to the Access Points network
* It assigns IP addresses to devices 
* It redirects devices to the captive portal

.. note::
   This manual only cover the client part.
   If you're interested on the hotspot manager section please refer to `Icaro project <https://nethesis.github.io/icaro>`_ if you want to create your own instance of Icaro or contact info@nethesis.it if you want to use SaaS provided by Nethesis and located at `my.nethspot.com <https://my.nethspot.com>`_.

Status
------

This section shows all users connected to the system, distinguishing those who have authenticated from those who have simply received an IP address, it provides further information such as MAC address, traffic carried out and so on.
More detailed informations are available in the hotspot manager.

Settings
--------
This section allows you to associate a unit with a specific hotspot instance created in the hotspot manager.

.. note:: Before associating the unit you must create an instance in the hotspot manager.

Multiple geographically separated units (NethSecurity) can be connected to the same centralized hotspot instance, creating a conference in which all users access the same captive portal and in which they can reuse the same login in all connected units.

Login to your hotspot manager
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This operation is mandatory to associate your unit with the created hotspot instance, use the same user and password of your hotspot manager, the ``Hostname`` field at default points to my.nethspot.com.

Once you have logged in you can continue to fill in the following fields.
This login access will remain active for 24 hours without any need to login again.

Register your unit
^^^^^^^^^^^^^^^^^^

``Parent Hotspot`` : choose which instance you want to connect your unit to

``Unit name`` : your NethSecurity's name

``Unit description`` : insert a brief description so that you can identify your unit more easily

``Network device`` : Specify a network device to be used by the hotspot service. The device can be either physical or a VLAN; however, it is crucial that the device is not already configured. 
The UI will display all currently available options and the hotspot will intercept all connections on this network interface, enforcing authentication for connected clients.

``Network address`` : clients will receive an IP address belonging to this network (use CIDR format).
The first address of the network class is always assigned to the NethSecurity hotspot interface.
The total number of clients that can be managed at the same time depends on the DHCP range you specified.
If you need to provide hotspot service for more than 253 devices, consider using a larger netmask (/23 or /22 or even larger) and be sure to have an appropriate range.

``DHCP limit`` : by default, the system uses the entire network range. However, you can define a more specific range by adjusting the maximum number of leases. The first address of DHCP range is automatically calculated

After having fulfilled the form click :guilabel:`Save` button to register the unit.

.. note:: Please verify in the hotspot manager-> Units that your unit has been properly registered. Each properly registered unit must show its MAC address in the hotspot manager. If the MAC address is missing please unregister the unit and try to do the registration again.

Unregister your unit
^^^^^^^^^^^^^^^^^^^^

If you made some error registering your unit (es. unit was associated to a wrong hotspot instance) or you want to remove this service, do the login in the hotspot section of NethSecurity and click to :guilabel:`Unregister unit`.
Your unit will be removed both from the NethSecurity and from the remote hotspot manager, the interface used in your Nethsecurity will be freed up and you can use it for other purposes.

Change DNS settings
^^^^^^^^^^^^^^^^^^^

By default the DNS server used by the hotspot is from OpenDNS, to change the DNS settings manual configuration is required.
Please follow the steps below from the terminal:

1. Edit the UCI configuration file with the following commands:

.. code-block:: bash

   uci set dedalo.config.dns1='<insert dns 1>'
   uci set dedalo.config.dns2='<insert dns 2>'

2. Save the changes with the following command:

.. code-block:: bash

   uci commit dedalo

3. Restart the dedalo service with:

.. code-block:: bash

   service dedalo restart

Restore default DNS settings
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To restore the default DNS settings, use the following commands:

.. code-block:: bash

   uci delete dedalo.config.dns1
   uci delete dedalo.config.dns2

Then repeat the steps 2 and 3 in the previous section to apply the changes.


Data retention for Hotspot service with NethSpot cloud portal
-------------------------------------------------------------

.. admonition:: NethSpot cloud portal users only

   This section applies only to NethSecurity firewalls with a valid subscription that are specifically using the NethSpot cloud portal, available at https://my.nethspot.com/.
   If the Hotspot service is used without the NethSpot cloud portal, the information in this section does not apply.

NethSpot stores hotspot-related data on cloud infrastructure located in a European data center in the Netherlands. The retained data includes connection logs, guest login data, voucher information, email-based access data, and SMS-based access data.

Connection logs
^^^^^^^^^^^^^^^

Connection logs are retained for **6 months**.

These logs include information related to guest sessions, such as:

* connection and disconnection date and time
* guest user
* guest device
* device MAC address
* NethSecurity unit MAC address

Connection logs are the first data to be deleted. When the retention period expires, the related guest sessions are deleted, including the ``device_mac`` of the guest device and the ``unit_mac`` of the connected NethSecurity appliance.

.. note:: No browsing logs for guest traffic

NethSpot does not collect or store the browsing activity of Hotspot users. Visited websites, URLs, DNS queries, or other navigation details are neither collected nor retained by the NethSpot cloud portal. The retained information is limited to session data required to identify the guest access session.

Guest login data and vouchers
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Guest login data is retained for the whole validity period of the guest account and for the following **24 months**. This additional retention period allows expired guest accounts to be reactivated, for example by extending their validity from the portal, without having to recreate them. 
It also helps preserve the association between the guest identity and the previously issued voucher, so that operators can review or extend an existing access record when needed.

This includes data related to platform users, vouchers, email login, and SMS login. When vouchers are used, all the information entered in the voucher is retained, including the data used to identify the guest.

For voucher-based access, retained data may include:

* guest first name and last name, if entered in the voucher
* guest email address, if entered in the voucher
* voucher data
* MAC address of the device used by the guest

The guest name is required when creating a voucher because it is used to identify the association between the guest and the voucher.

Voucher validity and account expiration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Vouchers can be created in two ways:

* with a fixed expiration date
* with a duration, counted from the first activation

Before the first use, a voucher is inactive. When the voucher is used for the first time, it is associated with the guest using it. From that moment, the voucher and the guest account refer to the same access identity.

Administrative hotspot users are not related to guest vouchers.

The additional 24-month retention period starts from the voucher expiration date.

For example, if a voucher expires on **June 30, 2026** and the guest starts using it before that date, the guest account associated with that voucher expires on **June 30, 2026**. The 24-month retention period starts from that date.

This retention period allows the account to be reactivated later, for example by extending its validity from the portal, without deleting the guest data too early.

Contract or service termination
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If the contract or service is terminated, guest data is deleted according to the same retention periods described above.


Marketing consent
^^^^^^^^^^^^^^^^^

NethSpot can be configured to ask WiFi guests for marketing consent through the captive portal.
The marketing consent is collected exclusively for the organization using the hotspot, it is **not used by Nethesis** for its own marketing purposes.

The guest panel clearly shows which guests have given marketing consent: this allows exporting only the contacts that have explicitly provided consent.

Nethesis does not use collected guest contacts for marketing activities and does not sell or transfer this data to third parties.
