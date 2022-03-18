"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const RuntimeErrorType_1 = require("../typings/enums/RuntimeErrorType");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const createRuntimeError_1 = __importDefault(require("../util/functions/createRuntimeError"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$get',
    description: 'gets a local variable value.',
    brackets: true,
    fields: [
        {
            name: 'name',
            description: 'the name of the variable',
            type: 'STRING',
            required: true
        }
    ],
    returns: 'STRING',
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async (s) => {
            const value = this.keywords[s[0]];
            if (value === undefined) {
                return (0, createRuntimeError_1.default)(this, fn, RuntimeErrorType_1.RuntimeErrorType.INVALID_DATA, 'variable name', s[0]);
            }
            return Return_1.Return.string(value);
        });
    }
});
//# sourceMappingURL=get.js.map