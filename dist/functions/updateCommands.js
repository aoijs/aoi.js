"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const RuntimeErrorType_1 = require("../typings/enums/RuntimeErrorType");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const createRuntimeError_1 = __importDefault(require("../util/functions/createRuntimeError"));
exports.default = (0, createNativeFunction_1.default)({
    name: `$updateCommands`,
    description: 'updates bot commands from handler',
    execute: async function (fn) {
        if (!this.bot.commands.directory) {
            return (0, createRuntimeError_1.default)(this, fn, RuntimeErrorType_1.RuntimeErrorType.OTHER, "command handler was not used");
        }
        return Return_1.Return.string(this.bot.commands.refresh());
    }
});
//# sourceMappingURL=updateCommands.js.map