import type {UnsignedNostrEvent, NostrEvent} from './event.js'

export interface Signer {

  getPublicKey(): Promise<string>;

  sign(
    event: UnsignedNostrEvent
  ): Promise<NostrEvent>;

}
