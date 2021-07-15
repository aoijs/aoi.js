const fs = require('fs')
const AoiError = require('./AoiError.js')
const BaseClient = require('./base.js')
const {Collection} = require('discord.js') 
class Client extends BaseClient {
    constructor(options){
        super(options);
        this.aoiOptions = options
        this.cmd = {
// {@GUILD_MESSAGES_INTENTS}
            default : new Collection() ,
            awaited: new Collection(),
            messageDelete: new Collection(),
            messageUpdate: new Collection(),
            messageDeleteBulk: new Collection,
// {@GUILDS_INTENTS}  
            guildJoin: new Collection(),
            guildUpdate: new Collection(),
            guildLeave: new Collection(),
            guildUnavailable:new Collection(),

            roleCreate: new Collection(),
            roleUpdate: new Collection(),
            roleDelete: new Collection(),
            channelCreate: new Collection(),
            channelUpdate: new Collection(),
            channelDelete: new Collection(),
            channelPinsUpdate: new Collection(),
            stageInstanceCreate:new Collection(),
            stageInstanceUpdate:new Collection(),
            stageInstanceDelete:new Collection(),
            threadCreate: new Collection(),
            threadDelete: new Collection(),
            threadListSync: new Collection(),
            threadMemberUpdate: new Collection(),
            threadMembersUpdate : new Collection(),
            threadUpdate: new Collection(),
//{@GUILD_MEMBERS_INTENT}
            join: new Collection(),
            leave: new Collection(),
            memberUpdate:new Collection(),
            memberAvailable: new Collection(),
            membersChunk: new Collection(),
//{@GUILD_EMOJIS_INTENT}
            emojiCreate:new Collection(),
            emojiUpdate:new Collection(),
            emojiDelete: new Collection(),
//{@GUILD_BANS_INTENTS}
            banAdd: new Collection(),
            banRemove: new Collection(),
//{@GUILD_INTEGRATIONS_INTENTS}
//THIS INTENT IS FR USELESS 
//{@GUILD_WEBHOOKS_INTENT}
            webhookUpdate: new Collection(),
//{@GUILD_INVITES_INTENTS}
            inviteCreate:new Collection(),
            inviteDelete:new Collection(),
//{@GUILD_VOICE_STATES_INTENT}
            voiceStateUpdate:new Collection(),
//{@GUILD_PRESENCES_INTENT}
            presenceUpdate:new Collection(),
//{@GUILD_MESSAGE_REACTIONS}
            reactionAdd: new Collection(),
            reactionRemove: new Collection(),
            reactionRemoveEmoji: new Collection(),
            reactionRemoveAll: new Collection(),
//{@GUILD_MESSAGE_TYPING_INTENT}
            typingStart:new Collection(),
//{@Custom}
            loop: new Collection(),
            timeout: new Collection(),
            pulse: new Collection(),
            ready: new Collection(),
            variableCreate: new Collection(),
            variableDelete: new Collection(),
            variableUpdate:new Collection(),
            functionError:new Collection(),
            interaction:new Collection(),
            applicationCmdCreate: new Collection(),
            applicationCmdUpdate: new Collection(),
            applicationCmdDelete: new Collection(),
            userUpdate:new Collection(),
            rateLimit: new Collection(),
            musicStart: new Collection(),
            musicEnd:new Collection(),
            musicError:new Collection()
        }
         
    }
//message Events 
 onMessage(options){
if(!this.aoiOptions.intents.includes("GUILD_MESSAGES")) AoiError.CallbackError("onMessage","GUILD_MESSAGES",91)
     this.messageEventOptions = options || {guildOnly:true, respondToBots:false}
     this.on("messageCreate",async data=>{
        await require('../Handler/guildMessages/commands.js')(this,data,this.db)
         await require('../Handler/guildMessages/alwaysExecute.js')(this,data,this.db)
     })
             }
 onMessageDelete(){
if(!this.aoiOptions.intents.includes("GUILD_MESSAGES"))AoiError.CallbackError("onMessageDelete","GUILD_MESSAGES",99)

     this.on("messageDelete",async (data)=>{
         await require('../Handler/guildMessages/deleteMessage.js')(data,this)
     })
 }
onMessageUpdate(){
    if(!this.aoiOptions.intents.includes("GUILD_MESSAGES")) AoiError.CallbackError("onMessageUpdate","GUILD_MESSAGES",106)

     this.on("messageUpdate",async (oldm,newm)=>{
await require('../Handler/guildMessages/updateMessage.js')(oldm,newm,this)
         if(this.aoiOptions.respondOnEdit && newm.content !== oldm.content){
await require('../Handler/guildMessages/commands.js')(this,newm,this.db)
             }
     })
}   
onMessageDeleteBulk(){
    if(!this.aoiOptions.intents.includes("GUILD_MESSAGES")) AoiError.CallbackError("onMessageDeleteBulk","GUILD_MESSAGES",116)

     this.on("messageDeleteBulk",async (data)=>{
  await require('../Handler/guildMessages/bulkDeleteMessage.js')(data,this)
     })
}
//guild Events
onGuildJoin(){
    this.on("guildCreate",async guild => await require('../Handler/guilds/guildJoin.js')(guild,this))
}
onGuildLeave(){
    this.on('guildDelete',async guild => await require('../Handler/guilds/guildLeave.js')(guild,this))
}
onGuildUpdate(){
    this.on("guildUpdate", async (oldg,newg)=> await require('../Handler/guilds/guildUpdate.js')(oldg,newg,this))
}
onGuildUnavailable(){
    this.on("guildUnavailable",async guild=>await require('../Handler/guilds/guildUnavailable.js')(guild,this))
}
onRoleCreate(){
    this.on("roleCreate",async role => await require('../Handler/guilds/roleCreate.js')(role, this))
}
onRoleUpdate(){
    this.on("roleUpdate",async (oldr,newr)=> await require('../Handler/guilds/roleUpdate.js')(oldr,newr, this))
}
onRoleDelete(){
    this.on("roleDelete",async role => await require('../Handler/guilds/roleDelete.js')(role,this))
}
onChannelCreate(){
    this.on("channelCreate",async channel => await require('../Handler/guilds/channelCreate.js')(channel, this))
}
onChannelUpdate(){
    this.on("channelUpdate",async (oldc,newc)=> await require('../Handler/guilds/channelUpdate.js')(oldc,newc, this))
}
onChannelDelete(){
    this.on("channelDelete",async channel => await require('../Handler/guilds/channelDelete.js')(channel,this))
}
onChannelPinsUpdate(){
    this.on("channelPinsUpdate",async (channel,time)=>{
        await require('../Handler/guilds/channelPinsUpdate.js')(channel,time,this)
    })
}
onStageInstanceCreate(){
this.on("stageInstanceCreate",async stageint => await require('../Handler/guilds/stageInstanceCreate.js')(stageint,this))
}
onStageInstanceUpdate(){

this.on("stageInstanceUpdate",async (oldstageint,newstageint) => await require('../Handler/guilds/stageInstanceUpdate.js')(oldstageint,newstageint,this))

}
onStageInstanceDelete(){

this.on("stageInstanceDelete",async stageint => await require('../Handler/guilds/stageInstanceDelete.js')(stageint,this))

}
 onThreadCreate(){
    this.on("threadCreate",async thread => await require('../Handler/guilds/threadCreate.js')(thread,this))
                  }
 onThreadUpdate(){

    this.on("threadUpdate",async (oldt,newt) => await require('../Handler/guilds/threadUpdate.js')(oldt,newt,this))

                  }
 onThreadDelete(){

    this.on("threadDelete",async thread => await require('../Handler/guilds/threadDelete.js')(thread,this))

                  }
onThreadListSync(){

    this.on("threadListSync",async collection => await require('../Handler/guilds/threadListSync.js')(collection,this))

                  }
 onThreadMemberUpdate(){

    this.on("threadMemberUpdate",async threadMember=> await require('../Handler/guilds/threadMemberUpdate.js')(threadMember,this))

                  }
    onThreadMembersUpdate(){

    this.on("threadMembersUpdate",async collection => await require('../Handler/guilds/threadMembersUpdate.js')(collection,this))

                  }
//guildMembers Events
 onJoin(){
if(!this.aoiOptions.intents.includes("GUILD_MEMBERS")) AoiError.CallbackError("onJoin","GUILD_MEMBERS",201)
this.on("guildMemberAdd",async mem => await require('../Handler/guildMembers/join.js')(mem,this))
 }
 onLeave(){
if(!this.aoiOptions.intents.includes("GUILD_MEMBERS")) AoiError.CallbackError("onLeave","GUILD_MEMBERS",206)
this.on("guildMemberRemove",async mem => await require('../Handler/guildMembers/leave.js')(mem,this))
 }
onMemberUpdate(){
if(!this.aoiOptions.intents.includes("GUILD_MEMBERS")) AoiError.CallbackError("onMemberUpdate","GUILD_MEMBERS",209)
this.on("guildMemberUpdate",async (oldm,newm) => await require('../Handler/guildMembers/update.js')(oldm,newm,this))
 }
onMemberAvailable(){
if(!this.aoiOptions.intents.includes("GUILD_MEMBERS")) AoiError.CallbackError("onMemberAvailable","GUILD_MEMBERS",214)
this.on("guildMemberAvailable",async mem => await require('../Handler/guildMembers/available.js')(mem,this))
}
 onMembersChunk(){
if(!this.aoiOptions.intents.includes("GUILD_MEMBERS"))AoiError.CallbackError("onMembersChunk","GUILD_MEMBERS",217)
this.on("guildMembersChunk",async (mems,guild,chunk)=> await require('../Handler/guildMembers/chunk.js')(mems,guild,chunk,this))
 }
//Emoji Events 
onEmojiCreate(){
if(!this.aoiOptions.intents.includes("GUILD_EMOJIS")) AoiError.CallbackError("onEmojiCreate","GUILD_EMOJIS",222)
this.on("emojiCreate",async emoji=> await require('../Handler/guildEmojis/create.js')(emoji,this))
}
onEmojiDelete(){
if(!this.aoiOptions.intents.includes("GUILD_EMOJIS")) AoiError.CallbackError("onEmojiDelete","GUILD_EMOJIS",226)
this.on("emojiDelete",async emoji=> await require('../Handler/guildEmojis/delete.js')(emoji,this))
 }
onEmojiUpdate(){
if(!this.aoiOptions.intents.includes("GUILD_EMOJIS")) AoiError.CallbackError("onEmojiUpdate","GUILD_EMOJIS",231)
this.on("emojiUpdate",async (olde,newe)=> await require('../Handler/guildEmojis/update.js')(olde,newe,this))
}    
//ban events
onBanAdd(){
if(!this.aoiOptions.intents.includes("GUILD_BANS")) AoiError.CallbackError("onBanAdd","GUILD_BANS",235)
this.on("guildBanAdd",async ban=> await require('../Handler/guildBans/add.js')(ban,this))
}
onBanRemove(){
if(!this.aoiOptions.intents.includes("GUILD_BANS")) AoiError.CallbackError("onBanRemove","GUILD_BANS",239)
this.on("guildBanRemove",async ban=> await require('../Handler/guildBans/remove.js')(ban,this))
}
onInviteCreate(){
    if(!this.aoiOptions.intents.includes("GUILD_INVITES")) AoiError.CallbackError("onInviteCreate","GUILD_INVITES",243)
    this.on("inviteCreate",async invite=> await require('../Handler/guildInvited/create.js')(invite,this))
}
 //commands
 command(...args) {
    for (const d of args) {
      if (!d.name)
        throw new TypeError(
          `Command ${this.cmd.default.size} needs a name!`
        );
      if (!d.code)
        throw new TypeError(
          `Command ${this.cmd.default.size} needs a code!`
        );

      this.cmd.default.set(this.cmd.default.size, d);
    }
 }
 awaitedCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d.name}`)}
   if(!d.name){throw new Error(`Name is not probided to cmd at position ${this.cmd.awaited.size}`)} 

     this.cmd.awaited.set(this.cmd.awaited.size,d)
 }
 deletedCommand(d={}){
    if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: deletedCommand. position: ${this.cmd.messageDelete.size}`)}
     this.cmd.messageDelete.set(this.cmd.messageDelete.size,d)
 }
 updateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: updateCommand. position: ${this.cmd.messageUpdate.size}`)}

     this.cmd.messageUpdate.set(this.cmd.messageUpdate.size,d)
 }
 bulkDeleteCommand(d={}){
     if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: bulkDeletedCommand. position: ${this.cmd.messageDeleteBulk.size}`)}

     this.cmd.messageDeleteBulk.set(this.cmd.messageDeleteBulk.size,d)
 }
  //-------------------//
 guildJoinCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: guildJoinCommand. position: ${this.cmd.guildJoin.size}`)}

     this.cmd.guildJoin.set(this.cmd.guildJoin.size,d)
    }
 guildLeaveCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: guildLeaveCommand. position: ${this.cmd.guildLeave.size}`)}

     this.cmd.guildLeave.set(this.cmd.guildLeave.size,d)
    }
 guildUpdateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: guildUpdateCommand. position: ${this.cmd.guildUpdate.size}`)}

     this.cmd.guildUpdate.set(this.cmd.guildUpdate.size,d)
    }

 guildUnavailableCommand(d={}){   
    if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: guildUnavailableCommand. position: ${this.cmd.guildUnavailable.size}`)}
     this.cmd.guildUnavailable.set(this.cmd.guildUnavailable.size,d)
    }
 roleCreateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: roleCreateCommand. position: ${this.cmd.roleCreate.size}`)}
     this.cmd.roleCreate.set(this.cmd.roleCreate.size,d)
    }
 roleUpdateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: roleUpdateCommand. position: ${this.cmd.roleUpdate.size}`)}
     this.cmd.roleUpdate.set(this.cmd.roleUpdate.size,d)
    } 
 roleDeleteCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: roleDeleteCommand. position: ${this.cmd.roleDelete.size}`)}
     this.cmd.roleDelete.set(this.cmd.roleDelete.size,d)
    } 
 channelCreateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: channelCreateCommand. position: ${this.cmd.channelCreate.size}`)}
     this.cmd.channelCreate.set(this.cmd.channelCreate.size,d)
    }
    channelUpdateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: channelUpdateCommand. position: ${this.cmd.channelUpdate.size}`)}
     this.cmd.channelUpdate.set(this.cmd.channelUpdate.size,d)
    }
channelDeleteCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: channelDeleteCommand. position: ${this.cmd.channelDelete.size}`)}
     this.cmd.channelDelete.set(this.cmd.channelDelete.size,d)
    } 
    channelPinsUpdateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: channelPinsUpdateCommand. position: ${this.cmd.channelPinsUpdate.size}`)}
     this.cmd.channelPinsUpdate.set(this.cmd.channelPinsUpdate.size,d)
    }
stageInstanceCreateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: stageInstanceCreateCommand. position: ${this.cmd.stageInstanceCreate.size}`)}
     this.cmd.stageInstanceCreate.set(this.cmd.stageInstanceCreate.size,d)
    }
stageInstanceUpdateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: stageInstanceUpdateCommand. position: ${this.cmd.stageInstanceUpdate.size}`)}
     this.cmd.stageInstanceUpdate.set(this.cmd.stageInstanceUpdate.size,d)
}
stageInstanceDeleteCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: stageInstanceDeleteCommand. position: ${this.cmd.stageInstanceDelete.size}`)}
     this.cmd.stageInstanceDelete.set(this.cmd.stageInstanceDelete.size,d)
    }

threadCreateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: threadCreateCommand. position: ${this.cmd.threadCreate.size}`)}
     this.cmd.threadCreate.set(this.cmd.threadCreate.size,d)
    }
      threadUpdateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: threadUpdateCommand. position: ${this.cmd.threadUpdate.size}`)}
     this.cmd.threadUpdate.set(this.cmd.threadUpdate.size,d)
      } 
  threadDeleteCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: threadDeleteCommand. position: ${this.cmd.threadDelete.size}`)}
     this.cmd.threadDelete.set(this.cmd.threadDelete.size,d)
    }
    threadListSyncCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: threadListSyncCommand. position: ${this.cmd.threadListSync.size}`)}
     this.cmd.threadListSync.set(this.cmd.threadListSync.size,d)
    }  
    threadMemberUpdateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: threadMemberUpdateCommand. position: ${this.cmd.threadMemberUpdate.size}`)}
     this.cmd.threadMemberUpdate.set(this.cmd.threadMemberUpdate.size,d)
    }
    joinCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: joinCommand. position: ${this.cmd.join.size}`)}
this.cmd.join.set(this.cmd.join.size,d)
    }
     leaveCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: leaveCommand. position: ${this.cmd.leave.size}`)}
this.cmd.leave.set(this.cmd.leave.size,d)
     }
    memberUpdateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: threadMembersUpdateCommand. position: ${this.cmd.threadMembersUpdate.size}`)}
this.cmd.threadMembersUpdate.set(this.cmd.threadMembersUpdate.size,d)
    }
threadMembersUpdateCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: membersUpdateCommand. position: ${this.cmd.membersUpdate.size}`)}
this.cmd.membersUpdate.set(this.cmd.membersUpdate.size,d)
}
memberAvailableCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: memberAvailableCommand. position: ${this.cmd.memberAvailable.size}`)}
this.cmd.memberAvailable.set(this.cmd.memberAvailable.size,d)
    }
membersChunkCommand(d={}){
   if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: membersChunkCommand. position: ${this.cmd.membersChunk.size}`)}
this.cmd.membersChunk.set(this.cmd.membersChunk.size,d)
}
emojiCreateCommand(d={}){
    if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: emojiCreateCommand. position: ${this.cmd.emojiCreate.size}`)}
this.cmd.emojiCreate.set(this.cmd.emojiCreate.size,d)                          
}
emojiDeleteCommand(d={}){
    if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: emojiDeleteCommand. position: ${this.cmd.emojiDelete.size}`)}
this.cmd.emojiDelete.set(this.cmd.emojiDelete.size,d)                          
               }
emojiUpdateCommand(d={}){
    if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: emojiUpdateCommand. position: ${this.cmd.emojiUpdate.size}`)}
this.cmd.emojiUpdate.set(this.cmd.emojiUpdate.size,d)                          
}
banAddCommand(d={}){
    if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: banAddCommand. position: ${this.cmd.banAdd.size}`)}
this.cmd.banAdd.set(this.cmd.banAdd.size,d)                          
               }
banRemoveCommand(d={}){
    if(!d.code){throw new TypeError(`code is not provided in ${d?.name||"unknown name"}: banRemoveCommand. position: ${this.cmd.banRemove.size}`)}
this.cmd.banRemove.set(this.cmd.banRemove.size,d)                          
}

    }
require('../Utils/helpers/prototypes.js')
module.exports = Client ;