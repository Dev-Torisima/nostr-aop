import './index.js'
import type {AOPObject} from './object.js'
import type {AOPAction} from './action.js'
import type {NostrEvent, UnsignedNostrEvent} from './event.js'
import {verifyEvent} from 'nostr-tools';

export const AOP_PROTOCOL = "nostr-aop";
export const AOP_KIND = 1111;//31100;

export class NostrEventMapper {

  objectToEvent(object: AOPObject): UnsignedNostrEvent {
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
};

  actionToEvent(action: AOPAction): UnsignedNostrEvent {
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
  create_Validator(kind:string, app?:string, objetc_id?:string, type?:string)
  {
    return (event:NostrEvent) => 
      {
        let yu = verifyEvent(event);

        try
          {
        if (kind == "action")
        {
          this.eventToAction(event);
        }
        else if (kind == "object")
        {
this.eventToObject(event);
        }
          }
          catch
          {
            yu = false;
          }
          if (!yu) return yu;


        event.tags.forEach((x)=>
          {
            if (x[0] == "t") yu = yu && (x[1] == AOP_PROTOCOL);
            else if (x[0] == "k") yu = yu && (x[1] == kind);
            else if (x[0] == "z" && type) yu = yu && (x[1] == type);
            else if (x[0] == "a" && app) yu = yu && (x[1] == app);
            else if (x[0] == "d" && objetc_id) yu = yu && (x[1] == objetc_id);
          });


          return yu;
      };
  }

  eventToObject(_event: NostrEvent): AOPObject {
  return JSON.parse(_event.content);
}

  eventToAction(_event: NostrEvent): AOPAction {
    return JSON.parse(_event.content);
  }

}