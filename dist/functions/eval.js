"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const InterpreterReturnType_1 = require("../util/constants/enums/InterpreterReturnType");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const interpreter_1 = __importDefault(require("../util/functions/interpreter"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$eval',
    description: 'evals given code.',
    brackets: true,
    fields: [
        {
            name: 'return output',
            description: 'whether to return the output.',
            type: 'BOOLEAN',
            required: true
        },
        {
            name: 'code',
            type: 'STRING',
            required: true,
            rest: true,
            description: 'The code to eval.'
        }
    ],
    returns: 'STRING',
    nullable: true,
    execute: async function (fn) {
        return await this.manage(await fn.resolveArray(this), async (s) => {
            const bool = s.shift();
            const code = s.join(';');
            try {
                const got = await (0, interpreter_1.default)({
                    ...this.reference,
                    command: this.bot.commands["create"](0, 'unknown', {
                        name: 'eval',
                        type: 'basicCommand',
                        code
                    }),
                    return: InterpreterReturnType_1.InterpreterReturnType.Container
                });
                if (got === null)
                    return Return_1.Return.error();
                got.copyTo(this.container);
                return Return_1.Return.string(got.data.content);
            }
            catch (error) {
                return Return_1.Return.error(error.message);
            }
        });
    }
});
//# sourceMappingURL=eval.js.map