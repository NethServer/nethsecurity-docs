.. _netify_informatics-section:

===================
Netify Informatics
===================

`Netify Informatics <https://www.netify.ai/products/netify-informatics>`_ is a third-party cloud service that utilizes analytics and AI to convert
local DPI metadata obtained from NethSecurity into high-level network intelligence.
The solution provides insights into various aspects of network activity, including:

* `Device Discovery <https://www.netify.ai/products/netify-informatics/device-discovery>`_
* `Bandwidth Monitoring <https://www.netify.ai/products/netify-informatics/bandwidth-monitoring>`_
* `Risk and Reputation Analysis <https://www.netify.ai/products/netify-informatics/risk-and-reputation>`_
* `Regulatory Compliance <https://www.netify.ai/products/netify-informatics/regulatory-compliance>`_
* Geolocation
* Audit and Forensics

The service receives data from netifyd, the NethSecurity DPI engine which is enabled by default on the firewall.

You can try the service for free for 7 days. 
After this period, you can choose the plan that best fits your needs.

See `Netify Informatics Pricing <https://www.netify.ai/products/netify-informatics/pricing>`_ and `Netify Informatics FAQ <https://www.netify.ai/resources/faq>`_ for more information.

Before getting started
======================

Make sure to create an account on the Netify Informatics website, you can try the service for free for 7 days.
Register here: `Netify Registration <https://portal.netify.ai/register>`_

You can granularly manage different customers, different locations of the same customer, and even different firewalls within the same location.
The platform is organized with these elements.

* **Organization** : an organization is essentially a customer where we have at least one NethSecurity firewall, multiple organizations are supported.
* **Site**: the same organization (customer) might have an office in Rome, Florence, and Paris. A site is defined for each physical location to isolate
  the data, multiple sites are supported.
* **Agent**: the agent represents your customer's NethSecurity unit. Netify supports multiple agents per site. If you have a simple network, one agent will
  likely see all traffic flows on a site's network.


Connect NethSecurity to Netify Informatics 
==========================================

Two steps are required to use the service: 

1. Enable metadata sending from NethSecurity
2. Provision an agent on Netify Informatics.

.. warning:: It's mandatory to configure data sending on NethSecurity **first** and then provision the agent on the platform.

1. Enable metadata sending
--------------------------

Access the ``Netify Informatics`` page under the ``Monitoring`` section in the NethSecurity web interface.

Enable the ``Send metadata to Netify Informatics`` option and click on ``Save``.

Each NethSecurity is associated with a unique Agent UUID, something like this `B3-GV-WQ-SD`.
The code will be visible in the same page after enabling the send metadata option.
                      
2. Provision the agent
-----------------------

Once you have a registered account and enabled the metadata sending on NethSecurity, you can provision the agent on the Netify Informatics platform:

1. Copy the code obtained in the previous step and login to the Netify Informatics website.
2. Access the ``Provision Agent Wizard`` inside ``Deployment`` section.
3. Follow the instructions to create the organization (the customer) and paste the Agent UUID in the appropriate field to
   enable the agent using the code obtained on NethSecurity.

From this moment, Netify Informatics will start showing the data. You can then connect other firewalls of the same customer
(same organization, same site or a different one) or create a new organization for a different customer.

Deployment Manager
==================

The ``Deployment`` section inside Netify Informatics allows you to manage Agents, Sites, and Organizations. 
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
