"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$let',
    description: 'creates a local variable',
    brackets: true,
    fields: [
        {
            name: 'name',
            description: 'the name of the variable',
            type: 'STRING',
            required: true
        },
        {
            name: 'value',
            description: 'the value of the variable',
            type: 'STRING',
            required: true
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async (s) => {
            this.keywords[s[0]] = s[1];
            return Return_1.Return.string();
        });
    }
});
//# sourceMappingURL=let.js.map