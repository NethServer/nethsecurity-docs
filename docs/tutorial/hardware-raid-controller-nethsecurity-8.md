---
title: "Hardware RAID controller"
sidebar_position: 7
---
# Hardware RAID controller

You can install NethSecurity 8 on enterprise-class hardware, but it's important to consider certain driver compatibility limitations, particularly with hardware RAID controllers.

NethSecurity 8 is based on a minimalist distribution that does not include all the proprietary drivers found in general-purpose operating systems.

### NethSecurity 8 Boots from USB but `ns-install` Does Not Detect Storage

This behavior is typical when the server's RAID controller is not recognized by the system.
This usually happens because the controller:
- is not supported out-of-the-box
- requires specific drivers not included in the installation image.

### Possible Solutions

#### **Set the RAID controller to HBA mode (Host Bus Adapter)**
If the controller supports it, setting it to HBA mode exposes the disks directly to the system, avoiding the need for specific drivers.

#### **Check for an Integrated SATA Controller**
Some servers include a basic (non-RAID) SATA controller. If available, connect the disk directly to this controller.

#### **Use a Hypervisor**
As a last resort, install NethSecurity as a virtual machine (e.g. with Proxmox or VMware ESXi) and assign a virtual disk, bypassing direct hardware RAID management.
