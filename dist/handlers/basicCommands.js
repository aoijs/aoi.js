"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InterpreterReturnType_1 = require("../util/constants/enums/InterpreterReturnType");
const interpreter_1 = __importDefault(require("../util/functions/interpreter"));
const iterate_1 = __importDefault(require("../util/functions/iterate"));
async function default_1(message) {
    const prefix = this.prefixes.find(c => message.content.startsWith(c));
    if (!prefix)
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();
    if (!cmd)
        return;
    const commands = this.commands.get("basicCommand")?.filter((c) => c.data.name === cmd || (c.data.aliases ? c.data.aliases.includes(cmd) : false));
    if (!commands?.size)
        return;
    (0, iterate_1.default)(commands.values(), (command) => {
        (0, interpreter_1.default)({
            context: message,
            channel: message.channel,
            return: InterpreterReturnType_1.InterpreterReturnType.None,
            command,
            args,
            bot: this
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=basicCommands.js.map