import { Relay, Subscription } from "nostr-tools/relay";

import type { RelayClient } from "./relay.js";
import type { NostrEvent, NostrFilter } from "./event.js";

export class NostrToolsRelay implements RelayClient {
  private relay;
  private subs = new Map<string, Subscription>();


  constructor(
    private readonly url: string,
    publishTimeout? : number
  ) {
    this.relay = new Relay(url);
    if (publishTimeout) this.relay.publishTimeout = publishTimeout;
  }


  async connect() {
    await this.relay.connect();
  }


  async publish(
    event: NostrEvent
  ): Promise<void> {
if (!this.relay.connected) { await this.connect(); }
    
    await this.relay.publish(event);
  }


  async query(
    filter: NostrFilter,
    validator: (event:NostrEvent)=>boolean
  ): Promise<NostrEvent[]> {
    if (!this.relay.connected) { await this.connect(); }

    const events: NostrEvent[] = [];

    return new Promise((resolve) => {

      const sub = this.relay.subscribe(
        [filter],{}
      );
sub.onevent = (event) => {if (validator(event)){events.push(event);}};
sub.oneose = () => { sub.close(); resolve(events); };
  });
  }


  async subscribe(
    id:string,
    filter: NostrFilter,
    validator: (event:NostrEvent)=>boolean,
    callback: (event: NostrEvent)=>void
  ) {

if (!this.relay.connected) { await this.connect(); }

if(this.subs.has(id)){
  this.unsubscribe(id);
}

    const sub = this.relay.subscribe(
    [filter],
    {}
  );

  sub.onevent = (event) => { if (validator(event)) { callback(event); } };

  this.subs.set(id, sub);
  }

  unsubscribe(id:string)
  {
    const v = this.subs.get(id);
    if (!v) return;
    v.close();
    this.subs.delete(id);
  }


  close() {
    this.subs.forEach((x)=>
      {
        x.close();
      });
    this.subs.clear();
    this.relay.close();
  }

}