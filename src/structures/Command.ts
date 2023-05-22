import { CommandOptions } from "../typings/interfaces.js";
import { AsyncFunction, CommandTypes } from "../typings/types.js";
import { Transpiler } from "../core/transpiler.js";
import { AoiClient } from "./AoiClient.js";
export class Command {
    name: string;
    type: CommandTypes;
    code: string | AsyncFunction;
    aliases?: string[];
    __path__: string;
    reverseRead?: boolean;
    executeAt?: "guild" | "dm" | "both";
    __compiled__: AsyncFunction;
    [key: string]: unknown;
    constructor(data: CommandOptions, client: AoiClient) {
        this.name = data.name;
        this.type = data.type;
        this.code = data.code;
        this.aliases = data.aliases;
        this.__path__ = data.__path__;
        this.executeAt = data.executeAt ?? "both";
        this.reverseRead = data.reverseRead ?? false;

        for(const key in data) {
            if(!["name", "type", "code", "aliases", "__path__", "executeAt", "reverseRead"].includes(key)) this[key] = data[key];
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (this.code instanceof Function) this.__compiled__ = this.code;
        else {
            const func = Transpiler(this.code, {
                sendMessage: true,
                minify: true,
                reverse: this.reverseRead,
                customFunctions: client.managers.functions.functions.toJSON(),
            });

            this.__compiled__ = func.func;
        }
    }
}
