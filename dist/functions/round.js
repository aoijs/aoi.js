"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$round',
    description: 'rounds a number',
    fields: [
        {
            name: 'number',
            type: 'NUMBER',
            required: true,
            description: 'the number to round.'
        }
    ],
    returns: 'NUMBER',
    brackets: true,
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async (s) => {
            return Return_1.Return.string(Math.round(s[0]));
        });
    }
});
//# sourceMappingURL=round.js.map