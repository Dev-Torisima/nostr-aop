import './index.js';
import { verifyEvent } from 'nostr-tools';
export const AOP_PROTOCOL = "nostr-aop";
export const AOP_KIND = 1111; //31100;
export class NostrEventMapper {
    objectToEvent(object) {
        return {
            pubkey: object.object.owner,
            created_at: object.object.created_at,
            kind: AOP_KIND,
            tags: [
                ["t", AOP_PROTOCOL],
                ["a", object.app],
                ["d", object.object.id],
                ["k", "object"],
                ["z", object.object.type],
            ],
            content: JSON.stringify(object),
        };
    }
    ;
    actionToEvent(action) {
        return {
            kind: AOP_KIND,
            pubkey: action.action.actor,
            created_at: action.action.created_at,
            tags: [
                ["t", AOP_PROTOCOL],
                ["a", action.app],
                ["d", action.action.object_id],
                ["k", "action"],
                ["z", action.action.type]
            ],
            content: JSON.stringify(action)
        };
    }
    //kind : "action" or "object"
    create_Validator(kind, app, objetc_id, type) {
        return (event) => {
            let yu = verifyEvent(event);
            try {
                if (kind == "action") {
                    this.eventToAction(event);
                }
                else if (kind == "object") {
                    this.eventToObject(event);
                }
            }
            catch {
                yu = false;
            }
            if (!yu)
                return yu;
            event.tags.forEach((x) => {
                if (x[0] == "t")
                    yu = yu && (x[1] == AOP_PROTOCOL);
                else if (x[0] == "k")
                    yu = yu && (x[1] == kind);
                else if (x[0] == "z" && type)
                    yu = yu && (x[1] == type);
                else if (x[0] == "a" && app)
                    yu = yu && (x[1] == app);
                else if (x[0] == "d" && objetc_id)
                    yu = yu && (x[1] == objetc_id);
            });
            return yu;
        };
    }
    eventToObject(_event) {
        return JSON.parse(_event.content);
    }
    eventToAction(_event) {
        return JSON.parse(_event.content);
    }
}
//# sourceMappingURL=mapper.js.map