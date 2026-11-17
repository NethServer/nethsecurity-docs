---
title: "Hardware watchdog"
sidebar_position: 14
---

# Hardware watchdog

A hardware watchdog is a timer that resets the machine when the operating system stops responding. NethSecurity refreshes the watchdog every 5 seconds: if the system hangs for more than 30 seconds, the watchdog restarts it without anyone having to power-cycle the box.

On x86 systems the watchdog is enabled by default. At boot, NethSecurity detects the watchdog available on the hardware and uses it. If no supported watchdog is found, the system works as before.

## Supported hardware

| Hardware | Driver |
|---|---|
| Intel chipsets and SoCs (many Atom, Celeron, Core and Xeon systems) | `iTCO_wdt` |
| AMD chipsets, including PC Engines APU boards | `sp5100_tco` |
| Virtual machines on QEMU, KVM and Proxmox VE, with a watchdog device | `i6300esb` |

:::note

Some recent Intel chipsets are not supported.

Watchdogs on Super I/O chips (Winbond/Nuvoton, ITE, Fintek) are not supported on purpose: the chipset watchdog covers the same systems in most cases.

VMware and Hyper-V do not provide a supported virtual watchdog.

:::

### Proxmox VE

Add a watchdog device to the virtual machine, then restart it. From the Proxmox VE shell:

    qm set <vmid> --watchdog model=i6300esb,action=reset

### PC Engines APU

If the watchdog option is enabled in the APU BIOS, it uses a chip that NethSecurity does not support, and the board resets after the BIOS timeout. Disable the watchdog in the BIOS: NethSecurity uses the chipset watchdog instead.

## Check the status

Show which watchdog is in use:

    dmesg | grep ns-watchdog

Example output:

    ns-watchdog: using sp5100_tco

Show the watchdog state:

    ubus call system watchdog

The `status` field is `running` when the watchdog is active.

## Disable the watchdog

To disable the watchdog permanently, run:

    uci set system.@system[0].watchdog=0
    uci commit system
    reboot

To enable it again, run:

    uci delete system.@system[0].watchdog
    uci commit system
    reboot

To stop the watchdog until the next reboot, run:

    ubus call system watchdog '{"magicclose":true,"stop":true}'

### Recover from a reset loop

If the system restarts continuously and you cannot reach the command line, disable the watchdog from the boot menu:

1. Connect a monitor and a keyboard, or a serial console.
2. At the boot menu, press `e` to edit the selected entry.
3. Append `ns.watchdog=0` at the end of the line that starts with `linux`.
4. Press `Ctrl+X` to boot.
5. Disable the watchdog permanently with the `uci` commands above.

## Software watchdog

If the hardware has no supported watchdog, you can use the software watchdog. It restarts the system when the processes stop responding, but not when the kernel itself hangs.

    uci set system.@system[0].watchdog_module=softdog
    uci commit system
    reboot
