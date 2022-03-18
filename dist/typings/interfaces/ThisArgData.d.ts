import { AoiClient } from "../../core/AoiClient";
import { Command } from "../../structures/Command";
import { Container } from "../../structures/Container";
import { Context } from "../../structures/Context";
import { InterpreterData } from "./InterpreterData";
export interface ThisArgData<T = unknown> {
    context: Context<T>;
    bot: AoiClient;
    command: Command;
    args: string[];
    container: Container;
    ref: InterpreterData;
}
//# sourceMappingURL=ThisArgData.d.ts.map