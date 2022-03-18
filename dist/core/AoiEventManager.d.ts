import { ClientEvents } from "discord.js";
import { AoiEvents } from "../typings/enums/AoiEvents";
import { AoiClient } from "./AoiClient";
export declare class AoiEventManager {
    #private;
    constructor(bot: AoiClient);
    has(event: keyof ClientEvents): boolean;
    private listen;
    /**
     * Adds a discord.js event.
     * @param event The discord.js event to add.
     */
    addRaw(event: keyof ClientEvents): this;
    /**
     * Adds multiple discord.js events.
     * @param events The events to add.
     */
    addRaw(...events: Array<keyof ClientEvents>): this;
    /**
     * Adds multiple discord.js events.
     * @param events The events to add.
     */
    addRaw(...events: Array<keyof ClientEvents>[]): this;
    /**
     * Adds an aoi.js event.
     * @param event The event to add.
     */
    add(event: keyof typeof AoiEvents): this;
    /**
     * Adds an array of aoi.js events.
     * @param event The events to add.
     */
    add(...events: Array<keyof typeof AoiEvents>): this;
    /**
     * Adds an array of aoi.js events.
     * @param event The events to add.
     */
    add(...events: Array<keyof typeof AoiEvents>[]): this;
    /**
     * Loads aoi.js events from given directory.
     */
    load(directory: string): this;
}
//# sourceMappingURL=AoiEventManager.d.ts.map