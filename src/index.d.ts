import Group from "./cachehandler/group";

import LimitGroup from "./cachehandler/limitGroup";

import SuperSet from "./cachehandler/superSet";
import {Client, ShardingManager} from "discord.js";

declare module "aoi.js" {
    import {EventEmitter} from "events";

    type ErrorMsg = string | Record<string, string | boolean | object | any[]>;

    //AoiError
    class AoiError {
        constructor();

        static CallbackError(callback: string, intent: string, line?: number): void;

        static CommandError(
            command: string,
            type: string,
            name: string,
            position?: number,
        ): void;

        static makeMessageError<Channel>(
            client: Bot,
            channel: Channel,
            message: ErrorMsg,
            options?: Record<string, unknown>,
        ): void;

        static consoleError(errorname: string, errorMsg: ErrorMsg): void;

        static functionErrorResolve<d>(
            d: d,
            type: string,
            object: object,
            message: ErrorMsg,
        ): void;

        static fnError<d>(
            d: d,
            type: string,
            object: object,
            message: ErrorMsg,
        ): void;
    }

    //Blacklist
    type BlacklistTypes = "globalUser" | "server" | "channel" | "role" | "user";

    class Blacklist {
        constructor(client: Bot);

        public setBlacklist(type: BlacklistTypes, errorMsg: ErrorMsg): void;

        public blacklistIds(type: BlacklistTypes, ids: string[]): void;

        public whitelistIds(type: BlacklistTypes, ids: string[]): void;

        public get types(): BlacklistTypes;

        public getBlacklistTable(
            type: "all" | "globalUser" | "server" | "channel" | "role" | "user",
        ): string;
    }

    type IntentOptions = "all" | string[];

    type DatabaseOption<Database> = {
        type:
            | "default"
            | "dbdjs.db"
            | "dbdts.db"
            | "dbdjs.mongo"
            | "dbdjs.db-sql"
            | "custom";
        db: Database;
        path?: string;
        tables?: Array<string>;
        extraOptions?: Record<string, any>;
        promisify?: boolean;
    };

    type RespondOnEditOptions = {
        commands?: boolean;
        alwaysExecute?: boolean;
        nonPrefixed?: boolean;
        time?: number;
    };

    type CacheOptions = Record<string, number | undefined | null>;

    type EventOptions = {
        functionError?: boolean;
        timeout?: boolean;
    };

    type ClientOptions = {
        token: string;
        prefix: string | Array<string>;
        intents: IntentOptions;
        database?: DatabaseOption<any>;
        respondOnEdit?: RespondOnEditOptions;
        cache: CacheOptions;
        mobilePlatform?: boolean;
        fetchInvites?: {
            enabled: boolean;
            cacheInviters?: boolean;
        };
        suppressAllErrors?: boolean;
        errorMessage?: Array<string>;
        events?: EventOptions;
        disableFunctions?: Array<string>;
        autoUpdate?: boolean;
    };

    interface BaseCommand {
        code: string;
    }

    interface EventCommand extends BaseCommand {
        name?: string;
        channel?: string;

        [key: string]: any;
    }

    interface Command extends BaseCommand {
        name: string;
        aliases?: string | Array<string>;
        async?: boolean;
        whitelist?: boolean;
        nonPrefixed?: boolean;
        error?: string;
    }

    interface AwaitCommand extends BaseCommand {
        name: string;
    }

    interface InteractionCommand extends BaseCommand {
        name: string | Array<string>;
        prototype: "application" | "button" | "selectMenu";
    }

    interface CustomEventCommand extends BaseCommand {
        name: string;
        listen: string;
    }

    interface LoopCommand extends BaseCommand {
        every: number;
        channel?: string;
        executeOnStartup?: boolean;
    }

    type StatusOption = {
        text: string;
        url?: string;
        time: number;
        shardId?: number;
        type:
            | "PLAYING"
            | "LISTENING"
            | "WATCHING"
            | "STREAMING"
            | "playing"
            | "listening"
            | "streaming"
            | "watching";
    };

    class BaseClient extends Client {
        aoiOptions: Record<string, any>;
        interactionManager: InteractionManager;
        cacheManager: CacheManager;
        variableManager: any /*VariableManager*/;
        blacklist: Blacklist;
        _api: string;
        prefix: string | string[];
        db: any /*AoijsAPI | DbdTsDb | CustomDb | Promisify*/;
        statuses: Group;

        constructor(options: ClientOptions);

        public status(d: StatusOption[]): void;

        public variables(data: object, table?: string): void;
    }

    class Bot extends BaseClient {
        cmd: CommandManager;
        functionManager: FunctionManager;

        constructor(options: ClientOptions);

        public command(d: Command): void;

        public awaitedCommand(d: AwaitCommand): void;

        public deletedCommand(d: EventCommand): void;

        public updateCommand(d: EventCommand): void;

        public bulkDeleteCommand(d: EventCommand): void;

        public guildJoinCommand(d: EventCommand): void;

        public guildLeaveCommand(d: EventCommand): void;

        public guildUpdateCommand(d: EventCommand): void;

        public guildUnavailableCommand(d: EventCommand): void;

        public roleCreateCommand(d: EventCommand): void;

        public roleUpdateCommand(d: EventCommand): void;

        public roleDeleteCommand(d: EventCommand): void;

        public channelCreateCommand(d: EventCommand): void;

        public channelUpdateCommand(d: EventCommand): void;

        public channelDeleteCommand(d: EventCommand): void;

        public channelPinsUpdateCommand(d: EventCommand): void;

        public stageInstanceCreateCommand(d: EventCommand): void;

        public stageInstanceUpdateCommand(d: EventCommand): void;

        public stageInstanceDeleteCommand(d: EventCommand): void;

        public threadCreateCommand(d: EventCommand): void;

        public threadUpdateCommand(d: EventCommand): void;

        public threadDeleteCommand(d: EventCommand): void;

        public threadListSyncCommand(d: EventCommand): void;

        public threadMemberUpdateCommand(d: EventCommand): void;

        public joinCommand(d: EventCommand): void;

        public leaveCommand(d: EventCommand): void;

        public memberUpdateCommand(d: EventCommand): void;

        public threadMembersUpdateCommand(d: EventCommand): void;

        public memberAvailableCommand(d: EventCommand): void;

        public membersChunkCommand(d: EventCommand): void;

        public emojiCreateCommand(d: EventCommand): void;

        public emojiDeleteCommand(d: EventCommand): void;

        public emojiUpdateCommand(d: EventCommand): void;

        public banAddCommand(d: EventCommand): void;

        public banRemoveCommand(d: EventCommand): void;

        public inviteCreateCommand(d: EventCommand): void;

        public inviteDeleteCommand(d: EventCommand): void;

        public reactionAddCommand(d: EventCommand): void;

        public reactionRemoveCommand(d: EventCommand): void;

        public reactionRemoveAllCommand(d: EventCommand): void;

        public reactionRemoveEmojiCommand(d: EventCommand): void;

        public presenceUpdateCommand(d: EventCommand): void;

        public voiceStateUpdateCommand(d: EventCommand): void;

        public interactionCommand(d: InteractionCommand): void;

        public applicationCmdCreateCommand(d: EventCommand): void;

        public applicationCmdDeleteCommand(d: EventCommand): void;

        public applicationCmdUpdateCommand(d: EventCommand): void;

        public userUpdateCommand(d: EventCommand): void;

        public variableCreateCommand(d: EventCommand): void;

        public variableDeleteCommand(d: EventCommand): void;

        public variableUpdateCommand(d: EventCommand): void;

        public readyCommand(d: EventCommand): void;

        public functionErrorCommand(d: EventCommand): void;

        public loopCommand(d: LoopCommand): void;

        public timeoutCommand(d: EventCommand): void;

        public pulseCommand(d: EventCommand): void;

        public rateLimitCommand(d: EventCommand): void;

        public webhookUpdateCommand(d: EventCommand): void;

        public onMessage(d?: { guildOnly?: boolean; respondToBot?: boolean }): void;

        public onMessageDelete(): void;

        public onMessageUpdate(): void;

        public onMessageDeleteBulk(): void;

        public onGuildJoin(): void;

        public onGuildLeave(): void;

        public onGuildUpdate(): void;

        public onGuildUnavailable(): void;

        public onRoleCreate(): void;

        public onRoleUpdate(): void;

        public onRoleDelete(): void;

        public onChannelCreate(): void;

        public onChannelUpdate(): void;

        public onChannelDelete(): void;

        public onChannelPinsUpdate(): void;

        public onStageInstanceCreate(): void;

        public onStageInstanceUpdate(): void;

        public onStageInstanceDelete(): void;

        public onThreadCreate(): void;

        public onThreadUpdate(): void;

        public onThreadDelete(): void;

        public onThreadListSync(): void;

        public onThreadMemberUpdate(): void;

        public onThreadMembersUpdate(): void;

        public onJoin(): void;

        public onLeave(): void;

        public onMemberUpdate(): void;

        public onMemberAvailable(): void;

        public onMembersChunk(): void;

        public onEmojiCreate(): void;

        public onEmojiDelete(): void;

        public onEmojiUpdate(): void;

        public onStickerCreate(): void;

        public onStickerDelete(): void;

        public onStickerUpdate(): void;

        public onBanAdd(): void;

        public onBanRemove(): void;

        public onInviteCreate(): void;

        public onInviteDelete(): void;

        public onReactionAdd(): void;

        public onReactionRemove(): void;

        public onReactionRemoveAll(): void;

        public onReactionRemoveEmoji(): void;

        public onVoiceStateUpdate(): void;

        public onPresenceUpdate(): void;

        public onTypingStart(): void;

        public onInteractionCreate(): void;

        public onApplicationCmdCreate(): void;

        public onApplicationCmdDelete(): void;

        public onApplicationCmdUpdate(): void;

        public onUserUpdate(): void;

        public onVariableCreate(): void;

        public onVariableDelete(): void;

        public onVariableUpdate(): void;

        public onRateLimit(): void;

        public onWebhookUpdate(): void;
    }

    //cacheManager
    type CacheTypes = "cache" | "limitCache" | "setCache";

    class CacheManager {
        constructor(client: Bot);

        public get types(): CacheTypes;

        public _validType(type: string): boolean;

        public createCache(type: "cache", name: string): Group;
        public createCache(type: "limitCache", name: string): LimitGroup;
        public createCache(type: "setCache", name: string): SuperSet;

        public deleteCache(type: "cache", name: string): Group;
        public deleteCache(type: "limitCache", name: string): LimitGroup;
        public deleteCache(type: "setCache", name: string): SuperSet;

        public static _DjsCacheManager(cache: CacheOptions): any;
    }

    //ClientShard
    class ClientShard extends ShardingManager {
        file: string;
        client: Bot;

        constructor(file: string, options: object, client: Bot);

        public onShardDisconnect(): void;

        public onShardError(): void;

        public onShardResume(): void;

        public onShardReconnecting(): void;

        public onShardReady(): void;
    }

    //CommandManager
    class Command {
        [key: string]: any;

        __client__: Bot;

        constructor(d: object, client: Bot);

        public serializeFunctions(): string[];

        public serializeCode(): void | string[];

        public toString(): string;

        public toArray(): [string, any][];

        public keys(): string[];

        public values(): unknown[];
    }

    class CommandManager {
        client: Bot;
        customCmds?: Array<string>;

        constructor(client: Bot, formCommand?: boolean, customCmds?: string[]);

        public get types(): string[];

        public createCommand(d: any): void;

        public formCommand(): void;

        public formCustomCommand(customCmds: string[]): void;
    }

    //FunctionManager
    class FunctionManager {
        client: Bot;
        maps: Record<string, string[]>;
        functions: string[];
        cache: Group;
        interpreter: unknown;

        constructor(client: Bot);

        public cacheFunctions(): void;

        public createCustomFunction(data: Array<Record<string, any>>): void;

        public findFunctions(code: string): string[];

        public serializeCode(code: string): string[];
    }

    //LoadCommands
    class LoadCommands {
        Client: Bot;
        AddToClient?: boolean;

        constructor(Client: Bot, AddToClient?: boolean);

        public load(cmd: CommandManager, path: string, debug?: boolean): void;

        public update(debug?: boolean): void;

        public setColors(colors: object): void;

        public get allColors(): object;

        public get themes(): object;
    }

    class CustomEvent extends EventEmitter {
        client: Bot;
        commands: Group;

        constructor(client: Bot);

        command(d: CustomEventCommand): void;

        listen(event: string): void;
    }

    type ApplcationOptionData = {
        type:
            | "SUB_COMMAND"
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
    type ApplicationData = {
        data: {
            name: string;
            description: void | string;
            options?: object[];
            type?: "CHAT_INPUT" | "USER" | "MESSAGE";
            defaultPermission?: boolean;
        };
        guildId?: string;
    };

    class Interaction extends EventEmitter {
        client: Bot;

        constructor(client: Bot);

        public resolve<Interaction>(interaction: Interaction): Interaction;
    }

    class InteractionManager extends Interaction {
        client: Bot;
        awaitComponents: unknown /*Await*/;
        componentCollector: unknown /*CustomCollector*/;
        buttonData: Group;
        applicationData: Group;
        selectMenuData: Group;

        constructor(client: Bot);

        public createApplicationData(d: ApplicationData): void;

        public createButtonData(d: object): void;

        public createSelectMenuData(d: object): void;

        public stringifyApplicationData(name: string): string;

        public resolveButtonData(name: string): string;

        public resolveSelectMenuData(name: string): string;

        public resolveSelectMenuOptionData(options: object[]): string;

        public get buttonDataLength(): number;
    }
}
