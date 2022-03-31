"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$author',
    description: 'Add an embed author.',
    brackets: true,
    fields: [
        {
            name: 'index',
            description: 'the embed to add this field to',
            required: true,
            type: 'NUMBER'
        },
        {
            name: 'name',
            type: 'STRING',
            required: true,
            description: 'the author name'
        },
        {
            name: 'iconURL',
            type: 'STRING',
            description: 'the author iconURL'
        },
        {
            name: 'link',
            description: 'url to use for author',
            type: 'STRING'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async ([index, name, iconURL, url]) => {
            this.embed(index).setAuthor({
                name,
                url: url ?? undefined,
                iconURL: iconURL ?? undefined
            });
            return Return_1.Return.string();
        });
    }
});
//# sourceMappingURL=author.js.map