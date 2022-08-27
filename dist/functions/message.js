"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$message',
    description: 'gets the user\'s arguments used.',
    brackets: true,
    optional: true,
    returns: 'STRING',
    nullable: true,
    fields: [
        {
            name: 'index',
            description: 'the index of the argument.',
            type: 'NUMBER'
        }
    ],
    execute: async function (fn) {
        if (fn.hasFields()) {
            return this.manage(await fn.resolveArray(this), (cb) => {
                return Return_1.Return.string(this.data.args[cb[0] - 1]);
            });
        }
        return Return_1.Return.string(this.data.args.join(' '));
    }
});
//# sourceMappingURL=message.js.map