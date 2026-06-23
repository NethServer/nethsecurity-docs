---
title: "Nethesis Threat Shield"
sidebar_position: 13
---
# Nethesis Threat Shield

This module allows you to manage blacklists (open or commercial) **by blocking all traffic to/from specific malicious destinations**, contributing to significantly improve network security.
**Threat Shield** can be activated on **NethSecurity** 8 or on any NethServer Enterprise 7.9, whether NethService, NethVoice, or **NethSecurity**.

- If activated on **NethService/NethVoice**, Threat Shield will protect the specific server (so it can also be used in cloud environments without perimeter firewall)
- If activated on **NethSecurity** (7.9 or 8), it will protect the entire network

Threat Shield works through blacklists that can be of 2 types (each can be enabled independently):

- **IP Blacklist**
- **DNS Blacklist**

**IP Blacklist**
Threat Shield blocks all connections originating from or destined to specific IP addresses contained in the blacklists.
This type of blacklist is by far the most effective in combating traffic to and from malicious hosts.

**DNS Blacklist**
All DNS requests from clients are intercepted by **NethSecurity** and evaluated against the blacklists; all connections to domains in the blacklist are blocked.

## **YOROI blacklist sources**
The effectiveness of the Threat Shield module is directly linked to the quality of the blacklists. For this reason, Nethesis recommends using it with the blacklists provided by YOROI, typically available **only** in enterprise environments and to Nethesis partners on subscription.

YOROI blacklists are characterized by:
- High quality lists obtained from heterogeneous sources and subject to continuous analysis by specialists
- Maximum effectiveness against malware campaigns targeting the Italy/Europe geographical area
- Very high confidence level -> very low percentage of false positives

The confidence levels of these lists range from 1 to 3 and express the probability of false positives (unwanted blocks)
- Level 1 (10/10): extremely low probability of false positives
- Level 2 (8/10): low probability of false positives
- Level 3 (6/10): normal probability of false positives

N.B. The YOROI Blacklist package also includes Nethesis Level 3 Blacklists, which have proven to be very effective.

## **YOROI blacklist and number of devices to protect**
To use YOROI Blacklists, you need to purchase a license from the[**NethShop**](https://nethshop.nethesis.it/), one for each server that uses Yoroi blacklists.
The license cost is proportional to the number of devices protected and the license duration is annual.

Once you purchase the license, you need to communicate the System ID of the server where you want to activate the blacklists. This can be done in one of these 3 ways:
- adding the SystemID in the order notes
- replying to the email you will receive after completing your purchase
- sending an email directly to sales@nethesis.it

At that point, the server will be enabled to download YOROI blacklists.

The number of devices is evaluated based on the actual number of devices connected to the network, since this type of protection is applied to all of them, regardless of their more or less intensive use.
If a network (for example a BLUE lab network) is bypassed from threat shield filtering with specific exceptions, then it can be ignored from the count.

## How to enable YOROI blacklists on **NethSecurity**
Once the license is purchased, the Yoroi blacklists will appear among those available on **NethSecurity** and can be enabled, both in the IP and DNS sections.

Configure Threat Shield to download blacklists from this URL:

```
https://bl.nethesis.it/git/nethesis-blacklists
```
