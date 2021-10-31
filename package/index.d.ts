declare module "aoi.js" {
    import { Client, Collection, ShardingManager } from "discord.js";
    import { EventEmitter } from "events";

    type IntentOptions = string | "all"

    type DatabaseOption = {
        type: "default" | "dbdjs.db" | "dbdts.db" | "dbdjs.mongo" | "dbdjs.db-sql" | "custom";
        db: Record<string, any>;
        path?: string;
        tables?: Array<string>;
        extraOptions?: Record<string, any>;
        promisify?: boolean;
    }

    type RespondOnEditOptions = {
        commands?: boolean;
        alwaysExecute?: boolean;
        nonPrefixed?: boolean;
        time?: number;
    }

    type CacheOptions = Record<string, number | undefined | null | number>

    type EventOptions = {
        functionError?: boolean;
        timeout?: boolean;
    }

    type ClientOptions = {
        token: string;
        prefix: string | Array<string>;
        intents: IntentOptions;
        database?: DatabaseOption;
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
        dbhToken?: string;
    }

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
        [key: string]: any;
    }
    interface AwaitCommand extends BaseCommand {
        name: string;
    }
    interface InteractionCommand extends BaseCommand {
        name: string | Array<string>;
        prototype: "application" | "button" | "selectMenu"
    }

    type StatusOption = {
        text: string;
        url?: string;
        time: number;
        shardId?: number;
        type: "PLAYING" | "LISTENING" | " WATCHING" | "STREAMING" | "playing" | "listening" | "streaming" | "watching";
    }

    class Bot extends Client {
        constructor(options: ClientOptions);
        public status(d: StatusOption[]);
        public variables(data: object, table?: string);
        public command(d: Command[]);
        public awaitedCommand(d: AwaitCommand);
        public updateCommand(d: EventCommand);
        public deletedCommand(d: EventCommand);
        public bulkDeleteCommand(d: EventCommand);
        //guild Cmds 
        public guildJoinCommand(d: EventCommand);
        public guildLeaveCommand(d: EventCommand);
        public guildUpdateCommand(d: EventCommand);
    }
    //CommandManager 
    class CommandManager {
        client: Bot;
        formCommand?: boolean;
        customCmds?: Array<string>;
        constructor(client: Bot, formCommand?: boolean, customCmds?: string[]);
        public get types();

    }
    //FunctionManager 
    class FunctionManager {
        client: Bot;
        constructor(client: Bot);
        private cacheFunctions();
        public createCustomFunction(data: Array<Record<string, any>>);
        private findFunctions(code: string);
    }
    //LoadCommands 
    class LoadCommands {
        Client: Bot;
        AddToClient?: boolean;
        constructor(Client: Bot, AddToClient?: boolean);

        public load(cmd: CommandManager, path: string, debug?: boolean);
        public update(debug?: boolean);
        public setColors(colors: object);
    }
}