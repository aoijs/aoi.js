"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$title',
    description: 'Add an embed title.',
    brackets: true,
    fields: [
        {
            name: 'index',
            description: 'the embed to add this title to',
            required: true,
            type: 'NUMBER'
        },
        {
            name: 'text',
            rest: true,
            type: 'STRING',
            description: 'the title to add'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async ([index, ...data]) => {
            this.embed(index).setTitle(data.join(';'));
            return Return_1.Return.string();
        });
    }
});
//# sourceMappingURL=title.js.map