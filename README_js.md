#nostr-aop
## 概要

nostr-aop は、Nostr上で Application Object Protocol (AOP) を実現する TypeScript SDKです。

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

