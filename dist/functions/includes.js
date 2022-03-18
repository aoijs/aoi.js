"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$includes',
    description: 'checks whether a string contains another.',
    brackets: true,
    returns: 'BOOLEAN',
    fields: [
        {
            name: 'text',
            description: 'main text to compare against',
            type: 'STRING',
            required: true
        },
        {
            name: 'other',
            description: 'other text to use',
            type: 'STRING',
            required: true
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), ([s1, s2]) => {
            return Return_1.Return.string(s1.includes(s2));
        });
    }
});
//# sourceMappingURL=includes.js.map