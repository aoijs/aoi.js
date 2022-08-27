"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    returns: 'BOOLEAN',
    brackets: true,
    name: '$endsWith',
    description: 'checks wether a string ends with another.',
    fields: [
        {
            name: 'text',
            description: 'the text to check for',
            type: 'STRING',
            required: true
        },
        {
            name: 'other text',
            description: 'text to match',
            type: 'STRING',
            required: true
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), ([t1, t2]) => {
            return this.ok(t1.endsWith(t2));
        });
    }
});
//# sourceMappingURL=endsWith.js.map