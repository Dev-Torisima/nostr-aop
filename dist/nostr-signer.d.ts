import './crypto.js';
import type { Signer } from "./crypto.js";
import type { UnsignedNostrEvent, NostrEvent } from './event.js';
export declare class NostrPrivateKeySigner implements Signer {
    private readonly privateKey;
    constructor(privateKey: Uint8Array);
    getPublicKey(): Promise<string>;
    sign(event: UnsignedNostrEvent): Promise<NostrEvent>;
}
//# sourceMappingURL=nostr-signer.d.ts.map