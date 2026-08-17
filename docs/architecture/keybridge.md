# Xiantron KeyBridge™ Architecture

## Purpose

Xiantron KeyBridge is the identity/authenticator bridge within XiantronOS. It can also operate as an independent product. Its purpose is to let a trusted mobile device act as a hardware-backed authenticator for a computer without transferring biometric data to the computer.

## Security boundary

```text
Phone biometric / device unlock
        ↓
Mobile trusted execution + hardware-backed credential
        ↓
Cryptographic operation
        ↓
KeyBridge transport
        ↓
XiantronOS / compatible host
```

Raw biometric data must never be transmitted to XiantronOS, the host, KeyBridge cloud services, or a relying party.

## Initial implementation

Milestone 0.1 targets Android + Ubuntu over USB:

1. Establish device discovery and pairing.
2. Establish an authenticated encrypted channel.
3. Generate/use a hardware-backed credential on Android where supported.
4. Require Android user verification before sensitive signing operations.
5. Sign a host-issued challenge.
6. Verify the signature on Ubuntu.
7. Emit a security event into XiantronOS.

Browser/WebAuthn integration is deliberately deferred until this foundation is proven.

## Planned transports

- USB first.
- Bluetooth Low Energy second.
- NFC where appropriate.

The transport layer must remain independent from the authenticator protocol.

## Standards direction

The implementation should target the FIDO2/WebAuthn ecosystem and CTAP2-compatible authenticator concepts rather than inventing a proprietary browser authentication protocol.

## XiantronOS integration

KeyBridge integrates with IdentityOS, SecurityOS, Trust, Policy, Audit and GaldorCore. Device trust is an input to policy evaluation, not an opaque authorization score.

Example event:

`security.keybridge.authenticated`

The event may update device/session trust and trigger policy evaluation, but authentication state must remain explicitly attributable and auditable.

## Independent product model

KeyBridge remains usable without XiantronOS. XiantronOS provides deeper identity, trust, policy, automation and device-management integration.

## Commercial tiers

The product architecture should support Free, Plus, Pro, Business and Enterprise capabilities without making the core authentication primitive unnecessarily unusable for free users.
