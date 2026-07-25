# nostr-aop

Application Object Protocol (AOP) SDK for Nostr.

**Languages:** [English](./README.md) | [日本語](./README_ja.md)

---

## Overview

nostr-aop is a TypeScript SDK that implements the Application Object Protocol (AOP) over Nostr.

It provides synchronized objects with built-in support for:

- Object creation
- Join / Leave
- Invite
- Permission management
- Application actions
- History synchronization

> ⚠️ Early release (v0.1.x)
>
> Currently supports a single relay.
> Multi-relay support is planned.

## Installation

```bash
npm install nostr-aop
```

## Node.js

```ts
import { AOP } from "nostr-aop";
```

## Browser

```ts
import { AOP } from "nostr-aop/browser";
```

---

## License

MIT
