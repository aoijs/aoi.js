import { ActivityType, PresenceData } from "discord.js";
import { Compiler } from "../../structures/Compiler";
export interface RawStatusData {
    /**
     * The text to put in the status.
     */
    name: string;
    /**
     * The presence status.
     */
    presence?: PresenceData["status"];
    /**
     * The activity type.
     */
    type?: keyof typeof ActivityType;
    /**
     * The duration for this status.
     */
    duration: number;
    /**
     * If activity type is streaming, this should be filled in with a valid url.
     */
    url?: string;
    /**
     * Whether the client is afk.
     */
    afk?: boolean;
}
export interface StatusData extends RawStatusData {
    compiler: Compiler;
}
//# sourceMappingURL=StatusData.d.ts.map