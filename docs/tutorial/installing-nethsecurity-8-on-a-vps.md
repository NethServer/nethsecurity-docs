---
title: "Installing on a VPS"
sidebar_position: 9
---

# Installing on a VPS

Some cloud providers do not allow you to upload a disk image directly to their servers, which can
make installing systems like NethSecurity 8 difficult.

You can work around this limitation by installing a Linux distribution (CentOS, Rocky, Alma,
Ubuntu, Fedora, Debian) that includes the `dd`, `zcat`, and `curl` tools.

These tools let you download, decompress, and write the image directly to the VPS disk.

## Main steps

1. Download the image: use `curl` to fetch the latest [stable image](../administrator-manual/installation/download.mdx).
2. Write the image to disk: decompress and write it directly to the VPS disk with `zcat` and `dd`.
3. Reboot the VPS: after the image write completes, reboot the machine to start NethSecurity.

## Example installation on a VPS (Digital Ocean)

The following is a practical example of how to install NethSecurity 8 on a Digital Ocean
Droplet.

**Note:** the disk device name may vary depending on the cloud provider. In this example it is
`/dev/vda`.

Use `lsblk` to list block devices and identify the VPS disk name.

1. Download the compressed NethSecurity image into the VPS `/tmp` directory:

   ```bash
   curl -o /tmp/nsec.img.gz "https://updates.nethsecurity.nethserver.org/stable/8-24.10.0-ns.1.6.0/targets/x86/64/nethsecurity-8-24.10.0-ns.1.6.0-x86-64-generic-squashfs-combined-efi.img.gz"
   ```

2. Decompress the image with `zcat` and write it directly to disk with `dd`.

   It is important to note that in this example the disk is `/dev/vda`. If the disk has a
   different name, for example `/dev/sda` or `/dev/nvme0n1`, adjust the command accordingly.

   ```bash
   zcat /tmp/nsec.img.gz 2>/dev/null | dd of=/dev/vda bs=1M iflag=fullblock conv=fsync status=progress
   ```

3. Reboot the machine

   ```bash
   reboot -f
   ```
