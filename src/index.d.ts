import { Group, LimitGroup, SuperSet } from "@akarui/structures";
import { BitFieldResolvable, Client, GatewayIntentsString, ShardingManager } from "discord.js";
import { EventEmitter } from "events";

// AOI Error
export type ErrorMsg = string | Record<string, string | boolean | object | any[]>;
class AoiError {
    static EventError(event: string, intent: string, line?: number): void;
    static CommandError(
        command: string,
        type: string,
        name: string,
        position?: number
    ): void;
    static makeMessageError<Channel>(
        client: AoiClient,
        channel: Channel,
        message: ErrorMsg,
        options?: Record<string, unknown>
    ): void;
    static consoleError(errorname: string, errorMsg: ErrorMsg): void;
    static functionErrorResolve<d>(
        d: d,
        type: string,
        object: object,
        message: ErrorMsg
    ): void;
    static fnError<d>(
        d: d,
        type: string,
        object: object,
        message: ErrorMsg
    ): void;
}

export type IntentOptions = string[];
export type AoiEvents = "onMessage" 
    | "onMessageDelete" 
    | "onMessageUpdate" 
    | "onMessageDeleteBulk" 
    | "onChannelPinsUpdate" 
    | "onTypingStart" 
    | "onGuildJoin" 
    | "onGuildLeave" 
    | "onGuildUpdate" 
    | "onGuildUnavailable" 
    | "onRoleCreate" 
    | "onRoleUpdate" 
    | "onRoleDelete" 
    | "onChannelCreate" 
    | "onChannelUpdate" 
    | "onChannelDelete" 
    | "onStageInstanceCreate" 
    | "onStageInstanceUpdate" 
    | "onStageInstanceDelete" 
    | "onThreadCreate" 
    | "onThreadUpdate" 
    | "onThreadDelete" 
    | "onThreadListSync" 
    | "onThreadMemberUpdate" 
    | "onThreadMembersUpdate" 
    | "onJoin" 
    | "onLeave" 
    | "onMemberUpdate" 
    | "onMemberAvailable" 
    | "onMembersChunk" 
    | "onInviteCreate" 
    | "onInviteDelete" 
    | "onEmojiCreate" 
    | "onEmojiDelete" 
    | "onEmojiUpdate" 
    | "onStickerCreate" 
    | "onStickerDelete" 
    | "onStickerUpdate" 
    | "onBanAdd" 
    | "onBanRemove" 
    | "onReactionAdd" 
    | "onReactionRemove" 
    | "onReactionRemoveAll" 
    | "onReactionRemoveEmoji" 
    | "onVoiceStateUpdate" 
    | "onPresenceUpdate" 
    | "onInteractionCreate" 
    | "onApplicationCommandPermissionsUpdate" 
    | "onUserUpdate" 
    | "onVariableCreate" 
    | "onVariableDelete" 
    | "onVariableUpdate" 
    | "onFunctionError" 
    | "onWebhookUpdate" 
    | "onAutoModerationActionExecution" 
    | "onAutoModerationRuleDelete" 
    | "onAutoModerationRuleCreate" 
    | "onAutoModerationRuleUpdate";
export type DatabaseOption<Database> = {
    type: "default"
        | "dbdjs.db"
        | "aoi.db"
        | "dbdts.db"
        | "dbdjs.mongo"
        | "dbdjs.db-sql"
        | "aoi.fb"
        | "custom";
    db: Database;
    path?: string;
    tables?: Array<string>;
    extraOptions?: Record<string, any>;
    promisify?: boolean;
};
export type RespondOnEditOptions = {
    commands?: boolean;
    alwaysExecute?: boolean;
    nonPrefixed?: boolean;
    time?: number;
};
export type CacheOptions = Record<string, number | undefined | null>;
export type ClientOptions = {
    token: string;
    prefix: string | Array<string>;
    intents: BitFieldResolvable<GatewayIntentsString, number>;
    database?: DatabaseOption<any>;
    respondOnEdit?: RespondOnEditOptions;
    disableFunctions?: Array<string>;
    respondToBots: boolean;
    guildOnly: boolean;
    cache: CacheOptions;
    aoiLogs?: boolean;
    aoiWarning?: boolean;
    aoiAutoUpdate?: boolean;
    suppressAllErrors?: boolean;
    errorMessage?: Array<string>;
    events?: AoiEvents[];
    fetchInvites?: {
        enabled: boolean;
        cacheInviters?: boolean;
    };
};

// Commands
export type CommandTypes = "default" 
    | "awaited" 
    | "messageDelete" 
    | "messageUpdate" 
    | "messageDeleteBulk" 
    | "guildJoin" 
    | "guildUpdate" 
    | "guildLeave" 
    | "guildUnavailable" 
    | "roleCreate" 
    | "roleUpdate" 
    | "roleDelete" 
    | "channelCreate" 
    | "channelUpdate" 
    | "channelDelete" 
    | "channelPinsUpdate" 
    | "stageInstanceCreate" 
    | "stageInstanceUpdate" 
    | "stageInstanceDelete" 
    | "stickerCreate" 
    | "stickerDelete" 
    | "stickerUpdate" 
    | "threadCreate" 
    | "threadDelete" 
    | "threadListSync" 
    | "threadMemberUpdate" 
    | "threadMembersUpdate" 
    | "threadUpdate" 
    | "join" 
    | "leave" 
    | "inviteCreate" 
    | "inviteDelete" 
    | "memberUpdate" 
    | "memberAvailable" 
    | "membersChunk" 
    | "emojiCreate" 
    | "emojiUpdate" 
    | "emojiDelete" 
    | "banAdd" 
    | "banRemove" 
    | "webhookUpdate" 
    | "voiceStateUpdate" 
    | "presenceUpdate" 
    | "reactionAdd" 
    | "reactionRemove" 
    | "reactionRemoveEmoji" 
    | "reactionRemoveAll" 
    | "typingStart" 
    | "loop" 
    | "timeout" 
    | "pulse" 
    | "ready" 
    | "variableCreate" 
    | "variableDelete" 
    | "variableUpdate" 
    | "functionError" 
    | "interaction" 
    | "applicationCmdCreate" 
    | "applicationCmdUpdate" 
    | "applicationCmdDelete" 
    | "applicationCmdPermissionsUpdate" 
    | "userUpdate" 
    | "rateLimit" 
    | "shardReady" 
    | "shardResume" 
    | "shardReconnecting" 
    | "shardDisconnect" 
    | "shardError" 
    | "autoModActionExecution" 
    | "autoModCreate" 
    | "autoModDelete" 
    | "autoModUpdate";
interface BaseCommand {
    type?: CommandTypes;
    code: string;
}
export interface EventCommand extends BaseCommand {
    name?: string;
    channel?: string;
    [key: string]: any;
}
export interface Command extends BaseCommand {
    name: string;
    aliases?: string | Array<string>;
    async?: boolean;
    whitelist?: boolean;
    nonPrefixed?: boolean;
    error?: string;
}
export interface AwaitCommand extends BaseCommand {
    name: string;
}
export interface InteractionCommand extends BaseCommand {
    name: string | Array<string>;
    prototype: "application" | "button" | "selectMenu";
}
export interface CustomEventCommand extends BaseCommand {
    name: string;
    listen: string;
}
export interface LoopCommand extends BaseCommand {
    every: number;
    channel?: string;
    executeOnStartup?: boolean;
}

// Status Manager
type StatusOption = {
    text: string;
    url: string;
    time: number;
    shardId: number;
    type: "PLAYING" | "LISTENING" | "WATCHING" | "STREAMING";
    status: string;
};

// AoiClient
export declare class BaseClient extends Client {
    aoiOptions: Record<string, any>;
    interactionManager: InteractionManager;
    cacheManager: CacheManager;
    variableManager: any;
    prefix: string | string[];
    db: any;
    statuses: Group;
    constructor(options: ClientOptions);
    status(d: StatusOption[]): void;
    variables(data: object, table?: string): void;
};

export declare class AoiClient extends BaseClient {
    cmd: CommandManager;
    functionManager: FunctionManager;
    constructor(options: ClientOptions);
    command(d: Command): void;
    awaitedCommand(d: AwaitCommand): void;
    deletedCommand(d: EventCommand): void;
    updateCommand(d: EventCommand): void;
    bulkDeleteCommand(d: EventCommand): void;
    guildJoinCommand(d: EventCommand): void;
    guildLeaveCommand(d: EventCommand): void;
    guildUpdateCommand(d: EventCommand): void;
    guildUnavailableCommand(d: EventCommand): void;
    roleCreateCommand(d: EventCommand): void;
    roleUpdateCommand(d: EventCommand): void;
    roleDeleteCommand(d: EventCommand): void;
    channelCreateCommand(d: EventCommand): void;
    channelUpdateCommand(d: EventCommand): void;
    channelDeleteCommand(d: EventCommand): void;
    channelPinsUpdateCommand(d: EventCommand): void;
    stageInstanceCreateCommand(d: EventCommand): void;
    stageInstanceUpdateCommand(d: EventCommand): void;
    stageInstanceDeleteCommand(d: EventCommand): void;
    threadCreateCommand(d: EventCommand): void;
    threadUpdateCommand(d: EventCommand): void;
    threadDeleteCommand(d: EventCommand): void;
    threadListSyncCommand(d: EventCommand): void;
    threadMemberUpdateCommand(d: EventCommand): void;
    joinCommand(d: EventCommand): void;
    leaveCommand(d: EventCommand): void;
    memberUpdateCommand(d: EventCommand): void;
    threadMembersUpdateCommand(d: EventCommand): void;
    memberAvailableCommand(d: EventCommand): void;
    membersChunkCommand(d: EventCommand): void;
    emojiCreateCommand(d: EventCommand): void;
    emojiDeleteCommand(d: EventCommand): void;
    emojiUpdateCommand(d: EventCommand): void;
    banAddCommand(d: EventCommand): void;
    banRemoveCommand(d: EventCommand): void;
    reactionAddCommand(d: EventCommand): void;
    reactionRemoveCommand(d: EventCommand): void;
    reactionRemoveAllCommand(d: EventCommand): void;
    reactionRemoveEmojiCommand(d: EventCommand): void;
    presenceUpdateCommand(d: EventCommand): void;
    voiceStateUpdateCommand(d: EventCommand): void;
    interactionCommand(d: InteractionCommand): void;
    applicationCmdCreateCommand(d: EventCommand): void;
    applicationCmdDeleteCommand(d: EventCommand): void;
    applicationCmdUpdateCommand(d: EventCommand): void;
    userUpdateCommand(d: EventCommand): void;
    variableCreateCommand(d: EventCommand): void;
    variableDeleteCommand(d: EventCommand): void;
    variableUpdateCommand(d: EventCommand): void;
    readyCommand(d: EventCommand): void;
    functionErrorCommand(d: EventCommand): void;
    loopCommand(d: LoopCommand): void;
    timeoutCommand(d: EventCommand): void;
    pulseCommand(d: EventCommand): void;
    rateLimitCommand(d: EventCommand): void;
    webhookUpdateCommand(d: EventCommand): void;
};

// cacheManager
export type CacheTypes = "cache" | "limitCache" | "setCache";
export declare class CacheManager {
    constructor(client: AoiClient);
    get types(): CacheTypes;
    _validType(type: string): boolean;
    createCache(type: "cache", name: string): Group;
    createCache(type: "limitCache", name: string): LimitGroup;
    createCache(type: "setCache", name: string): SuperSet;
    deleteCache(type: "cache", name: string): Group;
    deleteCache(type: "limitCache", name: string): LimitGroup;
    deleteCache(type: "setCache", name: string): SuperSet;
    static _DjsCacheManager(cache: CacheOptions): any;
}

// Client Shard
export declare class ClientShard extends ShardingManager {
    file: string;
    client: AoiClient;
    constructor(file: string, options: object, client: AoiClient);
    onShardDisconnect(): void;
    onShardError(): void;
    onShardResume(): void;
    onShardReconnecting(): void;
    onShardReady(): void;
}

// CommandManager
export declare class Command {
    [key: string]: any;
    __client__: AoiClient;
    constructor(d: object, client: AoiClient);
    serializeFunctions(): string[];
    serializeCode(): void | string[];
    toString(): string;
    toArray(): [string, any][];
    keys(): string[];
    values(): unknown[];
}
export declare class CommandManager {
    client: AoiClient;
    customCmds?: Array<string>;
    constructor(client: AoiClient, formCommand?: boolean, customCmds?: string[]);
    get types(): string[];
    createCommand(d: any): void;
    formCommand(): void;
    formCustomCommand(customCmds: string[]): void;
}

// Function Manager
export declare class FunctionManager {
    client: AoiClient;
    maps: Record<string, string[]>;
    functions: string[];
    cache: Group;
    interpreter: unknown;

    constructor(client: AoiClient);

    cacheFunctions(): void;
    createFunction(data: Array<Record<string, any>>): void;
    findFunctions(code: string): string[];
    serializeCode(code: string): string[];
}

// LoadCommands
export declare class LoadCommands {
    Client: AoiClient;
    AddToClient?: boolean;
    constructor(Client: AoiClient, AddToClient?: boolean);
    load(cmd: CommandManager, path: string, debug?: boolean): void;
    update(debug?: boolean): void;
    setColors(colors: object): void;
    get allColors(): object;
    get themes(): object;
}

// Custom Event
export declare class CustomEvent extends EventEmitter {
    client: AoiClient;
    commands: Group;
    constructor(client: AoiClient);
    command(d: CustomEventCommand): void;
    listen(event: string): void;
}

export type ApplicationOptionData = {
    type: "SUB_COMMAND"
        | "SUB_COMMAND_GROUP"
        | "STRING"
        | "INTEGER"
        | "BOOLEAN"
        | "USER"
        | "CHANNEL"
        | "ROLE"
        | "MENTIONABLE"
        | "NUMBER"
        | number;
};
export type ApplicationData = {
    data: {
        name: string;
        description?: string;
        options?: object[];
        type?: "CHAT_INPUT" | "USER" | "MESSAGE";
        defaultPermission?: boolean;
    };
    guildId?: string;
};

// Interaction Manager
export declare class Interaction extends EventEmitter {
    client: AoiClient;
    constructor(client: AoiClient);
    resolve<Interaction>(interaction: Interaction): Interaction;
}
export declare class InteractionManager extends Interaction {
    client: AoiClient;
    awaitComponents: unknown;
    componentCollector: unknown;
    buttonData: Group;
    applicationData: Group;
    selectMenuData: Group;
    constructor(client: AoiClient);
    createApplicationData(d: ApplicationData): void;
    createButtonData(d: object): void;
    createSelectMenuData(d: object): void;
    stringifyApplicationData(name: string): string;
    resolveButtonData(name: string): string;
    resolveSelectMenuData(name: string): string;
    resolveSelectMenuOptionData(options: object[]): string;
    get buttonDataLength(): number;
}
