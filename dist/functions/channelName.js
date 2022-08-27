"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$channelName',
    description: 'Gets the current channel name.',
    returns: 'STRING',
    nullable: true,
    fields: [
        {
            name: 'guildID',
            type: 'CHANNEL',
            required: true,
            description: 'the channel ID to get its name.'
        }
    ],
    brackets: true,
    optional: true,
    execute: async function (fn) {
        if (fn.hasFields()) {
            return this.manage(await fn.resolveArray(this), async ([ch]) => {
                return structures_1.Return.string(ch.isDMBased() ? '' : ch.name);
            });
        }
        const ch = this.context.getMainChannel();
        return structures_1.Return.string(ch && !ch.isDMBased() ? ch.name : '');
    }
});
//# sourceMappingURL=channelName.js.map