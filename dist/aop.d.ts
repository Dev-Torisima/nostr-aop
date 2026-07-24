import { AOPObjectData } from "./object.js";
import type { RelayClient } from "./relay.js";
import type { Signer } from "./crypto.js";
import { NostrEventMapper } from "./mapper.js";
import type { AOPHead } from "./schema.js";
export declare class AOP {
    private mapper;
    private signer;
    private relay;
    owner: string;
    constructor(mapper: NostrEventMapper, signer: Signer, relay: RelayClient, owner: string);
    createObjectData(head: AOPHead, input: {
        type: string;
        encrypted: boolean;
        metadata?: Record<string, unknown>;
    }): Promise<AOPObjectData>;
    getObjectData(head: AOPHead, object_id: string, object_owner?: string): Promise<AOPObjectData>;
    close(): void;
}
//# sourceMappingURL=aop.d.ts.map