import { TranspiledFuncData } from "./interfaces.js";

export type CommandTypes = "basic" | "slash";
export type AsyncFunction = ( arg: TranspiledFuncData ) => Promise<unknown>;

export type autoFetchDataTypes =
    | "guild"
    | "channel"
    | "emoji"
    | "member"
    | "role"
    | "user"
    | "all";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
