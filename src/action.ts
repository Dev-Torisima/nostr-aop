import type {AOPHead, AOPAuth, AOPActionSchema} from './schema.js';
import {AOP_PROTOCOL} from "./mapper.js";

export interface AOPAction {
  protocol:string,

    version:number,

    app:string,

    auth:AOPAuth,

    systemed:boolean,
    systemag?:Record<string, unknown>,

    action:AOPActionSchema
}

export function createAction({
  head,
  object_id,
  type,
  actor,
  metadata,
  encrypted
}:{
    head:AOPHead
    object_id:string,
    type:string,
    actor:string,
    metadata:Record<string, unknown>,
    encrypted:boolean
}) : AOPAction{

  return {

    protocol:AOP_PROTOCOL,

    version:1,

    app:head.app,

    auth:head.auth,

    systemed:false,

    action:{
      id:crypto.randomUUID(),

      object_id,

      type,

      actor,

      created_at: Math.floor(Date.now()/1000),

      encrypted:encrypted,

      metadata
    }

  };

}
