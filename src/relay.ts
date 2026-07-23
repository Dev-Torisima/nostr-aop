import type {NostrEvent, NostrFilter} from './event.js'

export interface RelayClient {
  publish(event: NostrEvent): Promise<void>;

  query(filter: NostrFilter,validator: (event:NostrEvent)=>boolean): Promise<NostrEvent[]>;

  subscribe(
    id:string,
    filter: NostrFilter,
    validator: (event:NostrEvent)=>boolean,
    callback: (event: NostrEvent) => void
  ): Promise<void>;

  unsubscribe(
    id:string,
  ): void;

  close() : void;
}
