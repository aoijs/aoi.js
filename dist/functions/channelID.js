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
    name: '$channelID',
    description: 'gets the current channel.',
    returns: 'STRING',
    nullable: true,
    fields: [
        {
            name: 'channel name',
            type: 'STRING',
            required: true,
            rest: true,
            description: 'the name of the channel to find it\'s ID.'
        }
    ],
    brackets: true,
    optional: true,
    execute: async function (fn) {
        if (fn.hasFields()) {
            return this.manage(await fn.resolveArray(this), async (s) => {
                const name = s.join(';');
                const c = this.bot.client.channels.cache.find(c => c.name === name);
                if (!c) {
                    return (0, createRuntimeError_1.default)(this, fn, RuntimeErrorType_1.RuntimeErrorType.INVALID_DATA, "name", name);
                }
                return Return_1.Return.string(c.id);
            });
        }
        return Return_1.Return.string(this.context.getMainChannel()?.id);
    }
});
//# sourceMappingURL=channelID.js.map