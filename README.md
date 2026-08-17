# XiantronOS™

XiantronOS is the modular platform operating layer for the Xiantron ecosystem.

At its center is **GaldorCore™**, the orchestration core coordinating identity, security, data, policy, events, memory, agents and applications.

## Architecture

```text
XiantronOS
└── GaldorCore
    ├── Identity
    ├── Security
    ├── Data
    ├── Policy / Events / State
    └── Agent Runtime
        ├── LeadOS
        ├── AgentOS
        └── HiveOS
```

Xiantron Universe is an application layer and must not become a dependency of the platform.

## KeyBridge

**Xiantron KeyBridge™** is a native security/identity subsystem that can also operate independently. Its first target is Android + Ubuntu over USB, using the phone's trusted biometric and hardware-backed credentials without transmitting biometric data to the host.

See `docs/architecture/keybridge.md` and `docs/decisions/0001-keybridge-as-platform-subsystem.md`.

## Development principle

Build incrementally. Establish contracts, tests, security boundaries and documentation before expanding functionality.
