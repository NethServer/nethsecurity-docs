.. _intrusion_prevention_system-section:

===================================
Intrusion Prevention System (Snort)
===================================

Snort 3 is an open-source network Intrusion Prevention System that is capable of performing real-time traffic analysis
and packet logging on IP networks. It can perform protocol analysis, content searching/matching, and can be used to
detect a variety of attacks and probes, such as buffer overflows, stealth port scans, CGI attacks, SMB probes, OS
fingerprinting attempts, and much more.

Enable IPS
==========

IPS is disabled by default, to enable it, navigate to the ``IPS`` page under the ``Security`` section.
The interface will prompt that the service is disabled and will provide a quick link to browse directly to the
``Settings`` tab.

Once toggled the :guilabel:`Status` switch, you'll need to pick a policy for your rules. Rules are grouped into
policies, each policy is a set of rules that are optimized for a specific use case. The policies are:

- **connectivity**: prioritizes performance over security, minimizing false positives and ensuring high device
  performance while detecting common threats.
- **balanced**: recommended for initial deployments, balancing security and performance.
  and relatively high performance rate with evaluation and testing tools.
- **security**: for high-security environments with lower bandwidth and higher false positive tolerance.
  It provides the maximum protection while minimizing the risk of bringing the network down.

Once the policy is selected, click on the :guilabel:`Save` button to save the changes.

.. _oinkcode-section:

Access to Snort rules via Oinkcode
==================================

NethSecurity supports the use of a Snort subscription to obtain ``Registered`` and ``Subscriber`` rules through the Oinkcode.
The `Oinkcode` is a unique code assigned to registered users on Snort.org, this code is required to authenticate the download of Snort rules.


Available rule categories
-------------------------

- **Community Rules (Free rules)**:
  Available to all registered users without restrictions.
  Maintained by the Snort community.
  Provide basic protection but receive less frequent updates compared to official rules.
  No Oinkcode is required to access these rules.

- **Registered Rules (Free rules with delay)**:
  Official rules updated by the Snort team.
  Available for free to registered users, but with a 30-day delay compared to the latest version.
  Oinkcode is required to access these rules.
``

- **Subscriber Rules (Paid rules, real-time updates)**
  Immediate access to the most up-to-date rules without any delay.
  Available only to users with a Snort Subscriber Rule Set subscription.
  Oinkcode is required to access these rules.

How to obtain and use the Oinkcode
----------------------------------

- Register on Snort.org
- Retrieve your Oinkcode from the account profile section
- On NethSecurity, paste your personal code into the `Oinkcode` field. You can verify if the code is valid by clicking on the :guilabel:`Test code` button


Today event list
================

The IPS automatically checks traffic inside the network and generates alerts or blocks traffic based on the ruleset.
A browsable list can be found under the ``Today event list`` tab.
While browsing the list, you can see the rules that triggered the alert, the source and destination IP addresses, the
protocol and the action taken by the system.

This list can be filtered using the filter box at the top of the page. Additionally, for every record shown, it's
possible to jump right to the rule documentation by clicking on the rule ID.

By clicking on the menu icon on the right side of the record, it's possible to open a pre-filled form to suppress or
disable the rule that generated the alert.

Source and destination bypass
=============================

All traffic that goes through the firewall is analyzed by the IPS.
To bypass the IPS for specific source or destination IP addresses, the system supports bypass rules both for IPv4 and
IPv6 addresses.

To do so, browse to the `Filter bypass` tab and press the :guilabel:`Add bypass` button. A form will be provided to
add the bypass rule based of the source or destination IP address with the following fields:

- ``Address type``: if the ip provided is IPv4 or IPv6
- ``IP address``: the IP address to bypass
- ``Direction``: if the bypass is for the source or destination IP address
- ``Description``: a description of the bypass rule, it is optional and can be omitted

Disable rules
=============

In some environments, rules can be too restrictive or generate too many false positives. To avoid this, it is possible
to disable some rules. A disabled rule is a rule that is not included in the Snort ruleset.

Browse to the `Disabled Rules` tab and press the :guilabel:`Disable rule` button. The system will prompt for the
following fields:

- ``GID``: the rule GID, it is a number and usually is always `1`
- ``SID``: the rule SID, it is a number
- ``Description``: a description of the disabled rule, it is optional and can be omitted

Suppressed alerts
=================

A suppression rule is a rule that is ignored by Snort for a specific IP address or CIDR.
The rule is still evaluated for all other IP addresses.

To add a suppression rule, browse to the `Suppressed alerts` tab and press the :guilabel:`Suppress alert` button.
Fill the fields with the following information:

- ``GID``: the rule GID, it is a number and usually is always `1`
- ``SID``: the rule SID, it is a number
- ``Direction``: if the suppression is for the source or destination IP address
- ``IP address``: the IP address to suppress the alert for, can be a CIDR range
- ``Description``: a description of the suppression rule, it is optional and can be omitted
