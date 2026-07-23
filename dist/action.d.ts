import type { AOPHead, AOPAuth, AOPActionSchema } from './schema.js';
export interface AOPAction {
    protocol: string;
    version: number;
    app: string;
    auth: AOPAuth;
    systemed: boolean;
    systemag?: Record<string, unknown>;
    action: AOPActionSchema;
}
export declare function createAction({ head, object_id, type, actor, metadata, encrypted }: {
    head: AOPHead;
    object_id: string;
    type: string;
    actor: string;
    metadata: Record<string, unknown>;
    encrypted: boolean;
}): AOPAction;
//# sourceMappingURL=action.d.ts.map