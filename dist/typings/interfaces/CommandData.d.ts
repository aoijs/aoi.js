import { CommandTypes } from "../types/CommandTypes";
import { InteractionTypes } from "./InteractionType";
export interface RawCommandData {
    name?: string;
    code: string;
    [key: string]: unknown;
}
export interface RawCommandDataWithType extends RawCommandData {
    type: CommandTypes;
}
export interface RawCommandDataWithName extends RawCommandData {
    name: string;
    aliases?: string[];
}
export interface RawInteractionCommandData extends RawCommandData {
    interactionType: InteractionTypes;
}
//# sourceMappingURL=CommandData.d.ts.map