import { AOPObjectData, createObject } from "./object.js";
import { NostrEventMapper, AOP_KIND } from "./mapper.js";
export class AOP {
    mapper;
    signer;
    relay;
    owner;
    constructor(mapper, signer, relay, owner //me
    ) {
        this.mapper = mapper;
        this.signer = signer;
        this.relay = relay;
        this.owner = owner;
    }
    async createObjectData(head, input) {
        let result = new AOPObjectData(head, this.owner, createObject({ head: head, type: input.type, owner: this.owner, metadata: (input.metadata ?? {}), encrypted: input.encrypted }), this.mapper, this.signer, this.relay);
        const unsigned = this.mapper.objectToEvent(result.data);
        const signed = await this.signer.sign(unsigned);
        await this.relay.publish(signed);
        return result;
    }
    async getObjectData(head, object_id, object_owner) {
        const filter = {
            kinds: [AOP_KIND]
        };
        const red = await this.relay.query(filter, this.mapper.create_Validator("object", head.app, object_id));
        let correct = undefined;
        red.forEach(x => {
            if (object_owner) {
                if (x.pubkey != object_owner)
                    return;
            }
            correct = x;
        });
        if (!correct)
            throw "AOPObject is not found in this environment.";
        return new AOPObjectData(head, this.owner, this.mapper.eventToObject(correct), this.mapper, this.signer, this.relay);
    }
    close() {
        this.relay.close();
    }
}
//# sourceMappingURL=aop.js.map