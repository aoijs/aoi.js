import { AoiClient } from "../../core/AoiClient";
import { Command } from "../../structures/Command";
import { InterpreterReturnType } from "../../util/constants/enums/InterpreterReturnType";
import { Option } from "../types/Option";
import { Sendable } from "../types/Sendable";
export interface InterpreterData<T extends InterpreterReturnType = InterpreterReturnType> {
    context: unknown;
    args?: string[];
    bot: AoiClient;
    channel?: Option<Sendable>;
    return: T;
    command: Command;
}
//# sourceMappingURL=InterpreterData.d.ts.map