"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$commandName',
    description: 'returns the slash command\'s name.',
    returns: 'STRING',
    nullable: true,
    execute: function () {
        return this.ok(this.context.getSlashCommand()?.commandName);
    }
});
//# sourceMappingURL=commandName.js.map