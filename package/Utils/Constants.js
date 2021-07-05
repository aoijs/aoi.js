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
    suppressAllErrors:"Boolean",
    errorMessage:"<Array<Content,Embeds, Components,Files>>",
    autoUpdate:"Boolean"
}
const IntentOptions = {
guilds:"GUILDS",
guildMembers:"GUILD_MEMBERS",
guildBans:"GUILD_BANS",
guildEmojis:"GUILD_EMOJIS",
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

//---------------Interactions------------//
const ButtonStyleOptions = {
primary:1,
secondary:2,
success:3,
danger:4,
link:5
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
    ButtonStyleOptions:ButtonStyleOptions
}

