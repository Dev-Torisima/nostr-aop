import './crypto.js';
import { finalizeEvent, getPublicKey, } from "nostr-tools";
export class NostrPrivateKeySigner {
    privateKey;
    constructor(privateKey) {
        this.privateKey = privateKey;
    }
    async getPublicKey() {
        return getPublicKey(this.privateKey);
    }
    async sign(event) {
        const signedEvent = finalizeEvent({
            created_at: event.created_at,
            kind: event.kind,
            tags: event.tags,
            content: event.content,
        }, this.privateKey);
        return signedEvent;
    }
}
//# sourceMappingURL=nostr-signer.js.map