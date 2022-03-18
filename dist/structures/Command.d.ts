import { AoiCommandManager } from "../core/AoiCommandManager";
import { CommandDataUnion } from "../typings/types/CommandDataUnion";
import { CommandTypes } from "../typings/types/CommandTypes";
import { Compiler } from "./Compiler";
export declare class Command<T extends CommandTypes = CommandTypes> {
    #private;
    id: number;
    data: CommandDataUnion<T>;
    compiler: Compiler;
    path: import("..").Option<string>;
    constructor(id: number, manager: AoiCommandManager, data: CommandDataUnion<T>, compiler?: Compiler);
    as<T extends CommandTypes>(): Command<T>;
    setPath(str: string): this;
}
//# sourceMappingURL=Command.d.ts.map