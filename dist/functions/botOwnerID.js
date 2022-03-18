"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$botOwnerID',
    description: 'retrieves the owners of this bot.',
    returns: 'STRING',
    brackets: true,
    optional: true,
    fields: [
        {
            name: 'separator',
            description: 'separator for each ID',
            required: true,
            default: () => ', ',
            type: 'STRING'
        }
    ],
    execute: async function (fn) {
        if (fn.hasFields()) {
            return this.manage(await fn.resolveArray(this), async (s) => {
                const sep = s[0];
                const app = await this.bot.client.application.fetch();
                return Return_1.Return.string(app.owner === null ? '' : app.owner instanceof discord_js_1.User ? app.owner.id : app.owner.members.map(c => c.id).join(sep));
            });
        }
        const app = await this.bot.client.application.fetch();
        return Return_1.Return.string(app.owner === null ? '' : app.owner instanceof discord_js_1.User ? app.owner.id : app.owner.members.map(c => c.id).join(', '));
    }
});
//# sourceMappingURL=botOwnerID.js.map