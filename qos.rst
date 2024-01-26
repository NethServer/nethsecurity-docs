=========================
Quality of Service (QoS)
=========================

NethSecurity QoS provides Active Queue Management (AQM) and Flow Queuing (FQ) capabilities to help ensure that your network resources are used efficiently and fairly.

Operating principles
====================

NethSecurity QoS is designed to make the best use of available bandwidth, without imposing strict limits or shaping traffic by default.
It operates on the following principles:

- *Bandwidth usage*: QoS strives to utilize the available bandwidth to its fullest potential. By default, it does not impose strict bandwidth limitations on your network.
  Instead, it dynamically adjusts to network conditions, ensuring that unused bandwidth is efficiently utilized.

- *Flow management*: QoS actively manages network flows to prevent any single client or application from monopolizing the available bandwidth.
  This ensures fair and equitable access to network resources for all users.

Configuration
=============

Bandwidth management is handled dynamically and automatically by the system. Configuration is straightforward, involving specifying upload and download bandwidth values for each interface under QoS. 

While QoS can be set up on any interface, it typically functions optimally on WAN-type interfaces, setting upload and download speeds to the internet connection data rates.

To ensure resilience against service fluctuations, it is advisable to maintain a safety margin by configuring these parameters 10% lower than the measured values



Advanced Configuration
====================

While Qosify works effectively without extensive configuration, it can be further optimized by setting bandwidth limits and rules.
Fine-tuning QoS parameters can result in even better network performance.

The modifications to the standard behavior however can be useful in very limited scenarios, for which, currently, it is only possible to act directly through the command line.


Priority classes
----------------

The QoS uses four classes of priority, each class can use a maximum percentage of bandwidth defined by its threshold.

- **Bulk (CS1, LE in kernel v5.9+):** This class is designed for low-priority traffic, with a 6.25% threshold.
- **Best Effort (General):** This class has a 100% threshold and is used for typical, non-prioritized traffic.
- **Video (AF4x, AF3x, CS3, AF2x, CS2, TOS4, TOS1):** Video traffic falls under this class, with a 50% threshold.
- **Voice (CS7, CS6, EF, VA, CS5, CS4):** Voice traffic is given the highest priority, with a 25% threshold.


QoS can temporarily reduce the priority of a flow if it generates a significant amount of traffic, which is configurable.
For example, a flow might be temporarily shifted to the "Bulk" priority if it sends a high number of packets within a short time.
QoS can also prioritize small packets to ensure low-latency transmission of time-sensitive data.

In addition to IP and port-based rules, QoS allows you to define traffic rules based on DNS names, providing granular control over how traffic is classified and treated.

To override DSCP classification, create a file ``/etc/qosify/10-custom.conf`` with mappings:
Each line has two whitespace separated fields, match and dscp.

Match is one of:

- ``tcp:<port>[-<endport>]``
	TCP single port, or range from <port> to <endport>
- ``udp:<port>[-<endport>]``
	UDP single port, or range from <port> to <endport>
- ``<ipaddr>``
	IPv4 address, e.g. 1.1.1.1
- ``<ipv6addr>``
	IPv6 address, e.g. ff01::1
- ``dns:<pattern>``
	fnmatch() pattern supporting * and ? as wildcard characters
- ``dns:/<regex>``
	POSIX.2 extended regular expression for matching hostnames
	Only works, if dns lookups are passed to qosify via the add_dns_host ubus call.
- ``dns_c:...``
	Like dns, but only matches cname entries

The dscp can be a raw value, or a codepoint like CS0.
Adding a ``+`` in front of the value tells qosify to only override the DSCP value if it is zero.


Example: ::

  tcp:80		+voice
  192.168.1.2	video
  dns:nethesis.it	+CS7

Troubleshooting
===============

Inspect qosify status with ``qosify-status``, look for pkts in the 4 classes.
