.. _netify_informatics-section:

===================
Netify Informatics
===================

`Netify Informatics <https://www.netify.ai/products/netify-informatics>`_ is a third-party cloud service that utilizes analytics and AI to convert local DPI metadata obtained from NethSecurity into high-level network intelligence and visibility. The solution provides insights into various aspects of network activity, including:

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


Before getting started
======================

Here is some fundamental information to better manage your installations on Netify Informatics.
You can granularly manage different customers, different locations of the same customer, and even different firewalls within the same location.The platform is organized with these elements.

Organization
------------
An organization is essentially a customer where we have at least one NethSecurity firewall, multiple organizations are supported.

Site
-----
The same organization (customer) might have an office in Rome, Florence, and Paris. A site is defined for each physical location to isolate the mix of data, multiple sites are supported.

Agent
-----
The agent represents your customer's NethSecurity unit. Netify supports multiple agents per site. If you have a simple network, one agent will likely see all traffic flows on a site's network.

How to Connect your NethSecurity to Netify Informatics 
-------------------------------------------------------
Two steps are required to use the service: 

* Enable metadata sending from NethSecurity
* Provision an agent on Netify Informatics.

.. warning:: It's mandatory to configure data sending on NethSecurity **first** and then provision the agent on the platform.

Enabling metadata sending
=========================

Each NethSecurity is associated with a unique code. To find the code for your NethSecurity, access the command line and enter the command:
                      
``/usr/libexec/rpcd/ns.netifyd call status | jq .uuid -r``
                      
The system will return a result similar to this:

``B3-GV-WQ-SD``

Enter the code into the Netify Informatics web console.

To enable data sending:

``/usr/libexec/rpcd/ns.netifyd call enable``

To disable data sending:

``/usr/libexec/rpcd/ns.netifyd call disable`` 


Registration and provisioning
=============================

Visit the following page to create your account :

`Netify Registration <https://portal.netify.ai/register>`_


Agent provisioning
------------------

Once you have a registered account, click on the “Provision Agent Wizard” button. This will start a process where you will need to create the organization (the customer) and enable the agent using the code prevoiusly obtained on NethSecurity 8.

From this moment, Netify Informatics will start showing the data. You can then connect other firewalls of the same customer (same organization, same site or a different one) or create a new organization for a different customer.


Pricing
------------------
The service can be tried for free for 7 days. After this period, you can choose the plan that best fits your needs. See: `Netify Informatics Pricing <https://www.netify.ai/products/netify-informatics/pricing>`_


Deployment Manager
==================


The Deployment section allows you to manage Agents, Sites, and Organizations. 
While the management of Agents and Sites is relatively straightforward, the ``Organization Access`` section enables you to add additional members to your organization. This feature allows others to access the Netify panel and view all relevant data.

There are three available profiles:

* Administrator
* Manager
* Viewer

The ``Administrator`` profile, typically reserved for colleagues within your company, grants the highest level of permissions, allowing them to view, create, and modify configurations within Netify Informatics.

The ``Manager`` profile is dedicated to individuals who belong to the same organization (the customer company). It grants them permission to view all sections inside Netify Informatics, see the deployment dashboard and edit the Identity manager section, but not to add other organizations or provision new agents.

The ``Viewer`` profile, likely the most commonly used, is for someone (e.g., an IT technician from your customer’s organization) who can view all data within their organization but does not have the ability to modify any Netify configurations.

To invite someone, simply click on ``Manage Organization``, enter their email address, and choose the desired profile. The person will receive an invite from Netify by email and will be able to create their own account.

 .. note:: The profile type can be changed at any time by an administrator, allowing you to switch a person from Manager to Viewer, for example.



Regulatory Compliance
=====================

All informations about regulatory complince are available here: 
`Netify Informatics Regulatory Compliance <https://www.netify.ai/products/netify-informatics/regulatory-compliance>`_

General FAQ
===========
Netify FAQ available here:  `Netify Informatics FAQ <https://www.netify.ai/resources/faq>`_
