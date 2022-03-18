"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const toPlural_1 = require("../util/functions/toPlural");
exports.default = (0, createNativeFunction_1.default)({
    name: '$toPluralAmount',
    returns: 'STRING',
    description: 'returns plural or singular depending on amount provided (and the amount is appended).',
    brackets: true,
    fields: [
        {
            name: 'word',
            description: 'the word to use for singular form',
            type: 'STRING',
            required: true
        },
        {
            name: 'amount',
            description: 'the amount to check against',
            type: 'NUMBER',
            required: true
        },
        {
            name: 'plural form',
            description: 'plural form to use if amount is >1, else it just adds `s` at the end of the singular form.',
            type: 'STRING'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), ([text, amount, replace]) => {
            return this.ok((0, toPlural_1.toPluralAmount)(text, amount, replace ?? undefined));
        });
    }
});
//# sourceMappingURL=toPluralAmount.js.map