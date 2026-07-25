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

---

## Why this exists

It all started when I encountered the Nostr protocol and realized it was possible to create decentralized applications without a central server.  
At that time, I wanted an easier way to build decentralized applications on Nostr the way.

---

## Design Philosophy

We build the two layer, "object" and "action".  
"Object" is how your application is, and  "Action" is how it changed.

## How to use

> For browsers, using NIP-07 is recommended.
```ts
import {AOP, NostrEventMapper, NostrPrivateKeySigner, NostrToolsRelay, hexToBytes, npubToHex, nsecToHex} from "./index.js";

const APP = "rock-paper-scissors"; //recommended uuid
const HEAD = {app:APP,auth:{publisher:npubToHex("npub")}};
const OWNER = npubToHex("npub");
const SECRET = nsecToHex("nsec");
const OWNER2 = npubToHex("npub");
const SECRET2 = nsecToHex("nsec");
const RELAY = "wss://b.imqutive.f5.si"; //Please replace

const aop = new AOP(new NostrEventMapper(), new NostrPrivateKeySigner(hexToBytes(SECRET)), new NostrToolsRelay(RELAY, 10000), OWNER);
const aop2 = new AOP(new NostrEventMapper(), new NostrPrivateKeySigner(hexToBytes(SECRET2)), new NostrToolsRelay(RELAY, 10000), OWNER2);

const game = await aop.createObjectData(HEAD,
  {
    type:"game.match",
    encrypted:false,
    metadata:{
      title:"Rock-paper-scissors"
    }
  });

await game.join({});
await game.invite(OWNER2, "all", {});

const game2 = await aop2.getObjectData(HEAD, game.data.object.id, game.data.object.owner);

await game.action(
  {
    type:"commit",
    metadata:{
      hash:"abc123"
    }
  });

await game.close();
aop.close();

```

