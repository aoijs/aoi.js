"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InterpreterReturnType_1 = require("../util/constants/enums/InterpreterReturnType");
const interpreter_1 = __importDefault(require("../util/functions/interpreter"));
const iterate_1 = __importDefault(require("../util/functions/iterate"));
async function default_1(btn) {
    const commands = this.commands.get("interactionCommand")?.filter(c => c.data.interactionType === 'button');
    if (!commands?.size)
        return;
    (0, iterate_1.default)(commands.values(), (command) => {
        (0, interpreter_1.default)({
            context: btn,
            channel: btn,
            return: InterpreterReturnType_1.InterpreterReturnType.None,
            command,
            args: [],
            bot: this
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=buttonCommands.js.map