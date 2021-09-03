//---------------Client------------------//
const ClientOptions ={
    token:"Token",
    prefix:"<Array<Prefixes(String)>> or <String>",
    intents:"<Array<IntentOptions>> or all",
    mobilePlatform:"Boolean",
    presence:"<ClientPresenceOptions>",//for one status only
    fetchInvites:"<FetchInvitesOptions>",
    database:"<DatabaseOptions>",
    debugs:"<DebugsAvailables>",
    events:"<EventsAvailables>",
    suppressAllErrors:"Boolean",    errorMessage:"<Array<Content,Embeds, Components,Files>>",
    autoUpdate:"Boolean"
}
const IntentOptions = {
guilds:"GUILDS",
guildMembers:"GUILD_MEMBERS",
guildBans:"GUILD_BANS",
guildEmojisAndStickers:"GUILD_EMOJIS_AND_STICKERS",
guildIntegrations:"GUILD_INTEGRATIONS",
guildWebhooks:"GUILD_WEBHOOKS",
guildInvites:"GUILD_INVITES",
guildVoiceStates:"GUILD_VOICE_STATES",
guildPresences:"GUILD_PRESENCES",
guildMessages:"GUILD_MESSAGES",
guildMessageReactions:"GUILD_MESSAGE_REACTIONS",
guildMessageTyping:"GUILD_MESSAGE_TYPING",
directMessages:"DIRECT_MESSAGES",
directMessageReactions:"DIRECT_MESSAGE_REACTIONS",
directMessageTyping:"DIRECT_MESSAGE_TYPING"
}
IntentOptions.all = Object.values(IntentOptions) ;
const ClientPresenceOptions={
    status:"online/idle/dnd/offline",
    afk: "Boolean",
    activities:"<Array<PresenceActivityOptions>>",
    shardID:"<Number> or <Array<Number>>"
}
const PresenceActivityOptions={
    name:"name",
    type:"<ActivityTypeAvailables>",
    url:"url"
}
const ActivityTypeAvailables = {
    playing:"PLAYING",
    watching:"WATCHING",
    listening:"LISTENING",
    streaming:"STREAMING",
    competing:"COMPETING"
}
const DatabaseOptions = {
    db:"default (for dbdjsdb) or <Module>",
    path:"path",
    tables:"<Array<String>>",
    promisify:"Boolean" //converting non-promised db to promised
}
const DebugAvailables = {
    interpreter:"Boolean"
}
const EventAvailables = {
    timeout:"Boolean",
    music:"Boolean",
    functionError:"Boolean"
}
const fetchInvitesOptions = {
    enabled:"Boolean",
    cacheInviters:"Boolean"
}
//---------------Abbreviation------------//
const SI_SYMBOL = [ "","K",  "M",  "B",  "T",  "Qa",  "Qi",  "Sx",  "Sp",  "O", "N",
  "D",  "UD",  "UD",  "DD",  "TD", "QaD","QiD",  "SxD",  "SpD",  "OD",  "ND",
  "V",  "UV",  "DV",  "TV", "QaV",  "QiV",  "SxV", "SpV", "OV","NV",
  "DT",  "UDT",  "DDT",  "TDT",  "QaDT",  "QiDT",  "SxDT",  "SpDT",  "ODT",  "NDT",
  "DQa",  "UDQa",  "DDQa",  "TDQa", "QaDQa",  "QiDQa", "SxDQa",  "SpDQa",  "ODQa", "NDQa",
  "DQi",  "UDQi",  "DDQi",  "TDQi",  "QaDQi",  "QiDQi",  "SxDQi",  "SpDQi",  "ODQi",  "NDQi",
  "DSx",  "UDSx", "DDSx",  "TDSx",  "QaDSx",  "QiDSx",  "SxDSx", "SpDSx",  "ODSx",  "NDSx",
  "DSp",  "UDSp",  "DDSp", "TDSp",  "QaDSp", "QiDSp",  "SxDSp",  "SpDSp",  "ODSp",  "NDSp",
  "DO",  "UDO",  "DDO",  "TDO",  "QaDO",  "QiDO",  "SxDO",  "SpDO",  "ODO", "NDO",
  "DN", "UDN", "DDN",  "TDN",  "QaDN",  "QiDN", "SxDN", "SpDN",  "ODN",  "NDN",
  "C","UC",
];
//---------------Callbacks---------------//
const ApplicationCmdOptions  = {
id:"id of the slash cmd;.id",
name:"name of the slash cmd;.name",
description:"description of the slash cmd;.description",
version: "version of slash cmd;.version",
options:"options of slash cmd;.options",
guildID:"guildID of the slash cmd (returns null for global);.guildID",
applicationID:"returns Application ID",
defaultPermission : "returns default permission of the slash cmd;.defaultPermission",
timestamp:"returns timestamp of the creation of slash cmd (in ms);.timestamp",
createdAt:"returns the date of creation of slash cmd;.createdAt"
}
const ChannelOptions = {
//text + default
createdAt:"createdAt",
createdTimestamp:"createdTimestamp",
defaultAutoArchiveDuration:"defaultAuyoArchiveDuration",
deletable:"deletable",
deleted:"deleted",
guildID:"guild?.id",
id:"id",
lastMessageContent:"lastMessage?.content?.deleteBrackets()",
lastMessageID:"lastMessageId",
lastPinAt:"lastPinAt",
lastPinTimestamp:"lastPinTimestamp",
manageable:"manageable",
membersCount:"members?.size",
name:"name?.deleteBrackets()",
nsfw:"nsfw",
parentName:"parent?.name",
parentID:"parentId",
position:"position",
slowmode:"rateLimitPerUser",
topic:"topic?.deleteBrackets()",
type:"type",
viewable:"viewable",
permsAllowed:"permissionOverwrites?.cache?.map(x=>`type:${x.type}\nallowed:${x.allow}\nmetion:${x.type ==='?'<@'+x.id+'>':'<@&'+x.id+'>'}`).join(`\n`)",
permsDenied:"permissionOverwrites?.cache?.map(x=>`type:${x.type}\ndenied:${x.deny}\nmetion:${x.type ==='member'?'<@'+x.id+'>':'<@&'+x.id+'>'}`).join(`\n`)",
perms:"permissionOverwrites?.cache?.map(x=>`type:${x.type}\nallowed:${x.allow}\ndenied:${x.deny}\nmetion:${x.type ==='member'?'<@'+x.id+'>':'<@&'+x.id+'>'}`).join(`\n`)",
//category
childrenID:"children?.map(x=>x.id)?.join(' , ')",
childrenName:"children?.map(x=>x.name?.deleteBrackets())?.join(' , ')",
//voice 
bitrate:"bitrate",
full:"full",
joinable:"joinable",
rtcRegion:"rtcRegion",
userLimit:"useeLimit",
speakable:"speakable",
//threads 
archived:"archived",
archivedAt:"archivedAt",
archivedTimestamp:"archivedTimestamp",
autoArchiveDuration:"autoArchiveDuration",
threadMembersCount:"memberCount",
messagesCount:"messagesCount",
ownerID:"ownerId",
sendable:"sendable",
unachievable:"unarchivable"
}
const MemberOptions = {
    id: "id", 
    name: "user?.username?.deleteBrackets()", 
    guildID: "guild.id",
    nick: "nickname || ''", 
    roles: "roles?.cache?.filter(r => r.name !== '@everyone').map(r => r?.name.deleteBrackets()).join(', ')", 
    partial: "partial??false",
    premiumStamp: "premiumSinceTimestamp || `0`", 
    joinedStamp: "joinedTimestamp",
    voiceID: "voice.channelID || ''", 
    displayHex: "displayHexColor", 
    highestRoleID: "roles.highest.id",
    permissions: "permissions.toArray().goof('_')", 
    newPermissions: `(() => {
        const curr = d.data.newm?.permissions.toArray()
        const old = d.data.oldm?.permissions.toArray() 
        
        return curr?.filter(p => !old.includes(p))?.goof("_")
    })()`, 
    removedPermissions: `(() => {
        const curr = d.data.newm?.permissions.toArray()
        const old = d.data.oldm?.permissions.toArray() 
        
        return old?.filter(p => !curr.includes(p))?.goof("_")
    })()`, 
    bannable: "bannable",
    kickable: "kickable",
    manageable: "manageable",
    status: "status",
    activities: "presence?.activities?.map(c => c.name).join(', ')", 
    removedRoles: `(() => {
        const curr = d.data.newm?.roles.cache 
        const old = d.data.oldm?.roles.cache 
        
        return old?.filter(r => !curr.has(r.id)).map(r => r.name).join(", ").deleteBrackets() 
    })()`, 
    addedRoles: `roles?.cache?.filter(r => !d.data.oldm.roles.cache.has(r.id)).map(r => r.name).join(", ").deleteBrackets()`,
    //thread 
  threadChannel:"thread?.channel?.name?.deleteBrackets()",
  threadFlags:"flags?.toArray()"
}
//---------------Interactions------------//
const ButtonStyleOptions = {
primary:1,
secondary:2,
success:3,
danger:4,
link:5
}
const CacheOptions = {
        guilds:"GuildManager",
        messages:"MessageManager",
        channels:"ChannelManager",
        users:"UserManager",
        applicationCommands:"ApplicationCommandManager",
        applicationCommandPermissions:"ApplicationCommandPermissionManager",
        permissionOverwrites:"PermissionOverwritesManager",
        presences:"PersenceManager",
        reactions:"ReactionManager",
        reactionUsers:"ReactionUserManager",
    roles:"RoleManager",
    stageInstances:"StageInstanceManager",
    threads:"ThreadManager",
    threadMembers:"ThreadMemberManager",
    voiceStates:"VoiceStateManager",
    guildApplicationCommand:"GuildApplicationCommandManager",
    guildBans:"GuildBanManager",
    guildChannels:"GuildChannelManager",
    guildEmojis:"GuildEmojiManager",
    guildEmojiRoles:"GuildEmojiRoleManager",
    guildInvites:"GuildInviteManager",
    guildMembers:"GuildMemberManager",
    guildMemberRoles:"GuildMemberRoleManager",
    guildStickers:"GuildStickerManager"
    }
const SlashOptionTypes = {
    subCommand:1,
    subGroup:2,
    string:3,
    integer:4,
    boolean:5,
    user:6,
    channel:7,
    role:8,
    mentionable:9,
    number:10
}
module.exports = {
    ClientOptions:ClientOptions,
    IntentOptions:IntentOptions,
ClientPresenceOptions:ClientPresenceOptions,
PresenceActivityOptions:PresenceActivityOptions,
ActivityTypeAvailables:ActivityTypeAvailables,
    DatabaseOptions:DatabaseOptions,
    DebugAvailables:DebugAvailables,
    EventAvailables:EventAvailables,
    SI_SYMBOL:SI_SYMBOL,
    ButtonStyleOptions:ButtonStyleOptions,
    ChannelOptions:ChannelOptions ,
    MemberOptions:MemberOptions,
    CacheOptions:CacheOptions,
    SlashOptionTypes,
}

