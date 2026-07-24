import type { AOPAction } from "./action.js";
import type { Signer } from "./crypto.js";
import { NostrEventMapper } from "./mapper.js";
import type { NostrEvent } from './event.js';
import type { RelayClient } from "./relay.js";
import type { AOPObjectSchema, AOPHead, AOPAuth } from "./schema.js";
export declare class AOPObjectData {
    head: AOPHead;
    actor: string;
    data: AOPObject;
    mapper: NostrEventMapper;
    signer: Signer;
    relay: RelayClient;
    actions: NostrEvent[];
    pendings: NostrEvent[];
    private revokes;
    private waitings;
    static getDefaultSettings(): AOPObjectSet;
    setting: AOPObjectSet;
    constructor(head: AOPHead, actor: string, data: AOPObject, mapper: NostrEventMapper, signer: Signer, relay: RelayClient, setting?: AOPObjectSet);
    close(): Promise<void>;
    receive(event: NostrEvent): void;
    verifySystemed(_action: AOPAction): boolean;
    onchanged?: (event: AOPAction) => {};
    apply(event: NostrEvent): void;
    private apply_internal;
    action(input: {
        type: string;
        metadata: Record<string, unknown>;
    }): Promise<void>;
    private sys_action;
    join(metadata: Record<string, unknown>): Promise<void>;
    invite(target_pubkey: string, permission: string, metadata: Record<string, unknown>): Promise<void>;
    leave(metadata: Record<string, unknown>, from_close?: boolean): Promise<void>;
    changePermission(permission: string, metadata: Record<string, unknown>): Promise<void>;
    changePermissionIndividual(target_pubkey: string, permission: string, metadata: Record<string, unknown>): Promise<void>;
    private revoke;
    history(): NostrEvent[];
}
export interface AOPObjectSet {
    permission: {
        mode: string;
        invited: AOPPermission[];
    };
    users: string[];
    timeoutLimit: number;
    timeoutType: string;
    verifiedPubkey: string[];
}
export interface AOPPermission {
    pubkey: string;
    permission: string;
}
export interface AOPObject {
    protocol: string;
    version: number;
    app: string;
    auth: AOPAuth;
    object: AOPObjectSchema;
}
export declare function createObject({ head, type, owner, metadata, encrypted }: {
    head: AOPHead;
    type: string;
    owner: string;
    metadata: Record<string, unknown>;
    encrypted: boolean;
}): AOPObject;
//# sourceMappingURL=object.d.ts.map