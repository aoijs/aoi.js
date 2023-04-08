import { CommandOptions } from "../typings/interfaces.js";
import { AsyncFunction, CommandTypes } from "../typings/types.js";
import { Transpiler } from "../core/transpiler.js";
export class Command
{
    name: string;
    type: CommandTypes;
    code: string;
    aliases?: string[];
    __path__: string;
    reverseRead?: boolean;
    executeAt?: "guild" | "dm" | "both";
    __compiled__: AsyncFunction;
    constructor ( data: CommandOptions )
    {
        this.name = data.name;
        this.type = data.type;
        this.code = data.code;
        this.aliases = data.aliases;
        this.__path__ = data.__path__;
        this.executeAt = data.executeAt ?? "both";
        this.reverseRead = data.reverseRead ?? false;

        const func = Transpiler( this.code, {
            sendMessage: true,
            minify: true,
            reverse: this.reverseRead,
        } );

        this.__compiled__  = func.func;
    }
}