import { Client, Cacher } from "zeneth";
import { CommandManager } from "../manager/Command.js";
import { FunctionManager } from "../manager/Function.js";
import { Util } from "../structures/Util.js";
import {
    AoiClientOptions,
    CommandOptions,
    Plugin,
    TranspiledFuncData,
} from "./interfaces.js";
import { AoiClientEvents } from "./enums.js";

export type CommandTypes =
    | "basic"
    | "interaction"
    | "ready"
    | "debug"
    | "component";
export type AsyncFunction = (arg: TranspiledFuncData) => Promise<unknown>;

export type autoFetchDataTypes =
    | "guild"
    | "channel"
    | "emoji"
    | "member"
    | "role"
    | "user"
    | "all";

// make provided key as optional
export type OptionalFor<T, K extends keyof T> = {
    [P in keyof T as P extends K ? P : never]?: T[P];
};

export type OptionalExecept<T, K extends keyof T> = {
    [P in keyof T as P extends K ? never : P]: T[P];
};

export type Optional<T, K extends keyof T> = OptionalFor<T, K> &
    OptionalExecept<T, K>;
// change basiCommand to command
export type AoiClientProps = {
    command: (...cmd: Optional<CommandOptions, "type">[]) => void;
} & {
    [key in `${Exclude<CommandTypes, "basic">}Command`]: (
        ...cmd: Optional<CommandOptions, "type">[]
    ) => void;
} & {
    client: Client;
    managers: {
        commands: CommandManager;
        functions: FunctionManager;
    };
    options: AoiClientOptions;
    cache?: Cacher;
    util: Util;
    __on__: Partial<Record<AoiClientEvents, ((...args: unknown[]) => void)[]>>;
};

export type PluginType =
    | "pre"
    | "post"
    | "load"
    | "preEvent"
    | "postEvent"
    | "preCommand"
    | "postCommand";

export type PluginManagerProps = {
    [key in PluginType]: Plugin[];
};
