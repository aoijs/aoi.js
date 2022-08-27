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
    name: '$and',
    description: 'Checks whether all conditions are met, returns true or false.',
    brackets: true,
    returns: 'BOOLEAN',
    fields: [
        {
            name: 'conditions',
            description: 'conditions to test against.',
            type: 'STRING',
            required: true,
            rest: true
        }
    ],
    execute: async function (fn) {
        for (let i = 0, len = fn.fields.length; i < len; i++) {
            const field = fn.getConditionField(i);
            const exec = await fn.resolveConditionField(this, field);
            if (exec === null) {
                return (0, createRuntimeError_1.default)(this, fn, RuntimeErrorType_1.RuntimeErrorType.UNKNOWN_OPERATOR, field.value ?? '');
            }
            if (exec instanceof Return_1.Return)
                return exec;
            if (!exec)
                return this.ok(false);
        }
        return this.ok(true);
    }
});
//# sourceMappingURL=and.js.map