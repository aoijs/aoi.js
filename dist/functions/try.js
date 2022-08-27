"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$try',
    description: 'wraps a code in an error handler.',
    brackets: true,
    fields: [
        {
            name: 'code',
            description: 'code to execute, any error here is handled.',
            type: 'STRING',
            required: true
        },
        {
            name: 'catch code',
            description: 'code to execute when an error is thrown, enviroment variables: `error`',
            type: 'STRING'
        },
        {
            name: 'finally code',
            description: 'code to execute after code is executed',
            type: 'STRING'
        }
    ],
    execute: async function (fn) {
        const code = await fn.resolveField(this, fn.field(0));
        if (code.isErrorStatement())
            return code;
        if (code.isError()) {
            this.setEnvironmentValue('error', code.unwrap());
            return await this.manage(await fn.resolveArray(this, 1), s => this.ok());
        }
        else {
            if (!code.isSuccess())
                return code;
            return await this.manage(await fn.resolveArray(this, 2), s => this.ok());
        }
    }
});
//# sourceMappingURL=try.js.map