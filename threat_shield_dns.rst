.. _threat_shield_dns-section:

=================
Threat shield DNS
=================

.. _threat_shield-dns-section:

DNS based Threat shield
=======================

The DNS filter uses AdBlock which blocks any request to a domain that is considered malicious.
The service can load community-maintained blocklist or use Yoroi feeds.

AdBlock can be configured from the command line interface as explained in the `developer manual <https://dev.nethsecurity.org/packages/ns-threat_shield/#ts-dns>`_.

Block certain websites
-------------------------

.. _block_website-section:

If you need to block specific domains and FQDNs you can do it directly from the FlashStart configuration page, just go to the section "Protection"-> "Personal Blacklists" and add them there.

If you don' have a subscription for FlashStart DNS Filter you can still make it directly on NethSecurity enabling ``AdBlock`` and, optionally, activating the DNS query interception feature for LAN clients.

.. note:: Please use AdBlock to block browsing only if you are not already using the FlashStart service cause if used together, they may conflict.

To enable AdBlock, execute: ::

  uci set adblock.global.adb_enabled='1'
  uci del adblock.global.adb_sources
  uci commit

Enable DNS interception for the LAN: ::

  uci set adblock.global.adb_forcedns='1'
  uci add_list adblock.global.adb_zonelist='lan'
  uci add_list adblock.global.adb_portlist='53'
  uci commit

Add the domains that you want to block to the blocklist: ::

  cat << EOF > /etc/adblock/adblock.blacklist
  domain1.com
  domain2.com
  domain3.net
  EOF

Start the service: ::

  /etc/init.d/adblock start

Changes made to the blocklist require a reload of the service: ::

  /etc/init.d/adblock reload

.. warning::

  The DNS resolution for the names listed in the blocklist will also affect the firewall itself
