export class NIP07Signer {
    async getPublicKey() {
        if (typeof window === "undefined")
            throw new Error("browser only");
        if (!window.nostr)
            throw new Error("The browser cannot handle window.nostr.");
        return window.nostr.getPublicKey();
    }
    async sign(event) {
        if (typeof window === "undefined")
            throw new Error("browser only");
        if (!window.nostr)
            throw new Error("The browser cannot handle window.nostr.");
        return await window.nostr.signEvent(event);
    }
}
//# sourceMappingURL=nip07-signer.js.map