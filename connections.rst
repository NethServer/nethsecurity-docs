.. _connections-section:

===========
Connections
===========

The connection tracking (Conntrack) is a network feature used in firewalls and routers to monitor and manage the state of active network connections. 
It tracks the state of each connection, such as new, established, related, or expired, and maintains this information in a connection tracking table. 
This allows for stateful packet inspection, where packets are inspected based on their connection context, enabling more precise and secure filtering rules. 
Conntrack also supports Network Address Translation (NAT) by tracking internal to external IP mappings and optimizes performance by quickly dropping packets from invalid or expired connections.

Connections can be filter by :

- :guilabel:`Protocol`
- :guilabel:`Status`
- :guilabel:`IP`
- :guilabel:`Port`

The list of connections is not refreshed in real time. To list new connections click the :guilabel:`Refresh page` button.

The administrator can delete a single connection or flush the whole connection tracking table by using :guilabel:`Delete all connections` button.

Good practices for terminating sessions
=======================================

When to terminate a connection:

- the connection has expired or been idle for an extended period
- there's evidence of malicious activity associated with the session
- the connection appears to be stale or hanging, preventing new connections
- termination is necessary for network troubleshooting or diagnostics

When to avoid terminating a session:

- the connection is active and appears to be functioning normally
- the connection is critical for ongoing application operations
- any issues with the connection seem to be temporary and may resolve on their own


In a MultiWAN setup, specific traffic such as VoIP trunks is routed and NATed through designated interfaces to distinct providers. 
When an interface or route becomes unavailable, it is essential to drop all connections using that interface and reroute subsequent traffic through the functioning connection, 
otherwise the trunk will not be able to register to the provider.

To resolve this issue, you can remove the specific conntrack entries associated with the old external address through the user interface.