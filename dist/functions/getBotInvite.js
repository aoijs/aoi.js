"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const discord_js_1 = require("discord.js");
exports.default = (0, createNativeFunction_1.default)({
    name: '$getBotInvite',
    description: 'Generate the Client Invite.',
    returns: 'STRING',
    optional: true,
    brackets: true,
    fields: [
        {
            name: 'permissions',
            description: 'add permissions to the invite',
            type: 'STRING',
            required: false
        }
    ],
    execute: async function (fn) {
        return structures_1.Return.string(this.bot.client.generateInvite({
            permissions: [
                discord_js_1.PermissionFlagsBits.SendMessages,
                discord_js_1.PermissionFlagsBits.ManageGuild,
                discord_js_1.PermissionFlagsBits.MentionEveryone,
            ],
            scopes: [discord_js_1.OAuth2Scopes.Bot],
        }));
    }
});
//# sourceMappingURL=getBotInvite.js.map