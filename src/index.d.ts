import {
    APIActionRowComponent,
    APIAttachment,
    APIEmbed,
    Attachment,
    AttachmentBuilder,
    AttachmentPayload,
    BaseChannel,
    BufferResolvable,
    Client,
    DMChannel,
    EmbedBuilder,
    GatewayIntentsString,
    Guild,
    GuildMember,
    JSONEncodable,
    Message,
    MessageMentions,
    NewsChannel,
    PartialDMChannel,
    ShardingManager,
    Snowflake,
    TextChannel,
    ThreadChannel,
    User
} from "discord.js";
import { Group, LimitGroup, SuperSet } from "@aoijs/aoi.structures";
import { Group as Collection } from "@aoijs/aoi.structures";
import { EventstoFile } from "./utils/Constants";
import { Constants } from "./utils/Constants";
import { parsers } from "./events/parsers";
import { KeyValue, Transmitter } from "@aoijs/aoi.db";
import { EventEmitter } from "events";
import { Time } from "./core/Time";
import { CheckCondition } from "./core/CheckCondition";

type ErrorMsg = string | Record<string, string | boolean | object | any[]>;

declare global {
    interface String {
        replaceLast(find: string, replace: string): string;
        deleteBrackets(): string;
        removeBrackets(): string;
        check(): string;
        after(): {
            inside: string;
            total: string;
            splits: string[];
            toString(): string;
            addBrackets(): string;
        };
        addBrackets(): string;
    }
}

interface SetCodeOptions {
    code: string;
    function?: string;
    inside?: ReturnType<String["after"]>;
    result?: string;
}

export declare class Util {
    static constants: typeof Constants;
    static parsers: typeof parsers;
    static getUser(d: any, id: string): Promise<User | undefined>;
    static fetchUser(d: any, id: string): Promise<User | undefined>;
    static fetchChannel(d: any, id: string): Promise<Channel | undefined>;
    static getChannel(d: any, id: string, force?: boolean): Channel | undefined;
    static fetchMember(guild: Guild, id: string): Promise<GuildMember | undefined>;
    static fetchMembers(guild: Guild, options: any): Promise<Collection<Snowflake, GuildMember>>;
    static getMember(guild: Guild, id: string): GuildMember | undefined;
    static getMembers(guild: Guild, options: { type: string; query: string; limit: number }, force?: boolean): Collection<Snowflake, GuildMember>;
    static fetchMessage(channel: Channel, id: string): Promise<Message | undefined>;
    static getMessage(channel: Channel, id: string): Message | undefined;
    static setCode(options: SetCodeOptions, escape?: boolean): string;
    static getGuild(d: any, id: string): Guild | undefined;
    static get channelTypes(): {
        Text: number;
        DM: number;
        GroupDM: number;
        Forum: number;
        Voice: number;
        Category: number;
        Announcement: number;
        AnnouncementThread: number;
        PublicThread: number;
        PrivateThread: number;
        Stage: number;
        GuildDirectory: number;
    };
    static get threadTypes(): {
        public: string;
        private: string;
    };
    static errorParser(errorM: ErrorMsg, d: any): Promise<any>;
    static getRole(guild: Guild, id: string): Promise<Role | undefined>;
    static fetchRole(guild: Guild, id: string): Promise<Role | undefined>;
    static aoiFunc(d: Data, FieldsRequired?: boolean): SetCodeOptions & { err?: string };
    static getEmoji(d: any, Emoji: string): Emoji | undefined;
    static getSticker(guild: Guild, Sticker: string): any;
    static findMember(guild: Guild, memberResolver: string): string | undefined;
    static findGuildChannel(guild: Guild, ChannelResolver: string): string | undefined;
    static findChannel(client: Client, ChannelResolver: string): string | undefined;
    static findRole(guild: Guild, RoleResolver: string): string | undefined;
    static findUser(client: Client, UserResolver: string): string | undefined;
    static findRoles(guild: Guild, options: { type: string; query: string; limit: number }): Collection<Snowflake, Role>;
}

export declare class CustomEvent extends EventEmitter {
    client: AoiClient;
    commands: Collection<string, EventCommand>;
    constructor(client: AoiClient);
    command(d: { name: string; listen: string; code: string }): void;
    listen(event: string): void;
}

export type FunctionResolveErrorType = "member" | "message" | "channel" | "user" | "role" | "guild" | "emoji" | "option" | "custom";
export interface ConsoleMessageData {
    text: string,
    textColor?: string,
    centered?: boolean
}

export declare class AoiError {
    static EventError(event: string, intent: string, line?: number): void;
    static AstGeneratorError(message: string, options: Record<string, unknown>): void;
    static CommandError(command: string, type: string, name: string, position?: number): void;
    static makeMessageError<Channel>(client: AoiClient, channel: Channel, options?: Record<string, unknown>, extraOptions?: Record<string, unknown>, d: Data): void;
    static consoleError(name: string, err: unknown): void;
    static functionErrorResolve<T extends Data = Data>(d: T, type: FunctionResolveErrorType, data: Record<string, unknown>, message?: string): void;
    static fnError<T extends Data = Data>(d: T, type: FunctionResolveErrorType, data: Record<string, unknown>, message?: string): void;
    static createConsoleMessage(messages: ConsoleMessageData | ConsoleMessageData[], borderColor?: string, title?: Omit<ConsoleMessageData, "centered">): void;
}

export type IntentOptions = (GatewayIntentsString | "GuildEmojis" | "GuildMessageTypings")[];
export type AoiEvents = keyof typeof EventstoFile;

export type DatabaseOptions = {
    type: "aoi.db";
    db: typeof import("@aoijs/aoi.db");
    dbType: "KeyValue" | "Transmitter";
    tables: string[];
    securityKey: string;
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
    intents: IntentOptions;
    database?: DatabaseOptions;
    respondOnEdit?: RespondOnEditOptions;
    disableFunctions?: Array<string>;
    respondToBots?: boolean;
    guildOnly?: boolean;
    cache: CacheOptions;
    aoiLogs?: boolean;
    aoiWarning?: boolean;
    aoiAutoUpdate?: boolean;
    disableAoiDB?: boolean;
    suppressAllErrors?: boolean;
    errorMessage?: string;
    events?: AoiEvents[];
    mobilePlatform?: boolean;
    fetchInvites?: {
        enabled: boolean;
        cacheInviters?: boolean;
    };
};

export interface BaseCommand {
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
    whitelist?: boolean;
    nonPrefixed?: boolean;
    dmOnly?: boolean;
}

export interface AwaitCommand extends BaseCommand {
    name: string;
}

export interface InteractionCommand extends BaseCommand {
    name: string | string[];
    prototype: "modal" | "button" | "selectMenu";
    premiumOnly?: boolean;
}

export interface LoopCommand extends BaseCommand {
    every: number;
    channel?: string;
    executeOnStartup?: boolean;
}

export type StatusOption = {
    name: string;
    url: string;
    time: number;
    shardID: number;
    type: "Playing" | "Listening" | "Watching" | "Streaming" | "Custom";
    status: string;
};

export declare class BaseClient extends Client {
    aoiOptions: Record<string, any>;
    interactionManager: InteractionManager;
    cacheManager: CacheManager;
    variableManager: any;
    prefix: string | string[];
    db: KeyValue | Transmitter;
    statuses: Group;
    constructor(options: ClientOptions);
    status(...statuses: StatusOption[]): void;
    loadCommands(directory: string, debug?: boolean): void;
    variables(data: Record<string, unknown>, table?: string): void;
}

export declare class AoiClient extends BaseClient {
    cmd: CommandManager;
    functionManager: FunctionManager;
    constructor(options: ClientOptions);
    command(...args: Command[]): void;
    addCommandType(type: string, d?: Command): void;
    awaitedCommand(d?: AwaitCommand): void;
    deletedCommand(d?: EventCommand): void;
    updateCommand(d?: EventCommand): void;
    bulkDeleteCommand(d?: EventCommand): void;
    guildJoinCommand(d?: EventCommand): void;
    guildLeaveCommand(d?: EventCommand): void;
    guildUpdateCommand(d?: EventCommand): void;
    guildUnavailableCommand(d?: EventCommand): void;
    roleCreateCommand(d?: EventCommand): void;
    roleUpdateCommand(d?: EventCommand): void;
    roleDeleteCommand(d?: EventCommand): void;
    channelCreateCommand(d?: EventCommand): void;
    channelUpdateCommand(d?: EventCommand): void;
    channelDeleteCommand(d?: EventCommand): void;
    channelPinsUpdateCommand(d?: EventCommand): void;
    stageInstanceCreateCommand(d?: EventCommand): void;
    stageInstanceUpdateCommand(d?: EventCommand): void;
    stageInstanceDeleteCommand(d?: EventCommand): void;
    threadCreateCommand(d?: EventCommand): void;
    threadUpdateCommand(d?: EventCommand): void;
    threadDeleteCommand(d?: EventCommand): void;
    threadListSyncCommand(d?: EventCommand): void;
    threadMemberUpdateCommand(d?: EventCommand): void;
    joinCommand(d?: EventCommand): void;
    leaveCommand(d?: EventCommand): void;
    memberUpdateCommand(d?: EventCommand): void;
    threadMembersUpdateCommand(d?: EventCommand): void;
    memberAvailableCommand(d?: EventCommand): void;
    membersChunkCommand(d?: EventCommand): void;
    emojiCreateCommand(d?: EventCommand): void;
    emojiDeleteCommand(d?: EventCommand): void;
    emojiUpdateCommand(d?: EventCommand): void;
    banAddCommand(d?: EventCommand): void;
    banRemoveCommand(d?: EventCommand): void;
    reactionAddCommand(d?: EventCommand): void;
    reactionRemoveCommand(d?: EventCommand): void;
    reactionRemoveAllCommand(d?: EventCommand): void;
    reactionRemoveEmojiCommand(d?: EventCommand): void;
    presenceUpdateCommand(d?: EventCommand): void;
    voiceStateUpdateCommand(d?: EventCommand): void;
    voteAddCommand(d?: EventCommand): void;
    voteRemoveCommand(d?: EventCommand): void;
    interactionCommand(d?: InteractionCommand): void;
    applicationCmdCreateCommand(d?: EventCommand): void;
    applicationCmdDeleteCommand(d?: EventCommand): void;
    applicationCmdUpdateCommand(d?: EventCommand): void;
    userUpdateCommand(d?: EventCommand): void;
    variableCreateCommand(d?: EventCommand): void;
    variableDeleteCommand(d?: EventCommand): void;
    variableUpdateCommand(d?: EventCommand): void;
    entitlementCreateCommand(d: EventCommand): void;
    entitlementUpdateCommand(d: EventCommand): void;
    entitlementDeleteCommand(d: EventCommand): void;
    readyCommand(d?: EventCommand): void;
    functionErrorCommand(d?: EventCommand): void;
    loopCommand(d?: LoopCommand): void;
    timeoutCommand(d?: EventCommand): void;
    rateLimitCommand(d?: EventCommand): void;
    webhooksUpdateCommand(d?: EventCommand): void;
}

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

// ClientShard
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
    isClientCommand: boolean;
    types: string[];
    customCmds?: string[];
    constructor(client: AoiClient, formCommand?: boolean, customCmds?: string[]);
    formCommand(): void;
    createCommand(data: Record<string, any>): void;
    formCustomCommand(customCmds: string[]): void;
}

// Interpreter
export type InterpreterReturn = {
    code?: string;
    data?: Record<string, unknown>;
    id?: Snowflake;
    message?: Message;
};
export type Interpreter = (
    client: AoiClient,
    message:
        | Message
        | {
            message?: Message;
            channel?: PartialDMChannel | DMChannel | NewsChannel | TextChannel | ThreadChannel;
            guild?: Guild | null;
            author?: User;
            member?: GuildMember;
            mentions?: MessageMentions;
        },
    args: string[],
    command: BaseCommand | Command | EventCommand | AwaitCommand | InteractionCommand | LoopCommand,
    _db: KeyValue | Transmitter,
    returnCode?: boolean,
    channelUsed?: string,
    data?: Record<string, unknown>,
    useChannel?: TextChannel,
    returnMessage?: boolean,
    returnExecution?: boolean,
    returnID?: boolean,
    sendMessage?: boolean
) => Promise<InterpreterReturn>;

/**
 * Available custom function types that FunctionManager supports.
 */
export type CustomFunctionTypes = "aoi.js" | "djs";

/**
 * Base custom function interface.
 */
export interface BaseCustomFunction<T extends CustomFunctionTypes> {
    name: `$${string}`;
    type: T;
}

/**
 * Represents the structure for an aoi.js custom function type.
 */
export interface CustomAoiJSFunction<Type = "aoi.js"> extends BaseCustomFunction<Type> {
    params?: string[];
    code: string;
}

/**
 * Represents the structure for a discord.js custom function type.
 */
export interface CustomDiscordJSFunction<Type = "djs"> extends BaseCustomFunction<Type> {
    code(d: Data): Promise<Record<string, any>> | Record<string, any>
}

// FunctionManager
export declare class FunctionManager {
    client: AoiClient;
    maps: Record<string, string[]>;
    functions: string[];
    cache: Group;
    interpreter: Interpreter;
    constructor(client: AoiClient);
    cacheFunctions(): void;
    createFunction(...data: (CustomAoiJSFunction | CustomDiscordJSFunction)[]): void;
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

export declare class CustomEvent extends EventEmitter {
    client: AoiClient;
    commands: Group;
    constructor(client: AoiClient);
    command(d: CustomEventCommand): void;
    listen(event: string): void;
}

export type ApplicationOptionData = {
    type: "SUB_COMMAND" | "SUB_COMMAND_GROUP" | "STRING" | "INTEGER" | "BOOLEAN" | "USER" | "CHANNEL" | "ROLE" | "MENTIONABLE" | "NUMBER" | number;
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

// Command data (d)
export interface Data<T extends Record<string, unknown> = Record<string, unknown>> {
    randoms: Record<string, unknown>;
    command: BaseCommand | EventCommand | AwaitCommand | LoopCommand | InteractionCommand | Command;
    helpers: {
        time: typeof Time;
        checkCondition: typeof CheckCondition;
        mustEscape(msg: string): string;
    };
    args: string[];
    aoiError: typeof AoiError;
    data: Record<string, unknown> & T;
    func: string;
    funcLine: number;
    util: typeof Util;
    allowedMentions: string[];
    embeds: APIEmbed[];
    components: APIActionRowComponent[];
    files: (
        BufferResolvable
        | Stream
        | JSONEncodable<APIAttachment>
        | Attachment
        | AttachmentBuilder
        | AttachmentPayload
    )[];
    timezone: string;
    channelUsed: string | undefined;
    vars: Record<string, string>;
    object: Record<string, Record<string, unknown>>;
    disableMentions: string;
    array: string[];
    arrays: string[][];
    reactions: string[];
    message: Message | undefined;
    msg: Message | undefined;
    author: User;
    guild: Guild | undefined;
    channel: BaseChannel | undefined;
    member: GuildMember | undefined;
    mentions: MessageMentions;
    unpack(): ReturnType<String["after"]>;
    inside(unpacked: ReturnType<String["after"]>): string | false | undefined;
    noop(): void;
    error(err: string, d: Data): Promise<void>;
    interpreter: Interpreter;
    client: AoiClient;
    embed: EmbedBuilder;
}