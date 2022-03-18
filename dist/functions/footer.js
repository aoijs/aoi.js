"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$footer',
    description: 'Add an embed footer.',
    brackets: true,
    fields: [
        {
            name: 'index',
            description: 'the embed to add this field to',
            required: true,
            type: 'NUMBER'
        },
        {
            name: 'text',
            type: 'STRING',
            required: true,
            description: 'the footer text'
        },
        {
            name: 'iconURL',
            type: 'STRING',
            required: false,
            description: 'the footer iconURL'
        },
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async ([index, text, iconURL]) => {
            this.embed(index).setFooter({
                text,
                iconURL
            });
            return Return_1.Return.string();
        });
    }
});
//# sourceMappingURL=footer.js.map