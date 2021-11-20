
const fs = require( 'fs' )
const AoiError = require( './AoiError.js' )
const BaseClient = require( './base.js' )
const { FunctionManager } = require( './Functions.js' )

class Client extends BaseClient
{
    constructor ( options )
    {
        super( options );
        this.functionManager = new FunctionManager( this )
        if ( this.aoiOptions.respondOnEdit )
        {
            this.aoiOptions.respondOnEdit.time = this.aoiOptions.respondOnEdit.time || 60000
        }

    }
    //message Events 
    onMessage ( options )
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MESSAGES" ) ) AoiError.CallbackError( "onMessage", "GUILD_MESSAGES", 91 )
        this.messageEventOptions = options || { guildOnly: true, respondToBots: false }

        this.on( "messageCreate", async data =>
        {
            await require( '../Handler/guildMessages/commands.js' )( data, this, this.db )
            await require( '../Handler/guildMessages/alwaysExecute.js' )( this, data, this.db )
            await require( '../Handler/guildMessages/nonPrefixed.js' )( this, data, this.db )
        } )
    }
    onMessageDelete ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MESSAGES" ) ) AoiError.CallbackError( "onMessageDelete", "GUILD_MESSAGES", 99 )

        // @ts-ignore
        this.on( "messageDelete", async ( data ) =>
        {
            await require( '../Handler/guildMessages/deleteMessage.js' )( data, this )
        } )
    }
    onMessageUpdate ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MESSAGES" ) ) AoiError.CallbackError( "onMessageUpdate", "GUILD_MESSAGES", 106 )

        // @ts-ignore
        this.on( "messageUpdate", async ( oldm, newm ) =>
        {
            await require( '../Handler/guildMessages/updateMessage.js' )( oldm, newm, this )
            if ( this.aoiOptions.respondOnEdit && newm.content !== oldm.content && this.aoiOptions.respondOnEdit.time > ( Date.now() - newm.createdTimestamp ) )
            {
                if ( this.aoiOptions.respondOnEdit.commands )
                {
                    await require( '../Handler/guildMessages/commands.js' )( newm, this, this.db )
                }
                if ( this.aoiOptions.respondOnEdit.alwaysExecute )
                {
                    await require( '../Handler/guildMessages/alwaysExecute.js' )( this, newm, this.db )
                }
                if ( this.aoiOptions.respondOnEdit.nonPrefixed )
                {
                    await require( '../Handler/guildMessages/nonPrefixed.js' )( this, newm, this.db )
                }
            }
        } )
    }
    onMessageDeleteBulk ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MESSAGES" ) ) AoiError.CallbackError( "onMessageDeleteBulk", "GUILD_MESSAGES", 116 )

        // @ts-ignore
        this.on( "messageDeleteBulk", async ( data ) =>
        {
            await require( '../Handler/guildMessages/bulkDeleteMessage.js' )( data, this )
        } )
    }
    //guild Events
    onGuildJoin ()
    {
        // @ts-ignore
        this.on( "guildCreate", async guild => await require( '../Handler/guilds/guildJoin.js' )( guild, this ) )
    }
    onGuildLeave ()
    {
        // @ts-ignore
        this.on( 'guildDelete', async guild => await require( '../Handler/guilds/guildLeave.js' )( guild, this ) )
    }
    onGuildUpdate ()
    {
        // @ts-ignore
        this.on( "guildUpdate", async ( oldg, newg ) => await require( '../Handler/guilds/guildUpdate.js' )( oldg, newg, this ) )
    }
    onGuildUnavailable ()
    {
        // @ts-ignore
        this.on( "guildUnavailable", async guild => await require( '../Handler/guilds/guildUnavailable.js' )( guild, this ) )
    }
    onRoleCreate ()
    {
        // @ts-ignore
        this.on( "roleCreate", async role => await require( '../Handler/guilds/roleCreate.js' )( role, this ) )
    }
    onRoleUpdate ()
    {
        // @ts-ignore
        this.on( "roleUpdate", async ( oldr, newr ) => await require( '../Handler/guilds/roleUpdate.js' )( oldr, newr, this ) )
    }
    onRoleDelete ()
    {
        // @ts-ignore
        this.on( "roleDelete", async role => await require( '../Handler/guilds/roleDelete.js' )( role, this ) )
    }
    onChannelCreate ()
    {

        this.on( "channelCreate", async channel => await require( '../Handler/guilds/channelCreate.js' )( channel, this ) )
    }
    onChannelUpdate ()
    {
        // @ts-ignore
        this.on( "channelUpdate", async ( oldc, newc ) => await require( '../Handler/guilds/channelUpdate.js' )( oldc, newc, this ) )
    }
    onChannelDelete ()
    {
        // @ts-ignore
        this.on( "channelDelete", async channel => await require( '../Handler/guilds/channelDelete.js' )( channel, this ) )
    }
    onChannelPinsUpdate ()
    {
        // @ts-ignore
        this.on( "channelPinsUpdate", async ( channel, time ) =>
        {
            await require( '../Handler/guilds/channelPinsUpdate.js' )( channel, time, this )
        } )
    }
    onStageInstanceCreate ()
    {
        // @ts-ignore
        this.on( "stageInstanceCreate", async stageint => await require( '../Handler/guilds/stageInstanceCreate.js' )( stageint, this ) )
    }
    onStageInstanceUpdate ()
    {

        // @ts-ignore
        this.on( "stageInstanceUpdate", async ( oldstageint, newstageint ) => await require( '../Handler/guilds/stageInstanceUpdate.js' )( oldstageint, newstageint, this ) )

    }
    onStageInstanceDelete ()
    {

        // @ts-ignore
        this.on( "stageInstanceDelete", async stageint => await require( '../Handler/guilds/stageInstanceDelete.js' )( stageint, this ) )

    }
    onThreadCreate ()
    {
        // @ts-ignore
        this.on( "threadCreate", async thread => await require( '../Handler/guilds/threadCreate.js' )( thread, this ) )
    }
    onThreadUpdate ()
    {

        // @ts-ignore
        this.on( "threadUpdate", async ( oldt, newt ) => await require( '../Handler/guilds/threadUpdate.js' )( oldt, newt, this ) )

    }
    onThreadDelete ()
    {

        // @ts-ignore
        this.on( "threadDelete", async thread => await require( '../Handler/guilds/threadDelete.js' )( thread, this ) )

    }
    onThreadListSync ()
    {

        // @ts-ignore
        this.on( "threadListSync", async collection => await require( '../Handler/guilds/threadListSync.js' )( collection, this ) )

    }
    onThreadMemberUpdate ()
    {

        // @ts-ignore
        this.on( "threadMemberUpdate", async threadMember => await require( '../Handler/guilds/threadMemberUpdate.js' )( threadMember, this ) )

    }
    onThreadMembersUpdate ()
    {

        // @ts-ignore
        this.on( "threadMembersUpdate", async collection => await require( '../Handler/guilds/threadMembersUpdate.js' )( collection, this ) )

    }
    //guildMembers Events
    onJoin ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MEMBERS" ) ) AoiError.CallbackError( "onJoin", "GUILD_MEMBERS", 201 )
        // @ts-ignore
        this.on( "guildMemberAdd", async mem => await require( '../Handler/guildMembers/join.js' )( mem, this ) )
    }
    onLeave ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MEMBERS" ) ) AoiError.CallbackError( "onLeave", "GUILD_MEMBERS", 206 )
        // @ts-ignore
        this.on( "guildMemberRemove", async mem => await require( '../Handler/guildMembers/leave.js' )( mem, this ) )
    }
    onMemberUpdate ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MEMBERS" ) ) AoiError.CallbackError( "onMemberUpdate", "GUILD_MEMBERS", 209 )
        // @ts-ignore
        this.on( "guildMemberUpdate", async ( oldm, newm ) => await require( '../Handler/guildMembers/update.js' )( oldm, newm, this ) )
    }
    onMemberAvailable ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MEMBERS" ) ) AoiError.CallbackError( "onMemberAvailable", "GUILD_MEMBERS", 214 )
        // @ts-ignore
        this.on( "guildMemberAvailable", async mem => await require( '../Handler/guildMembers/available.js' )( mem, this ) )
    }
    onMembersChunk ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MEMBERS" ) ) AoiError.CallbackError( "onMembersChunk", "GUILD_MEMBERS", 217 )
        // @ts-ignore
        this.on( "guildMembersChunk", async ( mems, guild, chunk ) => await require( '../Handler/guildMembers/chunk.js' )( mems, guild, chunk, this ) )
    }
    //Emoji Events 
    onEmojiCreate ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_EMOJIS_AND_STICKERS" ) ) AoiError.CallbackError( "onEmojiCreate", "GUILD_EMOJIS_AND_STICKERS", 222 )
        // @ts-ignore
        this.on( "emojiCreate", async emoji => await require( '../Handler/guildEmojis/create.js' )( emoji, this ) )
    }
    onEmojiDelete ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_EMOJIS_AND_STICKERS" ) ) AoiError.CallbackError( "onEmojiDelete", "GUILD_EMOJIS_AND_STICKERS", 226 )
        // @ts-ignore
        this.on( "emojiDelete", async emoji => await require( '../Handler/guildEmojis/delete.js' )( emoji, this ) )
    }
    onEmojiUpdate ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_EMOJIS_AND_STICKERS" ) ) AoiError.CallbackError( "onEmojiUpdate", "GUILD_EMOJIS_AND_STICKERS", 231 )
        // @ts-ignore
        this.on( "emojiUpdate", async ( olde, newe ) => await require( '../Handler/guildEmojis/update.js' )( olde, newe, this ) )
    }
    onStickerCreate ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_EMOJIS_AND_STICKERS" ) ) AoiError.CallbackError( "onStickerCreate", "GUILD_EMOJIS_AND_STICKERS", 169 )
        // @ts-ignore
        this.on( "stickerCreate", async sticker => await require( '../Handler/guildEmojis/stickerCreate.js' )( sticker, this ) )
    }
    onStickerDelete ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_EMOJIS_AND_STICKERS" ) ) AoiError.CallbackError( "onStickerDelete", "GUILD_EMOJIS_AND_STICKERS", 174 )
        // @ts-ignore
        this.on( "stickerDelete", async emoji => await require( '../Handler/guildEmojis/stickerDelete.js' )( emoji, this ) )
    }
    onStickerUpdate ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_EMOJIS_AND_STICKERS" ) ) AoiError.CallbackError( "onStickerUpdate", "GUILD_EMOJIS_AND_STICKERS", 231 )
        // @ts-ignore
        this.on( "stickerUpdate", async ( olde, newe ) => await require( '../Handler/guildEmojis/stickerUpdate.js' )( olde, newe, this ) )
    }
    //ban events
    onBanAdd ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_BANS" ) ) AoiError.CallbackError( "onBanAdd", "GUILD_BANS", 235 )
        // @ts-ignore
        this.on( "guildBanAdd", async ban => await require( '../Handler/guildBans/add.js' )( ban, this ) )
    }
    onBanRemove ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_BANS" ) ) AoiError.CallbackError( "onBanRemove", "GUILD_BANS", 239 )
        // @ts-ignore
        this.on( "guildBanRemove", async ban => await require( '../Handler/guildBans/remove.js' )( ban, this ) )
    }
    //invite Events
    onInviteCreate ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_INVITES" ) ) AoiError.CallbackError( "onInviteCreate", "GUILD_INVITES", 243 )
        // @ts-ignore
        this.on( "inviteCreate", async invite => await require( '../Handler/guildInvites/create.js' )( invite, this ) )
    }
    onInviteDelete ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_INVITES" ) ) AoiError.CallbackError( "onInviteDelete", "GUILD_INVITES", 243 )
        // @ts-ignore
        this.on( "inviteDelete", async invite => await require( '../Handler/guildInvites/delete.js' )( invite, this ) )
    }
    //reactions 
    onReactionAdd ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MESSAGE_REACTIONS" ) ) AoiError.CallbackError( "onReactionAdd", "GUILD_MESSAGE_REACTIONS", 254 )
        // @ts-ignore
        this.on( "messageReactionAdd", async ( reaction, user ) => await require( '../Handler/guildMessageReactions/add.js' )( reaction, user, this ) )
    }
    onReactionRemove ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MESSAGE_REACTIONS" ) ) AoiError.CallbackError( "onReactionRemove", "GUILD_MESSAGE_REACTIONS", 258 )
        // @ts-ignore
        this.on( "messageReactionRemove", async ( reaction, user ) => await require( '../Handler/guildMessageReactions/remove.js' )( reaction, user, this ) )
    }
    onReactionRemoveAll ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MESSAGE_REACTIONS" ) ) AoiError.CallbackError( "onReactionRemoveAll", "GUILD_MESSAGE_REACTIONS", 263 )
        // @ts-ignore
        this.on( "messageReactionRemoveAll", async message => await require( '../Handler/guildMessageReactions/removeAll.js' )( message, this ) )

    }
    onReactionRemoveEmoji ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MESSAGE_REACTIONS" ) ) AoiError.CallbackError( "onReactionRemoveEmoji", "GUILD_MESSAGE_REACTIONS", 267 )
        // @ts-ignore
        this.on( "reactionRemoveEmoji", async reaction => await require( '../Handler/guildMessageReactions/removeEmoji.js' )( reaction, this ) )
    }
    //guildVoiceStates Events     
    onVoiceStateUpdate ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_VOICE_STATES" ) ) AoiError.CallbackError( "onVoiceStateUpdate", "GUILD_VOICE_STATES", 272 )
        // @ts-ignore
        this.on( "voiceStateUpdate", async ( oldState, newState ) => await require( '../Handler/guildVoiceStates/update.js' )( oldState, newState, this ) )
    }
    //presence events
    onPresenceUpdate ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_PRESENCES" ) ) AoiError.CallbackError( "onPresenceUpdate", "GUILD_PRESENCES", 276 )
        // @ts-ignore
        this.on( "presenceUpdate", async ( op, np ) => await require( '../Handler/guildPresences/update.js' )( op, np, this ) )
    }
    //typing events 
    onTypingStart ()
    {
        if ( !this.aoiOptions.intents.includes( "GUILD_MESSAGE_TYPING" ) || !this.aoiOptions.intents.includes( "DIRECT_MESSAGE_TYPING" ) )
        {
            AoiError.CallbackError( "onTypingStart", "GUILD_MESSAGE_TYPING or DIRECT_MESSAGE_TYPING", 229 )
        }
        // @ts-ignore
        this.on( "typingStart", async type => await require( '../Handler/guildMessageTypings/start.js' )( type, this ) )
    }
    //nonIntents events 
    onInteractionCreate ()
    {
        // @ts-ignore
        this.on( "interactionCreate", async interaction => await require( '../Handler/nonIntents/interaction.js' )( interaction, this ) )
    }
    onApplicationCmdCreate ()
    {
        // @ts-ignore
        this.on( "applicationCommandCreate", async app => await require( '../Handler/nonIntents/appCmdCreate.js' )( app, this ) )
    }
    onApplicationCmdDelete ()
    {
        // @ts-ignore
        this.on( "applicationCommandDelete", async app => await require( '../Handler/nonIntents/appCmdDelete.js' )( app, this ) )
    }
    onApplicationCmdUpdate ()
    {
        // @ts-ignore
        this.on( "applicationCommandUpdate", async ( oapp, napp ) => await require( '../Handler/nonIntents/appCmdUpdate.js' )( oapp, napp, this ) )
    }
    onUserUpdate ()
    {
        // @ts-ignore
        this.on( "userUpdate", async ( ouser, nuser ) => await require( "../Handler/nonIntents/userUpdate.js" )( ouser, nuser, this ) )
    }
    //custom 
    onVariableCreate ()
    {
        // @ts-ignore
        this.on( "variableCreate", async data => await require( '../Handler/custom/varCreate.js' )( data, this ) )
    }
    onVariableDelete ()
    {
        // @ts-ignore
        this.on( "variableDelete", async data => await require( "../Handler/custom/varDelete.js" )( data, this ) )
    }
    onVariableUpdate ()
    {
        // @ts-ignore
        this.on( "variableUpdate", async ( od, nd ) => await require( '../Handler/custom/varUpdate.js' )( od, nd, this ) )
    }
    //commands 
    command ( ...args )
    {
        for ( const d of args )
        {
            if ( !d.name )
                throw new TypeError(
                    `Command ${ this.cmd.default.size } needs a name!`
                );
            if ( !d.code )
                throw new TypeError(
                    `Command ${ this.cmd.default.size } needs a code!`
                );

            this.cmd.default.set( this.cmd.default.size, d );
        }
    }
    awaitedCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d.name }` ) }
        if ( !d.name ) { throw new Error( `Name is not probided to cmd at position ${ this.cmd.awaited.size }` ) }

        this.cmd.awaited.set( this.cmd.awaited.size, d )
    }
    deletedCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: deletedCommand. position: ${ this.cmd.messageDelete.size }` ) }
        this.cmd.messageDelete.set( this.cmd.messageDelete.size, d )
    }
    updateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: updateCommand. position: ${ this.cmd.messageUpdate.size }` ) }

        this.cmd.messageUpdate.set( this.cmd.messageUpdate.size, d )
    }
    bulkDeleteCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: bulkDeletedCommand. position: ${ this.cmd.messageDeleteBulk.size }` ) }

        this.cmd.messageDeleteBulk.set( this.cmd.messageDeleteBulk.size, d )
    }
    //-------------------//
    guildJoinCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: guildJoinCommand. position: ${ this.cmd.guildJoin.size }` ) }

        this.cmd.guildJoin.set( this.cmd.guildJoin.size, d )
    }
    guildLeaveCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: guildLeaveCommand. position: ${ this.cmd.guildLeave.size }` ) }

        this.cmd.guildLeave.set( this.cmd.guildLeave.size, d )
    }
    guildUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: guildUpdateCommand. position: ${ this.cmd.guildUpdate.size }` ) }

        this.cmd.guildUpdate.set( this.cmd.guildUpdate.size, d )
    }
    guildUnavailableCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: guildUnavailableCommand. position: ${ this.cmd.guildUnavailable.size }` ) }
        this.cmd.guildUnavailable.set( this.cmd.guildUnavailable.size, d )
    }

    roleCreateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: roleCreateCommand. position: ${ this.cmd.roleCreate.size }` ) }
        this.cmd.roleCreate.set( this.cmd.roleCreate.size, d )
    }
    roleUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: roleUpdateCommand. position: ${ this.cmd.roleUpdate.size }` ) }
        this.cmd.roleUpdate.set( this.cmd.roleUpdate.size, d )
    }
    roleDeleteCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: roleDeleteCommand. position: ${ this.cmd.roleDelete.size }` ) }
        this.cmd.roleDelete.set( this.cmd.roleDelete.size, d )
    }

    channelCreateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: channelCreateCommand. position: ${ this.cmd.channelCreate.size }` ) }
        this.cmd.channelCreate.set( this.cmd.channelCreate.size, d )
    }
    channelUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: channelUpdateCommand. position: ${ this.cmd.channelUpdate.size }` ) }
        this.cmd.channelUpdate.set( this.cmd.channelUpdate.size, d )
    }
    channelDeleteCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: channelDeleteCommand. position: ${ this.cmd.channelDelete.size }` ) }
        this.cmd.channelDelete.set( this.cmd.channelDelete.size, d )
    }
    channelPinsUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: channelPinsUpdateCommand. position: ${ this.cmd.channelPinsUpdate.size }` ) }
        this.cmd.channelPinsUpdate.set( this.cmd.channelPinsUpdate.size, d )
    }

    stageInstanceCreateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: stageInstanceCreateCommand. position: ${ this.cmd.stageInstanceCreate.size }` ) }
        this.cmd.stageInstanceCreate.set( this.cmd.stageInstanceCreate.size, d )
    }
    stageInstanceUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: stageInstanceUpdateCommand. position: ${ this.cmd.stageInstanceUpdate.size }` ) }
        this.cmd.stageInstanceUpdate.set( this.cmd.stageInstanceUpdate.size, d )
    }
    stageInstanceDeleteCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: stageInstanceDeleteCommand. position: ${ this.cmd.stageInstanceDelete.size }` ) }
        this.cmd.stageInstanceDelete.set( this.cmd.stageInstanceDelete.size, d )
    }

    threadCreateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: threadCreateCommand. position: ${ this.cmd.threadCreate.size }` ) }
        this.cmd.threadCreate.set( this.cmd.threadCreate.size, d )
    }
    threadUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: threadUpdateCommand. position: ${ this.cmd.threadUpdate.size }` ) }
        this.cmd.threadUpdate.set( this.cmd.threadUpdate.size, d )
    }
    threadDeleteCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: threadDeleteCommand. position: ${ this.cmd.threadDelete.size }` ) }
        this.cmd.threadDelete.set( this.cmd.threadDelete.size, d )
    }
    threadListSyncCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: threadListSyncCommand. position: ${ this.cmd.threadListSync.size }` ) }
        this.cmd.threadListSync.set( this.cmd.threadListSync.size, d )
    }
    threadMemberUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: threadMemberUpdateCommand. position: ${ this.cmd.threadMemberUpdate.size }` ) }
        this.cmd.threadMemberUpdate.set( this.cmd.threadMemberUpdate.size, d )
    }
    //--------------------------------//
    joinCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: joinCommand. position: ${ this.cmd.join.size }` ) }
        this.cmd.join.set( this.cmd.join.size, d )
    }
    leaveCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: leaveCommand. position: ${ this.cmd.leave.size }` ) }
        this.cmd.leave.set( this.cmd.leave.size, d )
    }
    memberUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: threadMembersUpdateCommand. position: ${ this.cmd.threadMembersUpdate.size }` ) }
        this.cmd.threadMembersUpdate.set( this.cmd.threadMembersUpdate.size, d )
    }
    threadMembersUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: membersUpdateCommand. position: ${ this.cmd.membersUpdate.size }` ) }
        this.cmd.membersUpdate.set( this.cmd.membersUpdate.size, d )
    }
    memberAvailableCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: memberAvailableCommand. position: ${ this.cmd.memberAvailable.size }` ) }
        this.cmd.memberAvailable.set( this.cmd.memberAvailable.size, d )
    }
    membersChunkCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: membersChunkCommand. position: ${ this.cmd.membersChunk.size }` ) }
        this.cmd.membersChunk.set( this.cmd.membersChunk.size, d )
    }
    //---------------------------------//
    emojiCreateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: emojiCreateCommand. position: ${ this.cmd.emojiCreate.size }` ) }
        this.cmd.emojiCreate.set( this.cmd.emojiCreate.size, d )
    }
    emojiDeleteCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: emojiDeleteCommand. position: ${ this.cmd.emojiDelete.size }` ) }
        this.cmd.emojiDelete.set( this.cmd.emojiDelete.size, d )
    }
    emojiUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: emojiUpdateCommand. position: ${ this.cmd.emojiUpdate.size }` ) }
        this.cmd.emojiUpdate.set( this.cmd.emojiUpdate.size, d )
    }
    //--------------------------------//
    banAddCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: banAddCommand. position: ${ this.cmd.banAdd.size }` ) }
        this.cmd.banAdd.set( this.cmd.banAdd.size, d )
    }
    banRemoveCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: banRemoveCommand. position: ${ this.cmd.banRemove.size }` ) }
        this.cmd.banRemove.set( this.cmd.banRemove.size, d )
    }
    //---------------------------------//
    inviteCreateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: inviteCreateCommand. position: ${ this.cmd.inviteCreate.size }` ) }
        this.cmd.inviteCreate.set( this.cmd.inviteCreate.size, d )
    }
    inviteDeleteCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: inviteDeleteCommand. position: ${ this.cmd.inviteDelete.size }` ) }
        this.cmd.inviteDelete.set( this.cmd.inviteDelete.size, d )
    }
    //---------------------------------//
    reactionAddCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: reactionAddCommand. position: ${ this.cmd.reactionAdd.size }` ) }
        this.cmd.reactionAdd.set( this.cmd.reactionAdd.size, d )
    }
    reactionRemoveCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: reactionRemoveCommand. position: ${ this.cmd.reactionRemove.size }` ) }
        this.cmd.reactionRemove.set( this.cmd.reactionRemove.size, d )
    }
    reactionRemoveAllCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: reactionRemoveAllCommand. position: ${ this.cmd.reactionRemoveAll.size }` ) }
        this.cmd.reactiomRemoveAll.set( this.cmd.reactionRemoveAll.size, d )
    }
    reactionRemoveEmojiCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: reactionRemoveEmojiCommand. position: ${ this.cmd.reactionRemoveEmoji.size }` ) }
        this.cmd.reactionRemoveEmoji.set( this.cmd.reactionRemoveEmoji.size, d )
    }
    //---------------------------------//
    presenceUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: presenceUpdateCommand. position: ${ this.cmd.presenceUpdate.size }` ) }
        this.cmd.presenceUpdate.set( this.cmd.presenceUpdate.size, d )
    }
    //---------------------------------//
    voiceStateUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: voiceStateUpdateCommand. position: ${ this.cmd.voiceStateUpdate.size }` ) }
        this.cmd.voiceStateUpdate.set( this.cmd.voiceStateUpdate.size, d )
    }
    //---------------------------------//
    interactionCommand ( d = {} )
    {
        if ( !d.prototype ) { throw new TypeError( `Prototype is not provided in ${ d.name || "unknown name" }: interactionCommand.` ) }
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: interactionCommand. position: ${ this.cmd.interaction[ d.prototype ]?.size }` ) }
        this.cmd.interaction[ d.prototype ]?.set( this.cmd.interaction[ d.prototype ].size, d )
    }
    applicationCmdCreateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: ApplicationCmdCreateCommand. position: ${ this.cmd.applicationCmdCreate.size }` ) }
        this.cmd.applicationCmdCreate?.set( this.cmd.applicationCmdCreate.size, d )
    }
    applicationCmdDeleteCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: ApplicationCmdDeleteCommand. position: ${ this.cmd.applicationCmdDelete.size }` ) }
        this.cmd.applicationCmdDelete?.set( this.cmd.applicationCmdDelete.size, d )
    }
    applicationCmdUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: ApplicationCmdUpdateCommand. position: ${ this.cmd.onApplicationCmdUpdate.size }` ) }
        this.cmd.onApplicationCmdUpdate?.set( this.cmd.onApplicationCmdUpdate.size, d )
    }
    userUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: userUpdateCommand. position: ${ this.cmd.userUpdate.size }` ) }
        this.cmd.userUpdate?.set( this.cmd.userUpdate.size, d )
    }
    variableCreateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: variableCreateCommand. position: ${ this.cmd.variableCreate.size }` ) }
        this.cmd.variableCreate?.set( this.cmd.variableCreate.size, d )
    }
    variableDeleteCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: variableDeleteCommand. position: ${ this.cmd.variableDelete.size }` ) }
        this.cmd.variableDelete?.set( this.cmd.variableDelete.size, d )
    }
    variableUpdateCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: variableUpdateCommand. position: ${ this.cmd.variableUpdate.size }` ) }
        this.cmd.variableUpdate?.set( this.cmd.variableUpdate.size, d )
    }
    readyCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: readyCommand. position: ${ this.cmd.ready.size }` ) }
        this.cmd.ready?.set( this.cmd.ready.size, d )
    }
    functionErrorCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: functionErrorCommand. position: ${ this.cmd.functionError.size }` ) }
        this.cmd.functionError?.set( this.cmd.functionError.size, d )
    }
    loopCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: loopCommand. position: ${ this.cmd.loop.size }` ) }
        this.cmd.loop?.set( this.cmd.loop.size, d )
    }
    timeoutCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: loopCommand. position: ${ this.cmd.loop.size }` ) }
        this.cmd.loop?.set( this.cmd.loop.size, d )
    }
    pulseCommand ( d = {} )
    {
        if ( !d.code ) { throw new TypeError( `Code is not provided in ${ d?.name || "unknown name" }: loopCommand. position: ${ this.cmd.loop.size }` ) }
        this.cmd.loop?.set( this.cmd.loop.size, d )
    }
}
require( '../utils/helpers/prototypes.js' )
module.exports = Client;
