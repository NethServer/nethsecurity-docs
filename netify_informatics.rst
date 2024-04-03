.. _netify_informatics-section:

===================
Netify Informatics
===================

Netify Informatics is a third-party cloud service that utilizes analytics and AI to convert local DPI metadata obtained from NethSecurity into high-level network intelligence and visibility. The solution provides insights into various aspects of network activity, including:

*   Device Discovery
*   Geolocation
*   Bandwidth Analysis
*   Risk and Reputation Analysis
*   Audit and Forensics
*   Regulatory Compliance

Here are some examples of what Netify Informatics can do:


`Bandwidth Monitoring <https://www.netify.ai/products/netify-informatics/bandwidth-monitoring>`_

`Device Discovery <https://www.netify.ai/products/netify-informatics/device-discovery>`_

`Risk and Reputation Analysis <https://www.netify.ai/products/netify-informatics/risk-and-reputation>`_

How to try the Service
======================
                               
To use Netify Informatics, follow these steps:

*   Register on the Netify website
*   Enable the sending of metadata from NethSecurity

Registration
------------
Visit the following page to register:

`Netify Registration <https://portal.netify.ai/register>`_

The service can be tried for free for 7 days. After this period, you can choose the plan that best fits your needs and availability here:

`Netify Informatics Pricing <https://www.netify.ai/products/netify-informatics/pricing>`_

In the case of NethSecurity, there is always only one agent (the firewall itself).

Enabling metadata sending
-------------------------

Each NethSecurity is associated with a unique code. To find the code for your NethSecurity, access the command line and enter the command:
                      
``/usr/libexec/rpcd/ns.netifyd call status | jq .uuid -r``
                      
The system will return a result similar to this:

``B3-GV-WQ-SD``

Enter the code into the Netify Informatics web console.

To enable data sending:

``/usr/libexec/rpcd/ns.netifyd call enable``

To disable data sending:

``/usr/libexec/rpcd/ns.netifyd call enable`` 


Regulatory Compliance Information
---------------------------------

`Netify Informatics Regulatory Compliance <https://www.netify.ai/products/netify-informatics/regulatory-compliance>`_

General FAQ
-----------

`Netify Informatics FAQ <https://www.netify.ai/resources/faq>`_
