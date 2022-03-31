import { Collection } from "discord.js";
import { Command } from "../structures/Command";
import { CommandDataUnion } from "../typings/types/CommandDataUnion";
import { CommandTypes, CommandTypesString } from "../typings/types/CommandTypes";
import { AoiClient } from "./AoiClient";
/**
 * Stores commands for the Client.
 */
export declare class AoiCommandManager extends Collection<CommandTypesString, Collection<number, Command>> {
    #private;
    directory: import("..").Option<string>;
    constructor(client: AoiClient);
    add<T extends CommandTypes>(type: T, data: CommandDataUnion<T>): this;
    get client(): AoiClient<unknown>;
    addMany<T extends CommandTypes>(type: T, ...data: CommandDataUnion<T>[]): this;
    addMany<T extends CommandTypes>(type: T, ...data: CommandDataUnion<T>[][]): this;
    private addUnknown;
    addRaw<T extends CommandTypes>(data: CommandDataUnion<T>): this;
    addRaw<T extends CommandTypes>(...data: CommandDataUnion<T>[]): this;
    addRaw<T extends CommandTypes>(...data: CommandDataUnion<T>[][]): this;
    get<T extends CommandTypes>(type: T): Collection<number, Command<T>> | undefined;
    getOrSet<T extends CommandTypes>(type: T): Collection<number, Command<T>>;
    private create;
    private fromStatus;
    refresh(): boolean;
    load(directory: string): void;
}
//# sourceMappingURL=AoiCommandManager.d.ts.map