export interface AOPHead {
    app: string;
    auth: AOPAuth;
}
export interface AOPAuth {
    publisher: string;
    signature?: string;
}
export interface AOPObjectSchema {
    id: string;
    type: string;
    owner: string;
    created_at: number;
    status: "active" | "closed";
    encrypted: boolean;
    metadata: Record<string, unknown>;
}
export interface AOPActionSchema {
    id: string;
    object_id: string;
    type: string;
    actor: string;
    created_at: number;
    encrypted: boolean;
    metadata: Record<string, unknown>;
}
//# sourceMappingURL=schema.d.ts.map