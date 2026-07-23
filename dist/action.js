import { AOP_PROTOCOL } from "./mapper.js";
export function createAction({ head, object_id, type, actor, metadata, encrypted }) {
    return {
        protocol: AOP_PROTOCOL,
        version: 1,
        app: head.app,
        auth: head.auth,
        systemed: false,
        action: {
            id: crypto.randomUUID(),
            object_id,
            type,
            actor,
            created_at: Math.floor(Date.now() / 1000),
            encrypted: encrypted,
            metadata
        }
    };
}
//# sourceMappingURL=action.js.map