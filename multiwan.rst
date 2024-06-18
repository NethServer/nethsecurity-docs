========
MultiWAN
========

MultiWAN (Wide Area Network) configuration is a setup in which the firewall utilizes multiple internet connections from different
internet service providers (ISPs) simultaneously. This configuration aims to enhance network reliability, increase bandwidth,
and improve internet speed by distributing network traffic across multiple links.
It can provide failover protection, ensuring that if one connection fails, the network traffic is automatically redirected to the functional
connection, minimizing downtime and ensuring continuous internet access. 
MultiWAN configurations are often used in businesses and organizations that require a highly available and stable internet connection for their operations.

MultiWAN configuration requires at least two network interfaces in the WAN zone of the system. This is the fundamental requirement for implementing a MultiWAN connection.

The first time you access the configuration page, it is mandatory to create a default policy. This policy is essential and cannot be deleted. The default policy defines the basic behavior of the MultiWAN system.
It's necessary to specify its behavior. There are two available main options:

- ``Balanced``: In this mode, WAN connections are utilized simultaneously, and traffic is balanced based on the weight assigned to each WAN. The WAN weight can vary from 1 to 1000.
- ``Backup``: In backup mode, the secondary WAN connection comes into play only if the primary connection fails. This ensures a backup connectivity if the primary WAN fails.

There is also a ``Custom mode`` that allows more detailed configuration, especially useful when dealing with three or more WAN connections.
This mode provides greater flexibility in managing traffic between different WAN connections.

In the custom mode of Multi-WAN configuration, the following concepts apply:

- Independent priority levels: each priority level operates independently of others. WAN interfaces within a particular priority level do not affect
  or depend on interfaces in other levels.
- Multiple WAN interfaces within a priority level: each priority level can contain two or more WAN interfaces. These interfaces are grouped together
  for specific configuration settings.
- Weights determine traffic distribution: the weights assigned to WAN interfaces within a priority level determine how traffic is distributed among these interfaces.
  Higher weights indicate a higher proportion of traffic allocation.
- Priority decreases with new levels: adding a new priority level results in interfaces within this level having lower priority.
  They are only utilized if all interfaces in the previous level fail.

Consider a scenario where the first two WAN interfaces are configured in balance mode, and the last interface serves as a backup if both the first two interfaces fail:

1. select the first two WAN interfaces and set them to balance mode by assigning weights to both depending on internet connection performances
2. add a new priority level by clicking on :guilabel:`Add priority level` button
3. select the third WAN interface and assign a weight. However, in this scenario, the weight does not influence the traffic distribution as
   it is the only interface at this level. It acts as a backup, coming into play only if both interfaces in the previous level fail.

Routing rules
=============

Users can create outbound traffic rules based on specific criteria such as source IP, destination IP, source port(s), destination port(s), and IP protocol types.
This policy-based routing feature enables users to customize which outbound connections use specific WAN interfaces, allowing for a fine-tuned network setup.

Here's how you can create a custom rule:

1. Create a new policy: to begin customizing traffic routing, start by creating a new policy. Click on the :guilabel:`Create policy` button to initiate the process.

2. Create a new rule: then click on the :guilabel:`Create rule` button. This step allows you to define specific conditions under which the traffic will be routed differently from the default policy.

3. Give the rule a meaningful name: assign a descriptive and meaningful name to the rule. This name should reflect the purpose or conditions of the traffic routing rule for easy identification.

4. Specify traffic type: define the criteria for the traffic you want to customize. This can include the source IP address, destination IP address, specific protocols, ports, or any combination of these factors. By specifying these parameters, you narrow down the scope of the rule to a specific type of traffic.

5. Select the created policy for this traffic type: choose the custom policy you created in the first step as the routing preference for this specific type of traffic.
   By associating the rule with a particular policy, you are instructing the system to route the defined traffic according to the settings specified within that policy.

* ``Sticky`` option : The sticky option in a rule ensures that traffic originating from the same source IP always exits through the same WAN for a duration of 10 minutes. This can prevent issues when connecting to websites of banks, insurance companies, etc. This option is tipically used for HTTPS traffic (TCP 443) with the desired policy (for example, using the default policy but having this option active only for this specific type of traffic).

General settings
================

NethSecurity monitors each WAN connection using repeated ICMP tests.

The ``General settings`` page allow users to specify the following parameters:

- List of hosts to monitor: users can define a list of hosts (computers, servers, or devices) that the system will monitor for connectivity status. 
  These hosts are checked to ensure they are reachable via the network.
- Number of ICMP packets (pings) to send: users can set the number of ICMP (Internet Control Message Protocol) packets to be sent during each monitoring test.
  By setting the number of packets, users can control the intensity of the monitoring.
- Determining unreachability after how many failed tests:  users can configure the system to determine when a WAN connection should be considered unreachable.
  This is done by specifying a threshold - after how many consecutive failed tests the WAN connection is deemed unreachable.
 

Reset configuration
===================

.. warning::

   This will effectively reset the MultiWAN configuration, with a loss of Internet connection if no WAN is configured.

If your firewall was previously configured with two or more WAN interfaces and after reconfiguration there is only one WAN interface, it is recommended to reset the MultiWAN configuration. This will ensure that your firewall is properly configured and functioning as intended.

::

  /usr/libexec/rpcd/ns.mwan call clear_config
  uci commit mwan3
  reload_config

