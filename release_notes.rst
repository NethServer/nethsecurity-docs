=============
Release notes
=============

NethSecurity releases changelogs.

- List of `known bugs <https://github.com/NethServer/dev/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug>`_
- Discussions around `possible bugs <http://community.nethserver.org/c/bug>`_

Major changes on 2023-11-xx
===========================

**Alpha1**

This is an alpha release, designed for evaluation purposes to explore the functionalities of the new system.
Users have the option to use the new interface, which is currently under development and may contain known issues (`view issues <link>`_),
or the legacy LuCI interface.
Please note that some features available on the old LuCI interface will be removed once the corresponding page on the new interface is completed.

While the entire backend functionality is already operational and thoroughly tested, the new interface is not yet complete.
Some bugs in the new interface are already known and can be found `here <https://trello.com/b/FndRrgIp/nethsecurity-project?filter=label:BUG>`_.

The new interface includes the following features:

- Dashboard
- Subscription Management
- Hostname and Timezone Configuration
- Additional Storage Setup
- Network Interface Configuration
- DNS and DHCP Settings
- Routing Configuration
- Multi-WAN Support
- Dedalo Hotspot Configuration
- Port Forwarding Options
- Zones and Policies Management
- Flashstart DNS Filtering
- Deep Packet Inspection (DPI) Filtering
- Root User Password Change
- Access to System Logs

.. _release_glossary-section:

Releases glossary
=================

The software release cycle includes four stages: Alpha, Beta, Release Candidate (RC), and Stable.

During the **Alpha** stage, the software is not thoroughly tested and may not include all planned features.
This release is not suitable for production environments. However, it can be used to preview what's coming in the upcoming version.
Please note that updates from an Alpha release to other releases are not supported.

The **Beta** stage indicates that the software is mostly feature complete, but it may still contain many known and unknown bugs.
This release should not be used on production environments. However, it can be used to test the software before deploying it to production.
Updates from a Beta release to an RC or Stable release are supported but may require a manual procedure.

During the **Release Candidate (RC)** stage, the software is feature complete, and it contains no known bugs.
If no major issues arise, it can be promoted to Stable. Updates from an RC release to a Stable release are supported
and should be almost automatic.
However, if you're new to the software, it's best to use it in production only if you already have some experience with it.

The **Stable** release is the most reliable and safe to use in production environments.
It has been thoroughly tested and is considered to be free of major bugs.
