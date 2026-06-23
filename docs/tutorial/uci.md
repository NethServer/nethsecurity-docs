---
title: "UCI (Unified Configuration Interface)"
sidebar_position: 12
---

# UCI (Unified Configuration Interface) {#uci-section}

UCI (Unified Configuration Interface) is a centralized configuration management system used in NethSecurity. It provides a unified approach to system configuration through a command-line interface and standardized configuration files.

## Key Characteristics

- **Centralized Configuration**: All system configurations are stored in a single location (`/etc/config/`)
- **Database-driven**: Configurations are stored in structured database files
- **No Built-in Validation**: UCI executes commands without safety checks - requires system knowledge
- **Three-phase Workflow**: Modify → Commit → Restart/Reload
- **Multi-event Capable**: User interfaces can trigger multiple configuration events simultaneously

## Configuration Storage

All UCI configurations are stored as database files in `/etc/config/`. Each file represents a different system component or service, a non-exhaustive example list is provided below.

### Configuration files structure

    /etc/config/
    ├── acme          # SSL certificate management
    ├── adblock       # Advertisement blocking
    ├── banip         # IP banning service
    ├── chilli        # Captive portal
    ├── dedalo        # Network access control
    ├── dhcp          # DHCP server configuration
    ├── dpi           # Deep packet inspection
    ├── dropbear      # SSH server
    ├── firewall      # Firewall rules and zones
    ├── flashstart    # Web filtering
    ├── fstab         # Filesystem table
    ├── ipsec         # IPsec VPN
    ├── luci          # luci Web interface
    ├── mwan3         # Multi-WAN configuration
    ├── network       # Network interfaces and routing
    ├── nginx         # Web server
    ├── ns-ui         # NethSecurity user interface
    ├── objects       # Object definitions
    ├── openssl       # SSL/TLS configuration
    ├── openvpn       # OpenVPN configuration
    ├── qosify        # Quality of Service
    ├── rpcd          # RPC daemon
    ├── rsyslog       # System logging
    ├── socat         # Socket utilities
    ├── system        # System-wide settings
    ├── templates     # Configuration templates
    ├── ucitrack      # UCI change tracking
    ├── uhttpd        # HTTP server
    └── users         # User management

## Viewing Configuration

### Show all configuration for a specific service

``` bash
uci show <service>
```

**Example:**

``` bash
uci show network
```

**Output:**

``` text
network.loopback=interface
network.loopback.device='lo'
network.loopback.proto='static'
network.loopback.ipaddr='127.0.0.1'
network.loopback.netmask='255.0.0.0'
network.@device[0]=device
network.@device[0].name='br-lan'
network.@device[0].type='bridge'
network.@device[0].ports='eth0'
network.lan=interface
network.lan.device='br-lan'
network.lan.proto='static'
network.lan.ipaddr='192.168.100.101'
network.lan.netmask='255.255.255.0'
network.wan=interface
network.wan.device='eth1'
network.wan.proto='dhcp'
```

### Show specific configuration option

``` bash
uci show <service>.<section>.<option>
```

**Example:**

``` bash
uci show network.lan.ipaddr
```

## Complete configuration workflow

### Standard Three-Phase Process

1.  **MODIFY** - Make configuration changes
2.  **COMMIT** - Save changes to the configuration database
3.  **RELOAD** - Apply changes to the running system

### Practical example: changing LAN IP address

``` bash
# Step 1: Modify the configuration
uci set network.lan.ipaddr='192.168.100.151'

# Step 2: Commit the changes
uci commit network

# Step 3: Restart the network service
/etc/init.d/network restart
```

## SET - Modifying configuration

The `uci set` command is used to modify configuration values. Changes are stored temporarily and must be committed to become persistent.

### Set a configuration value

``` bash
uci set <service>.<section>.<option>='<value>'
```

**Examples:**

``` bash
# Change IP address
uci set network.lan.ipaddr='192.168.100.151'

# Change netmask
uci set network.lan.netmask='255.255.255.0'

# Change DHCP protocol to static
uci set network.wan.proto='static'
```

### Add a new section

``` bash
uci add <service> <section_type>
```

### Delete operations

``` bash
# Delete a configuration option
uci delete <service>.<section>.<option>

# Delete an entire section
uci delete <service>.<section>
```

## LISTS - Editing list options {#uci-lists}

Lists are a special type of option that can contain multiple values.

### Add a value to a list

Use the `uci add_list` command to add values to a list; the command creates the list if it does not already exist.

```bash
uci add_list <service>.<section>.<list_option>='<value>'
```

### Remove a value from a list

To remove a specific value from a list, use `uci del_list` and specify the value to be removed.

```bash
uci del_list <service>.<section>.<list_option>='<value>'
```

To remove all values from a list, use the `uci delete` command as described in the previous section.

## COMMIT - Saving changes

Changes made with `uci set` are not immediately applied to the system. They must be committed first to make them persistent.

### Commit specific service

``` bash
uci commit <service>
```

**Example:**

``` bash
uci commit network
```

### Commit all pending changes

``` bash
uci commit
```

### Check pending changes

Before committing, you can review what changes will be applied:

``` bash
uci changes
```

### Revert uncommitted changes

If you want to discard uncommitted changes:

``` bash
uci revert <service>
```

## RELOAD - Applying changes

After committing, you can apply the new configuration to the running system with a single command. This will automatically reload the affected services without the need to restart each one manually.

### Reload configuration

``` bash
reload_config  
```

## Configuration file format

UCI configuration files use a structured format with sections and options:

``` text
config <section_type> '<section_name>'
    option <option_name> '<value>'
    list <list_name> '<value1>'
    list <list_name> '<value2>'
```

### Example: Network Configuration File

Network Configuration File (`/etc/config/network`):

``` text
config interface 'loopback'
    option device 'lo'
    option proto 'static'
    option ipaddr '127.0.0.1'
    option netmask '255.0.0.0'

config device
    option name 'br-lan'
    option type 'bridge'
    list ports 'eth0'

config interface 'lan'
    option device 'br-lan'
    option proto 'static'
    option ipaddr '192.168.100.101'
    option netmask '255.255.255.0'

config interface 'wan'
    option device 'eth1'
    option proto 'dhcp'
```

## Best Practices

### Safety Considerations

1.  **Always backup configurations** before making changes
2.  **Test changes incrementally** rather than making multiple changes at once
3.  **Understand service dependencies** before restarting services
4.  **Use** `uci changes` **to review** pending modifications
5.  **Have console access** available when making network changes

### Common Pitfalls

- **Forgetting to commit**: Changes are not persistent until committed
- **Not restarting services**: Committed changes may not be active until service restart
- **Breaking network connectivity**: Always ensure alternative access methods
- **Syntax errors**: Invalid UCI syntax can cause configuration corruption

## Troubleshooting

### Common commands for debugging

#### View pending changes

``` bash
uci changes
```

#### Revert to last committed state

``` bash
uci revert <service>
```

#### Check UCI syntax

``` bash
uci show | head -1
```

:::note

Always ensure you have alternative access to the system when making critical configuration changes, especially network-related modifications.

:::

:::warning

UCI commands execute without validation. Incorrect configurations can render the system inaccessible.

:::
