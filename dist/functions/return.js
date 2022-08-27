"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const ReturnType_1 = require("../typings/enums/ReturnType");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$return',
    brackets: true,
    optional: true,
    description: 'Returns the code or data.',
    fields: [
        {
            name: 'data',
            rest: true,
            description: 'the data to return.',
            type: 'STRING'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async (s) => {
            return new Return_1.Return(ReturnType_1.ReturnType.ReturnKeyword, s.join(';'));
        });
    }
});
//# sourceMappingURL=return.js.map