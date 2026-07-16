---
title: "High Availability (HA)"
sidebar_position: 8
---
# High Availability (HA)

NethSecurity 8 natively includes **High Availability (HA)** in **active/passive** mode, designed to ensure firewall continuity through two nodes: a primary and a secondary.

The solution provides a redundant and reliable infrastructure, ensuring that traffic continues to be managed even in the event of failures or maintenance on the primary node.

Unlike the previous version in NethSecurity 7.9, installation and configuration can be carried out autonomously, without the need to send equipment to Nethesis laboratories.

Full documentation is available in the official manual: [High Availability](../administrator-manual/high-availability/ha_overview_features_limitations.md)

## Support limitations

The high availability service can be installed, configured, and managed using the available documentation alone, without any Nethesis involvement.

It is important to clarify, however, that **high availability is not included in the standard Nethesis product support**.

To receive assistance with this feature, you must purchase a dedicated package associated with your license.

**Without this package, no support of any kind can be provided for HA-related requests.**

In the coming months, HA will be enhanced with a user interface for status monitoring and, subsequently, for configuration. These features will also be accessible only to those who have purchased the dedicated package.

## Purchasing the HA package

The service can be purchased through the online shop: [High Availability – HA](https://nethshop.nethesis.it/product/alta-affidabilita-ha-ns8-2/)

For commercial information or clarification, contact the back office at sales@nethesis.it or by phone at +39 0721 1791157 (press 1 for sales).

**N.B.** The **package must be purchased before activation, not only when opening a support ticket**. This is necessary to ensure proper support during the activation phase and correct operation of the service.

Otherwise, the support team reserves the right to charge for support activities in addition to the service purchase.

## Upgrading from NethSecurity 7 HA to NethSecurity 8 HA

On NethSecurity 8, the HA service is managed commercially differently from NethSecurity 7: there is no annual fee, but a one-time activation cost.

If you are upgrading from NethSecurity 7 with HA to NethSecurity 8 with HA, follow these steps:

- Cancel the HA service on NethSecurity 7 to avoid being charged the fee the following year
- Purchase the HA package for NethSecurity 8, providing the Master server key to register the activation

| Feature | NethSecurity 7 | NethSecurity 8 |
|---|---|---|
| **Hardware** | Nethesis boxes only, from S60+ onwards (discontinued) | Nethesis current Z-series boxes only (Z1+, Z3+, Z7, Z7S, Z11) — Z5, Z9, and Z9+ also supported though no longer in catalog |
| **Installation** | Managed by Nethesis within 15 business days of configuration delivery | Configurable directly by the Partner |
| **Add HA later** | ✖ No | ✔ Yes |
| **Recurring fee** | ✔ Yes | ✖ No |
| **Activation cost** | ✖ No | ✔ Yes, but lower than the previous subscription fee |

## Supported boxes

When upgrading from NethSecurity 7 HA to NethSecurity 8 HA, some older-series models are also supported, **limited to units already deployed in the existing HA configuration**, specifically:

- S60+
- S120
- S150
- S200

Regarding fee equivalences:

- The S60+ model has a fee equivalent to the Z3+
- The S120, S150, and S200 models have a fee equivalent to the Z7 and Z11

The purchase can be completed in the Nethesis shop using the indicated equivalent models.
