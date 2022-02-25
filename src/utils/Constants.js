//---------------Client------------------//

const IntentOptions = {
  guilds: "GUILDS",
  guildMembers: "GUILD_MEMBERS",
  guildBans: "GUILD_BANS",
  guildEmojisAndStickers: "GUILD_EMOJIS_AND_STICKERS",
  guildIntegrations: "GUILD_INTEGRATIONS",
  guildWebhooks: "GUILD_WEBHOOKS",
  guildInvites: "GUILD_INVITES",
  guildVoiceStates: "GUILD_VOICE_STATES",
  guildPresences: "GUILD_PRESENCES",
  guildMessages: "GUILD_MESSAGES",
  guildMessageReactions: "GUILD_MESSAGE_REACTIONS",
  guildMessageTyping: "GUILD_MESSAGE_TYPING",
  directMessages: "DIRECT_MESSAGES",
  directMessageReactions: "DIRECT_MESSAGE_REACTIONS",
  directMessageTyping: "DIRECT_MESSAGE_TYPING",
};
IntentOptions.all = Object.values(IntentOptions);

const ActivityTypeAvailables = {
  playing: "PLAYING",
  watching: "WATCHING",
  listening: "LISTENING",
  streaming: "STREAMING",
  competing: "COMPETING",
};

const DebugAvailables = {
  interpreter: "Boolean",
};

const EventAvailables = {
  timeout: "Boolean",
  music: "Boolean",
  functionError: "Boolean",
};

const fetchInvitesOptions = {
  enabled: "Boolean",
  cacheInviters: "Boolean",
};

//---------------Abbreviation------------//
const SI_SYMBOL = [
  "",
  "K",
  "M",
  "B",
  "T",
  "Qa",
  "Qi",
  "Sx",
  "Sp",
  "O",
  "N",
  "D",
  "UD",
  "UD",
  "DD",
  "TD",
  "QaD",
  "QiD",
  "SxD",
  "SpD",
  "OD",
  "ND",
  "V",
  "UV",
  "DV",
  "TV",
  "QaV",
  "QiV",
  "SxV",
  "SpV",
  "OV",
  "NV",
  "DT",
  "UDT",
  "DDT",
  "TDT",
  "QaDT",
  "QiDT",
  "SxDT",
  "SpDT",
  "ODT",
  "NDT",
  "DQa",
  "UDQa",
  "DDQa",
  "TDQa",
  "QaDQa",
  "QiDQa",
  "SxDQa",
  "SpDQa",
  "ODQa",
  "NDQa",
  "DQi",
  "UDQi",
  "DDQi",
  "TDQi",
  "QaDQi",
  "QiDQi",
  "SxDQi",
  "SpDQi",
  "ODQi",
  "NDQi",
  "DSx",
  "UDSx",
  "DDSx",
  "TDSx",
  "QaDSx",
  "QiDSx",
  "SxDSx",
  "SpDSx",
  "ODSx",
  "NDSx",
  "DSp",
  "UDSp",
  "DDSp",
  "TDSp",
  "QaDSp",
  "QiDSp",
  "SxDSp",
  "SpDSp",
  "ODSp",
  "NDSp",
  "DO",
  "UDO",
  "DDO",
  "TDO",
  "QaDO",
  "QiDO",
  "SxDO",
  "SpDO",
  "ODO",
  "NDO",
  "DN",
  "UDN",
  "DDN",
  "TDN",
  "QaDN",
  "QiDN",
  "SxDN",
  "SpDN",
  "ODN",
  "NDN",
  "C",
  "UC",
];
//---------------Callbacks---------------//
const ApplicationCmdOptions = {
  id: "id of the slash cmd;.id",
  name: "name of the slash cmd;.name",
  description: "description of the slash cmd;.description",
  version: "version of slash cmd;.version",
  options: "options of slash cmd;.options",
  guildID: "guildID of the slash cmd (returns null for global);.guildID",
  applicationID: "returns Application ID",
  defaultPermission:
    "returns default permission of the slash cmd;.defaultPermission",
  timestamp:
    "returns timestamp of the creation of slash cmd (in ms);.timestamp",
  createdAt: "returns the date of creation of slash cmd;.createdAt",
};
const ChannelOptions = {
  //text + default
  createdAt: "createdAt",
  createdTimestamp: "createdTimestamp",
  defaultAutoArchiveDuration: "defaultAuyoArchiveDuration",
  deletable: "deletable",
  deleted: "deleted",
  guildID: "guild?.id",
  id: "id",
  lastMessageContent: "lastMessage?.content?.deleteBrackets()",
  lastMessageID: "lastMessageId",
  lastPinAt: "lastPinAt",
  lastPinTimestamp: "lastPinTimestamp",
  manageable: "manageable",
  membersCount: "members?.size",
  name: "name?.deleteBrackets()",
  nsfw: "nsfw",
  parentName: "parent?.name",
  parentID: "parentId",
  position: "position",
  slowmode: "rateLimitPerUser",
  topic: "topic?.deleteBrackets()",
  type: "type",
  viewable: "viewable",
  permsAllowed:
    "permissionOverwrites?.cache?.map(x=>`type:${x.type}\nallowed:${x.allow}\nmetion:${x.type ==='?'<@'+x.id+'>':'<@&'+x.id+'>'}`).join(`\n`)",
  permsDenied:
    "permissionOverwrites?.cache?.map(x=>`type:${x.type}\ndenied:${x.deny}\nmetion:${x.type ==='member'?'<@'+x.id+'>':'<@&'+x.id+'>'}`).join(`\n`)",
  perms:
    "permissionOverwrites?.cache?.map(x=>`type:${x.type}\nallowed:${x.allow}\ndenied:${x.deny}\nmetion:${x.type ==='member'?'<@'+x.id+'>':'<@&'+x.id+'>'}`).join(`\n`)",
  //category
  childrenID: "children?.map(x=>x.id)?.join(' , ')",
  childrenName: "children?.map(x=>x.name?.deleteBrackets())?.join(' , ')",
  //voice
  bitrate: "bitrate",
  full: "full",
  joinable: "joinable",
  rtcRegion: "rtcRegion",
  userLimit: "useeLimit",
  speakable: "speakable",
  //threads
  archived: "archived",
  archivedAt: "archivedAt",
  archivedTimestamp: "archivedTimestamp",
  autoArchiveDuration: "autoArchiveDuration",
  threadMembersCount: "memberCount",
  messagesCount: "messagesCount",
  ownerID: "ownerId",
  sendable: "sendable",
  unachievable: "unarchivable",
};
const MemberOptions = {
  id: "id",
  name: "user?.username?.deleteBrackets()",
  guildID: "guild.id",
  nick: "nickname || ''",
  roles:
    "roles?.cache?.filter(r => r.name !== '@everyone').map(r => r?.name.deleteBrackets()).join(', ')",
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
  removedRoles: `roles.cache?.filter(r => ! d.data.newm?.roles.cache.has(r.id)).map(r => r.name).join(", ").deleteBrackets()`,
  addedRoles: `roles?.cache?.filter(r => !d.data.oldm.roles.cache.has(r.id)).map(r => r.name).join(", ").deleteBrackets()`,
  //thread
  threadChannel: "thread?.channel?.name?.deleteBrackets()",
  threadFlags: "flags?.toArray()",
};
//---------------Interactions------------//
const ButtonStyleOptions = {
  primary: 1,
  secondary: 2,
  success: 3,
  danger: 4,
  link: 5,
};
const CacheOptions = {
  guilds: "GuildManager",
  messages: "MessageManager",
  channels: "ChannelManager",
  users: "UserManager",
  applicationCommands: "ApplicationCommandManager",
  applicationCommandPermissions: "ApplicationCommandPermissionManager",
  permissionOverwrites: "PermissionOverwritesManager",
  presences: "PersenceManager",
  reactions: "ReactionManager",
  reactionUsers: "ReactionUserManager",
  roles: "RoleManager",
  stageInstances: "StageInstanceManager",
  threads: "ThreadManager",
  threadMembers: "ThreadMemberManager",
  voiceStates: "VoiceStateManager",
  guildApplicationCommand: "GuildApplicationCommandManager",
  guildBans: "GuildBanManager",
  guildChannels: "GuildChannelManager",
  guildEmojis: "GuildEmojiManager",
  guildEmojiRoles: "GuildEmojiRoleManager",
  guildInvites: "GuildInviteManager",
  guildMembers: "GuildMemberManager",
  guildMemberRoles: "GuildMemberRoleManager",
  guildStickers: "GuildStickerManager",
};
const SlashOptionTypes = {
  subCommand: 1,
  subGroup: 2,
  string: 3,
  integer: 4,
  boolean: 5,
  user: 6,
  channel: 7,
  role: 8,
  mentionable: 9,
  number: 10,
};
const Perms = {
  createinvite: "CREATE_INSTANT_INVITE",
  kick: "KICK_MEMBERS",
  ban: "BAN_MEMBERS",
  admin: "ADMINISTRATOR", // (implicitly has all permissions, and bypasses all channel overwrites)
  managechannel: "MANAGE_CHANNELS", // (edit and reorder channels)
  manageserver: "MANAGE_GUILD", // (edit the guild information, region, etc.)
  addreactions: "ADD_REACTIONS", // (add new reactions to messages)
  viewauditlog: "VIEW_AUDIT_LOG",
  priorityspeaker: "PRIORITY_SPEAKER",
  stream: "STREAM",
  viewchannel: "VIEW_CHANNEL",
  sendmessage: "SEND_MESSAGES",
  sendtts: "SEND_TTS_MESSAGES",
  managemessages: "MANAGE_MESSAGES", // (delete messages and reactions)
  embedlinks: "EMBED_LINKS", // (links posted will have a preview embedded)
  attachfiles: "ATTACH_FILES",
  readmessagehistory: "READ_MESSAGE_HISTORY", // (view messages that were posted prior to opening Discord)
  mentioneveryone: "MENTION_EVERYONE",
  externalemojis: "USE_EXTERNAL_EMOJIS", // (use emojis from different guilds)
  viewguildinsights: "VIEW_GUILD_INSIGHTS",
  connect: "CONNECT", // (connect to a voice channel)
  speak: "SPEAK", // (speak in a voice channel)
  mutemembers: "MUTE_MEMBERS", // (mute members across all voice channels)
  deafenmembers: "DEAFEN_MEMBERS", // (deafen members across all voice channels)
  movemembers: "MOVE_MEMBERS", // (move members between voice channels)
  usevad: "USE_VAD", // (use voice activity detection)
  changenickname: "CHANGE_NICKNAME",
  managenicknames: "MANAGE_NICKNAMES", // (change other members' nicknames)
  manageroles: "MANAGE_ROLES",
  managewebhooks: "MANAGE_WEBHOOKS",
  manageemojisandstickers: "MANAGE_EMOJIS_AND_STICKERS",
  useappcmds: "USE_APPLICATION_COMMANDS",
  requesttospeak: "REQUEST_TO_SPEAK",
  manageevents : "MANAGE_EVENTS",
  managethreads: "MANAGE_THREADS",
  usepublicthreads: "USE_PUBLIC_THREADS",
  useprivatethreads: "USE_PRIVATE_THREADS",
  createpublicthreads: "CREATE_PUBLIC_THREADS",
  createprivatethreads: "CREATE_PRIVATE_THREADS",
  externalstickers: "USE_EXTERNAL_STICKERS", // (use stickers from different guilds)
  sendmessageinthreads: "SEND_MESSAGES_IN_THREADS",
  startembeddedactivities: "START_EMBEDDED_ACTIVITIES",
  moderatemembers: "MODERATE_MEMBERS",
};
const FormatOptions = (date, timeZone) => {
  ////defining
  // months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  //days
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  ////Returning Data
  return {
    YY: date.getFullYear().toString().slice(-2),

    YYYY: date.getFullYear(),

    M: date.getMonth() + 1,

    MM:
      (date.getMonth() + 1).toString().length === 1
        ? 0 + (date.getMonth() + 1).toString()
        : (date.getMonth() + 1).toString(),

    MMM: months[date.getMonth()].slice(0, 3),

    MMMM: months[date.getMonth()],

    D: date.getDate(),

    DD:
      date.getDate().toString().length === 1
        ? 0 + date.getDate().toString()
        : date.getDate().toString(),

    d: date.getDay(),

    dd: days[date.getDay()].slice(0, 2),

    ddd: days[date.getDay()].slice(0, 3),

    dddd: days[date.getDay()],

    H: date.getHours(),

    HH:
      date.getHours().toString().length === 1
        ? 0 + date.getHours().toString()
        : date.getHours().toString(),

    h: Math.abs(date.getHours() - 12),

    hh: "hi",
  };
};
const Characters = [
  "1234567890",
  "qwertyuiopalskdjfhgznmxcbv",
  "qwertyuiopalskdjfhgznmxcbv".toUpperCase(),
].join("");

module.exports = {
  // ClientOptions:ClientOptions,
  IntentOptions: IntentOptions,
  //ClientPresenceOptions:ClientPresenceOptions,
  //PresenceActivityOptions:PresenceActivityOptions,
  ActivityTypeAvailables: ActivityTypeAvailables,
  //DatabaseOptions:DatabaseOptions,
  DebugAvailables: DebugAvailables,
  EventAvailables: EventAvailables,
  SI_SYMBOL: SI_SYMBOL,
  ButtonStyleOptions: ButtonStyleOptions,
  ChannelOptions: ChannelOptions,
  MemberOptions: MemberOptions,
  CacheOptions: CacheOptions,
  SlashOptionTypes,
  Perms,
  Characters,
};
