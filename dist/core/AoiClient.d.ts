import { Client } from "discord.js";
import Parser from "ms-utility";
import { AoiOptions } from "../typings/interfaces/AoiOptions";
import { AoiCommandManager } from "./AoiCommandManager";
import { AoiEventManager } from "./AoiEventManager";
import { AoiStatusManager } from "./AoiStatusManager";
export declare class AoiClient<T = unknown> {
    #private;
    /**
     * The client managed by this Client.
     */
    client: Client<true>;
    db: T;
    status: AoiStatusManager;
    /**
     * The commands for this Client.
     */
    commands: AoiCommandManager;
    parser: Parser;
    /**
     * The events added to this client.
     */
    events: AoiEventManager;
    /**
     * Options passed to the Client.
     */
    options: AoiOptions<T>;
    /**
     *
     * @param options The options to pass to Client.
     */
    constructor(options: AoiOptions<T>);
    isDatabase<T extends new (...args: any[]) => any>(instance: T): this is AoiClient<T>;
    get prefixes(): string[];
    get addRawEvent(): {
        (event: keyof import("discord.js").ClientEvents): AoiEventManager;
        (...events: (keyof import("discord.js").ClientEvents)[]): AoiEventManager;
        (...events: (keyof import("discord.js").ClientEvents)[][]): AoiEventManager;
    };
    get addEvent(): {
        (event: "onMessage" | "onInteraction"): AoiEventManager;
        (...events: ("onMessage" | "onInteraction")[]): AoiEventManager;
        (...events: ("onMessage" | "onInteraction")[][]): AoiEventManager;
    };
    get addCommand(): {
        <T_1 extends import("..").CommandTypes>(data: import("..").CommandDataUnion<T_1>): AoiCommandManager;
        <T_2 extends import("..").CommandTypes>(...data: import("..").CommandDataUnion<T_2>[]): AoiCommandManager;
        <T_3 extends import("..").CommandTypes>(...data: import("..").CommandDataUnion<T_3>[][]): AoiCommandManager;
    };
    get addStatus(): {
        (status: import("..").RawStatusData): AoiStatusManager;
        (status: import("..").RawStatusData[]): AoiStatusManager;
        (...status: import("..").RawStatusData[][]): AoiStatusManager;
    };
    get login(): (token?: string | undefined) => void;
    start(token?: string | undefined): void;
}
//# sourceMappingURL=AoiClient.d.ts.map