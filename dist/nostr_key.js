import { nip19 } from "nostr-tools";
/**
 * npub1... → hex pubkey
 */
export function npubToHex(npub) {
    const decoded = nip19.decode(npub);
    if (decoded.type !== "npub") {
        throw new Error("Invalid npub");
    }
    return decoded.data;
}
/**
 * nsec1... → hex private key
 */
export function nsecToHex(nsec) {
    const decoded = nip19.decode(nsec);
    if (decoded.type !== "nsec") {
        throw new Error("Invalid nsec");
    }
    const bytes = decoded.data;
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}
export function hexToBytes(hex) {
    if (hex.length !== 64) {
        throw new Error("Invalid secret key length");
    }
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}
//# sourceMappingURL=nostr_key.js.map