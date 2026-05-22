.. _softflowd-section:

=========
Softflowd
=========

`softflowd <https://github.com/irino/softflowd>`_ is a software implementation of a flow-based
network traffic monitor. It listens promiscuously on a network interface, tracks active traffic
flows (communication between two IP address/port tuples), and exports them as NetFlow or IPFIX
datagrams to a remote collector.

Common use cases include:

- **Network traffic analysis**: identify top talkers, protocols, and bandwidth consumers.
- **Bandwidth monitoring**: feed flow data into collectors like ntopng, nfsen, or Grafana.
- **Security auditing**: detect anomalous traffic patterns and potential intrusions.
- **Capacity planning**: understand long-term traffic trends across your network.

softflowd supports NetFlow versions 1, 5, and 9, as well as IPFIX (version 10), and is fully
IPv6 capable when using NetFlow v9 or IPFIX.

.. note::

    softflowd is **not installed by default** on NethSecurity. You must install it manually
    before configuring it.

Installation
------------

Connect to your firewall via SSH and install the package:

.. code-block:: bash

    opkg update
    opkg install softflowd

Configuration
-------------

The configuration is stored in ``/etc/config/softflowd``. All settings are managed via UCI.

1. **Enable softflowd** and set the network **interface** to monitor (replace ``br-lan`` with
   the interface relevant to your setup — use ``ip link show`` to list available interfaces):

.. code-block:: bash

    uci set softflowd.@softflowd[0].enabled='1'
    uci set softflowd.@softflowd[0].interface='br-lan'

2. **Set the collector destination** using ``host:port`` format. This is the address and UDP
   port of your NetFlow/IPFIX collector:

.. code-block:: bash

    uci set softflowd.@softflowd[0].host_port='192.168.1.100:2055'

3. **Choose the export protocol version**. The default is ``5`` (NetFlow v5). Use ``9``
   (NetFlow v9) or ``10`` (IPFIX) if you need IPv6 flow export or bidirectional mode:

.. code-block:: bash

    uci set softflowd.@softflowd[0].export_version='9'

4. **Set the tracking level** to control the granularity of flow records:

.. code-block:: bash

    uci set softflowd.@softflowd[0].tracking_level='full'

5. **Optional**: enable IPv6 flow tracking (only effective with NetFlow v9 or IPFIX):

.. code-block:: bash

    uci set softflowd.@softflowd[0].track_ipv6='1'

6. **Commit and start the service**:

.. code-block:: bash

    uci commit softflowd
    reload_config
    /etc/init.d/softflowd enable
    /etc/init.d/softflowd start

**Complete example** — exporting NetFlow v9 data to a collector at ``192.168.1.100:2055``,
monitoring the LAN bridge interface with full flow detail and IPv6 support:

.. code-block:: bash

    uci set softflowd.@softflowd[0].enabled='1'
    uci set softflowd.@softflowd[0].interface='br-lan'
    uci set softflowd.@softflowd[0].host_port='192.168.1.100:2055'
    uci set softflowd.@softflowd[0].export_version='9'
    uci set softflowd.@softflowd[0].tracking_level='full'
    uci set softflowd.@softflowd[0].track_ipv6='1'
    uci set softflowd.@softflowd[0].max_flows='8192'
    uci set softflowd.@softflowd[0].sampling_rate='100'
    uci commit softflowd
    reload_config
    /etc/init.d/softflowd enable
    /etc/init.d/softflowd start

Configuration options
---------------------

The following table describes all available UCI options for softflowd.

.. list-table::
   :header-rows: 1
   :widths: 20 15 15 50

   * - Option
     - Type
     - Default
     - Description
   * - ``enabled``
     - boolean
     - ``0``
     - Enable (``1``) or disable (``0``) the softflowd service.
   * - ``interface``
     - string
     - ``br-lan``
     - Network interface to listen on (e.g. ``br-lan``, ``eth0``, ``pppoe-wan``).
   * - ``host_port``
     - string
     - *(empty)*
     - Destination for flow export in ``host:port`` format (e.g. ``192.168.1.100:2055``).
       Multiple destinations can be specified using commas.
       If empty, softflowd runs in statistics-only mode without exporting data.
   * - ``export_version``
     - integer
     - ``5``
     - NetFlow export protocol version. Supported values: ``1``, ``5``, ``9``, ``10`` (IPFIX).
       Use ``9`` or ``10`` for IPv6 support and more detailed records.
   * - ``tracking_level``
     - string
     - ``full``
     - Flow element granularity. Options: ``full`` (src/dst address, port and protocol),
       ``proto`` (src/dst address and protocol), ``ip`` (src/dst address only),
       ``vlan`` (full + VLAN ID), ``ether`` (full + VLAN ID and MAC addresses).
   * - ``max_flows``
     - integer
     - ``8192``
     - Maximum number of flows to track concurrently. When exceeded, the oldest inactive
       flows are forcibly expired and exported.
   * - ``sampling_rate``
     - integer
     - ``100``
     - Periodical sampling rate denominator. A value of ``100`` means 1 in 100 packets
       is sampled. Set to ``1`` for no sampling (capture every packet).
   * - ``track_ipv6``
     - boolean
     - ``0``
     - Force tracking of IPv6 flows. Only meaningful with ``export_version`` set to ``9``
       or ``10``.
   * - ``bidirectional``
     - boolean
     - ``0``
     - Enable bidirectional flow mode. Only works with IPFIX (``export_version='10'``).
   * - ``timeout``
     - string
     - *(empty)*
     - Override flow expiry timeouts. Format: ``name=time`` (e.g. ``udp=1m30s``).
       Valid timeout names: ``general``, ``tcp``, ``tcp.rst``, ``tcp.fin``, ``udp``,
       ``maxlife``, ``expint``.
   * - ``filter``
     - string
     - *(empty)*
     - BPF filter expression to exclude specific traffic from tracking
       (e.g. ``not port 22`` to ignore SSH traffic).
   * - ``hoplimit``
     - integer
     - *(empty)*
     - IPv4 TTL or IPv6 hop limit for exported datagrams. Useful when exporting to
       multicast groups.
   * - ``pid_file``
     - string
     - ``/var/run/softflowd.pid``
     - Path to the PID file used when running in daemon mode.
   * - ``control_socket``
     - string
     - ``/var/run/softflowd.ctl``
     - Path to the control socket used by ``softflowctl``.
   * - ``pcap_file``
     - string
     - *(empty)*
     - Path to a pcap file to read traffic from instead of a live interface.
       Useful for offline analysis.

Runtime control
---------------

``softflowctl`` is the companion tool for interacting with a running softflowd instance.
It communicates via the control socket (``/var/run/softflowd.ctl`` by default).

View current flow statistics and expiry information:

.. code-block:: bash

    softflowctl statistics

Dump the full current flow table:

.. code-block:: bash

    softflowctl dump-flows

Force immediate expiry and export of all tracked flows:

.. code-block:: bash

    softflowctl expire-all
