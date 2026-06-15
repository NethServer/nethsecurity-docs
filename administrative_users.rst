.. _administrative_users-section:

====================
Administrative users
====================

NethSecurity allows local users to be granted administrative access to the web interface. Administrative users should be personal accounts assigned to individual operators, so that actions can be attributed to a specific user in the logs.

This page explains how administrative users work, how MFA applies to administrators, how administrative actions are logged, and how to reconstruct administrator activity for troubleshooting and audit purposes.

Administrative account types
============================

NethSecurity uses the following administrative account types:

* ``root``: local system account. It should be reserved for emergency or recovery operations whenever possible.
* Administrative users: local users with the **Administrator user** option enabled. They can access the NethSecurity UI and perform administrative operations.
* Non-administrative users: local or remote users used for services such as VPN or authentication, without access to the NethSecurity UI.

.. note::

   Administrative access should be granted only to trusted operators.

Creating administrative users
-----------------------------

Administrative users are created from the local users database.

To create an administrative user:

1. Create a local user.
2. Set a password for the user.
3. Enable the **Administrator user** option.
4. Save the configuration.

For general information about local and remote user databases, see :ref:`users_databases-section`.

MFA for administrators
======================

Two-factor authentication can be enabled for administrative access to the NethSecurity UI.
MFA adds a second authentication factor in addition to the account password and is recommended for all administrative users.
Administrators should complete the OTP setup and store recovery codes in a safe place, they are required if the OTP device is lost.

Root and emergency access
=========================

The ``root`` account is the main local system account, it should be treated as an emergency or recovery account and should not be used for ordinary administrative activity when personal administrative users are available.
Use personal administrative accounts for daily operations, so that actions can be attributed to individual users in the logs.

Administrative activity logging
===============================

NethSecurity logs administrative activity performed through the web interface in ``/var/log/messages``.

Administrative logs can support troubleshooting, incident analysis, and audit reconstruction.

The following administrative events are logged:

* administrator login events;
* administrator logout events;
* UI/API authorization events;
* API path and method called by the web interface;
* request payload associated with the action, with sensitive values masked where applicable;
* configuration changes submitted through the UI;
* configuration commits;
* UI pages and functions accessed by the administrator.

These logs allow administrators to reconstruct which user accessed the firewall, when the access occurred, and which actions were performed through the web interface.

Where to find administrative logs
---------------------------------

Logs are written in ``/var/log/messages`` and rotated on a weekly base, they are visible from the UI in their dedicated section.

To see administrative UI events use the filter ``nethsecurity-api``.

For long-term retention and centralized audit, configure persistent log storage, remote syslog forwarding, Controller log forwarding, or Cloud Log Manager. For details, see :ref:`logs-section`.

Reconstructing administrator actions
------------------------------------

To reconstruct administrator activity, start from the login event and then review the following UI/API authorization and commit events for the same user.

A typical reconstruction workflow is:

1. Identify the administrator login event.
2. Check the username, timestamp, and source address when available.
3. Review the following ``authorization success`` entries for the same user.
4. Identify the API path and method called by the UI.
5. Review the request payload to understand the requested operation.
6. Check configuration commit entries to confirm which changes were saved.
7. Correlate the action with related system, firewall, VPN, or service logs.
8. Verify the logout event or session termination when available.

This can help answer questions such as:

* who logged in;
* when the administrator accessed the firewall;
* which UI pages or API functions were used;
* which configuration areas were changed;
* which values were submitted;
* whether a change was committed;
* whether the action was followed by service errors or security events.

Audit and compliance recommendations
------------------------------------

For audit-oriented deployments:

* create a personal administrative account for each operator;
* avoid shared administrative accounts;
* enable MFA for all administrative users;
* reserve ``root`` for emergency or recovery operations whenever possible;
* use strong passwords and protect recovery codes;
* configure persistent log storage or remote log forwarding;
* forward logs to a remote syslog server, SIEM, Controller, or Cloud Log Manager;
* verify that log forwarding is working correctly;
* ensure that date, time, and timezone are correct, preferably using NTP;
* define log retention according to the organization security policy;
* protect remote logs from unauthorized access or deletion;
* periodically review administrative access and configuration change logs.

NethSecurity logs can support audit reconstruction and incident analysis. 
Organizational processes such as change approval, periodic review, incident classification, and evidence preservation remain the responsibility of the organization operating the firewall.

Current limitations
-------------------

Administrative activity logs are technical logs intended to support troubleshooting and audit reconstruction.

Administrators should be aware of the following limitations:

* NethSecurity does not currently provide a full local RBAC model for web administrators;
* a dedicated local read-only administrator role is not currently available;
* administrative users should therefore be assigned only to trusted operators;
* some log entries may require correlation with configuration commit logs or related service logs;
* an authorization event means that the API request was allowed, but related logs should be checked to confirm the final effect of the operation;
* not every log entry necessarily contains the same fields;
* local in-memory logs may be lost after reboot or rotation unless persistent storage or remote forwarding is configured.

For long-term audit requirements, use remote log forwarding or Cloud Log Manager in addition to local logs.
