import { RawCommandData, RawCommandDataWithName, RawInteractionCommandData } from "../interfaces/CommandData";
import { CommandTypes } from "./CommandTypes";
export declare type CommandDataUnion<T extends CommandTypes = CommandTypes> = T extends "basicCommand" ? RawCommandDataWithName : T extends 'interactionCommand' ? RawInteractionCommandData : T extends 'readyCommand' ? RawCommandData : RawCommandData;
//# sourceMappingURL=CommandDataUnion.d.ts.map