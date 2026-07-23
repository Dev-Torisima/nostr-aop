import {createAction} from "./action.js";
import type {AOPAction} from "./action.js";
import type {Signer} from "./crypto.js"
import {generateId} from "./id.js";
import {NostrEventMapper, AOP_KIND, AOP_PROTOCOL} from "./mapper.js";
import type {NostrEvent} from './event.js'
import type {RelayClient} from "./relay.js"
import type {AOPObjectSchema, AOPHead, AOPAuth} from "./schema.js";

export class AOPObjectData {

  public actions:NostrEvent[]=[];
  public pendings:NostrEvent[]=[];
  private revokes = new Map<string, string>();
  private waitings = new Map<string, {resolver:(value:void)=>void, timeoutr:ReturnType<typeof setTimeout>}>();

  public static getDefaultSettings() : AOPObjectSet
  {
    return {
        permission:{
          mode:"invite",
          invited:[]
        },
        users : [],
        timeoutLimit: 30000,
        timeoutType: "reject",
        verifiedPubkey : []
      };
  }
  public setting:AOPObjectSet = AOPObjectData.getDefaultSettings();

  constructor(
    public head:AOPHead,
    public actor:string,
    public data:AOPObject,
    public mapper:NostrEventMapper,
    public signer:Signer,
    public relay:RelayClient,
    setting? : AOPObjectSet
  ){
    if (setting) this.setting = setting;
    this.setting.permission.invited.push({pubkey:data.object.owner, permission:"all"});

    const filter = {
  kinds: [AOP_KIND]
};
    this.relay.subscribe(this.data.object.id, filter, mapper.create_Validator("action", this.data.app, this.data.object.id), (e) => {this.receive(e);});
  }

  //including leave()
  async close()
  {
    this.relay.unsubscribe(this.data.object.id);
    await this.leave({}, true);
  }

  receive(event:NostrEvent) : void
  {
    let _action: AOPAction = this.mapper.eventToAction(event);

     //check object
    if (_action.action.object_id != this.data.object.id) return;

     //check app
    if (_action.app != this.data.app) return;

    //check correct pubkey(hex)
    if (!/^[0-9a-f]{64}$/i.test(_action.action.actor)) return;

    //check equal of event.pubkey and action.actor, excluding the registerd pubkey.
    if (!this.setting.verifiedPubkey.includes(event.pubkey))
    {
      if (_action.action.actor != event.pubkey) return;
    }

    let ispend = false;

    if (_action.systemed)
    {
        //systemed allows those being able to access due to not invited to log this event, because of a system log including "invite", access change or etc.

      if (!this.verifySystemed(_action)) return;
    }
    else
    {
      ispend = !this.setting.users.includes(event.pubkey);
    }

    let isexist = false;
    this.actions.forEach(e => {isexist = isexist || (event.id == e.id);})
    if (isexist) return;

    this.actions.push(event);
    if (ispend)
    {
      this.pendings.push(event);
    }
    else
    {
    this.apply(event);
    }
  }

  verifySystemed(_action:AOPAction) : boolean
  {
    if (_action.action.type == "join" 
      || _action.action.type == "leave")
    {
       return true;
    }
    else if (_action.action.type == "invite" 
      || _action.action.type == "chmodI")
    {
      if (_action.systemag)
      {
        if (_action.systemag.permission && typeof(_action.systemag.permission) == "string" && _action.systemag.target && typeof(_action.systemag.target) == "string")
        {
          return /^[0-9a-f]{64}$/i.test(_action.systemag.target) && (_action.systemag.permission == "all" || _action.systemag.permission == "limited");//check correct pubkey(hex) and permission format
        }
      }
    }
    else if (_action.action.type == "chmod")
    {
      if (_action.systemag)
      {
        if (_action.systemag.permission && typeof(_action.systemag.permission) == "string")
        {
          return (_action.systemag.permission == "all" || _action.systemag.permission == "limited" ||  _action.systemag.permission == "invite");//permission format
        }
      }
    }
    else if (_action.action.type == "revoke")
    {
      if (_action.systemag)
      {
        if (_action.systemag.event_id && typeof(_action.systemag.event_id) == "string")
        {
          this.revokes.set(_action.systemag.event_id, _action.action.actor);
          //Always returns as disabled action for removing this.
        }
      }
    }
    
    //disabled action
    return false;
  }

  public onchanged? : (event : AOPAction) => {};

  //apply event
  apply(event:NostrEvent) : void
  {
    let ped : NostrEvent[] = [];
    for (let index = this.pendings.length - 1; index >= 0; index--) 
    {
      if (this.pendings[index]!.created_at <= event.created_at)
      {
        ped.push(this.pendings[index]!);
        this.pendings.splice(index, 1);
      }
    }
    ped.push(event);
    ped.sort((a, b) => 
      {
        if (a.created_at != b.created_at)
        {
          return a.created_at - b.created_at;
        }
        return a.id.localeCompare(b.id);
      });
    ped.forEach(x => this.apply_internal(x));

    ped = [];
    for (let index = this.pendings.length - 1; index >= 0; index--) 
    {
      if (this.pendings[index]!.id != event.id)
      {
        ped.push(this.pendings[index]!);
        this.pendings.splice(index, 1);
      }
    }
    ped.sort((a, b) => 
      {
        if (a.created_at != b.created_at)
        {
          return a.created_at - b.created_at;
        }
        return a.id.localeCompare(b.id);
      });
    ped.forEach(x => this.apply_internal(x));
  }

  private apply_internal(event:NostrEvent) : void
  {    
    let e : AOPAction = this.mapper.eventToAction(event);

    const isrevoking = this.revokes.get(event.id);
    if (isrevoking)
    {
      if (e.action.actor == isrevoking)
      {
        return;//skip
      }
      else
      {
        this.revokes.delete(event.id);
      }
    }


    if (e.systemed)
    {
      if (e.action.type == "join")
      {
        let isOk = this.setting.permission.mode != "invite";
        if (!isOk)
        {
          //equals <this.setting.permission.mode == "invite">
          this.setting.permission.invited.forEach(x => { isOk = isOk || x.pubkey == e.action.actor; });
        }
        if (isOk /*&& this.setting.users.includes(e.action.actor)*/) this.setting.users.push(e.action.actor);
        else this.pendings.push(event);
        //PENDING REASON = ("The \"join\" event is denyed, due to not invited user.")
      }
      else 
      {
        if (!this.setting.users.includes(e.action.actor)) this.pendings.push(event);//PENDING REASON = ("Not joined user")
        else
        {
          let per = this.setting.permission.mode;
          if (per == "invite") this.setting.permission.invited.forEach(x => { if (x.pubkey == e.action.actor) {per = x.permission;} });

          if (e.action.type == "invite")
          {
            if (per == "all")
            {
              if (e.systemag && e.systemag.permission && typeof(e.systemag.permission) == "string" && e.systemag.target && typeof(e.systemag.target) == "string") 
              {
                this.setting.permission.invited.push({ pubkey:e.systemag.target, permission:e.systemag.permission});
              }
            else throw new Error("The apply method should not be directly used.");
          }
          else this.pendings.push(event);//permission lack
        }
        else if (e.action.type == "leave")
        {
          const loc = this.setting.users.findIndex(x => x == e.action.actor);
          if (loc != -1) this.setting.users.splice(loc, 1);
          else this.pendings.push(event);//user not found
        }
        else if (e.action.type == "chmod")
        {
          if (per == "all")
          {
            if (e.systemag && e.systemag.permission && typeof(e.systemag.permission) == "string") 
            {
              this.setting.permission.mode = e.systemag.permission;
            }
            else throw new Error("The apply method should not be directly used.");
          }
          else this.pendings.push(event);//permission lack
        }
        else if (e.action.type == "chmodI")
        {
          if (per == "all")
          {
            if (e.systemag && e.systemag.permission && typeof(e.systemag.permission) == "string" && e.systemag.target && typeof(e.systemag.target) == "string") 
            {
              let done = false;
              this.setting.permission.invited.forEach((x, i1, i2) => { if (x.pubkey == e.systemag!.target){ done = true; i2[i1]!.permission = e.systemag!.permission as string; } });
              if (!done) this.pendings.push(event);//not exist user
            }
            else throw new Error("The apply method should not be directly used.");
        }
            else { this.pendings.push(event);}//permission lack
          }
          else if (e.action.type == "revoke")
          {
            throw new Error("Internal Error");
          }
        }
      }
    }
    else
    {
      if (!this.setting.users.includes(e.action.actor)) this.pendings.push(event);//user not found
    }

    let isPending = this.pendings.some(x => x.id == event.id);
    if (!isPending && this.onchanged) 
    {
      this.onchanged(e);
      isPending = this.pendings.some(x => x.id == event.id);
    }

    if (!isPending)
    {
      const waiter = this.waitings.get(event.id);
      if (waiter)
      {
        this.waitings.delete(event.id);
        clearTimeout(waiter.timeoutr);
        waiter.resolver();
      }
    }
  }

  async action(
    input: {
      type: string;
      metadata: Record<string, unknown>;
    }
  ): Promise<void> {

  await this.sys_action(input, false);
}

private async sys_action(
    input: {
      type: string;
      metadata: Record<string, unknown>;
    },
    systemed:boolean,
    arge?:Record<string, unknown>,
    timeoutDisable?:boolean
  ): Promise<void> {
    if (timeoutDisable == undefined || timeoutDisable == null)
    {
      timeoutDisable = false;
    }

  let action = createAction({head:this.head, object_id:this.data.object.id, type:input.type, actor:this.actor, metadata:input.metadata, encrypted:this.data.object.encrypted});

  if (systemed) 
  {
    action.systemed = systemed;
    if (arge) action.systemag = arge;
  }

  const unsigned =
    this.mapper.actionToEvent(
      action
    );


  const signed =
    await this.signer.sign(
      unsigned
    );

  let promise;

  if (timeoutDisable)
  {
    promise = new Promise<void>((resolve)=>{resolve();});
  }
  else 
  {
    promise = new Promise<void>((resolve, reject)=>{
        const timeoutr = setTimeout(()=>{
          this.waitings.delete(signed.id);
          if (this.setting.timeoutType == "resolve") 
          {
            const existed = this.actions.some(x => x.id == signed.id);
            if (!existed)
            {
              this.actions.push(signed);
            this.apply(signed);
            }
            resolve();
          }
          else if (this.setting.timeoutType == "wait") 
          {
            resolve();
          }
          else 
          {
            this.revokes.set(signed.id, this.mapper.eventToAction(signed).action.actor);
            this.revoke(signed.id);
            reject(new Error("Timeout"));
          }
        },this.setting.timeoutLimit)
        this.waitings.set(signed.id,{resolver:resolve,timeoutr:timeoutr});
    });
  }

  await this.relay.publish(
    signed
  );

  return promise;
}


  async join(metadata: Record<string, unknown>)
  {
    await this.sys_action({type:"join", metadata:metadata}, true);
  }

  async invite(target_pubkey : string, permission : string, metadata: Record<string, unknown>)
  {
    await this.sys_action({type:"invite", metadata:metadata}, true, { target:target_pubkey, permission : permission });
  }

  //"leave" action
  async leave(metadata: Record<string, unknown>, from_close?:boolean)
  {
    await this.sys_action({type:"leave", metadata:metadata}, true, undefined, from_close);
  }

  //"chmod" action
  async changePermission(permission : string, metadata: Record<string, unknown>)
  {
    await this.sys_action({type:"chmod", metadata:metadata}, true, { permission : permission });
  }

  //"chmodI" action
  async changePermissionIndividual(target_pubkey : string, permission : string, metadata: Record<string, unknown>)
  {
    await this.sys_action({type:"chmodI", metadata:metadata}, true, { target:target_pubkey, permission : permission });
  }

  //"revoke" limited use action
  private async revoke(event_id : string)
  {
    await this.sys_action({type:"revoke", metadata:{}}, true, { event_id:event_id }, true);
  }


  history(){

    return this.actions;

  }


}

export interface AOPObjectSet
{
  permission : {
    mode: string,//"all" or "limited" or "invite"
    invited: AOPPermission[]//
  },
  users : string[],//pubkey list
  timeoutLimit : number,//duration of timeout
  timeoutType : string,//"reject" or "resolve" or "wait"
  verifiedPubkey : string[]//Shoud not use, this is to exclude verifying equal of event.pubkey and action.actor 
}

export interface AOPPermission
{
  pubkey:string,
  permission:string//"all" or "limited"
}

export interface AOPObject {
  protocol:string,

    version:number,

    app:string,

    auth:AOPAuth,

    object:AOPObjectSchema
}


export function createObject({
  head,
  type,
  owner,
  metadata,
  encrypted
}:{
    head:AOPHead,
    type:string,
    owner:string,
    metadata:Record<string, unknown>,
    encrypted:boolean
}) : AOPObject{

  return {

    protocol:AOP_PROTOCOL,

    version:1,

    app:head.app,
    auth:head.auth,

    object:{
      id:generateId(),

      type,

      owner,

      created_at: Math.floor(Date.now()/1000),

      status:"active",

      encrypted:encrypted,

      metadata
    }

  };

}
