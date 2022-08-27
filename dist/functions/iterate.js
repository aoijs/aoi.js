"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$iterate',
    description: 'iterate over given elements',
    brackets: true,
    fields: [
        {
            name: 'elements',
            description: 'the elements to loop.',
            required: true,
            type: 'STRING'
        },
        {
            name: 'separator',
            description: 'separator for each element.',
            required: true,
            type: 'STRING'
        },
        {
            name: 'code',
            rest: true,
            required: true,
            type: 'STRING',
            description: 'code to execute, environment variables: `value`'
        }
    ],
    returns: 'STRING',
    nullable: true,
    execute: async function (fn) {
        return this.manage(await fn.resolveField(this, fn.field(0)), async (elements) => {
            return this.manage(await fn.resolveField(this, fn.field(1)), async (separator) => {
                const iterator = elements.split(separator);
                const output = new Array();
                for (let i = 0, len = iterator.length; i < len; i++) {
                    const it = iterator[i];
                    this.setEnvironmentValue('value', it);
                    const execution = await fn.resolveArray(this, 2);
                    if (execution.isAnythingButSuccessOrReturn()) {
                        return execution;
                    }
                    if (execution.isReturnKeyword()) {
                        output.push(execution.unwrapAs());
                    }
                }
                return this.ok(output.join(separator));
            });
        });
    }
});
//# sourceMappingURL=iterate.js.map