import type {UnsignedNostrEvent, NostrEvent} from './event.js'

//Abstract of event signer at least using pubkey
export interface Signer {

  getPublicKey(): Promise<string>;

  sign(
    event: UnsignedNostrEvent
  ): Promise<NostrEvent>;

}
