# ADR-0001: KeyBridge is a platform subsystem

## Status
Accepted

## Decision

Xiantron KeyBridge is implemented as a native XiantronOS security/identity subsystem while retaining an independently deployable product boundary.

## Rationale

This provides reusable phone-backed authentication outside XiantronOS while allowing XiantronOS to add deeper device trust, policy, audit, identity and automation capabilities.

## Security constraint

Biometric information never leaves the trusted mobile operating-system boundary. Hosts receive cryptographic authentication results, not biometric data.

## Initial scope

Android + Ubuntu over USB. Browser/WebAuthn and BLE follow only after the cryptographic foundation is tested.
