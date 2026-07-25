# nostr-aop

Application Object Protocol (AOP) SDK for Nostr.

**言語：** [英語](./README.md) | [日本語](./README_ja.md)

---

## 概要

nostr-aop は、Nostr上で 「分散アプリケーションなどの、ユーザー管理やイベント同期」 を実現する TypeScript SDKです。
> それらの機能を Application Object Protocol (AOP) と呼んでいます。

オブジェクト単位で状態同期を行い、

- Object作成
- Join / Leave
- Invite
- 権限管理
- Action
- History同期

などを統一的に扱えます。

> ⚠️ v0.1.x は初期リリースです。
>
> 現在は単一Relayのみ対応しています。
> 将来的に複数Relayへ対応予定です。

## インストール

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

## ライセンス

MIT

---

## 設計理由

Nostr というプロトコルと出会い、中央サーバーなしで分散アプリケーションを作成できると考えたのが始まりです。

---

## 設計

ObjectとActionという2つの層を考えます。  
Objectはアプリケーションの状態を、Actionはその変化を表します。

## 使い方

> ブラウザ向けでは NIP-07 を使用するのが推奨されます
```ts
import {AOP, NostrEventMapper, NostrPrivateKeySigner, NostrToolsRelay, hexToBytes, npubToHex, nsecToHex} from "./index.js";

const APP = "janken"; //recommended uuid
const HEAD = {app:APP,auth:{publisher:npubToHex("npub")}};
const OWNER = npubToHex("npub");
const SECRET = nsecToHex("nsec");
const OWNER2 = npubToHex("npub");
const SECRET2 = nsecToHex("nsec");
const RELAY = "wss://b.imqutive.f5.si";

const aop = new AOP(new NostrEventMapper(), new NostrPrivateKeySigner(hexToBytes(SECRET)), new NostrToolsRelay(RELAY, 10000), OWNER);
const aop2 = new AOP(new NostrEventMapper(), new NostrPrivateKeySigner(hexToBytes(SECRET2)), new NostrToolsRelay(RELAY, 10000), OWNER2);

const game = await aop.createObjectData(HEAD,
  {
    type:"game.match",
    encrypted:false,
    metadata:{
      title:"じゃんけん"
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
