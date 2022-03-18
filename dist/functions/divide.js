"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$divide',
    brackets: true,
    returns: 'NUMBER',
    fields: [
        {
            name: 'numbers',
            required: true,
            type: 'NUMBER',
            rest: true,
            description: 'the numbers to divide.'
        }
    ],
    description: 'divide given numbers into one.',
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async (output) => {
            return Return_1.Return.string(output.reduce((x, y) => x / y));
        });
    }
});
//# sourceMappingURL=divide.js.map