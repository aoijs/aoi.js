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
    name: '$while',
    description: 'executes a code while a condition is true.',
    brackets: true,
    fields: [
        {
            name: 'condition',
            type: 'STRING',
            description: 'the condition to evaluate on every loop.',
            required: true
        },
        {
            name: 'code',
            description: 'the code to execute',
            required: true,
            type: 'STRING',
            rest: true
        }
    ],
    execute: async function (d) {
        const field = d.getConditionField(0);
        let next = await d.resolveConditionField(this, field);
        if (next instanceof Return_1.Return)
            return next;
        if (next === null) {
            return (0, createRuntimeError_1.default)(this, d, RuntimeErrorType_1.RuntimeErrorType.UNKNOWN_OPERATOR, field.value ?? '');
        }
        if (!next) {
            return this.ok();
        }
        for (;;) {
            next = await d.resolveConditionField(this, field);
            if (!next) {
                return this.ok();
            }
            const rt = await d.resolveArray(this, 1);
            if (this.mustReturn(rt)) {
                return rt;
            }
            if (rt.isBreakStatement()) {
                break;
            }
        }
        return this.ok();
    }
});
//# sourceMappingURL=while.js.map