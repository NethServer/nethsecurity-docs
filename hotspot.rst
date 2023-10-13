=======
HotSpot
=======

Hotspot main goal is to provide internet connectivity via wi-fi to casual users. Users are sent to a captive portal from which they can access the network by authenticating themselves via social login, sms, email or a voucher code. 
The hotspot service allows the regulation, accountability and pricing of Internet access in public places, like squares, hotels, stations and many others.

Main features
=============

* Network isolation between corporate and guests

* Customizable captive portal page 

* Many authentication modes supported (Social Login, SMS, Email or Voucher code)

* AutoLogin support 

* Hotspot manager with different accesses type (admin, customer, desk)

* Export of accounts and connections report

How it works?
=============
The implementation is based on 2 components:

A remote hotspot manager with a Web GUI running on a cloud server that allows you to:

* create a hotspot instance: usually each instance is referred to a specific location (e.g. Art Cafè, Ritz Hotel and so on)

* edit the captive portal page

* choose what type of login to use

* see session and users logged

a client part (dedalo) installed in NethServer physically connected to the Access Points network : it assigns IP addresses to the clients of the Wi-Fi Network and redirects them to the captive portal for authentication.

For more detailed information please refer to https://nethesis.github.io/icaro/docs/components/ .

