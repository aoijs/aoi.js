//---------------Client------------------//

const {
    IntentsBitField,
    ActivityType,
    PermissionsBitField,
    Events,
} = require("discord.js");

const IntentOptions = {
    ...IntentsBitField.Flags,
};

const ActivityTypeAvailables = {
    playing: ActivityType["Playing"],
    streaming: ActivityType["Streaming"],
    listening: ActivityType["Listening"],
    watching: ActivityType["Watching"],
    custom: ActivityType["Custom"],
    competing: ActivityType["Competing"],
    PLAYING: ActivityType["Playing"],
    STREAMING: ActivityType["Streaming"],
    LISTENING: ActivityType["Listening"],
    WATCHING: ActivityType["Watching"],
    CUSTOM: ActivityType["Custom"],
    COMPETING: ActivityType["Competing"],
};

const DebugAvailables = {
    interpreter: "Boolean",
};

const EventAvailables = {
    timeout: "Boolean",
    music: "Boolean",
    functionError: "Boolean",
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

//---------------Events---------------//

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
    perms: "permissionOverwrites?.cache?.map(x=>`type:${x.type}\nallowed:${x.allow}\ndenied:${x.deny}\nmetion:${x.type ==='member'?'<@'+x.id+'>':'<@&'+x.id+'>'}`).join(`\n`)",
    //category
    childrenID: "children?.map(x=>x.id)?.join(' , ')",
    childrenName: "children?.map(x=>x.name?.deleteBrackets())?.join(' , ')",
    //voice
    bitrate: "bitrate",
    full: "full",
    joinable: "joinable",
    rtcRegion: "rtcRegion",
    userLimit: "userLimit",
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
    createinvite: PermissionsBitField["Flags"].CreateInstantInvite,
    kickmembers: PermissionsBitField["Flags"].KickMembers,
    banmembers: PermissionsBitField["Flags"].BanMembers,
    administrator: PermissionsBitField["Flags"].Administrator,
    managechannels: PermissionsBitField["Flags"].ManageChannels,
    manageguild: PermissionsBitField["Flags"].ManageGuild,
    addreactions: PermissionsBitField["Flags"].AddReactions,
    viewauditlog: PermissionsBitField["Flags"].ViewAuditLog,
    priorityspeaker: PermissionsBitField["Flags"].PrioritySpeaker,
    stream: PermissionsBitField["Flags"].Stream,
    viewchannel: PermissionsBitField["Flags"].ViewChannel,
    sendmessages: PermissionsBitField["Flags"].SendMessages,
    sendttsmessages: PermissionsBitField["Flags"].SendTTSMessages,
    managemessages: PermissionsBitField["Flags"].ManageMessages,
    embedlinks: PermissionsBitField["Flags"].EmbedLinks,
    attachfiles: PermissionsBitField["Flags"].AttachFiles,
    readmessagehistory: PermissionsBitField["Flags"].ReadMessageHistory,
    mentioneveryone: PermissionsBitField["Flags"].MentionEveryone,
    useexternalemojis: PermissionsBitField["Flags"].UseExternalEmojis,
    viewguildinsights: PermissionsBitField["Flags"].ViewGuildInsights,
    connect: PermissionsBitField["Flags"].Connect,
    speak: PermissionsBitField["Flags"].Speak,
    mute: PermissionsBitField["Flags"].MuteMembers,
    deafen: PermissionsBitField["Flags"].DeafenMembers,
    movemembers: PermissionsBitField["Flags"].MoveMembers,
    usevad: PermissionsBitField["Flags"].UseVAD,
    changenickname: PermissionsBitField["Flags"].ChangeNickname,
    managenicknames: PermissionsBitField["Flags"].ManageNicknames,
    manageroles: PermissionsBitField["Flags"].ManageRoles,
    manageemojisandstickers: PermissionsBitField["Flags"].ManageEmojisAndStickers,
    moderatemembers: PermissionsBitField["Flags"].ModerateMembers,
    managewebhooks: PermissionsBitField["Flags"].ManageWebhooks,
    //voice
    requesttospeak: PermissionsBitField["Flags"].RequestToSpeak,
    managethreads: PermissionsBitField["Flags"].ManageThreads,
    createpublicthreads: PermissionsBitField["Flags"].CreatePublicThreads,
    createprivatethreads: PermissionsBitField["Flags"].CreatePrivateThreads,
    useexternalsticker: PermissionsBitField["Flags"].UseExternalStickers,
    sendmessagesinthreads: PermissionsBitField["Flags"].SendMessagesInThreads,
    useembeddedactivities: PermissionsBitField["Flags"].UseEmbeddedActivities,
    //guild
    all: Object.keys(PermissionsBitField["Flags"]),
};
const FormatPerms = {};
for (const perm in PermissionsBitField.Flags) {
    FormatPerms[perm.toLowerCase()] = perm;
}
const FormatOptions = (date) => {
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

const EventsToIntents = {
    // Guild Messages
    onMessage: "GuildMessages",
    onMessageDelete: "GuildMessages",
    onMessageUpdate: "GuildMessages",
    onMessageDeleteBulk: "GuildMessages",

    // Guilds
    onGuildJoin: "Guilds",
    onGuildLeave: "Guilds",
    onGuildUpdate: "Guilds",
    onGuildUnavailable: "Guilds",
    onRoleCreate: "Guilds",
    onRoleUpdate: "Guilds",
    onRoleDelete: "Guilds",
    onChannelCreate: "Guilds",
    onChannelUpdate: "Guilds",
    onChannelDelete: "Guilds",
    onChannelPinsUpdate: "Guilds",
    onStageInstanceCreate: "Guilds",
    onStageInstanceUpdate: "Guilds",
    onStageInstanceDelete: "Guilds",
    onThreadCreate: "Guilds",
    onThreadUpdate: "Guilds",
    onThreadDelete: "Guilds",
    onThreadListSync: "Guilds",
    onThreadMemberUpdate: "Guilds",
    onThreadMembersUpdate: "Guilds",

    // Guild Members
    onJoin: "GuildMembers",
    onLeave: "GuildMembers",
    onMemberUpdate: "GuildMembers",
    onMemberAvailable: "GuildMembers",
    onMembersChunk: "GuildMembers",

    // Guild Emojis
    onEmojiCreate: "GuildEmojis",
    onEmojiDelete: "GuildEmojis",
    onEmojiUpdate: "GuildEmojis",
    onStickerCreate: "GuildEmojis",
    onStickerDelete: "GuildEmojis",
    onStickerUpdate: "GuildEmojis",

    // Guild Bans
    onBanAdd: "GuildBans",
    onBanRemove: "GuildBans",

    // Guild Invites
    onInviteCreate: "GuildInvites",
    onInviteDelete: "GuildInvites",

    // Guild Message Reactions
    onReactionAdd: "GuildMessageReactions",
    onReactionRemove: "GuildMessageReactions",
    onReactionRemoveAll: "GuildMessageReactions",
    onReactionRemoveEmoji: "GuildMessageReactions",

    // Guild Voice States
    onVoiceStateUpdate: "GuildVoiceStates",

    // Guild Presences
    onPresenceUpdate: "GuildPresences",

    // Guild Message Typings
    onTypingStart: "GuildMessageTypings",

    // Non-Intents
    onInteractionCreate: "NonIntents",
    onApplicationCmdPermsUpdate: "NonIntents",
    onUserUpdate: "NonIntents",

    // Guild Webhooks
    onWebhookUpdate: "GuildWebhooks",

    // Custom
    onVariableCreate: "Custom",
    onVariableDelete: "Custom",
    onVariableUpdate: "Custom",
    onFunctionError: "Custom",
};

const EventsToDjsEvents = {
    // Guilds
    onGuildJoin: Events.GuildCreate,
    onGuildLeave: Events.GuildDelete,
    onGuildUpdate: Events.GuildUpdate,
    onGuildUnavailable: Events.GuildUnavailable,
    onRoleCreate: Events.GuildRoleCreate,
    onRoleUpdate: Events.GuildRoleUpdate,
    onRoleDelete: Events.GuildRoleDelete,
    onChannelCreate: Events.ChannelCreate,
    onChannelUpdate: Events.ChannelUpdate,
    onChannelDelete: Events.ChannelDelete,
    onChannelPinsUpdate: Events.ChannelPinsUpdate,
    onStageInstanceCreate: Events.StageInstanceCreate,
    onStageInstanceUpdate: Events.StageInstanceUpdate,
    onStageInstanceDelete: Events.StageInstanceDelete,
    onThreadCreate: Events.ThreadCreate,
    onThreadUpdate: Events.ThreadUpdate,
    onThreadDelete: Events.ThreadDelete,
    onThreadListSync: Events.ThreadListSync,
    onThreadMemberUpdate: Events.ThreadMemberUpdate,
    onThreadMembersUpdate: Events.ThreadMembersUpdate,

    // Guild Members
    onJoin: Events.GuildMemberAdd,
    onLeave: Events.GuildMemberRemove,
    onMemberUpdate: Events.GuildMemberUpdate,
    onMemberAvailable: Events.GuildMemberAvailable,
    onMembersChunk: Events.GuildMembersChunk,

    // Guild Emojis
    onEmojiCreate: Events.GuildEmojiCreate,
    onEmojiDelete: Events.GuildEmojiDelete,
    onEmojiUpdate: Events.GuildEmojiUpdate,
    onStickerCreate: Events.GuildStickerCreate,
    onStickerDelete: Events.GuildStickerDelete,
    onStickerUpdate: Events.GuildStickerUpdate,

    // Guild Bans
    onBanAdd: Events.GuildBanAdd,
    onBanRemove: Events.GuildBanRemove,

    // Guild Invites
    onInviteCreate: Events.InviteCreate,
    onInviteDelete: Events.InviteDelete,

    // Guild Messages
    onMessage: Events.MessageCreate,
    onMessageDelete: Events.MessageDelete,
    onMessageUpdate: Events.MessageUpdate,
    onMessageDeleteBulk: Events.MessageBulkDelete,

    // Guild Message Reactions
    onReactionAdd: Events.MessageReactionAdd,
    onReactionRemove: Events.MessageReactionRemove,
    onReactionRemoveAll: Events.MessageReactionRemoveAll,
    onReactionRemoveEmoji: Events.MessageReactionRemoveEmoji,

    // Guild Voice States
    onVoiceStateUpdate: Events.VoiceStateUpdate,

    // Guild Presences
    onPresenceUpdate: Events.PresenceUpdate,

    // Guild Message Typings
    onTypingStart: Events.TypingStart,

    // Non-Intents
    onInteractionCreate: Events.InteractionCreate,
    onApplicationCmdPermsUpdate: Events.ApplicationCommandPermissionsUpdate,
    onUserUpdate: Events.UserUpdate,
    onWebhookUpdate: Events.WebhooksUpdate,

    // Custom
    onVariableCreate: "variableCreate",
    onVariableDelete: "variableDelete",
    onVariableUpdate: "variableUpdate",
    onFunctionError: "functionError",
};

const EventstoFile = {
    onMessage: ["commands", "alwaysExecute", "nonPrefixed"],
    onMessageDelete: "deleteMessage",
    onMessageUpdate: "updateMessage",
    onMessageDeleteBulk: "bulkDeleteMessage",
    onChannelPinsUpdate: "channelPinsUpdate",
    onTypingStart: "start",

    // Guild events
    onGuildJoin: "guildJoin",
    onGuildLeave: "guildLeave",
    onGuildUpdate: "guildUpdate",
    onGuildUnavailable: "guildUnavailable",

    // Role events
    onRoleCreate: "roleCreate",
    onRoleUpdate: "roleUpdate",
    onRoleDelete: "roleDelete",

    // Channel events
    onChannelCreate: "channelCreate",
    onChannelUpdate: "channelUpdate",
    onChannelDelete: "channelDelete",

    // Stage instance events
    onStageInstanceCreate: "stageInstanceCreate",
    onStageInstanceUpdate: "stageInstanceUpdate",
    onStageInstanceDelete: "stageInstanceDelete",

    // Thread events
    onThreadCreate: "threadCreate",
    onThreadUpdate: "threadUpdate",
    onThreadDelete: "threadDelete",
    onThreadListSync: "threadListSync",
    onThreadMemberUpdate: "threadMemberUpdate",
    onThreadMembersUpdate: "threadMembersUpdate",

    // Member events
    onJoin: "join",
    onLeave: "leave",
    onMemberUpdate: "update",
    onMemberAvailable: "available",
    onMembersChunk: "chunk",

    // Invite events
    onInviteCreate: "inviteCreate",
    onInviteDelete: "inviteDelete",

    // Emoji and sticker events
    onEmojiCreate: "create",
    onEmojiDelete: "delete",
    onEmojiUpdate: "update",
    onStickerCreate: "stickerCreate",
    onStickerDelete: "stickerDelete",
    onStickerUpdate: "stickerUpdate",

    // Ban events
    onBanAdd: "add",
    onBanRemove: "remove",

    // Reaction events
    onReactionAdd: "add",
    onReactionRemove: "remove",
    onReactionRemoveAll: "removeAll",
    onReactionRemoveEmoji: "removeEmoji",

    // Voice and presence events
    onVoiceStateUpdate: "update",
    onPresenceUpdate: "update",

    // Interaction and command events
    onInteractionCreate: "interaction",
    onApplicationCmdPermsUpdate: "appCmdPermUpdate",

    // User events
    onUserUpdate: "userUpdate",

    // Variable events
    onVariableCreate: "varCreate",
    onVariableDelete: "varDelete",
    onVariableUpdate: "varUpdate",

    // Other events
    onFunctionError: "functionError",
    onWebhookUpdate: "update",
};

const AllEvents = Object.keys(EventstoFile);

module.exports = {
    FormatOptions,
    ApplicationCmdOptions,
    ActivityTypeAvailables,
    DebugAvailables,
    EventAvailables,
    SI_SYMBOL,
    ButtonStyleOptions,
    ChannelOptions,
    MemberOptions,
    CacheOptions,
    SlashOptionTypes,
    Perms,
    Characters,
    IntentOptions,
    FormatPerms,
    EventsToIntents,
    EventsToDjsEvents,
    AllEvents,
    EventstoFile,
};
