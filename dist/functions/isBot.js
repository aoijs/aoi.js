"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$isBot',
    description: 'checks whether an user is a bot.',
    returns: 'BOOLEAN',
    optional: true,
    nullable: true,
    fields: [
        {
            name: 'userID',
            description: 'the user to check for.',
            type: 'USER',
            required: true
        }
    ],
    brackets: true,
    execute: async function (fn) {
        if (fn.hasFields()) {
            return this.manage(await fn.resolveArray(this), async (s) => {
                return Return_1.Return.string(s[0].bot);
            });
        }
        return Return_1.Return.string(this.context.getUser()?.bot);
    }
});
//# sourceMappingURL=isBot.js.map