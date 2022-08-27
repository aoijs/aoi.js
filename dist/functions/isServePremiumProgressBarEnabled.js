"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$isServePremiumProgressBarEnabled',
    description: 'Returns if the server premium (boost) progress bar enabled or not of a guild.',
    returns: 'BOOLEAN',
    nullable: true,
    fields: [
        {
            name: 'guildID',
            type: 'GUILD',
            required: true,
            description: 'the guild ID to check its server premium (boost) progress bar.'
        }
    ],
    brackets: true,
    optional: true,
    execute: async function (fn) {
        if (fn.hasFields()) {
            return this.manage(await fn.resolveArray(this), async (s) => {
                return structures_1.Return.string(s[0].premiumProgressBarEnabled);
            });
        }
        return structures_1.Return.string(this.context.getGuild()?.premiumProgressBarEnabled);
    }
});
//# sourceMappingURL=isServePremiumProgressBarEnabled.js.map