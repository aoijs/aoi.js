"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const Return_1 = require("../structures/Return");
exports.default = (0, createNativeFunction_1.default)({
    name: '$isNumber',
    description: 'validates given output as number.',
    returns: 'BOOLEAN',
    brackets: true,
    fields: [
        {
            name: 'value',
            description: 'value to check if it is a number.',
            type: 'STRING',
            required: true
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), ([text]) => {
            if (!text)
                return Return_1.Return.string(false);
            const n = Number(text);
            return Return_1.Return.string(n !== n ? false : true);
        });
    }
});
//# sourceMappingURL=isNumber.js.map