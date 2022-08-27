import { EmbedBuilder } from "@discordjs/builders";
import { ReplyType } from "../typings";
import { ReturnType as RT } from "../typings/enums/ReturnType";
import { ThisArgData } from "../typings";
import { Environment } from "../typings";
import { FunctionExecutor } from "../typings";
import { InterpreterReturnType } from "../util/constants/enums/InterpreterReturnType";
import { Return } from "./Return";
export declare class ThisArg {
    data: ThisArgData;
    environment: Environment;
    keywords: Record<string, string>;
    constructor(data: ThisArgData);
    getKeyword(name: string): string;
    setEnvironmentValue(key: string, value: unknown): this;
    getEnvironmentValue(...args: string[]): string;
    get container(): import("./Container").Container;
    get reference(): import("../typings").InterpreterData<InterpreterReturnType>;
    embed(index: number): EmbedBuilder;
    ok(data?: Parameters<typeof Return["success"]>[0]): Return<RT.Success, unknown>;
    handleError(res: Return): Promise<null>;
    get bot(): import("../core").AoiClient<unknown>;
    get context(): import("./Context").Context<unknown>;
    get command(): import("./Command").Command<import("../typings").CommandTypes>;
    get<T extends keyof ThisArgData>(key: T): ThisArgData[T];
    manage<T = unknown>(r: Return<RT, unknown>, cb: (s: T) => ReturnType<FunctionExecutor>): Promise<Return<RT, unknown>>;
    setReply(type: ReplyType): this;
    mustReturn(r: Return): boolean;
    mustReturnPlusBreak(r: Return): boolean;
}
//# sourceMappingURL=ThisArg.d.ts.map