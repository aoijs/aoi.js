"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$userTag',
    brackets: true,
    optional: true,
    fields: [
        {
            name: 'userID',
            description: 'the user to get it\'s user tag.',
            type: 'USER',
            required: true
        }
    ],
    description: 'Returns the user\'s tag.',
    returns: 'STRING',
    execute: async function (fn) {
        if (fn.hasFields()) {
            const r = await fn.resolveArray(this);
            return this.manage(r, (s) => {
                return Return_1.Return.string(s[0].tag);
            });
        }
        return Return_1.Return.string(this.context.getUser()?.tag);
    }
});
//# sourceMappingURL=userTag.js.map