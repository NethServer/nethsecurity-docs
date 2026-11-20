---
title: "Remote access"
sidebar_position: 4
---

# Remote access

## Default credentials {#default_credentials-section}

Default credentials are:

- User: `root`
- Password: `Nethesis,1234`

Such credentials can be used to log in to the web interface or using SSH:

- Web user interface: **https://\<server_ip\>:9090**
- SSH default port: **22**

NethSecurity\'s default hostname is: `NethSec`

If your client has received an IP address from NethSecurity\'s DHCP, it will use NethSecurity as both gateway and DNS server. Under these conditions you can contact NethSecurity using its hostname **nethsec** instead of the **server_ip** e.g.

<https://nethsec:9090>

This hostname can be modified in the System Settings section.

:::note

The default password for the root user is `Nethesis,1234`. It is recommended to change the password immediately after logging in for the first time.

:::

### Reset root password

The `root password` can be reset by entering in [Failsafe mode](../system/reset_recovery.md#failsafe-section). Once in this mode, you can change the password by executing the following commands. :

``` bash
mount_root
passwd
```

Restart the firewall with the command :

``` bash
reboot
```

## Web user interface {#web_user_interface-section}

NethSecurity UI (User Interface), the NethSecurity official web interface, is available on port `9090` at the following URL: **https://\<server_ip\>:9090**.

To ease the access, NethSecurity UI is also available on standard HTTP port `443` at the following URL: **https://\<server_ip\>** or **http://\<server_fqdn\>**.

By default, both URLs are accessible only from the LAN. Access from the WAN is blocked on both ports.

### Access to NethSecurity UI from WAN {#ui_wan_access-section}

On new installations, access to the NethSecurity UI from the WAN is blocked by two input firewall rules that are disabled by default:

- `Allow-UI-from-WAN`: allows access to port 9090 from the WAN
- `Allow-HTTPS-from-WAN`: allows access to port 443 from the WAN; this port is also used by the [reverse proxy](../network/reverse_proxy.md)

Units upgraded from previous versions keep their current rules: if the rules were enabled before the upgrade, the NethSecurity UI is still reachable from the WAN. To block it, disable both rules as described below.

If the unit must be managed remotely, enable access to port 9090 from the WAN in one of the following ways:

- from the web interface: go to the Firewall rules page, navigate to the `Input rules` tab, locate the \"Allow-UI-from-WAN\" rule and enable it
- from the console: run the [setup command](#setup-command-section) and select the `remote-access` item; this is useful when the web interface is not reachable yet, for example when the unit is connected only to the WAN

It is strongly recommended to restrict the access to specific IPs or networks: in the Firewall rules page, locate the \"Allow-UI-from-WAN\" rule and click the **Edit** button. In the `Source address` field, enter the IP addresses or network CIDRs from which you want to allow access to the NethSecurity UI.

Only allow access from trusted IP addresses or networks. Leaving this field blank will allow anyone on the internet to access the NethSecurity UI.

:::warning

Enabling the `Allow-HTTPS-from-WAN` rule, for example to publish services through the reverse proxy, also makes the NethSecurity UI reachable from the WAN on port 443. To prevent it, [disable the web user interface on port 443](#disable_ui_443-section).

:::

Additional security measures:

- use a strong password for the admin user
- enable [two-factor authentication (2FA)](../users-objects/administrative_users.md#2fa-section) for the admin user
- keep your firewall up to date with the latest security patches

### Change web user interface port {#change_ui_port-section}

Users can change the NethSecurity UI port.

To change the NethSecurity UI port from 9090 to 8181, execute: :

``` bash
uci set ns-ui.config.nsui_extra_port=8181
uci commit ns-ui && ns-ui
```

:::warning

The controller uses port 9090 to communicate with the unit. Changing the port will prevent the controller from managing the NethSecurity.

:::

If you still need to forward port 9090 to another machine inside the LAN, you can keep the controller connected by leaving the `ns-ui_extra_port` unchanged and forwarding the port to the new machine. Forwarding the port to another machine will be acceptable because the controller will reach port 9090 over the VPN.

### Disable web user interface on port 443 {#disable_ui_443-section}

While exposing port 443 (HTTPS) can be necessary for certain services, such as the reverse proxy, directly accessing the NethSecurity UI through this port may introduce a potential security risk. Here\'s how to safely maintain port 443 functionality while protecting your NethSecurity UI.

If you don\'t require accessing the NethSecurity UI through port 443, disable it to minimize attack opportunities. Execute the following commands on your NethServer system: :

``` bash
uci set ns-ui.config.nsui_enable=0
uci commit ns-ui && ns-ui
```

This option disables access to the NethSecurity UI through both the server IP address and FQDN on port 443.

If you need port 443 for other services, configure your firewall to redirect traffic destined for port 443 to a separate web server hosting those services. Ensure this separate server has strong security measures in place.

### Privacy policy {#privacy_policy-section}

In some cases, it is necessary to display the privacy policy of a product before login. NethSecurity does not display any privacy policy by default, but it is possible to add a link to an external website that contains the privacy policy.

To add a link to the privacy policy, access the command line and execute: :

``` bash
URL=https://mysite.org/privacy_policy; sed -i "s|PRIVACY_POLICY_URL\: ''|PRIVACY_POLICY_URL: '$URL'|" /www-ns/branding.js
```

Substitute `https://mysite.org/privacy_policy` with the URL of your privacy policy.

The link to the privacy policy will be displayed inside the login page after next page refresh.

### Legacy web user interface {#luci-section}

:::warning

Changes done via LuCI web interface may break the official NethSecurity UI. Use at your own risk!

:::

NethSecurity offers also LuCI, the original OpenWrt web interface, which provides a wide range of configuration options but is not officially supported. Luci is disabled by default. To enable it, execute: :

``` bash
uci set ns-ui.config.luci_enable=1
uci commit ns-ui
ns-ui
```

Once enabled, Luci will be available only on port 443 at this URL: **https://\<server_ip\>/cgi-bin/luci**

Changes to the following LuCI pages are known to cause unpredictable behavior:

- HTTP access tab: it configures uhttpd which is not present inside NethSecurity
- Logging tab: it configures logd which is not present inside NethSecurity
- Networking: configuration created with this page is not compatible with NethSecurity UI

If previously enabled, the LuCI web interface can be disabled by executing: :

``` bash
uci set ns-ui.config.luci_enable=0
uci commit ns-ui
ns-ui
```

### Hide web server version

By default, the nginx web server serving the NethSecurity UI includes its version number in HTTP response headers. Many vulnerability assessments rely on software version identification, which can produce false positives when fixes are backported without modifying the reported version. While hiding version information does not improve security by itself, it can help limit the exposure of known version-specific vulnerabilities to automated scanning tools.

To disable the nginx version from being displayed in the NethSecurity UI HTTP headers, execute the following commands: :

``` bash
uci set ns-ui.config.server_tokens='off'
uci commit ns-ui
reload_config
```

This configuration only affects the NethSecurity UI. The reverse proxy has its own separate configuration.

## Administrative users {#admin_users-section}

For information about administrative accounts, two-factor authentication (2FA), administrative activity logging, and audit recommendations, see [Administrative users](../users-objects/administrative_users.md).

## SSH

By default, the system accepts SSH connections on the standard port 22 from the internal network (LAN). Root access is enabled using the default password. To allow SSH access from the wider internet (WAN), a firewall input rule must be added for the server\'s listening port.

From a Linux machine, use the following command: :

``` bash
ssh root@192.168.1.1
```

## Using the setup command {#setup-command-section}

If the machine has a VGA/DVI/HDMI video port, connect a monitor to it. You can then use the `setup` command from the console to perform the first configuration steps.

Use `setup` when the web user interface is not yet reachable, or when you are working from VGA, serial console, or SSH on a new firewall.

Run the tool as `root`:

``` bash
setup
```

The interactive menu lets you:

- configure the keyboard layout
- configure the LAN and WAN interfaces
- open or close access to the web user interface on port 9090 from the WAN

### Keyboard layout

The system starts with the US keyboard layout. In the `setup` menu, choose the `keymap` item to switch between the available layouts. The tool currently supports `us` and `it` keymaps.

The selected keymap is applied immediately and saved automatically, so it remains active after reboot. It's also preserved inside the backup to be restored in case of system recovery or upgrade.

### Network settings

The `setup` tool allows you to configure the following network settings:

- LAN interface: DHCP or static IP address with netmask in CIDR notation
- WAN interface: DHCP or static IP address with netmask in CIDR notation and gateway

After making changes, the network configuration must be applied with the `Apply network changes` button in the network section.

If you are using a non-US keyboard layout, you can change it in the setup tool before entering the network configuration. This is important because the network configuration requires typing IP addresses and other information that may be affected by the keyboard layout.

### Access to port 9090 from WAN

The `remote-access` item shows whether access to the web user interface on port 9090 from the WAN is currently `open` or `closed`. Select it to switch between the two states: the change is applied immediately by enabling or disabling the `Allow-UI-from-WAN` firewall rule.

This option does not change access to port 443 from the WAN, which remains controlled by the `Allow-HTTPS-from-WAN` rule. See [Access to NethSecurity UI from WAN](#ui_wan_access-section) for more details.

## Serial console

If the machine has a serial port (RS-232, tipically available with DE-9 connector or RJ45/8P8C connector) it\'s possible to access the firewall directly through it using a null-modem cable and a terminal program. `PuTTY` (version 0.60 or higher) is a common choice if you are using Microsoft Windows, while Linux distros offer tools as `minicom`, `picocom`, or `screen`.

Default acces parameters for NethSecurity 8 are:

- Baud rate: 115200,
- Data bits:8
- Parity :None
- Stop bits to 1

These last three parameters are often abbreviated as 8N1

### USB-to-Serial adapters

In case of need, NethSecurity can be used to access another server via the serial console. If the hardware does not have an RS-232 port, USB-to-serial adapters can be used. For this reason, it is possible to download and install drivers for the most common adapters on NethSecurity. These drivers are provided as-is and are **not supported by Nethesis** (if using an Enterprise or Subscription version).

Two packages are provided for installation, covering the vast majority of adapters available on the market. :

``` bash
kmod-usb-serial-cp210x - 5.15.162-1 - Kernel support for Silicon Labs cp210x USB-to-Serial converters
kmod-usb-serial-pl2303 - 5.15.162-1 - Kernel support for Prolific PL2303 USB-to-Serial converters
```

- To install Prolific PL2303 driver:

  If you are running NethSecurity 8.8, use:

  ``` bash
  apk update
  apk add kmod-usb-serial-pl2303
  ```

  If you are running NethSecurity 8.7.2 or older, use:

  ``` bash
  opkg update
  opkg install kmod-usb-serial-pl2303
  ```

- The logs will show an output similar to this:

  ``` bash
  Aug  6 08:08:17 nsec8 kernel: [ 2346.359247] usb 1-6: new full-speed USB device number 3 using xhci_hcd
  Aug  6 08:08:17 nsec8 kernel: [ 2346.543052] pl2303 1-6:1.0: pl2303 converter detected
  Aug  6 08:08:17 nsec8 kernel: [ 2346.550401] usb 1-6: pl2303 converter now attached to ttyUSB0
  ```

:::note

Starting from version 8.7.2, extra packages are automatically reinstalled after system upgrade. For earlier versions and for additional information, refer to this documentation: [Restore extra packages](../system/updates.md#restore_extra_packages-section).

:::
