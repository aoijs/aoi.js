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
    name: '$guildID',
    description: 'returns the current guild ID or the ID of given guild name.',
    brackets: true,
    optional: true,
    returns: 'STRING',
    nullable: true,
    fields: [
        {
            name: 'guild name',
            description: 'the guild name to get its ID',
            type: 'STRING',
            required: true,
            rest: true
        }
    ],
    execute: async function (fn) {
        if (fn.hasFields()) {
            return this.manage(await fn.resolveArray(this), async (s) => {
                const name = s.join(';');
                const g = this.bot.client.guilds.cache.find(c => c.name === name);
                if (!g) {
                    return (0, createRuntimeError_1.default)(this, fn, RuntimeErrorType_1.RuntimeErrorType.INVALID_DATA, "name", name);
                }
                return Return_1.Return.string(g.id);
            });
        }
        return Return_1.Return.string(this.context.getGuild()?.id);
    }
});
//# sourceMappingURL=guildID.js.map