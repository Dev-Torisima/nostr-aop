import type { RelayClient } from "./relay.js";
import type { NostrEvent, NostrFilter } from "./event.js";
export declare class NostrToolsRelay implements RelayClient {
    private readonly url;
    private relay;
    private subs;
    constructor(url: string, publishTimeout?: number);
    connect(): Promise<void>;
    publish(event: NostrEvent): Promise<void>;
    query(filter: NostrFilter, validator: (event: NostrEvent) => boolean): Promise<NostrEvent[]>;
    subscribe(id: string, filter: NostrFilter, validator: (event: NostrEvent) => boolean, callback: (event: NostrEvent) => void): Promise<void>;
    unsubscribe(id: string): void;
    close(): void;
}
//# sourceMappingURL=nostr-relay.d.ts.map