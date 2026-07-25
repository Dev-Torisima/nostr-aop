# nostr-aop

Application Object Protocol (AOP) SDK for Nostr.

**Languages:** [English](./README.md) | [日本語](./README_ja.md)

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
