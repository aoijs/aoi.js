import { Client, ShardingManager } from "discord.js";
import { Group, LimitGroup, SuperSet } from "@akarui/structures";
import { AllEvents } from "./utils/Constants";

declare module "aoi.js" {
    import { EventEmitter } from "events";

    type ErrorMsg = string | Record<string, string | boolean | object | any[]>;

    // AoiError
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

    type IntentOptions = string[];

    type DatabaseOption<Database> = {
        type:
            | "default"
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

    type RespondOnEditOptions = {
        commands?: boolean;
        alwaysExecute?: boolean;
        nonPrefixed?: boolean;
        time?: number;
    };

    type CacheOptions = Record<string, number | undefined | null>;

    type ClientOptions = {
        token: string;
        prefix: string | Array<string>;
        intents: IntentOptions;
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
        events?: Array<AllEvents>;
        fetchInvites?: {
            enabled: boolean;
            cacheInviters?: boolean;
        };
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
        url: string;
        time: number;
        shardId: number;
        type: "PLAYING" | "LISTENING" | "WATCHING" | "STREAMING";
        status: string;
    };

    class BaseClient extends Client {
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
    }

    class AoiClient extends BaseClient {
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
    }

    // cacheManager
    type CacheTypes = "cache" | "limitCache" | "setCache";

    class CacheManager {
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
    class ClientShard extends ShardingManager {
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
    class Command {
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

    class CommandManager {
        client: AoiClient;
        customCmds?: Array<string>;

        constructor(client: AoiClient, formCommand?: boolean, customCmds?: string[]);

        get types(): string[];

        createCommand(d: any): void;
        formCommand(): void;
        formCustomCommand(customCmds: string[]): void;
    }

    // FunctionManager
    class FunctionManager {
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
    class LoadCommands {
        Client: AoiClient;
        AddToClient?: boolean;

        constructor(Client: AoiClient, AddToClient?: boolean);

        load(cmd: CommandManager, path: string, debug?: boolean): void;
        update(debug?: boolean): void;
        setColors(colors: object): void;
        get allColors(): object;
        get themes(): object;
    }

    class CustomEvent extends EventEmitter {
        client: AoiClient;
        commands: Group;

        constructor(client: AoiClient);

        command(d: CustomEventCommand): void;
        listen(event: string): void;
    }

    type ApplicationOptionData = {
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
            description?: string;
            options?: object[];
            type?: "CHAT_INPUT" | "USER" | "MESSAGE";
            defaultPermission?: boolean;
        };
        guildId?: string;
    };

    class Interaction extends EventEmitter {
        client: AoiClient;

        constructor(client: AoiClient);

        resolve<Interaction>(interaction: Interaction): Interaction;
    }

    class InteractionManager extends Interaction {
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
}
