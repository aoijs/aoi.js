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
    name: '$checkCondition',
    description: 'Checks whether a condition is met, returns true or false.',
    brackets: true,
    returns: 'BOOLEAN',
    fields: [
        {
            name: 'condition',
            description: 'condition to test against.',
            type: 'STRING',
            required: true
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
        return this.ok(got);
    }
});
//# sourceMappingURL=checkCondition.js.map