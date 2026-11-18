---
title: "Hardware watchdog"
sidebar_position: 14
---

# Hardware watchdog

A hardware watchdog is a timer that resets the machine when the operating system stops responding. When the watchdog is active, NethSecurity refreshes it every 5 seconds: if the system hangs for more than 30 seconds, the watchdog restarts it without anyone having to power-cycle the box.

The watchdog is not active by default. To use it, install the driver that matches your hardware. The drivers are part of NethSecurity extra packages, available starting from NethSecurity 8.9.0, and can be installed from the command line.

## Choose the driver

Install **only one** driver, the one that matches your hardware. If more drivers are installed, NethSecurity may use a watchdog that cannot restart the machine.

| Hardware | Package |
|---|---|
| Intel chipsets with ICH or older PCH, many Atom and Celeron systems | `kmod-itco-wdt` |
| AMD chipsets, including PC Engines APU boards | `kmod-sp5100-tco` |
| Virtual machines on QEMU, KVM and Proxmox VE, with a watchdog device | `kmod-i6300esb-wdt` |
| Boards with a Winbond or Nuvoton Super I/O chip | `kmod-w83627hf-wdt` |
| Boards with an ITE Super I/O chip | `kmod-it87-wdt` |
| Boards with a Fintek Super I/O chip | `kmod-f71808e-wdt` |
| Any hardware, software watchdog | `kmod-softdog` |

If the hardware has a supported Intel or AMD chipset, prefer the chipset driver. Use a Super I/O driver only if the board documentation says that the watchdog is on that chip.

:::warning

Do not install `kmod-ib700-wdt` unless the machine is an IB700 single board computer. This driver does not check the hardware: on any other machine it hides the real watchdog, and the system is not restarted when it hangs.

:::

To identify the hardware, run:

    lspci -nn | grep -iE 'isa bridge|lpc|smbus|watchdog'

- An Intel `LPC Interface Controller` or `ISA bridge`: install `kmod-itco-wdt`.
- An AMD `FCH SMBus Controller`: install `kmod-sp5100-tco`.
- A `6300ESB Watchdog Timer`: install `kmod-i6300esb-wdt`.

:::note

Some recent Intel chipsets are not supported by `kmod-itco-wdt`.

The software watchdog restarts the system when the processes stop responding, but not when the kernel itself hangs. Use it only if the hardware has no supported watchdog.

VMware and Hyper-V do not provide a supported virtual watchdog.

:::

### Proxmox VE

Add a watchdog device to the virtual machine, then restart it. From the Proxmox VE shell:

    qm set <vmid> --watchdog model=i6300esb,action=reset

Then install `kmod-i6300esb-wdt` inside NethSecurity.

## Enable the watchdog

Install the driver, for example on a PC Engines APU:

    apk update
    apk add kmod-sp5100-tco

Then restart the system:

    reboot

To activate the watchdog without restarting, run:

    ubus call system watchdog '{"stop":false}'

## Check the status

Show the watchdog state:

    ubus call system watchdog

The `status` field is `running` when the watchdog is active. If it is `offline`, no watchdog driver is loaded.

To test that the watchdog restarts the machine, run:

    ubus call system watchdog '{"stop":true}'

The system restarts after about 30 seconds.

## Disable the watchdog

To stop the watchdog until the next reboot, run:

    ubus call system watchdog '{"magicclose":true,"stop":true}'

To disable it permanently, remove the driver and restart the system:

    apk del kmod-sp5100-tco
    reboot

:::note

If the system keeps restarting after the driver has been removed, the watchdog may have been started by the BIOS or firmware. Disable it in the BIOS setup.

:::

## System upgrade

The driver is an extra package: after a system upgrade it is reinstalled automatically, as described in [Restore extra packages](../system/updates.md#restore_extra_packages-section). The reinstall requires Internet access. The watchdog is active again after the next restart, or after running:

    ubus call system watchdog '{"stop":false}'
