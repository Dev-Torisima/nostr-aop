import './index.js';
import type { AOPObject } from './object.js';
import type { AOPAction } from './action.js';
import type { NostrEvent, UnsignedNostrEvent } from './event.js';
export declare const AOP_PROTOCOL = "nostr-aop";
export declare const AOP_KIND = 1111;
export declare class NostrEventMapper {
    objectToEvent(object: AOPObject): UnsignedNostrEvent;
    actionToEvent(action: AOPAction): UnsignedNostrEvent;
    create_Validator(kind: string, app?: string, objetc_id?: string, type?: string): (event: NostrEvent) => boolean;
    eventToObject(_event: NostrEvent): AOPObject;
    eventToAction(_event: NostrEvent): AOPAction;
}
//# sourceMappingURL=mapper.d.ts.map