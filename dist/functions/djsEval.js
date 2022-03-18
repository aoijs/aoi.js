"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$djsEval',
    description: 'Evals a javascript code.',
    fields: [
        {
            name: 'return output',
            description: 'whether to return the output of the code.',
            type: 'BOOLEAN',
            required: true
        },
        {
            name: 'code',
            rest: true,
            type: 'STRING',
            required: true,
            description: 'the code to eval.'
        }
    ],
    brackets: true,
    returns: 'STRING',
    nullable: true,
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async (s) => {
            const output = s.shift();
            const code = s.join(';');
            try {
                var evaled = await eval(code);
            }
            catch (error) {
                return Return_1.Return.error(error.stack);
            }
            return Return_1.Return.string(output ? evaled : undefined);
        });
    }
});
//# sourceMappingURL=djsEval.js.map