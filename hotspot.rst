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

A hotspot manager section running on a cloud server, a dedicated WebUI allows you to perform task as:

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
   If you're interested on the hotspot manager section please refer to https://nethesis.github.io/icaro/ if you want to create your own instance of icaro or contact info@nethesis.it if you want to use SaaS provided by Nethesis and located at https://my.nethspot.com.

Status
------

This section shows all users connected to the system, distinguishing those who have authenticated from those who have simply received an IP address, it provides further information such as MAC address, traffic carried out and so on.
More detailed information is available in the centralized manager.

Settings
--------
This section allows you to associate a unit with a specific hotspot instance created in the hotspot manager.

.. note:: Before associating the unit you must create an instance in the hotspot manager.

Multiple geographically separated units (NethSecurity) can be connected to the same centralized hotspot instance, creating a conference in which all users access the same captive portal and in which they can reuse the same login in all connected units.

Login to your hotspot manager
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This operation is mandatory to associate your unit with the created hotspot instance, use the same user and password of your hotspot manager, the ``Hostname`` field at default point to my.nethesis.com.

Once you have logged in you can continue to fill in the following fields.

``Parent Hotspot`` : choose which instance you want to connect your unit to

``Unit name`` : your NethSecurity's name

``Unit description`` : insert a brief description so that you can identify your unit more easily

``Network address`` : clients will receive an IP address belonging to this network (use CIDR format)

``DHCP range start/end`` : by default the system use the whole network range, you can specify a narrower one acting on start and end IP addresses.






