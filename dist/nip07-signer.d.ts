import type { Signer } from "./crypto.js";
import type { UnsignedNostrEvent, NostrEvent } from './event.js';
declare global {
    interface Window {
        nostr?: {
            getPublicKey(): Promise<string>;
            signEvent(event: UnsignedNostrEvent): Promise<NostrEvent>;
        };
    }
}
export declare class NIP07Signer implements Signer {
    getPublicKey(): Promise<string>;
    sign(event: UnsignedNostrEvent): Promise<NostrEvent>;
}
//# sourceMappingURL=nip07-signer.d.ts.map