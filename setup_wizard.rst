.. _setup_wizard-section:

============
Setup wizard
============

The first time the web user interface is accessed, a setup wizard is launched. This guided process can assist you in establishing a secure initial configuration for the firewall and ensures that the unit is ready for deployment in a production environment.

.. note:: For optimal security and to ensure a controlled configuration environment, it is strongly recommended that you complete the setup wizard before connecting the device to the internet.

.. _welcome-section:

Welcome to the setup wizard
===========================

On the first page of the setup wizard, you are presented with three options:

- **New configuration**: this option initiates the guided setup process.
- **Restore a backup**: this option allows you to restore the unit configuration from a previous backup. If selected, the setup wizard is skipped.
- **Factory reset**: this option resets the firewall unit to its default factory settings. This is useful if you suspect unauthorized access to the firewall.

.. _change_password-section:

Step 1: Change root password
============================

You are required to define a new, secure password for the root account. This measure significantly reduces the risk of compromise by eliminating reliance on publicly known default credentials.

.. note::
   - The updated root password will be applied immediately upon confirmation.
   - Ensure the new credentials are securely stored before proceeding to the next configuration step.
   - If you restart the setup wizard after changing root password (e.g., by closing and reopening the browser tab), you will need to use the new password to access the web interface.

.. _ssh-section:

Step 2: SSH Access
==================

You can customize SSH access to suit your security and operational requirements.

Default access configuration
----------------------------

- LAN Access is enabled by default to allow administrative access from within the trusted local network.
- WAN Access is disabled by default to prevent exposure to external threats from untrusted networks.

Settings
--------

- **TCP port**: the listening port for SSH can be changed if needed. The default value is 22.
- **Root login with password**: it is advised to disable password-based root login for SSH. Disabling this option significantly reduces the risk of unauthorized access by limiting the potential for brute-force password attacks.

.. note:: If password-based login for the root user is disabled, it is essential to upload the root user's SSH public key to the device to ensure continued remote access.

.. _port_9090-section:

Step 3: Web interface access on TCP port 9090
=============================================

Configure access parameters for the web user interface, which operates on port 9090.

Default configuration
---------------------

By default, web interface access is enabled from the LAN, allowing administrative management from within the trusted local network.

Settings
--------

You can choose from the following access options for WAN connectivity:

- **Disabled** (recommended): this option disables web interface access from the WAN, preventing exposure to external threats.
- **Enabled**: full access to the web interface is permitted from any WAN source. This mode should only be used in secure environments or when necessary for remote management, and must be protected with strong credentials
- **Limited**: web interface access from WAN is restricted to specified IP addresses or networks. You have to define one or more of the following:
  
  - IP address
  - CIDR-formatted networks (e.g., 192.168.1.0/24)
  - IP address ranges (e.g., 203.0.113.10-203.0.113.20)

.. _port_443-section:

Step 4: Web interface and WAN access on TCP port 443
====================================================

Set up access controls for the web interface and WAN connections on port 443.

- **Web interface service on TCP port 443**: this option controls if the web interface service on port 443 is disabled (recommended) or enabled. By default, the web interface is accessible on port 9090. If this option is enabled, the web interface will be accessible on port 443.
- **WAN access on TCP port 443**: this option controls if WAN access on port 443 is disabled (recommended) or enabled.

.. _summary-section:

Step 5: Summary
===============

The summary page provides an opportunity to review the unit configuration before applying changes.

.. note:: WAN access to the web interface may be restricted by your current settings. Applying the changes while connected via port 443 could result in loss of access. Verify your configuration meets your remote access needs, particularly when using reverse proxies.

Use the 'Previous' button to go back and make adjustments if needed. Click 'Finish setup' to apply the changes and complete the setup wizard.
