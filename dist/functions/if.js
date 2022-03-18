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
    name: '$if',
    description: 'Checks whether a condition is met and runs a code, else runs other code.',
    brackets: true,
    fields: [
        {
            name: 'condition',
            description: 'condition to test against.',
            type: 'STRING',
            required: true
        },
        {
            name: 'when true',
            description: 'code to run when condition is met.',
            type: 'STRING',
            required: true
        },
        {
            name: 'when false',
            description: 'code to run when condition failed.',
            type: 'STRING',
            required: false
        }
    ],
    execute: async function (fn) {
        const field = fn.getConditionField(0);
        const got = await fn.resolveConditionField(this, field);
        if (got instanceof Return_1.Return)
            return got;
        if (got === null) {
            return (0, createRuntimeError_1.default)(this, fn, RuntimeErrorType_1.RuntimeErrorType.UNKNOWN_OPERATOR, field.value ?? '');
        }
        const whenTrue = fn.field(1);
        const whenFalse = fn.field(2);
        if (!got) {
            return fn.resolveField(this, whenFalse);
        }
        const res = await fn.resolveField(this, whenTrue);
        return res;
    }
});
//# sourceMappingURL=if.js.map