import './crypto.js'

import {
  finalizeEvent,
  getPublicKey,
} from "nostr-tools";

import type { Signer } from "./crypto.js";
import type {UnsignedNostrEvent, NostrEvent} from './event.js'


export class NostrPrivateKeySigner implements Signer {

  constructor(
    private readonly privateKey: Uint8Array
  ) {}


  async getPublicKey(): Promise<string> {
    return getPublicKey(this.privateKey);
  }


  async sign(event: UnsignedNostrEvent): Promise<NostrEvent> {

    const signedEvent = finalizeEvent(
      {
        created_at: event.created_at,
        kind: event.kind,
        tags: event.tags,
        content: event.content,
      },
      this.privateKey
    );

    return signedEvent;
  }

}
