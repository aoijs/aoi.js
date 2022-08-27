"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$_function',
    description: 'Executes a code block and returns given data used in $return, this function is experimental.',
    nullable: true,
    returns: 'STRING',
    examples: [
        `$_function[
    You put random code here, it will not be sent as output
    $return[$username]
]`
    ],
    fields: [
        {
            name: 'code',
            description: 'the code to run.',
            type: 'STRING',
            rest: true,
            required: true
        }
    ],
    brackets: true,
    execute: async function (fn) {
        const got = await fn.resolveArray(this);
        if (got.isAnyError()) {
            return got;
        }
        if (got.isReturnKeyword()) {
            return Return_1.Return.string(got.unwrap());
        }
        return Return_1.Return.string();
    }
});
//# sourceMappingURL=_function.js.map