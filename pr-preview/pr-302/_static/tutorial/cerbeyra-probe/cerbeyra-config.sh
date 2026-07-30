#!/bin/bash

#
# Copyright (C) 2025 Nethesis S.r.l.
# SPDX-License-Identifier: GPL-2.0-only
#

# This script configures NethSecurity 8 as a probe for Cerbeyra VA.

set -e  # Exit on error

# Fixed configuration (Cerbeyra standards)
readonly VPN_CIDR="10.244.162.0/24"
readonly VPN_PORT="1201"
readonly SERVICE_NAME="cerbeyra"
readonly REMOTE_NETWORK="172.30.29.0/24"
readonly ALLOWED_SOURCE="91.143.200.128/25"

# Color codes for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Cleanup function for errors
cleanup_on_error() {
    log_error "Configuration failed. See error above."
    exit 1
}

trap cleanup_on_error ERR

# Function to remove all Cerbeyra configuration
remove_configuration() {
    log_info "Removing Cerbeyra configuration..."
    
    local tunnel_id="ns_${SERVICE_NAME}"
    
    # Check if tunnel exists
    if ! uci get openvpn.$tunnel_id >/dev/null 2>&1; then
        log_warn "Cerbeyra tunnel not found, nothing to remove"
        return 0
    fi
    
    log_info "Deleting OpenVPN tunnel..."
    if ! ubus call ns.ovpntunnel delete-tunnel "{\"id\": \"$tunnel_id\"}" 2>/dev/null; then
        log_error "Failed to delete OpenVPN tunnel via ubus"
        return 1
    fi
    
    # Remove firewall zone
    if uci get firewall.cerbeyraz >/dev/null 2>&1; then
        log_info "Removing Cerbeyra firewall zone..."
        uci delete firewall.cerbeyraz
    fi
    
    # Remove NOTRACK rule
    if uci get firewall.ntcerbeyra >/dev/null 2>&1; then
        log_info "Removing NOTRACK rule..."
        uci delete firewall.ntcerbeyra
    fi
    
    uci commit firewall
    
    # Remove DPI exemption
    if uci -q get netifyd.config.bypassv4 | grep -q "$VPN_CIDR"; then
        log_info "Removing DPI exemption..."
        uci del_list netifyd.config.bypassv4="$VPN_CIDR | Cerbeyra"
        uci commit netifyd
    fi
    
    # Remove Snort bypass
    if uci get snort.nfq >/dev/null 2>&1; then
        log_info "Removing Snort bypass..."
        uci del_list snort.nfq.bypass_v4="$VPN_CIDR,Cerbeyra" 2>/dev/null || true
        uci commit snort
    fi
    
    # Reload services
    log_info "Reloading services..."
    /etc/init.d/firewall reload
    /etc/init.d/openvpn restart
    
    log_info "${GREEN}Cerbeyra configuration removed successfully!${NC}"
}

# Function to detect LAN network
detect_lan_network() {
    # Find the network interface associated with the 'lan' firewall zone
    local lan_zone_networks=$(uci get firewall.@zone[0].network 2>/dev/null)
    local lan_interface=""

    # Check if the first zone is 'lan'
    local zone_name=$(uci get firewall.@zone[0].name 2>/dev/null)
    if [ "$zone_name" = "lan" ]; then
        # Get the first network from the lan zone
        lan_interface=$(echo "$lan_zone_networks" | tr ' ' '\n' | head -n1)
    else
        # Search for lan zone in all zones
        local i=0
        while true; do
            zone_name=$(uci get firewall.@zone[$i].name 2>/dev/null) || break
            if [ "$zone_name" = "lan" ]; then
                lan_zone_networks=$(uci get firewall.@zone[$i].network 2>/dev/null)
                lan_interface=$(echo "$lan_zone_networks" | tr ' ' '\n' | head -n1)
                break
            fi
            i=$((i + 1))
        done
    fi

    if [ -z "$lan_interface" ]; then
        log_error "Cannot find LAN interface in firewall configuration"
        return 1
    fi

    local lan_ip=$(uci get network.$lan_interface.ipaddr 2>/dev/null)
    local lan_netmask=$(uci get network.$lan_interface.netmask 2>/dev/null)

    if [ -z "$lan_ip" ] || [ -z "$lan_netmask" ]; then
        log_error "Cannot detect LAN configuration for interface: $lan_interface"
        return 1
    fi

    # Calculate network address
    IFS=. read -r i1 i2 i3 i4 <<< "$lan_ip"
    IFS=. read -r m1 m2 m3 m4 <<< "$lan_netmask"
    echo "$((i1 & m1)).$((i2 & m2)).$((i3 & m3)).$((i4 & m4))"
}

# Function to detect public IP
detect_public_ip() {
    local pub_ip=""
    
    # Try to get from WAN interface
    pub_ip=$(ubus call network.interface.wan status 2>/dev/null | jsonfilter -e '@["ipv4-address"][0].address' 2>/dev/null)
    
    if [ -z "$pub_ip" ] || [ "$pub_ip" == "null" ]; then
        # Fallback to external service
        pub_ip=$(wget -qO- https://api.ipify.org 2>/dev/null || curl -s https://api.ipify.org 2>/dev/null)
    fi
    
    echo "$pub_ip"
}

# Function to check if port is in use
check_port_available() {
    local port=$1
    if netstat -uln 2>/dev/null | grep -q ":${port} "; then
        return 1
    fi
    return 0
}

# Function to validate IP address
validate_ip() {
    local ip=$1
    if [[ $ip =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
        IFS='.' read -r -a octets <<< "$ip"
        for octet in "${octets[@]}"; do
            if ((octet > 255)); then
                return 1
            fi
        done
        return 0
    fi
    return 1
}

# Function to check if OpenVPN tunnel already exists
check_existing_tunnel() {
    local tunnel_id="ns_${SERVICE_NAME}"
    if uci get openvpn.$tunnel_id >/dev/null 2>&1; then
        return 0
    fi
    return 1
}

# Parse command line options
interactive_mode=false
remove_mode=false

while getopts "irp:h" opt; do
    case $opt in
        i) interactive_mode=true ;;
        r) remove_mode=true ;;
        p) VPN_PUB_IP="$OPTARG" ;;
        h)
            echo "Usage: $0 [-i] [-r] [-p public_ip]"
            echo "  -i: Interactive mode"
            echo "  -r: Remove Cerbeyra configuration"
            echo "  -p: VPN public IP (auto-detected if not provided)"
            exit 0
            ;;
        ?) exit 1 ;;
    esac
done

# Handle remove mode
if [ "$remove_mode" = true ]; then
    if [ "$interactive_mode" = true ]; then
        read -p "Are you sure you want to remove Cerbeyra configuration? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Removal cancelled"
            exit 0
        fi
    fi
    remove_configuration
    exit 0
fi

log_info "Starting Cerbeyra OpenVPN server configuration for NethSecurity 8..."

# Check if tunnel already exists
if check_existing_tunnel; then
    log_warn "Cerbeyra tunnel already configured: ns_${SERVICE_NAME}"
    if [ "$interactive_mode" = true ]; then
        read -p "Reconfigure existing tunnel? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 0
        fi
        # Remove existing configuration
        remove_configuration
    else
        log_error "Tunnel already exists. Use -i for interactive mode to reconfigure or -r to remove"
        exit 1
    fi
fi

# Detect LAN network
log_info "Detecting LAN network..."
SCAN_NETWORK=$(detect_lan_network)
if [ $? -ne 0 ]; then
    log_error "Failed to detect LAN network"
    exit 1
fi
log_info "LAN network detected: $SCAN_NETWORK/24"

# Handle VPN_PUB_IP
if [ -z "$VPN_PUB_IP" ]; then
    log_info "Detecting public IP address..."
    VPN_PUB_IP=$(detect_public_ip)
    
    if [ -z "$VPN_PUB_IP" ]; then
        log_warn "Cannot auto-detect public IP"
        if [ "$interactive_mode" = true ]; then
            read -p "Enter VPN public IP address: " VPN_PUB_IP
        else
            log_error "Public IP required. Use -p option or -i for interactive mode"
            exit 1
        fi
    else
        log_info "Public IP detected: $VPN_PUB_IP"
    fi
fi

# Validate VPN_PUB_IP
if ! validate_ip "$VPN_PUB_IP"; then
    log_error "Invalid IP address: $VPN_PUB_IP"
    exit 1
fi

# Check if port is available
if ! check_port_available "$VPN_PORT"; then
    log_warn "Port $VPN_PORT is already in use"
    if [ "$interactive_mode" = true ]; then
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        log_warn "Proceeding despite port conflict..."
    fi
fi

log_info "Configuration summary:"
log_info "  Server Mode: OpenVPN Server (tunnel mode)"
log_info "  VPN Public IP: $VPN_PUB_IP"
log_info "  VPN Network: $VPN_CIDR"
log_info "  Local Network (pushed to clients): $SCAN_NETWORK/24"
log_info "  Remote Network (Cerbeyra): $REMOTE_NETWORK"
log_info "  VPN Port: $VPN_PORT"
log_info "  Allowed Source: $ALLOWED_SOURCE (Cerbeyra network only)"

if [ "$interactive_mode" = true ]; then
    read -p "Proceed with configuration? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Create OpenVPN tunnel using NethSecurity API via ubus
log_info "Creating OpenVPN tunnel server..."
result=$(ubus call ns.ovpntunnel add-server "{\"ns_name\": \"$SERVICE_NAME\", \"port\": \"$VPN_PORT\", \"topology\": \"subnet\", \"proto\": \"udp\", \"local\": [\"$SCAN_NETWORK/24\"], \"remote\": [\"$REMOTE_NETWORK\"], \"compress\": \"\", \"auth\": \"SHA256\", \"cipher\": \"AES-256-GCM\", \"ns_public_ip\": [\"$VPN_PUB_IP\"], \"tls_version_min\": \"1.2\", \"server\": \"$VPN_CIDR\"}" 2>&1)

if [ $? -ne 0 ]; then
    log_error "Failed to create OpenVPN tunnel: $result"
    exit 1
fi

tunnel_id=$(echo "$result" | grep -o '"id"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
if [ -z "$tunnel_id" ]; then
    log_error "Failed to get tunnel ID from API response"
    exit 1
fi

log_info "OpenVPN tunnel created: $tunnel_id"

log_info "Restricting VPN access to allowed source network..."
# Find and modify the firewall rule created by the API to add source restriction
firewall_rule_id=$(uci show firewall | grep "ns_link='openvpn/$tunnel_id'" | grep "\.ns_link=" | cut -d'.' -f2 | cut -d'=' -f1 | head -n1)

if [ -n "$firewall_rule_id" ]; then
    log_info "Adding source IP restriction to firewall rule: $firewall_rule_id"
    uci set firewall.$firewall_rule_id.src_ip="$ALLOWED_SOURCE"
    uci commit firewall
else
    log_warn "Could not find firewall rule to restrict. VPN port is open to all sources!"
fi

log_info "Configuring duplicate CN support..."
# Allow multiple clients with the same certificate (duplicate Common Name)
uci set openvpn.$tunnel_id.duplicate_cn='1'
uci commit openvpn

log_info "Configuring Cerbeyra-specific settings..."

# Create dedicated Cerbeyra zone
log_info "Creating Cerbeyra firewall zone..."
uci set firewall.cerbeyraz='zone'
uci set firewall.cerbeyraz.name='cerbeyra'
uci set firewall.cerbeyraz.input='DROP'
uci set firewall.cerbeyraz.output='DROP'
uci set firewall.cerbeyraz.forward='REJECT'
uci add_list firewall.cerbeyraz.network='cerbeyra'
uci add_list firewall.cerbeyraz.ns_tag='automated'

# NOTRACK rule
log_info "Configuring NOTRACK rule..."
uci set firewall.ntcerbeyra='rule'
uci set firewall.ntcerbeyra.name='notrackcerb'
uci set firewall.ntcerbeyra.src='cerbeyra'
uci set firewall.ntcerbeyra.dest='lan'
uci set firewall.ntcerbeyra.target='NOTRACK'
uci set firewall.ntcerbeyra.direction='in'
uci set firewall.ntcerbeyra.device="tun${SERVICE_NAME}"
uci add_list firewall.ntcerbeyra.ns_tag='automated'
uci set firewall.ntcerbeyra.ns_link="openvpn/$tunnel_id"

uci commit firewall

# DPI bypass
log_info "Configuring DPI bypass..."
if ! uci -q get netifyd.config > /dev/null; then
    uci set netifyd.config=ns_config
fi
uci add_list netifyd.config.bypassv4="$VPN_CIDR | Cerbeyra"
uci commit netifyd

# Snort bypass
log_info "Configuring Snort bypass..."
uci add_list snort.nfq.bypass_v4="$VPN_CIDR,Cerbeyra"
uci commit snort

log_info "Committing all configuration changes..."
# Use ubus to call ns.commit directly without authentication
if ! ubus call ns.commit commit '{}' >/dev/null 2>&1; then
    log_warn "ns.commit via ubus failed, using direct uci commit"
    uci commit
fi

log_info "Reloading services..."
/etc/init.d/firewall reload
/etc/init.d/openvpn restart

log_info ""
log_info "${GREEN}Cerbeyra OpenVPN server configuration completed successfully!${NC}"
log_info ""

# Export client configuration
log_info "Generating client configuration..."
client_config=$(ubus call ns.ovpntunnel export-client "{\"id\": \"$tunnel_id\"}" 2>&1)

if [ $? -eq 0 ]; then
    log_info "Client configuration generated successfully"
    log_info ""
    log_info "Client configuration for Cerbeyra VA:"
    echo "----------------------------------------"
    echo "$client_config" | python3 -m json.tool 2>/dev/null || echo "$client_config"
    echo "----------------------------------------"
else
    log_warn "Failed to export client configuration"
    log_info "You can export it later with:"
    log_info "  api-cli ns.ovpntunnel export-client --data '{\"id\": \"$tunnel_id\"}'"
fi

