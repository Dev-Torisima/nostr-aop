import type { Signer } from "./crypto.js";
import type {UnsignedNostrEvent, NostrEvent} from './event.js'

declare global {
  interface Window {
    nostr?: {
      getPublicKey(): Promise<string>;
      signEvent(event: UnsignedNostrEvent): Promise<NostrEvent>;
    };
  }
}

export class NIP07Signer implements Signer {
  async getPublicKey(): Promise<string> {
    if (typeof window === "undefined") throw new Error("browser only");
    if (!window.nostr) throw new Error("The browser cannot handle window.nostr.");
    return window.nostr.getPublicKey();
  }

  async sign(
    event: UnsignedNostrEvent
  ): Promise<NostrEvent> {
    if (typeof window === "undefined") throw new Error("browser only");
    if (!window.nostr) throw new Error("The browser cannot handle window.nostr.");
    return await window.nostr.signEvent(event);

  }

}
