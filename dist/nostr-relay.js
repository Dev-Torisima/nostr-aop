import { Relay, Subscription } from "nostr-tools/relay";
export class NostrToolsRelay {
    url;
    relay;
    subs = new Map();
    constructor(url, publishTimeout) {
        this.url = url;
        this.relay = new Relay(url);
        if (publishTimeout)
            this.relay.publishTimeout = publishTimeout;
    }
    async connect() {
        await this.relay.connect();
    }
    async publish(event) {
        if (!this.relay.connected) {
            await this.connect();
        }
        await this.relay.publish(event);
    }
    async query(filter, validator) {
        if (!this.relay.connected) {
            await this.connect();
        }
        const events = [];
        return new Promise((resolve) => {
            const sub = this.relay.subscribe([filter], {});
            sub.onevent = (event) => { if (validator(event)) {
                events.push(event);
            } };
            sub.oneose = () => { sub.close(); resolve(events); };
        });
    }
    async subscribe(id, filter, validator, callback) {
        if (!this.relay.connected) {
            await this.connect();
        }
        if (this.subs.has(id)) {
            this.unsubscribe(id);
        }
        const sub = this.relay.subscribe([filter], {});
        sub.onevent = (event) => { if (validator(event)) {
            callback(event);
        } };
        this.subs.set(id, sub);
    }
    unsubscribe(id) {
        const v = this.subs.get(id);
        if (!v)
            return;
        v.close();
        this.subs.delete(id);
    }
    close() {
        this.subs.forEach((x) => {
            x.close();
        });
        this.subs.clear();
        this.relay.close();
    }
}
//# sourceMappingURL=nostr-relay.js.map